"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import type p5 from "p5";

const KissingContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-6 md:gap-10 justify-center items-center my-8 flex-wrap w-full max-w-4xl mx-auto">
    {children}
  </div>
);

const VisualizationWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col items-center gap-2 w-full max-w-[300px] md:max-w-[350px]">
    {children}
  </div>
);

// 🔑 Make the whole container ignore all pointer / touch input
const CanvasContainer = React.forwardRef<HTMLDivElement>((props, ref) => (
  <div
    ref={ref}
    className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#e5e3e0] dark:border-[#2a2a2a]"
    style={{
      pointerEvents: "none",          // <- key line
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTapHighlightColor: "transparent",
      WebkitTouchCallout: "none",
      touchAction: "auto",
    }}
  />
));
CanvasContainer.displayName = "CanvasContainer";

const Label = ({ children }: { children: React.ReactNode }) => (
  <div className="font-mono text-sm text-center opacity-70 mt-1">{children}</div>
);

export default function KissingNumber() {
  const canvas2DRef = useRef<HTMLDivElement>(null);
  const canvas3DRef = useRef<HTMLDivElement>(null);
  const p5Instance2DRef = useRef<p5 | null>(null);
  const p5Instance3DRef = useRef<p5 | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const { theme } = useTheme();
  const isDarkRef = useRef(theme === "dark");

  useEffect(() => {
    isDarkRef.current = theme === "dark";
  }, [theme]);

  useEffect(() => {
    const updateDimensions = () => {
      if (canvas2DRef.current) {
        const rect = canvas2DRef.current.getBoundingClientRect();
        const size = Math.floor(rect.width);
        if (size > 0) {
          setDimensions((prev) => {
            if (prev.width !== size) {
              return { width: size, height: size };
            }
            return prev;
          });
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

    import("p5").then((p5Module) => {
      const P5 = p5Module.default;

      const BG_LIGHT = [250, 249, 246];
      const BG_DARK = 15;
      const STROKE_LIGHT = 26;
      const STROKE_DARK = 245;

      // 2D Kissing Number Visualization
      if (canvas2DRef.current && !p5Instance2DRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sketch2D = (p5: any) => {
          const W = dimensions.width;
          const H = dimensions.height;
          const centerRadius = 40;
          const surroundRadius = 40;
          let angle = 0;

          p5.setup = () => {
            if (!canvas2DRef.current) return;
            const cnv = p5.createCanvas(W, H);
            cnv.parent(canvas2DRef.current);

            const canvasEl = cnv.elt as HTMLCanvasElement;
            canvasEl.style.touchAction = "auto";
            canvasEl.style.pointerEvents = "none"; // extra safety

            p5.frameRate(30);
          };

          // no touch / mouse handlers at all

          p5.draw = () => {
            const currentIsDark = isDarkRef.current;
            const strokeColor = currentIsDark ? STROKE_DARK : STROKE_LIGHT;

            if (currentIsDark) {
              p5.background(BG_DARK);
            } else {
              p5.background(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
            }
            p5.noFill();
            p5.strokeWeight(2);

            const cx = W / 2;
            const cy = H / 2;

            // Central circle
            p5.stroke(strokeColor);
            p5.circle(cx, cy, centerRadius * 2);

            // Surrounding circles (6 in 2D)
            const distance = centerRadius + surroundRadius;
            for (let i = 0; i < 6; i++) {
              const a = angle + (i * p5.TWO_PI) / 6;
              const x = cx + distance * p5.cos(a);
              const y = cy + distance * p5.sin(a);

              const alpha = 160 + 70 * p5.sin(angle * 2 + i);
              p5.stroke(strokeColor, alpha);
              p5.circle(x, y, surroundRadius * 2);
            }

            angle += 0.01;
          };
        };

        p5Instance2DRef.current = new P5(sketch2D);
      }

      // 3D Kissing Number Visualization
      if (canvas3DRef.current && !p5Instance3DRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sketch3D = (p5: any) => {
          const W = dimensions.width;
          const H = dimensions.height;
          const centerRadius = 35;
          const surroundRadius = 35;
          let angleX = 0;
          let angleY = 0;

          const phi = (1 + Math.sqrt(5)) / 2;
          const vertices = [
            [0, 1, phi],
            [0, -1, phi],
            [0, 1, -phi],
            [0, -1, -phi],
            [1, phi, 0],
            [-1, phi, 0],
            [1, -phi, 0],
            [-1, -phi, 0],
            [phi, 0, 1],
            [-phi, 0, 1],
            [phi, 0, -1],
            [-phi, 0, -1],
          ];

          const normalized = vertices.map((v) => {
            const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
            return v.map((c) => (c / len) * (centerRadius + surroundRadius));
          });

          p5.setup = () => {
            if (!canvas3DRef.current) return;
            const cnv = p5.createCanvas(W, H, p5.WEBGL);
            cnv.parent(canvas3DRef.current);

            const canvasEl = cnv.elt as HTMLCanvasElement;
            canvasEl.style.touchAction = "auto";
            canvasEl.style.pointerEvents = "none"; // extra safety

            p5.frameRate(30);
          };

          // no touch / mouse handlers at all

          p5.draw = () => {
            const currentIsDark = isDarkRef.current;

            if (currentIsDark) {
              p5.background(BG_DARK);
            } else {
              p5.background(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
            }
            p5.rotateX(angleX);
            p5.rotateY(angleY);

            if (currentIsDark) {
              p5.ambientLight(90);
              p5.directionalLight(230, 230, 230, 0.5, 0.5, -1);
              p5.pointLight(230, 230, 230, 200, 200, 200);
            } else {
              p5.ambientLight(140);
              p5.directionalLight(255, 255, 255, 0.5, 0.5, -1);
              p5.pointLight(255, 255, 255, 200, 200, 200);
            }

            // Central sphere
            p5.push();
            p5.noStroke();
            const centerFill = currentIsDark ? STROKE_DARK : STROKE_LIGHT;
            p5.fill(centerFill);
            p5.sphere(centerRadius);
            p5.pop();

            // Surrounding spheres
            normalized.forEach((pos) => {
              p5.push();
              p5.translate(pos[0], pos[1], pos[2]);

              const baseFill = currentIsDark ? 220 : 50;
              const variation = p5.map(pos[2], -100, 100, -20, 20);
              const sphereColor = p5.constrain(baseFill + variation, 0, 255);

              p5.noStroke();
              p5.fill(sphereColor);
              p5.sphere(surroundRadius);
              p5.pop();
            });

            angleX += 0.005;
            angleY += 0.007;
          };
        };

        p5Instance3DRef.current = new P5(sketch3D);
      }
    });

    return () => {
      if (p5Instance2DRef.current) {
        p5Instance2DRef.current.remove();
        p5Instance2DRef.current = null;
      }
      if (p5Instance3DRef.current) {
        p5Instance3DRef.current.remove();
        p5Instance3DRef.current = null;
      }
    };
  }, [dimensions]);

  return (
    <KissingContainer>
      <VisualizationWrapper>
        <CanvasContainer ref={canvas2DRef} />
        <Label>2D: 6 circles &ldquo;kissing&rdquo;</Label>
      </VisualizationWrapper>

      <VisualizationWrapper>
        <CanvasContainer ref={canvas3DRef} />
        <Label>3D: 12 spheres &ldquo;kissing&rdquo;</Label>
      </VisualizationWrapper>
    </KissingContainer>
  );
}
 