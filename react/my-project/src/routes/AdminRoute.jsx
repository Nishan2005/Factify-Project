import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        await axiosInstance.get("/admin/access");
        setAllowed(true);
      } catch {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    validateAccess();
  }, []);

  if (loading) {
    return <div className="container-max py-10">Checking admin access...</div>;
  }

  if (!allowed) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-2">Admin Access Only</h1>
        <p className="text-slate-500 max-w-sm">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return children;
}
