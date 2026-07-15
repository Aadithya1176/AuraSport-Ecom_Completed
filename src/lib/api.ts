export const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export type BackendUser = {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  full_name: string | null;
  phone_number: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  preferred_contact: "whatsapp" | "call" | "email" | null;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  category: Category | null;
};

export type CartItem = {
  id: number;
  qty: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
  };
};

export type OrderItem = {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
  };
};

export type Order = {
  id: number;
  total_price: number;
  status: string;
  customer_name: string;
  phone_number: string;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  contact_preference: "whatsapp" | "call" | "email";
  notes: string | null;
  admin_notes: string | null;
  order_items: OrderItem[];
};

export type OrderStatus =
  | "pending"
  | "contacted"
  | "confirmed"
  | "packed"
  | "shipped"
  | "completed"
  | "cancelled";

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: BackendUser;
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

  const response = await fetch(`${API_BASE_URL}${path}`, {
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

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://") || imageUrl.startsWith("/products/")) {
    return imageUrl;
  }

  return `${API_BASE_URL}${imageUrl}`;
}
