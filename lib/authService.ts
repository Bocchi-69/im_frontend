import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect on login/register endpoints - let the component handle the error
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') ||
                            error.config?.url?.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const register = async (data: { name: string; email: string; password: string; role: string }) => {
  const response = await api.post("/auth/register", data);
  // Store token in localStorage after successful registration
  if (response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
  }
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post("/auth/login", data);
    // Store token in localStorage after successful login
    if (response.data.token) {
      localStorage.setItem("auth_token", response.data.token);
    }
    return response.data;
  } catch (error) {
    // Re-throw the error so the login page can catch it
    throw error;
  }
};

  

export const logout = async () => {
  const response = await api.post("/auth/logout");
  localStorage.removeItem("auth_token");
  return response.data;
};

export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("auth_token");
};

export default api;