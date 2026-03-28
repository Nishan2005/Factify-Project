// src/api/axiosInstance.js
// This is the CORE of auth - an axios instance that automatically:
// 1. Attaches the access token to every request
// 2. Detects 401 errors (token expired)
// 3. Automatically fetches a new access token using the refresh token
// 4. Retries the original failed request with the new token

import axios from "axios";

const BASE_URL = "https://localhost:7011"; // 🔁 Change this to your .NET API URL

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs before EVERY request is sent.
// Reads the access token from localStorage and attaches it.
// ─────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs after EVERY response comes back.
// If we get a 401 (Unauthorized), it means the access token expired.
// We then try to get a new access token using the refresh token.
// ─────────────────────────────────────────────

// This flag prevents multiple refresh calls if several requests fail at once
let isRefreshing = false;

// Queue of requests waiting for the refresh to finish
let failedQueue = [];

// Process the queue: either retry all with new token or reject all
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  // If response is successful, just return it
  (response) => response,

  // If response fails...
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 AND we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark this request as retried so we don't loop infinitely
      originalRequest._retry = true;
      isRefreshing = true;

      // Get the refresh token from storage
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // No refresh token = user must log in again
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Call the .NET Identity refresh endpoint
        // ASP.NET Core Identity default endpoint: POST /refresh
        const response = await axios.post(`${BASE_URL}/refresh`, {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save the new tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Update the Authorization header for future requests
        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + accessToken;

        // Retry all the queued requests with the new token
        processQueue(null, accessToken);

        // Retry the original failed request
        originalRequest.headers["Authorization"] = "Bearer " + accessToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token is also expired or invalid = force logout
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
