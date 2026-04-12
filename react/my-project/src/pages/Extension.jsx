import React from "react";
import { Download, FolderOpen, ToggleRight, PuzzleIcon, CheckCircle2 } from "lucide-react";
import Card from "../components/Card.jsx";
import Button from "../components/Button.jsx";

const steps = [
  {
    icon: <Download className="text-brand-700" />,
    step: "STEP 01",
    title: "Download the Extension",
    desc: 'Click the "Download Extension" button above to save the ZIP file to your computer.',
  },
  {
    icon: <FolderOpen className="text-brand-700" />,
    step: "STEP 02",
    title: "Extract the ZIP",
    desc: "Right-click the downloaded file and choose \"Extract All\" (Windows) or double-click it (macOS/Linux) to unzip the folder.",
  },
  {
    icon: <ToggleRight className="text-brand-700" />,
    step: "STEP 03",
    title: "Enable Developer Mode",
    desc: 'Open Chrome and go to chrome://extensions. Toggle on "Developer mode" in the top-right corner of the page.',
  },
  {
    icon: <FolderOpen className="text-brand-700" />,
    step: "STEP 04",
    title: 'Click "Load unpacked"',
    desc: 'Click the "Load unpacked" button that appears after enabling Developer mode, then select the extracted extension folder.',
  },
  {
    icon: <CheckCircle2 className="text-brand-700" />,
    step: "STEP 05",
    title: "Start Using Factify",
    desc: "The Factify extension is now installed. Select any text on a webpage to instantly check whether it's real or fake news.",
  },
];

export default function Extension() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-[#1e1a4d] text-white pl-6 py-16">
        <div className="container-max text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-700/20 border border-white/10 mb-6">
            <PuzzleIcon size={32} className="text-white/80" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Install the Factify Browser Extension
          </h1>
          <p className="mt-5 text-white/70 max-w-lg mx-auto">
            Verify news directly from any webpage — just select text and let Factify AI analyse it for you in seconds.
          </p>
          <div className="mt-8">
            <a href="/factify-extension.zip" download="factify-extension.zip">
              <Button variant="primary" className="gap-2 inline-flex items-center">
                <Download size={18} />
                Download Extension
              </Button>
            </a>
          </div>
          <p className="mt-3 text-xs text-white/40">
            Compatible with Chrome and Chromium-based browsers (Edge, Brave, Opera)
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="container-max pl-6 py-14">
        <h2 className="text-2xl md:text-3xl font-extrabold">Installation Guide</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Follow these five steps to load the extension directly from your computer — no account or store approval required.
        </p>

        <div className="mt-8 grid md:grid-cols-5 gap-5">
          {steps.map(({ icon, step, title, desc }) => (
            <div key={step} className="rounded-2xl border border-slate-200 p-6 bg-white">
              <div className="h-12 w-12 rounded-full bg-brand-600/10 grid place-items-center">
                {icon}
              </div>
              <div className="mt-4 text-xs font-bold text-brand-700">{step}</div>
              <div className="mt-2 font-extrabold text-sm">{title}</div>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="container-max pl-6 pb-14">
        <Card className="p-8 bg-slate-50">
          <h3 className="text-lg font-extrabold">Tips &amp; Troubleshooting</h3>
          <div className="mt-5 grid md:grid-cols-3 gap-5">
            <Tip
              title="Extension not appearing?"
              desc='Make sure you selected the inner folder that contains "manifest.json", not the ZIP file or an outer wrapper folder.'
            />
            <Tip
              title="Stay logged in across tabs"
              desc="Log into Factify AI on this website. Your session token is automatically synced to the extension so you can verify news without signing in again."
            />
            <Tip
              title="Keeping it up to date"
              desc='When a new version is released, download and extract the new ZIP, then click "Update" on the chrome://extensions page for Factify.'
            />
          </div>
        </Card>
      </section>
    </div>
  );
}

function Tip({ title, desc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="font-bold text-sm">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}
