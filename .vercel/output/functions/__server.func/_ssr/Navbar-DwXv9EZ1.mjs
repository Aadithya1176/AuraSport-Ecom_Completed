import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, a as apiRequest } from "./router-rVUETYds.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { a as Search, U as User, S as ShoppingBag, m as Shield, H as Heart, R as ReceiptText, n as LogOut, X, o as Menu } from "../_libs/lucide-react.mjs";
const links = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Cart", to: "/cart" },
  { label: "Orders", to: "/orders" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Help", to: "/help" }
];
function Navbar() {
  const [scrolled, setScrolled] = reactExports.useState(false);
  const [open, setOpen] = reactExports.useState(false);
  const [cartCount, setCartCount] = reactExports.useState(0);
  const navigate = useNavigate();
  const { user, token, signOut } = useAuth();
  reactExports.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  reactExports.useEffect(() => {
    if (!token) {
      setCartCount(0);
      return;
    }
    async function loadCartCount() {
      try {
        const items = await apiRequest("/cart", { token });
        setCartCount(items.reduce((sum, item) => sum + item.qty, 0));
      } catch {
        setCartCount(0);
      }
    }
    void loadCartCount();
    const onCartUpdated = () => void loadCartCount();
    window.addEventListener("aurasport-cart-updated", onCartUpdated);
    return () => window.removeEventListener("aurasport-cart-updated", onCartUpdated);
  }, [token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.header,
    {
      initial: { y: -40, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "nav",
          {
            className: `flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 px-6 py-3 transition-all duration-500 ${scrolled ? "bg-background/70 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]" : "bg-white/[0.03] backdrop-blur-md"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "group flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground", children: "A" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-base font-bold uppercase tracking-[0.18em]", children: [
                  "Aura",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Sport" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "hidden items-center gap-8 lg:flex", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: link.to,
                  className: "relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full",
                  children: link.label
                }
              ) }, link.label)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/shop",
                    "aria-label": "Search catalog",
                    className: "grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" })
                  }
                ),
                user ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Account",
                    onClick: () => navigate({ to: "/orders" }),
                    className: "grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" })
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/auth",
                    "aria-label": "Account",
                    className: "grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/cart",
                    "aria-label": "Cart",
                    className: "grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
                      cartCount > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground", children: cartCount }) : null
                    ] })
                  }
                ),
                user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  user.role === "admin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/admin/catalog",
                        "aria-label": "Admin catalog",
                        className: "hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
                          "Catalog"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/admin/orders",
                        "aria-label": "Admin orders",
                        className: "hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
                          "Requests"
                        ]
                      }
                    )
                  ] }) : null,
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/profile",
                      "aria-label": "Profile",
                      className: "hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4" }),
                        "Profile"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/wishlist",
                      "aria-label": "Wishlist",
                      className: "hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "h-4 w-4" }),
                        "Wishlist"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/orders",
                      "aria-label": "Orders",
                      className: "hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptText, { className: "h-4 w-4" }),
                        "Orders"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => void signOut(),
                      className: "ml-2 hidden items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wider text-background transition hover:bg-primary hover:text-primary-foreground md:inline-flex",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
                        "Sign out"
                      ]
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/auth",
                    className: "ml-2 hidden rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wider text-background transition hover:bg-primary hover:text-primary-foreground md:block",
                    children: "Login"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "ml-1 grid h-9 w-9 place-items-center rounded-full text-foreground lg:hidden",
                    onClick: () => setOpen((value) => !value),
                    "aria-label": "Menu",
                    children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "h-5 w-5" })
                  }
                )
              ] })
            ]
          }
        ),
        open ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            className: "absolute left-4 right-4 top-20 rounded-3xl border border-white/10 bg-background/95 p-6 backdrop-blur-xl lg:hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex flex-col gap-4", children: links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: link.to, className: "text-lg font-semibold", onClick: () => setOpen(false), children: link.label }) }, link.label)) })
          }
        ) : null
      ]
    }
  );
}
export {
  Navbar as N
};
