import React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import Button from "./Button.jsx";
import Badge from "./Badge.jsx";
import clsx from "clsx";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/how-it-works", label: "How it Works" },
  { to: "/about", label: "About" },
  { to: "/research", label: "Research" },
];

export default function Navbar({ dark }) {
  const { pathname } = useLocation();
  const isVerify = pathname === "/verify" || pathname === "/result";

  const base = dark && !isVerify ? "bg-black text-white" : "bg-white text-slate-900";
  const border = dark && !isVerify ? "border-white/10" : "border-slate-200";

  return (
    <header className={clsx("sticky top-0 z-50 border-b", base, border)}>
      <div className="container-max h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className={clsx("h-8 w-8 rounded-lg grid place-items-center",
            dark && !isVerify ? "bg-white/10" : "bg-brand-600/10"
          )}>
            <span className={clsx("h-4 w-4 rounded-sm",
              dark && !isVerify ? "bg-white" : "bg-brand-700"
            )}/>
          </span>
          <span>Factify AI</span>
          <Badge className="ml-1">Bilingual</Badge>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                clsx(
                  "transition opacity-80 hover:opacity-100",
                  isActive && "opacity-100 font-medium"
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            className={clsx(
              "hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 text-sm border",
              dark && !isVerify ? "border-white/15 bg-white/5" : "border-slate-200 bg-slate-50"
            )}
            type="button"
            title="Language"
          >
            <Globe size={16} />
            <span className="font-medium">EN/NP</span>
          </button>

          <Link to="/verify">
            <Button variant="primary">Check News Now</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
