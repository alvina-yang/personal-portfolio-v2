"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/components/theme-provider';

const SEED_COUNT = 500;

const FlowerBuilder = () => {
  const [turnFraction, setTurnFraction] = useState(0);
  const [inputValue, setInputValue] = useState('0');
  const [packedCount, setPackedCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(0);
  const { theme } = useTheme();

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setCanvasSize(Math.min(400, width));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Count non-overlapping seeds
  useEffect(() => {
    if (canvasSize === 0) return;
    const W = canvasSize;
    const seedAreaRadius = W * 0.28;
    const scale = seedAreaRadius / Math.sqrt(SEED_COUNT);
    const placed: { x: number; y: number; size: number }[] = [];
    let packed = 0;

    for (let i = 0; i < SEED_COUNT; i++) {
      const r = scale * Math.sqrt(i);
      if (r > seedAreaRadius) continue;
      const theta = i * turnFraction * 2 * Math.PI;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const t = r / seedAreaRadius;
      const size = 1.5 + t * 2.5;

      let overlaps = false;
      for (let j = placed.length - 1; j >= 0; j--) {
        const p = placed[j];
        const dx = x - p.x;
        const dy = y - p.y;
        const minDist = size + p.size;
        if (dx * dx + dy * dy < minDist * minDist) {
          overlaps = true;
          break;
        }
      }
      placed.push({ x, y, size });
      if (!overlaps) packed++;
    }

    setPackedCount(packed);
  }, [turnFraction, canvasSize]);

  // Draw flower
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasSize === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    ctx.scale(dpr, dpr);

    const W = canvasSize;
    const H = canvasSize;
    const cx = W / 2;
    const cy = H / 2;
    const isDark = theme === 'dark';

    ctx.clearRect(0, 0, W, H);

    const seedAreaRadius = W * 0.28;
    const petalBaseRadius = seedAreaRadius;
    const petalLength = W * 0.2;
    const petalWidth = W * 0.045;

    // --- Draw petals (two layers for fullness) ---
    const drawPetalRing = (count: number, extraLen: number, angleOffset: number, hueOffset: number) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + angleOffset;

        const tipDist = petalBaseRadius + petalLength + extraLen;
        const tipX = cx + tipDist * Math.cos(angle);
        const tipY = cy + tipDist * Math.sin(angle);

        const baseX = cx + petalBaseRadius * Math.cos(angle);
        const baseY = cy + petalBaseRadius * Math.sin(angle);

        const perpX = Math.cos(angle + Math.PI / 2);
        const perpY = Math.sin(angle + Math.PI / 2);

        const midDist = petalBaseRadius + (petalLength + extraLen) * 0.45;
        const midX = cx + midDist * Math.cos(angle);
        const midY = cy + midDist * Math.sin(angle);

        const w = petalWidth + extraLen * 0.3;

        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(midX + perpX * w, midY + perpY * w, tipX, tipY);
        ctx.quadraticCurveTo(midX - perpX * w, midY - perpY * w, baseX, baseY);
        ctx.closePath();

        const hue = 45 + hueOffset + (i % 3) * 3;
        ctx.fillStyle = isDark
          ? `hsl(${hue}, 75%, ${52 + (i % 4) * 3}%)`
          : `hsl(${hue}, 85%, ${56 + (i % 4) * 3}%)`;
        ctx.fill();
      }
    };

    drawPetalRing(21, petalLength * 0.25, 0, -8);
    drawPetalRing(34, 0, Math.PI / 34, 0);

    // --- Draw seeds using phyllotaxis ---
    const scale = seedAreaRadius / Math.sqrt(SEED_COUNT);
    const seedColor = isDark ? '#6e411e' : '#502d0f';

    for (let i = 0; i < SEED_COUNT; i++) {
      const r = scale * Math.sqrt(i);
      if (r > seedAreaRadius) continue;
      const theta = i * turnFraction * 2 * Math.PI;
      const x = cx + r * Math.cos(theta);
      const y = cy + r * Math.sin(theta);
      const t = r / seedAreaRadius;
      const size = 1.5 + t * 2.5;

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = seedColor;
      ctx.fill();
    }
  }, [turnFraction, theme, canvasSize]);

  const handleSliderChange = (value: string) => {
    const num = parseFloat(value);
    setTurnFraction(num);
    setInputValue(String(parseFloat(num.toFixed(6))));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0 && num <= 1) {
      setTurnFraction(num);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6 bg-[#f4f2ec]/70 dark:bg-[rgba(31,31,31,0.6)] rounded-xl border border-[#c0bdb5]/20 dark:border-[#3a3a3a] font-sans my-8">
      <h3 className="text-xl md:text-2xl font-semibold text-[#3a3a3a] dark:text-[#c0bdb5] mb-2">The Flower Builder</h3>
      <p className="text-sm text-[#3a3a3a]/70 dark:text-[#c0bdb5]/70 mb-4 text-center">
        Adjust the turn fraction to see how nature packs seeds into flowers.
      </p>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative mb-6 w-full max-w-[400px] aspect-square rounded-lg overflow-hidden border border-[#e5e3e0] dark:border-[#2a2a2a]"
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: canvasSize || undefined, height: canvasSize || undefined }}
        />
      </div>

      {/* Controls */}
      <div className="w-full space-y-3 bg-[#f4f2ec]/70 dark:bg-[rgba(31,31,31,0.6)] p-4 rounded-lg border border-[#c0bdb5]/20 dark:border-[#3a3a3a]">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-[#3a3a3a] dark:text-[#c0bdb5]">Turn Fraction</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="font-mono text-sm bg-transparent border border-[#c0bdb5]/30 dark:border-[#3a3a3a] px-2 py-1 rounded w-24 text-right text-[#3a3a3a] dark:text-[#c0bdb5] focus:outline-none focus:border-[#3a3a3a] dark:focus:border-[#c0bdb5]"
          />
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={turnFraction}
          onChange={(e) => handleSliderChange(e.target.value)}
          className="w-full h-2 bg-[#c0bdb5]/30 dark:bg-[#3a3a3a] rounded-lg appearance-none cursor-pointer"
        />
        <div className="text-xs text-[#3a3a3a]/60 dark:text-[#c0bdb5]/60 font-mono text-right">
          <span className="font-semibold text-[#3a3a3a] dark:text-[#c0bdb5]">{packedCount}</span> / {SEED_COUNT} seeds packed
        </div>
      </div>
    </div>
  );
};

export default FlowerBuilder;
