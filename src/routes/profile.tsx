import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Navbar } from "@/components/landing/Navbar";
import { apiRequest, type BackendUser } from "@/lib/api";
import { useAuth } from "@/lib/useAuth";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "Profile | AuraSport" },
      { name: "description", content: "Save your profile and delivery details for faster AuraSport requests." },
    ],
  }),
});

type ProfileForm = {
  full_name: string;
  phone_number: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  preferred_contact: "whatsapp" | "call" | "email";
};

function ProfilePage() {
  const navigate = useNavigate();
  const { token, user, setUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    full_name: "",
    phone_number: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    preferred_contact: "whatsapp",
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm({
      full_name: user.full_name || "",
      phone_number: user.phone_number || "",
      address_line: user.address_line || "",
      city: user.city || "",
      state: user.state || "",
      postal_code: user.postal_code || "",
      preferred_contact: user.preferred_contact || "whatsapp",
    });
  }, [user]);

  function updateForm<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProfile() {
    if (!token) {
      navigate({ to: "/auth", search: { mode: "signin", redirect: "/profile" } });
      return;
    }

    try {
      setSaving(true);
      const updatedUser = await apiRequest<BackendUser>("/me", {
        method: "PATCH",
        token,
        body: form,
      });
      setUser(updatedUser);
      toast.success("Profile saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 pb-20 pt-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary">Profile</p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] md:text-6xl">Saved delivery details.</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Keep your name, address, and preferred contact method ready so checkout becomes one quick confirmation.
            </p>
          </div>
          <Link
            to="/cart"
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
          >
            Go to cart
          </Link>
        </div>

        {!token ? (
          <div className="mt-10 rounded-[2rem] border border-dashed border-white/10 p-10 text-center">
            <h2 className="text-2xl font-semibold">You need to sign in first.</h2>
            <p className="mt-2 text-muted-foreground">Your saved profile is tied to your AuraSport account.</p>
            <Link
              to="/auth"
              search={{ mode: "signin", redirect: "/profile" }}
              className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <section className="mt-10 rounded-[2rem] border border-white/10 bg-card/70 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                label="Full name"
                value={form.full_name}
                onChange={(value) => updateForm("full_name", value)}
                placeholder="Aadithya Raj"
              />
              <FormField
                label="Phone number"
                value={form.phone_number}
                onChange={(value) => updateForm("phone_number", value)}
                placeholder="9876543210"
              />
            </div>
            <div className="mt-4 grid gap-4">
              <FormField
                label="Address"
                value={form.address_line}
                onChange={(value) => updateForm("address_line", value)}
                placeholder="12 Lake View Road"
              />
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  label="City"
                  value={form.city}
                  onChange={(value) => updateForm("city", value)}
                  placeholder="Chennai"
                />
                <FormField
                  label="State"
                  value={form.state}
                  onChange={(value) => updateForm("state", value)}
                  placeholder="Tamil Nadu"
                />
                <FormField
                  label="Postal code"
                  value={form.postal_code}
                  onChange={(value) => updateForm("postal_code", value)}
                  placeholder="600001"
                />
              </div>
              <label className="space-y-2">
                <span className="text-sm font-medium">Preferred contact method</span>
                <select
                  value={form.preferred_contact}
                  onChange={(event) =>
                    updateForm("preferred_contact", event.target.value as ProfileForm["preferred_contact"])
                  }
                  className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => void saveProfile()}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save profile
              </button>
              <Link
                to="/orders"
                className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold transition hover:bg-white/5"
              >
                View requests
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-background/70 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
      />
    </label>
  );
}
