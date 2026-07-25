import { Link } from "react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge, SectionHeading } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { useLanguage } from "@/providers/use-language";

/**
 * S4. Learning path overview — five stages · 10–15 weeks (data from learning-path brief §1)
 */
const STAGES = [
  {
    n: 1,
    name: "Fundamentals",
    color: SEMANTIC.perceive,
    topics: "LLM fundamentals, prompt engineering, API calls",
    weeks: "1–2 weeks",
    output: "A command-line chatbot",
  },
  {
    n: 2,
    name: "Principles",
    color: SEMANTIC.plan,
    topics: "Agent architecture, ReAct, planning & memory",
    weeks: "1–2 weeks",
    output: 'A hand-written 50-line "bare agent loop"',
  },
  {
    n: 3,
    name: "Frameworks",
    color: SEMANTIC.tool,
    topics: "Go deep on LangGraph or the OpenAI Agents SDK",
    weeks: "2–3 weeks",
    output: "Rewrite the bare agent with a framework + a real tool",
  },
  {
    n: 4,
    name: "Advanced Skills",
    color: SEMANTIC.memory,
    topics: "RAG, tool design, memory, evaluation & debugging",
    weeks: "3–4 weeks",
    output: "Q&A agent with RAG + memory, plus an evaluation report",
  },
  {
    n: 5,
    name: "Capstone",
    color: SEMANTIC.loop,
    topics: "Complete a full agent project independently",
    weeks: "3–4 weeks",
    output: "Personal Research Assistant Agent: full repo + demo + retrospective",
  },
] as const;

export default function PathOverview() {
  const { localize } = useLanguage();
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="04 · Roadmap"
          tagColor={SEMANTIC.plan}
          title={
            <>
              Five Stages · <span className="font-display text-grad">10–15</span> Weeks
            </>
          }
          lead="Every stage ends with a dual deliverable: runnable code + one study note"
        />

        {/* Horizontal timeline */}
        <div className="relative">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[6px] hidden h-0.5 origin-left bg-border-strong lg:block"
            aria-hidden
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.1 }}
                className="relative lg:pt-7"
              >
                {/* Timeline node */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 + i * 0.15 }}
                  className="absolute -top-[0px] left-0 hidden h-3 w-3 rounded-full lg:block"
                  style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
                  aria-hidden
                />
                <Link
                  to={localize(`/path#stage-${s.n}`)}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-1 p-5 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100"
                    style={{ background: s.color }}
                  />
                  <span
                    className="pointer-events-none absolute -right-2 -top-4 font-display text-5xl font-bold"
                    style={{ color: semanticAlpha(s.color, 20) }}
                    aria-hidden
                  >
                    {s.n}
                  </span>
                  <p className="font-mono text-caption tracking-widest text-text-tertiary">
                    STAGE {s.n}
                  </p>
                  <h3 className="mt-1.5 text-h3 font-bold" style={{ color: s.color }}>
                    {s.name}
                  </h3>
                  <p className="mt-2.5 text-body-sm text-text-secondary">{s.topics}</p>
                  <div className="mt-3">
                    <Badge color={s.color}>{s.weeks}</Badge>
                  </div>
                  <p className="mt-3.5 flex items-start gap-1.5 text-caption text-text-tertiary">
                    <Check size={13} className="mt-0.5 shrink-0 text-c-tool" />
                    Output: {s.output}
                  </p>
                  <p className="mt-3 text-[13px] text-text-secondary transition-colors group-hover:text-c-perceive">
                    View details
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      {" "}
                      →
                    </span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
