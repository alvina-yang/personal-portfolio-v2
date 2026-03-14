"use client";

import React from "react";
import FlowerBuilder from "@/components/blog/FlowerBuilder";
import LatexRenderer from "@/components/blog/LatexRenderer";
import ContinuedFractionVisualizer from "@/components/blog/ContinuedFractionVisualizer";

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
          So for us to build the most perfect flower, we need to get rid of these gaps. We need to find a number that refuses to settle into the same repeating pattern, a number which scatters so thoroughly that the seeds never align. We need an irrational number, we need the most irrational number.
        </p>
      </section>

      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">
          Approximating the Unreachable
        </h2>
        <p>
          Ok wait, how can one number be more irrational than another? We&apos;ve all heard of the celebrities of the irrational world:{" "}
          <LatexRenderer>{"\\pi"}</LatexRenderer>,{" "}
          <LatexRenderer>{"e"}</LatexRenderer>,{" "}
          <LatexRenderer>{"\\sqrt{2}"}</LatexRenderer>.
          But aren&apos;t numbers just rational or irrational?
        </p>
        <p>
          Let&apos;s think of &quot;irrationality&quot; as a distance. We can think of it representing how hard it is for a fraction to get close to you. Some numbers, like{" "}
          <LatexRenderer>{"\\pi"}</LatexRenderer>, play hard to get, but eventually give in. Other numbers are a bit more stubborn.
        </p>
        <p>
          We need a way to measure this stubbornness.
        </p>
        <p>
          Any number in the universe can be rewritten as a nested fraction:
        </p>
      </section>

      <LatexRenderer latex={"\\[x = a_0 + \\cfrac{1}{a_1 + \\cfrac{1}{a_2 + \\cfrac{1}{a_3 + \\ddots}}}\\]"} />

      <section className="my-12 space-y-3">
        <p>The algorithm is actually pretty simple:</p>
        <ol className="list-decimal list-inside ml-4 space-y-1">
          <li>
            Write down the integer part (<LatexRenderer>{"a_0"}</LatexRenderer>).
          </li>
          <li>Take the decimal remainder.</li>
          <li>
            Calculate the reciprocal (<LatexRenderer>{"\\frac{1}{\\text{remainder}}"}</LatexRenderer>).
          </li>
          <li>Repeat.</li>
        </ol>
        <p>
          Let&apos;s try it with <LatexRenderer>{"\\pi"}</LatexRenderer> (3.14159&hellip;).
        </p>
        <p>
          Integer part is 3. Remainder is 0.14159&hellip;
        </p>
      </section>
      <LatexRenderer latex={"\\[\\frac{1}{0.14159\\ldots} = 7.0625\\ldots \\implies \\text{next integer: } 7\\]"} />
      <section className="my-12 space-y-3">
        <p>
          Remainder is 0.0625&hellip;
        </p>
      </section>
      <LatexRenderer latex={"\\[\\frac{1}{0.0625\\ldots} = 15.996\\ldots \\implies \\text{next integer: } 15\\]"} />
      <section className="my-12 space-y-3">
        <p>And so on&hellip;</p>
        <p>
          So, the &quot;DNA&quot; of <LatexRenderer>{"\\pi"}</LatexRenderer> looks like this:{" "}
          <LatexRenderer>{"[3;\\, 7,\\, 15,\\, 1,\\, 292,\\, \\ldots]"}</LatexRenderer>.
        </p>
        <p>
          These numbers (7, 15, 292) are the denominators. A rule for approximation: <span className="font-semibold">big denominators are bad for privacy.</span>
        </p>
        <p>
          If a number in this sequence is big (like 292), it means the fraction at that step is a pretty good approximation. This is why{" "}
          <LatexRenderer>{"\\pi"}</LatexRenderer>{" "}is actually pretty easy to approximate. The famous school approximation{" "}
          <LatexRenderer>{"\\frac{22}{7}"}</LatexRenderer>{" "}is shockingly accurate because the next number in the sequence (15) is relatively large.
        </p>
        <p>
          But what if we wanted to design a number that is impossible to approximate? What if we wanted to prevent the fraction from ever &quot;landing&quot; close to the target?
        </p>
        <p>
          We would want to avoid big jumps. We would want the denominators to be as small as possible.
        </p>
      </section>

      <ContinuedFractionVisualizer />

      <section className="my-12 space-y-3">
        <p>
          Try selecting <LatexRenderer>{"\\pi"}</LatexRenderer> in the tool above. Watch how quickly the dot snaps to the target. It jumps, corrects, and boom — it&apos;s almost there.
        </p>
        <p>
          Now, try selecting <LatexRenderer>{"\\phi"}</LatexRenderer> (The Golden Ratio).
        </p>
        <p>It is just:</p>
      </section>

      <LatexRenderer latex={"\\[[1;\\, 1,\\, 1,\\, 1,\\, 1,\\, 1,\\, \\ldots]\\]"} />

      <section className="my-12 space-y-3">
        <p>
          It is a sequence entirely made up of ones because 1 is the smallest possible positive integer. The Golden Ratio is composed entirely of the worst possible convergence steps. It represents the slowest possible convergence of any number.
        </p>
        <p>
          This is why the sunflower chose it.
        </p>
        <p>
          If the sunflower used <LatexRenderer>{"\\pi"}</LatexRenderer>, the seeds would eventually align into a pattern (specifically, a pattern with 7 or 113 spokes). However, since it uses <LatexRenderer>{"\\phi"}</LatexRenderer>, the &quot;most irrational&quot; number, the seeds never quite line up. They are constantly pushed into the gaps, spiraling out forever, perfectly packing the head without wasting a distinct &quot;spoke&quot; of space.
        </p>
      </section>
    </>
  );
}
