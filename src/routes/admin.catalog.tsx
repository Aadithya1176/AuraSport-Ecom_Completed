import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, getImageUrl, type Category, type Product } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/admin/catalog")({
  component: AdminCatalogPage,
  head: () => ({
    meta: [
      { title: "Admin Catalog | AuraSport" },
      { name: "description", content: "Manage AuraSport products and categories." },
    ],
  }),
});

type ProductDraft = {
  name: string;
  price: string;
  categoryId: string;
  imageFile: File | null;
};

const emptyProductDraft: ProductDraft = {
  name: "",
  price: "",
  categoryId: "",
  imageFile: null,
};

function AdminCatalogPage() {
  const navigate = useNavigate();
  const { token, user, loading } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const [productDraft, setProductDraft] = useState<ProductDraft>(emptyProductDraft);
  const [busyCategoryId, setBusyCategoryId] = useState<number | null>(null);
  const [busyProductId, setBusyProductId] = useState<number | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/admin/catalog" } });
      return;
    }
    if (user?.role !== "admin") {
      toast.error("Admin access required");
      navigate({ to: "/" });
      return;
    }

    async function load() {
      try {
        const [categoryData, productData] = await Promise.all([
          apiRequest<Category[]>("/categories", { token }),
          apiRequest<Product[]>("/products?limit=100", { token }),
        ]);
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
    const [categoryData, productData] = await Promise.all([
      apiRequest<Category[]>("/categories", { token }),
      apiRequest<Product[]>("/products?limit=100", { token }),
    ]);
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
      await apiRequest<Category>("/categories", {
        method: "POST",
        token,
        body: { name: categoryName.trim() },
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

  async function updateCategory(categoryId: number, name: string) {
    if (!token || !name.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      setBusyCategoryId(categoryId);
      await apiRequest<Category>(`/categories/${categoryId}`, {
        method: "PUT",
        token,
        body: { name: name.trim() },
      });
      await reloadCatalog();
      toast.success("Category updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update category");
    } finally {
      setBusyCategoryId(null);
    }
  }

  async function deleteCategory(categoryId: number) {
    if (!token) {
      return;
    }

    try {
      setBusyCategoryId(categoryId);
      await apiRequest<{ message: string }>(`/categories/${categoryId}`, {
        method: "DELETE",
        token,
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
      await apiRequest<Product>("/products", {
        method: "POST",
        token,
        body: formData,
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
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center pt-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Admin</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Catalog management.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Create categories, add products, upload images, and update the storefront without touching Swagger.
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Manage requests
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">New Category</p>
              <div className="mt-5 flex gap-3">
                <input
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Training"
                  className="flex-1 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => void createCategory()}
                  disabled={creatingCategory}
                  className="rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
                >
                  {creatingCategory ? "Saving..." : "Add"}
                </button>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Categories</p>
              <div className="mt-5 space-y-4">
                {categories.map((category) => (
                  <CategoryEditor
                    key={category.id}
                    category={category}
                    saving={busyCategoryId === category.id}
                    onSave={(name) => void updateCategory(category.id, name)}
                    onDelete={() => void deleteCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">New Product</p>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <Field
                  label="Product name"
                  value={productDraft.name}
                  onChange={(value) => setProductDraft((current) => ({ ...current, name: value }))}
                  placeholder="Velocity Sprint Tee"
                />
                <Field
                  label="Price"
                  value={productDraft.price}
                  onChange={(value) => setProductDraft((current) => ({ ...current, price: value }))}
                  placeholder="49"
                />
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
                <label className="space-y-2">
                  <span className="text-sm font-medium">Category</span>
                  <select
                    value={productDraft.categoryId}
                    onChange={(event) =>
                      setProductDraft((current) => ({ ...current, categoryId: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none"
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={String(category.id)}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-medium">Image</span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(event) =>
                      setProductDraft((current) => ({
                        ...current,
                        imageFile: event.target.files?.[0] ?? null,
                      }))
                    }
                    className="block rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm"
                  />
                </label>
              </div>
              <button
                onClick={() => void createProduct()}
                disabled={creatingProduct}
                className="mt-5 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-60"
              >
                {creatingProduct ? "Creating..." : "Create product"}
              </button>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-card/70 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Products</p>
              <div className="mt-5 space-y-5">
                {products.map((product) => (
                  <ProductEditor
                    key={product.id}
                    product={product}
                    categories={categories}
                    saving={busyProductId === product.id}
                    onSave={async (draft) => {
                      if (!token) return;
                      try {
                        setBusyProductId(product.id);
                        const formData = new FormData();
                        if (draft.name.trim()) formData.set("name", draft.name.trim());
                        if (draft.price.trim()) formData.set("price", draft.price.trim());
                        if (draft.categoryId) formData.set("category_id", draft.categoryId);
                        if (draft.imageFile) formData.set("image", draft.imageFile);

                        await apiRequest<Product>(`/products/${product.id}`, {
                          method: "PATCH",
                          token,
                          body: formData,
                        });
                        await reloadCatalog();
                        toast.success("Product updated");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Could not update product");
                      } finally {
                        setBusyProductId(null);
                      }
                    }}
                    onDelete={async () => {
                      if (!token) return;
                      try {
                        setBusyProductId(product.id);
                        await apiRequest<{ message: string }>(`/products/${product.id}`, {
                          method: "DELETE",
                          token,
                        });
                        await reloadCatalog();
                        toast.success("Product deleted");
                      } catch (error) {
                        toast.error(error instanceof Error ? error.message : "Could not delete product");
                      } finally {
                        setBusyProductId(null);
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function CategoryEditor({
  category,
  saving,
  onSave,
  onDelete,
}: {
  category: Category;
  saving: boolean;
  onSave: (name: string) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(category.name);

  useEffect(() => {
    setName(category.name);
  }, [category.name]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-white/10 bg-background/40 p-4">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="min-w-48 flex-1 rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none"
      />
      <button
        onClick={() => onSave(name)}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-60"
      >
        <Pencil className="h-3.5 w-3.5" />
        Save
      </button>
      <button
        onClick={onDelete}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-destructive disabled:opacity-60"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
    </div>
  );
}

function ProductEditor({
  product,
  categories,
  saving,
  onSave,
  onDelete,
}: {
  product: Product;
  categories: Category[];
  saving: boolean;
  onSave: (draft: ProductDraft) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState<ProductDraft>({
    name: product.name,
    price: String(product.price),
    categoryId: product.category ? String(product.category.id) : "",
    imageFile: null,
  });

  useEffect(() => {
    setDraft({
      name: product.name,
      price: String(product.price),
      categoryId: product.category ? String(product.category.id) : "",
      imageFile: null,
    });
  }, [product]);

  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-background/40 p-4">
      <div className="grid gap-4 lg:grid-cols-[120px_1fr]">
        <img
          src={getImageUrl(product.image_url)}
          alt={product.name}
          className="h-28 w-28 rounded-[1.25rem] object-cover"
        />
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Name"
              value={draft.name}
              onChange={(value) => setDraft((current) => ({ ...current, name: value }))}
              placeholder="Product name"
            />
            <Field
              label="Price"
              value={draft.price}
              onChange={(value) => setDraft((current) => ({ ...current, price: value }))}
              placeholder="Price"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="space-y-2">
              <span className="text-sm font-medium">Category</span>
              <select
                value={draft.categoryId}
                onChange={(event) => setDraft((current) => ({ ...current, categoryId: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none"
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium">Replace image</span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    imageFile: event.target.files?.[0] ?? null,
                  }))
                }
                className="block rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onSave(draft)}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] disabled:opacity-60"
            >
              <Pencil className="h-3.5 w-3.5" />
              Save product
            </button>
            <button
              onClick={onDelete}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-destructive/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-destructive disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}
