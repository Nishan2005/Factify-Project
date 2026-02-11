import React, { useMemo } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import ConfidenceRing from "../components/ConfidenceRing.jsx";
import { AlertTriangle, Globe, Flag, Link2, ArrowLeft } from "lucide-react";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const lang = state?.lang || "Nepali";
  const text = state?.text || "";

  // Frontend-only demo output like your Figma
  const result = useMemo(() => {
    return {
      verdictTag: "VERDICT FOUND",
      verdict: "HIGHLY LIKELY FAKE",
      subtitle: "This content shows multiple markers of misinformation.",
      confidence: 94,
      contentMetadata: {
        language: lang,
        category: "Politics",
      },
      reasons: [
        {
          title: "Sensationalist Language",
          desc: "High frequency of inflammatory adjectives and exclamation marks typical of clickbait.",
        },
        {
          title: "Factual Inconsistencies",
          desc: "Cross-referencing reveals dates/claims do not match official records.",
        },
        {
          title: "Lack of Citation",
          desc: "Content lacks verifiable primary sources or links to reputable organizations.",
        },
      ],
      insights: [
        { title: "Bias Detected", desc: "Strong political bias detected (example: 92%) toward a specific faction." },
        { title: "Network Spread", desc: "Flagged by partner fact-checkers across the region (demo)." },
        { title: "Source Reliability", desc: "The origin domain has a history of misinformation (demo)." },
      ],
    };
  }, [lang]);

  return (
    <div className="bg-slate-50">
      <section className="container-max py-8 md:py-10">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="text-brand-700">⌂</span> Home
          </span>
          <span>/</span>
          <span>Analysis Result</span>
        </div>

        <Card className="mt-4 overflow-hidden">
          <div className="bg-rose-50 border-b border-rose-100 px-6 py-6 text-center">
            <div className="inline-flex items-center rounded-full bg-rose-500 text-white text-xs font-bold px-3 py-1">
              {result.verdictTag}
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-rose-600">
              {result.verdict}
            </h1>
            <p className="mt-2 text-sm text-rose-700/80">{result.subtitle}</p>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <ConfidenceRing value={result.confidence} />
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>AI Confidence Score</span>
                  <span className="text-brand-800">{result.confidence}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div className="h-full bg-brand-700" style={{ width: `${result.confidence}%` }} />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Our model is highly certain of this classification based on cross-referenced datasets and linguistic pattern analysis.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-slate-900">Content Metadata</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill icon={<Globe size={14} />} label={`Language: ${result.contentMetadata.language}`} />
                <Pill icon={<Flag size={14} />} label={result.contentMetadata.category} />
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="font-bold flex items-center gap-2">
                  <span className="text-brand-700">💡</span> Why this result?
                </h4>
                <div className="mt-3 space-y-3">
                  {result.reasons.map((r) => (
                    <Reason key={r.title} title={r.title} desc={r.desc} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-xs text-slate-500">
              Analyzed on Oct 24, 2023 • Ref ID: 8823-FT-9
            </div>

            <div className="flex gap-3">
              <button
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                type="button"
              >
                <Link2 className="inline mr-2" size={16} />
                Report a Correction
              </button>
              <Button variant="primary" onClick={() => navigate("/verify")}>
                Check New Text
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {result.insights.map((i) => (
            <Card key={i.title} className="p-6">
              <h4 className="font-bold">{i.title}</h4>
              <p className="mt-2 text-sm text-slate-600">{i.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center text-xs text-slate-500">
          Factify AI uses a combination of LLMs and custom knowledge graphs. Always exercise critical judgment.{" "}
          <Link to="/how-it-works" className="text-brand-700 font-semibold hover:underline">
            Learn more about our methodology.
          </Link>
        </div>

        <div className="mt-6">
          <button onClick={() => navigate(-1)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
      </section>
    </div>
  );
}

function Pill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
      <span className="text-brand-700">{icon}</span>
      {label}
    </span>
  );
}

function Reason({ title, desc }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-rose-600">
        <AlertTriangle size={16} />
      </div>
      <div>
        <div className="font-semibold text-sm">{title}:</div>
        <div className="text-sm text-slate-600">{desc}</div>
      </div>
    </div>
  );
}
