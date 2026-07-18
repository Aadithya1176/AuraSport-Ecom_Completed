import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";
import { useAuth } from "@/lib/useAuth";
import { Loader2 } from "lucide-react";

function IndexComponent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <Landing />;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AuraSport | Move Beyond Limits" },
      {
        name: "description",
        content: "Premium sportswear and lifestyle apparel engineered for athletes who refuse limits.",
      },
      { property: "og:title", content: "AuraSport | Move Beyond Limits" },
      {
        property: "og:description",
        content: "Premium sportswear and lifestyle apparel engineered for athletes who refuse limits.",
      },
    ],
  }),
  component: IndexComponent,
});
