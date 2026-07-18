import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Heart, Loader2, Search, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, type Category, getImageUrl, type Product } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { useWishlist } from "@/lib/useWishlist";

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
  const queryClient = useQueryClient();
  const { token, user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");

  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: () => apiRequest<Product[]>("/products"),
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiRequest<Category[]>("/categories"),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest("/cart/items", {
        method: "POST",
        token,
        body: { product_id: productId, quantity: 1 },
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Added to cart");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not add to cart");
    },
    onSettled: () => {
      setSubmittingId(null);
    },
  });

  useEffect(() => {
    if (productsQuery.error || categoriesQuery.error) {
      const error = productsQuery.error ?? categoriesQuery.error;
      toast.error(error instanceof Error ? error.message : "Could not load catalog");
    }
  }, [categoriesQuery.error, productsQuery.error]);

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const loading = productsQuery.isLoading || categoriesQuery.isLoading;

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        category === "all" || product.category?.name.toLowerCase() === category.toLowerCase();
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-60" && product.price < 60) ||
        (priceRange === "60-100" && product.price >= 60 && product.price <= 100) ||
        (priceRange === "above-100" && product.price > 100);
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

  async function addToCart(productId: number) {
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/shop" } });
      return;
    }

    setSubmittingId(productId);
    addToCartMutation.mutate(productId);
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

        <section className="mt-10 grid gap-4 rounded-[2rem] border border-white/10 bg-card/50 p-5 md:grid-cols-2 xl:grid-cols-[1.2fr_220px_220px_220px]">
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
          <select
            value={priceRange}
            onChange={(event) => setPriceRange(event.target.value)}
            className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none"
          >
            <option value="all">All prices</option>
            <option value="under-60">Under $60</option>
            <option value="60-100">$60 to $100</option>
            <option value="above-100">Above $100</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </section>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{filteredProducts.length} products</span>
          {(search || category !== "all" || priceRange !== "all" || sort !== "featured") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setPriceRange("all");
                setSort("featured");
              }}
              className="rounded-full border border-white/10 px-4 py-2 font-medium text-foreground transition hover:bg-white/5"
            >
              Clear filters
            </button>
          )}
        </div>

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
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const nowSaved = toggleWishlist(product.id);
                        toast.success(nowSaved ? "Saved to wishlist" : "Removed from wishlist");
                      }}
                      className={`grid h-12 w-12 place-items-center rounded-full border transition ${
                        isWishlisted(product.id)
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-white/10 text-foreground hover:bg-white/5"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-current" : ""}`} />
                    </button>
                    <Link
                      to="/shop/$productId"
                      params={{ productId: String(product.id) }}
                      className="flex-1 rounded-full border border-white/10 px-5 py-3 text-center text-sm font-semibold transition hover:bg-white/5"
                    >
                      View details
                    </Link>
                    <button
                      onClick={() => void addToCart(product.id)}
                      disabled={submittingId === product.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
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
