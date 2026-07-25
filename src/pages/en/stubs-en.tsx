import { Link } from "react-router";
import { ArrowLeft, Hammer } from "lucide-react";
import type { ReactNode } from "react";

/**
 * English route stubs（v2-design.md §2.1 路由表）。
 * /en 分支的各页英文版正在翻译制作中，先以统一的精致页面承接路由与导航，
 * 页面代理后续逐个替换为完整英文实现。术语遵循 v2-design.md §2.2 术语表。
 */

function EnStub({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: ReactNode;
  desc: string;
}) {
  return (
    <section className="mx-auto flex min-h-[62dvh] max-w-content flex-col items-center justify-center px-6 py-24 text-center">
      <p className="inline-flex items-center gap-2 rounded-md border border-c-perceive/30 bg-c-perceive/10 px-2.5 py-1 font-mono text-xs uppercase tracking-[0.12em] text-c-perceive">
        <Hammer size={13} aria-hidden />
        {eyebrow}
      </p>
      <h1 className="mt-6 max-w-3xl text-h1 font-bold text-text-primary">{title}</h1>
      <p className="mt-5 max-w-xl text-body-lg text-text-secondary">{desc}</p>
      <p className="mt-3 font-mono text-caption text-text-tertiary">
        $ i18n.status("en") → translating · zh version is complete
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/en"
          className="btn-outline-grad inline-flex items-center gap-2 px-6 py-2.5 text-[15px] font-medium text-text-primary"
        >
          <ArrowLeft size={15} aria-hidden />
          Back to English Home
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 text-[15px] text-text-secondary transition-colors hover:text-c-perceive"
        >
          查看中文版 →
        </Link>
      </div>
    </section>
  );
}

export function HomeEn() {
  return (
    <EnStub
      eyebrow="Agent Academy · EN"
      title={
        <>
          Learn <span className="font-display text-grad">AI Agents</span> from
          first principles to a shipped project
        </>
      }
      desc="The English edition of Agent Academy is being translated page by page. The full Chinese edition is live — every fact, code sample and source link is identical across languages."
    />
  );
}

export function PathEn() {
  return (
    <EnStub
      eyebrow="Learning Path · EN"
      title="Five stages, 10–15 weeks, one complete learning cycle"
      desc="The English version of the five-stage roadmap — from LLM fundamentals to an independently delivered agent project — is on its way."
    />
  );
}

export function PrinciplesEn() {
  return (
    <EnStub
      eyebrow="Principles · EN"
      title="ReAct, memory, planning — how agents actually work"
      desc="Six chapters of plain-language explanations, key takeaways and pseudocode are being translated into English."
    />
  );
}

/** 框架横评英文版已完整实现（11 框架 + MAF 卡片），从独立文件 re-export 以保持 App.tsx 导入路径不变 */
export { default as FrameworksEn } from "./FrameworksEn";

export function McpEn() {
  return (
    <EnStub
      eyebrow="MCP Deep Dive · EN"
      title="The Model Context Protocol, end to end"
      desc="Architecture, a 30-line FastMCP build, Function Calling comparison and security notes — the English edition is in progress."
    />
  );
}

export function CapstoneEn() {
  return (
    <EnStub
      eyebrow="Capstone Project · EN"
      title="Build a Personal Research Assistant, step by step"
      desc="Eight steps of fully runnable code with the OpenAI Agents SDK — the English edition is in progress."
    />
  );
}

export function SandboxEn() {
  return (
    <EnStub
      eyebrow="Sandbox · EN"
      title="Watch a research agent run, right in your browser"
      desc="A fully front-end simulated replay of planning, searching, reading and writing — the English edition is in progress."
    />
  );
}

export function ResourcesEn() {
  return (
    <EnStub
      eyebrow="Resources · EN"
      title="Courses, papers and awesome lists, curated"
      desc="A verifiable collection of courses, papers, blogs and repositories — the English edition is in progress."
    />
  );
}
