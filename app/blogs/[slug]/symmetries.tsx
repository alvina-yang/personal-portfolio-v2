"use client";

import React from "react";

import LatexRenderer from "@/components/blog/LatexRenderer";
import WallpaperPlayground from "@/components/blog/WallpaperPlayground";
import KissingNumber from "@/components/blog/KissingNumber";

const highlightCls =
  "font-semibold";

const definitionBoxCls =
  "my-6 border-l-2 border-[#c0bdb5] dark:border-[#3a3a3a] pl-6 py-4 bg-[#f4f2ec]/70 dark:bg-[#181818]/80 rounded-r-md";

const RotatingSnowflake: React.FC = () => {
  const arms = [0, 60, 120, 180, 240, 300];

  return (
    <div className="my-8 flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Rotating snowflake demonstrating 6-fold rotational symmetry"
        className="h-auto w-[min(60vw,240px)] drop-shadow-md animate-spin"
        style={{ animationDuration: "12s" }}
      >
        {arms.map((a) => (
          <g key={a} transform={`rotate(${a} 50 50)`} stroke="currentColor" className="text-[#3a3a3a] dark:text-[#c0bdb5]">
            {/* main arm */}
            <line x1="50" y1="50" x2="50" y2="10" strokeWidth="2" />

            {/* outer branches (near tip) */}
            <line x1="50" y1="14" x2="44" y2="18" strokeWidth="1.5" />
            <line x1="50" y1="14" x2="56" y2="18" strokeWidth="1.5" />

            {/* middle-outer branches */}
            <line x1="50" y1="22" x2="42" y2="28" strokeWidth="1.6" />
            <line x1="50" y1="22" x2="58" y2="28" strokeWidth="1.6" />

            {/* sub-branches from middle-outer */}
            <line x1="42" y1="28" x2="38" y2="31" strokeWidth="1" />
            <line x1="42" y1="28" x2="41" y2="33" strokeWidth="1" />
            <line x1="58" y1="28" x2="62" y2="31" strokeWidth="1" />
            <line x1="58" y1="28" x2="59" y2="33" strokeWidth="1" />

            {/* middle branches */}
            <line x1="50" y1="32" x2="44" y2="37" strokeWidth="1.4" />
            <line x1="50" y1="32" x2="56" y2="37" strokeWidth="1.4" />

            {/* decorative tips on middle branches */}
            <line x1="44" y1="37" x2="42" y2="40" strokeWidth="0.9" />
            <line x1="44" y1="37" x2="45" y2="41" strokeWidth="0.9" />
            <line x1="56" y1="37" x2="58" y2="40" strokeWidth="0.9" />
            <line x1="56" y1="37" x2="55" y2="41" strokeWidth="0.9" />

            {/* inner branches */}
            <line x1="50" y1="42" x2="46" y2="46" strokeWidth="1.2" />
            <line x1="50" y1="42" x2="54" y2="46" strokeWidth="1.2" />

            {/* decorative near-center bits */}
            <line x1="46" y1="46" x2="45" y2="49" strokeWidth="0.8" />
            <line x1="54" y1="46" x2="55" y2="49" strokeWidth="0.8" />
          </g>
        ))}

        {/* center */}
        <circle cx="50" cy="50" r="2.5" fill="currentColor" />
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.8"
          opacity="0.7"
        />

        {/* center hexagon points */}
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <line
            key={`center-${angle}`}
            x1="50"
            y1="50"
            x2={50 + 5 * Math.cos((angle * Math.PI) / 180)}
            y2={50 + 5 * Math.sin((angle * Math.PI) / 180)}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.8"
            className="text-[#3a3a3a] dark:text-[#c0bdb5]"
          />
        ))}
      </svg>
    </div>
  );
};

export default function CrazySymmetries() {
  return (
    <>
      {/* Section: intro */}
      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">
          Symmetries are quite literally everywhere
        </h2>
        <p>
          Flip a playing card, stand in front of a mirror, rotate a square.
          Nothing essential changes. Our eyes are tuned to this invariance; from
          mosque tilings and Baroque facades to corporate emblems (think
          Mercedes).
        </p>
        <p>
          So, why is symmetry so satisfying? Its structure is preserved under
          change. You can rotate, reflect, translate it and the object will
          remain indistinguishable from before. The feeling of &quot;same-ness
          despite motion&quot; is exactly the fundamental seed of group theory.
        </p>
        <p>
          Now, instead of staring at the objects, focus on the moves that don’t
          ruin its structure.
        </p>

        <RotatingSnowflake />

        <p>
          For a regular snowflake, these moves are six rotations{" "}
          <LatexRenderer>
            {
              "(0^\\circ, 60^\\circ, 120^\\circ, 180^\\circ, 240^\\circ, 300^\\circ)"
            }
          </LatexRenderer>{" "}
          and six reflections across its axes. If you compose any two legal
          moves together you get another legal move. If you undo a move, you
          land on a legal move again. There is an internal logic to all of these
          transformations which is the idea of a group. Think of it as a way to
          capture the essence of transformation.
        </p>

        <p>Now bear with me as I define this.</p>
      </section>

      {/* Section: what is a group */}
      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">What is a group?</h2>
        <p>
          Informally you can think of a group as a collection of actions. These
          actions must compose cleanly, there must be a way to do nothing, and
          every action must be undoable. That&apos;s it. Surprisingly little
          structure.
        </p>

        <h3 className="text-xl md:text-2xl font-semibold">
          Formal definition if you are curious
        </h3>

        <div className={definitionBoxCls}>
          <p>
            A group is a pair <LatexRenderer>(G, *)</LatexRenderer> where{" "}
            <LatexRenderer>G</LatexRenderer> is a set and{" "}
            <LatexRenderer>*</LatexRenderer> is a binary operation on{" "}
            <LatexRenderer>G</LatexRenderer> (you can think &quot;do one move
            then another&quot;), satisfying four axioms:
          </p>

          <div className="mt-3 space-y-2">
            <div className="pl-1">
              <span className={highlightCls}>1. Closure:</span> For any{" "}
              <LatexRenderer>{"a, b \\in G"}</LatexRenderer>, the product{" "}
              <LatexRenderer>a * b</LatexRenderer> is also in{" "}
              <LatexRenderer>G</LatexRenderer>.
            </div>

            <div className="pl-1">
              <span className={highlightCls}>2. Associativity:</span> For any{" "}
              <LatexRenderer>{"a, b, c \\in G"}</LatexRenderer>,{" "}
              <LatexRenderer>(a * b) * c = a * (b * c)</LatexRenderer>.
            </div>

            <div className="pl-1">
              <span className={highlightCls}>3. Identity element:</span> There
              is an element <LatexRenderer>{"e \\in G"}</LatexRenderer> such that
              for any <LatexRenderer>{"a \\in G"}</LatexRenderer>,{" "}
              <LatexRenderer>e * a = a * e = a</LatexRenderer>. (Do-nothing
              move.)
            </div>

            <div className="pl-1">
              <span className={highlightCls}>4. Inverse:</span> For every{" "}
              <LatexRenderer>{"a \\in G"}</LatexRenderer>, there exists an
              element <LatexRenderer>{"a^{-1} \\in G"}</LatexRenderer> with{" "}
              <LatexRenderer>
                {"a * a^{-1} = a^{-1} * a = e"}
              </LatexRenderer>
              . (Undo move.)
            </div>
          </div>

          <p className="mt-4">
            Interestingly, the operation <LatexRenderer>*</LatexRenderer> does
            not have to be commutative—that is,{" "}
            <LatexRenderer>a * b</LatexRenderer> can differ from{" "}
            <LatexRenderer>b * a</LatexRenderer>. When a group is commutative,
            it is called an <span className={highlightCls}>Abelian group</span>,{" "}
            named after the Norwegian mathematician Niels Henrik Abel.
          </p>
        </div>

        <h3 className="text-xl md:text-2xl font-semibold">
          Concrete examples (to anchor the abstraction)
        </h3>

        <p>
          <span className={highlightCls}>
            Integers under addition{" "}
            <LatexRenderer>{"(\\mathbb{Z}, +)"}</LatexRenderer>:
          </span>
        </p>
        <ul>
          <li>
            Operation: <LatexRenderer>a + b</LatexRenderer>
          </li>
          <li>Identity: 0 (adding 0 changes nothing)</li>
          <li>
            Inverse: for <LatexRenderer>a</LatexRenderer>, the inverse is{" "}
            <LatexRenderer>-a</LatexRenderer> (adding{" "}
            <LatexRenderer>-a</LatexRenderer> undoes{" "}
            <LatexRenderer>+a</LatexRenderer>)
          </li>
          <li>Closure and associativity hold as usual.</li>
        </ul>

        <p>
          <span className={highlightCls}>
            Full symmetries of the snowflake (rotations + reflections):
          </span>
        </p>
        <ul>
          <li>Elements: 6 rotations + 6 reflections = 12 total.</li>
          <li>
            Operation: do one symmetry, then another (compose transformations).
          </li>
          <li>
            This is the dihedral group of order 12, commonly denoted{" "}
            <LatexRenderer>D_6</LatexRenderer>—the symmetry group of the
            hexagon.
          </li>
        </ul>

        <h3 className="text-xl md:text-2xl font-semibold">
          Non-examples (what fails the contract)
        </h3>

        <p>
          <span className={highlightCls}>
            Natural numbers under subtraction{" "}
            <LatexRenderer>{"(\\mathbb{N}, -)"}</LatexRenderer>:
          </span>{" "}
          Not a group. <LatexRenderer>2 - 5</LatexRenderer> is not in{" "}
          <LatexRenderer>{"\\mathbb{N}"}</LatexRenderer>, so closure fails;
          inverses fail too.
        </p>

        <p>
          <span className={highlightCls}>
            Square matrices under multiplication without inverses:
          </span>{" "}
          The set of all <LatexRenderer>{"n \\times n"}</LatexRenderer> real
          matrices under multiplication is not a group, because some matrices
          cannot be inverted. Restrict to the invertible ones (
          <LatexRenderer>GL_n</LatexRenderer>) and you have a group again.
        </p>

        <p>
          <span className={highlightCls}>
            Integers under division{" "}
            <LatexRenderer>{"(\\mathbb{Z}, /)"}</LatexRenderer>:
          </span>{" "}
          Not a group. Closure fails immediately since, e.g.,{" "}
          <LatexRenderer>{"\\frac{1}{2}"}</LatexRenderer> is not an integer;
          inverses also fail; and division isn&apos;t associative.
        </p>

        <p>
          When we say the symmetries of an object form a group, we mean: take
          all of the structure-preserving transformations, compose them, include
          the identity, and include inverses. That is a group under composition.
        </p>
      </section>

      {/* Section: wallpaper groups */}
      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">
          Wallpaper Groups
        </h2>
        <p>
          Now that we have a base understanding of what a group is, let&apos;s
          look beyond isolated objects and see what happens when patterns extend
          infinitely across a surface.
        </p>
        <p>
          Introducing: the{" "}
          <span className={highlightCls}>Wallpaper Groups</span>.
        </p>
        <p>
          This is the mathematical classification of every possible way to tile
          the plane with a repeating motif while preserving its symmetry.
        </p>
        <p>
          At first glance, it seems as if there should be infinitely many such
          patterns. After all, artists have been designing these ornate tilings
          for millennia. Yet, astonishingly, mathematicians have proven that
          there are exactly 17 distinct wallpaper groups.
        </p>
        <p>
          Rotations in the plane can only occur at certain angles that fit
          neatly together, specifically{" "}
          <LatexRenderer>{"180^\\circ"}</LatexRenderer>,{" "}
          <LatexRenderer>{"120^\\circ"}</LatexRenderer>,{" "}
          <LatexRenderer>{"90^\\circ"}</LatexRenderer>, or{" "}
          <LatexRenderer>{"60^\\circ"}</LatexRenderer>. Other rotation angles,
          like <LatexRenderer>{"72^\\circ"}</LatexRenderer>, cannot fill a plane
          without leaving gaps.
        </p>
        <p>
          When these allowable rotations are combined with reflections and
          translations, there are only 17 possible consistent arrangements. Each
          wallpaper group represents a distinct group of transformations.
        </p>
        <p>
          In other words, the world&apos;s patterns—from Persian tiles to
          modern floor designs—all obey this elegant algebraic universe.
        </p>

        <h3 className="text-xl md:text-2xl font-semibold">
          Play around with the wallpaper groups!
        </h3>
        <WallpaperPlayground />
      </section>

      {/* Section: rotations / dimensions */}
      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">
          Rotations, Dimensions, and the Geometry of Space
        </h2>
        <p>
          We have classified flat, repeating patterns by their symmetries. Now,
          let&apos;s expand past this and look at multiple dimensions.
        </p>
        <p>
          In two dimensions, the key symmetries are translations, rotations,
          reflections, and glide reflections. In three dimensions we focus on
          rotations. These rotations form a continuous symmetry group: do one
          turn after another, do nothing (turn{" "}
          <LatexRenderer>{"0^\\circ"}</LatexRenderer>), and every turn can be
          undone by turning back by the same angle. We call this structure{" "}
          <span className={highlightCls}>
            <LatexRenderer>{"\\mathrm{SO}(3)"}</LatexRenderer>
          </span>
          .
        </p>
        <p>
          You actually interact with{" "}
          <LatexRenderer>{"\\mathrm{SO}(3)"}</LatexRenderer> constantly even if
          you never call it by name: dice, polyhedral dice, spinning objects.
        </p>
        <p>
          In 4D, a point needs four coordinates{" "}
          <LatexRenderer>{"(x, y, z, w)"}</LatexRenderer>. Rotations still mean
          &quot;turn without stretching,&quot; but now you can rotate e.g. the{" "}
          <LatexRenderer>{"(x, y)"}</LatexRenderer> plane and{" "}
          <LatexRenderer>{"(z, w)"}</LatexRenderer> plane independently.
        </p>
      </section>

      {/* Section: lattices + kissing number */}
      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">
          Lattices, Translations, and the Kissing Number
        </h2>
        <p>
          The translation symmetries of a wallpaper form a grid, a{" "}
          <span className={highlightCls}>lattice</span>: all integer
          combinations of a few basic translation vectors. In 2D the translation
          lattice looks like <LatexRenderer>{"\\mathbb{Z}^2"}</LatexRenderer>;
          in 3D, <LatexRenderer>{"\\mathbb{Z}^3"}</LatexRenderer>; in general,{" "}
          <LatexRenderer>{"\\mathbb{Z}^n"}</LatexRenderer> in n dimensions.
        </p>
        <p>
          Now for the classic geometric puzzle, the{" "}
          <span className={highlightCls}>kissing number problem</span>: how many
          unit spheres can touch one in the center without overlap?
        </p>

        <KissingNumber />

        <p>
          In 2D, the answer is 6; in 3D, it&apos;s 12. In 4D there is more room
          and the maximum is 24. In 8D, a lattice called{" "}
          <span className={highlightCls}>
            <LatexRenderer>{"E_8"}</LatexRenderer>
          </span>{" "}
          achieves a kissing number of 240. In 24D, the{" "}
          <span className={highlightCls}>Leech lattice</span> reaches a wild
          196,560.
        </p>
        <p>
          The exact kissing numbers are known only in a handful of dimensions:
          1, 2, 3, 4, 8, and 24. Elsewhere we mostly just know bounds.
        </p>
      </section>

      {/* Conway & Monster sections shortened slightly for length but structurally same */}
      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">
          Conway Groups and Mathematical Discovery
        </h2>
        <p>
          Take the Leech lattice and ask: what are all the moves that leave this
          pattern perfectly unchanged? John Conway catalogued these symmetries
          and found three new sporadic simple groups{" "}
          <LatexRenderer>{"\\mathrm{Co}_1, \\mathrm{Co}_2, \\mathrm{Co}_3"}</LatexRenderer>
          , now called the <span className={highlightCls}>Conway groups</span>.
        </p>
        <p>
          They arise by looking at all distance-preserving moves, modding out a
          sign flip, and then &quot;pinning&quot; certain lattice directions and
          keeping only symmetries that fix them.
        </p>
      </section>

      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">The Monster</h2>
        <p>
          Most finite simple groups fall into infinite families.{" "}
          <span className={highlightCls}>
            Sporadic groups
          </span>{" "}
          are the weird outliers; there are 26 of them. The largest is the{" "}
          <span className={highlightCls}>Monster group</span>.
        </p>
        <h3 className="text-xl md:text-2xl font-semibold">
          How big is the Monster?
        </h3>
        <p className="mb-2 leading-relaxed">
          Its order (number of elements) is:
        </p>
        <p className="break-words">
          <span className={highlightCls}>
            808,017,424,794,512,875,886,459,904,961,710,757,005,754,368,000,000,000
          </span>
        </p>
        <p>
          That&apos;s about{" "}
          <LatexRenderer>{"8 \\times 10^{53}"}</LatexRenderer>.
        </p>
        <p>
          Its prime factorization is{" "}
          <LatexRenderer>
            {
              "2^{46} \\cdot 3^{20} \\cdot 5^{9} \\cdot 7^{6} \\cdot 11^{2} \\cdot 13^{3} \\cdot 17 \\cdot 19 \\cdot 23 \\cdot 29 \\cdot 31 \\cdot 41 \\cdot 47 \\cdot 59 \\cdot 71"
            }
          </LatexRenderer>
          .
        </p>
        <p>
          The Monster&apos;s smallest non-trivial representation lives in
          196,883 dimensions, built via structures tied to the Leech lattice.
        </p>
        <ul>
          <li>20 of the 26 sporadics live inside the Monster (&quot;happy family&quot;).</li>
          <li>6 sit outside (&quot;pariahs&quot;).</li>
          <li>The Conway groups are part of the happy family.</li>
        </ul>
      </section>

      {/* Conclusion */}
      <section className="my-12 space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold">Conclusion</h2>
        <p>
          The key takeaway is to think transformations, not objects. Symmetry
          gives a single rigorous story for patterns that otherwise look
          unrelated.
        </p>
      </section>
    </>
  );
}
