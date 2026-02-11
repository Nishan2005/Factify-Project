import React from "react";
import clsx from "clsx";

export default function Button({ variant = "primary", className, ...props }) {
  const styles = {
    primary: "bg-blue-700 hover:bg-brand-800 text-white",
    outline: "border border-white/25 text-white hover:bg-white/10",
    light: "bg-white text-brand-800 hover:bg-slate-50 border border-slate-200",
    ghost: "text-slate-700 hover:bg-slate-100",
  },
  base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition shadow-sm";

  return <button className={clsx(base, styles[variant], className)} {...props} />;
}
