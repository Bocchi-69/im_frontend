// lib/authService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Axios client for the Laravel Sanctum auth API.
// Install:  npm install axios
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";

// ── Axios instance ────────────────────────────────────────────────────────────

const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwrap Laravel error responses into a plain Error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const message =
      data?.message ??
      Object.values(data?.errors ?? {}).flat().join(", ") ??
      "Something went wrong.";
    return Promise.reject(new Error(message));
  }
);

// ── Token helpers ─────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("folio_token");
}

function saveToken(token: string): void {
  localStorage.setItem("folio_token", token);
}

function clearToken(): void {
  localStorage.removeItem("folio_token");
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "candidate" | "employer";
}

// ── Auth methods ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
export async function register(payload: {
  name: string;
  email: string;
  password: string;
  role: "candidate" | "employer";
}): Promise<{ message: string }> {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

/**
 * POST /api/auth/login
 * Saves the token to localStorage on success.
 */
export async function login(payload: {
  email: string;
  password: string;
}): Promise<{ message: string; token: string; user: AuthUser }> {
  const { data } = await api.post("/auth/login", payload);
  saveToken(data.token);
  return data;
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user.
 */
export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get("/auth/me");
  return data.user;
}

/**
 * POST /api/auth/logout
 * Revokes the token server-side and clears localStorage.
 */
export async function logout(): Promise<void> {
  await api.post("/auth/logout");
  clearToken();
}