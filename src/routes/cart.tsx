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
      {
        name: "description",
        content: "Review your AuraSport cart and place a manual order request through the backend.",
      },
    ],
  }),
});

type RequestFormState = {
  customer_name: string;
  phone_number: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  contact_preference: "whatsapp" | "call" | "email";
  notes: string;
};

const initialFormState: RequestFormState = {
  customer_name: "",
  phone_number: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
  contact_preference: "whatsapp",
  notes: "",
};

function CartPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [form, setForm] = useState<RequestFormState>(initialFormState);

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

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm((current) => ({
      ...current,
      customer_name: current.customer_name || user.full_name || "",
      phone_number: current.phone_number || user.phone_number || "",
      address_line: current.address_line || user.address_line || "",
      city: current.city || user.city || "",
      state: current.state || user.state || "",
      postal_code: current.postal_code || user.postal_code || "",
      contact_preference: user.preferred_contact || current.contact_preference || "whatsapp",
    }));
  }, [user]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [items],
  );

  function updateForm<K extends keyof RequestFormState>(key: K, value: RequestFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

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

  async function submitOrderRequest() {
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/cart" } });
      return;
    }

    const missingField = Object.entries(form).find(([key, value]) => {
      if (key === "notes") {
        return false;
      }
      return String(value).trim().length === 0;
    });

    if (missingField) {
      toast.error("Please fill in all contact and address details");
      return;
    }

    try {
      setRequestLoading(true);
      const order = await apiRequest<Order>("/orders/request", {
        method: "POST",
        token,
        body: {
          ...form,
          notes: form.notes.trim() ? form.notes.trim() : null,
        },
      });
      setItems([]);
      setForm(initialFormState);
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success(`Request #${order.id} submitted`);
      navigate({ to: "/orders" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place order request");
    } finally {
      setRequestLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Cart</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Your order request.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              {user
                ? `Signed in as ${user.email}. Review your items, add your contact details, and send a request.`
                : "Sign in to manage your cart and send an order request."}
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
            description="Sign in, then you can send your cart as an order request."
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
            description="Add products from the live catalog before sending an order request."
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

            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
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
                  <span>Request total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  No payment happens here. Once you submit the request, AuraSport can contact you to confirm details.
                </p>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Contact Details</p>
                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground">
                  Save these details once in your{" "}
                  <Link to="/profile" className="font-semibold text-foreground underline underline-offset-4">
                    profile
                  </Link>{" "}
                  and they will autofill here next time.
                </div>
                <div className="mt-6 grid gap-4">
                  <FormField
                    label="Full name"
                    value={form.customer_name}
                    onChange={(value) => updateForm("customer_name", value)}
                    placeholder="Aadithya Raj"
                  />
                  <FormField
                    label="Phone number"
                    value={form.phone_number}
                    onChange={(value) => updateForm("phone_number", value)}
                    placeholder="9876543210"
                  />
                  <FormField
                    label="Address"
                    value={form.address_line}
                    onChange={(value) => updateForm("address_line", value)}
                    placeholder="12 Lake View Road"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      label="City"
                      value={form.city}
                      onChange={(value) => updateForm("city", value)}
                      placeholder="Chennai"
                    />
                    <FormField
                      label="State"
                      value={form.state}
                      onChange={(value) => updateForm("state", value)}
                      placeholder="Tamil Nadu"
                    />
                  </div>
                  <FormField
                    label="Postal code"
                    value={form.postal_code}
                    onChange={(value) => updateForm("postal_code", value)}
                    placeholder="600001"
                  />
                  <label className="space-y-2">
                    <span className="text-sm font-medium">Preferred contact method</span>
                    <select
                      value={form.contact_preference}
                      onChange={(event) =>
                        updateForm(
                          "contact_preference",
                          event.target.value as RequestFormState["contact_preference"],
                        )
                      }
                      className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none"
                    >
                      <option value="whatsapp">WhatsApp</option>
                      <option value="call">Call</option>
                      <option value="email">Email</option>
                    </select>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-medium">Notes</span>
                    <textarea
                      value={form.notes}
                      onChange={(event) => updateForm("notes", event.target.value)}
                      placeholder="Preferred delivery time, sizing note, or anything we should know"
                      className="min-h-28 w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </label>
                  <button
                    onClick={() => void submitOrderRequest()}
                    disabled={requestLoading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                  >
                    {requestLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Place order request"
                    )}
                  </button>
                </div>
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

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}
