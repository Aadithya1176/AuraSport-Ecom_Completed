import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-BtcMQACq.mjs";
import { u as useAuth, g as getImageUrl, a as apiRequest } from "./router-2nadxSUO.mjs";
import { L as LoaderCircle, T as Trash2, M as Minus, P as Plus } from "../_libs/lucide-react.mjs";
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
const initialFormState = {
  customer_name: "",
  phone_number: "",
  address_line: "",
  city: "",
  state: "",
  postal_code: "",
  contact_preference: "whatsapp",
  notes: ""
};
function CartPage() {
  const navigate = useNavigate();
  const {
    token,
    user
  } = useAuth();
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [busyItemId, setBusyItemId] = reactExports.useState(null);
  const [requestLoading, setRequestLoading] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState(initialFormState);
  reactExports.useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const data = await apiRequest("/cart", {
          token
        });
        setItems(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load cart");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [token]);
  reactExports.useEffect(() => {
    if (!user) {
      return;
    }
    setForm((current) => ({
      ...current,
      customer_name: current.customer_name || user.full_name || "",
      phone_number: current.phone_number || user.phone_number || "",
      address_line: current.address_line || user.address_line || "",
      city: current.city || user.city || "",
      state: current.state || user.state || "",
      postal_code: current.postal_code || user.postal_code || "",
      contact_preference: user.preferred_contact || current.contact_preference || "whatsapp"
    }));
  }, [user]);
  const total = reactExports.useMemo(() => items.reduce((sum, item) => sum + item.product.price * item.qty, 0), [items]);
  function updateForm(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }
  async function updateQty(cartItemId, qty) {
    if (!token || qty < 1) {
      return;
    }
    try {
      setBusyItemId(cartItemId);
      const updated = await apiRequest(`/cart/${cartItemId}`, {
        method: "PATCH",
        token,
        body: {
          qty
        }
      });
      setItems((current) => current.map((item) => item.id === cartItemId ? updated : item));
      window.dispatchEvent(new Event("aurasport-cart-updated"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update cart");
    } finally {
      setBusyItemId(null);
    }
  }
  async function removeItem(cartItemId) {
    if (!token) {
      return;
    }
    try {
      setBusyItemId(cartItemId);
      await apiRequest(`/cart/${cartItemId}`, {
        method: "DELETE",
        token
      });
      setItems((current) => current.filter((item) => item.id !== cartItemId));
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Item removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove item");
    } finally {
      setBusyItemId(null);
    }
  }
  async function submitOrderRequest() {
    if (!token) {
      navigate({
        to: "/auth",
        search: {
          mode: "signin",
          redirect: "/cart"
        }
      });
      return;
    }
    const missingField = Object.entries(form).find(([key, value]) => {
      if (key === "notes") {
        return false;
      }
      return String(value).trim().length === 0;
    });
    if (missingField) {
      toast.error("Please fill in all contact and address details");
      return;
    }
    try {
      setRequestLoading(true);
      const order = await apiRequest("/orders/request", {
        method: "POST",
        token,
        body: {
          ...form,
          notes: form.notes.trim() ? form.notes.trim() : null
        }
      });
      setItems([]);
      setForm(initialFormState);
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success(`Request #${order.id} submitted`);
      navigate({
        to: "/orders"
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not place order request");
    } finally {
      setRequestLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Cart" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: "Your order request." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-2xl text-muted-foreground", children: user ? `Signed in as ${user.email}. Review your items, add your contact details, and send a request.` : "Sign in to manage your cart and send an order request." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Continue shopping" })
      ] }),
      !token ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "You need an account to use the cart.", description: "Sign in, then you can send your cart as an order request.", actionLabel: "Sign in", actionTo: "/auth" }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[40vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { title: "Your cart is empty.", description: "Add products from the live catalog before sending an order request.", actionLabel: "Shop now", actionTo: "/shop" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-4", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "grid gap-4 rounded-[2rem] border border-white/10 bg-card/60 p-4 md:grid-cols-[140px_1fr]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageUrl(item.product.image_url), alt: item.product.name, className: "aspect-square h-full w-full rounded-[1.5rem] object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: item.product.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-muted-foreground", children: [
                  "$",
                  item.product.price.toFixed(2),
                  " each"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void removeItem(item.id), disabled: busyItemId === item.id, className: "grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:bg-white/5 disabled:opacity-60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center rounded-full border border-white/10 bg-background/70 p-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(QtyButton, { onClick: () => void updateQty(item.id, item.qty - 1), disabled: busyItemId === item.id || item.qty <= 1, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-12 text-center text-sm font-semibold", children: item.qty }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(QtyButton, { onClick: () => void updateQty(item.id, item.qty + 1), disabled: busyItemId === item.id, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xl font-black", children: [
                "$",
                (item.product.price * item.qty).toFixed(2)
              ] })
            ] })
          ] })
        ] }, item.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Summary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Items" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: items.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Units" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: items.reduce((sum, item) => sum + item.qty, 0) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center justify-between border-t border-white/10 pt-6 text-xl font-black", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Request total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "$",
                total.toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "No payment happens here. Once you submit the request, AuraSport can contact you to confirm details." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Contact Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-[1.5rem] border border-white/10 bg-background/30 p-4 text-sm text-muted-foreground", children: [
              "Save these details once in your",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/profile", className: "font-semibold text-foreground underline underline-offset-4", children: "profile" }),
              " ",
              "and they will autofill here next time."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Full name", value: form.customer_name, onChange: (value) => updateForm("customer_name", value), placeholder: "Aadithya Raj" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Phone number", value: form.phone_number, onChange: (value) => updateForm("phone_number", value), placeholder: "9876543210" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Address", value: form.address_line, onChange: (value) => updateForm("address_line", value), placeholder: "12 Lake View Road" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "City", value: form.city, onChange: (value) => updateForm("city", value), placeholder: "Chennai" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "State", value: form.state, onChange: (value) => updateForm("state", value), placeholder: "Tamil Nadu" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Postal code", value: form.postal_code, onChange: (value) => updateForm("postal_code", value), placeholder: "600001" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Preferred contact method" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.contact_preference, onChange: (event) => updateForm("contact_preference", event.target.value), className: "w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "whatsapp", children: "WhatsApp" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "call", children: "Call" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "email", children: "Email" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Notes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: form.notes, onChange: (event) => updateForm("notes", event.target.value), placeholder: "Preferred delivery time, sizing note, or anything we should know", className: "min-h-28 w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void submitOrderRequest(), disabled: requestLoading, className: "mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: requestLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Place order request" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function EmptyState({
  title,
  description,
  actionLabel,
  actionTo
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: actionTo, className: "mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground", children: actionLabel })
  ] });
}
function QtyButton({
  children,
  disabled,
  onClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, disabled, className: "grid h-10 w-10 place-items-center rounded-full transition hover:bg-white/5 disabled:opacity-40", children });
}
function FormField({
  label,
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value, onChange: (event) => onChange(event.target.value), placeholder, className: "w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground" })
  ] });
}
export {
  CartPage as component
};
