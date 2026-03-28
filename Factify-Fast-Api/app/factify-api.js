// ─────────────────────────────────────────────────────────────────
// factify-api.js  –  Frontend helper for the Factify RAG API
// ─────────────────────────────────────────────────────────────────
// Drop this file into your React / Vue / vanilla JS project and
// import the functions you need.

const BASE_URL = import.meta?.env?.VITE_API_URL ?? "http://localhost:8000";

// ── Types (JSDoc for plain JS, or convert to TypeScript) ──────────

/**
 * @typedef {Object} PatternResult
 * @property {string} label         - "REAL" | "FAKE"
 * @property {number} confidence    - 0–1
 * @property {Object} probs         - { REAL: number, FAKE: number }
 */

/**
 * @typedef {Object} EvidenceItem
 * @property {number} rank
 * @property {string} source
 * @property {string} title
 * @property {string} link
 * @property {number} similarity
 */

/**
 * @typedef {Object} RAGResult
 * @property {string}        pattern_label    - "REAL" | "FAKE"
 * @property {Object}        pattern_probs
 * @property {string}        verdict          - "REAL" | "FAKE" | "UNCERTAIN"
 * @property {number}        final_score      - 0–1  (higher = more REAL)
 * @property {number}        pattern_score
 * @property {number}        evidence_score
 * @property {boolean}       evidence_found
 * @property {EvidenceItem[]} top_evidence
 */

// ── Core fetch helper ─────────────────────────────────────────────

async function apiFetch(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error ${res.status}: ${err}`);
  }
  return res.json();
}

// ── Public API ────────────────────────────────────────────────────

/**
 * Fast check – pattern classifier only (Layer 1).
 * Use when you want instant feedback without waiting for evidence retrieval.
 *
 * @param {string} newsText
 * @returns {Promise<PatternResult>}
 */
export async function checkPattern(newsText) {
  return apiFetch("/predict", { text: newsText });
}

/**
 * Full RAG check – classifier + live news evidence (Layer 1 + 2).
 * Recommended for final verdict display to the user.
 *
 * @param {string} newsText
 * @param {number} [topK=5]   - How many articles to retrieve
 * @returns {Promise<RAGResult>}
 */
export async function checkRAG(newsText, topK = 5) {
  return apiFetch("/predict/rag", { text: newsText, top_k: topK });
}

/**
 * Ask the server to refresh its news index in the background.
 * Call this once when your app mounts, or on a timer (e.g. every hour).
 *
 * @returns {Promise<{ status: string, articles_indexed: number }>}
 */
export async function refreshIndex() {
  const res = await fetch(`${BASE_URL}/index/refresh`, { method: "POST" });
  return res.json();
}

/**
 * Check API health and index stats.
 * @returns {Promise<Object>}
 */
export async function getHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}


// ─────────────────────────────────────────────────────────────────
// React example component (copy-paste into your .jsx / .tsx file)
// ─────────────────────────────────────────────────────────────────

/*
import { useState } from "react";
import { checkRAG, refreshIndex } from "./factify-api";

const VERDICT_STYLE = {
  REAL:      { bg: "#d1fae5", color: "#065f46", icon: "✅" },
  FAKE:      { bg: "#fee2e2", color: "#991b1b", icon: "❌" },
  UNCERTAIN: { bg: "#fef9c3", color: "#854d0e", icon: "⚠️" },
};

export default function FactifyChecker() {
  const [text,    setText]    = useState("");
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  async function handleCheck() {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await checkRAG(text, 5);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const style = result ? VERDICT_STYLE[result.verdict] : null;

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>🔍 Factify – Nepali News Checker</h2>

      <textarea
        rows={4}
        style={{ width: "100%", fontSize: 15, padding: 10, borderRadius: 8 }}
        placeholder="यहाँ समाचार टाइप गर्नुहोस् ..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button onClick={handleCheck} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Checking…" : "Check News"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div style={{
          marginTop: 20, padding: 16, borderRadius: 10,
          background: style.bg, color: style.color,
        }}>
          <h3>{style.icon} Verdict: {result.verdict}</h3>
          <p>Final score: {(result.final_score * 100).toFixed(1)}%</p>
          <p>Pattern score: {(result.pattern_score * 100).toFixed(1)}%
             &nbsp;|&nbsp; Evidence score: {(result.evidence_score * 100).toFixed(1)}%</p>

          {result.evidence_found && (
            <>
              <h4>📰 Supporting Evidence</h4>
              <ul>
                {result.top_evidence.map((e, i) => (
                  <li key={i}>
                    <strong>[{e.source}]</strong> {e.title}{" "}
                    <a href={e.link} target="_blank" rel="noreferrer">🔗</a>
                    {" "}<em>(sim: {e.similarity.toFixed(3)})</em>
                  </li>
                ))}
              </ul>
            </>
          )}

          {!result.evidence_found && (
            <p>ℹ️ No matching articles found in trusted sources.</p>
          )}
        </div>
      )}
    </div>
  );
}
*/
