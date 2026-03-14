"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/theme-provider";

type Tug = { angle: number; intensity: number; age: number };

const GOLDEN = (1 + Math.sqrt(5)) / 2;
const BASE_SPEED = 0.018;
const C = 340; // canvas logical size

const PRESETS = [
  { label: "2:1 Resonance", ratio: 2.0, detail: "1 spoke — highly unstable" },
  { label: "3:1 Resonance", ratio: 3.0, detail: "2 spokes — unstable" },
  { label: "φ (Golden Ratio)", ratio: GOLDEN, detail: "scattered tugs — stable" },
];

export default function OrbitalResonance() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{ time: number; tugs: Tug[]; lastRel: number; chaos: number }>({
    time: 0, tugs: [], lastRel: 0, chaos: 0,
  });

  const [ratio, setRatio] = useState(GOLDEN);
  const [isPlaying, setIsPlaying] = useState(true);
  const [chaosLevel, setChaosLevel] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Reset physics when ratio changes
  useEffect(() => {
    stateRef.current = { time: 0, tugs: [], lastRel: 0, chaos: 0 };
    setChaosLevel(0);
  }, [ratio]);

  // Animation loop — restarts when isPlaying, ratio, or theme changes
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const s = stateRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!canvas || !ctx) {
        animId = requestAnimationFrame(tick);
        return;
      }

      // --- Physics ---
      if (isPlaying) {
        s.time += 1;

        const tO = (s.time * BASE_SPEED) % (2 * Math.PI);
        const tI = (s.time * BASE_SPEED * ratio) % (2 * Math.PI);
        let rel = (tI - tO) % (2 * Math.PI);
        if (rel < 0) rel += 2 * Math.PI;

        // Conjunction: inner passes outer
        if (s.lastRel > Math.PI * 1.5 && rel < Math.PI * 0.5) {
          let extra = 0;
          let hit = false;
          for (const tug of s.tugs) {
            let diff = Math.abs(tO - tug.angle);
            if (diff > Math.PI) diff = 2 * Math.PI - diff;
            if (diff < 0.1) {
              tug.intensity += 1;
              hit = true;
              extra += 15;
            }
          }
          if (!hit) {
            s.tugs.push({ angle: tO, intensity: 1, age: 0 });
            s.chaos = Math.max(0, s.chaos - 2);
          }
          s.chaos = Math.min(100, s.chaos + extra);
        }

        s.tugs.forEach(t => { t.age += 1; });
        if (s.chaos > 0) s.chaos -= 0.1;
        setChaosLevel(Math.round(s.chaos));
        s.lastRel = rel;
      }

      // --- Draw ---
      const cx = C / 2;
      const cy = C / 2;
      const rI = 62;
      const rO = 122;
      const chaos = s.chaos;

      const thetaO = (s.time * BASE_SPEED) % (2 * Math.PI);
      const thetaI = (s.time * BASE_SPEED * ratio) % (2 * Math.PI);

      ctx.fillStyle = isDark ? "#181818" : "#eae8e1";
      ctx.fillRect(0, 0, C, C);

      // Inner orbit ring
      ctx.beginPath();
      ctx.arc(cx, cy, rI, 0, 2 * Math.PI);
      ctx.strokeStyle = isDark ? "rgba(192,189,181,0.14)" : "rgba(58,58,58,0.11)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Outer orbit ring — wobbles and reddens when chaotic
      const wobble = (chaos / 100) * 8 * Math.sin(s.time * 0.4);
      ctx.beginPath();
      ctx.arc(cx, cy, rO + wobble, 0, 2 * Math.PI);
      ctx.strokeStyle = chaos > 50
        ? `rgba(192,80,80,${0.35 + chaos * 0.005})`
        : isDark ? "rgba(192,189,181,0.18)" : "rgba(58,58,58,0.13)";
      ctx.lineWidth = chaos > 50 ? 2 : 1.5;
      ctx.stroke();

      // Tug spokes and marks
      for (const tug of s.tugs) {
        const op = Math.max(0, 1 - tug.age / 1200);
        if (op <= 0) continue;
        const danger = tug.intensity > 2;
        const x = cx + rO * Math.cos(tug.angle);
        const y = cy + rO * Math.sin(tug.angle);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x, y);
        ctx.strokeStyle = danger
          ? `rgba(192,80,80,${op * 0.32})`
          : isDark ? `rgba(192,189,181,${op * 0.16})` : `rgba(58,58,58,${op * 0.11})`;
        ctx.lineWidth = danger ? 1.5 : 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, 3 + tug.intensity * 1.5, 0, 2 * Math.PI);
        ctx.fillStyle = danger
          ? `rgba(192,80,80,${op})`
          : isDark ? `rgba(192,189,181,${op * 0.55})` : `rgba(58,58,58,${op * 0.4})`;
        ctx.fill();
      }

      // Star (sun)
      ctx.beginPath();
      ctx.arc(cx, cy, 13, 0, 2 * Math.PI);
      ctx.fillStyle = "#f59e0b";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#f59e0b";
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner planet
      const xi = cx + rI * Math.cos(thetaI);
      const yi = cy + rI * Math.sin(thetaI);
      ctx.beginPath();
      ctx.arc(xi, yi, 5, 0, 2 * Math.PI);
      ctx.fillStyle = isDark ? "#b0ada8" : "#7a7570";
      ctx.fill();

      // Outer planet — turns red when very chaotic
      const xo = cx + (rO + wobble) * Math.cos(thetaO);
      const yo = cy + (rO + wobble) * Math.sin(thetaO);
      ctx.beginPath();
      ctx.arc(xo, yo, 8, 0, 2 * Math.PI);
      ctx.fillStyle = chaos > 70 ? "#c05a5a" : isDark ? "#7a9abf" : "#4a7fa0";
      ctx.fill();

      // Alignment flash when planets align
      let relA = Math.abs((thetaI - thetaO) % (2 * Math.PI));
      if (relA > Math.PI) relA = 2 * Math.PI - relA;
      if (relA < 0.15) {
        ctx.beginPath();
        ctx.moveTo(xi, yi);
        ctx.lineTo(xo, yo);
        ctx.strokeStyle = chaos > 50
          ? "rgba(192,80,80,0.85)"
          : isDark ? "rgba(192,189,181,0.5)" : "rgba(58,58,58,0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, ratio, isDark]);

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-[#f4f2ec]/70 dark:bg-[rgba(31,31,31,0.6)] rounded-xl border border-[#c0bdb5]/20 dark:border-[#3a3a3a] font-sans my-8">
      <h3 className="text-xl md:text-2xl font-semibold text-[#3a3a3a] dark:text-[#c0bdb5] mb-2">
        Orbital Resonance Simulator
      </h3>
      <p className="text-sm text-[#3a3a3a]/70 dark:text-[#c0bdb5]/70 mb-6">
        When the inner planet overtakes the outer planet, their gravities tug on each other. Watch what happens when tugs keep hitting the same spot.
      </p>

      <div className="flex flex-col md:flex-row gap-5">

        {/* Canvas */}
        <div
          className="flex-1 relative rounded-lg overflow-hidden border border-[#c0bdb5]/30 dark:border-[#2a2a2a] cursor-pointer"
          onClick={() => setIsPlaying(p => !p)}
        >
          <canvas
            ref={canvasRef}
            width={C}
            height={C}
            className="w-full h-auto block"
          />

          {/* Stability badge */}
          <div className="absolute top-3 left-3 pointer-events-none">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide transition-all ${
              chaosLevel > 60
                ? "bg-[#c05a5a]/20 text-[#c05a5a] border border-[#c05a5a]/40"
                : "bg-[#eae8e1]/80 dark:bg-[#1f1f1f]/80 text-[#3a3a3a]/60 dark:text-[#c0bdb5]/60 border border-[#c0bdb5]/20 dark:border-[#3a3a3a]"
            }`}>
              {chaosLevel > 60 ? "UNSTABLE" : "STABLE"}
            </span>
          </div>

          {/* Pause overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
              <div className="bg-[#f4f2ec]/80 dark:bg-[rgba(31,31,31,0.85)] rounded-full p-4 border border-[#c0bdb5]/30 dark:border-[#3a3a3a]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-[#3a3a3a] dark:text-[#c0bdb5] ml-1">
                  <polygon points="3,2 17,10 3,18" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="w-full md:w-52 space-y-4">
          <div className="space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-[#3a3a3a]/50 dark:text-[#c0bdb5]/50 mb-3">
              Orbital Ratio
            </div>
            {PRESETS.map(p => {
              const active = Math.abs(ratio - p.ratio) < 0.0001;
              return (
                <button
                  key={p.label}
                  onClick={e => { e.stopPropagation(); setRatio(p.ratio); }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    active
                      ? "bg-[#3a3a3a] dark:bg-[#c0bdb5] text-[#f4f2ec] dark:text-[#3a3a3a] border-transparent"
                      : "bg-[#c0bdb5]/10 dark:bg-[#2a2a2a] text-[#3a3a3a] dark:text-[#c0bdb5] border-[#c0bdb5]/20 dark:border-[#3a3a3a] hover:bg-[#c0bdb5]/20 dark:hover:bg-[#333333]"
                  }`}
                >
                  <div className="font-semibold font-mono text-xs">{p.label}</div>
                  <div className="text-[10px] opacity-70 mt-0.5">{p.detail}</div>
                </button>
              );
            })}
          </div>

          {/* Custom slider */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-[#3a3a3a]/50 dark:text-[#c0bdb5]/50 mb-1.5">
              <span>Custom ratio</span>
              <span>{ratio.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="1.1"
              max="4.0"
              step="0.001"
              value={ratio}
              onChange={e => { e.stopPropagation(); setRatio(parseFloat(e.target.value)); }}
              className="w-full h-1.5 bg-[#c0bdb5]/30 dark:bg-[#3a3a3a] rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Play / Pause */}
          <button
            onClick={e => { e.stopPropagation(); setIsPlaying(p => !p); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#c0bdb5]/20 dark:bg-[#2a2a2a] text-[#3a3a3a] dark:text-[#c0bdb5] border border-[#c0bdb5]/20 dark:border-[#3a3a3a] hover:bg-[#c0bdb5]/30 dark:hover:bg-[#333333] transition-colors text-sm font-medium"
          >
            {isPlaying ? (
              <>
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <rect x="0" y="0" width="3.5" height="12" rx="1" />
                  <rect x="6.5" y="0" width="3.5" height="12" rx="1" />
                </svg>
                Pause
              </>
            ) : (
              <>
                <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                  <polygon points="0,0 10,6 0,12" />
                </svg>
                Play
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
