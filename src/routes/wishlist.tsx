import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, getImageUrl, type Product } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";
import { useWishlist } from "@/lib/useWishlist";

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
  head: () => ({
    meta: [
      { title: "Wishlist | AuraSport" },
      { name: "description", content: "Review saved AuraSport products and move them into your cart." },
    ],
  }),
});

function WishlistPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const productData = await apiRequest<Product[]>("/products");
        setProducts(productData);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Could not load wishlist");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  const savedProducts = useMemo(
    () => products.filter((product) => wishlist.includes(product.id)),
    [products, wishlist],
  );

  async function addToCart(productId: number) {
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/wishlist" } });
      return;
    }

    try {
      setBusyId(productId);
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
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Wishlist</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Saved products.</h1>
            <p className="mt-4 text-muted-foreground">
              Keep track of the items you may want to request later, then move them into cart when ready.
            </p>
          </div>
          <Link
            to="/shop"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Back to shop
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : savedProducts.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">Your wishlist is empty.</h2>
            <p className="mt-2 text-muted-foreground">Save products from the shop to keep them here.</p>
          </div>
        ) : (
          <section className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {savedProducts.map((product) => (
              <article key={product.id} className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/70">
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={getImageUrl(product.image_url)}
                    alt={product.name}
                    className="h-full w-full object-cover"
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
                      onClick={() => {
                        toggleWishlist(product.id);
                        toast.success("Removed from wishlist");
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                      Saved
                    </button>
                    <button
                      onClick={() => void addToCart(product.id)}
                      disabled={busyId === product.id}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                    >
                      {busyId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
