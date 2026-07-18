import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { type ReactNode } from "react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, type Cart, getImageUrl, type Order } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Cart | AuraSport" },
      {
        name: "description",
        content: "Review your AuraSport cart and complete checkout through the FastAPI backend.",
      },
    ],
  }),
});

function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();

  const cartQuery = useQuery({
    queryKey: ["cart", token],
    queryFn: () => apiRequest<Cart>("/cart", { token }),
    enabled: Boolean(token),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      apiRequest<Cart>(`/cart/items/${itemId}`, {
        method: "PUT",
        token,
        body: { quantity },
      }),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", token], updatedCart);
      window.dispatchEvent(new Event("aurasport-cart-updated"));
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not update cart");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) =>
      apiRequest<Cart>(`/cart/items/${itemId}`, {
        method: "DELETE",
        token,
      }),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", token], updatedCart);
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Item removed");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not remove item");
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: () =>
      apiRequest<Order>("/orders/checkout", {
        method: "POST",
        token,
      }),
    onSuccess: async (order) => {
      await queryClient.invalidateQueries({ queryKey: ["cart", token] });
      await queryClient.invalidateQueries({ queryKey: ["orders", token] });
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success(`Order #${order.id} placed`);
      navigate({ to: "/orders" });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not complete checkout");
    },
  });

  const cart = cartQuery.data;
  const items = cart?.items ?? [];
  const busyItemId =
    updateItemMutation.variables?.itemId ?? removeItemMutation.variables ?? null;

  async function updateQty(cartItemId: number, quantity: number) {
    if (!token || quantity < 1) {
      return;
    }

    updateItemMutation.mutate({ itemId: cartItemId, quantity });
  }

  async function removeItem(cartItemId: number) {
    if (!token) {
      return;
    }

    removeItemMutation.mutate(cartItemId);
  }

  async function checkout() {
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/cart" } });
      return;
    }

    checkoutMutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Cart</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Ready for checkout.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {user
                ? `Signed in as ${user.email}. Review your items and convert the cart into an order.`
                : "Sign in to manage your cart and complete checkout."}
            </p>
          </div>
          <Link
            to="/shop"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Continue shopping
          </Link>
        </div>

        {!token ? (
          <EmptyState
            title="You need an account to use the cart."
            description="Sign in, then you can add products and check out."
            actionLabel="Sign in"
            actionTo="/auth"
          />
        ) : cartQuery.isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Your cart is empty."
            description="Add products from the live catalog before checking out."
            actionLabel="Shop now"
            actionTo="/shop"
          />
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-[2rem] border border-white/10 bg-card/60 p-4 md:grid-cols-[140px_1fr]"
                >
                  <img
                    src={getImageUrl(item.product.image_url)}
                    alt={item.product.name}
                    className="aspect-square h-full w-full rounded-[1.5rem] object-cover"
                  />
                  <div className="flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">{item.product.name}</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                          ${item.product.price.toFixed(2)} each
                        </p>
                      </div>
                      <button
                        onClick={() => void removeItem(item.id)}
                        disabled={busyItemId === item.id}
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:bg-white/5 disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center rounded-full border border-white/10 bg-background/70 p-1">
                        <QtyButton
                          onClick={() => void updateQty(item.id, item.quantity - 1)}
                          disabled={busyItemId === item.id || item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </QtyButton>
                        <span className="min-w-12 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <QtyButton
                          onClick={() => void updateQty(item.id, item.quantity + 1)}
                          disabled={busyItemId === item.id}
                        >
                          <Plus className="h-4 w-4" />
                        </QtyButton>
                      </div>
                      <div className="text-xl font-black">${item.line_total.toFixed(2)}</div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Summary</p>
                <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Distinct items</span>
                  <span>{items.length}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total units</span>
                  <span>{cart?.total_items ?? 0}</span>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-xl font-black">
                  <span>Order total</span>
                  <span>${(cart?.total_amount ?? 0).toFixed(2)}</span>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
                <div className="flex items-start gap-3 rounded-[1.5rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <p>
                    Checkout creates an order immediately using the current cart contents and
                    then clears the cart.
                  </p>
                </div>
                <button
                  onClick={() => void checkout()}
                  disabled={checkoutMutation.isPending}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {checkoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Checkout now"
                  )}
                </button>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: "/auth" | "/shop";
}) {
  return (
    <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <Link
        to={actionTo}
        className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
      >
        {actionLabel}
      </Link>
    </div>
  );
}

function QtyButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/5 disabled:opacity-40"
    >
      {children}
    </button>
  );
}
