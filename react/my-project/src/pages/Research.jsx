import React from "react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { BookOpen, Database, BarChart2, FileText, ExternalLink, ChevronRight } from "lucide-react";

const papers = [
  {
    title: "Bilingual Fake News Detection for Nepali and English Using Cross-Lingual Transformers",
    authors: "Subedi N. et al.",
    year: "2024",
    abstract:
      "We present a dual-encoder transformer architecture that jointly trains on English and Nepali news corpora, achieving 94.2% accuracy on the NepFake-v2 benchmark — outperforming monolingual baselines by 8.4 percentage points.",
    tags: ["NLP", "Transformers", "Bilingual"],
    link: "#",
  },
  {
    title: "NepFake-v2: A Large-Scale Curated Dataset for Nepali Misinformation Detection",
    authors: "Subedi N., Research Team",
    year: "2023",
    abstract:
      "Introduction of NepFake-v2, a 45,000-article dataset spanning 12 Nepali news domains with human-verified labels, covering both Devanagari and Romanized Nepali. Available for academic use under CC-BY 4.0.",
    tags: ["Dataset", "Nepali NLP", "Benchmark"],
    link: "#",
  },
  {
    title: "Cross-Lingual Semantic Embeddings for Low-Resource Misinformation Detection",
    authors: "Research Team",
    year: "2023",
    abstract:
      "Analysis of mBERT, XLM-R, and MuRIL embeddings on Nepali fake news, demonstrating that language-agnostic semantic representations outperform translation-based approaches for low-resource South Asian languages.",
    tags: ["Embeddings", "Low-Resource", "Evaluation"],
    link: "#",
  },
];

const datasets = [
  {
    name: "NepFake-v2",
    size: "45,000 articles",
    languages: "Nepali (Devanagari + Romanized)",
    labels: "Real / Fake / Satire",
    license: "CC BY 4.0",
    desc: "Human-verified news articles from 12 Nepali news outlets spanning 2018–2024.",
  },
  {
    name: "Bilingual Fusion Set",
    size: "120,000 articles",
    languages: "English + Nepali",
    labels: "Real / Fake",
    license: "Research Use",
    desc: "Combined dataset merging LIAR (English) with NepFake-v2 for cross-lingual training.",
  },
  {
    name: "SocialMisinfo-NP",
    size: "18,000 posts",
    languages: "Nepali (Twitter/Facebook)",
    labels: "Real / Fake / Unverifiable",
    license: "Research Use",
    desc: "Social media posts related to Nepali health and political events with crowd-sourced labels.",
  },
];

const metrics = [
  { model: "Factify-XLM-R (ours)", acc: 94.2, f1: 93.8, lang: "EN + NP" },
  { model: "mBERT baseline", acc: 86.1, f1: 85.4, lang: "EN + NP" },
  { model: "MuRIL fine-tuned", acc: 89.7, f1: 88.9, lang: "NP only" },
  { model: "Monolingual BERT (EN)", acc: 91.3, f1: 90.6, lang: "EN only" },
];

export default function Research() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1e1a4d] text-white py-14 px-6">
        <div className="container-max">
          <div className="text-xs font-bold text-blue-300 tracking-widest mb-3">RESEARCH</div>
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Papers, Datasets & Evaluation
          </h1>
          <p className="mt-4 text-white/70 max-w-2xl">
            Factify AI is built on peer-reviewed research. We publish our methods, datasets, and benchmark results
            so the community can build on and improve our work.
          </p>
          <div className="mt-8 flex gap-3">
            <a href="#papers">
              <Button variant="primary">View Papers</Button>
            </a>
            <a href="#datasets">
              <Button variant="outline" className="border-white/25 text-white hover:bg-white/10">
                Download Datasets
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Papers */}
      <section id="papers" className="container-max px-6 py-14">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen size={20} className="text-brand-700" />
          <span className="text-xs font-bold text-brand-700 tracking-widest">PUBLICATIONS</span>
        </div>
        <h2 className="text-2xl font-extrabold">Research Papers</h2>
        <div className="mt-8 space-y-5">
          {papers.map((p) => (
            <Card key={p.title} className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tags.map((t) => (
                      <span key={t} className="inline-flex items-center rounded-full bg-brand-600/10 text-brand-800 px-2 py-0.5 text-xs font-semibold">
                        {t}
                      </span>
                    ))}
                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-semibold">
                      {p.year}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg leading-snug">{p.title}</h3>
                  <p className="text-sm text-brand-700 font-semibold mt-1">{p.authors}</p>
                  <p className="mt-2 text-sm text-slate-600">{p.abstract}</p>
                </div>
                <div className="flex-shrink-0">
                  <a
                    href={p.link}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <FileText size={15} /> Read Paper <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Datasets */}
      <section id="datasets" className="bg-slate-50 px-6 py-14">
        <div className="container-max">
          <div className="flex items-center gap-2 mb-2">
            <Database size={20} className="text-brand-700" />
            <span className="text-xs font-bold text-brand-700 tracking-widest">OPEN DATA</span>
          </div>
          <h2 className="text-2xl font-extrabold">Datasets</h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            All datasets used to train and evaluate Factify AI are available for academic and research use.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {datasets.map((d) => (
              <Card key={d.name} className="p-6">
                <div className="font-bold text-slate-800 text-lg">{d.name}</div>
                <p className="mt-2 text-sm text-slate-600">{d.desc}</p>
                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span className="font-medium">Size</span>
                    <span>{d.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Languages</span>
                    <span>{d.languages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Labels</span>
                    <span>{d.labels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">License</span>
                    <span className="text-brand-700 font-semibold">{d.license}</span>
                  </div>
                </div>
                <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                  Request Access <ChevronRight size={14} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Evaluation */}
      <section className="container-max px-6 py-14">
        <div className="flex items-center gap-2 mb-2">
          <BarChart2 size={20} className="text-brand-700" />
          <span className="text-xs font-bold text-brand-700 tracking-widest">BENCHMARKS</span>
        </div>
        <h2 className="text-2xl font-extrabold">Model Evaluation</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Factify AI models are evaluated on the NepFake-v2 test split (10,000 articles) using standard classification metrics.
        </p>
        <Card className="mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="px-6 py-3 text-left font-semibold">Model</th>
                <th className="px-6 py-3 text-left font-semibold">Languages</th>
                <th className="px-6 py-3 text-right font-semibold">Accuracy</th>
                <th className="px-6 py-3 text-right font-semibold">F1 Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.map((m, i) => (
                <tr key={m.model} className={i === 0 ? "bg-brand-50" : ""}>
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {i === 0 && <span className="mr-2 text-brand-700">★</span>}
                    {m.model}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{m.lang}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{m.acc}%</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">{m.f1}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <p className="mt-3 text-xs text-slate-500 italic">
          ★ Factify-XLM-R is the model currently powering the production API.
          Evaluation performed on NepFake-v2 test split (held-out, not used in training).
        </p>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 px-6 py-12">
        <div className="container-max">
          <Card className="p-8 bg-brand-50 border-brand-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-xl font-extrabold">Want to collaborate on research?</h4>
                <p className="mt-1 text-sm text-slate-600">
                  We welcome academic partnerships, dataset contributions, and model improvements.
                </p>
              </div>
              <Link to="/about" className="inline-flex">
                <Button variant="primary">Contact the Team</Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
