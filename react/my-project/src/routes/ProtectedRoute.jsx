import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-5 shadow">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Login Required</h1>
        <p className="text-slate-500 max-w-sm mb-6">
          You need to be logged in to access this page. Please sign in or create an account to continue.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("factify:openLoginModal"))}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition shadow-md shadow-blue-200"
        >
          Login / Sign Up
        </button>
      </div>
    );
  }

  return children;
}