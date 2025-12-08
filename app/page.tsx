import Image from "next/image";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="px-8 py-16 md:px-16 lg:px-24">
        <div className="max-w-3xl mx-auto">
        {/* Photo and Header */}
        <div className="mb-12 flex flex-col md:flex-row items-center gap-8">
          <Image
            src="/photo4.jpg"
            alt="Alvina Yang"
            width={200}
            height={200}
            className="rounded-full"
            priority
          />
          <h1 className="text-3xl md:text-4xl leading-tight">
            Hi, I&apos;m Alvina and I write code that mostly behaves.
          </h1>
        </div>

        {/* Content paragraphs */}
        <div className="space-y-6 text-base leading-relaxed">
          <p>
            I&apos;m a student at the University of Toronto studying <strong>Computer Science</strong> (specialist) and <strong>Mathematics</strong> (major).
          </p>

          <p>
            This summer, I&apos;ll be joining <strong>Rippling</strong> as a Software Engineer intern on the Employee Experience team. In the past, I have interned at <strong>Blackberry QNX</strong> on the IDE/Graphics team, <strong>Seismic</strong> on the AI/ML team, and <strong>Amazon</strong> on the Supply Chain Optimization Technologies team. I have also done research in HCI (human-computer interaction) at the <strong>IAI Lab</strong>, and in causal reasoning in LLMs at the <strong>Vector Institute</strong>.
          </p>

          <p>
            My interests tend to jump around a bit but they usually circle the same themes:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Abstract mathematics</li>
            <li>Distributed systems</li>
            <li>Natural language processing</li>
            <li>Applied AI</li>
          </ul>

          <p>
            Outside of code I also read a lot. Some of my favourite books are <em>Kafka on the Shore</em> (Haruki Murakami), <em>The Secret History</em> (Donna Tartt), <em>Piranesi</em> (Susanna Clarke), and <em>Almond</em> (Won-pyung Sohn).
          </p>

          <p>
            I also like building mildly unhinged projects for fun. Recently that has looked like a <a href="https://devpost.com/software/orbit-59jths" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity"> doxer</a> (Hack the North winning tool that uses facial recognition to surface publicly available information about someone), a <a href="https://devpost.com/software/i-cheated-lol" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">hackathon cheating assistant</a> that rewrites your commits and files for you, and <a href="https://devpost.com/software/irrizzistable-glasses" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">Rizz Glasses</a>, an AI pair of glasses that feeds you conversation prompts in real time. Please don&apos;t ban me, MLH.
          </p>

          <p>
            When I&apos;m not (hypothetically) breaking hackathon bylaws, I build more normal things too, like a <a href="https://dorahacks.io/buidl/21648" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">live pitch simulator</a> (UofTHacks 12 winner) and a <a href="https://devpost.com/software/remi-bo5sil" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-70 transition-opacity">reminiscence therapy tool</a> (UofTHacks 11 winner).
          </p>

          <p>
            I deleted my previous website after realizing I was disproportionately focused on layouts and animations rather than substance. I kept iterating on the interface instead of articulating anything meaningful. This version is a small course correction that prioritizes what I build and think about over how the page looks.
          </p>

          <p>
          If any of this piques your curiosity, feel free to reach out via LinkedIn or email; I am always open to conversation.
          </p>
        </div>
        </div>
      </div>
    </main>
  );
}
