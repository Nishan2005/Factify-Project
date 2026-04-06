import React, { useState } from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { Code2, Key, Zap, Shield, Copy, CheckCheck } from "lucide-react";

const endpoints = [
  {
    method: "GET",
    path: "/Prediction",
    desc: "Analyze a news article or text snippet and return a veracity verdict with confidence scores and evidence.",
    params: [
      { name: "text", type: "string", required: true, desc: "The news text to analyze (URL-encoded). Max 5,000 characters." },
    ],
    response: `{
  "verdict": "FAKE",
  "final_score": 0.87,
  "pattern_score": 0.91,
  "evidence_score": 0.72,
  "language": "en",
  "pattern_label": "Sensationalist",
  "pattern_probs": {
    "REAL": 0.13,
    "FAKE": 0.87
  },
  "evidence_found": true,
  "top_evidence": [
    {
      "rank": 1,
      "title": "Official statement contradicts viral claim",
      "source": "reuters.com",
      "link": "https://reuters.com/...",
      "similarity": 0.84
    }
  ]
}`,
    methodColor: "bg-blue-100 text-blue-700",
  },
  {
    method: "POST",
    path: "/register",
    desc: "Create a new user account. Returns access and refresh tokens on success.",
    params: [
      { name: "email", type: "string", required: true, desc: "User email address." },
      { name: "password", type: "string", required: true, desc: "Password (min 8 characters, must include a digit and uppercase letter)." },
    ],
    response: `{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}`,
    methodColor: "bg-emerald-100 text-emerald-700",
  },
  {
    method: "POST",
    path: "/login",
    desc: "Authenticate an existing user. Returns JWT access and refresh tokens.",
    params: [
      { name: "email", type: "string", required: true, desc: "Registered email address." },
      { name: "password", type: "string", required: true, desc: "Account password." },
    ],
    response: `{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}`,
    methodColor: "bg-emerald-100 text-emerald-700",
  },
  {
    method: "POST",
    path: "/refresh",
    desc: "Exchange a valid refresh token for a new access token. Use when the access token expires (401 response).",
    params: [
      { name: "refreshToken", type: "string", required: true, desc: "The refresh token received from /login or /register." },
    ],
    response: `{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "bmV3UmVmcmVzaFRva2Vu..."
}`,
    methodColor: "bg-emerald-100 text-emerald-700",
  },
];

const quickStartCode = `// 1. Login to get tokens
const loginRes = await fetch("https://api.factify.ai/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "you@example.com", password: "••••••••" })
});
const { accessToken } = await loginRes.json();

// 2. Analyze a news snippet
const result = await fetch(
  "https://api.factify.ai/Prediction?text=" + encodeURIComponent(newsText),
  { headers: { Authorization: \`Bearer \${accessToken}\` } }
);
const data = await result.json();
console.log(data.verdict);       // "FAKE" | "REAL"
console.log(data.final_score);   // 0.0 – 1.0`;

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition"
      title="Copy"
    >
      {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default function Api() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1e1a4d] text-white py-14 px-6">
        <div className="container-max">
          <div className="text-xs font-bold text-blue-300 tracking-widest mb-3">DEVELOPER DOCS</div>
          <h1 className="text-4xl md:text-5xl font-extrabold">API Reference</h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Integrate Factify AI into your application with a simple REST API. Analyze news in English or Nepali,
            manage user accounts, and retrieve structured results with evidence links.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> API Status: Operational
            </span>
            <span className="text-sm text-white/50">Base URL: <code className="text-white/80">{import.meta.env.VITE_API_URL || "https://localhost:7011"}</code></span>
          </div>
        </div>
      </section>

      <div className="container-max px-6 py-14 space-y-14">

        {/* Authentication */}
        <section id="auth">
          <div className="flex items-center gap-2 mb-2">
            <Key size={20} className="text-brand-700" />
            <span className="text-xs font-bold text-brand-700 tracking-widest">AUTHENTICATION</span>
          </div>
          <h2 className="text-2xl font-extrabold">Authentication</h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Factify AI uses JWT Bearer tokens. Call <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">/login</code> to obtain tokens, then include the access token in the
            <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm mx-1">Authorization</code> header of every protected request.
            Access tokens expire after 15 minutes; use <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">/refresh</code> to get a new one.
          </p>
          <Card className="mt-5 p-5 bg-slate-50">
            <div className="font-semibold text-sm text-slate-700 mb-2">Request Header</div>
            <pre className="text-sm text-slate-800 font-mono">
              Authorization: Bearer &lt;accessToken&gt;
            </pre>
          </Card>
        </section>

        {/* Quick Start */}
        <section id="quickstart">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="text-brand-700" />
            <span className="text-xs font-bold text-brand-700 tracking-widest">QUICK START</span>
          </div>
          <h2 className="text-2xl font-extrabold">Quick Start</h2>
          <p className="mt-3 text-slate-600">Get up and running in under 2 minutes with this JavaScript example.</p>
          <Card className="mt-5 overflow-hidden">
            <div className="bg-slate-800 px-5 py-3 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-mono">JavaScript / Fetch API</span>
            </div>
            <div className="relative">
              <pre className="bg-slate-900 text-green-300 text-xs leading-relaxed p-5 overflow-auto">
                {quickStartCode}
              </pre>
              <CopyButton text={quickStartCode} />
            </div>
          </Card>
        </section>

        {/* Endpoints */}
        <section id="endpoints">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={20} className="text-brand-700" />
            <span className="text-xs font-bold text-brand-700 tracking-widest">ENDPOINTS</span>
          </div>
          <h2 className="text-2xl font-extrabold">Endpoints</h2>
          <div className="mt-6 space-y-6">
            {endpoints.map((ep) => (
              <Card key={ep.path} className="overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                  <span className={`rounded-md px-2.5 py-0.5 text-xs font-bold font-mono ${ep.methodColor}`}>
                    {ep.method}
                  </span>
                  <code className="font-mono text-sm font-semibold text-slate-800">{ep.path}</code>
                </div>
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600">{ep.desc}</p>
                    {ep.params.length > 0 && (
                      <div className="mt-4">
                        <div className="font-semibold text-sm text-slate-700 mb-2">
                          {ep.method === "GET" ? "Query Parameters" : "Request Body (JSON)"}
                        </div>
                        <div className="space-y-2">
                          {ep.params.map((p) => (
                            <div key={p.name} className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                              <div className="flex items-center gap-2">
                                <code className="text-xs font-bold text-brand-700">{p.name}</code>
                                <span className="text-xs text-slate-400 font-mono">{p.type}</span>
                                {p.required && (
                                  <span className="text-xs font-semibold text-rose-500 bg-rose-50 rounded-full px-2">required</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-700 mb-2">Response (200 OK)</div>
                    <div className="relative">
                      <pre className="bg-slate-900 text-green-300 text-xs leading-relaxed rounded-xl p-4 overflow-auto max-h-64">
                        {ep.response}
                      </pre>
                      <CopyButton text={ep.response} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Rate Limits */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} className="text-brand-700" />
            <span className="text-xs font-bold text-brand-700 tracking-widest">RATE LIMITS & ERRORS</span>
          </div>
          <h2 className="text-2xl font-extrabold">Rate Limits & Error Codes</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-5">
            <Card className="p-6">
              <h3 className="font-bold mb-3">Rate Limits</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Free tier</span><span className="font-semibold">100 requests / day</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span>Authenticated</span><span className="font-semibold">1,000 requests / day</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Partner / Research</span><span className="font-semibold">Unlimited (contact us)</span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold mb-3">Error Codes</h3>
              <div className="space-y-2 text-sm">
                <ErrorRow code="400" msg="Bad Request — missing or invalid parameters" />
                <ErrorRow code="401" msg="Unauthorized — missing or expired token" />
                <ErrorRow code="403" msg="Forbidden — rate limit exceeded" />
                <ErrorRow code="422" msg="Unprocessable — text too long or empty" />
                <ErrorRow code="500" msg="Server error — try again shortly" />
              </div>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <Card className="p-8 bg-brand-50 border-brand-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="text-xl font-extrabold">Ready to build with Factify AI?</h4>
              <p className="mt-1 text-sm text-slate-600">
                Create a free account to get your API credentials and start building.
              </p>
            </div>
            <Link to="/" className="inline-flex">
              <Button variant="primary">Get API Access</Button>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
}

function ErrorRow({ code, msg }) {
  const color = code.startsWith("4") ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";
  return (
    <div className="flex items-start gap-3 py-1.5 border-b border-slate-100 last:border-0">
      <span className={`rounded font-mono font-bold text-xs px-1.5 py-0.5 flex-shrink-0 ${color}`}>{code}</span>
      <span className="text-slate-600 text-xs">{msg}</span>
    </div>
  );
}
