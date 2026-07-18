export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000/api";

export type BackendUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  category_id: number;
  category: Category;
};

export type CartItem = {
  id: number;
  product_id: number;
  quantity: number;
  line_total: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
  };
};

export type Cart = {
  id: number;
  user_id: number;
  items: CartItem[];
  total_items: number;
  total_amount: number;
};

export type OrderItem = {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  line_total: number;
  product: {
    id: number;
    name: string;
    image_url: string | null;
  };
};

export type Order = {
  id: number;
  user_id: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  total_items: number;
  total_amount: number;
};

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export type AuthTokenResponse = {
  access_token: string;
  token_type: string;
};

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | object | null;
  token?: string | null;
};

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Something went wrong";

    try {
      const errorData = await response.json();
      message =
        errorData?.detail ??
        errorData?.error?.message ??
        errorData?.message ??
        message;
    } catch {
      if (response.statusText) {
        message = response.statusText;
      }
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body != null) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    ...options,
    headers,
    body:
      options.body == null || options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body),
  });

  return parseResponse<T>(response);
}

export function getImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/products/")) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `http://127.0.0.1:8000${imageUrl}`;
  }

  return `${API_BASE_URL}/${imageUrl}`;
}
