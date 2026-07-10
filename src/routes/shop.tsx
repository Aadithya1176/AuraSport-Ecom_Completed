import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, type Category, getImageUrl, type Product } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/shop")({
  component: ShopPage,
  head: () => ({
    meta: [
      { title: "Shop | AuraSport" },
      { name: "description", content: "Browse the live AuraSport catalog powered by the backend API." },
    ],
  }),
});

function ShopPage() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const [productData, categoryData] = await Promise.all([
          apiRequest<Product[]>("/products"),
          apiRequest<Category[]>("/categories"),
        ]);
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

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchesCategory =
        category === "all" || product.category?.name.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }, [category, products, search]);

  async function addToCart(productId: number) {
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/shop" } });
      return;
    }

    try {
      setSubmittingId(productId);
      await apiRequest("/carts", {
        method: "POST",
        token,
        body: { product_id: productId, qty: 1 },
      });
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add to cart");
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Live Catalog</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">
              Shop the backend-connected AuraSport drop.
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Products, categories, cart, and orders are now flowing through the FastAPI backend.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-card/70 p-4 backdrop-blur">
            <div className="text-sm text-muted-foreground">Signed in as</div>
            <div className="mt-1 font-semibold">{user ? user.email : "Guest shopper"}</div>
          </div>
        </div>

        <section className="mt-10 grid gap-4 rounded-[2rem] border border-white/10 bg-card/50 p-5 md:grid-cols-[1fr_220px]">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/60 px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </section>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/70"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-primary">
                        {product.category?.name ?? "Uncategorized"}
                      </div>
                      <h2 className="mt-2 text-xl font-bold">{product.name}</h2>
                    </div>
                    <div className="text-lg font-black">${product.price.toFixed(2)}</div>
                  </div>
                  <button
                    onClick={() => void addToCart(product.id)}
                    disabled={submittingId === product.id}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                  >
                    {submittingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        Add to cart
                      </>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {!loading && filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">No products matched that filter.</h2>
            <p className="mt-2 text-muted-foreground">Try a different search or category.</p>
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            to="/cart"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            View cart
          </Link>
          <Link
            to="/orders"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Order history
          </Link>
        </div>
      </main>
    </div>
  );
}
