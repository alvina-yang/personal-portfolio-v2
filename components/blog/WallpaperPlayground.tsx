"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import type p5 from "p5";

function wrap01(v: number) {
  return ((v % 1) + 1) % 1;
}

function rotateAroundCenter(x: number, y: number, radians: number) {
  const cx = 0.5;
  const cy = 0.5;
  const dx = x - cx;
  const dy = y - cy;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const rx = dx * cos - dy * sin + cx;
  const ry = dx * sin + dy * cos + cy;
  return { x: wrap01(rx), y: wrap01(ry) };
}

type Point = { x: number; y: number };

const S_GROUPS: Record<string, (pt: Point) => Point[]> = {
  p1: (pt) => [pt],
  pm: (pt) => [pt, { x: 1 - pt.x, y: pt.y }],
  p2: (pt) => [pt, { x: 1 - pt.x, y: 1 - pt.y }],
  pg: (pt) => [pt, { x: wrap01(pt.x + 0.5), y: 1 - pt.y }],
  cm: (pt) => [pt, { x: wrap01(pt.x + 0.5), y: 1 - pt.y }],
  pgg: (pt) => [
    pt,
    { x: wrap01(pt.x + 0.5), y: 1 - pt.y },
    { x: 1 - pt.x, y: wrap01(pt.y + 0.5) },
    { x: wrap01(1 - pt.x + 0.5), y: wrap01(1 - pt.y + 0.5) },
  ],
  pmm: (pt) => [
    pt,
    { x: 1 - pt.x, y: pt.y },
    { x: pt.x, y: 1 - pt.y },
    { x: 1 - pt.x, y: 1 - pt.y },
  ],
  cmm: (pt) => [
    pt,
    { x: pt.y, y: pt.x },
    { x: 1 - pt.y, y: 1 - pt.x },
    { x: 1 - pt.x, y: 1 - pt.y },
  ],
  pmg: (pt) => [
    pt,
    { x: 1 - pt.x, y: pt.y },
    { x: wrap01(pt.x + 0.5), y: 1 - pt.y },
    { x: wrap01(1 - pt.x + 0.5), y: 1 - pt.y },
  ],
  p4: (pt) => [
    pt,
    rotateAroundCenter(pt.x, pt.y, Math.PI / 2),
    rotateAroundCenter(pt.x, pt.y, Math.PI),
    rotateAroundCenter(pt.x, pt.y, (3 * Math.PI) / 2),
  ],
  p4m: (pt) => {
    const rots = S_GROUPS.p4(pt);
    const mirrors: Point[] = [];
    for (const q of rots) {
      mirrors.push(q, { x: 1 - q.x, y: q.y }, { x: q.x, y: 1 - q.y });
    }
    return mirrors;
  },
  p4g: (pt) => {
    const rots = S_GROUPS.p4(pt);
    const out: Point[] = [];
    for (const q of rots) {
      out.push(q, { x: wrap01(q.x + 0.5), y: 1 - q.y });
    }
    return out;
  },
  p3: (pt) => [
    pt,
    rotateAroundCenter(pt.x, pt.y, (2 * Math.PI) / 3),
    rotateAroundCenter(pt.x, pt.y, (4 * Math.PI) / 3),
  ],
  p3m1: (pt) => {
    const r = S_GROUPS.p3(pt);
    return r.flatMap((q) => [q, { x: 1 - q.x, y: q.y }]);
  },
  p31m: (pt) => {
    const r = S_GROUPS.p3(pt);
    return r.flatMap((q) => [q, { x: q.y, y: q.x }]);
  },
  p6: (pt) => [
    rotateAroundCenter(pt.x, pt.y, 0),
    rotateAroundCenter(pt.x, pt.y, Math.PI / 3),
    rotateAroundCenter(pt.x, pt.y, (2 * Math.PI) / 3),
    rotateAroundCenter(pt.x, pt.y, Math.PI),
    rotateAroundCenter(pt.x, pt.y, (4 * Math.PI) / 3),
    rotateAroundCenter(pt.x, pt.y, (5 * Math.PI) / 3),
  ],
  p6m: (pt) => {
    const r = S_GROUPS.p6(pt);
    return r.flatMap((q) => [q, { x: 1 - q.x, y: q.y }]);
  },
};

const GROUP_KEYS = [
  "p1",
  "pg",
  "pm",
  "cm",
  "p2",
  "pgg",
  "pmm",
  "cmm",
  "pmg",
  "p4",
  "p4m",
  "p4g",
  "p3",
  "p3m1",
  "p31m",
  "p6",
  "p6m",
];

export default function WallpaperPlayground() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [groupKey, setGroupKey] = useState("p1");

  // 👇 your custom theme provider
  const { theme } = useTheme();
  const isDarkRef = useRef(theme === "dark");

  useEffect(() => {
    isDarkRef.current = theme === "dark";
  }, [theme]);

  const strokesRef = useRef<Point[][]>([]);
  const currentStrokeRef = useRef<Point[]>([]);
  const isDrawingRef = useRef(false);
  const TILE_COUNT = 3;
  const currentTileRef = useRef({ gx: 1, gy: 1 });

  useEffect(() => {
    const updateDimensions = () => {
      if (sketchRef.current) {
        const rect = sketchRef.current.getBoundingClientRect();
        const size = Math.floor(rect.width);
        if (size > 0) {
          setDimensions({ width: size, height: size });
        }
      }
    };
    const timer = setTimeout(updateDimensions, 50);
    window.addEventListener("resize", updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;
    if (!sketchRef.current) return;

    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }

    import("p5")
      .then((p5Module) => {
        const P5 = p5Module.default;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sketch = (p5: any) => {
          const W = dimensions.width;
          const H = dimensions.height;
          const cellW = W / TILE_COUNT;
          const cellH = H / TILE_COUNT;

          const BG_LIGHT = [250, 249, 246]; // cream color #faf9f6
          const BG_DARK = 15;
          const STROKE_LIGHT = 26;
          const STROKE_DARK = 245;

          p5.setup = () => {
            if (!sketchRef.current) return;
            try {
              const cnv = p5.createCanvas(W, H);
              cnv.parent(sketchRef.current);
              p5.pixelDensity(1);

              const currentIsDark = isDarkRef.current;
              const strokeColor = currentIsDark ? STROKE_DARK : STROKE_LIGHT;

              if (currentIsDark) {
                p5.background(BG_DARK);
              } else {
                p5.background(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
              }
              p5.stroke(strokeColor);
              p5.strokeWeight(2);
              p5.noFill();
            } catch (err) {
              console.error("Canvas setup error:", err);
            }
          };

          function normPointFromTile(
            x: number,
            y: number,
            gx: number,
            gy: number
          ) {
            const nx = (x - gx * cellW) / cellW;
            const ny = (y - gy * cellH) / cellH;
            return { x: nx, y: ny };
          }

          function denormPointToCell(pt: Point, gx: number, gy: number) {
            return {
              x: pt.x * cellW + gx * cellW,
              y: pt.y * cellH + gy * cellH,
            };
          }

          function drawPolyline(points: Point[]) {
            if (!points || points.length < 2) return;
            p5.beginShape();
            for (let i = 0; i < points.length; i++) {
              p5.vertex(points[i].x, points[i].y);
            }
            p5.endShape();
          }

          function generateSymmetryPolylines(normStroke: Point[]) {
            const perIndex: Point[][] = [];
            for (let i = 0; i < normStroke.length; i++) {
              const images = (S_GROUPS[groupKey] || S_GROUPS.p1)(
                normStroke[i]
              );
              for (let k = 0; k < images.length; k++) {
                if (!perIndex[k]) perIndex[k] = [];
                perIndex[k].push(images[k]);
              }
            }
            return perIndex;
          }

          p5.mousePressed = () => {
            if (
              p5.mouseX < 0 ||
              p5.mouseX > W ||
              p5.mouseY < 0 ||
              p5.mouseY > H
            )
              return;
            const gx = Math.floor(p5.mouseX / cellW);
            const gy = Math.floor(p5.mouseY / cellH);
            currentTileRef.current = { gx, gy };
            isDrawingRef.current = true;
            currentStrokeRef.current = [
              normPointFromTile(p5.mouseX, p5.mouseY, gx, gy),
            ];
          };

          p5.mouseDragged = () => {
            if (!isDrawingRef.current) return;
            if (
              p5.mouseX < 0 ||
              p5.mouseX > W ||
              p5.mouseY < 0 ||
              p5.mouseY > H
            )
              return;
            const { gx, gy } = currentTileRef.current;
            const minX = gx * cellW,
              maxX = (gx + 1) * cellW;
            const minY = gy * cellH,
              maxY = (gy + 1) * cellH;
            const x = Math.min(Math.max(p5.mouseX, minX), maxX);
            const y = Math.min(Math.max(p5.mouseY, minY), maxY);
            currentStrokeRef.current.push(
              normPointFromTile(x, y, gx, gy)
            );
          };

          p5.mouseReleased = () => {
            if (!isDrawingRef.current) return;
            isDrawingRef.current = false;
            if (currentStrokeRef.current.length > 1) {
              strokesRef.current.push([...currentStrokeRef.current]);
            }
            currentStrokeRef.current = [];
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          p5.touchStarted = (e?: any) => {
            if (p5.touches && p5.touches.length > 0) {
              const t = p5.touches[0];
              if (t.x >= 0 && t.x <= W && t.y >= 0 && t.y <= H) {
                const gx = Math.floor(t.x / cellW);
                const gy = Math.floor(t.y / cellH);
                currentTileRef.current = { gx, gy };
                isDrawingRef.current = true;
                currentStrokeRef.current = [
                  normPointFromTile(t.x, t.y, gx, gy),
                ];
                e?.preventDefault();
              }
            }
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          p5.touchMoved = (e?: any) => {
            if (!isDrawingRef.current) return;
            if (p5.touches && p5.touches.length > 0) {
              const t = p5.touches[0];
              const { gx, gy } = currentTileRef.current;
              const minX = gx * cellW,
                maxX = (gx + 1) * cellW;
              const minY = gy * cellH,
                maxY = (gy + 1) * cellH;
              const x = Math.min(Math.max(t.x, minX), maxX);
              const y = Math.min(Math.max(t.y, minY), maxY);
              currentStrokeRef.current.push(
                normPointFromTile(x, y, gx, gy)
              );
              e?.preventDefault();
            }
          };

          p5.touchEnded = () => {
            if (!isDrawingRef.current) return;
            isDrawingRef.current = false;
            if (currentStrokeRef.current.length > 1) {
              strokesRef.current.push([...currentStrokeRef.current]);
            }
            currentStrokeRef.current = [];
          };

          p5.draw = () => {
            try {
              const currentIsDark = isDarkRef.current;
              const strokeColor = currentIsDark ? STROKE_DARK : STROKE_LIGHT;

              if (currentIsDark) {
                p5.background(BG_DARK);
              } else {
                p5.background(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
              }
              p5.stroke(strokeColor);
              p5.strokeWeight(2);
              p5.noFill();

              const drawAll = (s: Point[]) => {
                const polys = generateSymmetryPolylines(s);
                for (let gy = 0; gy < TILE_COUNT; gy++) {
                  for (let gx = 0; gx < TILE_COUNT; gx++) {
                    for (const poly of polys) {
                      const dnPoly = poly.map((pt) =>
                        denormPointToCell(pt, gx, gy)
                      );
                      drawPolyline(dnPoly);
                    }
                  }
                }
              };

              for (const s of strokesRef.current) drawAll(s);
              if (currentStrokeRef.current.length > 1)
                drawAll(currentStrokeRef.current);
            } catch (err) {
              console.error("Draw error:", err);
            }
          };
        };

        if (!sketchRef.current) return;
        const instance = new P5(sketch);
        p5InstanceRef.current = instance;
      })
      .catch((err) => {
        console.error("Failed to load p5:", err);
      });

    return () => {
      if (p5InstanceRef.current) {
        try {
          p5InstanceRef.current.remove();
        } catch (err) {
          console.error("Error removing p5 instance:", err);
        }
        p5InstanceRef.current = null;
      }
    };
  }, [dimensions, groupKey, theme]);

  const clearCanvas = () => {
    strokesRef.current = [];
    currentStrokeRef.current = [];
    if (p5InstanceRef.current) {
      try {
        p5InstanceRef.current.redraw();
      } catch (err) {
        console.error("Error redrawing:", err);
      }
    }
  };

  const handleGroupChange = (newGroup: string) => {
    setGroupKey(newGroup);
    strokesRef.current = [];
    currentStrokeRef.current = [];
    if (p5InstanceRef.current) {
      try {
        p5InstanceRef.current.redraw();
      } catch (err) {
        console.error("Error redrawing:", err);
      }
    }
  };

  return (
    <div className="flex gap-6 md:gap-10 items-center justify-center my-8 w-full max-w-5xl mx-auto flex-wrap lg:flex-nowrap">
      {/* Controls */}
      <div className="flex flex-col w-full max-w-[280px] lg:max-w-[280px] p-5 bg-[#f4f2ec]/70 dark:bg-[rgba(31,31,31,0.6)] rounded-lg border border-[#c0bdb5]/30 dark:border-[#3a3a3a]">
        <div className="font-mono text-sm opacity-70 mb-4 pb-3 border-b border-[#c0bdb5]/30 dark:border-[#3a3a3a] uppercase tracking-wider">
          Symmetry Groups
        </div>

        <div className="grid grid-cols-2 gap-1 flex-1 content-start mb-4">
          {GROUP_KEYS.map((g) => (
            <label
              key={g}
              className="flex items-center justify-between p-2 cursor-pointer transition-all rounded hover:bg-[#e5e3e0]/50 dark:hover:bg-[rgba(255,255,255,0.05)]"
            >
              {/* Accent = bold only, no blue */}
              <span
                className={`font-mono text-sm flex-1 transition-colors ${
                  groupKey === g ? "font-bold" : "opacity-60"
                }`}
              >
                {g}
              </span>
              <input
                type="radio"
                name="wallpaper-group"
                value={g}
                checked={groupKey === g}
                onChange={() => handleGroupChange(g)}
                className="sr-only"
              />
              <div className="w-4 h-4 rounded-full border-2 relative transition-all border-[#3a3a3a] dark:border-[#c0bdb5]">
                <div
                  className={`absolute w-2 h-2 rounded-full bg-[#3a3a3a] dark:bg-[#c0bdb5] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform ${
                    groupKey === g ? "scale-100" : "scale-0"
                  }`}
                />
              </div>
            </label>
          ))}
        </div>

        <div className="h-px bg-[#c0bdb5]/30 dark:bg-[#3a3a3a] my-4" />

        <button
          onClick={clearCanvas}
          className="bg-transparent border border-[#3a3a3a] dark:border-[#c0bdb5] text-[#3a3a3a] dark:text-[#c0bdb5] rounded-md px-4 py-3 font-mono text-sm cursor-pointer transition-all hover:bg-[#3a3a3a] hover:text-[#faf9f6] dark:hover:bg-[#c0bdb5] dark:hover:text-[#0f0f0f] hover:-translate-y-0.5"
        >
          Clear Drawing
        </button>
      </div>

      {/* Canvas */}
      <div className="relative w-full max-w-[400px] lg:max-w-[450px]">
        <div
          ref={sketchRef}
          className="relative w-full aspect-square overflow-hidden bg-transparent rounded-lg border border-[#e5e3e0] dark:border-[#2a2a2a]"
          style={{
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
          }}
        />
      </div>
    </div>
  );
}
