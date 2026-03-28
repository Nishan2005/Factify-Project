// src/hooks/useAuth.js
// A custom hook that makes using AuthContext easier.
//
// Instead of writing this in every component:
//   import { useContext } from "react"
//   import { AuthContext } from "../context/AuthContext"
//   const auth = useContext(AuthContext)
//
// You just write:
//   import { useAuth } from "../hooks/useAuth"
//   const auth = useAuth()
//
// It also adds a safety check so you get a clear error
// if you forget to wrap your app with <AuthProvider>

import { useContext } from "react";
import { AuthContext } from "../context/AuthoContext";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    // This error fires if you use useAuth() outside of <AuthProvider>
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }

  return context;
};
