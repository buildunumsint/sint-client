import axios, { type AxiosError, type AxiosInstance } from "axios";

export type ApiErrorShape = {
  message?: string;
  error?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status: number;
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
  timeout: 30_000,
  headers: {
    Accept: "application/json",
  },
});

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  try {
    const method =
      (init?.method?.toUpperCase() as
        | "GET"
        | "POST"
        | "PUT"
        | "PATCH"
        | "DELETE"
        | undefined) ?? "GET";

    // Map RequestInit-ish options to axios
    const headers =
      init?.headers && typeof init.headers === "object"
        ? (init.headers as Record<string, string>)
        : undefined;

    const res = await api.request<T>({
      url: path,
      method,
      headers,
      data: (init as { json?: unknown } | undefined)?.json,
      // If someone passed init.body manually, keep compatibility for simple cases.
      ...(init?.body ? { data: init.body } : null),
      withCredentials: false,
    });

    return res.data;
  } catch (e) {
    const err = e as AxiosError<ApiErrorShape>;
    const status = err.response?.status ?? 0;
    const body = err.response?.data ?? err.message;
    const msg =
      (isObject(body) && (String(body.message ?? "") || String(body.error ?? ""))) ||
      err.message ||
      `Request failed (${status || "unknown"})`;
    throw new ApiError(msg, status, body);
  }
}

function isObject(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

