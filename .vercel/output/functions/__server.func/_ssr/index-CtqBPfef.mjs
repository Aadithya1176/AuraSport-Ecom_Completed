import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { A as ArrowRight, f as Play, g as Trophy, h as ArrowUpRight, I as Instagram, i as Twitter, Y as Youtube, H as Heart, P as Plus, j as Star } from "../_libs/lucide-react.mjs";
import "./router-rVUETYds.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const heroModel = "/assets/hero-model-CkGHJgGu.jpg";
function Hero() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative min-h-screen overflow-hidden pt-28", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pointer-events-none absolute inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-primary/20 blur-[180px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[140px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground md:block", children: "Spring / Summer · Drop 03" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground md:block", children: "AuraSport · 2026" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-6 lg:pr-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6 },
            className: "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" }),
              "New Collection · Live Now"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] },
            className: "mt-6 text-balance text-[clamp(3rem,9vw,7.5rem)] font-black leading-[0.9] tracking-[-0.04em]",
            children: [
              "Move",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              "Beyond",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "Limits." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.3 },
            className: "mt-6 max-w-md text-base leading-relaxed text-muted-foreground",
            children: "Engineered apparel built for athletes who refuse to settle. Premium materials. Precision fit. Designed in studio, tested on the field."
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, delay: 0.45 },
            className: "mt-10 flex flex-wrap items-center gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/shop",
                  className: "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-4px_rgba(212,255,0,0.6)]",
                  children: [
                    "Shop Collection",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/orders",
                  className: "group inline-flex items-center gap-3 rounded-full border border-white/15 px-5 py-4 text-sm font-medium text-foreground transition hover:bg-white/5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 place-items-center rounded-full bg-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3 fill-current" }) }),
                    "Track Orders"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.8, delay: 0.7 },
            className: "mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "2M+", label: "Athletes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "150+", label: "Countries" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "4.9*", label: "Rating" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 1.05 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          className: "relative lg:col-span-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto aspect-[3/4] w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: heroModel,
                  alt: "Athlete in AuraSport apparel",
                  width: 1080,
                  height: 1440,
                  className: "h-full w-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, delay: 0.9 },
                  className: "absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl border border-white/10 bg-background/80 p-4 backdrop-blur-xl",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-primary", children: "Featured" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-semibold", children: "Aero Compression Tank" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "From $89" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/shop",
                        className: "grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-110",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-4 top-10 hidden h-24 w-24 animate-[spin_20s_linear_infinite] items-center justify-center md:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 100 100", className: "h-full w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { id: "circle", d: "M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("text", { className: "fill-primary text-[10px] uppercase tracking-[0.3em]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textPath", { href: "#circle", children: "Move · Beyond · Limits · Aura · Sport ·" }) })
            ] }) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-20 overflow-hidden border-y border-white/10 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex animate-[marquee_30s_linear_infinite] whitespace-nowrap", children: Array.from({ length: 2 }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex shrink-0 items-center gap-12 px-6 text-2xl font-black uppercase tracking-tight md:text-4xl",
        children: ["Free Shipping", "*", "Lifetime Warranty", "*", "Carbon Neutral", "*", "Worn By Champions", "*"].map(
          (word, wordIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: wordIndex % 2 === 1 ? "text-primary" : "text-foreground/30", children: word }, wordIndex)
        )
      },
      index
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }` })
  ] });
}
function Stat({ n, label }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black tracking-tight", children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] uppercase tracking-widest text-muted-foreground", children: label })
  ] });
}
const running = "/assets/collection-running-DqjPkSJQ.jpg";
const gym = "/assets/collection-gym-CeeH-s3S.jpg";
const football = "/assets/collection-football-Ucdw-F6G.jpg";
const outdoor = "/assets/collection-outdoor-BPnUWW2N.jpg";
const items = [
  { title: "Running", count: "48 pieces", img: running, span: "lg:col-span-7 lg:row-span-2", tall: true },
  { title: "Gym", count: "72 pieces", img: gym, span: "lg:col-span-5" },
  { title: "Football", count: "36 pieces", img: football, span: "lg:col-span-2" },
  { title: "Outdoor", count: "54 pieces", img: outdoor, span: "lg:col-span-3" }
];
function Collections() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 flex flex-wrap items-end justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-12 bg-primary" }),
          " Featured Collections"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-balance text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em]", children: [
          "Built for every ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "discipline." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#", className: "group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider", children: [
        "View all",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[260px]", children: items.map((it, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.a,
      {
        href: "#",
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-80px" },
        transition: { duration: 0.6, delay: i * 0.08 },
        className: `group relative overflow-hidden rounded-3xl border border-white/10 bg-card ${it.span} ${it.tall ? "min-h-[400px] lg:min-h-0" : "min-h-[320px]"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: it.img,
              alt: it.title,
              loading: "lazy",
              className: "absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-between p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-white/20 bg-background/50 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur", children: it.count }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 scale-75", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-black uppercase tracking-tight md:text-4xl", children: it.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Shop the collection →" })
            ] })
          ] })
        ]
      },
      it.title
    )) })
  ] }) });
}
const sneaker = "/assets/product-sneaker-DI7997EY.jpg";
const hoodie = "/assets/product-hoodie-C_C6W5uW.jpg";
const leggings = "/assets/product-leggings-uqub3qZS.jpg";
const backpack = "/assets/product-backpack-CLVEYiz_.jpg";
const products = [
  { name: "Velocity Pro Runner", category: "Footwear", price: 189, was: 240, img: sneaker, rating: 4.9, badge: "-21%" },
  { name: "Phantom Tech Hoodie", category: "Men · Outerwear", price: 145, img: hoodie, rating: 4.8, badge: "New" },
  { name: "Aero Compression Leggings", category: "Women · Training", price: 98, was: 120, img: leggings, rating: 4.9, badge: "-18%" },
  { name: "Apex Tactical Backpack", category: "Accessories", price: 165, img: backpack, rating: 4.7, badge: "Hot" }
];
function Trending() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative py-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 flex flex-wrap items-end justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-12 bg-primary" }),
          " Trending Now"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-balance text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em]", children: [
          "The pieces ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "everyone" }),
          " is on."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["All", "Footwear", "Apparel", "Gear"].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: `rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wider transition ${i === 0 ? "bg-primary text-primary-foreground" : "border border-white/10 text-muted-foreground hover:text-foreground"}`,
          children: t
        },
        t
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4", children: products.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductCard, { p, i }, p.name)) })
  ] }) });
}
function ProductCard({ p, i }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-80px" },
      transition: { duration: 0.5, delay: i * 0.08 },
      className: "group relative",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: p.img,
              alt: p.name,
              loading: "lazy",
              className: "h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            }
          ),
          p.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${p.badge.startsWith("-") ? "bg-primary text-primary-foreground" : "border border-white/20 bg-background/70 text-foreground backdrop-blur"}`,
              children: p.badge
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              "aria-label": "Wishlist",
              className: "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-background/60 text-foreground/80 backdrop-blur transition hover:bg-background hover:text-primary",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_10px_30px_-10px_rgba(212,255,0,0.6)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Quick Add"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: p.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 truncate text-sm font-semibold", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-primary text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: p.rating }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "· 1.2k reviews" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-base font-bold", children: [
              "$",
              p.price
            ] }),
            p.was && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground line-through", children: [
              "$",
              p.was
            ] })
          ] })
        ] })
      ]
    }
  );
}
function Manifesto() {
  const words = "We don't make clothes. We engineer armor for the relentless.".split(" ");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "relative py-32", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-12 bg-primary" }),
      " Manifesto · 01"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-balance text-[clamp(2rem,5vw,4.5rem)] font-light leading-[1.05] tracking-[-0.02em]", children: words.map((w, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.span,
      {
        initial: { opacity: 0.2 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.4, delay: i * 0.06 },
        className: `mr-3 inline-block ${["armor", "relentless."].includes(w) ? "italic text-primary" : ""}`,
        children: w
      },
      i
    )) })
  ] }) });
}
const wcHero = "/assets/wc-hero-DXq5rTRk.jpg";
const wcBall = "/assets/wc-ball-DBKPVTo9.jpg";
const KICKOFF = (/* @__PURE__ */ new Date("2026-06-11T20:00:00Z")).getTime();
function useCountdown() {
  const [now, setNow] = reactExports.useState(() => Date.now());
  reactExports.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, KICKOFF - now);
  const days = Math.floor(diff / 864e5);
  const hours = Math.floor(diff / 36e5 % 24);
  const mins = Math.floor(diff / 6e4 % 60);
  const secs = Math.floor(diff / 1e3 % 60);
  return { days, hours, mins, secs };
}
const hosts = [
  { code: "USA", city: "New York · LA · Dallas", flag: "🇺🇸" },
  { code: "CAN", city: "Toronto · Vancouver", flag: "🇨🇦" },
  { code: "MEX", city: "Mexico City · Guadalajara", flag: "🇲🇽" }
];
const kits = [
  { country: "Argentina", code: "ARG", color: "from-sky-400 to-sky-200", price: 129 },
  { country: "Brazil", code: "BRA", color: "from-yellow-400 to-emerald-500", price: 129 },
  { country: "France", code: "FRA", color: "from-blue-700 to-blue-400", price: 129 },
  { country: "England", code: "ENG", color: "from-white to-slate-300", price: 129 },
  { country: "Germany", code: "GER", color: "from-zinc-100 to-zinc-400", price: 129 },
  { country: "Spain", code: "ESP", color: "from-red-600 to-red-400", price: 129 }
];
function WorldCup() {
  const { days, hours, mins, secs } = useCountdown();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-12 flex flex-wrap items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-12 bg-primary" }),
            " Official Drop · World Cup 2026"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-balance text-[clamp(2.25rem,5vw,4rem)] font-black leading-[0.95] tracking-[-0.03em]", children: [
            "The world plays in ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "AuraSport." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "h-3.5 w-3.5" }),
          " USA · CAN · MEX 2026"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-80px" },
            transition: { duration: 0.7 },
            className: "relative overflow-hidden rounded-3xl border border-white/10 bg-card lg:col-span-7 min-h-[520px]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: wcHero,
                  alt: "World Cup 2026 athlete",
                  loading: "lazy",
                  className: "absolute inset-0 h-full w-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-between p-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full border border-white/20 bg-background/60 px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur", children: "Kickoff · June 11, 2026" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-balance text-[clamp(2rem,4.5vw,3.75rem)] font-black uppercase leading-[0.95] tracking-tight", children: [
                    "Every nation.",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "One pitch." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 max-w-md text-sm text-muted-foreground", children: "The official 2026 Federation Collection. Lightweight tech-knit, sweat-engineered, built for 48 teams across 3 nations." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "group mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:scale-[1.02] hover:shadow-[0_0_40px_-4px_rgba(212,255,0,0.6)]", children: [
                    "Shop Federation Kits",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:col-span-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-80px" },
              transition: { duration: 0.7, delay: 0.1 },
              className: "rounded-3xl border border-white/10 bg-card p-8",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.3em] text-muted-foreground", children: "Countdown to kickoff" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-4 gap-3", children: [
                  { v: days, l: "Days" },
                  { v: hours, l: "Hrs" },
                  { v: mins, l: "Min" },
                  { v: secs, l: "Sec" }
                ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-white/10 bg-background/60 p-3 text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-2xl font-black tabular-nums tracking-tight md:text-3xl", children: String(c.v).padStart(2, "0") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[9px] uppercase tracking-widest text-muted-foreground", children: c.l })
                ] }, c.l)) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-2 border-t border-white/10 pt-5", children: hosts.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: h.flag }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold tracking-wider", children: h.code })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: h.city })
                ] }, h.code)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-80px" },
              transition: { duration: 0.7, delay: 0.2 },
              className: "relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: wcBall,
                    alt: "Official match ball",
                    loading: "lazy",
                    className: "absolute -right-10 -top-10 h-56 w-56 animate-[spin_18s_linear_infinite] object-contain opacity-90"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-[60%]", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-[0.3em] text-primary", children: "Match Ball" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xl font-black tracking-tight", children: "Aura Orbit 26" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Official-spec, FIFA-Quality Pro tested. Available June 11." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary", children: [
                    "Pre-order ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                  ] })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-end justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold uppercase tracking-tight", children: "Federation Kits · 26" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground", children: "All 48 teams →" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6", children: kits.map((k, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.a,
          {
            href: "#",
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, margin: "-60px" },
            transition: { duration: 0.4, delay: i * 0.05 },
            className: "group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-4 transition hover:border-primary/40",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `aspect-square w-full rounded-xl bg-gradient-to-br ${k.color} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black tracking-tight text-black/70 mix-blend-overlay", children: k.code }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-bold", children: k.country }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground", children: "Home · 26" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-bold", children: [
                  "$",
                  k.price
                ] })
              ] })
            ]
          },
          k.code
        )) })
      ] })
    ] })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "relative mt-24 border-t border-white/10 bg-card/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-6 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-12 lg:grid-cols-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[clamp(2.5rem,6vw,5rem)] font-black leading-[0.95] tracking-[-0.03em]", children: [
            "Join the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "movement." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-md text-sm text-muted-foreground", children: "Early access to drops, training stories, and exclusive members-only releases." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-8 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-background/40 p-1.5 backdrop-blur", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                placeholder: "your@email.com",
                className: "flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/60"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-primary-foreground transition hover:scale-[1.02]", children: [
              "Join ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FCol, { title: "Shop", items: ["Men", "Women", "New Arrivals", "Sale"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FCol, { title: "Help", items: ["Shipping", "Returns", "Size Guide", "Contact"] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FCol, { title: "Company", items: ["About", "Athletes", "Sustainability", "Press"] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-black", children: "A" }),
          "© 2026 AuraSport. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: [Instagram, Twitter, Youtube].map((Icon, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#",
            className: "grid h-9 w-9 place-items-center rounded-full border border-white/10 text-foreground/70 transition hover:border-primary hover:text-primary",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
          },
          i
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "select-none text-center text-[clamp(5rem,22vw,18rem)] font-black leading-[0.85] tracking-[-0.05em] text-foreground/[0.04]", children: "AURASPORT" }) })
  ] });
}
function FCol({ title, items: items2 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.3em] text-primary", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3", children: items2.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", className: "text-sm text-muted-foreground transition hover:text-foreground", children: i }) }, i)) })
  ] });
}
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground antialiased", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Manifesto, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WorldCup, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Collections, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trending, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
const SplitComponent = Landing;
export {
  SplitComponent as component
};
