import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, getImageUrl, type Order } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({
    meta: [
      { title: "Orders | AuraSport" },
      { name: "description", content: "Review order history from the AuraSport backend." },
    ],
  }),
});

function OrdersPage() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const data = await apiRequest<Order[]>("/orders", { token });
        setOrders(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load orders");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [token]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Orders</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Your order history.</h1>
            <p className="mt-4 text-muted-foreground">
              {user ? `Review every checkout placed by ${user.email}.` : "Sign in to view your order history."}
            </p>
          </div>
          <Link
            to="/shop"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Back to shop
          </Link>
        </div>

        {!token ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">You need to sign in first.</h2>
            <p className="mt-2 text-muted-foreground">Orders are private to each authenticated account.</p>
            <Link
              to="/auth"
              search={{ mode: "signin", redirect: "/orders" }}
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Sign in
            </Link>
          </div>
        ) : loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">No orders yet.</h2>
            <p className="mt-2 text-muted-foreground">Once you check out, your orders will appear here.</p>
          </div>
        ) : (
          <section className="mt-10 space-y-6">
            {orders.map((order) => (
              <article key={order.id} className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                      Order #{order.id}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold capitalize">{order.status}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-2xl font-black">${order.total_price.toFixed(2)}</div>
                  </div>
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
