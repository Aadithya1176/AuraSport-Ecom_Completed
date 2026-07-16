import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-BtcMQACq.mjs";
import { R as Route$3, u as useAuth, g as getImageUrl, a as apiRequest } from "./router-2nadxSUO.mjs";
import { u as useWishlist } from "./useWishlist-D9sSZ1cs.mjs";
import { k as ArrowLeft, L as LoaderCircle, H as Heart, S as ShoppingBag } from "../_libs/lucide-react.mjs";
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
function ProductDetailPage() {
  const navigate = useNavigate();
  const {
    productId
  } = Route$3.useParams();
  const {
    token
  } = useAuth();
  const {
    isWishlisted,
    toggleWishlist
  } = useWishlist();
  const [product, setProduct] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [adding, setAdding] = reactExports.useState(false);
  reactExports.useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest(`/products/${productId}`);
        setProduct(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load product");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [productId]);
  async function addToCart() {
    if (!product) {
      return;
    }
    if (!token) {
      navigate({
        to: "/auth",
        search: {
          mode: "signin",
          redirect: `/shop/${product.id}`
        }
      });
      return;
    }
    try {
      setAdding(true);
      await apiRequest("/carts", {
        method: "POST",
        token,
        body: {
          product_id: product.id,
          qty: 1
        }
      });
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add to cart");
    } finally {
      setAdding(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-6xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/shop", className: "inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        "Back to shop"
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[50vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : !product ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "Product not found." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "This item may have been removed from the catalog." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-[2rem] border border-white/10 bg-card/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageUrl(product.image_url), alt: product.name, className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: product.category?.name ?? "Uncategorized" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl", children: product.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 text-3xl font-black", children: [
            "$",
            product.price.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-[1.5rem] border border-white/10 bg-background/30 p-5 text-sm text-muted-foreground", children: "Built for the current AuraSport request flow: add this item to your cart, then submit your order request with delivery and contact details. No payment happens online yet." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              if (!product) {
                return;
              }
              const nowSaved = toggleWishlist(product.id);
              toast.success(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
            }, className: `inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition ${product && isWishlisted(product.id) ? "border-primary/30 bg-primary/10 text-primary" : "border-white/10 hover:bg-white/5"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-4 w-4 ${product && isWishlisted(product.id) ? "fill-current" : ""}` }),
              product && isWishlisted(product.id) ? "Saved" : "Save"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => void addToCart(), disabled: adding, className: "inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: [
              adding ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
              "Add to cart"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", className: "rounded-full border border-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Go to cart" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ProductDetailPage as component
};
