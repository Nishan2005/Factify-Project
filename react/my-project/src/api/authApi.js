// src/api/authApi.js
// These functions map directly to ASP.NET Core Identity's default endpoints.
// ASP.NET Core Identity default routes (when using MapIdentityApi<TUser>()):
//
//   POST /register        → Create new account
//   POST /login           → Login (returns accessToken + refreshToken)
//   POST /refresh         → Get new access token using refresh token
//   POST /logout          → Invalidate refresh token (server-side)
//   GET  /confirmEmail    → Confirm email (query params: userId, code)
//   POST /resendConfirmationEmail → Resend confirmation
//   POST /forgotPassword  → Send password reset email
//   POST /resetPassword   → Reset password with token
//   GET  /manage/info     → Get current user info
//   POST /manage/info     → Update user info (email, password)

import axiosInstance from "./axiosInstance";

// ─── REGISTER ───────────────────────────────
// POST /register
// Body: { email, password }
export const register = async (email, password) => {
  const response = await axiosInstance.post("/register", { email, password });
  return response.data;
};

// ─── LOGIN ──────────────────────────────────
// POST /login
// Body: { email, password }
// Query param: ?useCookies=false&useSessionCookies=false
// Returns: { tokenType, accessToken, expiresIn, refreshToken }
export const login = async (email, password) => {
  const response = await axiosInstance.post(
    "/login?useCookies=false&useSessionCookies=false",
    { email, password }
  );
  return response.data;
};

// ─── REFRESH TOKEN ───────────────────────────
// POST /refresh
// Body: { refreshToken }
// Returns: { tokenType, accessToken, expiresIn, refreshToken }
export const refreshTokenApi = async (refreshToken) => {
  const response = await axiosInstance.post("/refresh", { refreshToken });
  return response.data;
};

// ─── LOGOUT ──────────────────────────────────
// POST /logout
// Body: {} (empty, but required)
// The server invalidates the refresh token
export const logout = async () => {
  const response = await axiosInstance.post("/logout", {});
  return response.data;
};

// ─── GET CURRENT USER INFO ───────────────────
// GET /manage/info
// Returns: { email, isEmailConfirmed }
export const getManageInfo = async () => {
  const response = await axiosInstance.get("/manage/info");
  return response.data;
};

// ─── UPDATE USER INFO ────────────────────────
// POST /manage/info
// Body: { newEmail?, newPassword?, oldPassword? }
export const updateManageInfo = async (data) => {
  const response = await axiosInstance.post("/manage/info", data);
  return response.data;
};

// ─── FORGOT PASSWORD ─────────────────────────
// POST /forgotPassword
// Body: { email }
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/forgotPassword", { email });
  return response.data;
};

// ─── RESET PASSWORD ──────────────────────────
// POST /resetPassword
// Body: { email, resetCode, newPassword }
export const resetPassword = async (email, resetCode, newPassword) => {
  const response = await axiosInstance.post("/resetPassword", {
    email,
    resetCode,
    newPassword,
  });
  return response.data;
};
