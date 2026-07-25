import { Link } from "react-router";
import { motion } from "framer-motion";
import { CircleDot, Table2, TerminalSquare } from "lucide-react";
import { SectionHeading } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { useLanguage } from "@/providers/use-language";

/**
 * S5. Three content pillars — "Everything you need to learn"
 */
const PILLARS = [
  {
    id: "01",
    title: "Principles",
    color: SEMANTIC.plan,
    icon: CircleDot,
    desc: "From ReAct to Reflexion, from memory systems to the MCP protocol and multi-agent collaboration — the inner mechanics of agents explained in three parts: plain-language explanation, key takeaways and pseudocode.",
    stats: "6 chapters · 5 reasoning paradigms · 13 verifiable sources",
    cta: "Explore Principles",
    to: "/principles",
  },
  {
    id: "02",
    title: "Frameworks",
    color: SEMANTIC.tool,
    icon: Table2,
    desc: "LangChain/LangGraph, OpenAI Agents SDK, CrewAI, smolagents, Dify, Coze, Microsoft Agent Framework… Positioning, pros and cons, minimal code samples and scenario-based selection advice for 11 mainstream frameworks.",
    stats: "11 frameworks · real GitHub data · 4 selection scenarios",
    cta: "See the comparison",
    to: "/frameworks",
  },
  {
    id: "03",
    title: "Capstone Project",
    color: SEMANTIC.loop,
    icon: TerminalSquare,
    desc: "8 steps of fully runnable code: build the Personal Research Assistant Agent with the OpenAI Agents SDK — it plans, searches, reads and synthesizes automatically, producing a research report with citations.",
    stats: "8-step tutorial · 3+ tools · evaluation & deployment included",
    cta: "Start building",
    to: "/capstone",
  },
] as const;

export default function Pillars() {
  const { localize } = useLanguage();
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="05 · Modules"
          tagColor={SEMANTIC.tool}
          title="Everything You Need to Learn"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ scale: 1.02 }}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-1 p-7 transition-colors duration-300 hover:border-border-strong"
              >
                {/* Oversized gradient watermark */}
                <span
                  className="pointer-events-none absolute -bottom-8 -right-3 select-none font-display text-[120px] font-bold leading-none opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, transparent)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                  aria-hidden
                >
                  {p.id}
                </span>

                <p className="font-mono text-caption tracking-[0.2em] text-text-tertiary">
                  MODULE {p.id}/03
                </p>
                <span
                  className="mt-5 inline-flex w-fit rounded-xl border p-3"
                  style={{
                    color: p.color,
                    borderColor: semanticAlpha(p.color, 30),
                    backgroundColor: semanticAlpha(p.color, 8),
                  }}
                >
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 text-h3 font-bold text-text-primary">{p.title}</h3>
                <p className="mt-3 flex-1 text-body-sm text-text-secondary">{p.desc}</p>
                <p className="mt-4 font-mono text-caption text-text-tertiary">
                  {p.stats}
                </p>
                <Link
                  to={localize(p.to)}
                  className="mt-6 inline-flex w-fit items-center gap-1.5 text-[15px] font-medium transition-colors"
                  style={{ color: p.color }}
                >
                  {p.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
