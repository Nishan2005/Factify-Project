import React from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, ScanText, Settings2, BrainCircuit, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="bg-white">
      <section className="container-max py-14">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-brand-700 tracking-widest">OUR TECHNOLOGY</div>
            <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">How Factify AI Works</h1>
            <p className="mt-3 text-slate-600 max-w-2xl">
              Discover our bilingual pipeline designed for high-precision verification of English and Nepali news content.
            </p>
          </div>
          <div className="hidden md:block">
            <Button className="bg-white border border-slate-200 text-slate-800 hover:bg-slate-50">
              Research Paper
            </Button>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-extrabold">The Verification Pipeline</h2>

          <div className="mt-6 grid md:grid-cols-4 gap-5">
            <Step
              step="STEP 01"
              icon={<ScanText className="text-brand-700" />}
              title="Input Collection"
              desc="Users submit headlines, full articles, or URLs in either Latin (English) or Devanagari (Nepali)."
            />
            <Step
              step="STEP 02"
              icon={<Settings2 className="text-brand-700" />}
              title="NLP Preprocessing"
              desc="Tokenization, stop-word removal, normalization and handling Nepali morphosyntax for higher quality."
            />
            <Step
              step="STEP 03"
              icon={<BrainCircuit className="text-brand-700" />}
              title="AI Model Analysis"
              desc="Transformer models extract contextual embeddings and detect patterns of sensationalism and bias."
            />
            <Step
              step="STEP 04"
              icon={<CheckCircle2 className="text-brand-700" />}
              title="Classification Output"
              desc="A final veracity score is generated with a confidence interval, classifying content as Real, Fake, or Satire."
            />
          </div>
        </div>

        <Card className="mt-10 p-8 bg-slate-50">
          <h3 className="text-lg font-extrabold">System Capabilities</h3>

          <div className="mt-5 grid md:grid-cols-4 gap-5">
            <Cap title="Cross-Lingual Support" desc="Unified architecture optimized for both Devanagari and Latin scripts." />
            <Cap title="Semantic Embeddings" desc="Contextual analysis beyond simple keyword matching." />
            <Cap title="Sentiment Detection" desc="Identifies emotional triggers often found in disinformation campaigns." />
            <Cap title="Real-time API" desc="High-throughput endpoint for newsrooms and social media platforms." />
          </div>
        </Card>

        <Card className="mt-8 p-8 bg-brand-50 border-brand-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h4 className="text-xl font-extrabold">Ready to verify your first article?</h4>
              <p className="mt-1 text-sm text-slate-600">
                Join researchers and journalists who rely on Factify AI for reliable classification.
              </p>
            </div>
            <Link to="/verify" className="inline-flex">
              <Button variant="primary" className="gap-2">
                Start Detecting Now <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}

function Step({ step, icon, title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6 bg-white">
      <div className="h-12 w-12 rounded-full bg-brand-600/10 grid place-items-center">{icon}</div>
      <div className="mt-4 text-xs font-bold text-brand-700">{step}</div>
      <div className="mt-2 font-extrabold">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function Cap({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="font-bold">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}
