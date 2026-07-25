import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMANTIC } from "@/lib/semantic";
import { Badge } from "@/components/ui-extra";
import ChapterWhatIsAgent from "./principles/chapter1";
import ChapterReasoning from "./principles/chapter2";
import ChapterMemory from "./principles/chapter3";
import ChapterTools from "./principles/chapter4";
import ChapterMultiAgent from "./principles/chapter5";
import ChapterReferences from "./principles/chapter6";

/** Table-of-contents entries (mirrors the zh /principles page, design/principles.md §S2) */
interface TocItem {
  id: string;
  num: string;
  label: string;
  children?: { id: string; num: string; label: string }[];
}

const TOC: TocItem[] = [
  { id: "what-is-agent", num: "01", label: "What Is an AI Agent" },
  {
    id: "reasoning",
    num: "02",
    label: "Core Reasoning Paradigms",
    children: [
      { id: "react", num: "2.1", label: "ReAct" },
      { id: "plan-and-execute", num: "2.2", label: "Plan-and-Execute" },
      { id: "reflexion", num: "2.3", label: "Reflexion" },
      { id: "cot", num: "2.4", label: "Chain-of-Thought (CoT)" },
    ],
  },
  { id: "memory", num: "03", label: "Memory Systems" },
  { id: "tools", num: "04", label: "Tool Use: Function Calling & MCP" },
  { id: "multi-agent", num: "05", label: "Multi-Agent Systems" },
  { id: "references", num: "06", label: "References" },
];

const ALL_IDS = TOC.flatMap((t) => [t.id, ...(t.children?.map((c) => c.id) ?? [])]);

/** IntersectionObserver scroll-spy: pick the sub-section hit near the viewport top */
function useActiveSection(): string {
  const [active, setActive] = useState<string>(ALL_IDS[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // The snap line sits just below the Navbar (64px); keep 70% of the viewport at the bottom
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );
    for (const id of ALL_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

function TocLink({
  id,
  num,
  label,
  active,
  depth = 0,
  onNavigate,
}: {
  id: string;
  num: string;
  label: string;
  active: string;
  depth?: number;
  onNavigate?: () => void;
}) {
  const isActive = active === id;
  return (
    <a
      href={`#${id}`}
      onClick={onNavigate}
      className={cn(
        "block border-l-2 py-1.5 pr-2 text-body-sm transition-colors duration-200",
        depth === 0 ? "pl-3" : "pl-8",
        isActive
          ? "border-c-plan text-text-primary"
          : "border-transparent text-text-tertiary hover:text-text-secondary",
      )}
    >
      <span
        className={cn(
          "mr-2 font-mono text-caption",
          isActive ? "text-c-plan" : "text-text-tertiary",
        )}
      >
        {num}
      </span>
      {label}
    </a>
  );
}

/** Desktop TOC: 240px sticky (visible ≥1280px) */
function DesktopToc({ active }: { active: string }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-24 hidden w-60 shrink-0 self-start xl:block"
      aria-label="Table of contents"
    >
      <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
        Contents
      </p>
      <nav className="space-y-0.5">
        {TOC.map((item) => (
          <div key={item.id}>
            <TocLink {...item} active={active} />
            {item.children?.map((c) => (
              <TocLink key={c.id} {...c} active={active} depth={1} />
            ))}
          </div>
        ))}
      </nav>
      <div className="mt-8 rounded-xl border border-border-subtle bg-bg-1 p-4">
        <p className="text-body-sm font-medium text-text-primary">Finished this chapter? →</p>
        <Link
          to="/en/path#stage-2"
          className="mt-1.5 block text-body-sm text-c-perceive hover:underline"
        >
          Hand-write a 50-line bare Agent (Learning Path · Stage 2)
        </Link>
      </div>
    </motion.aside>
  );
}

/** Mobile TOC: top "Contents ▾" collapsible drawer */
function MobileToc({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-10 rounded-xl border border-border-subtle bg-bg-1 xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-body-sm font-medium text-text-primary"
      >
        <span className="flex items-center gap-2">
          <ListOrdered size={15} className="text-c-plan" />
          Contents
        </span>
        <ChevronDown
          size={15}
          className={cn("text-text-tertiary transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <nav className="border-t border-border-subtle px-2 py-2">
          {TOC.map((item) => (
            <div key={item.id}>
              <TocLink {...item} active={active} onNavigate={() => setOpen(false)} />
              {item.children?.map((c) => (
                <TocLink key={c.id} {...c} active={active} depth={1} onNavigate={() => setOpen(false)} />
              ))}
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}

/** Page header title: word-level stagger entrance */
const TITLE_WORDS: { text: string; grad?: boolean }[] = [
  { text: "Crack" },
  { text: "Open" },
  { text: "the" },
  { text: "Agent" },
  { text: "Black", grad: true },
  { text: "Box", grad: true },
];

function PageHeader() {
  return (
    <header className="bg-grid-texture relative overflow-hidden">
      {/* Amber glow (this page's chapter color = planning amber) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--c-plan) 8%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-content px-6 pb-16 pt-40">
        <nav aria-label="Breadcrumb" className="mb-6 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <Link to="/en" className="transition-colors hover:text-c-perceive">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">Principles</span>
        </nav>

        <Badge color={SEMANTIC.plan}>6 Chapters · Tutorial-grade · Verifiable</Badge>

        <h1 className="mt-6 text-h1 font-black text-text-primary">
          {TITLE_WORDS.map((w, i) => (
            <motion.span
              key={w.text}
              className="inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {w.grad ? <span className="text-grad">{w.text}</span> : w.text}
              {i < TITLE_WORDS.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-6 max-w-2xl text-body-lg text-text-secondary"
        >
          If a large language model is a &ldquo;brain that can only talk&rdquo;, this chapter gives
          that brain eyes, hands, feet and a notebook — explaining Perception, Planning, Memory,
          Tools and the Action Loop one by one, plus the core concepts you will inevitably run
          into: ReAct, Reflexion, MCP and multi-agent systems.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 font-mono text-caption text-text-tertiary"
        >
          ≈ 3,500 words · 20 min read · 6 companion papers · Last updated mid-2026
        </motion.p>
      </div>
    </header>
  );
}

/** End-of-chapter navigation (S9) */
function ChapterNav() {
  return (
    <nav aria-label="Chapter navigation" className="mt-24 grid gap-4 sm:grid-cols-2">
      <Link
        to="/en/path"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <ArrowLeft size={14} className="transition-transform duration-[250ms] group-hover:-translate-x-1" />
          Previous stop
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">Learning Path</span>
        <span className="mt-1 block text-body-sm text-text-secondary">
          Back to the five-stage roadmap and keep your pace
        </span>
      </Link>
      <Link
        to="/en/frameworks"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center justify-end gap-2 font-mono text-caption uppercase tracking-[0.12em] text-c-perceive">
          Next stop
          <ArrowRight size={14} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">Frameworks →</span>
        <span className="mt-1 block text-body-sm text-text-secondary">
          You understand the principles — time to pick your weapon
        </span>
      </Link>
    </nav>
  );
}

/** Principles page (/en/principles): left TOC + right long-form textbook layout (English edition) */
export default function PrinciplesEn() {
  const active = useActiveSection();

  return (
    <div className="min-h-[100dvh]">
      <PageHeader />

      <div className="mx-auto max-w-content px-6 pb-24">
        <div className="xl:flex xl:gap-14">
          <DesktopToc active={active} />

          {/* Body column: long-form reading max-width 880px */}
          <div className="min-w-0 max-w-prose2 flex-1">
            <MobileToc active={active} />
            <ChapterWhatIsAgent />
            <ChapterReasoning />
            <ChapterMemory />
            <ChapterTools />
            <ChapterMultiAgent />
            <ChapterReferences />
            <ChapterNav />
          </div>
        </div>
      </div>
    </div>
  );
}
