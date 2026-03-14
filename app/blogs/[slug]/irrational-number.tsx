"use client";

import React from "react";
import FlowerBuilder from "@/components/blog/FlowerBuilder";
import LatexRenderer from "@/components/blog/LatexRenderer";
import ContinuedFractionVisualizer from "@/components/blog/ContinuedFractionVisualizer";
import OrbitalResonance from "@/components/blog/OrbitalResonance";

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

      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Hurwitz &amp; Lagrange</h2>
        <p>
          In 1891, a mathematician named Adolf Hurwitz asked &quot;Is there a universal limit to how well fractions can approximate numbers?&quot;
        </p>
        <p>
          To understand what he was getting at, we need to see what a fair approximation is.
        </p>
        <p>
          If you want to approximate <LatexRenderer>{"\\pi"}</LatexRenderer>, you could just use{" "}
          <LatexRenderer>{"\\frac{314159}{100000}"}</LatexRenderer>{" "}which is a great approximation, but it&apos;s also cheating. The denominator is massive so of course, you can get a small error if you use giant numbers.
        </p>
        <p>
          We need to judge error relative to the size of the denominator we used.
        </p>
        <p>
          Hurwitz discovered that for any real irrational number (let&apos;s call it{" "}
          <LatexRenderer>{"\\xi"}</LatexRenderer>), there are infinitely many coprime integers{" "}
          <LatexRenderer>{"p"}</LatexRenderer> and <LatexRenderer>{"q"}</LatexRenderer>{" "}
          (forming <LatexRenderer>{"\\frac{p}{q}"}</LatexRenderer>) that satisfy the inequality:
        </p>
      </section>

      <LatexRenderer latex={"\\[\\left| \\xi - \\frac{p}{q} \\right| < \\frac{1}{\\sqrt{5}\\, q^2}\\]"} />

      <section className="my-12 space-y-3">
        <p>
          <span className="font-semibold">The Left Side:</span>{" "}
          <LatexRenderer>{"\\left| \\xi - \\frac{p}{q} \\right|"}</LatexRenderer>{" "}
          represents the distance between the irrational number (<LatexRenderer>{"\\xi"}</LatexRenderer>) and our rational guess (<LatexRenderer>{"\\frac{p}{q}"}</LatexRenderer>). We want this distance to be as small as possible.
        </p>
        <p>
          <span className="font-semibold">The Right Side:</span>{" "}
          <LatexRenderer>{"\\frac{1}{\\sqrt{5}\\, q^2}"}</LatexRenderer>{" "}
          is the Worst-Case. The <LatexRenderer>{"q^2"}</LatexRenderer> at the bottom means that as you use larger denominators, your guaranteed error shrinks quadratically.
        </p>
        <p>
          Why is the constant exactly <LatexRenderer>{"\\sqrt{5}"}</LatexRenderer>?
        </p>
        <p>
          Hurwitz&apos;s Theorem applies to ALL irrational numbers. So, this can really only be as strong as its weakest link.
        </p>
        <p>
          Let&apos;s say a delivery company guarantees that they can deliver to any house in the city under{" "}
          <LatexRenderer>{"X"}</LatexRenderer> minutes.&quot; To determine <LatexRenderer>{"X"}</LatexRenderer>, they have to look at the single hardest to reach house.
        </p>
        <p>
          Here, the Golden Ratio (<LatexRenderer>{"\\phi"}</LatexRenderer>) is that house.
        </p>
        <p>
          Therefore, <LatexRenderer>{"\\phi"}</LatexRenderer> creates an absolute bottleneck. Because it exists, the universal constant for all numbers is permanently capped at <LatexRenderer>{"\\sqrt{5}"}</LatexRenderer>.
        </p>
      </section>

      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">The Lagrange Spectrum</h2>
        <p>
          This leads to a thought experiment: What if we change the rules to exclude <LatexRenderer>{"\\phi"}</LatexRenderer>?
        </p>
        <p>
          By excluding the <LatexRenderer>{"\\phi"}</LatexRenderer> family from our theorem, Hurwitz&apos;s guaranteed limit upgrades. The constant <LatexRenderer>{"\\sqrt{5}"}</LatexRenderer> gets replaced by <LatexRenderer>{"\\sqrt{8}"}</LatexRenderer>. The formal inequality becomes:
        </p>
      </section>

      <LatexRenderer latex={"\\[\\left| \\xi - \\frac{p}{q} \\right| < \\frac{1}{\\sqrt{8}\\, q^2}\\]"} />

      <section className="my-12 space-y-3">
        <p>
          By deliberately ignoring <LatexRenderer>{"\\phi"}</LatexRenderer>, fractions suddenly became mathematically guaranteed to be better at approximating the remaining numbers.
        </p>
        <p>
          But why did it stop at <LatexRenderer>{"\\sqrt{8}"}</LatexRenderer>? Because once <LatexRenderer>{"\\phi"}</LatexRenderer> is excluded, a new number is revealed: <LatexRenderer>{"\\sqrt{2}"}</LatexRenderer> (The Silver Ratio).
        </p>
        <p>
          Look at <LatexRenderer>{"\\sqrt{2}"}</LatexRenderer>:{" "}
          <LatexRenderer>{"[1;\\, 2,\\, 2,\\, 2,\\, 2\\, \\ldots]"}</LatexRenderer>.
          Because its continued fraction is made entirely of 2s, it is the second worst number to approximate. It now sets the new worst-case scenario.
        </p>
        <p>
          What if we restrict our theorem again, this time excluding both the <LatexRenderer>{"\\phi"}</LatexRenderer> family AND the <LatexRenderer>{"\\sqrt{2}"}</LatexRenderer> family? The constant jumps to{" "}
          <LatexRenderer>{"\\frac{\\sqrt{221}}{5}"}</LatexRenderer> (roughly 2.97), changing the equation to:
        </p>
      </section>

      <LatexRenderer latex={"\\[\\left| \\xi - \\frac{p}{q} \\right| < \\frac{1}{\\frac{\\sqrt{221}}{5}\\, q^2}\\]"} />

      <section className="my-12 space-y-3">
        <p>
          This staircase of &quot;worst numbers&quot; forms something called the Lagrange Spectrum.
        </p>
        <p>
          Before this was discovered, we might have assumed that irrationality was a smooth, gradual spectrum. Instead, the number line is fundamentally quantized.
        </p>
      </section>

      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">The Wall at 3 and Markov</h2>
        <p>
          As you keep narrowing the rules the constant gets larger:{" "}
          <LatexRenderer>{"2.23 \\to 2.82 \\to 2.97 \\to 2.99 \\dots"}</LatexRenderer>
        </p>
        <p>
          But it doesn&apos;t grow forever. It inches closer and closer to 3, but it never quite reaches it while remaining in discrete steps.
        </p>
        <p>
          These numbers are actually generated by a specific sequence of integers called Markov Numbers (<LatexRenderer>{"m"}</LatexRenderer>).
        </p>
        <p>
          In 1879, a Russian mathematician named Andrey Markov was playing around with a seemingly unrelated algebra problem. He was looking for integer solutions to this specific equation:
        </p>
      </section>

      <LatexRenderer latex={"\\[x^2 + y^2 + z^2 = 3xyz\\]"} />

      <section className="my-12 space-y-3">
        <p>Let&apos;s try to solve it.</p>
        <p>
          If <LatexRenderer>{"x=1,\\, y=1,\\, z=1"}</LatexRenderer>, we get{" "}
          <LatexRenderer>{"1^2 + 1^2 + 1^2 = 3(1)(1)(1)"}</LatexRenderer>, which simplifies to{" "}
          <LatexRenderer>{"3=3"}</LatexRenderer>. It works!
        </p>
        <p>
          If <LatexRenderer>{"x=1,\\, y=1,\\, z=2"}</LatexRenderer>, we get{" "}
          <LatexRenderer>{"1^2 + 1^2 + 2^2 = 3(1)(1)(2)"}</LatexRenderer>, which simplifies to{" "}
          <LatexRenderer>{"6=6"}</LatexRenderer>. It works!
        </p>
        <p>
          If <LatexRenderer>{"x=1,\\, y=2,\\, z=5"}</LatexRenderer>, we get{" "}
          <LatexRenderer>{"1^2 + 2^2 + 5^2 = 3(1)(2)(5)"}</LatexRenderer>, which simplifies to{" "}
          <LatexRenderer>{"30=30"}</LatexRenderer>. It works!
        </p>
        <p>
          Any individual number that makes this equation true,{" "}
          <LatexRenderer>{"1, 2, 5, 13, 29, 89"}</LatexRenderer>, and so on, is a Markov number.
        </p>
        <p>
          Markov proved that every discrete level of the Lagrange Spectrum is calculated using this formula based on those numbers:
        </p>
      </section>

      <LatexRenderer latex={"\\[\\text{Constant} = \\sqrt{9 - \\frac{4}{m^2}}\\]"} />

      <section className="my-12 space-y-3">
        <p>
          First Markov number (<LatexRenderer>{"m=1"}</LatexRenderer>):{" "}
          <LatexRenderer>{"\\sqrt{9 - \\frac{4}{1^2}} = \\sqrt{5}"}</LatexRenderer>{" "}
          (The Golden Ratio level)
        </p>
        <p>
          Second Markov number (<LatexRenderer>{"m=2"}</LatexRenderer>):{" "}
          <LatexRenderer>{"\\sqrt{9 - \\frac{4}{2^2}} = \\sqrt{8}"}</LatexRenderer>{" "}
          (The Silver Ratio level)
        </p>
        <p>
          Third Markov number (<LatexRenderer>{"m=5"}</LatexRenderer>):{" "}
          <LatexRenderer>{"\\sqrt{9 - \\frac{4}{5^2}} = \\sqrt{9 - 0.16} = \\sqrt{8.84} = \\frac{\\sqrt{221}}{5}"}</LatexRenderer>{" "}
          (The Bronze level)
        </p>
        <p>
          Look closely at that formula:{" "}
          <LatexRenderer>{"\\sqrt{9 - \\frac{4}{m^2}}"}</LatexRenderer>.
          As we find larger and larger solutions to the Markov equation (<LatexRenderer>{"m=13,\\, m=29,\\, m=89\\ldots"}</LatexRenderer>),{" "}
          <LatexRenderer>{"m"}</LatexRenderer> gets infinitely large. As <LatexRenderer>{"m"}</LatexRenderer> gets infinitely large, the fraction{" "}
          <LatexRenderer>{"\\frac{4}{m^2}"}</LatexRenderer> shrinks to exactly zero.
        </p>
        <p>
          We are left with <LatexRenderer>{"\\sqrt{9}"}</LatexRenderer>. Which is 3.
        </p>
        <p>
          Below 3, the spectrum is discrete. However, as you hit 3 the families of irrational numbers crowd together so densely they overlap. It turns into a mess of overlapping limits which eventually becomes this block where every decimal value is occupied (the structure of this overlap was studied by mathematician Gregory Freiman).
        </p>
      </section>

      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">KAM Theory</h2>
        <p>
          Let&apos;s look at two planets orbiting a star.
        </p>
        <p>
          On its own, a single gravitational pull is harmless. But what happens when these pulls start piling up?
        </p>
        <p>
          Let&apos;s imagine the inner planet takes exactly 1 year to orbit the star, and the outer planet takes exactly 2 years. Their ratio of orbital periods is 1:2. This is a rational number which is extremely dangerous in astrophysics. The inner faster planet will overtake the slow outer planet at the exact same spot every single time. The gravitational tug will happen over and over again at the same coordinate (I think you can see where I&apos;m getting at).
        </p>
        <p>
          This is called Orbital Resonance. If you keep adding energy to the same spot, eventually that energy builds up so much that the orbit destabilizes and the planet is violently flung out of the solar system.
        </p>
      </section>

      <OrbitalResonance />

      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">The Universal Solution to Chaos</h2>
        <p>
          If a solar system wants to survive for billions of years, it needs to avoid resonance.
        </p>
        <p>
          Just like the sunflower, the solar system needs an Irrational Number.
        </p>
        <p>
          In 1954, mathematician Andrey Kolmogorov (and later, Vladimir Arnold and Jürgen Moser) formulated what is now known as KAM Theory. They were trying to figure out if the solar system is stable, or if the planets will eventually go completely chaotic and crash.
        </p>
        <p>
          KAM theory proved that an orbital system can survive the chaotic tugging of its planets only if the ratio of their frequencies is &quot;sufficiently irrational.&quot; If the ratio gets too close to a simple fraction, the system descends into chaos.
        </p>
        <p>
          And according to KAM theory, the orbits which are the most robust are the ones governed by the numbers at the very bottom of the Lagrange Spectrum.
        </p>
        <p>
          You can actually see this everywhere you look in the sky. When gravity locks into simple fractions, it carves out empty voids. This is why there are these massive gaps in the Asteroid Belt (Kirkwood gaps). Any asteroid which is unlucky enough to have a 3:1 or 2:1 orbital ratio with Jupiter was violently flung out of its orbit millions of years ago. It&apos;s also why there&apos;s an empty stripe in Saturn&apos;s rings (cleared by a 2:1 resonance with its moon, Mimas).
        </p>
        <p>
          If you look at our own solar system, the ratio of Earth&apos;s orbital year to Venus&apos;s is roughly 8:13. These are Fibonacci numbers so their ratio sits incredibly close to the Golden Ratio.
        </p>
        <p>
          Whether it is a plant trying to pack seeds efficiently in space, or a solar system trying to pack planetary orbits safely in time, the solution is identical. When the universe wants to avoid a pattern, it reaches for <LatexRenderer>{"\\phi"}</LatexRenderer>.
        </p>
      </section>
    </>
  );
}
