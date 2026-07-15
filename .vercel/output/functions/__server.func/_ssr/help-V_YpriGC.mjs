import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
import "../_libs/sonner.mjs";
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
import "./router-rVUETYds.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/lucide-react.mjs";
const contactCards = [{
  title: "Order help",
  value: "support@aurasport.local",
  note: "Use your request number when contacting support for faster follow-up."
}, {
  title: "Phone or WhatsApp",
  value: "+91 90000 00000",
  note: "Best for address corrections, confirmation questions, or urgent request updates."
}, {
  title: "Working hours",
  value: "Mon-Sat, 10 AM to 7 PM",
  note: "Messages outside these hours can continue on the next working day."
}];
function HelpPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Help" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: "Support for every order request." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: "AuraSport currently works on a request-first flow. If you need an update, sizing help, or delivery change, this page gives you the clearest next step." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-10 grid gap-6 md:grid-cols-3", children: contactCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: card.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-2xl font-bold", children: card.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: card.note })
      ] }, card.title)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 grid gap-6 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "How tracking works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Pending means AuraSport received your request." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Contacted means the team has started follow-up." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Confirmed means your request details were approved." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Packed, Shipped, and Completed show the final fulfillment stages." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Cancelled means that request is closed and should be placed again if still needed." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Best next actions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Need progress: open request history and use the request number when contacting support." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Need to change address or phone: contact AuraSport before the request reaches shipped." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Need another item: go back to the catalog and place a fresh request anytime." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", className: "rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90", children: "View requests" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Continue shopping" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  HelpPage as component
};
