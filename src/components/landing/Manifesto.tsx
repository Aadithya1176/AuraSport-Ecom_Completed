import { motion } from "framer-motion";

export function Manifesto() {
  const words = "We don't make clothes. We engineer armor for the relentless.".split(" ");
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
          <span className="h-px w-12 bg-primary" /> Manifesto · 01
        </div>
        <h2 className="text-balance text-[clamp(2rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em]">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.2 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className={`mr-3 inline-block ${
                ["armor", "relentless."].includes(w) ? "italic text-primary" : ""
              }`}
            >
              {w}
            </motion.span>
          ))}
        </h2>
      </div>
    </section>
  );
}