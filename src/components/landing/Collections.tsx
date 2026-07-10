import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import running from "@/assets/collection-running.jpg";
import gym from "@/assets/collection-gym.jpg";
import football from "@/assets/collection-football.jpg";
import outdoor from "@/assets/collection-outdoor.jpg";

const items = [
  { title: "Running", count: "48 pieces", img: running, span: "lg:col-span-7 lg:row-span-2", tall: true },
  { title: "Gym", count: "72 pieces", img: gym, span: "lg:col-span-5" },
  { title: "Football", count: "36 pieces", img: football, span: "lg:col-span-2" },
  { title: "Outdoor", count: "54 pieces", img: outdoor, span: "lg:col-span-3" },
];

export function Collections() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-12 bg-primary" /> Featured Collections
            </div>
            <h2 className="mt-4 text-balance text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em]">
              Built for every <span className="italic font-light text-primary">discipline.</span>
            </h2>
          </div>
          <a href="#" className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
            View all
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[260px]">
          {items.map((it, i) => (
            <motion.a
              key={it.title}
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-card ${it.span} ${it.tall ? "min-h-[400px] lg:min-h-0" : "min-h-[320px]"}`}
            >
              <img
                src={it.img}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span className="rounded-full border border-white/20 bg-background/50 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur">
                    {it.count}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 scale-75">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight md:text-4xl">{it.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Shop the collection →</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}