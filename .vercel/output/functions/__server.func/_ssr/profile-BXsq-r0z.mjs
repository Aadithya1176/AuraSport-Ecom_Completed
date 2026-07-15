import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
import { u as useAuth, a as apiRequest } from "./router-rVUETYds.mjs";
import { L as LoaderCircle, b as Save } from "../_libs/lucide-react.mjs";
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
function ProfilePage() {
  const navigate = useNavigate();
  const {
    token,
    user,
    setUser
  } = useAuth();
  const [saving, setSaving] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    full_name: "",
    phone_number: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    preferred_contact: "whatsapp"
  });
  reactExports.useEffect(() => {
    if (!user) {
      return;
    }
    setForm({
      full_name: user.full_name || "",
      phone_number: user.phone_number || "",
      address_line: user.address_line || "",
      city: user.city || "",
      state: user.state || "",
      postal_code: user.postal_code || "",
      preferred_contact: user.preferred_contact || "whatsapp"
    });
  }, [user]);
  function updateForm(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value
    }));
  }
  async function saveProfile() {
    if (!token) {
      navigate({
        to: "/auth",
        search: {
          mode: "signin",
          redirect: "/profile"
        }
      });
      return;
    }
    try {
      setSaving(true);
      const updatedUser = await apiRequest("/me", {
        method: "PATCH",
        token,
        body: form
      });
      setUser(updatedUser);
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-5xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: "Saved delivery details." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-2xl text-muted-foreground", children: "Keep your name, address, and preferred contact method ready so checkout becomes one quick confirmation." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Go to cart" })
      ] }),
      !token ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "You need to sign in first." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Your saved profile is tied to your AuraSport account." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", search: {
          mode: "signin",
          redirect: "/profile"
        }, className: "mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground", children: "Sign in" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Full name", value: form.full_name, onChange: (value) => updateForm("full_name", value), placeholder: "Aadithya Raj" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Phone number", value: form.phone_number, onChange: (value) => updateForm("phone_number", value), placeholder: "9876543210" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Address", value: form.address_line, onChange: (value) => updateForm("address_line", value), placeholder: "12 Lake View Road" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "City", value: form.city, onChange: (value) => updateForm("city", value), placeholder: "Chennai" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "State", value: form.state, onChange: (value) => updateForm("state", value), placeholder: "Tamil Nadu" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "Postal code", value: form.postal_code, onChange: (value) => updateForm("postal_code", value), placeholder: "600001" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Preferred contact method" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: form.preferred_contact, onChange: (event) => updateForm("preferred_contact", event.target.value), className: "w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "whatsapp", children: "WhatsApp" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "call", children: "Call" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "email", children: "Email" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void saveProfile(), disabled: saving, className: "inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: [
            saving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4" }),
            "Save profile"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "View requests" })
        ] })
      ] })
    ] })
  ] });
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
  ProfilePage as component
};
