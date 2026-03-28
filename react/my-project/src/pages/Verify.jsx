import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Clipboard, Trash2, ShieldCheck, FileText, Zap, Languages } from "lucide-react";

export default function Verify() {
  const [lang, setLang] = useState("English");
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const placeholder = useMemo(() => {
    return lang === "Nepali"
      ? "तपाईंले प्रमाणित गर्न चाहनुभएको समाचार वा सामाजिक सञ्जाल पोस्ट यहाँ टाँस्नुहोस्…"
      : "Paste the news article, headline, or social media post content you want to verify here…";
  }, [lang]);

  function onVerify() {
    // frontend-only: simulate analysis
    navigate("/result", { state: { text, lang } });
  }

  async function onPaste() {
    try {
      const clip = await navigator.clipboard.readText();
      setText((t) => (t ? t + "\n" + clip : clip));
    } catch {
      // ignore if blocked
    }
  }

  return (
    <div className="bg-slate-50">
      <section className="container-max py-14">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">Verify the Truth Instantly</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            AI-powered fake news detection for English and Nepali content. Paste your text below to cross-examine facts.
          </p>
        </div>

        <Card className="mt-10 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>AUTO-DETECTING LANGUAGE:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLang("English")}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                    lang === "English" ? "bg-brand-600/10 border-brand-200 text-brand-800" : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("Nepali")}
                  className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
                    lang === "Nepali" ? "bg-brand-600/10 border-brand-200 text-brand-800" : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  Nepali
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={onPaste}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Clipboard size={16} /> Paste
              </button>
              <button
                onClick={() => setText("")}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>

          <div className="p-6 bg-white">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[300px] md:min-h-[360px] rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:ring-2 focus:ring-brand-200"
            />
            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-start gap-2 text-sm">
                <ShieldCheck className="text-emerald-600 mt-0.5" size={18} />
                <div>
                  <div className="font-semibold text-emerald-700">Secure AI Analysis</div>
                  <div className="text-slate-500 text-xs">Your data is processed anonymously and not stored.</div>
                </div>
              </div>

              <Button
                variant="primary"
                className="h-11 px-6"
                onClick={onVerify}
                disabled={!text.trim()}
              >
                Verify News
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-slate-600 text-sm">
          <Stat icon={<FileText size={18} />} label="200M+ Articles Indexed" />
          <Stat icon={<Zap size={18} />} label="Real-time Detection" />
          <Stat icon={<Languages size={18} />} label="Multilingual AI" />
        </div>

        <div className="mt-12 text-xs text-slate-400 text-right italic">
          Disclaimer: Factify AI uses machine learning to assess news veracity. Results should be cross-referenced with official sources.
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-brand-700">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}
