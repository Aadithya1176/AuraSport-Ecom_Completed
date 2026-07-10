import { createFileRoute, Link } from "@tanstack/react-router";

import { Navbar } from "@/components/landing/Navbar";

const contactCards = [
  {
    title: "Order help",
    value: "support@aurasport.local",
    note: "Use your request number when contacting support for faster follow-up.",
  },
  {
    title: "Phone or WhatsApp",
    value: "+91 90000 00000",
    note: "Best for address corrections, confirmation questions, or urgent request updates.",
  },
  {
    title: "Working hours",
    value: "Mon-Sat, 10 AM to 7 PM",
    note: "Messages outside these hours can continue on the next working day.",
  },
];

export const Route = createFileRoute("/help")({
  component: HelpPage,
  head: () => ({
    meta: [
      { title: "Help | AuraSport" },
      { name: "description", content: "Get support for orders, contact details, and AuraSport request follow-up." },
    ],
  }),
});

function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Help</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Support for every order request.</h1>
          <p className="mt-4 text-muted-foreground">
            AuraSport currently works on a request-first flow. If you need an update, sizing help, or delivery change,
            this page gives you the clearest next step.
          </p>
        </div>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {contactCards.map((card) => (
            <article key={card.title} className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">{card.title}</p>
              <h2 className="mt-4 text-2xl font-bold">{card.value}</h2>
              <p className="mt-4 text-sm text-muted-foreground">{card.note}</p>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">How tracking works</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>Pending means AuraSport received your request.</p>
              <p>Contacted means the team has started follow-up.</p>
              <p>Confirmed means your request details were approved.</p>
              <p>Packed, Shipped, and Completed show the final fulfillment stages.</p>
              <p>Cancelled means that request is closed and should be placed again if still needed.</p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Best next actions</p>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <p>Need progress: open request history and use the request number when contacting support.</p>
              <p>Need to change address or phone: contact AuraSport before the request reaches shipped.</p>
              <p>Need another item: go back to the catalog and place a fresh request anytime.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/orders"
                className="rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90"
              >
                View requests
              </Link>
              <Link
                to="/shop"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
              >
                Continue shopping
              </Link>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
