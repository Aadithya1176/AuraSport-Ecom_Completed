import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { useEffect, useState, type FormEvent, type InputHTMLAttributes, type ReactNode } from "react";
import { toast } from "sonner";
import { z } from "zod";

import authSide from "@/assets/auth-side.jpg";
import { useAuth } from "@/lib/useAuth";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
  redirect: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

const signUpSchema = z.object({
  username: z.string().trim().min(3, "At least 3 characters").max(50),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in | AuraSport" },
      {
        name: "description",
        content: "Create an AuraSport account or sign in using the connected backend API.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: search.redirect ?? "/", replace: true });
    }
  }, [loading, navigate, search.redirect, user]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const raw = Object.fromEntries(formData.entries());
    const schema = mode === "signin" ? signInSchema : signUpSchema;
    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signin") {
        const credentials = parsed.data as z.infer<typeof signInSchema>;
        await signIn(credentials.email, credentials.password);
        toast.success("Welcome back");
      } else {
        const registration = parsed.data as z.infer<typeof signUpSchema>;
        await signUp(registration);
        toast.success("Account created");
      }
      navigate({ to: search.redirect ?? "/shop", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-background text-foreground lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={authSide}
          alt="AuraSport athlete"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-black text-primary-foreground">
              A
            </span>
            <span className="text-base font-bold uppercase tracking-[0.18em]">
              Aura<span className="text-primary">Sport</span>
            </span>
          </Link>

          <div className="max-w-md">
            <div className="text-[10px] font-medium uppercase tracking-[0.3em] text-primary">
              Backend Connected
            </div>
            <h2 className="mt-4 text-balance text-5xl font-black leading-[0.95] tracking-[-0.03em]">
              Real auth for the <span className="italic font-light text-primary">full store flow.</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Sign in once, then shop, cart, and order history all use the FastAPI backend.
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="pointer-events-none absolute -top-20 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[160px]" />
        <div className="relative w-full max-w-md">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground lg:hidden"
          >
            Back to AuraSport
          </Link>

          <div className="mb-2 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] text-muted-foreground">
            <span className="h-px w-10 bg-primary" />
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </div>

          <AnimatePresence mode="wait">
            <motion.h1
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-balance text-4xl font-black leading-[1.05] tracking-[-0.03em] md:text-5xl"
            >
              {mode === "signin" ? (
                <>
                  Sign in to <span className="italic font-light text-primary">AuraSport.</span>
                </>
              ) : (
                <>
                  Create your <span className="italic font-light text-primary">account.</span>
                </>
              )}
            </motion.h1>
          </AnimatePresence>

          <div className="mt-8 inline-flex rounded-full border border-white/10 bg-card/60 p-1 backdrop-blur">
            {(["signin", "signup"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`relative rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider transition ${
                  mode === tab ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode === tab ? (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 -z-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : null}
                <span className="relative z-10">{tab === "signin" ? "Sign In" : "Sign Up"}</span>
              </button>
            ))}
          </div>

          <form key={mode} onSubmit={onSubmit} className="mt-8 space-y-4">
            {mode === "signup" ? (
              <Field
                icon={<UserIcon className="h-4 w-4" />}
                name="username"
                type="text"
                placeholder="Username"
                autoComplete="username"
              />
            ) : null}
            <Field
              icon={<Mail className="h-4 w-4" />}
              name="email"
              type="email"
              placeholder="you@email.com"
              autoComplete="email"
            />
            <Field
              icon={<Lock className="h-4 w-4" />}
              name="password"
              type={showPw ? "text" : "password"}
              placeholder="Password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPw((value) => !value)}
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={submitting}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-bold uppercase tracking-wider text-primary-foreground transition hover:scale-[1.01] hover:shadow-[0_0_40px_-8px_rgba(212,255,0,0.6)] disabled:opacity-60 disabled:hover:scale-100"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            This screen now talks directly to the AuraSport backend instead of Supabase.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  suffix,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { icon: ReactNode; suffix?: ReactNode }) {
  return (
    <label className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-4 py-3.5 backdrop-blur transition focus-within:border-primary/60 focus-within:bg-card">
      <span className="text-muted-foreground transition group-focus-within:text-primary">{icon}</span>
      <input
        {...props}
        required
        className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
      />
      {suffix}
    </label>
  );
}
