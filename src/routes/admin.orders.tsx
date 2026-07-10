import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, getImageUrl, type Order, type OrderStatus } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

const statuses: OrderStatus[] = [
  "pending",
  "contacted",
  "confirmed",
  "packed",
  "shipped",
  "completed",
  "cancelled",
];

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
  head: () => ({
    meta: [
      { title: "Admin Orders | AuraSport" },
      { name: "description", content: "Review and update AuraSport order requests." },
    ],
  }),
});

function AdminOrdersPage() {
  const navigate = useNavigate();
  const { token, user, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [savingOrderId, setSavingOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/admin/orders" } });
      return;
    }
    if (user?.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/" });
      return;
    }

    async function load() {
      try {
        const data = await apiRequest<Order[]>("/admin/orders", { token });
        setOrders(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load admin orders");
      } finally {
        setPageLoading(false);
      }
    }

    void load();
  }, [loading, navigate, token, user]);

  async function updateOrder(order: Order, status: OrderStatus, adminNotes: string | null) {
    if (!token) {
      return;
    }

    try {
      setSavingOrderId(order.id);
      const updated = await apiRequest<Order>(`/admin/orders/${order.id}`, {
        method: "PATCH",
        token,
        body: {
          status,
          admin_notes: adminNotes,
        },
      });
      setOrders((current) => current.map((item) => (item.id === order.id ? updated : item)));
      toast.success(`Request #${order.id} updated`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update order");
    } finally {
      setSavingOrderId(null);
    }
  }

  if (loading || pageLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Admin</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Order request management.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Review incoming requests, update their status, and keep manual follow-up notes in one place.
            </p>
          </div>
          <Link
            to="/admin/catalog"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Manage catalog
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">No order requests yet.</h2>
            <p className="mt-2 text-muted-foreground">Requests will appear here as customers submit them.</p>
          </div>
        ) : (
          <section className="mt-10 space-y-6">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                      Request #{order.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold">{order.customer_name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.phone_number} · {order.contact_preference} · ${order.total_price.toFixed(2)}
                    </p>
                  </div>
                  <div className="min-w-56 space-y-3">
                    <label className="block space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        Status
                      </span>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          void updateOrder(order, event.target.value as OrderStatus, order.admin_notes)
                        }
                        disabled={savingOrderId === order.id}
                        className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none"
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="rounded-[1.5rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground">
                    <div className="font-semibold text-foreground">Delivery details</div>
                    <div className="mt-2">
                      {order.address_line}, {order.city}, {order.state} - {order.postal_code}
                    </div>
                    {order.notes ? <div className="mt-3">Customer note: {order.notes}</div> : null}
                  </div>
                  <AdminNotesCard
                    order={order}
                    saving={savingOrderId === order.id}
                    onSave={(notes) => void updateOrder(order, order.status as OrderStatus, notes)}
                  />
                </div>

                <div className="mt-6 grid gap-4">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="grid items-center gap-4 rounded-[1.5rem] border border-white/10 bg-background/40 p-4 md:grid-cols-[84px_1fr_auto]"
                    >
                      <img
                        src={getImageUrl(item.product.image_url)}
                        alt={item.product.name}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                      <div>
                        <div className="text-lg font-semibold">{item.product.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Qty {item.quantity} x ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function AdminNotesCard({
  order,
  saving,
  onSave,
}: {
  order: Order;
  saving: boolean;
  onSave: (notes: string | null) => void;
}) {
  const [notes, setNotes] = useState(order.admin_notes ?? "");

  useEffect(() => {
    setNotes(order.admin_notes ?? "");
  }, [order.admin_notes]);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-background/30 p-4">
      <div className="text-sm font-semibold">Admin notes</div>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Add follow-up details, call notes, delivery notes, or stock remarks"
        className="mt-3 min-h-28 w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
      />
      <button
        onClick={() => onSave(notes.trim() ? notes.trim() : null)}
        disabled={saving}
        className="mt-3 inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save notes"}
      </button>
    </div>
  );
}
