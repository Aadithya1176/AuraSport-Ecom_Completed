import { createFileRoute, Link } from "@tanstack/react-router";

import { Navbar } from "@/components/landing/Navbar";

export const Route = createFileRoute("/admin/catalog")({
  component: AdminCatalogPage,
  head: () => ({
    meta: [
      { title: "Admin Catalog | AuraSport" },
      { name: "description", content: "Admin catalog tooling for AuraSport." },
    ],
  }),
});

function AdminCatalogPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">
        <div className="rounded-[2rem] border border-white/10 bg-card/70 p-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Admin</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">Catalog tools not wired yet.</h1>
          <p className="mt-4 text-muted-foreground">
            The current FastAPI backend exposes protected product and category CRUD, but this
            frontend admin screen still needs a dedicated admin authorization model and image upload
            flow before it can be safely enabled.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
          >
            Back to shop
          </Link>
        </div>
      </main>
    </div>
  );
}
