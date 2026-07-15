import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
import { u as useAuth, g as getImageUrl, a as apiRequest } from "./router-rVUETYds.mjs";
import { u as useWishlist } from "./useWishlist-D9sSZ1cs.mjs";
import { a as Search, L as LoaderCircle, H as Heart, S as ShoppingBag } from "../_libs/lucide-react.mjs";
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
function ShopPage() {
  const navigate = useNavigate();
  const {
    token,
    user
  } = useAuth();
  const {
    isWishlisted,
    toggleWishlist
  } = useWishlist();
  const [products, setProducts] = reactExports.useState([]);
  const [categories, setCategories] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [submittingId, setSubmittingId] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("all");
  const [sort, setSort] = reactExports.useState("featured");
  const [priceRange, setPriceRange] = reactExports.useState("all");
  reactExports.useEffect(() => {
    async function load() {
      try {
        const [productData, categoryData] = await Promise.all([apiRequest("/products"), apiRequest("/categories")]);
        setProducts(productData);
        setCategories(categoryData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load catalog");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);
  const filteredProducts = reactExports.useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === "all" || product.category?.name.toLowerCase() === category.toLowerCase();
      const matchesPrice = priceRange === "all" || priceRange === "under-60" && product.price < 60 || priceRange === "60-100" && product.price >= 60 && product.price <= 100 || priceRange === "above-100" && product.price > 100;
      return matchesSearch && matchesCategory && matchesPrice;
    });
    if (sort === "price-low") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-high") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sort === "name") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  }, [category, priceRange, products, search, sort]);
  async function addToCart(productId) {
    if (!token) {
      navigate({
        to: "/auth",
        search: {
          mode: "signin",
          redirect: "/shop"
        }
      });
      return;
    }
    try {
      setSubmittingId(productId);
      await apiRequest("/carts", {
        method: "POST",
        token,
        body: {
          product_id: productId,
          qty: 1
        }
      });
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add to cart");
    } finally {
      setSubmittingId(null);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-6 pb-20 pt-32", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Live Catalog" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: "Shop the backend-connected AuraSport drop." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-base text-muted-foreground", children: "Products, categories, cart, and orders are now flowing through the FastAPI backend." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/10 bg-card/70 p-4 backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "Signed in as" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-semibold", children: user ? user.email : "Guest shopper" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10 grid gap-4 rounded-[2rem] border border-white/10 bg-card/50 p-5 md:grid-cols-2 xl:grid-cols-[1.2fr_220px_220px_220px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 rounded-2xl border border-white/10 bg-background/60 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: search, onChange: (event) => setSearch(event.target.value), placeholder: "Search products", className: "w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: category, onChange: (event) => setCategory(event.target.value), className: "rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All categories" }),
          categories.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: item.name, children: item.name }, item.id))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: priceRange, onChange: (event) => setPriceRange(event.target.value), className: "rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "All prices" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "under-60", children: "Under $60" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "60-100", children: "$60 to $100" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "above-100", children: "Above $100" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: sort, onChange: (event) => setSort(event.target.value), className: "rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "featured", children: "Featured" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price-low", children: "Price: low to high" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "price-high", children: "Price: high to low" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name", children: "Name: A to Z" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          filteredProducts.length,
          " products"
        ] }),
        (search || category !== "all" || priceRange !== "all" || sort !== "featured") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
          setSearch("");
          setCategory("all");
          setPriceRange("all");
          setSort("featured");
        }, className: "rounded-full border border-white/10 px-4 py-2 font-medium text-foreground transition hover:bg-white/5", children: "Clear filters" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-[40vh] items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3", children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "overflow-hidden rounded-[2rem] border border-white/10 bg-card/70", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/5] overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageUrl(product.image_url), alt: product.name, className: "h-full w-full object-cover transition duration-500 hover:scale-105" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-[0.25em] text-primary", children: product.category?.name ?? "Uncategorized" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-xl font-bold", children: product.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-black", children: [
              "$",
              product.price.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
              const nowSaved = toggleWishlist(product.id);
              toast.success(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
            }, className: `grid h-12 w-12 place-items-center rounded-full border transition ${isWishlisted(product.id) ? "border-primary/30 bg-primary/10 text-primary" : "border-white/10 text-foreground hover:bg-white/5"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: `h-4 w-4 ${isWishlisted(product.id) ? "fill-current" : ""}` }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/shop/$productId", params: {
              productId: String(product.id)
            }, className: "flex-1 rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold transition hover:bg-white/5", children: "View details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void addToCart(product.id), disabled: submittingId === product.id, className: "flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60", children: submittingId === product.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4" }),
              "Add to cart"
            ] }) })
          ] })
        ] })
      ] }, product.id)) }),
      !loading && filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold", children: "No products matched that filter." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Try a different search or category." })
      ] }) : null,
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 flex flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/cart", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "View cart" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Order history" })
      ] })
    ] })
  ] });
}
export {
  ShopPage as component
};
