import React from "react";

export default function ConfidenceRing({ value = 94 }) {
  const size = 170;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="text-slate-200"
          stroke="currentColor"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="text-brand-700"
          stroke="currentColor"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="absolute inset-0 grid place-items-center text-center">
        <div className="text-3xl font-extrabold">{value}%</div>
        <div className="text-xs tracking-wide text-slate-500 font-semibold">CERTAINTY</div>
      </div>
    </div>
  );
}
