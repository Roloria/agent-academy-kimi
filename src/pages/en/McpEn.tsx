import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bug,
  ChevronDown,
  Code,
  Cpu,
  Database,
  FileText,
  FlaskConical,
  Globe,
  KeyRound,
  ListOrdered,
  Lock,
  MessagesSquare,
  Monitor,
  Plug,
  ShieldAlert,
  UserCheck,
  Wrench,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { Badge, ExternalLinkCard, Reveal } from "@/components/ui-extra";
import CodeBlock from "@/components/CodeBlock";
import { ChapterHeading, SubHeading, Figure } from "@/pages/principles/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarningPanel, StepHeader, AcceptCard, GreenQuote, GradientStatement } from "@/pages/mcp/shared";
import {
  CODE_INSTALL,
  CODE_SERVER,
  CODE_INSPECTOR,
  CODE_CLAUDE_STDIO,
  CODE_CLAUDE_REMOTE,
  CODE_CLIENT,
} from "@/pages/mcp/code";

/**
 * /en/mcp —— MCP topic page, English edition (design/v2/mcp.md §英文版文案).
 * Same structure as the zh page; code samples are identical (Chinese comments preserved verbatim).
 */

/* ---------- local helpers (EN labels) ---------- */

/** "IN PLAIN TERMS" paragraph (EN counterpart of principles 通俗解释) */
function ExplainEn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <span className="inline-block rounded-md border border-c-perceive/30 bg-c-perceive/10 px-2 py-0.5 font-mono text-caption tracking-[0.12em] text-c-perceive">
        IN PLAIN TERMS
      </span>
      <p className="mt-4 text-body-lg text-text-secondary">{children}</p>
    </motion.div>
  );
}

/** "KEY POINTS" list with ◆ markers */
function KeyPointsEn({ items }: { items: ReactNode[] }) {
  return (
    <div className="mt-10">
      <p className="mb-4 flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
        <span aria-hidden className="text-c-tool">◆</span>
        KEY POINTS
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-body text-text-secondary">
            <span aria-hidden className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rotate-45 bg-c-tool" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** CodeBlock entrance wrapper */
function CodeReveal({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-6"
    >
      {children}
    </motion.div>
  );
}

/* ---------- TOC ---------- */

interface TocItem {
  id: string;
  num: string;
  label: string;
  children?: { id: string; num: string; label: string }[];
}

const TOC: TocItem[] = [
  {
    id: "overview",
    num: "01",
    label: "MCP Overview",
    children: [
      { id: "why", num: "1.1", label: "Why MCP" },
      { id: "architecture", num: "1.2", label: "3-Layer Architecture" },
      { id: "primitives", num: "1.3", label: "3 Primitives" },
      { id: "transport", num: "1.4", label: "Transports" },
    ],
  },
  { id: "hands-on", num: "02", label: "Hands-on: A 30-Line MCP Server" },
  { id: "vs-function-calling", num: "03", label: "Function Calling vs MCP" },
  {
    id: "ecosystem",
    num: "04",
    label: "Ecosystem Map",
    children: [
      { id: "official-servers", num: "4.1", label: "Official Reference Servers" },
      { id: "community", num: "4.2", label: "Community Picks" },
      { id: "framework-support", num: "4.3", label: "Framework Support" },
    ],
  },
  { id: "security", num: "05", label: "Security & Engineering" },
  { id: "references", num: "06", label: "References & Recap" },
];

const ALL_IDS = TOC.flatMap((t) => [t.id, ...(t.children?.map((c) => c.id) ?? [])]);

function useActiveSection(): string {
  const [active, setActive] = useState<string>(ALL_IDS[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
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
          ? "border-c-tool text-text-primary"
          : "border-transparent text-text-tertiary hover:text-text-secondary",
      )}
    >
      <span className={cn("mr-2 font-mono text-caption", isActive ? "text-c-tool" : "text-text-tertiary")}>
        {num}
      </span>
      {label}
    </a>
  );
}

function DesktopToc({ active }: { active: string }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-24 hidden w-60 shrink-0 self-start xl:block"
      aria-label="Contents"
    >
      <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">CONTENTS</p>
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
        <p className="text-body-sm font-medium text-text-primary">Done here? →</p>
        <Link to="/en/sandbox" className="mt-1.5 block text-body-sm text-c-tool hover:underline">
          Watch an agent call tools in the Sandbox →
        </Link>
      </div>
    </motion.aside>
  );
}

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
          <ListOrdered size={15} className="text-c-tool" />
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

/* ---------- Header ---------- */

const TITLE_WORDS: { text: string; grad?: boolean }[] = [
  { text: "MCP:" },
  { text: "The" },
  { text: "Universal Socket", grad: true },
  { text: "for" },
  { text: "AI" },
  { text: "Capabilities" },
];

const HEADER_BADGES = [
  { label: "PROTOCOL DEEP DIVE", color: SEMANTIC.tool },
  { label: "OPEN-SOURCED BY ANTHROPIC 2024.11", color: SEMANTIC.tool },
  { label: "2025-11-25 SPEC", color: SEMANTIC.perceive },
  { label: "LINUX FOUNDATION AAIF", color: SEMANTIC.memory },
];

function PageHeader() {
  return (
    <header className="bg-grid-texture relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${semanticAlpha(SEMANTIC.tool, 8)}, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-content px-6 pb-16 pt-40">
        <nav
          aria-label="Breadcrumb"
          className="mb-6 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary"
        >
          <Link to="/en" className="transition-colors hover:text-c-perceive">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">MCP</span>
        </nav>

        <div className="flex flex-wrap gap-2">
          {HEADER_BADGES.map((b, i) => (
            <motion.span
              key={b.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
            >
              <Badge color={b.color}>{b.label}</Badge>
            </motion.span>
          ))}
        </div>

        <h1 className="mt-6 text-h1 font-black text-text-primary">
          {TITLE_WORDS.map((w, i) => (
            <motion.span
              key={w.text}
              className="inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              {w.grad ? (
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg, var(--c-perceive), var(--c-tool))" }}
                >
                  {w.text}
                </span>
              ) : (
                w.text
              )}
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
          The Model Context Protocol lets any AI app plug into any external tool or data source —
          like USB-C for hardware, or LSP for editors. This guide covers the architecture, a
          hands-on build, the ecosystem, and security, end to end.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 font-mono text-caption text-text-tertiary"
        >
          ~25 min read · 4 runnable code samples · Prerequisite: Function Calling (Principles §4)
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-c-plan/50 bg-c-plan/5 px-5 py-3.5"
        >
          <FlaskConical size={16} className="shrink-0 text-c-plan" aria-hidden />
          <p className="text-body-sm text-text-secondary">
            New to Function Calling? Read first →{" "}
            <Link to="/en/principles#tools" className="font-medium text-c-plan hover:underline">
              Principles §4 Tool Use
            </Link>
          </p>
        </motion.div>
      </div>
    </header>
  );
}

/* ---------- Chapter 1 · Overview ---------- */

function PrimitivesAccordionEn() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 rounded-xl border border-border-subtle bg-bg-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-3.5 text-body-sm font-medium text-text-primary"
      >
        <span className="flex items-center gap-2">
          <Monitor size={15} className="text-c-tool" aria-hidden />
          Advanced: Roots / Sampling / Elicitation
        </span>
        <ChevronDown
          size={15}
          className={cn("text-text-tertiary transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="border-t border-border-subtle px-5 py-4 text-body-sm text-text-secondary">
              The spec also defines client capabilities such as Roots, Sampling and Elicitation —
              the three primitives are all you need to get started.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChapterOverviewEn() {
  return (
    <section aria-label="Chapter 1 MCP Overview" className="mt-24">
      <ChapterHeading id="overview" index={1} title="MCP Overview" color={SEMANTIC.tool} />

      <SubHeading id="why" index="1.1" title="Why MCP: From M×N to M+N" color={SEMANTIC.tool} />

      <ExplainEn>
        In the world of Function Calling, suppose there are{" "}
        <strong className="font-bold text-text-primary">M AI apps</strong> (Claude Desktop,
        ChatGPT, your own agent, IDE plugins…) and{" "}
        <strong className="font-bold text-text-primary">N capability providers</strong>{" "}
        (filesystem, GitHub, databases, Slack, browsers…).{" "}
        <strong className="font-bold text-text-primary">Without a standard</strong>: every app
        that wants every capability needs its own adapter code (auth, data formats and tool
        schemas all differ) —{" "}
        <strong className="font-bold text-c-loop">M × N</strong> integrations.{" "}
        <strong className="font-bold text-text-primary">With MCP</strong>: the app side
        implements one "MCP Client", the capability side implements one "MCP Server", and any
        compliant Client plugs into any Server — down to{" "}
        <strong className="font-bold text-c-tool">M + N</strong>.
      </ExplainEn>

      <Figure
        src="/diagram-mcp-mn.svg"
        alt="Side-by-side comparison: without a standard, 3 apps and 4 tools need 12 tangled connections; with MCP, each connects once to a central MCP ring — 7 connections"
        caption="Integrations: M×N → M+N"
      />

      <Reveal>
        <div className="my-8 rounded-xl border border-border-subtle bg-bg-2 px-6 py-5" style={{ borderLeft: "3px solid var(--c-tool)" }}>
          <p className="font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            MCP in one line
          </p>
          <ul className="mt-4 space-y-3.5">
            {[
              { icon: Plug, text: "USB-C for hardware — one port for every peripheral" },
              { icon: Code, text: "LSP for editors — any editor to any language's smarts" },
              { icon: Cpu, text: "MCP for AI apps — any AI app to any external tool or data source" },
            ].map((row) => (
              <li key={row.text} className="flex items-center gap-3 text-body text-text-secondary">
                <row.icon size={17} className="shrink-0 text-c-tool" aria-hidden />
                {row.text}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal className="my-10">
        <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0">
          {[
            "2024.11 Open-sourced by Anthropic",
            "Adopted by OpenAI / Google / Microsoft",
            "Late 2025 Governance moved to Linux Foundation AAIF · de facto standard",
          ].map((node, i, arr) => (
            <li key={node} className="flex items-start gap-3 sm:flex-1 sm:flex-col sm:gap-0">
              <span className="flex items-center gap-3 sm:w-full">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-c-tool shadow-[0_0_8px_var(--c-tool)]" />
                {i < arr.length - 1 && (
                  <span aria-hidden className="hidden h-px flex-1 bg-border-subtle sm:block" />
                )}
              </span>
              <span className="font-mono text-caption leading-relaxed text-text-tertiary sm:mt-2.5 sm:pr-6">
                {node}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>

      <KeyPointsEn
        items={[
          <>
            The protocol is bound to no model vendor: open-sourced by Anthropic, adopted by OpenAI,
            Google and Microsoft, with governance now under the Linux Foundation's Agentic AI
            Foundation (AAIF).
          </>,
          <>
            What the "USB-C port" analogy really means: just as USB-C unified hardware peripherals,
            MCP unifies how AI apps connect to external capabilities — write a Server once, and any
            compatible Client plugs in.
          </>,
        ]}
      />

      <SubHeading id="architecture" index="1.2" title="3-Layer Architecture: Host / Client / Server" color={SEMANTIC.tool} />

      <Figure
        src="/diagram-mcp-arch.svg"
        alt="MCP three-layer architecture diagram: a Host panel containing three Clients, connected via stdio and Streamable HTTP to three Servers below"
        caption="Three layers: Host (sessions & auth) → Client (1:1 protocol endpoint) → Server (exposes capabilities)"
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            name: "Host",
            color: SEMANTIC.perceive,
            desc: "The app the user faces: manages the LLM session and consent UI, creating one Client per Server.",
            eg: "Claude Desktop / Cursor / VS Code / your agent",
          },
          {
            name: "Client",
            color: SEMANTIC.plan,
            desc: "The protocol endpoint inside the Host holding a 1:1 connection to a specific Server: handshake, capability negotiation, JSON-RPC requests.",
            eg: "One Client per Server",
          },
          {
            name: "Server",
            color: SEMANTIC.tool,
            desc: "A lightweight process or service exposing tools, resources and prompts over a standardized interface; a local subprocess or a remote HTTP service.",
            eg: "filesystem / remote GitHub / your own tools",
          },
        ].map((role, i) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-border-subtle bg-bg-1 p-5 transition-colors duration-[250ms] hover:border-border-strong"
            style={{ borderTop: `2px solid ${role.color}` }}
          >
            <h4 className="text-h4 font-bold" style={{ color: role.color }}>
              {role.name}
            </h4>
            <p className="mt-2.5 text-body-sm text-text-secondary">{role.desc}</p>
            <p className="mt-3 font-mono text-caption text-text-tertiary">{role.eg}</p>
          </motion.div>
        ))}
      </div>

      <Reveal className="mt-8">
        <GreenQuote>
          A Server doesn't need to know which model it's talking to, and the model doesn't need to
          know how a Server is implemented — the protocol translates in between. All messages use
          JSON-RPC 2.0.
        </GreenQuote>
      </Reveal>

      <SubHeading id="primitives" index="1.3" title="The Three Primitives" color={SEMANTIC.tool} />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Wrench,
            name: "Tools",
            ctrl: "MODEL-CONTROLLED",
            color: SEMANTIC.tool,
            highlight: true,
            desc: "Executable functions: check weather, write files, send messages (side effects)",
            analogy: "≈ Function Calling's function",
          },
          {
            icon: Database,
            name: "Resources",
            ctrl: "APP/USER-CONTROLLED",
            color: SEMANTIC.perceive,
            highlight: false,
            desc: "Readable context data: file contents, DB records, API responses (read-only, like GET)",
            analogy: "≈ a mountable data source",
          },
          {
            icon: FileText,
            name: "Prompts",
            ctrl: "USER-TRIGGERED",
            color: SEMANTIC.plan,
            highlight: false,
            desc: "Predefined prompt templates / workflows the user can pick with one click",
            analogy: "≈ a reusable prompt template library",
          },
        ].map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
              "rounded-xl border bg-bg-1 p-5 transition-colors duration-[250ms]",
              p.highlight
                ? "border-c-tool/60 shadow-[0_0_24px_-6px_var(--c-tool)]"
                : "border-border-subtle hover:border-border-strong",
            )}
            style={p.highlight ? { background: semanticAlpha(SEMANTIC.tool, 5) } : undefined}
          >
            <p.icon size={20} style={{ color: p.color }} aria-hidden />
            <h4 className="mt-3 text-h4 font-bold text-text-primary">{p.name}</h4>
            <span
              className="mt-2 inline-block rounded-md border px-2 py-0.5 font-mono text-caption tracking-[0.12em]"
              style={{
                color: p.color,
                borderColor: semanticAlpha(p.color, 30),
                background: semanticAlpha(p.color, 10),
              }}
            >
              {p.ctrl}
            </span>
            <p className="mt-3 text-body-sm text-text-secondary">{p.desc}</p>
            <p className="mt-2.5 font-mono text-caption text-text-tertiary">{p.analogy}</p>
            {p.highlight && (
              <p className="mt-2 font-mono text-caption tracking-[0.12em] text-c-tool">MOST USED</p>
            )}
          </motion.div>
        ))}
      </div>

      <PrimitivesAccordionEn />

      <SubHeading id="transport" index="1.4" title="Transports" color={SEMANTIC.tool} />

      <Reveal>
        <p className="text-body text-text-secondary">The spec currently defines two standard transports:</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-1">
                {["Transport", "Scenario", "Notes"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-body-sm text-text-secondary">
              <tr className="border-b border-border-subtle align-top">
                <td className="px-5 py-4 font-mono font-semibold text-c-tool">stdio</td>
                <td className="whitespace-nowrap px-5 py-4">Local</td>
                <td className="px-5 py-4">
                  The Host launches the Server as a subprocess over standard I/O. Zero network
                  overhead, zero auth complexity — ideal for local tools (filesystem, git, databases).
                </td>
              </tr>
              <tr className="align-top">
                <td className="px-5 py-4 font-mono font-semibold text-c-perceive">Streamable HTTP</td>
                <td className="whitespace-nowrap px-5 py-4">Remote</td>
                <td className="px-5 py-4">
                  A single HTTP endpoint (POST for JSON-RPC, optional GET upgrade to an SSE stream),
                  session management (<code>Mcp-Session-Id</code> header), resumability, with OAuth
                  2.1 auth.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>

      <WarningPanel title="Version note (verified): " className="mt-6">
        the 2024-11-05 first spec used a two-endpoint{" "}
        <strong className="font-semibold text-text-primary">HTTP + SSE</strong> remote transport →
        the 2025-03-26 revision replaced it with{" "}
        <strong className="font-semibold text-text-primary">Streamable HTTP</strong> → the{" "}
        <strong className="font-semibold text-text-primary">2025-11-25 revision</strong> (current)
        officially marked legacy SSE as deprecated. The <code>sse</code> style in older tutorials
        is kept for backward compatibility only —{" "}
        <strong className="font-semibold text-c-plan">
          new projects should always use Streamable HTTP
        </strong>{" "}
        (<code>mcp.run(transport="streamable-http")</code>).
      </WarningPanel>
    </section>
  );
}

/* ---------- Chapter 2 · Hands-on ---------- */

function ChapterHandsOnEn() {
  return (
    <section aria-label="Chapter 2 Hands-on" className="mt-24">
      <ChapterHeading id="hands-on" index={2} title="Hands-on: A 30-Line MCP Server" color={SEMANTIC.tool} />

      <StepHeader n={1} title="Install the official Python SDK" />
      <CodeReveal>
        <CodeBlock code={CODE_INSTALL} language="bash" type="terminal" filename="terminal" />
      </CodeReveal>

      <StepHeader n={2} title="A minimal runnable Server (FastMCP high-level API)">
        The official SDK ships FastMCP — three decorators are all it takes to expose a tool, a
        resource and a prompt.
      </StepHeader>
      <WarningPanel title="Note: " className="mt-5">
        this FastMCP is the <code>mcp.server.fastmcp</code> module{" "}
        <strong className="font-semibold text-text-primary">built into the official </strong>
        <code>mcp</code>
        <strong className="font-semibold text-text-primary"> package</strong> —{" "}
        <strong className="font-semibold text-c-plan">not</strong> the third-party standalone{" "}
        <code>fastmcp</code> package.
      </WarningPanel>
      <CodeReveal>
        <CodeBlock code={CODE_SERVER} language="python" filename="server.py" />
      </CodeReveal>
      <Reveal>
        <p className="mt-3 text-center font-mono text-caption text-text-tertiary">
          Type hints + docstrings are auto-converted to JSON Schema by the SDK — that's the
          interface documentation the model "sees".
        </p>
      </Reveal>

      <StepHeader n={3} title="Local debugging: MCP Inspector">
        The SDK ships a debug UI to visually call your tools, resources and prompts in the browser.
      </StepHeader>
      <CodeReveal>
        <CodeBlock code={CODE_INSPECTOR} language="bash" type="terminal" filename="terminal" />
      </CodeReveal>

      <StepHeader n={4} title="Connect from Claude Desktop">
        Edit the config file:
      </StepHeader>
      <Reveal className="mt-4">
        <ul className="space-y-2 text-body-sm text-text-secondary">
          <li>
            <span className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">macOS</span>
            <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>
          </li>
          <li>
            <span className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">Windows</span>
            <code>%APPDATA%\Claude\claude_desktop_config.json</code>
          </li>
        </ul>
      </Reveal>
      <WarningPanel title="Heads-up: " className="mt-5">
        you must <strong className="font-semibold text-c-plan">fully quit and restart</strong>{" "}
        Claude Desktop for config changes to take effect.
      </WarningPanel>
      <CodeReveal>
        <Tabs defaultValue="stdio">
          <TabsList className="border border-panel-border bg-panel-2/60">
            <TabsTrigger value="stdio" className="font-mono text-xs data-[state=active]:bg-panel data-[state=active]:text-panel-text">
              stdio · local Server
            </TabsTrigger>
            <TabsTrigger value="remote" className="font-mono text-xs data-[state=active]:bg-panel data-[state=active]:text-panel-text">
              streamable-http · remote
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stdio">
            <CodeBlock code={CODE_CLAUDE_STDIO} language="json" filename="claude_desktop_config.json" maxLines={0} />
          </TabsContent>
          <TabsContent value="remote">
            <CodeBlock code={CODE_CLAUDE_REMOTE} language="json" filename="claude_desktop_config.json (remote Server)" maxLines={0} />
          </TabsContent>
        </Tabs>
      </CodeReveal>
      <AcceptCard label="ACCEPTANCE">
        After restarting Claude Desktop, a 🔨 tool icon in the chat box = connected.
      </AcceptCard>

      <StepHeader n={5} title="Connect from your own agent (official SDK client)" />
      <CodeReveal>
        <CodeBlock code={CODE_CLIENT} language="python" filename="client.py" maxLines={0} />
      </CodeReveal>
      <Reveal className="mt-6">
        <p className="text-body-lg text-text-secondary">
          Once you have the schema from <code>list_tools()</code>, translate it into any vendor's
          Function Calling format and feed it to the LLM, then execute the model's picks via{" "}
          <code>session.call_tool()</code> —{" "}
          <strong className="font-bold text-c-tool">MCP is not tied to any single model vendor</strong>.
        </p>
      </Reveal>
    </section>
  );
}

/* ---------- Chapter 3 · Function Calling vs MCP ---------- */

const VS_ROWS_EN = [
  {
    dim: "Scope",
    fc: "Single model, single app: function definitions are hard-coded in your code and sent with each request",
    mcp: "An open protocol across apps and models: Servers deploy independently, any compatible Client can connect",
  },
  {
    dim: "Discovery",
    fc: "Developers statically declare the available tool list in the prompt/request",
    mcp: "Runtime discovery: after connecting, the Client calls tools/list, resources/list, prompts/list — tools are hot-pluggable",
    bold: true,
  },
  {
    dim: "Reuse",
    fc: "Every app re-implements every integration (M×N)",
    mcp: "Write a Server once, reuse everywhere (M+N); or install ready-made community Servers",
  },
  {
    dim: "Ecosystem",
    fc: "Schemas differ slightly per vendor (OpenAI / Anthropic / Gemini formats are not interoperable)",
    mcp: "Unified JSON-RPC 2.0 message format, official multi-language SDKs, official Server marketplace/registry",
  },
  {
    dim: "Execution",
    fc: "Inside your application process",
    mcp: "A separate process (stdio subprocess) or service (remote HTTP), with a natural process/network isolation boundary",
  },
];

const UPGRADE_STEPS_EN = [
  { text: "Learn how a model expresses intent to call tools with Function Calling", to: "/en/principles#tools", external: true },
  { text: "Turn your functions into MCP Server tools", to: "#hands-on", external: false },
  { text: "Learn to use ready-made Servers (don't reinvent wheels)", to: "#ecosystem", external: false },
  { text: "Understand multi-Server orchestration and security governance", to: "#security", external: false },
];

function ChapterVsEn() {
  return (
    <section aria-label="Chapter 3 Function Calling vs MCP" className="mt-24">
      <ChapterHeading id="vs-function-calling" index={3} title="From Function Calling to MCP" color={SEMANTIC.tool} />

      <Reveal>
        <GradientStatement>
          Function Calling isn't obsolete — it's the model-layer primitive; MCP is the engineering
          protocol layer above it.
        </GradientStatement>
        <p className="mt-4 text-body text-text-secondary">
          The relationship: MCP standardizes tool discovery and invocation, which is ultimately
          translated back into each model's function-calling format.
        </p>
      </Reveal>

      <Reveal className="mt-8">
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-1">
                {["Dimension", "Function Calling", "MCP"].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      "px-5 py-3.5 font-mono text-caption uppercase tracking-[0.12em]",
                      i === 2 ? "text-c-tool" : "text-text-tertiary",
                    )}
                    style={i === 2 ? { background: semanticAlpha(SEMANTIC.tool, 5) } : undefined}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VS_ROWS_EN.map((row, i) => (
                <motion.tr
                  key={row.dim}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={cn(
                    "align-top text-body-sm text-text-secondary",
                    i < VS_ROWS_EN.length - 1 && "border-b border-border-subtle",
                    row.bold && "font-semibold",
                  )}
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-text-primary">{row.dim}</td>
                  <td className="px-5 py-4">{row.fc}</td>
                  <td className="px-5 py-4" style={{ background: semanticAlpha(SEMANTIC.tool, 5) }}>
                    {row.mcp}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <Reveal className="mt-10">
        <p className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          SUGGESTED UPGRADE PATH
        </p>
        <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {UPGRADE_STEPS_EN.map((s, i) => {
            const inner = (
              <>
                <span className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-c-tool/50 font-mono text-caption text-c-tool">
                    {i + 1}
                  </span>
                  <span className="text-body-sm text-text-secondary group-hover:text-text-primary">
                    {s.text}
                  </span>
                </span>
                {i < UPGRADE_STEPS_EN.length - 1 && (
                  <span aria-hidden className="mt-2 hidden text-c-tool lg:absolute lg:-right-3.5 lg:top-1/2 lg:mt-0 lg:block lg:-translate-y-1/2">
                    →
                  </span>
                )}
              </>
            );
            const cls =
              "group relative flex-1 rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors duration-[250ms] hover:border-c-tool/60";
            return (
              <motion.li
                key={s.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex-1"
              >
                {s.external ? (
                  <Link to={s.to} className={cn("block", cls)}>{inner}</Link>
                ) : (
                  <a href={s.to} className={cn("block", cls)}>{inner}</a>
                )}
              </motion.li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}

/* ---------- Chapter 4 · Ecosystem ---------- */

const OFFICIAL_SERVERS_EN = [
  { name: "filesystem", desc: "File read/write/search within restricted directories — the most-used local tool", hot: true },
  { name: "fetch", desc: "Fetch web pages and convert them to Markdown" },
  { name: "git", desc: "Read and operate Git repositories" },
  { name: "memory", desc: "Knowledge-graph-based persistent memory" },
  { name: "sequential-thinking", desc: "Structured step-by-step reasoning" },
  { name: "time", desc: "Time and timezone conversion" },
  { name: "everything", desc: "Full-featured demo/test Server" },
];

const FRAMEWORK_ROWS_EN = [
  {
    fw: "OpenAI Agents SDK",
    how: "Native built-in",
    api: "from agents.mcp import MCPServerStdio, MCPServerStreamableHttp, passed to Agent(mcp_servers=[...]); plus MCPServerSse (deprecated), MCPServerManager (multi-Server lifecycle), HostedMCPTool (hosted execution)",
  },
  {
    fw: "LangChain / LangGraph",
    how: "Official adapter package langchain-mcp-adapters",
    api: "MultiServerMCPClient({...}) + await client.get_tools(); tools are auto-converted to LangChain Tools and fed to create_agent",
  },
  {
    fw: "PydanticAI",
    how: "Native built-in",
    api: "MCPServerStdio(...) / MCPServerStreamableHTTP(url) passed as toolsets to the Agent; can also expose an Agent as an MCP Server in reverse",
  },
  {
    fw: "Claude (Desktop / Code)",
    how: "Protocol originator, native support",
    api: "claude_desktop_config.json / claude mcp add",
  },
  {
    fw: "VS Code / Cursor / Windsurf",
    how: "Editors with built-in MCP clients",
    api: "Same mcpServers JSON config shape as Claude Desktop",
  },
  {
    fw: "Spring AI (Java)",
    how: "Official starter",
    api: "spring-ai-starter-mcp-client/server",
  },
];

function ChapterEcosystemEn() {
  return (
    <section aria-label="Chapter 4 Ecosystem Map" className="mt-24">
      <ChapterHeading id="ecosystem" index={4} title="Ecosystem Map" color={SEMANTIC.tool} />
      <p className="-mt-4 font-mono text-caption text-text-tertiary">
        Verified as of writing; the ecosystem moves fast — check official repos before installing
      </p>

      <SubHeading id="official-servers" index="4.1" title="Official Reference Servers" color={SEMANTIC.tool} />

      <WarningPanel title="Major change: ">
        in 2025 the official <code>modelcontextprotocol/servers</code> repo was trimmed to{" "}
        <strong className="font-semibold text-text-primary">just 7 officially maintained reference Servers</strong>;
        GitHub, Slack, Postgres, Brave Search, Google Drive, Puppeteer and others moved to vendor
        maintenance (legacy versions archived to <code>servers-archived</code>).{" "}
        <strong className="font-semibold text-c-plan">
          Before installing a Server, check whether an official vendor edition exists — don't use
          the archived packages.
        </strong>
      </WarningPanel>

      <div className="mt-6 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {OFFICIAL_SERVERS_EN.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors duration-[250ms] hover:border-c-tool/60"
          >
            <p className="flex items-center justify-between gap-2 font-mono text-body-sm font-semibold text-c-tool">
              {s.name}
              {s.hot && <Badge color={SEMANTIC.tool}>MOST USED</Badge>}
            </p>
            <p className="mt-2 text-caption text-text-tertiary">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      <Reveal className="mt-6">
        <a
          href="https://api.githubcopilot.com/mcp/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-c-tool/40 bg-c-tool/5 px-5 py-4 transition-colors duration-[250ms] hover:border-c-tool"
        >
          <Globe size={17} className="shrink-0 text-c-tool" aria-hidden />
          <span className="text-body-sm text-text-secondary">
            <strong className="font-semibold text-text-primary">
              Vendor takeover example: the official GitHub remote MCP Server
            </strong>{" "}
            is hosted at <code>https://api.githubcopilot.com/mcp/</code>, replacing the unmaintained
            npm package <code>@modelcontextprotocol/server-github</code>; Postgres, Brave Search and
            others similarly moved to vendor-official editions.
          </span>
          <span className="flex items-center gap-2">
            <Badge color={SEMANTIC.perceive}>OAUTH / PAT</Badge>
            <ArrowUpRight size={15} className="text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-c-tool" />
          </span>
        </a>
      </Reveal>

      <SubHeading id="community" index="4.2" title="Community Picks" color={SEMANTIC.tool} />

      <div className="grid gap-3 sm:grid-cols-2">
        <ExternalLinkCard
          href="https://github.com/punkpeye/awesome-mcp-servers"
          title="awesome-mcp-servers"
          desc="The largest community directory (punkpeye/awesome-mcp-servers), indexing hundreds of Servers by category (databases, cloud platforms, browser automation, productivity…)"
        />
        <ExternalLinkCard
          href="https://modelcontextprotocol.io"
          title="MCP Registry"
          desc="The official registry for publishing and discovering Servers"
        />
      </div>

      <SubHeading id="framework-support" index="4.3" title="MCP Support in Major Frameworks" color={SEMANTIC.tool} />

      <Reveal>
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-1">
                {["Framework", "Integration", "Key API"].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FRAMEWORK_ROWS_EN.map((row, i) => (
                <motion.tr
                  key={row.fw}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={cn(
                    "align-top text-body-sm text-text-secondary",
                    i < FRAMEWORK_ROWS_EN.length - 1 && "border-b border-border-subtle",
                  )}
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-text-primary">{row.fw}</td>
                  <td className="px-5 py-4">{row.how}</td>
                  <td className="px-5 py-4 font-mono text-caption leading-relaxed text-c-perceive">{row.api}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Chapter 5 · Security ---------- */

const SECURITY_CARDS_EN = [
  {
    id: "01",
    icon: Bug,
    color: SEMANTIC.loop,
    title: "Tool Poisoning",
    body: "A malicious Server can embed hidden instructions in tool descriptions, tricking the model into leaking data or mis-calling other tools (first disclosed by Invariant Labs).",
    fix: "Install Servers only from trusted sources; audit tool descriptions with open-source scanners like mcp-scan before connecting; treat tool metadata as untrusted input.",
  },
  {
    id: "02",
    icon: MessagesSquare,
    color: SEMANTIC.loop,
    title: "Indirect Prompt Injection",
    body: "Content returned by tools (web pages, emails, issues) may carry malicious instructions.",
    fix: "Isolate untrusted content; don't let retrieved results directly drive high-risk tool calls.",
  },
  {
    id: "03",
    icon: Lock,
    color: SEMANTIC.plan,
    title: "Least Privilege",
    body: "Mount only the necessary subdirectories for filesystem; use read-only database accounts; split read/write tools; filter with framework-level tool allowlists (e.g. OpenAI Agents SDK's tool_filter=create_static_tool_filter(allowed_tool_names=[...])).",
  },
  {
    id: "04",
    icon: UserCheck,
    color: SEMANTIC.plan,
    title: "Human-in-the-loop",
    body: "Disable auto-approval for write/delete tools and require human confirmation (OpenAI Agents SDK supports require_approval policies).",
    stat: "Attack success 80%+ with auto-approval → < 5% with human confirmation",
  },
  {
    id: "05",
    icon: KeyRound,
    color: SEMANTIC.perceive,
    title: "Remote MCP Authentication",
    body: "Streamable HTTP transports must enforce auth — the spec recommends OAuth 2.1 + PKCE; never allow token passthrough; validate token audience; never expose a local stdio Server to the network.",
  },
  {
    id: "06",
    icon: Globe,
    color: SEMANTIC.perceive,
    title: "Session & Transport Security",
    body: "Validate the Origin header against DNS rebinding; bind to 127.0.0.1; manage Mcp-Session-Id carefully; always use HTTPS for remote Servers.",
  },
  {
    id: "07",
    icon: ShieldAlert,
    color: SEMANTIC.loop,
    title: "Tool Shadowing",
    body: "With multiple Servers, use fully qualified names (server prefix) to avoid same-name tool conflicts; fail closed when identity can't be verified.",
  },
];

function ChapterSecurityEn() {
  return (
    <section aria-label="Chapter 5 Security and Engineering" className="mt-24">
      <ChapterHeading id="security" index={5} title="Security & Engineering" color={SEMANTIC.tool} />
      <Reveal>
        <p className="-mt-4 text-body-lg text-text-secondary">
          MCP gives models <strong className="font-bold text-text-primary">real execution power</strong>{" "}
          — security must come first.
        </p>
      </Reveal>

      <ol className="mt-10 space-y-4">
        {SECURITY_CARDS_EN.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-border-subtle bg-bg-1 p-5 transition-colors duration-[250ms] hover:border-border-strong"
            style={{ borderLeft: `3px solid ${c.color}` }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                className="rounded-md border px-2 py-0.5 font-mono text-caption tracking-[0.12em]"
                style={{
                  color: c.color,
                  borderColor: semanticAlpha(c.color, 30),
                  background: semanticAlpha(c.color, 10),
                }}
              >
                SEC {c.id}
              </motion.span>
              <c.icon size={17} style={{ color: c.color }} aria-hidden />
              <h4 className="text-h4 font-bold text-text-primary">{c.title}</h4>
            </div>
            <p className="mt-3 text-body-sm text-text-secondary">{c.body}</p>
            {c.stat && (
              <p
                className="mt-3 bg-clip-text text-h4 font-black text-transparent"
                style={{ backgroundImage: "linear-gradient(120deg, var(--c-loop), var(--c-tool))" }}
              >
                {c.stat}
              </p>
            )}
            {c.fix && (
              <p className="mt-3 text-body-sm">
                <strong className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-c-tool">FIX</strong>
                <span className="text-text-secondary">{c.fix}</span>
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- Chapter 6 · References & Recap ---------- */

const REFERENCES_EN: { title: string; url: string; note?: string }[] = [
  { title: "Official docs site (architecture, concepts, Quickstart)", url: "https://modelcontextprotocol.io" },
  {
    title: "Protocol spec (2025-11-25 latest revision & changelog)",
    url: "https://modelcontextprotocol.io/specification/2025-11-25",
    note: "Versioning: https://modelcontextprotocol.io/specification/versioning",
  },
  { title: "Main protocol repo", url: "https://github.com/modelcontextprotocol/modelcontextprotocol" },
  {
    title: "Official reference Servers (archived legacy implementations live in servers-archived)",
    url: "https://github.com/modelcontextprotocol/servers",
  },
  { title: "Python SDK (with FastMCP)", url: "https://github.com/modelcontextprotocol/python-sdk" },
  { title: "TypeScript SDK", url: "https://github.com/modelcontextprotocol/typescript-sdk" },
  { title: "Community pick: awesome-mcp-servers", url: "https://github.com/punkpeye/awesome-mcp-servers" },
  {
    title: "Official GitHub remote MCP Server (docs: GitHub Docs “GitHub MCP Server”)",
    url: "https://api.githubcopilot.com/mcp/",
  },
  {
    title: "LangChain adapter langchain-mcp-adapters",
    url: "https://github.com/langchain-ai/langchain-mcp-adapters",
    note: "Docs: https://docs.langchain.com/oss/python/langchain/mcp",
  },
  {
    title: "OpenAI Agents SDK MCP docs",
    url: "https://openai.github.io/openai-agents-python/mcp/",
  },
  {
    title: "Security research: Invariant Labs' Tool Poisoning Attacks + the mcp-scan scanner",
    url: "https://github.com/invariantlabs-ai/mcp-scan",
  },
];

const RECAP_EN = [
  "MCP is the universal socket for AI capabilities, collapsing an M×N integration explosion into M+N;",
  "Three-layer architecture: Host (sessions & auth) → Client (1:1 protocol endpoint) → Server (exposing Tools/Resources/Prompts);",
  "Two transports: local stdio and remote Streamable HTTP (legacy SSE is deprecated);",
  "Build Servers with the official Python SDK's mcp.server.fastmcp.FastMCP — three decorators (@mcp.tool() / @mcp.resource() / @mcp.prompt()) and you're done;",
  "The ecosystem is mature: official reference Servers + vendor-official editions + awesome-mcp-servers, with native support in OpenAI Agents SDK / LangChain / PydanticAI;",
  "Security first: defend against tool poisoning, apply least privilege, always authenticate remote Servers, and require human confirmation for writes.",
];

function ChapterReferencesEn() {
  return (
    <section aria-label="Chapter 6 References and Recap" className="mt-24">
      <ChapterHeading id="references" index={6} title="References & Recap" color={SEMANTIC.tool} />

      <ol className="space-y-3">
        {REFERENCES_EN.map((r, i) => (
          <motion.li
            key={r.url}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="flex items-baseline gap-3"
          >
            <span className="shrink-0 font-mono text-caption text-c-tool">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-body-sm text-text-secondary">
              {r.title}:{" "}
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-mono text-caption text-c-perceive hover:underline"
              >
                {r.url}
                <ArrowUpRight size={12} className="ml-0.5 inline" aria-hidden />
              </a>
              {r.note && <span className="mt-1 block font-mono text-caption text-text-tertiary">{r.note}</span>}
            </span>
          </motion.li>
        ))}
      </ol>

      <Reveal className="mt-12">
        <div
          className="rounded-2xl p-[1.5px]"
          style={{
            background: "linear-gradient(135deg, var(--c-tool), var(--c-perceive))",
            boxShadow: "0 0 32px -8px color-mix(in srgb, var(--c-tool) 35%, transparent)",
          }}
        >
          <div className="rounded-2xl bg-bg-1 px-7 py-7">
            <p className="font-mono text-caption uppercase tracking-[0.12em] text-c-tool">RECAP</p>
            <h3 className="mt-2 text-h3 font-bold text-text-primary">MCP in Six Sentences</h3>
            <ul className="mt-5 space-y-3">
              {RECAP_EN.map((line) => (
                <li key={line} className="flex gap-3 text-body-sm text-text-secondary">
                  <span aria-hidden className="mt-0.5 shrink-0 font-mono text-c-tool">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Chapter nav ---------- */

function ChapterNavEn() {
  return (
    <nav aria-label="Chapter navigation" className="mt-24 grid gap-4 lg:grid-cols-3">
      <Link
        to="/en/principles#tools"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <ArrowLeft size={14} className="transition-transform duration-[250ms] group-hover:-translate-x-1" />
          PREREQUISITE
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">← Principles §4 Tool Use</span>
        <span className="mt-1 block text-body-sm text-text-secondary">Function Calling is the foundation of MCP</span>
      </Link>
      <Link
        to="/en/sandbox"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-c-tool">
          NEXT
          <ArrowRight size={14} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">Watch an Agent Call Tools in the Sandbox →</span>
        <span className="mt-1 block text-body-sm text-text-secondary">A live tool-calling replay in your browser</span>
      </Link>
      <Link
        to="/en/capstone"
        className="group rounded-2xl border border-c-plan/40 bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-c-plan/70"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-c-plan">
          ADVANCED CHALLENGE
          <ArrowRight size={14} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">Capstone: Port the Research Assistant's Tools to MCP →</span>
        <span className="mt-1 block text-body-sm text-text-secondary">Turn the capstone tools into an MCP Server</span>
      </Link>
    </nav>
  );
}

/* ---------- Page ---------- */

/** MCP topic page, English edition (/en/mcp) */
export default function McpEn() {
  const active = useActiveSection();

  return (
    <div className="min-h-[100dvh]">
      <PageHeader />

      <div className="mx-auto max-w-content px-6 pb-24">
        <div className="xl:flex xl:gap-14">
          <DesktopToc active={active} />

          <div className="min-w-0 max-w-prose2 flex-1">
            <MobileToc active={active} />
            <ChapterOverviewEn />
            <ChapterHandsOnEn />
            <ChapterVsEn />
            <ChapterEcosystemEn />
            <ChapterSecurityEn />
            <ChapterReferencesEn />
            <ChapterNavEn />
          </div>
        </div>
      </div>
    </div>
  );
}
