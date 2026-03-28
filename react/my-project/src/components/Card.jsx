import React from "react";
import clsx from "clsx";

export default function Card({ className, children }) {
  return (
    <div className={clsx("rounded-2xl border border-slate-200 bg-white shadow-card", className)}>
      {children}
    </div>
  );
}
