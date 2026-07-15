import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
import { O as OrderStatusBadge, a as OrderStatusTracker } from "./OrderStatusTracker-B5NJ2UBo.mjs";
import { u as useAuth, g as getImageUrl, a as apiRequest } from "./router-rVUETYds.mjs";
import { L as LoaderCircle } from "../_libs/lucide-react.mjs";
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
function OrdersPage() {
  const {
    token,
    user
  } = useAuth();
  const [orders, setOrders] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const data = await apiRequest("/orders", {
          token
        });
        setOrders(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load orders");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Requests" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: "Your order requests." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-muted-foreground", children: user ? `Review every order request placed by ${user.email}.` : "Sign in to view your order history." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Back to shop" })
      ] }),
      !token ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "You need to sign in first." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Orders are private to each authenticated account." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
          mode: "signin",
          redirect: "/orders"
        }, className: "mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground", children: "Sign in" })
      ] }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[40vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "No requests yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Once you place an order request, it will appear here." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-10 space-y-6", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: [
              "Request #",
              order.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusBadge, { status: order.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
              order.customer_name,
              " | ",
              order.contact_preference,
              " | ",
              order.phone_number
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-2xl font-black", children: [
              "$",
              order.total_price.toFixed(2)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-[1.5rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            order.address_line,
            ", ",
            order.city,
            ", ",
            order.state,
            " - ",
            order.postal_code
          ] }),
          order.notes ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            "Customer note: ",
            order.notes
          ] }) : null,
          order.admin_notes ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            "AuraSport note: ",
            order.admin_notes
          ] }) : null
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrderStatusTracker, { status: order.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders/$orderId", params: {
          orderId: String(order.id)
        }, className: "rounded-full border border-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/5", children: "View full request" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4", children: order.order_items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid items-center gap-4 rounded-[1.5rem] border border-white/10 bg-background/40 p-4 md:grid-cols-[84px_1fr_auto]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageUrl(item.product.image_url), alt: item.product.name, className: "h-20 w-20 rounded-2xl object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-semibold", children: item.product.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-sm text-muted-foreground", children: [
              "Qty ",
              item.quantity,
              " x $",
              item.price.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-bold", children: [
            "$",
            (item.quantity * item.price).toFixed(2)
          ] })
        ] }, item.id)) })
      ] }, order.id)) })
    ] })
  ] });
}
export {
  OrdersPage as component
};
