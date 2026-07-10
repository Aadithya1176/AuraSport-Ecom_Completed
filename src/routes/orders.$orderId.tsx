import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, getImageUrl, type Order } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/orders/$orderId")({
  component: OrderDetailPage,
  head: () => ({
    meta: [
      { title: "Order Request | AuraSport" },
      { name: "description", content: "Review one AuraSport order request in full detail." },
    ],
  }),
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await apiRequest<Order>(`/orders/${orderId}`, { token });
        setOrder(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load order request");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [orderId, token]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Request Detail</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Request #{orderId}</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Review status, saved contact details, delivery destination, and every requested item in one place.
            </p>
          </div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to requests
          </Link>
        </div>

        {!token ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">You need to sign in first.</h2>
            <p className="mt-2 text-muted-foreground">Request details are only visible to the account owner.</p>
          </div>
        ) : loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !order ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">Request not found.</h2>
            <p className="mt-2 text-muted-foreground">It may have been removed or may belong to a different user.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="space-y-6">
              <section className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Status</p>
                <h2 className="mt-4 text-3xl font-black capitalize">{order.status}</h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Preferred contact: {order.contact_preference}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Phone: {order.phone_number}</p>
                <p className="mt-6 text-2xl font-black">${order.total_price.toFixed(2)}</p>
              </section>

              <section className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Delivery</p>
                <div className="mt-4 text-lg font-semibold">{order.customer_name}</div>
                <div className="mt-2 text-sm text-muted-foreground">
                  {order.address_line}
                  <br />
                  {order.city}, {order.state} - {order.postal_code}
                </div>
                {order.notes ? <p className="mt-4 text-sm text-muted-foreground">Your note: {order.notes}</p> : null}
                {order.admin_notes ? (
                  <p className="mt-4 rounded-2xl border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground">
                    AuraSport update: {order.admin_notes}
                  </p>
                ) : null}
              </section>
            </aside>

            <section className="space-y-4">
              {order.order_items.map((item) => (
                <article
                  key={item.id}
                  className="grid items-center gap-4 rounded-[2rem] border border-white/10 bg-card/60 p-4 md:grid-cols-[120px_1fr_auto]"
                >
                  <img
                    src={getImageUrl(item.product.image_url)}
                    alt={item.product.name}
                    className="aspect-square h-full w-full rounded-[1.5rem] object-cover"
                  />
                  <div>
                    <h3 className="text-2xl font-bold">{item.product.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Qty {item.quantity} x ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right text-xl font-black">
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
