import axios from "axios";

const api = axios.create({
  // Vite exposes env vars via import.meta.env and they must start with VITE_
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const checkBackend = async () => {
  try {
    await api.get("/api/v1/users/health");
    return { ok: true };
  } catch (err) {
    if (err.code === "ECONNREFUSED") {
      return { ok: false, message: "Backend server not running" };
    }
    if (err.response) {
      return { ok: false, message: `Server error: ${err.response.status}` };
    }
    return { ok: false, message: err.message };
  }
};

// simple request/response logging to help debug network issues
api.interceptors.request.use(
  (config) => {
    // eslint-disable-next-line no-console
    console.debug(
      "[api] request",
      config.method?.toUpperCase(),
      config.baseURL + config.url
    );
    return config;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error("[api] request error", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => {
    // eslint-disable-next-line no-console
    console.debug("[api] response", res.status, res.config.url);
    return res;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error("[api] response error", error?.message || error);
    return Promise.reject(error);
  }
);

// manage auth token
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem("accessToken", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("accessToken");
    delete api.defaults.headers.common["Authorization"];
  }
}

// initialize from localStorage if present
const saved = localStorage.getItem("accessToken");
if (saved) setAuthToken(saved);

// Auth endpoints
export async function login(credentials) {
  const res = await api.post("/api/v1/users/login", credentials);
  // backend returns structure { code, data, message }
  const payload = res.data.data;
  if (payload?.accessToken) setAuthToken(payload.accessToken);
  return payload;
}

export async function register(formData) {
  // register expects multipart/form-data (avatar + coverImage)
  try {
    const res = await api.post("/api/v1/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (err) {
    // enhance error information for network issues
    if (err?.request && !err?.response) {
      // network error / no response received
      const msg = `Network Error: could not reach ${api.defaults.baseURL || api.baseURL}. Check backend is running and CORS is configured.`;
      // eslint-disable-next-line no-console
      console.error(msg, err);
      throw new Error(msg);
    }
    // otherwise rethrow original error
    throw err;
  }
}

export async function logout() {
  try {
    await api.post("/api/v1/users/logout");
  } finally {
    setAuthToken(null);
  }
}

export async function getCurrentUser() {
  const res = await api.get("/api/v1/users/current-user");
  return res.data.data;
}

export async function refreshAccessToken(body) {
  const res = await api.post("/api/v1/users/refresh-token", body);
  const payload = res.data.data;
  if (payload?.accessToken) setAuthToken(payload.accessToken);
  return payload;
}

// Video endpoints (prefixed with /api/v1/videos)
export async function getVideos() {
  const res = await api.get("/api/v1/videos");
  return res.data.data;
}

export async function getVideo(id) {
  const res = await api.get(`/api/v1/videos/${id}`);
  return res.data.data;
}

export async function uploadVideo(formData) {
  const res = await api.post("/api/v1/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

// Channel / user endpoints
export async function getChannel(username) {
  const res = await api.get(`/api/v1/users/c/${encodeURIComponent(username)}`);
  return res.data.data;
}

export async function getUserVideos() {
  const res = await api.get(`/api/v1/videos/user`);
  return res.data.data;
}

export default api;
