import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Optional: if later you want to attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // your key
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
