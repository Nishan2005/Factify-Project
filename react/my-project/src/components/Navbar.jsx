import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Globe, X } from "lucide-react";
import Button from "./Button.jsx";
import Badge from "./Badge.jsx";
import clsx from "clsx";
import logoimg from "../assets/Logo.png";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/about", label: "About" },
  { to: "/research", label: "Research" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const isVerify = pathname === "/verify" || pathname === "/result";

  const { token, login, logout } = useAuth();
  const isLoggedIn = !!token;
  const [isAdmin, setIsAdmin] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = (t = "login") => {
    setTab(t); setMessage("");
    setEmail(""); setPassword(""); setName(""); setConfirmPassword("");
    setShowModal(true);
  };

  useEffect(() => {
    const handler = () => {
      setTab("login");
      setMessage("");
      setEmail("");
      setPassword("");
      setName("");
      setConfirmPassword("");
      setShowModal(true);
    };
    window.addEventListener("factify:openLoginModal", handler);
    return () => window.removeEventListener("factify:openLoginModal", handler);
  }, []);

  useEffect(() => {
    let mounted = true;

    const validateAdmin = async () => {
      if (!token) {
        if (mounted) setIsAdmin(false);
        return;
      }

      try {
        await axiosInstance.get("/admin/access");
        if (mounted) setIsAdmin(true);
      } catch {
        if (mounted) setIsAdmin(false);
      }
    };

    validateAdmin();

    return () => {
      mounted = false;
    };
  }, [token]);

  const closeModal = () => setShowModal(false);

  const handleLogout = () => {
    logout();
    // Notify the Factify extension content script to clear the cached token.
    window.dispatchEvent(new CustomEvent("factify:tokenSync", { detail: { token: null, refresh: null } }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage("");
    try {
      const { data } = await axiosInstance.post("/login", { email, password });
      login(data);
      // Notify the Factify extension content script to cache the new token.
      window.dispatchEvent(new CustomEvent("factify:tokenSync", { detail: { token: data.accessToken, refresh: data.refreshToken } }));
      closeModal();
    } catch {
      setMessage("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setMessage("Passwords do not match.");
    setLoading(true); setMessage("");
    try {
      const { data } = await axiosInstance.post("/register", { email, password });
      login(data);
      // Notify the Factify extension content script to cache the new token.
      window.dispatchEvent(new CustomEvent("factify:tokenSync", { detail: { token: data.accessToken, refresh: data.refreshToken } }));
      closeModal();
    } catch {
      setMessage("Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── NAVBAR ── z-index 40, lower than modal's 9999 */}
      <header
        className={clsx("sticky top-0 border-b bg-slate-900 text-white",
          isVerify ? "border-slate-200" : "border-white/10"
        )}
        style={{ zIndex: 40 }}
      >
        <div className="container-max h-16 flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="h-10 w-10 rounded-lg flex items-center justify-center overflow-hidden bg-white/10">
              <img src={logoimg} alt="Factify Logo" className="h-7 w-7 object-contain" />
            </span>
            <span>Factify AI</span>
            <Badge className="ml-1">Bilingual</Badge>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            {navItems.map((n) => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) =>
                  clsx("transition opacity-80 hover:opacity-100", isActive && "opacity-100 font-medium")
                }
              >{n.label}</NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-sm border border-white/15 bg-white/5" type="button">
              <Globe size={16} />
              <span className="font-medium">EN/NP</span>
            </button>

            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <button
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm border border-white/15 bg-white/5 hover:bg-white/10 transition"
                    >
                      <span className="font-medium hidden sm:inline">Admin</span>
                    </button>
                  </Link>
                )}
                <Link to="/verify"><Button variant="primary">Check News Now</Button></Link>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm border border-white/15 bg-white/5 hover:bg-white/10 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <button onClick={() => openModal("login")}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── MODAL — fixed, z-index 9999, always on top of everything ── */}
      {showModal && (
        <div
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)"
          }}
        >
          <div style={{ animation: "modalIn 0.2s ease-out" }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4"
          >
            {/* Close button */}
            <button onClick={closeModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
              {[["login","Login"],["signup","Sign Up"]].map(([t, label]) => (
                <button key={t} onClick={() => { setTab(t); setMessage(""); }}
                  className={clsx("flex-1 py-4 text-sm font-semibold transition-colors relative",
                    tab === t ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {label}
                  {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
                </button>
              ))}
            </div>

            <div className="px-7 py-7">
              {/* Icon + heading */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200 mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  {tab === "login" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {tab === "login" ? "Please enter your details to sign in." : "Join Factify AI today."}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={tab === "login" ? handleLogin : handleSignup} className="space-y-4">
                {tab === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                    <input type="text" placeholder="John Doe" value={name}
                      onChange={(e) => setName(e.target.value)} required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <input type="email" placeholder="name@company.com" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    {tab === "login" && (
                      <button type="button" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input type="password" placeholder="••••••••" value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>
                {tab === "signup" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                    <input type="password" placeholder="••••••••" value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  </div>
                )}

                {message && <p className="text-sm text-center font-medium text-red-500">{message}</p>}

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-200"
                >
                  {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Or continue with</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Google */}
              <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || ""}/auth/google`}
                className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-xs text-center text-slate-400 mt-5">
                By continuing, you agree to our{" "}
                <a href="/terms" className="text-blue-500 hover:underline">Terms of Service</a> and{" "}
                <a href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </>
  );
}
