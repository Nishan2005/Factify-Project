import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container-max py-20 text-center">
      <h1 className="text-4xl font-extrabold">404</h1>
      <p className="mt-2 text-slate-600">Page not found.</p>
      <Link to="/" className="mt-6 inline-block text-brand-700 font-semibold hover:underline">
        Go Home
      </Link>
    </div>
  );
}
