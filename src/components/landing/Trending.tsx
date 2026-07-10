import { motion } from "framer-motion";
import { Heart, Plus, Star } from "lucide-react";
import sneaker from "@/assets/product-sneaker.jpg";
import hoodie from "@/assets/product-hoodie.jpg";
import leggings from "@/assets/product-leggings.jpg";
import backpack from "@/assets/product-backpack.jpg";

type Product = {
  name: string;
  category: string;
  price: number;
  was?: number;
  img: string;
  rating: number;
  badge?: string;
};

const products: Product[] = [
  { name: "Velocity Pro Runner", category: "Footwear", price: 189, was: 240, img: sneaker, rating: 4.9, badge: "-21%" },
  { name: "Phantom Tech Hoodie", category: "Men · Outerwear", price: 145, img: hoodie, rating: 4.8, badge: "New" },
  { name: "Aero Compression Leggings", category: "Women · Training", price: 98, was: 120, img: leggings, rating: 4.9, badge: "-18%" },
  { name: "Apex Tactical Backpack", category: "Accessories", price: 165, img: backpack, rating: 4.7, badge: "Hot" },
];

export function Trending() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-px w-12 bg-primary" /> Trending Now
            </div>
            <h2 className="mt-4 text-balance text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em]">
              The pieces <span className="italic font-light text-primary">everyone</span> is on.
            </h2>
          </div>
          <div className="flex gap-2">
            {["All", "Footwear", "Apparel", "Gear"].map((t, i) => (
              <button
                key={t}
                className={`rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition ${
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.name} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ p, i }: { p: Product; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: i * 0.08 }}
      className="group relative"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-card">
        <img
          src={p.img}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {p.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              p.badge.startsWith("-")
                ? "bg-primary text-primary-foreground"
                : "border border-white/20 bg-background/70 text-foreground backdrop-blur"
            }`}
          >
            {p.badge}
          </span>
        )}

        <button
          aria-label="Wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-background/60 text-foreground/80 backdrop-blur transition hover:bg-background hover:text-primary"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_10px_30px_-10px_rgba(212,255,0,0.6)]">
            <Plus className="h-4 w-4" /> Quick Add
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.category}</div>
          <h3 className="mt-1 truncate text-sm font-semibold">{p.name}</h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">{p.rating}</span>
            <span className="text-xs text-muted-foreground/50">· 1.2k reviews</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-base font-bold">${p.price}</div>
          {p.was && <div className="text-xs text-muted-foreground line-through">${p.was}</div>}
        </div>
      </div>
    </motion.div>
  );
}