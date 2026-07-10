import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, Trophy } from "lucide-react";
import wcHero from "@/assets/wc-hero.jpg";
import wcBall from "@/assets/wc-ball.jpg";

const KICKOFF = new Date("2026-06-11T20:00:00Z").getTime();

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, KICKOFF - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const mins = Math.floor((diff / 60000) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

const hosts = [
  { code: "USA", city: "New York · LA · Dallas", flag: "🇺🇸" },
  { code: "CAN", city: "Toronto · Vancouver", flag: "🇨🇦" },
  { code: "MEX", city: "Mexico City · Guadalajara", flag: "🇲🇽" },
];

const kits = [
  { country: "Argentina", code: "ARG", color: "from-sky-400 to-sky-200", price: 129 },
  { country: "Brazil", code: "BRA", color: "from-yellow-400 to-emerald-500", price: 129 },
  { country: "France", code: "FRA", color: "from-blue-700 to-blue-400", price: 129 },
  { country: "England", code: "ENG", color: "from-white to-slate-300", price: 129 },
  { country: "Germany", code: "GER", color: "from-zinc-100 to-zinc-400", price: 129 },
  { country: "Spain", code: "ESP", color: "from-red-600 to-red-400", price: 129 },
];

export function WorldCup() {
  const { days, hours, mins, secs } = useCountdown();
  return (
    <section className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-12 bg-primary" /> Official Drop · World Cup 2026
            </div>
            <h2 className="mt-4 text-balance text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em]">
              The world plays in <span className="italic font-light text-primary">AuraSport.</span>
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-primary">
            <Trophy className="h-3.5 w-3.5" /> USA · CAN · MEX 2026
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Hero banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-card lg:col-span-7 min-h-[520px]"
          >
            <img
              src={wcHero}
              alt="World Cup 2026 athlete"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/20 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
                  Kickoff · June 11, 2026
                </span>
              </div>
              <div>
                <h3 className="text-balance text-[clamp(2rem,4.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight">
                  Every nation.<br />
                  <span className="text-primary">One pitch.</span>
                </h3>
                <p className="mt-3 max-w-md text-sm text-muted-foreground">
                  The official 2026 Federation Collection. Lightweight tech-knit, sweat-engineered, built for 48 teams across 3 nations.
                </p>
                <button className="group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:scale-[1.02] hover:shadow-[0_0_40px_-4px_rgba(212,255,0,0.6)]">
                  Shop Federation Kits
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right column: countdown + ball */}
          <div className="grid gap-6 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-card p-8"
            >
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Countdown to kickoff</div>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {[
                  { v: days, l: "Days" },
                  { v: hours, l: "Hrs" },
                  { v: mins, l: "Min" },
                  { v: secs, l: "Sec" },
                ].map((c) => (
                  <div key={c.l} className="rounded-2xl border border-white/10 bg-background/60 p-3 text-center">
                    <div className="font-mono text-2xl font-black tabular-nums tracking-tight md:text-3xl">
                      {String(c.v).padStart(2, "0")}
                    </div>
                    <div className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">{c.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t border-white/10 pt-5">
                {hosts.map((h) => (
                  <div key={h.code} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-3">
                      <span className="text-base">{h.flag}</span>
                      <span className="font-bold tracking-wider">{h.code}</span>
                    </span>
                    <span className="text-muted-foreground">{h.city}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6"
            >
              <img
                src={wcBall}
                alt="Official match ball"
                loading="lazy"
                className="absolute -right-10 -top-10 h-56 w-56 animate-[spin_18s_linear_infinite] object-contain opacity-90"
              />
              <div className="relative max-w-[60%]">
                <div className="text-[10px] uppercase tracking-[0.3em] text-primary">Match Ball</div>
                <div className="mt-2 text-xl font-black tracking-tight">Aura Orbit 26</div>
                <p className="mt-2 text-xs text-muted-foreground">Official-spec, FIFA-Quality Pro tested. Available June 11.</p>
                <button className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  Pre-order <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Federation kits strip */}
        <div className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <h3 className="text-lg font-bold uppercase tracking-tight">Federation Kits · 26</h3>
            <a href="#" className="text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground">
              All 48 teams →
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {kits.map((k, i) => (
              <motion.a
                key={k.code}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-4 transition hover:border-primary/40"
              >
                <div className={`aspect-square w-full rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center`}>
                  <span className="text-2xl font-black tracking-tight text-black/70 mix-blend-overlay">{k.code}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">{k.country}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Home · 26</div>
                  </div>
                  <div className="text-sm font-bold">${k.price}</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}