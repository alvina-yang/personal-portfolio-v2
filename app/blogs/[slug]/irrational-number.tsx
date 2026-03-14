"use client";

import React from "react";
import FlowerBuilder from "@/components/blog/FlowerBuilder";
import LatexRenderer from "@/components/blog/LatexRenderer";

export default function IrrationalNumber() {
  return (
    <>
      <section className="my-12 space-y-3">
        <p>
          You know what is interesting? Nature. Nature is the ultimate optimizer. It quite literally has a 300-million-year R&D budget, a global testing ground, an unforgiving QA department called &quot;Natural Selection&quot;. If a design is inefficient, it goes extinct. If it works, then it gets copied everywhere. 
        </p>
        <p>
          Take a look at a sunflower, a pinecone, the scales of a pineapple. You see the exact same spiral pattern repeating over and over and over again. If you think too much you might ask: What problem is this solving?
        </p>
        <p>
          These plants are actually trying to solve a very specific mathematical challenge: The Packing Problem. 
        </p>
        <p>
          Let&apos;s say you&apos;re a sunflower. Your biological imperative is to pack as many seeds as possible into the smallest possible space. You have one algorithm:
        </p>
        <ol className="list-decimal list-inside ml-4 space-y-1">
          <li>Grow a seed at the center.</li>
          <li>Push the seeds out.</li>
          <li>Turn by an angle.</li>
          <li>Repeat.</li>
        </ol>
        <p>
          Your success actually depends entirely on step 3. So, how much should you turn?
        </p>
        <p>
          Well let&apos;s try.
        </p>
      </section>

      <FlowerBuilder />

      <section className="my-12 space-y-3">
        <p>
          Notice what happens when you put in 0.5 (that&apos;s <LatexRenderer>{"\\frac{1}{2}"}</LatexRenderer>)? You don&apos;t get a flower at all, you get a weird stick thing. Try 0.25 (<LatexRenderer>{"\\frac{1}{4}"}</LatexRenderer>) and you get some cross. If these sunflowers existed in nature they would probably die off pretty quickly.
        </p>
        <p>
          Do you notice a pattern? Whenever we choose a simple fraction like <LatexRenderer>{"\\frac{1}{3}"}</LatexRenderer> or <LatexRenderer>{"\\frac{2}{5}"}</LatexRenderer>, the seeds align perfectly into straight lines, leaving these giant gaps in between. That&apos;s wasted space. The seeds clump into a few spokes and the rest of the flower head is empty.
        </p>
        <p>
          So for us to build the most perfect flower, we need to get rid of these gaps. We need to find a number that refuses to settle into the same repeating pattern, a number which scatters so thoroughly that the seeds never align. We need the most irrational number.
        </p>
      </section>
    </>
  );
}
