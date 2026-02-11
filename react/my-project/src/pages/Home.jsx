import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import { ShieldCheck, Languages, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-white">
      {/* HERO (dark) */}
      <section className="bg-black text-white relative overflow-hidden">
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
              <a href="#how" className="hidden sm:block">
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
                <div className="h-44 rounded-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.45),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(99,102,241,0.35),transparent_55%)] border border-white/10" />
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
      <section className="container-max py-14">
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

      {/* How it works (dark band like screenshot) */}
      <section id="how" className="bg-black text-white/90 py-16">
        <div className="container-max">
          <h3 className="text-center text-xl font-semibold opacity-80">How Factify AI Works</h3>
          <div className="mt-10 grid md:grid-cols-3 gap-6 text-center">
            <Step num="1" title="Submit Content" desc="Paste a URL or text snippet in English or Nepali into our analyzer." />
            <Step num="2" title="AI Analysis" desc="Our transformer models cross-reference claims and analyze patterns." />
            <Step num="3" title="Get Results" desc="Receive an instant credibility score and explanation." />
          </div>

          <div className="mt-14 rounded-3xl bg-brand-700 px-8 py-12 text-center shadow-soft">
            <h4 className="text-3xl md:text-4xl font-extrabold text-white">Ready to verify some news?</h4>
            <p className="mt-3 text-white/80">
              Join thousands of users who trust Factify AI to navigate the digital news landscape safely.
            </p>
            <div className="mt-7 flex justify-center gap-3">
              <Link to="/verify"><Button variant="light">Get Started Free</Button></Link>
              <Link to="/research"><Button className="bg-white/10 text-white border border-white/20 hover:bg-white/15">View Case Studies</Button></Link>
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

function Step({ num, title, desc }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="mx-auto h-12 w-12 rounded-full bg-white grid place-items-center text-brand-800 font-extrabold">
        {num}
      </div>
      <h5 className="mt-4 font-bold text-white">{title}</h5>
      <p className="mt-2 text-sm text-white/70">{desc}</p>
    </div>
  );
}
