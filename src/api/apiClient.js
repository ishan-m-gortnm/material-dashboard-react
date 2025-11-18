import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// Helper for logout and redirect
function logoutAndRedirect() {
  console.warn("[Auth] Logging out user - invalid or expired tokens");
  // localStorage.removeItem("token");
  // localStorage.removeItem("refreshToken");
  // window.location.href = "/login"; // adjust to your login route
}

class ApiClient {
  constructor() {
    //console.info(`[API] Initializing client → Base URL: ${API_BASE_URL}`);

    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });

    // --- Request Interceptor ---
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        console.log(`[API] → ${config.method?.toUpperCase()} ${config.url}`);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.debug("[API] Attached Bearer token to request");
        } else {
          console.warn("[API] No access token found for request");
        }
        return config;
      },
      (error) => {
        console.error("[API] Request error:", error);
        return Promise.reject(error);
      }
    );

    // --- Response Interceptor (Token Refresh Handling) ---
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] ✅ ${response.config.url} → ${response.status}`);
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const url = originalRequest?.url || "unknown";

        console.error(`[API] ❌ Error on ${url} → Status: ${status}`);

        // Skip refresh if it's the refresh endpoint itself
        if (url.includes("/admin/auth/refresh")) {
          console.warn("[API] Skipping token refresh retry for /refresh call itself");
          return Promise.reject(error);
        }

        // If unauthorized and not retried yet
        if (status === 401 && !originalRequest._retry) {
          console.warn("[Auth] Access token expired. Attempting refresh...");
          originalRequest._retry = true;

          const refreshToken = localStorage.getItem("refreshToken");
          if (!refreshToken) {
            console.error("[Auth] No refresh token found. Redirecting to login...");
            logoutAndRedirect();
            return Promise.reject(error);
          }

          try {
            console.log("[Auth] → Calling refresh token endpoint...");
            const { data } = await axios.post(`${API_BASE_URL}/api/v1/admin/auth/refresh`, {
              refreshToken,
            });

            console.log("data====================", data);

            if (!data?.token) {
              throw new Error("Invalid refresh token response");
            }

            // Save new tokens
            localStorage.setItem("token", data.token);
            if (data.refreshToken) {
              localStorage.setItem("refreshToken", data.refreshToken);
            }

            console.info("[Auth] ✅ Token refresh successful. Retrying original request...");

            // Update Authorization headers and retry
            this.client.defaults.headers.Authorization = `Bearer ${data.token}`;
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error("[Auth] 🔴 Token refresh failed:", refreshError);
            logoutAndRedirect();
            return Promise.reject(refreshError);
          }
        }

        console.error("[API] Request failed, no retry attempted:", error);
        return Promise.reject(error);
      }
    );
  }

  // --- API Wrappers ---
  async get(url, config) {
    console.debug(`[API] → GET ${url}`);
    return this.client.get(url, config);
  }

  async post(url, data, config) {
    console.debug(`[API] → POST ${url}`);
    return this.client.post(url, data, config);
  }

  async put(url, data, config) {
    console.debug(`[API] → PUT ${url}`);
    return this.client.put(url, data, config);
  }

  async delete(url, config) {
    console.debug(`[API] → DELETE ${url}`);
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
