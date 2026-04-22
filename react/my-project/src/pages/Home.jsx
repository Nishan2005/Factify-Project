import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { ShieldCheck, Languages, Zap, PuzzleIcon, Download } from "lucide-react";
import HeroImg from "../images/27075.jpg";

const EXTENSION_ZIP_PATH = "/factify-extension.zip";

export default function Home() {
  return (
    <div className="bg-white">
      {/* HERO (dark) */}
      <section className="bg-[#1e1a4d] text-white relative overflow-hidden pl-6">
        <div className="container-max py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="h-3 w-28 rounded-full bg-brand-700/70 mb-6" />
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Verify News Before <br /> You Believe It
            </h1>
            <p className="mt-5 text-white/70 max-w-lg">
              Empowering you to distinguish truth from fiction with AI-driven analysis for
              English and Nepali news content. Combat misinformation with precision.
            </p>

            <div className="mt-8 flex gap-3">
              <Link to="/verify"><Button variant="primary">Check News Now</Button></Link>
              <a href="#browser-extension" className="hidden sm:block">
                <Button variant="outline">Learn More</Button>
              </a>
            </div>
          </div>

          {/* right hero visual (approx like Figma) */}
          <div className="relative">
            <div className="absolute -right-8 -top-10 h-72 w-72 rounded-full glow" />
            <div className="absolute right-10 top-0 h-72 w-72 rounded-full glow opacity-80" />
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-white/10 shadow-soft overflow-hidden">
            
              <div className="p-6">
                
                <div className="h-44 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.45),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.35),transparent_55%)] border border-white/10" >
                <div className="h-full rounded-xl overflow-hidden border border-white/10">
  <img src={HeroImg} className="w-full h-full object-cover"/>
</div>
  </div>
                <div className="mt-5 rounded-2xl bg-white/95 text-slate-900 p-4 flex items-center gap-3">
                  <span className="h-8 w-8 rounded-full bg-emerald-100 grid place-items-center">
                    <span className="h-4 w-4 rounded-full bg-emerald-500" />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-emerald-700">VERIFICATION ACTIVE</div>
                    <div className="text-sm text-slate-600">Analyzing live news streams in real-time…</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-max pl-6 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Reliable News Verification</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Our platform uses state-of-the-art technology to provide trustworthy insights into the news you consume daily.
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          <Feature
            icon={<ShieldCheck className="text-brand-700" />}
            title="AI-Powered Accuracy"
            desc="Advanced neural networks trained on diverse patterns for high precision detection."
          />
          <Feature
            icon={<Languages className="text-brand-700" />}
            title="Multilingual Support"
            desc="Optimized to analyze and flag misinformation in both English and Nepali scripts."
          />
          <Feature
            icon={<Zap className="text-brand-700" />}
            title="Real-time Analysis"
            desc="Instant results as soon as news breaks, so you can stay informed without the risk."
          />
        </div>
      </section>

      {/* Browser extension */}
       <section
      style={{
        background: "#1e1a4d",
        padding: "4rem 1.5rem",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(255,255,255,0.07)",
          border: "0.5px solid rgba(255,255,255,0.15)",
          borderRadius: "12px",
          padding: "2.5rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "2rem",
            alignItems: "center",
          }}
        >
          {/* Left: text */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "999px",
                background: "rgba(167,139,250,0.18)",
                border: "0.5px solid rgba(167,139,250,0.35)",
                padding: "4px 12px",
                marginBottom: "1.25rem",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#b5c1fd",
                  letterSpacing: "0.02em",
                }}
              >
                Browser Extension
              </span>
            </div>

            <h3
              style={{
                margin: "0 0 0.75rem",
                fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.2,
              }}
            >
              Download Factify for your browser
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                color: "rgba(255,255,255,0.6)",
                maxWidth: "520px",
                lineHeight: 1.6,
              }}
            >
              Verify news while you browse. Install the extension and check
              claims directly from any webpage in seconds.
            </p>
          </div>

          {/* Right: buttons */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <a href={EXTENSION_ZIP_PATH} download="factify-extension.zip">
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "#1212de",
                  border: "none",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                variant="primary"
                
              >
                <Download size={15} />
                Download
              </button>
            </a>

            <Link to="/extension">
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "0.5px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.75)",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Installation Guide
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <Card className="p-6">
      <div className="h-10 w-10 rounded-xl bg-brand-600/10 grid place-items-center">
        {icon}
      </div>
      <h4 className="mt-4 font-bold">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </Card>
  );
}
