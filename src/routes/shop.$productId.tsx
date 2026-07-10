import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, getImageUrl, type Product } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/shop/$productId")({
  component: ProductDetailPage,
  head: () => ({
    meta: [
      { title: "Product | AuraSport" },
      { name: "description", content: "Explore one AuraSport product in detail and add it to your request cart." },
    ],
  }),
});

function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId } = Route.useParams();
  const { token } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiRequest<Product>(`/products/${productId}`);
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
      navigate({ to: "/auth", search: { mode: "signin", redirect: `/shop/${product.id}` } });
      return;
    }

    try {
      setAdding(true);
      await apiRequest("/carts", {
        method: "POST",
        token,
        body: { product_id: product.id, qty: 1 },
      });
      window.dispatchEvent(new Event("aurasport-cart-updated"));
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not add to cart");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pb-20 pt-32">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to shop
        </Link>

        {loading ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !product ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">Product not found.</h2>
            <p className="mt-2 text-muted-foreground">This item may have been removed from the catalog.</p>
          </div>
        ) : (
          <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/60">
              <img
                src={getImageUrl(product.image_url)}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-card/70 p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">
                {product.category?.name ?? "Uncategorized"}
              </p>
              <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-5xl">{product.name}</h1>
              <div className="mt-6 text-3xl font-black">${product.price.toFixed(2)}</div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-background/30 p-5 text-sm text-muted-foreground">
                Built for the current AuraSport request flow: add this item to your cart, then submit your order request
                with delivery and contact details. No payment happens online yet.
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => void addToCart()}
                  disabled={adding}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingBag className="h-4 w-4" />}
                  Add to cart
                </button>
                <Link
                  to="/cart"
                  className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white/5"
                >
                  Go to cart
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
