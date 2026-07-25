import { motion } from "framer-motion";
import { MessageSquare, Workflow, RefreshCcw } from "lucide-react";
import { SectionHeading } from "@/components/ui-extra";
import { cn } from "@/lib/utils";
import { SEMANTIC } from "@/lib/semantic";

/**
 * S3. Agent vs. chatbot — a three-way comparison (data from principles brief §1)
 */
const CARDS = [
  {
    name: "Chatbot",
    icon: MessageSquare,
    highlight: false,
    rows: [
      ["Mode", "One question, one answer"],
      ["Decides", "Nobody (text only)"],
      ["Feedback", "Not perceived"],
      ["Best for", "Q&A, chit-chat"],
    ],
  },
  {
    name: "Workflow",
    icon: Workflow,
    highlight: false,
    rows: [
      ["Mode", "Fixed pipeline, runs automatically"],
      ["Decides", "Steps pre-orchestrated by humans"],
      ["Feedback", "Handled as preset"],
      ["Best for", "Deterministic, high-frequency tasks"],
    ],
  },
  {
    name: "Agent",
    icon: RefreshCcw,
    highlight: true,
    rows: [
      ["Mode", "Multi-step autonomous loop"],
      ["Decides", "The model, step by step"],
      ["Feedback", "Observes and adjusts every step"],
      ["Best for", "Clear goal, uncertain path"],
    ],
  },
] as const;

export default function Compare() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="03 · Comparison"
          tagColor={SEMANTIC.memory}
          title="It's More Than a Chatbot"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.12 + (c.highlight ? 0.15 : 0),
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={cn(
                  "group relative rounded-2xl border bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1.5",
                  c.highlight
                    ? "border-c-perceive/70 hover:border-c-perceive"
                    : "border-border-subtle hover:border-border-strong",
                )}
                style={
                  c.highlight
                    ? { boxShadow: "0 0 40px color-mix(in srgb, var(--c-perceive) 8%, transparent)" }
                    : undefined
                }
              >
                {c.highlight && (
                  <>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-grad-main px-3 py-0.5 font-mono text-[11px] font-medium tracking-wider text-white">
                      THIS IS WHAT YOU'LL BUILD
                    </span>
                    <span
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          "radial-gradient(70% 50% at 50% 0%, color-mix(in srgb, var(--c-perceive) 7%, transparent), transparent 70%)",
                      }}
                    />
                  </>
                )}
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-lg border p-2",
                      c.highlight
                        ? "border-c-perceive/40 bg-c-perceive/10 text-c-perceive"
                        : "border-border-subtle bg-bg-2 text-text-secondary",
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-h4 font-bold text-text-primary">
                      {c.name}
                    </h3>
                  </div>
                </div>
                <dl className="mt-5 space-y-3">
                  {c.rows.map(([k, v]) => (
                    <div key={k} className="flex gap-3">
                      <dt className="w-[68px] shrink-0 text-caption text-text-tertiary">
                        {k}
                      </dt>
                      <dd
                        className={cn(
                          "text-[15px]",
                          c.highlight ? "text-text-primary" : "text-text-secondary",
                        )}
                      >
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            );
          })}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center font-mono text-caption text-text-tertiary"
        >
          The litmus test: who decides the next step? Code decides = workflow. The
          model decides = Agent.
        </motion.p>
      </div>
    </section>
  );
}
