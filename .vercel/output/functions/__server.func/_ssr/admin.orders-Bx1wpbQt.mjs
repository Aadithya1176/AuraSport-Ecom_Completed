import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
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
const statuses = ["pending", "contacted", "confirmed", "packed", "shipped", "completed", "cancelled"];
function AdminOrdersPage() {
  const navigate = useNavigate();
  const {
    token,
    user,
    loading
  } = useAuth();
  const [orders, setOrders] = reactExports.useState([]);
  const [pageLoading, setPageLoading] = reactExports.useState(true);
  const [savingOrderId, setSavingOrderId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (loading) {
      return;
    }
    if (!token) {
      navigate({
        to: "/auth",
        search: {
          mode: "signin",
          redirect: "/admin/orders"
        }
      });
      return;
    }
    if (user?.role !== "admin") {
      toast.error("Admin access required");
      navigate({
        to: "/"
      });
      return;
    }
    async function load() {
      try {
        const data = await apiRequest("/admin/orders", {
          token
        });
        setOrders(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load admin orders");
      } finally {
        setPageLoading(false);
      }
    }
    void load();
  }, [loading, navigate, token, user]);
  async function updateOrder(order, status, adminNotes) {
    if (!token) {
      return;
    }
    try {
      setSavingOrderId(order.id);
      const updated = await apiRequest(`/admin/orders/${order.id}`, {
        method: "PATCH",
        token,
        body: {
          status,
          admin_notes: adminNotes
        }
      });
      setOrders((current) => current.map((item) => item.id === order.id ? updated : item));
      toast.success(`Request #${order.id} updated`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update order");
    } finally {
      setSavingOrderId(null);
    }
  }
  if (loading || pageLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center pt-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) })
    ] });
  }
  if (!user || user.role !== "admin") {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: "Order request management." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-2xl text-muted-foreground", children: "Review incoming requests, update their status, and keep manual follow-up notes in one place." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/catalog", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Manage catalog" })
      ] }),
      orders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "No order requests yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Requests will appear here as customers submit them." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-10 space-y-6", children: orders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: [
              "Request #",
              order.id
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-2xl font-bold", children: order.customer_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
              order.phone_number,
              " · ",
              order.contact_preference,
              " · $",
              order.total_price.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-56 space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: order.status, onChange: (event) => void updateOrder(order, event.target.value, order.admin_notes), disabled: savingOrderId === order.id, className: "w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none", children: statuses.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: status, children: status }, status)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-foreground", children: "Delivery details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
              order.address_line,
              ", ",
              order.city,
              ", ",
              order.state,
              " - ",
              order.postal_code
            ] }),
            order.notes ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
              "Customer note: ",
              order.notes
            ] }) : null
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AdminNotesCard, { order, saving: savingOrderId === order.id, onSave: (notes) => void updateOrder(order, order.status, notes) })
        ] }),
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
function AdminNotesCard({
  order,
  saving,
  onSave
}) {
  const [notes, setNotes] = reactExports.useState(order.admin_notes ?? "");
  reactExports.useEffect(() => {
    setNotes(order.admin_notes ?? "");
  }, [order.admin_notes]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[1.5rem] border border-white/10 bg-background/30 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Admin notes" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: notes, onChange: (event) => setNotes(event.target.value), placeholder: "Add follow-up details, call notes, delivery notes, or stock remarks", className: "mt-3 min-h-28 w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onSave(notes.trim() ? notes.trim() : null), disabled: saving, className: "mt-3 inline-flex items-center rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60", children: saving ? "Saving..." : "Save notes" })
  ] });
}
export {
  AdminOrdersPage as component
};
