import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  FlaskConical,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { Badge } from "@/components/ui-extra";
import ChapterOverview from "./chapter-overview";
import ChapterHandsOn from "./chapter-hands-on";
import { ChapterVs, ChapterEcosystem, ChapterSecurity, ChapterReferences } from "./chapters-rest";

/**
 * /mcp —— MCP 专题页（design/v2/mcp.md）。
 * 左 TOC + 右长文双栏文档页（同原理页模式），章节主色 = 工具绿。
 */

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
    label: "MCP 全景回顾",
    children: [
      { id: "why", num: "1.1", label: "为什么是 MCP" },
      { id: "architecture", num: "1.2", label: "三层架构" },
      { id: "primitives", num: "1.3", label: "三大原语" },
      { id: "transport", num: "1.4", label: "传输方式" },
    ],
  },
  { id: "hands-on", num: "02", label: "动手实战：30 行写一个 Server" },
  { id: "vs-function-calling", num: "03", label: "Function Calling vs MCP" },
  {
    id: "ecosystem",
    num: "04",
    label: "生态图谱",
    children: [
      { id: "official-servers", num: "4.1", label: "官方参考 Server" },
      { id: "community", num: "4.2", label: "社区精选" },
      { id: "framework-support", num: "4.3", label: "框架的 MCP 支持" },
    ],
  },
  { id: "security", num: "05", label: "安全与工程注意" },
  { id: "references", num: "06", label: "参考来源与小结" },
];

const ALL_IDS = TOC.flatMap((t) => [t.id, ...(t.children?.map((c) => c.id) ?? [])]);

/** IntersectionObserver 滚动高亮（同原理页） */
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

/** 桌面 TOC：240px sticky（≥1280px 显示），当前项左侧 2px 绿竖条 */
function DesktopToc({ active }: { active: string }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-24 hidden w-60 shrink-0 self-start xl:block"
      aria-label="目录"
    >
      <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">目录</p>
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
        <p className="text-body-sm font-medium text-text-primary">学完这个 →</p>
        <Link to="/sandbox" className="mt-1.5 block text-body-sm text-c-tool hover:underline">
          去沙盒看 Agent 如何调工具 →
        </Link>
      </div>
    </motion.aside>
  );
}

/** 移动端 TOC：顶部「目录 ▾」折叠抽屉 */
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
          目录
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

/** 页头标题：word stagger（“标准插座”青绿渐变） */
const TITLE_WORDS: { text: string; grad?: boolean }[] = [
  { text: "MCP：" },
  { text: "AI" },
  { text: "能力的" },
  { text: "标准插座", grad: true },
];

const HEADER_BADGES = [
  { label: "协议专题", color: SEMANTIC.tool },
  { label: "ANTHROPIC 2024.11 开源", color: SEMANTIC.tool },
  { label: "2025.11-25 规范", color: SEMANTIC.perceive },
  { label: "Linux 基金会 AAIF", color: SEMANTIC.memory },
];

function PageHeader() {
  return (
    <header className="bg-grid-texture relative overflow-hidden">
      {/* 绿色光晕（本页章节主色 = 工具绿） */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${semanticAlpha(SEMANTIC.tool, 8)}, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-content px-6 pb-16 pt-40">
        <nav
          aria-label="面包屑"
          className="mb-6 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary"
        >
          <Link to="/" className="transition-colors hover:text-c-perceive">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">MCP 专题</span>
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
          Model Context Protocol 让任何 AI 应用即插即用地接入任何外部工具与数据源——就像 USB-C
          之于硬件、LSP 之于编辑器。本专题从架构心智、动手实战、生态现状到安全治理，一次讲透。
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 font-mono text-caption text-text-tertiary"
        >
          约 4000 字 · 阅读 25 分钟 · 含 4 段可运行代码 · 前置知识：Function Calling（原理知识库 §4）
        </motion.p>

        {/* 前置导流小卡：琥珀描边细横条 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-c-plan/50 bg-c-plan/5 px-5 py-3.5"
        >
          <FlaskConical size={16} className="shrink-0 text-c-plan" aria-hidden />
          <p className="text-body-sm text-text-secondary">
            还没学过 Function Calling？先读 →{" "}
            <Link to="/principles#tools" className="font-medium text-c-plan hover:underline">
              原理知识库 §4 工具使用
            </Link>
          </p>
        </motion.div>
      </div>
    </header>
  );
}

/** 章末导航（S9）：三张宽卡 */
function ChapterNav() {
  return (
    <nav aria-label="章末导航" className="mt-24 grid gap-4 lg:grid-cols-3">
      <Link
        to="/principles#tools"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <ArrowLeft size={14} className="transition-transform duration-[250ms] group-hover:-translate-x-1" />
          前置回顾
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">原理知识库 §4 工具使用</span>
        <span className="mt-1 block text-body-sm text-text-secondary">Function Calling 是 MCP 的底座</span>
      </Link>
      <Link
        to="/sandbox"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-c-tool">
          下一站
          <ArrowRight size={14} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">沙盒看 Agent 调工具 →</span>
        <span className="mt-1 block text-body-sm text-text-secondary">在浏览器里看工具调用实时回放</span>
      </Link>
      <Link
        to="/capstone"
        className="group rounded-2xl border border-c-plan/40 bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-c-plan/70"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-c-plan">
          进阶挑战
          <ArrowRight size={14} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">实战：改造工具为 MCP Server →</span>
        <span className="mt-1 block text-body-sm text-text-secondary">把研究助理的工具改造成 MCP Server</span>
      </Link>
    </nav>
  );
}

/** MCP 专题页（/mcp）：左 TOC + 右长文双栏教科书式页面 */
export default function McpPage() {
  const active = useActiveSection();

  return (
    <div className="min-h-[100dvh]">
      <PageHeader />

      <div className="mx-auto max-w-content px-6 pb-24">
        <div className="xl:flex xl:gap-14">
          <DesktopToc active={active} />

          {/* 正文列：长文阅读 max-width 880px */}
          <div className="min-w-0 max-w-prose2 flex-1">
            <MobileToc active={active} />
            <ChapterOverview />
            <ChapterHandsOn />
            <ChapterVs />
            <ChapterEcosystem />
            <ChapterSecurity />
            <ChapterReferences />
            <ChapterNav />
          </div>
        </div>
      </div>
    </div>
  );
}
