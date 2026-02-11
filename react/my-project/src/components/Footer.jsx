import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-max py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="h-8 w-8 rounded-lg bg-brand-600/10 grid place-items-center">
                <span className="h-4 w-4 rounded-sm bg-brand-700" />
              </span>
              <span>Factify AI</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 max-w-xs">
              Bridging the truth gap with AI-powered verification for global and local news.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/api" className="hover:text-slate-900">API for Publishers</Link></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Browser Extension</a></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Mobile App</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link to="/about" className="hover:text-slate-900">Our Story</Link></li>
              <li><Link to="/research" className="hover:text-slate-900">Research Papers</Link></li>
              <li><a className="hover:text-slate-900" href="#" onClick={(e)=>e.preventDefault()}>Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm">Newsletter</h4>
            <p className="mt-3 text-sm text-slate-600">
              Weekly insights on the state of misinformation.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-200"
                placeholder="Enter email"
              />
              <button className="rounded-xl bg-brand-700 text-white px-4 text-sm font-medium">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 text-xs text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Factify AI. All rights reserved.</span>
          <span className="italic">
            Disclaimer: Results should be cross-referenced with official sources.
          </span>
        </div>
      </div>
    </footer>
  );
}
