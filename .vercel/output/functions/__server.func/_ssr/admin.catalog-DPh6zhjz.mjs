import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Navbar } from "./Navbar-DwXv9EZ1.mjs";
import { u as useAuth, a as apiRequest, g as getImageUrl } from "./router-rVUETYds.mjs";
import { L as LoaderCircle, l as Pencil, T as Trash2 } from "../_libs/lucide-react.mjs";
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
const emptyProductDraft = {
  name: "",
  price: "",
  categoryId: "",
  imageFile: null
};
function AdminCatalogPage() {
  const navigate = useNavigate();
  const {
    token,
    user,
    loading
  } = useAuth();
  const [categories, setCategories] = reactExports.useState([]);
  const [products, setProducts] = reactExports.useState([]);
  const [pageLoading, setPageLoading] = reactExports.useState(true);
  const [categoryName, setCategoryName] = reactExports.useState("");
  const [productDraft, setProductDraft] = reactExports.useState(emptyProductDraft);
  const [busyCategoryId, setBusyCategoryId] = reactExports.useState(null);
  const [busyProductId, setBusyProductId] = reactExports.useState(null);
  const [creatingCategory, setCreatingCategory] = reactExports.useState(false);
  const [creatingProduct, setCreatingProduct] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (loading) {
      return;
    }
    if (!token) {
      navigate({
        to: "/auth",
        search: {
          mode: "signin",
          redirect: "/admin/catalog"
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
        const [categoryData, productData] = await Promise.all([apiRequest("/categories", {
          token
        }), apiRequest("/products?limit=100", {
          token
        })]);
        setCategories(categoryData);
        setProducts(productData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load catalog admin");
      } finally {
        setPageLoading(false);
      }
    }
    void load();
  }, [loading, navigate, token, user]);
  async function reloadCatalog() {
    if (!token) {
      return;
    }
    const [categoryData, productData] = await Promise.all([apiRequest("/categories", {
      token
    }), apiRequest("/products?limit=100", {
      token
    })]);
    setCategories(categoryData);
    setProducts(productData);
  }
  async function createCategory() {
    if (!token || !categoryName.trim()) {
      toast.error("Enter a category name");
      return;
    }
    try {
      setCreatingCategory(true);
      await apiRequest("/categories", {
        method: "POST",
        token,
        body: {
          name: categoryName.trim()
        }
      });
      setCategoryName("");
      await reloadCatalog();
      toast.success("Category created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create category");
    } finally {
      setCreatingCategory(false);
    }
  }
  async function updateCategory(categoryId, name) {
    if (!token || !name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }
    try {
      setBusyCategoryId(categoryId);
      await apiRequest(`/categories/${categoryId}`, {
        method: "PUT",
        token,
        body: {
          name: name.trim()
        }
      });
      await reloadCatalog();
      toast.success("Category updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update category");
    } finally {
      setBusyCategoryId(null);
    }
  }
  async function deleteCategory(categoryId) {
    if (!token) {
      return;
    }
    try {
      setBusyCategoryId(categoryId);
      await apiRequest(`/categories/${categoryId}`, {
        method: "DELETE",
        token
      });
      await reloadCatalog();
      toast.success("Category deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete category");
    } finally {
      setBusyCategoryId(null);
    }
  }
  async function createProduct() {
    if (!token || !productDraft.name.trim() || !productDraft.price.trim()) {
      toast.error("Enter at least a product name and price");
      return;
    }
    const formData = new FormData();
    formData.set("name", productDraft.name.trim());
    formData.set("price", productDraft.price.trim());
    if (productDraft.categoryId) {
      formData.set("category_id", productDraft.categoryId);
    }
    if (productDraft.imageFile) {
      formData.set("image", productDraft.imageFile);
    }
    try {
      setCreatingProduct(true);
      await apiRequest("/products", {
        method: "POST",
        token,
        body: formData
      });
      setProductDraft(emptyProductDraft);
      await reloadCatalog();
      toast.success("Product created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not create product");
    } finally {
      setCreatingProduct(false);
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl", children: "Catalog management." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-2xl text-muted-foreground", children: "Create categories, add products, upload images, and update the storefront without touching Swagger." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/admin/orders", className: "rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5", children: "Manage requests" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "New Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: categoryName, onChange: (event) => setCategoryName(event.target.value), placeholder: "Training", className: "flex-1 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void createCategory(), disabled: creatingCategory, className: "rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60", children: creatingCategory ? "Saving..." : "Add" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Categories" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-4", children: categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryEditor, { category, saving: busyCategoryId === category.id, onSave: (name) => void updateCategory(category.id, name), onDelete: () => void deleteCategory(category.id) }, category.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "New Product" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-4 md:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Product name", value: productDraft.name, onChange: (value) => setProductDraft((current) => ({
                ...current,
                name: value
              })), placeholder: "Velocity Sprint Tee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Price", value: productDraft.price, onChange: (value) => setProductDraft((current) => ({
                ...current,
                price: value
              })), placeholder: "49" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 md:grid-cols-[1fr_auto]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Category" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: productDraft.categoryId, onChange: (event) => setProductDraft((current) => ({
                  ...current,
                  categoryId: event.target.value
                })), className: "w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No category" }),
                  categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(category.id), children: category.name }, category.id))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Image" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".jpg,.jpeg,.png,.webp", onChange: (event) => setProductDraft((current) => ({
                  ...current,
                  imageFile: event.target.files?.[0] ?? null
                })), className: "block rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => void createProduct(), disabled: creatingProduct, className: "mt-5 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60", children: creatingProduct ? "Creating..." : "Create product" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[2rem] border border-white/10 bg-card/70 p-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.35em] text-primary", children: "Products" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 space-y-5", children: products.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(ProductEditor, { product, categories, saving: busyProductId === product.id, onSave: async (draft) => {
              if (!token) return;
              try {
                setBusyProductId(product.id);
                const formData = new FormData();
                if (draft.name.trim()) formData.set("name", draft.name.trim());
                if (draft.price.trim()) formData.set("price", draft.price.trim());
                if (draft.categoryId) formData.set("category_id", draft.categoryId);
                if (draft.imageFile) formData.set("image", draft.imageFile);
                await apiRequest(`/products/${product.id}`, {
                  method: "PATCH",
                  token,
                  body: formData
                });
                await reloadCatalog();
                toast.success("Product updated");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not update product");
              } finally {
                setBusyProductId(null);
              }
            }, onDelete: async () => {
              if (!token) return;
              try {
                setBusyProductId(product.id);
                await apiRequest(`/products/${product.id}`, {
                  method: "DELETE",
                  token
                });
                await reloadCatalog();
                toast.success("Product deleted");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Could not delete product");
              } finally {
                setBusyProductId(null);
              }
            } }, product.id)) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
function CategoryEditor({
  category,
  saving,
  onSave,
  onDelete
}) {
  const [name, setName] = reactExports.useState(category.name);
  reactExports.useEffect(() => {
    setName(category.name);
  }, [category.name]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-white/10 bg-background/40 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: name, onChange: (event) => setName(event.target.value), className: "min-w-48 flex-1 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSave(name), disabled: saving, className: "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
      "Save"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onDelete, disabled: saving, className: "inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-destructive disabled:opacity-60", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
      "Delete"
    ] })
  ] });
}
function ProductEditor({
  product,
  categories,
  saving,
  onSave,
  onDelete
}) {
  const [draft, setDraft] = reactExports.useState({
    name: product.name,
    price: String(product.price),
    categoryId: product.category ? String(product.category.id) : "",
    imageFile: null
  });
  reactExports.useEffect(() => {
    setDraft({
      name: product.name,
      price: String(product.price),
      categoryId: product.category ? String(product.category.id) : "",
      imageFile: null
    });
  }, [product]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[1.5rem] border border-white/10 bg-background/40 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[120px_1fr]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: getImageUrl(product.image_url), alt: product.name, className: "h-28 w-28 rounded-[1.25rem] object-cover" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", value: draft.name, onChange: (value) => setDraft((current) => ({
          ...current,
          name: value
        })), placeholder: "Product name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Price", value: draft.price, onChange: (value) => setDraft((current) => ({
          ...current,
          price: value
        })), placeholder: "Price" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-[1fr_auto]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: draft.categoryId, onChange: (event) => setDraft((current) => ({
            ...current,
            categoryId: event.target.value
          })), className: "w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "No category" }),
            categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: String(category.id), children: category.name }, category.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Replace image" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".jpg,.jpeg,.png,.webp", onChange: (event) => setDraft((current) => ({
            ...current,
            imageFile: event.target.files?.[0] ?? null
          })), className: "block rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSave(draft), disabled: saving, className: "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
          "Save product"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onDelete, disabled: saving, className: "inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-destructive disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
          "Delete"
        ] })
      ] })
    ] })
  ] }) });
}
function Field({
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
  AdminCatalogPage as component
};
