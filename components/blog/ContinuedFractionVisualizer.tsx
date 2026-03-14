"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

type Convergent = { p: number; q: number; val: number; term: number };

function computeConvergents(terms: number[]): Convergent[] {
  let p2 = 0, p1 = 1;
  let q2 = 1, q1 = 0;
  const results: Convergent[] = [];
  for (const term of terms) {
    const p = term * p1 + p2;
    const q = term * q1 + q2;
    results.push({ p, q, val: p / q, term });
    p2 = p1; p1 = p;
    q2 = q1; q1 = q;
  }
  return results;
}

// Log-scale position: target always at 50%.
// maxLog = log10(first error) = outermost scale boundary (±42% from center).
// minLog = maxLog - LOG_DECADES = innermost boundary (≈ center).
// As error shrinks over steps, logErr drops toward minLog → dot approaches 50%.
const LOG_DECADES = 14;

function logPercent(val: number, err: number, target: number, maxLog: number): number {
  if (err <= 0) return 50;
  const minLog = maxLog - LOG_DECADES;
  const logErr = Math.log10(Math.max(err, 1e-20));
  const fraction = Math.min(1, Math.max(0, (logErr - minLog) / (maxLog - minLog)));
  const dir = val < target ? -1 : 1;
  return 50 + dir * fraction * 42;
}

const PRESETS = [
  { label: "π", name: "π", val: Math.PI },
  { label: "e", name: "e", val: Math.E },
  { label: "√2", name: "√2", val: Math.SQRT2 },
  { label: "φ", name: "φ", val: (1 + Math.sqrt(5)) / 2 },
];

export default function ContinuedFractionVisualizer() {
  const [targetIdx, setTargetIdx] = useState(0);
  const [terms, setTerms] = useState<number[]>([]);
  const [convergents, setConvergents] = useState<Convergent[]>([]);
  const [step, setStep] = useState(0);
  // Locked after first click so the scale never shifts mid-session.
  const [maxLog, setMaxLog] = useState<number | null>(null);
  const { theme } = useTheme();

  const preset = PRESETS[targetIdx];
  const target = preset.val;

  useEffect(() => {
    setStep(0);
    setTerms([]);
    setConvergents([]);
    setMaxLog(null);
  }, [targetIdx]);

  const handleAddTerm = () => {
    let remainder = target;
    for (let i = 0; i < step; i++) {
      const frac = remainder - Math.floor(remainder);
      if (frac < 1e-10) return;
      remainder = 1 / frac;
      if (!isFinite(remainder)) return;
    }
    const nextTerm = Math.floor(remainder);
    if (!isFinite(nextTerm) || nextTerm < 0) return;

    const newTerms = [...terms, nextTerm];
    const newConvergents = computeConvergents(newTerms);

    if (newConvergents.length === 1) {
      const firstError = Math.abs(target - newConvergents[0].val);
      setMaxLog(Math.log10(Math.max(firstError, 1e-15)));
    }

    setTerms(newTerms);
    setConvergents(newConvergents);
    setStep(step + 1);
  };

  // Use null (not undefined) for safer checks.
  const latest: Convergent | null = convergents.length > 0
    ? convergents[convergents.length - 1]
    : null;
  const error: number | null = latest !== null
    ? Math.abs(target - latest.val)
    : null;

  // Precompute the gap bar (from target 50% to latest dot) BEFORE the JSX return.
  // This avoids IIFE-in-JSX patterns that can fail in React 19.
  let gapLeft = 0;
  let gapWidth = 0;
  let showGap = false;
  if (latest !== null && maxLog !== null) {
    const pos = logPercent(latest.val, Math.abs(target - latest.val), target, maxLog);
    const l = Math.min(50, pos);
    const r = Math.max(50, pos);
    if (r - l >= 0.5) {
      gapLeft = l;
      gapWidth = r - l;
      showGap = true;
    }
  }

  const isDark = theme === "dark";
  const dotColor = isDark ? "#c0bdb5" : "#3a3a3a";
  const labelBg = isDark ? "#c0bdb5" : "#3a3a3a";
  const labelFg = isDark ? "#1f1f1f" : "#f4f2ec";

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#f4f2ec]/70 dark:bg-[rgba(31,31,31,0.6)] rounded-xl border border-[#c0bdb5]/20 dark:border-[#3a3a3a] font-sans my-8">
      <h3 className="text-xl md:text-2xl font-semibold text-[#3a3a3a] dark:text-[#c0bdb5] mb-2">
        Continued Fraction Visualizer
      </h3>
      <p className="text-sm text-[#3a3a3a]/70 dark:text-[#c0bdb5]/70 mb-6">
        The red line is fixed. Each dot is a fraction — closer to center means closer to the target. Log scale so every step stays visible.
      </p>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => setTargetIdx(i)}
            className={`px-3 py-1 text-sm rounded-full transition-colors font-mono ${
              i === targetIdx
                ? "bg-[#3a3a3a] dark:bg-[#c0bdb5] text-[#f4f2ec] dark:text-[#3a3a3a]"
                : "bg-[#c0bdb5]/20 dark:bg-[#3a3a3a] text-[#3a3a3a] dark:text-[#c0bdb5] hover:bg-[#c0bdb5]/40 dark:hover:bg-[#4a4a4a]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Number line */}
      <div className="relative h-36 bg-[#eae8e1] dark:bg-[#181818] rounded-lg border border-[#c0bdb5]/30 dark:border-[#2a2a2a] overflow-hidden select-none mb-1">

        {/* Horizontal axis */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-[#c0bdb5]/50 dark:bg-[#3a3a3a]" />

        {/* Gap bar from target (50%) to latest dot — precomputed above */}
        {showGap && (
          <div
            className="absolute transition-all duration-500"
            style={{
              top: "calc(50% - 1px)",
              left: `${gapLeft}%`,
              width: `${gapWidth}%`,
              height: "2px",
              zIndex: 5,
              backgroundColor: isDark ? "rgba(192,189,181,0.3)" : "rgba(58,58,58,0.2)",
            }}
          />
        )}

        {/* Target line — permanently at 50% */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-[#c05a5a]/90 left-1/2 z-10">
          <span className="absolute top-2 left-2 text-[10px] font-mono text-[#c05a5a] font-bold whitespace-nowrap">
            {preset.name} ≈ {target.toFixed(5)}
          </span>
        </div>

        {/* Edge labels */}
        <span className="absolute bottom-2 left-2 text-[9px] font-mono text-[#3a3a3a]/35 dark:text-[#c0bdb5]/35">
          ← too small
        </span>
        <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[#3a3a3a]/35 dark:text-[#c0bdb5]/35">
          too large →
        </span>

        {/* All convergent dots — positions locked once placed */}
        {maxLog !== null && convergents.map((c, i) => {
          const cErr = Math.abs(target - c.val);
          const pos = logPercent(c.val, cErr, target, maxLog);
          const isLatest = i === convergents.length - 1;
          const age = convergents.length - 1 - i;
          const size = isLatest ? 14 : Math.max(6, Math.round(12 - age * 1.5));
          const opacity = isLatest ? 1 : Math.max(0.22, 0.82 - age * 0.1);
          const labelOnRight = pos < 50;

          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full transition-all duration-500"
              style={{
                left: `${pos}%`,
                width: `${size}px`,
                height: `${size}px`,
                backgroundColor: dotColor,
                opacity,
                zIndex: isLatest ? 20 : 10 + i,
              }}
            >
              {isLatest && (
                <div
                  className="absolute top-5 whitespace-nowrap text-[11px] font-mono px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: labelBg,
                    color: labelFg,
                    ...(labelOnRight
                      ? { left: "100%", marginLeft: "4px" }
                      : { right: "100%", marginRight: "4px" }),
                  }}
                >
                  {c.p}/{c.q}
                </div>
              )}
            </div>
          );
        })}

        {convergents.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm text-[#3a3a3a]/40 dark:text-[#c0bdb5]/40">
              Press &quot;Add Term&quot; to start
            </span>
          </div>
        )}
      </div>

      <p className="text-[9px] font-mono text-center text-[#3a3a3a]/35 dark:text-[#c0bdb5]/35 mb-6">
        log scale · scale locks after first step · dots approach center as precision improves
      </p>

      {/* Controls */}
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-sm space-y-1.5 flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-[#3a3a3a]/50 dark:text-[#c0bdb5]/50">
            Continued Fraction
          </div>
          <div className="text-[#3a3a3a] dark:text-[#c0bdb5] font-semibold break-all">
            [{step === 0 ? "?" : terms[0]}
            {terms.length > 1 ? `; ${terms.slice(1).join(", ")}` : ""}
            {step > 0 ? ", …" : ""}]
          </div>
          {latest !== null && error !== null && (
            <>
              <div className="text-[#3a3a3a]/80 dark:text-[#c0bdb5]/80 text-xs">
                Best approx:{" "}
                <span className="font-bold">{latest.p}/{latest.q}</span>
                <span className="ml-2 opacity-60">≈ {latest.val.toFixed(8)}</span>
              </div>
              <div className="text-[#3a3a3a]/50 dark:text-[#c0bdb5]/50 text-xs">
                Error: <span className="font-mono">{error.toExponential(3)}</span>
              </div>
            </>
          )}
        </div>

        <button
          onClick={handleAddTerm}
          className="flex items-center gap-2 bg-[#3a3a3a] dark:bg-[#c0bdb5] text-[#f4f2ec] dark:text-[#3a3a3a] px-5 py-2.5 rounded-lg hover:opacity-80 transition-opacity text-sm font-semibold shrink-0 active:scale-95"
        >
          Add Term
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Educational note */}
      {latest !== null && (
        <div className="mt-5 p-4 bg-[#eae8e1] dark:bg-[#181818] text-[#3a3a3a] dark:text-[#c0bdb5] text-sm rounded-lg border border-[#c0bdb5]/20 dark:border-[#2a2a2a]">
          <span className="font-semibold">Last term added: </span>
          <span className="font-bold text-base mx-1">{latest.term}</span>
          {latest.term > 5
            ? "— a big number! This fraction just made a huge leap of accuracy."
            : "— a small number. Only a tiny step closer."}
        </div>
      )}
    </div>
  );
}
