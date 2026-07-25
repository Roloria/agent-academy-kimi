import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  NotebookPen,
} from "lucide-react";
import { Badge, Card, ExternalLinkCard, Reveal } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/providers/use-language";

/**
 * Learning Path page (/en/path) — detailed five-stage roadmap.
 * English mirror of src/pages/path/index.tsx: identical structure,
 * interactions and animations; all copy professionally translated
 * (glossary per v2-design.md §2.2; code, links, figures and arXiv IDs unchanged).
 */

/* ---------------------------------- Data types ---------------------------------- */

interface ResourceLink {
  title: string;
  desc?: string;
  href: string;
}

interface PaperLink {
  badge: string;
  title: string;
  href: string;
}

interface StageDef {
  n: number;
  name: string;
  title: string;
  weeks: string;
  color: string;
  goals: ReactNode[];
  topicsNode: ReactNode;
  resources?: ResourceLink[];
  papers?: PaperLink[];
  resourcesIntro?: ReactNode;
  outputs: ReactNode[];
  crossLink?: { label: string; to: string };
  afterOutputs?: ReactNode;
}

/** Topic entries (numbered list) */
function TopicList({
  items,
  color,
}: {
  items: { name: ReactNode; desc?: ReactNode }[];
  color: string;
}) {
  return (
    <ol className="space-y-5">
      {items.map((t, i) => (
        <Reveal key={i} delay={i * 0.06} y={20}>
          <li className="flex gap-4">
            <span
              className="mt-0.5 shrink-0 font-mono text-sm font-semibold"
              style={{ color }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="text-body font-medium text-text-primary">{t.name}</p>
              {t.desc && (
                <p className="mt-0.5 text-body-sm text-text-secondary">{t.desc}</p>
              )}
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

/** Stage 3: two-route Tabs (Tab A / Tab B switch, 2px indicator slides in 250ms) */
function RouteTabs({ color }: { color: string }) {
  const [tab, setTab] = useState<"a" | "b">("a");
  const TABS = [
    { key: "a" as const, label: "Route A · OpenAI Agents SDK" },
    { key: "b" as const, label: "Route B · LangGraph" },
  ];

  const panels: Record<"a" | "b", ReactNode> = {
    a: (
      <div>
        <p className="text-body font-medium text-text-primary">
          OpenAI Agents SDK (lightweight, official, quick to pick up)
        </p>
        <div className="mt-4">
          <p className="mb-2.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            Core abstractions
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Agent (instructions + tools + model)",
              "Runner (the execution loop)",
              "function_tool (tool decorator)",
              "handoffs (multi-agent handoff)",
              "Sessions (conversation memory)",
              "Tracing (observability)",
            ].map((c) => (
              <Badge key={c} color={color} className="normal-case tracking-normal">
                {c}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ExternalLinkCard
            href="https://openai.github.io/openai-agents-python/"
            title="Official docs (Python)"
            desc="openai.github.io/openai-agents-python"
          />
          <ExternalLinkCard
            href="https://github.com/openai/openai-agents-python"
            title="GitHub repo openai/openai-agents-python"
            desc="github.com"
          />
        </div>
      </div>
    ),
    b: (
      <div>
        <p className="text-body font-medium text-text-primary">
          LangGraph (graph-structured, highly controllable, large ecosystem)
        </p>
        <div className="mt-4">
          <p className="mb-2.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            Core abstractions
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "StateGraph (state graph)",
              "Nodes & edges",
              "Conditional routing",
              "Checkpointer (persistence / resume)",
              "Human-in-the-loop",
            ].map((c) => (
              <Badge key={c} color={color} className="normal-case tracking-normal">
                {c}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ExternalLinkCard
            href="https://langchain-ai.github.io/langgraph/"
            title="Official docs"
            desc="langchain-ai.github.io/langgraph"
          />
          <ExternalLinkCard
            href="https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/"
            title="DeepLearning.AI short course “AI Agents in LangGraph”"
            desc="Official LangChain × Tavily partner course"
          />
        </div>
      </div>
    ),
  };

  return (
    <div>
      <p className="mb-4 text-body-sm text-text-secondary">
        Pick either route (recommended: major in one, get familiar with the other)
      </p>
      <div className="flex gap-6 border-b border-border-subtle">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "relative pb-3 text-body-sm font-medium transition-colors duration-[250ms]",
                active ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="route-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5"
                  style={{ background: color }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pt-6"
        >
          {panels[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- Five-stage content ---------------------------------- */

const STAGES: StageDef[] = [
  {
    n: 1,
    name: "Fundamentals",
    title: "LLM fundamentals, prompt engineering, API calls",
    weeks: "1–2 weeks",
    color: SEMANTIC.perceive,
    goals: [
      "Understand the essence of LLMs (tokens, the context window, temperature, and the system/user/assistant message structure).",
      "Master core prompt-engineering techniques (clear instructions, few-shot, chain-of-thought (CoT), structured output).",
      "Complete a full API call with the official SDK, and understand pricing and rate limits.",
    ],
    topicsNode: (
      <TopicList
        color={SEMANTIC.perceive}
        items={[
          { name: "Transformer & LLM intuition", desc: "No math derivations — intuition first." },
          {
            name: "Message format & conversation state",
            desc: (
              <>
                The <code>messages</code> array, role separation and context management.
              </>
            ),
          },
          {
            name: "Prompt engineering",
            desc: "Instruction layering, output-format constraints (JSON), few-shot examples and CoT prompting.",
          },
          {
            name: "Hands-on API work",
            desc: "Auth (keys in environment variables), streaming responses, error retries and usage tracking.",
          },
        ]}
      />
    ),
    resources: [
      {
        title: "DeepLearning.AI short course “ChatGPT Prompt Engineering for Developers”",
        desc: "deeplearning.ai short course",
        href: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
      },
      {
        title: "Learn Prompting open-source guide",
        desc: "Chinese & English, free",
        href: "https://www.promptingguide.ai/zh",
      },
      {
        title: "OpenAI prompt engineering guide",
        desc: "platform.openai.com",
        href: "https://platform.openai.com/docs/guides/prompt-engineering",
      },
      {
        title: "Andrej Karpathy — “Neural Networks: Zero to Hero”",
        desc: "Optional; builds low-level intuition",
        href: "https://karpathy.ai/zero-to-hero.html",
      },
      {
        title: "OpenAI Cookbook",
        desc: "Official code example library",
        href: "https://cookbook.openai.com/",
      },
    ],
    outputs: [
      <>
        A command-line chatbot: multi-turn conversation, streaming output, adjustable{" "}
        <code>temperature</code>, and cumulative token-cost printing.
      </>,
      "Study note: “What is a system prompt? Why does few-shot work?”",
    ],
  },
  {
    n: 2,
    name: "Principles",
    title: "Agent architecture, ReAct, planning & memory",
    weeks: "1–2 weeks",
    color: SEMANTIC.plan,
    goals: [
      "Explain the essence of Agent = LLM + Tools + Loop, and be able to draw the agent architecture diagram.",
      "Understand the ReAct paradigm (Thought → Action → Observation) and implement it by hand.",
      "Understand the design trade-offs of planning (Plan-and-Execute, task decomposition) and memory (short-term / long-term).",
    ],
    topicsNode: (
      <TopicList
        color={SEMANTIC.plan}
        items={[
          {
            name: "The three components of an agent",
            desc: "Planning, memory and tool use.",
          },
          { name: "The ReAct paradigm", desc: "Interleaving reasoning and acting — and how it reduces hallucination." },
          {
            name: "Planning patterns",
            desc: "Task decomposition, self-reflection (Reflexion), and the control flow of multi-step execution.",
          },
          {
            name: "Memory patterns",
            desc: "In-context short-term memory vs. vector-store long-term memory; when to write and retrieve memories.",
          },
        ]}
      />
    ),
    resources: [
      {
        title: "Lilian Weng's classic long-form post “LLM Powered Autonomous Agents”",
        desc: "The most important survey blog in the agent field",
        href: "https://lilianweng.github.io/posts/2023-06-23-agent/",
      },
      {
        title: "Anthropic engineering blog “Building Effective Agents”",
        desc: "Workflows vs. agents — the full set of design patterns",
        href: "https://www.anthropic.com/engineering/building-effective-agents",
      },
    ],
    papers: [
      {
        badge: "arXiv:2210.03629",
        title: "ReAct: Synergizing Reasoning and Acting in Language Models",
        href: "https://arxiv.org/abs/2210.03629",
      },
      {
        badge: "arXiv:2303.11366",
        title: "Reflexion: Language Agents with Verbal Reinforcement Learning",
        href: "https://arxiv.org/abs/2303.11366",
      },
      {
        badge: "arXiv:2309.07864",
        title:
          "The Rise and Potential of Large Language Model Based Agents: A Survey (survey)",
        href: "https://arxiv.org/abs/2309.07864",
      },
    ],
    outputs: [
      <>
        <strong className="font-medium text-text-primary">Hand-write a “bare agent loop”</strong>
        : no frameworks — use the raw OpenAI <code>chat.completions</code> API +
        function dispatch to implement the Thought → Action → Observation loop,
        with 2 tools (a calculator + local file reading).
      </>,
      "Study note: “I Reimplemented ReAct in 50 Lines of Code.”",
    ],
    crossLink: { label: "Companion reading: Principles", to: "/principles" },
  },
  {
    n: 3,
    name: "Frameworks",
    title: "Go deep on one mainstream framework",
    weeks: "2–3 weeks",
    color: SEMANTIC.tool,
    goals: [
      "Master the core abstractions of one framework and use it to quickly build maintainable agents.",
      "Understand the criteria for “when to use a framework vs. when to write from scratch.”",
    ],
    topicsNode: <RouteTabs color={SEMANTIC.tool} />,
    resourcesIntro: "General Resources",
    resources: [
      {
        title: "Hugging Face “Agents Course”",
        desc: "Free; includes units on smolagents / LangGraph / LlamaIndex + a GAIA-benchmark final assignment",
        href: "https://huggingface.co/learn/agents-course",
      },
    ],
    outputs: [
      "Rewrite stage 2's bare agent with your chosen framework; compare code size and maintainability.",
      <>
        Connect the agent to a <strong className="font-medium text-text-primary">real external tool</strong>
        {" "}(e.g., a weather API or Tavily search) and ship a small app that answers
        “what's the weather today, and what should I wear?”
      </>,
      "Study note: “Bare vs. Framework: Why I Chose XX.”",
    ],
    crossLink: { label: "Can't decide? See Frameworks", to: "/frameworks" },
  },
  {
    n: 4,
    name: "Advanced Skills",
    title: "RAG, tool design, Function Calling, memory, evaluation & debugging",
    weeks: "3–4 weeks",
    color: SEMANTIC.memory,
    goals: [
      "Master the four advanced building blocks of production-grade agents: retrieval augmentation, tool engineering, long-term memory, and evaluation & observability.",
    ],
    topicsNode: (
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            t: "RAG",
            d: "Embeddings, vector retrieval, chunking strategies, hybrid retrieval (keyword + vector), reranking; Agentic RAG (letting the agent decide when to retrieve).",
          },
          {
            t: "Tool Design & Function Calling",
            d: "Tool schema design principles (naming, docstrings, parameter validation, idempotency), techniques for feeding error messages back to the model, and tool-granularity trade-offs.",
          },
          {
            t: "Memory",
            d: "Session-level memory (Session/Checkpointer), cross-session long-term memory (vector stores / structured user profiles), and memory write policies.",
          },
          {
            t: "Evaluation & Debugging",
            d: "Trace analysis, failure-mode taxonomy (wrong tool selection, loops, hallucinated citations), building datasets + automated evaluation (LLM-as-judge) with LangSmith, and regression testing.",
          },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.06} y={20}>
            <Card accent={SEMANTIC.memory} number={String(i + 1).padStart(2, "0")} className="h-full">
              <p className="text-body font-semibold text-text-primary">{c.t}</p>
              <p className="mt-2 text-body-sm text-text-secondary">{c.d}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    ),
    resources: [
      {
        title: "DeepLearning.AI short course “Functions, Tools and Agents with LangChain”",
        desc: "deeplearning.ai short course",
        href: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/",
      },
      {
        title: "DeepLearning.AI short course “Long-Term Agentic Memory With LangGraph”",
        desc: "deeplearning.ai short course",
        href: "https://www.deeplearning.ai/short-courses/long-term-agentic-memory-with-langgraph/",
      },
      {
        title: "DeepLearning.AI short course “Evaluating AI Agents”",
        desc: "Arize partner course; a systematic take on agent evaluation",
        href: "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/",
      },
      {
        title: "DeepLearning.AI short course “Building Agentic RAG with LlamaIndex”",
        desc: "deeplearning.ai short course",
        href: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/",
      },
      {
        title: "LangSmith official docs",
        desc: "Observability & evaluation platform",
        href: "https://docs.smith.langchain.com/",
      },
      {
        title: "OpenAI Function Calling guide",
        desc: "platform.openai.com",
        href: "https://platform.openai.com/docs/guides/function-calling",
      },
    ],
    papers: [
      {
        badge: "arXiv:2005.11401",
        title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        href: "https://arxiv.org/abs/2005.11401",
      },
      {
        badge: "arXiv:2302.04761",
        title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
        href: "https://arxiv.org/abs/2302.04761",
      },
    ],
    outputs: [
      "A “document Q&A agent”: upload PDF/Markdown → vectorize and index → the agent decides when to retrieve and when to answer directly, with long-term memory (it remembers user preferences).",
      "A LangSmith evaluation report: a dataset of ≥ 20 test cases, baseline scores, and comparison scores after one prompt iteration.",
    ],
  },
  {
    n: 5,
    name: "Capstone",
    title: "Complete a full agent project independently",
    weeks: "3–4 weeks",
    color: SEMANTIC.loop,
    goals: [
      "Go through the full cycle — requirements → design → implementation → evaluation → deployment → retrospective — and produce a portfolio-worthy piece.",
    ],
    topicsNode: (
      <div className="space-y-6">
        <div>
          <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            Requirements · Must Include
          </p>
          <ul className="space-y-2.5">
            {["≥ 3 tools", "Some form of memory mechanism", "Observable (traces or logs)", "A minimal evaluation set", "README and a demo"].map(
              (r) => (
                <li key={r} className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: SEMANTIC.loop }} />
                  {r}
                </li>
              ),
            )}
          </ul>
        </div>
        <p className="text-body-sm text-text-secondary">
          <span className="font-medium text-text-primary">Recommended topic: </span>
          the Capstone “Personal Research Assistant Agent”. You may also pick your own
          (e.g., a job-application tracker agent, a code-review agent, or a
          competitor-monitoring agent).
        </p>
        <div>
          <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            Benchmark Reference
          </p>
          <ExternalLinkCard
            href="https://github.com/assafelovic/gpt-researcher"
            title="GPT Researcher"
            desc="Open-source autonomous research agent"
          />
        </div>
      </div>
    ),
    outputs: [
      "A complete GitHub repo (code + README + architecture diagram + demo recording).",
      "A retrospective article: design decisions, pitfalls, evaluation data and next-step improvements.",
    ],
    afterOutputs: <Stage5CTA />,
  },
];

/** Stage 5 closing gradient-border CTA card (needs localize for the /en link) */
function Stage5CTA() {
  const { localize } = useLanguage();
  return (
    <Reveal delay={0.1}>
      <Link
        to={localize("/capstone")}
        className="group block p-8 text-center transition-transform duration-[250ms] ease-out hover:-translate-y-1"
        style={{
          borderRadius: 24,
          border: "1.5px solid transparent",
          backgroundImage:
            "linear-gradient(var(--bg-1), var(--bg-1)), linear-gradient(135deg, var(--c-loop), var(--c-memory))",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <p className="text-h3 font-bold text-text-primary">
          Ready?
          <span className="ml-2 inline-block text-c-loop transition-transform duration-[250ms] group-hover:translate-x-1">
            →
          </span>
        </p>
        <p className="mt-2 text-body-sm text-text-secondary">
          Enter the 8-step Capstone tutorial and finish your graduation project
        </p>
      </Link>
    </Reveal>
  );
}

/** Deliverable quick view on the sticky stage card (from brief §1 overview table) */
const DELIVERABLES: Record<number, string> = {
  1: "A command-line chatbot (streaming output, token stats)",
  2: "A hand-written 50-line “bare agent loop” (no frameworks)",
  3: "Rewrite the bare agent with a framework and add one real tool",
  4: "A Q&A agent with RAG + memory, with a LangSmith evaluation report",
  5: "Personal Research Assistant Agent: full repo + demo + retrospective article",
};

/* ---------------------------------- S1 Page hero ---------------------------------- */

const TITLE_SEGS: { text: string; grad?: boolean }[] = [
  { text: "From your first" },
  { text: " API call," },
  { text: " to " },
  { text: "shipping", grad: true },
  { text: " an " },
  { text: "Agent project" },
];

const STATS = [
  { num: "5", label: "Stages" },
  { num: "10–15", label: "Weeks" },
  { num: "5", label: "Stage deliverables" },
  { num: "1", label: "Capstone project" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-texture pb-20 pt-40 max-md:pt-28">
      {/* Cyan glow at the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--c-perceive) 12%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-prose2 px-6 max-md:px-5">
        <p className="font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          HOME / LEARNING PATH
        </p>
        <div className="mt-5">
          <Badge color={SEMANTIC.perceive}>Full Cycle · 10–15 Weeks</Badge>
        </div>
        <h1 className="mt-5 text-h1 font-black text-text-primary">
          {TITLE_SEGS.map((s, i) => (
            <motion.span
              key={i}
              className={cn("inline-block whitespace-pre", s.grad && "text-grad")}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.15 + i * 0.06,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {s.text}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-6 max-w-2xl text-body-lg text-text-secondary"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Five stages, 6–8 hours a week. Every stage ends with a dual deliverable —
          "runnable code + one study note". What you keep is not just notes, but a
          trail of repositories that run.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-baseline gap-3">
              <span className="font-display text-[32px] font-bold leading-none text-text-primary">
                {s.num}
              </span>
              <span className="text-caption text-text-tertiary">{s.label}</span>
              {i < STATS.length - 1 && (
                <span className="ml-7 hidden text-text-tertiary sm:inline">·</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------- S2 Sticky stage nav ---------------------------------- */

function StageNav() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(Number(e.target.getAttribute("data-stage")));
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const s of STAGES) {
      const el = document.getElementById(`stage-${s.n}`);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const scrollTo = (n: number) => {
    document
      .getElementById(`stage-${n}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-16 z-40 border-b border-border-subtle bg-bg-0/85 backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-content overflow-x-auto px-6 max-md:px-5">
        {STAGES.map((s, i) => {
          const isActive = active === s.n;
          return (
            <motion.button
              key={s.n}
              type="button"
              onClick={() => scrollTo(s.n)}
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              className={cn(
                "relative flex shrink-0 items-center gap-2.5 px-4 py-3.5 text-left transition-colors duration-[250ms]",
                isActive ? "" : "hover:bg-bg-1",
              )}
            >
              {isActive && (
                <span
                  className="absolute inset-x-0 top-0 h-0.5 transition-colors duration-[250ms]"
                  style={{ background: s.color }}
                />
              )}
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="flex flex-col">
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
                    STAGE {s.n}
                  </span>
                  <span
                    className="text-body-sm font-medium transition-colors duration-[250ms]"
                    style={{ color: isActive ? s.color : "var(--text-secondary)" }}
                  >
                    {s.name}
                  </span>
                </span>
                <span className="text-caption text-text-tertiary">{s.weeks}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- S3 Stage details ---------------------------------- */

function SubHead({ label, color }: { label: string; color: string }) {
  return (
    <Reveal y={24}>
      <h4 className="mb-5 flex items-center gap-2.5 text-h4 font-semibold text-text-primary">
        <span className="h-3.5 w-1 rounded-full" style={{ background: color }} />
        {label}
      </h4>
    </Reveal>
  );
}

function StageSection({
  def,
  nextColor,
}: {
  def: StageDef;
  nextColor?: string;
}) {
  const { localize } = useLanguage();
  const topicsLabel =
    def.n === 3 ? "Two Routes" : def.n === 5 ? "Project Requirements" : "Topics";

  return (
    <section
      id={`stage-${def.n}`}
      data-stage={def.n}
      className="relative scroll-mt-40"
    >
      {/* Section color glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-[480px] w-[480px]"
        style={{
          background: `radial-gradient(closest-side, ${semanticAlpha(def.color, 8)}, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-content px-6 max-md:px-5">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          {/* Left: sticky stage card */}
          <div className="lg:sticky lg:top-40 lg:self-start">
            <motion.div
              className="font-display text-[88px] font-bold leading-none"
              style={{ color: def.color }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {String(def.n).padStart(2, "0")}
            </motion.div>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-h2 font-bold text-text-primary">
                {def.name}
              </h2>
              <p className="mt-2 text-body-sm text-text-secondary">{def.title}</p>
              <div className="mt-4">
                <Badge color={def.color}>{def.weeks}</Badge>
              </div>
              <div className="mt-6 rounded-xl border border-border-subtle bg-bg-1 p-4">
                <p className="font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
                  Deliverable snapshot
                </p>
                <p className="mt-2 text-body-sm text-text-secondary">
                  {DELIVERABLES[def.n]}
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: content column */}
          <div className="max-w-[720px] space-y-14">
            {/* Goals */}
            <div>
              <SubHead label="Goals" color={def.color} />
              <ul className="space-y-3">
                {def.goals.map((g, i) => (
                  <Reveal key={i} delay={i * 0.06} y={20}>
                    <li className="flex items-start gap-3 text-body text-text-secondary">
                      <Check
                        size={18}
                        className="mt-1 shrink-0"
                        style={{ color: def.color }}
                      />
                      <span>{g}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* Topics / Two routes / Project requirements */}
            <div>
              <SubHead label={topicsLabel} color={def.color} />
              {def.topicsNode}
            </div>

            {/* Recommended resources */}
            {def.resources && def.resources.length > 0 && (
              <div>
                <SubHead label={def.resourcesIntro ? String(def.resourcesIntro) : "Recommended Resources"} color={def.color} />
                <div className="grid gap-3">
                  {def.resources.map((r, i) => (
                    <Reveal key={r.href} delay={i * 0.05} y={16}>
                      <ExternalLinkCard href={r.href} title={r.title} desc={r.desc} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* Papers (arXiv badge style) */}
            {def.papers && def.papers.length > 0 && (
              <div>
                <SubHead label="Papers" color={def.color} />
                <div className="grid gap-3">
                  {def.papers.map((p, i) => (
                    <Reveal key={p.href} delay={i * 0.05} y={16}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors duration-[250ms] hover:border-border-strong"
                      >
                        <Badge color={def.color} className="shrink-0">
                          {p.badge}
                        </Badge>
                        <span className="min-w-0 flex-1 text-body-sm text-text-secondary transition-colors group-hover:text-text-primary">
                          {p.title}
                        </span>
                        <ArrowUpRight
                          size={15}
                          className="shrink-0 text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
                        />
                      </a>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables: green-bordered panel */}
            <div>
              <SubHead label="Deliverables" color={SEMANTIC.tool} />
              <motion.div
                className="rounded-2xl border border-c-tool/40 bg-c-tool/5 p-6"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Badge color={SEMANTIC.tool} className="mb-4">
                  Deliverables
                </Badge>
                <ul className="space-y-3">
                  {def.outputs.map((o, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-body text-text-secondary"
                    >
                      <Check size={18} className="mt-1 shrink-0 text-c-tool" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Cross link */}
            {def.crossLink && (
              <Reveal>
                <Link
                  to={localize(def.crossLink.to)}
                  className="group inline-flex items-center gap-2 text-body font-medium text-c-perceive"
                >
                  {def.crossLink.label}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-[250ms] group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            )}

            {def.afterOutputs}
          </div>
        </div>
      </div>

      {/* Section divider: semantic-color gradient hairline scaleX */}
      {nextColor && (
        <motion.div
          aria-hidden
          className="mx-auto mt-32 h-px max-w-content origin-left max-md:mt-16 max-md:mx-5"
          style={{
            background: `linear-gradient(90deg, ${semanticAlpha(def.color, 40)}, ${semanticAlpha(nextColor, 40)}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      )}
    </section>
  );
}

/* ---------------------------------- S4 Dual-deliverable principle ---------------------------------- */

function Typewriter({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLen(text.length);
      return;
    }
    const id = window.setInterval(() => {
      setLen((l) => {
        if (l >= text.length) {
          window.clearInterval(id);
          return l;
        }
        return l + 1;
      });
    }, 40);
    return () => window.clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref}>
      {text.slice(0, len)}
      <span className="animate-caret-blink text-c-perceive">▎</span>
    </span>
  );
}

function DualOutput() {
  const cards = [
    {
      icon: <Code2 size={20} />,
      title: "Runnable code",
      desc: "Every stage's deliverable runs, demos well, and belongs on your résumé.",
    },
    {
      icon: <NotebookPen size={20} />,
      title: "One study note",
      desc: "Explaining a concept in your own words is the best test of understanding.",
    },
  ];

  return (
    <section className="mt-32 bg-bg-1 py-24 max-md:mt-16 max-md:py-16">
      <div className="mx-auto max-w-[760px] px-6 text-center max-md:px-5">
        <Reveal>
          <h3 className="text-h3 font-bold text-text-primary">The Dual Deliverable of Every Stage</h3>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <Card accent={SEMANTIC.perceive} className="h-full text-left">
                <span className="mb-3 inline-block text-c-perceive">{c.icon}</span>
                <p className="text-body font-semibold text-text-primary">{c.title}</p>
                <p className="mt-2 text-body-sm text-text-secondary">{c.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 font-mono text-body-sm text-text-secondary">
          <span className="text-c-perceive">$</span>{" "}
          <Typewriter text="git log --oneline  # 10 weeks in, this is your own growth trajectory" />
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------- S5 Page bottom nav ---------------------------------- */

function BottomNav() {
  const { localize } = useLanguage();
  const items = [
    {
      to: "/",
      label: "Previous: Home",
      icon: (
        <ArrowLeft
          size={16}
          className="transition-transform duration-[250ms] group-hover:-translate-x-1"
        />
      ),
    },
    {
      to: "/principles",
      label: "Next: Principles",
      icon: (
        <ArrowRight
          size={16}
          className="transition-transform duration-[250ms] group-hover:translate-x-1"
        />
      ),
    },
  ];

  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto grid max-w-content gap-4 px-6 max-md:px-5 sm:grid-cols-2">
        {items.map((it, i) => (
          <Reveal key={it.to} delay={i * 0.1}>
            <Link
              to={localize(it.to)}
              className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:border-border-strong"
            >
              <span className="text-body font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                {it.label}
              </span>
              <span className="text-c-perceive">{it.icon}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- Page ---------------------------------- */

export default function PathEn() {
  const location = useLocation();

  // Support /en/path#stage-N deep links (target of the home S4 cards)
  useEffect(() => {
    if (!location.hash) return;
    const t = window.setTimeout(() => {
      document
        .querySelector(location.hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  return (
    <>
      <Hero />
      <StageNav />
      <div className="space-y-0 pt-24 max-md:pt-16">
        {STAGES.map((s, i) => (
          <StageSection key={s.n} def={s} nextColor={STAGES[i + 1]?.color} />
        ))}
      </div>
      <DualOutput />
      <BottomNav />
    </>
  );
}
