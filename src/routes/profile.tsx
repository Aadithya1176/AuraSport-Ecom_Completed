import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";

import { Navbar } from "@/components/landing/Navbar";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile | AuraSport" },
      { name: "description", content: "View your AuraSport account details from the FastAPI backend." },
    ],
  }),
});

function ProfilePage() {
  const { token, user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Profile</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Account details.</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              This page reflects the user model currently available in the FastAPI backend.
            </p>
          </div>
          <Link
            to="/orders"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            View orders
          </Link>
        </div>

        {!token || !user ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">You need to sign in first.</h2>
            <p className="mt-2 text-muted-foreground">Your account details are only visible after login.</p>
            <Link
              to="/auth"
              search={{ mode: "signin", redirect: "/profile" }}
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <section className="mt-10 rounded-[2rem] border border-white/10 bg-card/70 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <AccountField label="Name" value={user.name} />
              <AccountField label="Email" value={user.email} />
              <AccountField label="User ID" value={String(user.id)} />
              <AccountField label="Created" value={format(new Date(user.created_at), "PPP p")} />
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground">
              Profile editing is not part of the current backend scope yet. When a dedicated user
              update endpoint is added, this page can be expanded to support editable checkout
              preferences and addresses.
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function AccountField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-background/40 p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}
