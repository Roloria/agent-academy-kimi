import { useEffect, useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMANTIC } from "@/lib/semantic";
import { Badge } from "@/components/ui-extra";
import ChapterWhatIsAgent from "./chapter1";
import ChapterReasoning from "./chapter2";
import ChapterMemory from "./chapter3";
import ChapterTools from "./chapter4";
import ChapterMultiAgent from "./chapter5";
import ChapterReferences from "./chapter6";

/** 目录条目（design/principles.md §S2） */
interface TocItem {
  id: string;
  num: string;
  label: string;
  children?: { id: string; num: string; label: string }[];
}

const TOC: TocItem[] = [
  { id: "what-is-agent", num: "01", label: "什么是 AI Agent" },
  {
    id: "reasoning",
    num: "02",
    label: "核心推理范式",
    children: [
      { id: "react", num: "2.1", label: "ReAct" },
      { id: "plan-and-execute", num: "2.2", label: "Plan-and-Execute" },
      { id: "reflexion", num: "2.3", label: "Reflexion" },
      { id: "cot", num: "2.4", label: "思维链 CoT" },
    ],
  },
  { id: "memory", num: "03", label: "记忆系统" },
  { id: "tools", num: "04", label: "工具使用：Function Calling 与 MCP" },
  { id: "multi-agent", num: "05", label: "多智能体系统" },
  { id: "references", num: "06", label: "参考来源" },
];

const ALL_IDS = TOC.flatMap((t) => [t.id, ...(t.children?.map((c) => c.id) ?? [])]);

/** IntersectionObserver 滚动高亮：取视口顶部附近命中的小节 */
function useActiveSection(): string {
  const [active, setActive] = useState<string>(ALL_IDS[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // 顶部吸附线约在 Navbar（64px）之下，底部留 70% 视口
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

/** 桌面 TOC：240px sticky（≥1280px 显示） */
function DesktopToc({ active }: { active: string }) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-24 hidden w-60 shrink-0 self-start xl:block"
      aria-label="目录"
    >
      <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
        目录
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
        <p className="text-body-sm font-medium text-text-primary">学完这章 →</p>
        <Link
          to="/path#stage-2"
          className="mt-1.5 block text-body-sm text-c-perceive hover:underline"
        >
          去手写 50 行裸 Agent（学习路径 · 阶段 2）
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
          <ListOrdered size={15} className="text-c-plan" />
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

/** 页头标题：word-level stagger 进场 */
const TITLE_WORDS: { text: string; grad?: boolean }[] = [
  { text: "拆开" },
  { text: "Agent" },
  { text: "的" },
  { text: "黑盒", grad: true },
];

function PageHeader() {
  return (
    <header className="bg-grid-texture relative overflow-hidden">
      {/* 琥珀色光晕（本页章节主色 = 规划琥珀） */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 h-[480px] w-[760px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(251,191,36,0.08), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-content px-6 pb-16 pt-40">
        <nav aria-label="面包屑" className="mb-6 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <Link to="/" className="transition-colors hover:text-c-perceive">
            HOME
          </Link>
          <span className="mx-2">/</span>
          <span className="text-text-secondary">原理知识库</span>
        </nav>

        <Badge color={SEMANTIC.plan}>6 章 · 教学级 · 可验证</Badge>

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
          如果说大语言模型是一个"只会说话的大脑"，这一章我们给这个大脑装上眼睛、手脚和笔记本——逐个讲清感知、规划、记忆、工具与行动循环，以及
          ReAct、Reflexion、MCP、多智能体这些你迟早会遇到的核心概念。
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 font-mono text-caption text-text-tertiary"
        >
          约 3500 字 · 阅读 20 分钟 · 配套论文 6 篇 · 最后更新 2026 年中
        </motion.p>
      </div>
    </header>
  );
}

/** 章末导航（S9） */
function ChapterNav() {
  return (
    <nav aria-label="章末导航" className="mt-24 grid gap-4 sm:grid-cols-2">
      <Link
        to="/path"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <ArrowLeft size={14} className="transition-transform duration-[250ms] group-hover:-translate-x-1" />
          上一站
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">学习路径</span>
        <span className="mt-1 block text-body-sm text-text-secondary">
          回到五阶段路线图，按节奏推进
        </span>
      </Link>
      <Link
        to="/frameworks"
        className="group rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
      >
        <span className="flex items-center justify-end gap-2 font-mono text-caption uppercase tracking-[0.12em] text-c-perceive">
          下一站
          <ArrowRight size={14} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
        </span>
        <span className="mt-2 block text-h4 font-bold text-text-primary">框架横评 →</span>
        <span className="mt-1 block text-body-sm text-text-secondary">
          理解了原理，该选兵器了
        </span>
      </Link>
    </nav>
  );
}

/** 原理知识库页（/principles）：左 TOC + 右长文双栏教科书式页面 */
export default function PrinciplesPage() {
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
