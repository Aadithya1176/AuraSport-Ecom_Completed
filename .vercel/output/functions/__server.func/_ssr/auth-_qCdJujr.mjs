import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useSearch, d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-rVUETYds.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { U as User, c as Mail, E as EyeOff, d as Eye, e as Lock, L as LoaderCircle, A as ArrowRight } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const authSide = "/assets/auth-side-DfvcY7oE.jpg";
const signInSchema = objectType({
  email: stringType().trim().email("Enter a valid email").max(255),
  password: stringType().min(6, "At least 6 characters").max(72)
});
const signUpSchema = objectType({
  username: stringType().trim().min(3, "At least 3 characters").max(50),
  email: stringType().trim().email("Enter a valid email").max(255),
  password: stringType().min(6, "At least 6 characters").max(72)
});
function AuthPage() {
  const search = useSearch({
    from: "/auth"
  });
  const navigate = useNavigate();
  const {
    user,
    loading,
    signIn,
    signUp
  } = useAuth();
  const [mode, setMode] = reactExports.useState(search.mode ?? "signin");
  const [showPw, setShowPw] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!loading && user) {
      navigate({
        to: search.redirect ?? "/",
        replace: true
      });
    }
  }, [loading, navigate, search.redirect, user]);
  async function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());
    const schema = mode === "signin" ? signInSchema : signUpSchema;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "signin") {
        const credentials = parsed.data;
        await signIn(credentials.email, credentials.password);
        toast.success("Welcome back");
      } else {
        const registration = parsed.data;
        await signUp(registration);
        toast.success("Account created");
      }
      navigate({
        to: search.redirect ?? "/shop",
        replace: true
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid min-h-screen grid-cols-1 bg-background text-foreground lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden overflow-hidden lg:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: authSide, alt: "AuraSport athlete", className: "absolute inset-0 h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col justify-between p-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground", children: "A" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-bold uppercase tracking-[0.18em]", children: [
            "Aura",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Sport" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-medium uppercase tracking-[0.3em] text-primary", children: "Backend Connected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mt-4 text-balance text-5xl font-black leading-[0.95] tracking-[-0.03em]", children: [
            "Real auth for the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "full store flow." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Sign in once, then shop, cart, and order history all use the FastAPI backend." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center px-6 py-12 lg:px-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[160px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground lg:hidden", children: "Back to AuraSport" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-10 bg-primary" }),
          mode === "signin" ? "Welcome back" : "Create your account"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.h1, { initial: {
          opacity: 0,
          y: 8
        }, animate: {
          opacity: 1,
          y: 0
        }, exit: {
          opacity: 0,
          y: -8
        }, transition: {
          duration: 0.3
        }, className: "text-balance text-4xl font-black leading-[1.05] tracking-[-0.03em] md:text-5xl", children: mode === "signin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Sign in to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "AuraSport." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          "Create your ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic font-light text-primary", children: "account." })
        ] }) }, mode) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 inline-flex rounded-full border border-white/10 bg-card/60 p-1 backdrop-blur", children: ["signin", "signup"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setMode(tab), className: `relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${mode === tab ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`, children: [
          mode === tab ? /* @__PURE__ */ jsxRuntimeExports.jsx(motion.span, { layoutId: "auth-tab", className: "absolute inset-0 -z-0 rounded-full bg-primary", transition: {
            type: "spring",
            stiffness: 400,
            damping: 30
          } }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: tab === "signin" ? "Sign In" : "Sign Up" })
        ] }, tab)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-8 space-y-4", children: [
          mode === "signup" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }), name: "username", type: "text", placeholder: "Username", autoComplete: "username" }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }), name: "email", type: "email", placeholder: "you@email.com", autoComplete: "email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" }), name: "password", type: showPw ? "text" : "password", placeholder: "Password", autoComplete: mode === "signin" ? "current-password" : "new-password", suffix: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setShowPw((value) => !value), className: "text-muted-foreground transition hover:text-foreground", "aria-label": "Toggle password visibility", children: showPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: submitting, className: "group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:scale-[1.01] hover:shadow-[0_0_40px_-8px_rgba(212,255,0,0.6)] disabled:opacity-60 disabled:hover:scale-100", children: submitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            mode === "signin" ? "Sign in" : "Create account",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })
          ] }) })
        ] }, mode),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-8 text-center text-xs text-muted-foreground", children: "This screen now talks directly to the AuraSport backend instead of Supabase." })
      ] })
    ] })
  ] });
}
function Field({
  icon,
  suffix,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "group flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-4 py-3.5 backdrop-blur transition focus-within:border-primary/60 focus-within:bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground transition group-focus-within:text-primary", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ...props, required: true, className: "flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60" }),
    suffix
  ] });
}
export {
  AuthPage as component
};
