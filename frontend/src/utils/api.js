import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // backend base URL
});

// Attach JWT token automatically for axios requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Also provide authFetch (used in Sidebar and ChatWindow)
export const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`http://localhost:3000/api${url}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    console.error("Invalid JSON response");
  }

  return { ok: res.ok, status: res.status, data };
};

export default API;
