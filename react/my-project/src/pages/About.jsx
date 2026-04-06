import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";
import { ShieldCheck, Users, Globe, Lightbulb, Target, BookOpen } from "lucide-react";

const team = [
  {
    name: "Nishan Subedi",
    role: "Lead Developer & ML Engineer",
    bio: "Built the NLP pipeline and transformer-based classification models for bilingual fake news detection.",
    initials: "NS",
    color: "bg-blue-600",
  },
  {
    name: "Research Team",
    role: "Linguistics & Data Science",
    bio: "Curated the Nepali-English misinformation dataset and conducted cross-lingual evaluation benchmarks.",
    initials: "RT",
    color: "bg-indigo-600",
  },
  {
    name: "Open Source Community",
    role: "Contributors",
    bio: "Developers and fact-checkers who improved model accuracy and expanded language coverage.",
    initials: "OS",
    color: "bg-violet-600",
  },
];

const values = [
  {
    icon: <ShieldCheck className="text-brand-700" size={22} />,
    title: "Truth First",
    desc: "Every design decision prioritizes accuracy. We would rather say 'uncertain' than make a wrong call.",
  },
  {
    icon: <Globe className="text-brand-700" size={22} />,
    title: "Inclusive by Design",
    desc: "Nepal has two major written scripts. Our models treat Devanagari and Latin script as equals, not afterthoughts.",
  },
  {
    icon: <Lightbulb className="text-brand-700" size={22} />,
    title: "Explainable AI",
    desc: "We show our work. Every verdict comes with a confidence score, matched evidence, and pattern breakdown.",
  },
  {
    icon: <Target className="text-brand-700" size={22} />,
    title: "Open Research",
    desc: "Our training datasets, evaluation results, and methodology are published for independent review.",
  },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1e1a4d] text-white py-16 px-6">
        <div className="container-max">
          <div className="max-w-3xl">
            <div className="text-xs font-bold text-blue-300 tracking-widest mb-3">OUR STORY</div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Built to Fight Misinformation in Nepal
            </h1>
            <p className="mt-5 text-white/70 max-w-2xl">
              Factify AI was born from a simple observation: fact-checking tools ignored Nepali-language news entirely.
              We set out to build the first bilingual fake news detection platform purpose-built for Nepal's media
              ecosystem — combining state-of-the-art transformers with a locally curated knowledge base.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/research">
                <Button variant="outline" className="border-white/25 text-white hover:bg-white/10">
                  <BookOpen size={16} className="mr-2" /> Read Our Research
                </Button>
              </Link>
              <Link to="/verify">
                <Button variant="primary">Try It Free</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container-max px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs font-bold text-brand-700 tracking-widest mb-2">OUR MISSION</div>
            <h2 className="text-3xl font-extrabold">
              Empowering readers to verify before they share
            </h2>
            <p className="mt-4 text-slate-600">
              Misinformation spreads faster than corrections. Factify AI gives every reader — journalist, student,
              or everyday social media user — the same tools that professional fact-checkers rely on, instantly and
              for free.
            </p>
            <p className="mt-3 text-slate-600">
              Our platform cross-references claims against a continuously updated evidence database, detects
              linguistic patterns common in disinformation, and returns a transparent, explainable verdict in seconds.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard value="94%" label="Average Model Accuracy" color="text-brand-700" />
            <StatCard value="2" label="Languages Supported" color="text-indigo-600" />
            <StatCard value="200M+" label="Articles in Knowledge Base" color="text-blue-600" />
            <StatCard value="< 2s" label="Average Analysis Time" color="text-emerald-600" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-slate-50 px-6 py-14">
        <div className="container-max">
          <h2 className="text-2xl font-extrabold text-center">What We Stand For</h2>
          <p className="mt-2 text-slate-600 text-center max-w-xl mx-auto">
            Our principles guide every model we train, every feature we ship, and every verdict we return.
          </p>
          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {values.map((v) => (
              <Card key={v.title} className="p-6">
                <div className="h-10 w-10 rounded-xl bg-brand-600/10 grid place-items-center mb-4">
                  {v.icon}
                </div>
                <div className="font-bold">{v.title}</div>
                <p className="mt-2 text-sm text-slate-600">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container-max px-6 py-14">
        <div className="text-xs font-bold text-brand-700 tracking-widest mb-2">THE TEAM</div>
        <h2 className="text-2xl font-extrabold">People Behind Factify AI</h2>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="p-6 flex flex-col items-center text-center">
              <div className={`h-16 w-16 rounded-full ${member.color} grid place-items-center text-white text-xl font-extrabold mb-4`}>
                {member.initials}
              </div>
              <div className="font-bold text-slate-800">{member.name}</div>
              <div className="text-xs text-brand-700 font-semibold mt-1">{member.role}</div>
              <p className="mt-3 text-sm text-slate-600">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1e1a4d] text-white px-6 py-14">
        <div className="container-max text-center">
          <Users size={40} className="mx-auto mb-4 text-blue-300" />
          <h2 className="text-3xl font-extrabold">Join the Fight Against Fake News</h2>
          <p className="mt-3 text-white/70 max-w-lg mx-auto">
            Whether you are a researcher, journalist, or curious reader — Factify AI is free to use and open to collaborate with.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/verify"><Button variant="primary">Start Verifying</Button></Link>
            <Link to="/research"><Button variant="outline" className="border-white/25 text-white hover:bg-white/10">Read Research</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ value, label, color }) {
  return (
    <Card className="p-5 text-center">
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500 font-medium">{label}</div>
    </Card>
  );
}
