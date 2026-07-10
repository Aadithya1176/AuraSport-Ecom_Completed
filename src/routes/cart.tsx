import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, type CartItem, getImageUrl, type Order } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({
    meta: [
      { title: "Cart | AuraSport" },
      { name: "description", content: "Manage your AuraSport cart and checkout through the FastAPI backend." },
    ],
  }),
});

function CartPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await apiRequest<CartItem[]>("/cart", { token });
        setItems(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load cart");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [token]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [items],
  );

  async function updateQty(cartItemId: number, qty: number) {
    if (!token || qty < 1) {
      return;
    }

    try {
      setBusyItemId(cartItemId);
      const updated = await apiRequest<CartItem>(`/cart/${cartItemId}`, {
        method: "PATCH",
        token,
        body: { qty },
      });
      setItems((current) => current.map((item) => (item.id === cartItemId ? updated : item)));
      window.dispatchEvent(new Event("aurasport-cart-updated"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update cart");
    } finally {
      setBusyItemId(null);
    }
  }

  async function removeItem(cartItemId: number) {
    if (!token) {
      return;
    }

    try {
      setBusyItemId(cartItemId);
      await apiRequest(`/cart/${cartItemId}`, {
        method: "DELETE",
        token,
      });
      setItems((current) => current.filter((item) => item.id !== cartItemId));
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Item removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove item");
    } finally {
      setBusyItemId(null);
    }
  }

  async function checkout() {
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/cart" } });
      return;
    }

    try {
      setCheckoutLoading(true);
      const order = await apiRequest<Order>("/orders/checkout", {
        method: "POST",
        token,
      });
      setItems([]);
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success(`Order #${order.id} created`);
      navigate({ to: "/orders" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Cart</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Your active checkout.</h1>
            <p className="mt-4 text-muted-foreground">
              {user ? `Signed in as ${user.email}` : "Sign in to manage your cart and place orders."}
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
            description="Sign in, then the cart and checkout flow will use the backend JWT session."
            actionLabel="Sign in"
            actionTo="/auth"
          />
        ) : loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Your cart is empty."
            description="Add products from the live catalog to start a checkout."
            actionLabel="Shop now"
            actionTo="/shop"
          />
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
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
                          onClick={() => void updateQty(item.id, item.qty - 1)}
                          disabled={busyItemId === item.id || item.qty <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </QtyButton>
                        <span className="min-w-12 text-center text-sm font-semibold">{item.qty}</span>
                        <QtyButton
                          onClick={() => void updateQty(item.id, item.qty + 1)}
                          disabled={busyItemId === item.id}
                        >
                          <Plus className="h-4 w-4" />
                        </QtyButton>
                      </div>
                      <div className="text-xl font-black">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-[2rem] border border-white/10 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Summary</p>
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>Items</span>
                <span>{items.length}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                <span>Units</span>
                <span>{items.reduce((sum, item) => sum + item.qty, 0)}</span>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-xl font-black">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => void checkout()}
                disabled={checkoutLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout"}
              </button>
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
