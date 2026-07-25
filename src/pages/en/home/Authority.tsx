import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BookOpen, GraduationCap, FileText, Library, Newspaper, Star } from "lucide-react";
import { ExternalLinkCard, Reveal, SectionHeading } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";

/**
 * S6. Data & authority — "Standing on the shoulders of open knowledge"
 */

function CountUp({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 1000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);
  return (
    <span ref={ref} className="font-display text-4xl font-bold text-text-primary">
      {v}
      {suffix}
    </span>
  );
}

const SOURCES = [
  {
    href: "https://arxiv.org/abs/2210.03629",
    title: "ReAct (arXiv:2210.03629)",
    desc: "The core paper of the agent paradigm",
    icon: <FileText size={17} />,
  },
  {
    href: "https://arxiv.org/abs/2303.11366",
    title: "Reflexion (arXiv:2303.11366)",
    desc: "Verbal self-reflection",
    icon: <FileText size={17} />,
  },
  {
    href: "https://huggingface.co/learn/agents-course",
    title: "Hugging Face Agents Course",
    desc: "Free official course",
    icon: <GraduationCap size={17} />,
  },
  {
    href: "https://www.deeplearning.ai/short-courses/",
    title: "DeepLearning.AI",
    desc: "10+ short courses on agents",
    icon: <BookOpen size={17} />,
  },
  {
    href: "https://www.anthropic.com/engineering/building-effective-agents",
    title: "Anthropic Engineering",
    desc: "Building Effective Agents",
    icon: <Newspaper size={17} />,
  },
  {
    href: "https://github.com/e2b-dev/awesome-ai-agents",
    title: "awesome-ai-agents",
    desc: "The best-known directory of agent projects",
    icon: <Star size={17} />,
  },
];

const NUMBERS = [
  { target: 13, suffix: "+", label: "Paper & official-doc citations" },
  { target: 8, suffix: "", label: "Awesome-grade open-source repos" },
  { target: 10, suffix: "", label: "Free official courses" },
];

export default function Authority() {
  return (
    <section className="relative bg-bg-1 py-24 max-md:py-16">
      {/* Top & bottom five-color gradient hairlines */}
      <div className="absolute inset-x-0 top-0 h-px bg-grad-semantics opacity-60" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-px bg-grad-semantics opacity-60" aria-hidden />
      <div className="mx-auto grid max-w-content items-center gap-14 px-6 max-md:px-5 lg:grid-cols-2">
        {/* Left */}
        <div>
          <SectionHeading
            tag="06 · Sources"
            tagColor={SEMANTIC.perceive}
            title={
              <>
                Built Entirely on{" "}
                <span className="text-c-perceive">Verifiable Public Sources</span>
              </>
            }
            lead="The curriculum is compiled from public GitHub open-source projects, classic arXiv papers, official documentation and free courses. Every concept cites its source; every line of code comes from real framework APIs."
            className="mb-8"
          />
          <Reveal delay={0.1}>
            <div className="grid grid-cols-3 gap-6">
              {NUMBERS.map((n) => (
                <div key={n.label}>
                  <CountUp target={n.target} suffix={n.suffix} />
                  <p className="mt-1.5 text-caption text-text-tertiary">{n.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 flex items-center gap-2 text-caption text-text-tertiary">
            <Library size={14} />
            <span className="font-mono">Standing on the shoulders of open knowledge — every link is traceable</span>
          </Reveal>
        </div>

        {/* Right badge cards 2×3 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {SOURCES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <ExternalLinkCard
                href={s.href}
                title={s.title}
                desc={s.desc}
                icon={s.icon}
                className="bg-bg-2/60"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
