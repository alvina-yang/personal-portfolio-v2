"use client";

import React, { useEffect, useRef } from "react";

type LatexRendererProps = {
  latex?: string;
  displayMode?: boolean;
  children?: React.ReactNode;
};

function ensureKatexStylesAdded() {
  if (typeof document === "undefined") return;

  const existing = document.getElementById("katex-css");
  if (existing) return;

  const link = document.createElement("link");
  link.id = "katex-css";
  link.rel = "stylesheet";
  link.href =
    "https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

async function renderBlock(
  content: string,
  element: HTMLElement | null,
  isMath: boolean,
  isDisplayMode: boolean,
) {
  if (!element) return;

  if (!isMath) {
    element.innerHTML = content.replace(/\n/g, "<br/>");
    return;
  }

  try {
    ensureKatexStylesAdded();
    const katexModule = await import("katex");
    const katex = "default" in katexModule ? katexModule.default : katexModule;
    katex.render(content, element, {
      displayMode: !!isDisplayMode,
      throwOnError: false,
      trust: true,
      strict: false,
    });
  } catch (err) {
    console.error("Math render error:", err);
    element.textContent = content;
  }
}

export default function LatexRenderer({
  latex,
  displayMode = true,
  children,
}: LatexRendererProps) {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const inlineRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const raw = latex != null ? latex : children;
    const input = raw != null ? String(raw) : "";
    if (!input) return;

    const isInlineUsage = latex == null;
    const effectiveDisplayMode = isInlineUsage ? false : !!displayMode;
    const container = effectiveDisplayMode
      ? (blockRef.current as HTMLElement | null)
      : (inlineRef.current as HTMLElement | null);

    if (!container) return;

    const blocks = effectiveDisplayMode
      ? input
          .split(/\n\s*\n/)
          .map((b) => b.trim())
          .filter(Boolean)
      : [input.trim()];

    container.innerHTML = "";

    blocks.forEach((block) => {
      const el = document.createElement(
        effectiveDisplayMode ? "div" : "span",
      );
      container.appendChild(el);

      const hasDelimiters =
        block.startsWith("\\[") ||
        block.startsWith("\\(") ||
        block.startsWith("\\begin");
      const hasMathHints =
        block.includes("&=") ||
        block.includes("^") ||
        block.includes("\\frac") ||
        block.includes("\\sum") ||
        block.includes("\\int");

      const isInlineUsageHere = latex == null;
      const isMathBlock = isInlineUsageHere
        ? true
        : hasDelimiters || hasMathHints;

      const cleanBlock = block
        .replace(/^\\\[|\\\]$/g, "")
        .replace(/^\\\(|\\\)$/g, "");

      void renderBlock(
        cleanBlock,
        el,
        isMathBlock,
        effectiveDisplayMode,
      );
    });
  }, [latex, children, displayMode]);

  const isInlineUsage = latex == null;
  const effectiveDisplayMode = isInlineUsage ? false : !!displayMode;

  if (effectiveDisplayMode) {
    return <div ref={blockRef} />;
  }

  return <span ref={inlineRef} />;
}
