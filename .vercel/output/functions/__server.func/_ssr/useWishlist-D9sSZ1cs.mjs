import { r as reactExports } from "../_libs/react.mjs";
const STORAGE_KEY = "aurasport.wishlist";
function readWishlist() {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((value) => typeof value === "number");
  } catch {
    return [];
  }
}
function writeWishlist(next) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("aurasport-wishlist-updated"));
}
function useWishlist() {
  const [wishlist, setWishlist] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setWishlist(readWishlist());
    const sync = () => setWishlist(readWishlist());
    window.addEventListener("aurasport-wishlist-updated", sync);
    return () => window.removeEventListener("aurasport-wishlist-updated", sync);
  }, []);
  function toggleWishlist(productId) {
    const current = readWishlist();
    const exists = current.includes(productId);
    const next = exists ? current.filter((id) => id !== productId) : [...current, productId];
    writeWishlist(next);
    setWishlist(next);
    return !exists;
  }
  return {
    wishlist,
    isWishlisted: (productId) => wishlist.includes(productId),
    toggleWishlist
  };
}
export {
  useWishlist as u
};
