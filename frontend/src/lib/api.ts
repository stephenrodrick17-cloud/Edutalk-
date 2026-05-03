import axios from "axios";

// Using Next.js rewrites to proxy /api to the backend
const API_URL = "/api"; 

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
