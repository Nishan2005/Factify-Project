import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import ConfidenceRing from "../components/ConfidenceRing.jsx";
import { AlertTriangle, CheckCircle, Globe, Flag, Link2, ArrowLeft, ExternalLink, Search, ThumbsUp, ThumbsDown, Send  } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function Result() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const text = state?.text || "";

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function predict() {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/Prediction?text=" + encodeURIComponent(text));
        setResult(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze content. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    predict();
  }, [text]);

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-brand-200 border-t-brand-700 animate-spin" />
        <p className="text-slate-600 font-medium">Analyzing content…</p>
        <p className="text-slate-400 text-sm">Cross-referencing sources and detecting patterns</p>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-4">
        <AlertTriangle size={48} className="text-rose-500" />
        <p className="text-slate-700 font-semibold text-lg">{error}</p>
        <Button variant="primary" onClick={() => navigate("/verify")}>Try Again</Button>
      </div>
    );
  }

  if (!result) return null;

  // ── Derived display values from API response ──
  const toPercent = (score) => {
    const num = Number(score);
    if (!Number.isFinite(num)) return 0;
    const normalized = num >= 0 && num <= 1 ? num * 100 : num;
    return Math.round(Math.max(0, Math.min(100, normalized)));
  };

  const isFake = result.verdict === "FAKE";
  const isUncertain = result.verdict === "UNCERTAIN";
  const confidencePct = toPercent(result.final_score);
  const patternPct = toPercent(result.pattern_score);
  const evidencePct = toPercent(result.evidence_score);

  const langMap = { ne: "Nepali", en: "English" };
  const langLabel = langMap[result.language] || state?.lang || result.language || "Unknown";

  const verdictColor = isFake
    ? { bg: "bg-rose-50", border: "border-rose-100", tag: "bg-rose-500", title: "text-rose-600", sub: "text-rose-700/80", ring: "#ef4444" }
    : isUncertain ? { bg: "bg-amber-50", border: "border-amber-100", tag: "bg-amber-500", title: "text-amber-600", sub: "text-amber-700/80", ring: "#f59e0b" }
    : { bg: "bg-emerald-50", border: "border-emerald-100", tag: "bg-emerald-500", title: "text-emerald-600", sub: "text-emerald-700/80", ring: "#10b981" };

  const verdictLabel = isFake ? "HIGHLY LIKELY FAKE" : isUncertain ? "POSSIBLY FAKE" : "LIKELY REAL";
  const verdictTag = isFake ? "VERDICT: FAKE" : isUncertain ? "VERDICT: UNCERTAIN" : "VERDICT: REAL";
  const verdictSubtitle = isFake
    ? "This content shows multiple markers of misinformation."
    : "This content appears to be credible and evidence-backed.";

  return (
    <div className="bg-slate-50">
      <section className="container-max">
        {/* Breadcrumb */}
        {/* <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="text-brand-700">⌂</span> Home
          </span>
          <span>/</span>
          <span>Analysis Result</span>
        </div> */}

        {/* Main result card */}
        <Card className=" overflow-hidden">
          {/* Verdict header */}
          <div className={`${verdictColor.bg} border-b ${verdictColor.border} px-6 py-6 text-center`}>
            <div className={`inline-flex items-center rounded-full ${verdictColor.tag} text-white text-xs font-bold px-3 py-1`}>
              {verdictTag}
            </div>
            <h1 className={`mt-3 text-3xl md:text-4xl font-extrabold ${verdictColor.title}`}>
              {verdictLabel}
            </h1>
            <p className={`mt-2 text-sm ${verdictColor.sub}`}>{verdictSubtitle}</p>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
            {/* Confidence ring + scores */}
            <div className="flex flex-col items-center justify-center gap-4">
              <ConfidenceRing value={confidencePct} color={verdictColor.ring} />

              <div className="w-full max-w-xs space-y-3">
                <ScoreBar label="Final Confidence" value={confidencePct} color={isFake ? "bg-rose-500" : "bg-emerald-500"} />
                <ScoreBar label="Pattern Score" value={patternPct} color="bg-indigo-600" />
                <ScoreBar label="Evidence Match" value={evidencePct} color="bg-blue-500" />
              </div>

              <p className="text-xs text-slate-500 text-center max-w-xs">
                Our model cross-references linguistic patterns with live evidence sources to determine credibility.
              </p>
            </div>

            {/* Metadata + Pattern breakdown */}
            <div>
              <h3 className="font-bold text-slate-900">Content Analysis</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill icon={<Globe size={14} />} label={`Language: ${langLabel}`} />
                <Pill
                  icon={isFake ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                  label={`Pattern: ${result.pattern_label}`}
                  variant={isFake ? "danger" : "success"}
                />
                <Pill
                  icon={<Search size={14} />}
                  label={`Evidence: ${result.evidence_found ? "Found" : "Not Found"}`}
                  variant={result.evidence_found ? "success" : "warning"}
                />
              </div>

              {/* Pattern probabilities */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="font-bold flex items-center gap-2 text-sm">
                  <span>🔍</span> Pattern Classification
                </h4>
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>Real probability</span>
                    <span className="text-emerald-600">{(result.pattern_probs.real * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${result.pattern_probs.real * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-xs font-medium text-slate-600 mt-2">
                    <span>Fake probability</span>
                    <span className="text-rose-500">{(result.pattern_probs.fake * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.pattern_probs.fake * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence section */}
          {result.top_evidence && result.top_evidence.length > 0 && (
            <div className="px-6 md:px-8 pb-6">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Link2 size={16} className="text-brand-700" />
                Top Evidence Sources
              </h3>
              <div className="space-y-3">
                {result.top_evidence.map((ev) => (
                  <EvidenceCard key={ev.rank} evidence={ev} />
                ))}
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="px-6 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="text-xs text-slate-500">
              Analyzed just now • Language: {langLabel}
            </div>
            <div className="flex gap-3">
              {/* <button
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                type="button"
              >
                <Link2 className="inline mr-2" size={16} />
                Report a Correction
              </button> */}
              <Button variant="primary" onClick={() => navigate("/verify")}>
                Check New Text
              </Button>
            </div>
          </div>
        </Card>
<FeedbackSection result={result} />
        {/* Bottom note */}
        <div className="mt-10 text-center text-xs text-slate-500">
          Factify AI uses a combination of LLMs and custom knowledge graphs. Always exercise critical judgment.{" "}
          <Link to="/how-it-works" className="text-brand-700 font-semibold hover:underline">
            Learn more about our methodology.
          </Link>
        </div>

        {/* <div className="mt-6">
          <button onClick={() => navigate(-1)} className="text-sm font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back
          </button>
        </div> */}
      </section>
    </div>
  );
}

// ── Sub-components ──

function ScoreBar({ label, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Pill({ icon, label, variant = "default" }) {
  const colors = {
    default: "border-slate-200 bg-slate-50 text-slate-600",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${colors[variant]}`}>
      {icon}
      {label}
    </span>
  );
}

function EvidenceCard({ evidence }) {
  const similarityPct = Math.round(evidence.similarity * 100);
  const strengthColor =
    similarityPct >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-200" :
    similarityPct >= 60 ? "text-blue-600 bg-blue-50 border-blue-200" :
    "text-amber-600 bg-amber-50 border-amber-200";

  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 hover:border-brand-200 transition">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-50 border border-brand-200 flex items-center justify-center text-sm font-bold text-brand-700">
        {evidence.rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm text-slate-800 leading-snug">{evidence.title}</p>
          <span className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full border ${strengthColor}`}>
            {similarityPct}% match
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">{evidence.source}</p>
        <a
          href={evidence.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-brand-700 font-semibold hover:underline"
        >
          View Source <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
// ── Paste this component at the bottom of Result.jsx ──

function FeedbackSection({ result }) {
  const [vote, setVote] = useState(null);        // 'yes' | 'no' | null
  const [activeTags, setActiveTags] = useState([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const ISSUE_TAGS = ["Wrong verdict", "Scores seem off", "Bad evidence sources", "Missing context", "Other"];

  function toggleTag(tag) {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  }

  async function handleSubmit() {
  try {
    await axiosInstance.post("/Feedback", {
      id: result.id,
      vote,
      tags: activeTags,
      comment,
    });
  } catch (err) {
    console.error("Failed to submit feedback:", err);
  } finally {
    setSubmitted(true);
  }
}
  if (submitted) {
    return (
      <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-center gap-3">
        <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
        <p className="text-sm font-semibold text-emerald-700">
          Thanks for your feedback — it helps us improve Factify.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-semibold text-slate-700 mb-3">Was this analysis helpful?</p>

      {/* Thumbs row */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => setVote("yes")}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition
            ${vote === "yes"
              ? "bg-emerald-50 border-emerald-400 text-emerald-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          <ThumbsUp size={15} />
          Yes, looks accurate
        </button>
        <button
          type="button"
          onClick={() => setVote("no")}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition
            ${vote === "no"
              ? "bg-rose-50 border-rose-400 text-rose-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
        >
          <ThumbsDown size={15} />
          No, something's off
        </button>
      </div>

      {/* Issue tags — only for negative vote */}
      {vote === "no" && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">What was the issue?</p>
          <div className="flex flex-wrap gap-2">
            {ISSUE_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition
                  ${activeTags.includes(tag)
                    ? "bg-rose-50 border-rose-400 text-rose-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comment box — shown after any vote */}
      {vote && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">
            Anything else to add?{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </p>
          <textarea
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700
                       placeholder-slate-400 resize-none focus:outline-none focus:border-brand-400 min-h-[80px]"
            maxLength={300}
            placeholder="Tell us what you think…"
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-slate-400">{comment.length} / 300</span>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white
                         px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Send size={13} />
              Submit feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
