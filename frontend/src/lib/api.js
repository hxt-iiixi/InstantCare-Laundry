import axios from "axios";

const raw = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const origin = raw.replace(/\/+$/, "").replace(/\/api$/, "");

export const api = axios.create({
  baseURL: origin,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
