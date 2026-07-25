import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
  Github,
  Rocket,
  RotateCcw,
  Star,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Badge, OpinionQuote, Reveal } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { cn } from "@/lib/utils";
// Code samples stay byte-identical to the zh edition (Chinese comments kept on
// purpose: the companion GitHub project is annotated in Chinese). Only the
// surrounding narrative copy is translated.
import {
  CODE_STEP1_CONFIG,
  CODE_STEP1_ENV,
  CODE_STEP1_TERMINAL,
  CODE_STEP2_TOOLS,
  CODE_STEP3_AGENT,
  CODE_STEP4_MAIN,
  CODE_STEP5_WRITER,
  CODE_STEP6_EVAL,
  CODE_STEP7_LOGGING,
  CODE_STEP8_HOSTED,
  DEMO_LINES,
} from "@/pages/capstone/code";

const LOOP = SEMANTIC.loop; // section accent: loop pink
const TOOL = SEMANTIC.tool;

/* --------------------------------- shared --------------------------------- */

function Breadcrumb() {
  return (
    <nav className="mb-8 flex items-center gap-1.5 font-mono text-caption text-text-tertiary">
      <Link to="/en" className="transition-colors hover:text-c-perceive">
        HOME
      </Link>
      <ChevronRight size={13} />
      <span className="text-text-secondary">Capstone Project</span>
    </nav>
  );
}

/** English replay button (mirrors the shared ReplayButton styling) */
function ReplayButtonEn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-panel-text-3 transition-colors hover:bg-panel-2 hover:text-panel-accent"
    >
      <RotateCcw size={12} /> Replay
    </button>
  );
}

/** Terminal demo card: prints line by line (450ms/line) after a 600ms delay, with replay */
function TerminalDemo() {
  const [count, setCount] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setCount(0);
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= DEMO_LINES.length) {
            if (interval) clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, 450);
    }, 600);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [runId]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-caption text-text-tertiary">
          Final result · one real run
        </span>
        <ReplayButtonEn onClick={() => setRunId((n) => n + 1)} />
      </div>
      <CodeBlock
        type="terminal"
        code={DEMO_LINES.slice(0, count).join("\n") || " "}
        className="min-h-[calc(6*1.7*14.5px+90px)]"
      />
    </div>
  );
}

/** Acceptance card: green-outlined panel + ✓ checklist */
function ChecklistCard({ items }: { items: ReactNode[] }) {
  return (
    <Reveal className="relative mt-8 overflow-hidden rounded-xl border border-c-tool/30 bg-c-tool/5 p-5">
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] origin-top bg-c-tool"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
      />
      <Badge color={TOOL} className="mb-3">
        Acceptance
      </Badge>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-2.5 text-body-sm text-text-secondary"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
          >
            <Check size={15} className="mt-1 shrink-0 text-c-tool" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </Reveal>
  );
}

/** Step header: STEP N in pink + h2 + one-line lead */
function StepHeader({
  no,
  title,
  lead,
}: {
  no: number;
  title: string;
  lead: ReactNode;
}) {
  return (
    <div className="mb-6">
      <motion.span
        className="mb-2 block font-mono text-body-sm font-semibold tracking-[0.12em] text-c-loop"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4 }}
      >
        STEP {no}
      </motion.span>
      <h2 className="text-h2 font-bold text-text-primary">{title}</h2>
      <p className="mt-3 text-body-lg text-text-secondary">{lead}</p>
    </div>
  );
}

function StepSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-step className="scroll-mt-24">
      {children}
      {/* between steps: thin pink gradient divider */}
      <motion.div
        aria-hidden
        className="mt-16 h-px origin-left bg-gradient-to-r from-c-loop/60 via-c-loop/20 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7 }}
      />
    </section>
  );
}

/** Body paragraph */
function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 max-w-[68ch] text-body text-text-secondary">{children}</p>;
}

/** Highlighted mini card (e.g. three tool-design principles) */
function InfoCard({
  title,
  color = SEMANTIC.plan,
  children,
}: {
  title: string;
  color?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="my-6 rounded-xl border bg-bg-1 p-5"
      style={{ borderColor: semanticAlpha(color, 30) }}
    >
      <span
        className="mb-3 block font-mono text-caption font-semibold uppercase tracking-[0.12em]"
        style={{ color }}
      >
        {title}
      </span>
      <div className="space-y-2 text-body-sm text-text-secondary">{children}</div>
    </div>
  );
}

/* -------------------------------- step nav -------------------------------- */

const STEPS = [
  { id: "step-1", no: 1, title: "Environment Setup" },
  { id: "step-2", no: 2, title: "Define Tools" },
  { id: "step-3", no: 3, title: "Design the Agent Loop" },
  { id: "step-4", no: 4, title: "Add Memory" },
  { id: "step-5", no: 5, title: "Structured Reports" },
  { id: "step-6", no: 6, title: "Evaluate & Improve" },
  { id: "step-7", no: 7, title: "Harden & Polish" },
  { id: "step-8", no: 8, title: "Deploy & Share (Optional)" },
];

function useStepSpy() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const sections = STEPS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIdx(idx);
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return activeIdx;
}

/** Left sticky step TOC (visible ≥xl) */
function StepToc({ activeIdx }: { activeIdx: number }) {
  return (
    <aside className="sticky top-24 hidden w-[240px] shrink-0 self-start xl:block">
      <p className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
        Tutorial Steps
      </p>
      <ol className="space-y-1">
        {STEPS.map((step, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <li key={step.id}>
              <a
                href={`#${step.id}`}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-2 py-2 text-body-sm transition-colors",
                  active
                    ? "bg-bg-2 text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                <motion.span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    done
                      ? "border-c-loop bg-c-loop text-bg-0"
                      : active
                        ? "border-c-loop"
                        : "border-border-strong",
                  )}
                  animate={done ? { scale: [0.6, 1] } : { scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
                >
                  {done ? (
                    <Check size={11} strokeWidth={3} />
                  ) : (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        active ? "bg-c-loop" : "bg-border-strong",
                      )}
                    />
                  )}
                </motion.span>
                <span>
                  <span className="mr-1.5 font-mono text-caption">{step.no}</span>
                  {step.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <Link
        to="/en/path"
        className="group mt-6 block rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors hover:border-border-strong"
      >
        <span className="block text-caption text-text-tertiary">Prerequisites</span>
        <span className="mt-1 flex items-center gap-1 text-body-sm text-text-primary">
          Complete Learning Path Stages 1–3
          <ArrowRight
            size={14}
            className="text-c-loop transition-transform group-hover:translate-x-1"
          />
        </span>
      </Link>
    </aside>
  );
}

/** Mobile step nav (horizontal scroll bar) */
function MobileStepNav({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="sticky top-16 z-30 -mx-5 mb-10 overflow-x-auto border-b border-border-subtle bg-bg-0/85 px-5 py-3 backdrop-blur-md xl:hidden">
      <div className="flex gap-2">
        {STEPS.map((step, i) => (
          <a
            key={step.id}
            href={`#${step.id}`}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-caption transition-colors",
              i === activeIdx
                ? "border-c-loop/50 bg-c-loop/10 text-c-loop"
                : "border-border-subtle text-text-tertiary",
            )}
          >
            {step.no} {step.title}
          </a>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- page body -------------------------------- */

const TECH_CHIPS = [
  "OpenAI Agents SDK",
  "Tavily API",
  "httpx + trafilatura",
  "SQLiteSession",
  "Tracing",
];

export default function CapstoneEn() {
  const activeIdx = useStepSpy();

  return (
    <div className="relative">
      {/* background: engineering grid + pink glow */}
      <div aria-hidden className="bg-grid-texture pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[480px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-loop) 8%, transparent), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-content px-5 md:px-6">
        <div className="xl:flex xl:gap-14">
          <StepToc activeIdx={activeIdx} />

          <div className="min-w-0 max-w-prose2 flex-1 pb-24">
            <MobileStepNav activeIdx={activeIdx} />

            {/* ---------------- S1 header + project demo ---------------- */}
            <header className="pb-20 pt-16 md:pt-24">
              <Breadcrumb />
              <Reveal className="mb-5 flex flex-wrap items-center gap-2">
                <Badge color={LOOP}>Capstone</Badge>
                <Badge color={SEMANTIC.perceive}>8 Steps</Badge>
                <Badge color={SEMANTIC.tool}>Python 3.11+</Badge>
                <Badge color={SEMANTIC.memory}>openai-agents</Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="text-h1 font-black text-text-primary">
                  Build a <span className="text-grad">Personal Research Assistant</span> Agent
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[68ch] text-body-lg text-text-secondary">
                  Give it a research topic and it plans sub-questions on its own, searches the web,
                  fetches and reads pages, cross-checks sources, and finally produces a structured
                  Markdown research report with citations, saved to disk. Finish these 8 steps and
                  you'll own a complete agent project worthy of your résumé.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-6 flex flex-wrap gap-2">
                {TECH_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-border-subtle bg-bg-1 px-2.5 py-1 font-mono text-caption text-text-secondary"
                  >
                    {chip}
                  </span>
                ))}
              </Reveal>
              <Reveal delay={0.2} className="mt-10">
                <TerminalDemo />
              </Reveal>
            </header>

            {/* ---------------- STEP 1 Environment Setup ---------------- */}
            <StepSection id="step-1">
              <StepHeader
                no={1}
                title="Environment Setup"
                lead="Create a virtual environment, install dependencies, and manage keys with environment variables."
              />
              <P>
                Pick either of two search options: Option A uses OpenAI's hosted{" "}
                <code>WebSearchTool</code> (no extra key required — the simplest); Option B uses
                Tavily (controllable search quality with a generous free tier). The main tutorial
                uses Option B — writing the tools yourself teaches you more — and Step 8 shows the
                one-line swap to Option A.
              </P>
              <div className="space-y-6">
                <CodeBlock type="terminal" code={CODE_STEP1_TERMINAL} />
                <CodeBlock language="bash" filename=".env" code={CODE_STEP1_ENV} showLineNumbers={false} />
                <CodeBlock language="python" filename="config.py" code={CODE_STEP1_CONFIG} />
              </div>
              <ChecklistCard
                items={[
                  <>
                    Running{" "}
                    <code>python -c "from agents import Agent; print('ok')"</code>{" "}
                    prints <code>ok</code>.
                  </>,
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 2 Define Tools ---------------- */}
            <StepSection id="step-2">
              <StepHeader
                no={2}
                title="Define Tools (Search / Fetch / Save File)"
                lead="Decorate a plain Python function with @function_tool and it becomes an agent tool."
              />
              <InfoCard title="Three tool-design principles · echoes Stage 4">
                <p>① The function name and docstring are the "user manual" the model reads — spell out when to use it and what it returns;</p>
                <p>② Truncate return values so you don't blow up the context window;</p>
                <p>③ Return errors to the model in plain language instead of raising exceptions, so the agent can recover on its own.</p>
              </InfoCard>
              <CodeBlock language="python" filename="tools.py" code={CODE_STEP2_TOOLS} />
              <OpinionQuote>
                Unit-test your tools before wiring them to the agent — this is the single most important debugging discipline.
              </OpinionQuote>
              <ChecklistCard
                items={[
                  "Write a small script that calls each of the three tools once by hand, and confirm the output format matches your expectations.",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 3 Design the Agent Loop ---------------- */}
            <StepSection id="step-3">
              <StepHeader
                no={3}
                title="Design the Agent Loop"
                lead="Runner.run() ships with a complete ReAct loop built in — you only need to write good instructions."
              />
              <P>
                The OpenAI Agents SDK's <code>Runner.run()</code> has the full "model output → tool
                call → result fed back → model called again" loop built in (an engineered
                encapsulation of the ReAct loop), and <code>max_turns</code> prevents infinite
                loops. All we need to do is write good instructions — the research assistant's
                workflow is specified explicitly here (plan sub-questions first → search each
                sub-question → pick 2–3 pages to read in depth → synthesize into a report).
              </P>
              <CodeBlock language="python" filename="agent.py" code={CODE_STEP3_AGENT} />
              <InfoCard title="This is ReAct" color={SEMANTIC.perceive}>
                <p>
                  Map the Thought → Action → Observation trajectory from Chapter 2 onto the
                  Runner's loop — the SDK is just an engineered wrapper around that cycle. →{" "}
                  <Link
                    to="/en/principles#react"
                    className="text-c-perceive underline-offset-4 hover:underline"
                  >
                    Review ReAct in Principles
                  </Link>
                </p>
              </InfoCard>
              <ChecklistCard
                items={[
                  <>
                    Run a simple topic and confirm the agent acts in the order "plan → search →
                    read → save";
                  </>,
                  <>
                    A report file is generated under the <code>reports/</code> directory.
                  </>,
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 4 Add Memory ---------------- */}
            <StepSection id="step-4">
              <StepHeader
                no={4}
                title="Add Memory"
                lead="Two layers of memory: session memory keeps follow-up questions from re-running, long-term memory remembers what you've researched."
              />
              <P>
                ① Session memory: use the SDK's built-in <code>SQLiteSession</code> — follow-up
                questions within the same session ("expand section 2") don't re-run the research;
                ② Long-term memory (optional): append the metadata of each run (topic, conclusion
                summary, report path) to <code>memory/research_log.md</code> and inject it into the
                instructions, achieving "remember what I researched last time".
              </P>
              <CodeBlock language="python" filename="main.py" code={CODE_STEP4_MAIN} />
              <ChecklistCard
                items={[
                  "Turn 1: \"research X\"; turn 2: ask \"what data source was mentioned in section 3 of that report?\"",
                  "The agent should answer from context, without searching again.",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 5 Generate a Structured Research Report ---------------- */}
            <StepSection id="step-5">
              <StepHeader
                no={5}
                title="Generate a Structured Research Report"
                lead="The key to report quality is the output contract: a fixed skeleton plus explicit writing constraints."
              />
              <P>
                How: define a fixed report skeleton (a Pydantic model or a strongly constrained
                Markdown template) and spell it out in the tool docstring; the more advanced
                approach is to split out a second "writer agent" — the research agent gathers
                material and hands it to the writer agent to compose the report (the entry-level
                form of multi-agent division of labor).
              </P>
              <CodeBlock language="python" filename="writer.py" code={CODE_STEP5_WRITER} />
              <ChecklistCard
                items={[
                  "The generated report has a summary;",
                  "Every section has ≥ 1 source annotation;",
                  "Every reference URL actually appeared in the search results (verifiable by script).",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 6 Evaluate & Improve ---------------- */}
            <StepSection id="step-6">
              <StepHeader
                no={6}
                title="Evaluate & Improve"
                lead="Observe first, evaluate second, iterate third — let data drive your prompt iteration."
              />
              <P>
                The OpenAI Agents SDK enables Tracing by default (inspect every tool call on the
                Traces page at platform.openai.com); you can also use LangSmith (set{" "}
                <code>LANGCHAIN_TRACING_V2=true</code> and use its OpenAI wrapper). Evaluation
                method: build a dataset of 10–15 topics, score each report with LLM-as-judge on
                three dimensions — "source fidelity / coverage / structural completeness" — then
                iterate the instructions and compare scores.
              </P>
              <CodeBlock language="python" filename="eval.py" code={CODE_STEP6_EVAL} />
              <InfoCard title="Improvement list · ranked by payoff" color={SEMANTIC.loop}>
                <p>① Search queries too broad → add "keywords should include qualifiers (year / region / subject)" to the instructions;</p>
                <p>② Citation hallucination → require the citation format <code>[n] full URL</code> and script-verify that every URL came from search results;</p>
                <p>③ Shallow reports → enforce "read at least 1 page in depth per sub-question".</p>
              </InfoCard>
              <ChecklistCard
                items={[
                  "Dataset average scores are recorded quantitatively;",
                  "At least one full \"find issue → fix → re-test\" loop is completed.",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 7 Harden & Polish ---------------- */}
            <StepSection id="step-7">
              <StepHeader
                no={7}
                title="Harden & Polish"
                lead="Three small things before shipping: cost control, failure fallbacks, and observable traces."
              />
              <P>
                ① Cost control: cap <code>max_turns</code>, truncate page bodies (done in Step 2),
                and limit deep-read pages; ② Failure fallback: when a search returns nothing, have
                the agent retry once with different keywords before giving up; ③ Observability:
                save each run's trace link and tool-call logs to the <code>runs/</code> directory.
              </P>
              <CodeBlock language="python" filename="run_logging.py" code={CODE_STEP7_LOGGING} />
              <ChecklistCard
                items={["Watch the tool-call log output of one complete run."]}
              />
            </StepSection>

            {/* ---------------- STEP 8 Deploy & Share (Optional) ---------------- */}
            <StepSection id="step-8">
              <StepHeader
                no={8}
                title="Deploy & Share (Optional)"
                lead="Three paths from lightest to heaviest to put the project in other people's hands."
              />
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-xl border border-border-subtle bg-bg-1 p-5">
                  <span className="mb-2 block font-mono text-caption text-c-loop">Path 1 · Lightest</span>
                  <h4 className="mb-2 text-h4 font-semibold text-text-primary">
                    Hosted search, one-line swap
                  </h4>
                  <p className="text-body-sm text-text-secondary">
                    Replace your custom <code>web_search</code> with the SDK's hosted{" "}
                    <code>WebSearchTool()</code> and drop the Tavily dependency.
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-bg-1 p-5">
                  <span className="mb-2 block font-mono text-caption text-c-loop">Path 2 · Moderate</span>
                  <h4 className="mb-2 text-h4 font-semibold text-text-primary">Add a Web UI</h4>
                  <p className="text-body-sm text-text-secondary">
                    Wrap it with Streamlit/Gradio: an input box plus progress display (
                    <code>Runner.run_streamed</code> can stream the tool-call process) — a
                    shareable demo in 10 minutes.
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-bg-1 p-5">
                  <span className="mb-2 block font-mono text-caption text-c-loop">Path 3 · Heaviest</span>
                  <h4 className="mb-2 text-h4 font-semibold text-text-primary">Scheduled jobs</h4>
                  <p className="text-body-sm text-text-secondary">
                    Trigger it with a GitHub Actions schedule: automatically research a given topic
                    every Monday and commit the report back to the repo — a zero-cost "unattended
                    research assistant".
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <CodeBlock language="python" filename="agent.py · Option A" code={CODE_STEP8_HOSTED} />
              </div>
              {/* Final deliverables big card */}
              <Reveal className="mt-10 rounded-2xl border border-c-loop/40 bg-gradient-to-br from-c-loop/10 to-accent-2/10 p-6 md:p-8">
                <Badge color={LOOP} className="mb-4">
                  Final Deliverables
                </Badge>
                <ul className="grid gap-3 md:grid-cols-2">
                  {[
                    "Complete repo (with README, architecture diagram, and a sample report)",
                    "1 evaluation record",
                    "1 demo screencast",
                    "1 retrospective article",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-body-sm text-text-primary">
                      <Check size={15} className="mt-1 shrink-0 text-c-loop" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </StepSection>
          </div>
        </div>
      </div>

      {/* ---------------- S4 benchmark reference band ---------------- */}
      <section className="relative border-y border-border-subtle bg-bg-1">
        <div className="mx-auto max-w-[760px] px-5 py-20 md:px-6">
          <Reveal>
            <p className="mb-6 text-center text-body-lg text-text-secondary">
              Want to see where the ceiling is?
            </p>
            <a
              href="https://github.com/assafelovic/gpt-researcher"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-border-subtle bg-bg-2 p-6 transition-all duration-[250ms] hover:border-c-loop/50 hover:shadow-glow-cyan"
            >
              <Github size={26} className="mt-1 shrink-0 text-text-secondary transition-colors group-hover:text-c-loop" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-h4 font-semibold text-text-primary">GPT Researcher</span>
                  <Badge color={SEMANTIC.plan}>
                    <Star size={11} /> tens of thousands of stars
                  </Badge>
                </span>
                <span className="mt-2 block text-body-sm text-text-secondary">
                  An open-source autonomous research agent — this project is a teaching-oriented simplification of it.
                </span>
                <span className="mt-3 block font-mono text-caption text-text-tertiary">
                  github.com/assafelovic/gpt-researcher
                </span>
              </span>
              <ExternalLink
                size={16}
                className="shrink-0 text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-c-loop"
              />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- S5 graduation CTA ---------------- */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-loop) 10%, transparent), color-mix(in srgb, var(--c-memory) 6%, transparent) 45%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[720px] px-5 py-24 text-center md:px-6">
          <Reveal>
            <Rocket size={28} className="mx-auto mb-6 text-c-loop" />
            <h2 className="text-h2 font-bold text-text-primary">
              Ship it, and you've <span className="text-grad">graduated</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body-lg text-text-secondary">
              Put the repo link on your résumé and publish your retrospective — then return to the
              Learning Path and look back at the five stages you've walked.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/en/path"
              className="btn-outline-grad inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium text-text-primary"
            >
              Revisit the Learning Path
            </Link>
            <Link
              to="/en/resources"
              className="group inline-flex items-center gap-1.5 px-4 py-3 text-body-sm text-text-secondary transition-colors hover:text-c-perceive"
            >
              Find your next project idea in Resources
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
