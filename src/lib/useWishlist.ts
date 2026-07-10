import { useEffect, useState } from "react";

const STORAGE_KEY = "aurasport.wishlist";

function readWishlist(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is number => typeof value === "number");
  } catch {
    return [];
  }
}

function writeWishlist(next: number[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("aurasport-wishlist-updated"));
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    setWishlist(readWishlist());

    const sync = () => setWishlist(readWishlist());
    window.addEventListener("aurasport-wishlist-updated", sync);
    return () => window.removeEventListener("aurasport-wishlist-updated", sync);
  }, []);

  function toggleWishlist(productId: number) {
    const current = readWishlist();
    const exists = current.includes(productId);
    const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
    writeWishlist(next);
    setWishlist(next);
    return !exists;
  }

  return {
    wishlist,
    isWishlisted: (productId: number) => wishlist.includes(productId),
    toggleWishlist,
  };
}
