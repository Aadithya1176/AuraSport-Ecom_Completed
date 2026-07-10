import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuraSport — Move Beyond Limits" },
      { name: "description", content: "Premium sportswear and lifestyle apparel engineered for athletes who refuse limits." },
      { property: "og:title", content: "AuraSport — Move Beyond Limits" },
      { property: "og:description", content: "Premium sportswear and lifestyle apparel engineered for athletes who refuse limits." },
    ],
  }),
  component: Landing,
});
