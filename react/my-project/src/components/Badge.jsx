import React from "react";
import clsx from "clsx";

export default function Badge({ className, children }) {
  return (
    <span className={clsx(
      "inline-flex items-center rounded-full bg-brand-600/10 text-brand-800 px-2 py-0.5 text-xs font-semibold",
      className
    )}>
      {children}
    </span>
  );
}
