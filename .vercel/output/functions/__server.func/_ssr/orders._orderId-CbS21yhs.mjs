import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
import { O as OrderStatusBadge, a as OrderStatusTracker } from "./OrderStatusTracker-B5NJ2UBo.mjs";
import { b as Route$2, u as useAuth, g as getImageUrl, a as apiRequest } from "./router-rVUETYds.mjs";
import { k as ArrowLeft, L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/zod.mjs";
function OrderDetailPage() {
  const {
    orderId
  } = Route$2.useParams();
  const {
    token
  } = useAuth();
  const [order, setOrder] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const data = await apiRequest(`/orders/${orderId}`, {
          token
        });
        setOrder(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load order request");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [orderId, token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Request Detail" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: [
            "Request #",
            orderId
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-2xl text-muted-foreground", children: "Review status, saved contact details, delivery destination, and every requested item in one place." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/orders", className: "inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Back to requests"
        ] })
      ] }),
      !token ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "You need to sign in first." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Request details are only visible to the account owner." })
      ] }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[40vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : !order ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "Request not found." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "It may have been removed or may belong to a different user." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm text-muted-foreground", children: [
              "Preferred contact: ",
              order.contact_preference
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
              "Phone: ",
              order.phone_number
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-2xl font-black", children: [
              "$",
              order.total_price.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Tracking" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusTracker, { status: order.status }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Delivery" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-lg font-semibold", children: order.customer_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm text-muted-foreground", children: [
              order.address_line,
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              order.city,
              ", ",
              order.state,
              " - ",
              order.postal_code
            ] }),
            order.notes ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-sm text-muted-foreground", children: [
              "Your note: ",
              order.notes
            ] }) : null,
            order.admin_notes ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 rounded-2xl border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground", children: [
              "AuraSport update: ",
              order.admin_notes
            ] }) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-4", children: order.order_items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "grid items-center gap-4 rounded-[2rem] border border-white/10 bg-card/60 p-4 md:grid-cols-[120px_1fr_auto]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageUrl(item.product.image_url), alt: item.product.name, className: "aspect-square h-full w-full rounded-[1.5rem] object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold", children: item.product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
              "Qty ",
              item.quantity,
              " x $",
              item.price.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xl font-black", children: [
            "$",
            (item.quantity * item.price).toFixed(2)
          ] })
        ] }, item.id)) })
      ] })
    ] })
  ] });
}
export {
  OrderDetailPage as component
};
