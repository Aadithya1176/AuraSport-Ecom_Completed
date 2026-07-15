import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { o as objectType, s as stringType, e as enumType } from "../_libs/zod.mjs";
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
const appCss = "/assets/styles-C4_P-cb8.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const API_BASE_URL = "http://127.0.0.1:8000";
async function parseResponse(response) {
  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const errorData = await response.json();
      message = errorData?.detail ?? errorData?.error?.message ?? errorData?.message ?? message;
    } catch {
      if (response.statusText) {
        message = response.statusText;
      }
    }
    throw new Error(message);
  }
  return await response.json();
}
async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;
  if (!isFormData && options.body != null) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body == null || options.body instanceof FormData ? options.body : JSON.stringify(options.body)
  });
  return parseResponse(response);
}
function getImageUrl(imageUrl) {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";
  }
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${API_BASE_URL}${imageUrl}`;
}
const STORAGE_KEY = "aurasport.auth";
const Ctx = reactExports.createContext({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {
  },
  signUp: async () => {
  },
  signOut: async () => {
  },
  refreshUser: async () => {
  },
  setUser: () => {
  }
});
function AuthProvider({ children }) {
  const [user, setUser] = reactExports.useState(null);
  const [token, setToken] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  function persistSession(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    if (typeof window === "undefined") {
      return;
    }
    if (!nextToken || !nextUser) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser })
    );
  }
  async function applyAuthResponse(response) {
    persistSession(response.access_token, response.user);
  }
  async function refreshUser() {
    if (!token) {
      persistSession(null, null);
      return;
    }
    try {
      const currentUser = await apiRequest("/me", { token });
      persistSession(token, currentUser);
    } catch {
      persistSession(null, null);
    }
  }
  reactExports.useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (parsed.token && parsed.user) {
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);
  reactExports.useEffect(() => {
    if (!token) {
      return;
    }
    void refreshUser();
  }, [token]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Ctx.Provider,
    {
      value: {
        user,
        token,
        loading,
        signIn: async (email, password) => {
          const response = await apiRequest("/login", {
            method: "POST",
            body: { email, password }
          });
          await applyAuthResponse(response);
        },
        signUp: async ({ username, email, password }) => {
          await apiRequest("/register", {
            method: "POST",
            body: { username, email, password }
          });
          const response = await apiRequest("/login", {
            method: "POST",
            body: { email, password }
          });
          await applyAuthResponse(response);
        },
        signOut: async () => {
          persistSession(null, null);
          window.dispatchEvent(new Event("aurasport-cart-updated"));
        },
        refreshUser,
        setUser: (nextUser) => persistSession(token, nextUser)
      },
      children
    }
  );
}
const useAuth = () => reactExports.useContext(Ctx);
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$c = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AuraSport" },
      { name: "description", content: "AuraSport request-based sports storefront." },
      { name: "author", content: "AuraSport" },
      { property: "og:title", content: "AuraSport" },
      { property: "og:description", content: "AuraSport request-based sports storefront." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@AuraSport" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$c.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { theme: "dark", position: "top-center" })
  ] }) });
}
const $$splitComponentImporter$b = () => import("./wishlist-BVigLYrE.mjs");
const Route$b = createFileRoute("/wishlist")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
  head: () => ({
    meta: [{
      title: "Wishlist | AuraSport"
    }, {
      name: "description",
      content: "Review saved AuraSport products and move them into your cart."
    }]
  })
});
const $$splitComponentImporter$a = () => import("./shop-Cnr_h94Q.mjs");
const Route$a = createFileRoute("/shop")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
  head: () => ({
    meta: [{
      title: "Shop | AuraSport"
    }, {
      name: "description",
      content: "Browse the live AuraSport catalog powered by the backend API."
    }]
  })
});
const $$splitComponentImporter$9 = () => import("./profile-BXsq-r0z.mjs");
const Route$9 = createFileRoute("/profile")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  head: () => ({
    meta: [{
      title: "Profile | AuraSport"
    }, {
      name: "description",
      content: "Save your profile and delivery details for faster AuraSport requests."
    }]
  })
});
const $$splitComponentImporter$8 = () => import("./orders-OjqKY94b.mjs");
const Route$8 = createFileRoute("/orders")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  head: () => ({
    meta: [{
      title: "Orders | AuraSport"
    }, {
      name: "description",
      content: "Review order history from the AuraSport backend."
    }]
  })
});
const $$splitComponentImporter$7 = () => import("./help-V_YpriGC.mjs");
const Route$7 = createFileRoute("/help")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
  head: () => ({
    meta: [{
      title: "Help | AuraSport"
    }, {
      name: "description",
      content: "Get support for orders, contact details, and AuraSport request follow-up."
    }]
  })
});
const $$splitComponentImporter$6 = () => import("./cart-f87wfz7G.mjs");
const Route$6 = createFileRoute("/cart")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  head: () => ({
    meta: [{
      title: "Cart | AuraSport"
    }, {
      name: "description",
      content: "Review your AuraSport cart and place a manual order request through the backend."
    }]
  })
});
const $$splitComponentImporter$5 = () => import("./auth-_qCdJujr.mjs");
const searchSchema = objectType({
  mode: enumType(["signin", "signup"]).optional(),
  redirect: stringType().optional()
});
const Route$5 = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{
      title: "Sign in | AuraSport"
    }, {
      name: "description",
      content: "Create an AuraSport account or sign in using the connected backend API."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-CtqBPfef.mjs");
const Route$4 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "AuraSport | Move Beyond Limits"
    }, {
      name: "description",
      content: "Premium sportswear and lifestyle apparel engineered for athletes who refuse limits."
    }, {
      property: "og:title",
      content: "AuraSport | Move Beyond Limits"
    }, {
      property: "og:description",
      content: "Premium sportswear and lifestyle apparel engineered for athletes who refuse limits."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./shop._productId-CZ_Wr6tO.mjs");
const Route$3 = createFileRoute("/shop/$productId")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  head: () => ({
    meta: [{
      title: "Product | AuraSport"
    }, {
      name: "description",
      content: "Explore one AuraSport product in detail and add it to your request cart."
    }]
  })
});
const $$splitComponentImporter$2 = () => import("./orders._orderId-CbS21yhs.mjs");
const Route$2 = createFileRoute("/orders/$orderId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  head: () => ({
    meta: [{
      title: "Order Request | AuraSport"
    }, {
      name: "description",
      content: "Review one AuraSport order request in full detail."
    }]
  })
});
const $$splitComponentImporter$1 = () => import("./admin.orders-Bx1wpbQt.mjs");
const Route$1 = createFileRoute("/admin/orders")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  head: () => ({
    meta: [{
      title: "Admin Orders | AuraSport"
    }, {
      name: "description",
      content: "Review and update AuraSport order requests."
    }]
  })
});
const $$splitComponentImporter = () => import("./admin.catalog-DPh6zhjz.mjs");
const Route = createFileRoute("/admin/catalog")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  head: () => ({
    meta: [{
      title: "Admin Catalog | AuraSport"
    }, {
      name: "description",
      content: "Manage AuraSport products and categories."
    }]
  })
});
const WishlistRoute = Route$b.update({
  id: "/wishlist",
  path: "/wishlist",
  getParentRoute: () => Route$c
});
const ShopRoute = Route$a.update({
  id: "/shop",
  path: "/shop",
  getParentRoute: () => Route$c
});
const ProfileRoute = Route$9.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$c
});
const OrdersRoute = Route$8.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => Route$c
});
const HelpRoute = Route$7.update({
  id: "/help",
  path: "/help",
  getParentRoute: () => Route$c
});
const CartRoute = Route$6.update({
  id: "/cart",
  path: "/cart",
  getParentRoute: () => Route$c
});
const AuthRoute = Route$5.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$c
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$c
});
const ShopProductIdRoute = Route$3.update({
  id: "/$productId",
  path: "/$productId",
  getParentRoute: () => ShopRoute
});
const OrdersOrderIdRoute = Route$2.update({
  id: "/$orderId",
  path: "/$orderId",
  getParentRoute: () => OrdersRoute
});
const AdminOrdersRoute = Route$1.update({
  id: "/admin/orders",
  path: "/admin/orders",
  getParentRoute: () => Route$c
});
const AdminCatalogRoute = Route.update({
  id: "/admin/catalog",
  path: "/admin/catalog",
  getParentRoute: () => Route$c
});
const OrdersRouteChildren = {
  OrdersOrderIdRoute
};
const OrdersRouteWithChildren = OrdersRoute._addFileChildren(OrdersRouteChildren);
const ShopRouteChildren = {
  ShopProductIdRoute
};
const ShopRouteWithChildren = ShopRoute._addFileChildren(ShopRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthRoute,
  CartRoute,
  HelpRoute,
  OrdersRoute: OrdersRouteWithChildren,
  ProfileRoute,
  ShopRoute: ShopRouteWithChildren,
  WishlistRoute,
  AdminCatalogRoute,
  AdminOrdersRoute
};
const routeTree = Route$c._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$3 as R,
  apiRequest as a,
  Route$2 as b,
  getImageUrl as g,
  router as r,
  useAuth as u
};
