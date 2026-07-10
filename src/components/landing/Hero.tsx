import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "@tanstack/react-router";

import heroModel from "@/assets/hero-model.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[180px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[140px]" />
      </div>

      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground md:block">
        Spring / Summer · Drop 03
      </div>
      <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground md:block">
        AuraSport · 2026
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:pr-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            New Collection · Live Now
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-balance text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.9] tracking-[-0.04em]"
          >
            Move
            <br />
            Beyond
            <br />
            <span className="italic font-light text-primary">Limits.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Engineered apparel built for athletes who refuse to settle. Premium materials. Precision fit.
            Designed in studio, tested on the field.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/shop"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-4px_rgba(212,255,0,0.6)]"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/orders"
              className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-4 text-sm font-medium text-foreground transition hover:bg-white/5"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">
                <Play className="h-3 w-3 fill-current" />
              </span>
              Track Orders
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6"
          >
            <Stat n="2M+" label="Athletes" />
            <Stat n="150+" label="Countries" />
            <Stat n="4.9*" label="Rating" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-6"
        >
          <div className="relative mx-auto aspect-[3/4] w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-card">
            <img
              src={heroModel}
              alt="Athlete in AuraSport apparel"
              width={1080}
              height={1440}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/10 bg-background/80 p-4 backdrop-blur-xl"
            >
              <div>
                <div className="text-[10px] uppercase tracking-widest text-primary">Featured</div>
                <div className="mt-1 text-sm font-semibold">Aero Compression Tank</div>
                <div className="text-xs text-muted-foreground">From $89</div>
              </div>
              <Link
                to="/shop"
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-110"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="absolute -right-4 top-10 hidden h-24 w-24 animate-[spin_20s_linear_infinite] items-center justify-center md:flex">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="circle" d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text className="fill-primary text-[10px] uppercase tracking-[0.3em]">
                <textPath href="#circle">Move · Beyond · Limits · Aura · Sport ·</textPath>
              </text>
            </svg>
          </div>
        </motion.div>
      </div>

      <div className="relative mt-20 overflow-hidden border-y border-white/10 py-6">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="flex shrink-0 items-center gap-12 px-6 text-2xl font-black uppercase tracking-tight md:text-4xl"
            >
              {["Free Shipping", "*", "Lifetime Warranty", "*", "Carbon Neutral", "*", "Worn By Champions", "*"].map(
                (word, wordIndex) => (
                  <span key={wordIndex} className={wordIndex % 2 === 1 ? "text-primary" : "text-foreground/30"}>
                    {word}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-black tracking-tight">{n}</div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}
