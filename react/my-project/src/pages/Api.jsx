import React from "react";
import Card from "../components/Card.jsx";

export default function Api() {
  return (
    <div className="bg-white">
      <div className="container-max py-14">
        <h1 className="text-4xl font-extrabold">API</h1>
        <p className="mt-3 text-slate-600 max-w-2xl">
          API docs placeholder (frontend-only). Later you can add endpoints, auth and usage examples.
        </p>

        <Card className="mt-8 p-6">
          <div className="font-bold">POST /api/analyze</div>
          <pre className="mt-3 text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-auto">
{`{
  "text": "Paste content here",
  "language": "en|ne"
}`}
          </pre>
        </Card>
      </div>
    </div>
  );
}
