import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { apiRequest, type AuthTokenResponse, type BackendUser } from "@/lib/api";

const STORAGE_KEY = "aurasport.auth";

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
};

type AuthCtx = {
  user: BackendUser | null;
  token: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: BackendUser | null) => void;
};

const Ctx = createContext<AuthCtx>({
  user: null,
  token: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
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

  async function fetchCurrentUser(authToken: string): Promise<BackendUser> {
    return apiRequest<BackendUser>("/auth/me", { token: authToken });
  }

  async function applyTokenResponse(response: AuthTokenResponse) {
    const currentUser = await fetchCurrentUser(response.access_token);
    persistSession(response.access_token, currentUser);
  }

  async function refreshUser() {
    if (!token) {
      persistSession(null, null);
      return;
    }

    try {
      const currentUser = await fetchCurrentUser(token);
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
          const response = await apiRequest<AuthTokenResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
          });
          await applyTokenResponse(response);
        },
        signUp: async ({ name, email, password }) => {
          await apiRequest<BackendUser>("/auth/register", {
            method: "POST",
            body: { name, email, password },
          });
          const response = await apiRequest<AuthTokenResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
          });
          await applyTokenResponse(response);
        },
        signOut: async () => {
          persistSession(null, null);
          window.dispatchEvent(new Event("aurasport-cart-updated"));
        },
        refreshUser,
        setUser: (nextUser) => persistSession(token, nextUser),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
