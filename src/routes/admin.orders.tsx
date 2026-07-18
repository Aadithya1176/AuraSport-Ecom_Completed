import { createFileRoute, Link } from "@tanstack/react-router";

import { Navbar } from "@/components/landing/Navbar";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
  head: () => ({
    meta: [
      { title: "Admin Orders | AuraSport" },
      { name: "description", content: "Admin order tooling for AuraSport." },
    ],
  }),
});

function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <div className="rounded-[2rem] border border-white/10 bg-card/70 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Admin</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">Admin order tools not wired yet.</h1>
          <p className="mt-4 text-muted-foreground">
            The current backend supports customer order history and checkout. Admin-only order
            review and status management would need separate endpoints and authorization rules
            before this screen can talk to the API.
          </p>
          <Link
            to="/orders"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
          >
            View customer orders
          </Link>
        </div>
      </main>
    </div>
  );
}
