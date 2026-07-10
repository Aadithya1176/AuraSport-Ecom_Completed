import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { apiRequest, type AuthResponse, type BackendUser } from "@/lib/api";

const STORAGE_KEY = "aurasport.auth";

type AuthCtx = {
  user: BackendUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: { username: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function persistSession(nextToken: string | null, nextUser: BackendUser | null) {
    setToken(nextToken);
    setUser(nextUser);

    if (typeof window === "undefined") {
      return;
    }

    if (!nextToken || !nextUser) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, user: nextUser }),
    );
  }

  async function applyAuthResponse(response: AuthResponse) {
    persistSession(response.access_token, response.user);
  }

  async function refreshUser() {
    if (!token) {
      persistSession(null, null);
      return;
    }

    try {
      const currentUser = await apiRequest<BackendUser>("/me", { token });
      persistSession(token, currentUser);
    } catch {
      persistSession(null, null);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as { token?: string; user?: BackendUser };
      if (parsed.token && parsed.user) {
        setToken(parsed.token);
        setUser(parsed.user);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    void refreshUser();
  }, [token]);

  return (
    <Ctx.Provider
      value={{
        user,
        token,
        loading,
        signIn: async (email, password) => {
          const response = await apiRequest<AuthResponse>("/login", {
            method: "POST",
            body: { email, password },
          });
          await applyAuthResponse(response);
        },
        signUp: async ({ username, email, password }) => {
          await apiRequest<BackendUser>("/register", {
            method: "POST",
            body: { username, email, password },
          });
          const response = await apiRequest<AuthResponse>("/login", {
            method: "POST",
            body: { email, password },
          });
          await applyAuthResponse(response);
        },
        signOut: async () => {
          persistSession(null, null);
          window.dispatchEvent(new Event("aurasport-cart-updated"));
        },
        refreshUser,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
