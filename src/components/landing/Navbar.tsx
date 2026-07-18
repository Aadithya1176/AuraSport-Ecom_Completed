import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, LogOut, ReceiptText, Search, ShoppingBag, Shield, User, Menu, X } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { apiRequest, type Cart } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

const links = [
  { label: "Home", to: "/" as const },
  { label: "Shop", to: "/shop" as const },
  { label: "Cart", to: "/cart" as const },
  { label: "Orders", to: "/orders" as const },
  { label: "Wishlist", to: "/wishlist" as const },
  { label: "Help", to: "/help" as const },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, token, signOut } = useAuth();
  const cartQuery = useQuery({
    queryKey: ["cart", token],
    queryFn: () => apiRequest<Cart>("/cart", { token }),
    enabled: Boolean(token),
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onCartUpdated = () => void cartQuery.refetch();
    window.addEventListener("aurasport-cart-updated", onCartUpdated);
    return () => window.removeEventListener("aurasport-cart-updated", onCartUpdated);
  }, [cartQuery]);

  const cartCount = cartQuery.data?.total_items ?? 0;

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={`flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 px-6 py-3 transition-all duration-500 ${
          scrolled
            ? "bg-background/70 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
            : "bg-white/[0.03] backdrop-blur-md"
        }`}
      >
        <Link to="/" className="group flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">
            A
          </span>
          <span className="text-base font-bold uppercase tracking-[0.18em]">
            Aura<span className="text-primary">Sport</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <Link
            to="/shop"
            aria-label="Search catalog"
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>

          {user ? (
            <button
              type="button"
              aria-label="Account"
              onClick={() => navigate({ to: "/orders" })}
              className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
            >
              <User className="h-4 w-4" />
            </button>
          ) : (
            <Link
              to="/auth"
              aria-label="Account"
              className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
            >
              <User className="h-4 w-4" />
            </Link>
          )}

          <Link
            to="/cart"
            aria-label="Cart"
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </div>
          </Link>

          {user ? (
            <>
              {false ? (
                <>
                  <Link
                    to="/admin/catalog"
                    aria-label="Admin catalog"
                    className="hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex"
                  >
                    <Shield className="h-4 w-4" />
                    Catalog
                  </Link>
                  <Link
                    to="/admin/orders"
                    aria-label="Admin orders"
                    className="hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex"
                  >
                    <Shield className="h-4 w-4" />
                    Requests
                  </Link>
                </>
              ) : null}
              <Link
                to="/profile"
                aria-label="Profile"
                className="hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex"
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              <Link
                to="/orders"
                aria-label="Orders"
                className="hidden h-9 items-center gap-2 rounded-full border border-white/10 px-4 text-xs font-semibold uppercase tracking-wider text-foreground/80 transition hover:bg-white/10 md:inline-flex"
              >
                <ReceiptText className="h-4 w-4" />
                Orders
              </Link>
              <button
                onClick={() => void signOut()}
                className="ml-2 hidden items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wider text-background transition hover:bg-primary hover:text-primary-foreground md:inline-flex"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="ml-2 hidden rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-wider text-background transition hover:bg-primary hover:text-primary-foreground md:block"
            >
              Login
            </Link>
          )}

          <button
            className="ml-1 grid h-9 w-9 place-items-center rounded-full text-foreground lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-4 right-4 top-20 rounded-3xl border border-white/10 bg-background/95 p-6 backdrop-blur-xl lg:hidden"
        >
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-lg font-semibold" onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
