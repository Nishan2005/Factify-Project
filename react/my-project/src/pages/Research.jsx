import React from "react";
import Card from "../components/Card.jsx";

export default function Research() {
  return (
    <div className="bg-slate-50">
      <div className="container-max py-14">
        <h1 className="text-4xl font-extrabold">Research</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          Papers, datasets, and evaluation summaries (frontend placeholder).
        </p>

        <div className="mt-8 grid md:grid-cols-3 gap-5">
          {["Model Overview", "Datasets", "Evaluation"].map((t) => (
            <Card key={t} className="p-6">
              <div className="font-bold">{t}</div>
              <p className="mt-2 text-sm text-slate-600">
                Replace with real content or links when backend/research pages are ready.
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
