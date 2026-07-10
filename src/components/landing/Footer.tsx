import { Instagram, Twitter, Youtube, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-card/40">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.03em]">
              Join the <span className="italic font-light text-primary">movement.</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Early access to drops, training stories, and exclusive members-only releases.
            </p>
            <form className="mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-background/40 p-1.5 backdrop-blur">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
              />
              <button className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:scale-[1.02]">
                Join <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FCol title="Shop" items={["Men", "Women", "New Arrivals", "Sale"]} />
            <FCol title="Help" items={["Shipping", "Returns", "Size Guide", "Contact"]} />
            <FCol title="Company" items={["About", "Athletes", "Sustainability", "Press"]} />
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-black">
              A
            </span>
            © 2026 AuraSport. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            {[Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-foreground/70 transition hover:border-primary hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="select-none text-center text-[clamp(5rem,22vw,18rem)] font-black leading-[0.85] tracking-[-0.05em] text-foreground/[0.04]">
          AURASPORT
        </div>
      </div>
    </footer>
  );
}

function FCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{title}</div>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i}>
            <a href="#" className="text-sm text-muted-foreground transition hover:text-foreground">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}