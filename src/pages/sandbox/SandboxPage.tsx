import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Download,
  FileText,
  Loader2,
  TerminalSquare,
  Zap,
} from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { Badge, Card, Reveal } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import type { Locale, Report, ReportLine, SandboxCopy, TopicTemplate } from "./copy";
import { buildReport, getCopy, slugify, templateFor } from "./copy";
import "./sandbox.css";

/* ================================ 类型与常量 ================================ */

type PhaseKey = "input" | "plan" | "search" | "read" | "write";
type Status = "idle" | "running" | "done";

const PHASE_ORDER: PhaseKey[] = ["input", "plan", "search", "read", "write"];
const TOTAL_STEPS = 11;

/** 面板内阶段色（sandbox.css 定义的主题不变变量） */
const PHASE_COLOR: Record<PhaseKey, string> = {
  input: "var(--ph-input)",
  plan: "var(--ph-plan)",
  search: "var(--ph-search)",
  read: "var(--ph-read)",
  write: "var(--ph-write)",
};

interface ActionData {
  tool: string;
  /** 行内 JSON 参数（终端回显 + 工具卡展示） */
  args: string;
  observation?: string;
  /** 逐条出现的列表（子问题 / 搜索结果） */
  list?: string[];
  listLabel?: string;
  /** 搜索结果 Observation 顶部追加「(模拟结果)」标注（验收清单 #5） */
  simulated?: boolean;
}

interface Entry {
  id: number;
  kind: "user" | "thought" | "action" | "divider" | "done";
  phase?: PhaseKey;
  text?: string;
  label?: string;
  actions?: ActionData[];
  file?: string;
}

interface ActionProg {
  status: "running" | "done";
  obs: number;
  list: number;
  dur: string;
}

interface EntryProg {
  typed: number;
  actions: ActionProg[];
}

interface TermLine {
  kind: "cmd" | "ok" | "note";
  text: string;
}

interface ReportView {
  unit: number; // 当前正在打字的单元；-1 = 未开始
  typed: number; // 当前单元已打字字符数
  done: boolean;
}

/** 逐字节流：中文 28ms/字、英文/数字 16ms/字符（§3.2），每 tick 的时间预算 */
const TICK_MS = 28;
function charCost(ch: string): number {
  return ch.charCodeAt(0) > 0x2e7f ? 28 : 16;
}

/* ================================ 微组件 ================================ */

function MacDots() {
  return (
    <span className="flex shrink-0 items-center gap-1.5" aria-hidden>
      {/* macOS 三圆点：与 CodeBlock 一致的固定面板 chrome 色 */}
      <i className="h-3 w-3 rounded-full" style={{ background: "#FF5F57" }} />
      <i className="h-3 w-3 rounded-full" style={{ background: "#FEBC2E" }} />
      <i className="h-3 w-3 rounded-full" style={{ background: "#28C840" }} />
    </span>
  );
}

/** 打字光标（该条打完后由父组件移除） */
function Caret() {
  return <span className="sb-caret" aria-hidden />;
}

/** 五段阶段指示器：输入 → 规划 → 搜索 → 阅读 → 写作（§2.1） */
function PhaseIndicator({
  copy,
  phase,
  done,
}: {
  copy: SandboxCopy;
  phase: PhaseKey;
  done: boolean;
}) {
  const current = PHASE_ORDER.indexOf(phase);
  return (
    <div className="flex min-w-0 items-center" role="presentation">
      {PHASE_ORDER.map((p, i) => {
        const color = PHASE_COLOR[p];
        const isDone = done || i < current;
        const isCurrent = !done && i === current;
        return (
          <div key={p} className="flex min-w-0 items-center">
            {i > 0 && (
              <span className="relative mx-1.5 h-px w-4 overflow-hidden bg-panel-border sm:w-6">
                <span
                  className="absolute inset-0 origin-left transition-transform duration-500"
                  style={{
                    background: PHASE_COLOR[PHASE_ORDER[i - 1]],
                    transform: `scaleX(${isDone || isCurrent ? 1 : 0})`,
                  }}
                />
              </span>
            )}
            <span className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-[18px] w-[18px] items-center justify-center rounded-full border text-[10px] transition-all duration-300",
                )}
                style={{
                  borderColor: isDone || isCurrent ? color : "var(--panel-border)",
                  background: isDone || isCurrent ? color : "transparent",
                  color: isDone || isCurrent ? "var(--panel-bg)" : "var(--panel-text-3)",
                  boxShadow: isCurrent ? `0 0 10px ${semanticAlpha(color, 60)}` : undefined,
                }}
              >
                {isDone ? <Check size={11} strokeWidth={3} /> : i + 1}
              </span>
              <span
                className="hidden font-mono text-[9px] uppercase tracking-wider xl:block"
                style={{ color: isCurrent ? color : "var(--panel-text-3)" }}
              >
                {copy.phases[i]}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** 用户消息气泡：右对齐青色描边（§2.2-1） */
function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[85%] rounded-2xl rounded-br-sm border px-4 py-2.5 text-body-sm text-panel-text"
        style={{
          borderColor: semanticAlpha("var(--ph-read)", 45),
          background: semanticAlpha("var(--ph-read)", 10),
        }}
      >
        {text}
      </div>
    </div>
  );
}

/** Thought 条目：琥珀竖条 + ⚡ + 打字机正文（§2.2-2） */
function ThoughtCard({ text, typed }: { text: string; typed: number }) {
  const done = typed >= text.length;
  return (
    <div
      className="rounded-r-xl border-l-2 py-1 pl-3 pr-2"
      style={{ borderColor: "var(--ph-plan)" }}
    >
      <p
        className="mb-1 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
        style={{ color: "var(--ph-plan)" }}
      >
        <Zap size={12} aria-hidden /> Thought
      </p>
      <p className="text-body-sm leading-relaxed text-panel-text">
        {text.slice(0, typed)}
        {!done && <Caret />}
      </p>
    </div>
  );
}

/** Action 工具卡片：running spinner → ✓ + 耗时徽章；Observation 打字机（§2.2-3） */
function ActionCard({
  action,
  prog,
  copy,
}: {
  action: ActionData;
  prog: ActionProg | undefined;
  copy: SandboxCopy;
}) {
  const status = prog?.status ?? "running";
  const obsTyped = prog?.obs ?? 0;
  const listShown = prog?.list ?? 0;
  const obsDone = action.observation ? obsTyped >= action.observation.length : true;
  return (
    <div className="overflow-hidden rounded-xl border border-panel-border bg-panel-2/70">
      {/* 顶行：▶ ACTION + 工具名 + 状态 */}
      <div className="flex items-center gap-2 border-b border-panel-border/70 px-3.5 py-2">
        <span
          className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--ph-search)" }}
        >
          ▶ Action
        </span>
        <span className="font-mono text-[13px] font-bold text-panel-text">
          {action.tool}
        </span>
        <span className="ml-auto flex items-center gap-2">
          {status === "running" ? (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-panel-text-2">
              <Loader2 size={12} className="sb-spinner" aria-hidden />
              {copy.running}
            </span>
          ) : (
            <>
              <Check size={13} style={{ color: "var(--ph-search)" }} aria-hidden />
              <span
                className="rounded border px-1.5 py-px font-mono text-[10px]"
                style={{
                  color: "var(--ph-search)",
                  borderColor: semanticAlpha("var(--ph-search)", 40),
                  background: semanticAlpha("var(--ph-search)", 10),
                }}
              >
                {prog?.dur}
              </span>
            </>
          )}
        </span>
      </div>
      {/* 输入参数 JSON：键青值绿 */}
      <div className="px-3.5 py-2.5 font-mono text-[12.5px] leading-relaxed">
        <JsonInline code={action.args} />
      </div>
      {/* Observation */}
      {status === "done" && (action.observation || action.list) && (
        <div className="border-t border-panel-border/70 px-3.5 py-2.5">
          <p
            className="mb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: "var(--ph-read)" }}
          >
            Observation
            {action.simulated && (
              <span className="ml-2 font-normal normal-case tracking-normal text-panel-text-3">
                {copy.simulatedNote}
              </span>
            )}
          </p>
          {action.listLabel && (
            <p className="mb-1 text-caption text-panel-text-2">{action.listLabel}</p>
          )}
          {action.list && (
            <ul className="space-y-1">
              {action.list.slice(0, listShown).map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex gap-2 text-body-sm text-panel-text"
                >
                  <span className="shrink-0 font-mono text-caption text-panel-text-3">
                    {i + 1}.
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
          )}
          {action.observation && (
            <p className="text-body-sm text-panel-text-2">
              {action.observation.slice(0, obsTyped)}
              {!obsDone && <Caret />}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** 行内 JSON 着色：键青色、字符串值绿色、数字橙色（§2.2-3） */
function JsonInline({ code }: { code: string }) {
  const parts = code.split(/("(?:[^"\\]|\\.)*"\s*:)|("(?:[^"\\]|\\.)*")|(\b\d+\b)/g);
  return (
    <span className="whitespace-pre-wrap break-all text-panel-text-2">
      {parts.map((p, i) => {
        if (!p) return null;
        if (/^".*"\s*:$/.test(p))
          return (
            <span key={i} style={{ color: "var(--ph-read)" }}>
              {p}
            </span>
          );
        if (/^".*"$/.test(p))
          return (
            <span key={i} style={{ color: "var(--syn-string)" }}>
              {p}
            </span>
          );
        if (/^\d+$/.test(p))
          return (
            <span key={i} style={{ color: "var(--syn-num)" }}>
              {p}
            </span>
          );
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

/** 阶段分隔线：细线 + 居中小徽章（§2.2-4） */
function PhaseDivider({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 py-1" role="presentation">
      <span className="h-px flex-1 bg-panel-border/80" />
      <span
        className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{
          color,
          borderColor: semanticAlpha(color, 40),
          background: semanticAlpha(color, 8),
        }}
      >
        {label}
      </span>
      <span className="h-px flex-1 bg-panel-border/80" />
    </div>
  );
}

/** 完成卡：绿色渐变描边 + 双 CTA（§3.1 #11） */
function DoneCard({
  copy,
  file,
  onDownload,
  capstoneTo,
}: {
  copy: SandboxCopy;
  file: string;
  onDownload: () => void;
  capstoneTo: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        borderColor: semanticAlpha("var(--ph-search)", 55),
        background: semanticAlpha("var(--ph-search)", 8),
        boxShadow: `0 0 24px ${semanticAlpha("var(--ph-search)", 18)}`,
      }}
    >
      <p className="text-body-sm font-semibold text-panel-text">{copy.doneTitle}</p>
      <p className="mt-1 font-mono text-caption text-panel-text-2">{file}</p>
      <div className="mt-3 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium text-panel-bg transition-transform hover:-translate-y-0.5"
          style={{ background: "var(--ph-search)" }}
        >
          <Download size={13} aria-hidden />
          {copy.doneDownload}
        </button>
        <Link
          to={capstoneTo}
          className="inline-flex items-center gap-1 rounded-full border px-4 py-1.5 text-[13px] text-panel-text transition-colors hover:text-panel-bg"
          style={{ borderColor: semanticAlpha("var(--ph-search)", 55) }}
        >
          {copy.doneCapstone}
        </Link>
      </div>
    </div>
  );
}

/** 终端 Tab：$ 命令回显 + ✓ ok 行 + 末行光标（§2.3，与左栏同一事件源） */
function TerminalPanel({
  lines,
  active,
  copy,
}: {
  lines: TermLine[];
  active: boolean;
  copy: SandboxCopy;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);
  return (
    <div
      ref={ref}
      className="h-full overflow-y-auto p-4 font-mono text-[13px] leading-[1.75]"
    >
      {lines.length === 0 && (
        <p className="text-panel-text-3">{copy.terminalIdleHint}</p>
      )}
      {lines.map((l, i) => (
        <p key={i} className="whitespace-pre-wrap break-all">
          {l.kind === "cmd" ? (
            <>
              <span style={{ color: "var(--panel-accent)" }}>$</span>
              <span className="text-panel-text">{l.text}</span>
            </>
          ) : l.kind === "ok" ? (
            <span style={{ color: "var(--syn-ok)" }}>{l.text}</span>
          ) : (
            <span className="text-panel-text-3">{l.text}</span>
          )}
        </p>
      ))}
      {active && (
        <p>
          <span style={{ color: "var(--panel-accent)" }}>$</span> <Caret />
        </p>
      )}
    </div>
  );
}

/** 报告 Tab：逐节流式渲染的排版后 Markdown + 模拟数据水印（§2.3） */
function ReportPanel({
  report,
  view,
  copy,
  started,
  onDownload,
}: {
  report: Report | null;
  view: ReportView;
  copy: SandboxCopy;
  started: boolean;
  onDownload: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [view]);

  function renderLine(line: ReportLine, shown: number, key: number): ReactNode {
    const text = line.text.slice(0, shown);
    switch (line.t) {
      case "title":
        return (
          <h3 key={key} className="mb-3 text-h4 font-bold text-panel-text">
            {text}
          </h3>
        );
      case "quote":
        return (
          <p
            key={key}
            className="border-l-2 py-0.5 pl-3 text-caption text-panel-text-2"
            style={{ borderColor: "var(--ph-plan)" }}
          >
            {text}
          </p>
        );
      case "h":
        return (
          <h4 key={key} className="mb-1.5 mt-4 text-body font-semibold text-panel-text">
            {text}
          </h4>
        );
      case "p":
        return (
          <p key={key} className="text-body-sm leading-relaxed text-panel-text-2">
            {text}
          </p>
        );
      case "li":
        return (
          <p key={key} className="flex gap-2 text-body-sm text-panel-text-2">
            <span style={{ color: "var(--ph-write)" }}>•</span>
            {text}
          </p>
        );
      case "ref":
        return (
          <p key={key} className="font-mono text-caption text-panel-text-2">
            {shown >= line.text.length && line.url ? (
              <>
                {line.text.slice(0, line.text.indexOf(line.url))}
                <span style={{ color: "var(--ph-read)" }}>{line.url}</span>
              </>
            ) : (
              text
            )}
          </p>
        );
      default:
        return <span key={key} className="block h-2" />;
    }
  }

  return (
    <div className="relative h-full">
      {/* 模拟数据水印徽章（验收清单 #3，常驻） */}
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded border border-panel-border bg-panel/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-panel-text-3 opacity-80 backdrop-blur-sm">
        {copy.watermark}
      </span>
      <div ref={ref} className="h-full overflow-y-auto p-5">
        {!started || !report ? (
          <p className="pt-8 text-center text-caption text-panel-text-3">
            {copy.reportLockedHint}
          </p>
        ) : (
          <>
            {report.units.map((unit, ui) => {
              if (ui > view.unit) return null;
              let budget = ui < view.unit || view.done ? Infinity : view.typed;
              return (
                <div key={ui}>
                  {unit.lines.map((line, li) => {
                    const shown = Math.min(line.text.length, Math.max(0, budget));
                    budget -= line.text.length;
                    return renderLine(line, shown, li);
                  })}
                </div>
              );
            })}
            {!view.done && view.unit >= 0 && <Caret />}
            {view.done && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex flex-wrap items-center gap-3 border-t border-panel-border pt-4"
              >
                <button
                  type="button"
                  onClick={onDownload}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-medium text-panel-bg transition-transform hover:-translate-y-0.5"
                  style={{ background: "var(--ph-search)" }}
                >
                  <Download size={13} aria-hidden />
                  {copy.download}
                </button>
                <span
                  className="font-mono text-[11px]"
                  style={{ color: "var(--ph-search)" }}
                >
                  {copy.generatedBadge}
                </span>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** 中断确认弹层（§3.2：「放弃当前回放？」） */
function ConfirmModal({
  copy,
  onCancel,
  onConfirm,
}: {
  copy: SandboxCopy;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center p-6"
      style={{ background: "var(--overlay-scrim)" }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.94, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 8 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm rounded-2xl border border-panel-border bg-panel p-6"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-label={copy.confirmTitle}
      >
        <p className="text-body font-semibold text-panel-text">{copy.confirmTitle}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-panel-border px-4 py-1.5 text-[13px] text-panel-text-2 transition-colors hover:text-panel-text"
          >
            {copy.confirmCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full px-4 py-1.5 text-[13px] font-medium text-panel-bg"
            style={{ background: "var(--ph-plan)" }}
          >
            {copy.confirmOk}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================ 页面主体 ================================ */

export default function SandboxPage({ locale }: { locale: Locale }) {
  const copy = getCopy(locale);
  const L = (p: string) => (locale === "en" ? `/en${p}` : p);
  const reduced = useReducedMotion() ?? false;

  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [phase, setPhase] = useState<PhaseKey>("input");
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [stepMode, setStepMode] = useState(false);
  const [awaitingNext, setAwaitingNext] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [progress, setProgress] = useState<Record<number, EntryProg>>({});
  const [termLines, setTermLines] = useState<TermLine[]>([]);
  const [tab, setTab] = useState<"terminal" | "report">("terminal");
  const [tabPulse, setTabPulse] = useState(false);
  const [reportStarted, setReportStarted] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [reportView, setReportView] = useState<ReportView>({ unit: -1, typed: 0, done: false });
  const [confirm, setConfirm] = useState<{ run: () => void } | null>(null);
  const [follow, setFollow] = useState(true);

  const runIdRef = useRef(0);
  const idRef = useRef(0);
  const gateRef = useRef<(() => void) | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slugRef = useRef("topic");
  const reportRef = useRef<Report | null>(null);
  // 控制参数走 ref，运行中的异步脚本实时读取（速度/暂停/逐步/reduced-motion）
  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);
  const stepModeRef = useRef(stepMode);
  const reducedRef = useRef(reduced);
  const followRef = useRef(follow);
  pausedRef.current = paused;
  speedRef.current = speed;
  reducedRef.current = reduced;
  followRef.current = follow;

  useEffect(() => {
    stepModeRef.current = stepMode;
    if (!stepMode) gateRef.current?.(); // 关闭逐步时放行等待中的闸门
  }, [stepMode]);

  useEffect(() => {
    if (!tabPulse) return;
    const t = window.setTimeout(() => setTabPulse(false), 1900);
    return () => window.clearTimeout(t);
  }, [tabPulse]);

  /* ------------------------------ 运行时原语 ------------------------------ */

  const wait = (ms: number, runId: number) =>
    new Promise<void>((resolve) => {
      const tick = () => {
        if (runIdRef.current !== runId) return resolve();
        if (pausedRef.current) {
          window.setTimeout(tick, 100);
          return;
        }
        resolve();
      };
      window.setTimeout(tick, Math.max(12, ms / speedRef.current));
    });

  const pushEntry = (e: Omit<Entry, "id">): number => {
    const id = ++idRef.current;
    setEntries((prev) => [...prev, { ...e, id }]);
    setProgress((prev) => ({
      ...prev,
      [id]: {
        typed: 0,
        actions: (e.actions ?? []).map(() => ({
          status: "running" as const,
          obs: 0,
          list: 0,
          dur: "",
        })),
      },
    }));
    return id;
  };

  const patchAction = (id: number, ai: number, patch: Partial<ActionProg>) =>
    setProgress((p) => {
      const ep = p[id];
      if (!ep) return p;
      return {
        ...p,
        [id]: { ...ep, actions: ep.actions.map((a, i) => (i === ai ? { ...a, ...patch } : a)) },
      };
    });

  const term = (line: TermLine) => setTermLines((prev) => [...prev, line]);

  const typeBudget = (text: string, i: number): number => {
    let budget = TICK_MS;
    while (budget > 0 && i < text.length) {
      budget -= charCost(text[i]);
      i++;
    }
    return i;
  };

  /** 打字机（§3.2：28ms/中文字、16ms/英数字符；reduced-motion 整段直出） */
  const typeText = async (id: number, text: string, runId: number) => {
    if (reducedRef.current) {
      setProgress((p) => (p[id] ? { ...p, [id]: { ...p[id], typed: text.length } } : p));
      await wait(100, runId);
      return;
    }
    let i = 0;
    while (i < text.length && runIdRef.current === runId) {
      await wait(TICK_MS, runId);
      i = typeBudget(text, i);
      const n = i;
      setProgress((p) => (p[id] ? { ...p, [id]: { ...p[id], typed: n } } : p));
    }
  };

  /** 工具调用：running（±15% 抖动）→ ✓ 耗时 → 列表逐条 → Observation 打字 */
  const runAction = async (
    id: number,
    ai: number,
    action: ActionData,
    runningMs: number,
    runId: number,
  ) => {
    const jitter = runningMs * (0.85 + Math.random() * 0.3);
    term({ kind: "cmd", text: ` ${action.tool}(${action.args})` });
    await wait(jitter, runId);
    if (runIdRef.current !== runId) return;
    const dur = `${(jitter / 1000).toFixed(1)}s`;
    patchAction(id, ai, { status: "done", dur });
    term({ kind: "ok", text: `✓ ok · ${dur}` });
    if (action.list) {
      for (let n = 1; n <= action.list.length; n++) {
        await wait(200, runId);
        if (runIdRef.current !== runId) return;
        patchAction(id, ai, { list: n });
      }
    }
    if (action.observation) {
      if (reducedRef.current) {
        patchAction(id, ai, { obs: action.observation.length });
        await wait(100, runId);
        return;
      }
      let i = 0;
      while (i < action.observation.length && runIdRef.current === runId) {
        await wait(TICK_MS, runId);
        i = typeBudget(action.observation, i);
        patchAction(id, ai, { obs: i });
      }
    }
  };

  /** 条目完成闸门：计步 + 逐步模式暂停（§3.3） */
  const gate = async (runId: number) => {
    setCompletedSteps((c) => c + 1);
    if (runIdRef.current !== runId) return;
    if (stepModeRef.current) {
      setAwaitingNext(true);
      await new Promise<void>((res) => {
        gateRef.current = res;
      });
      gateRef.current = null;
      if (runIdRef.current !== runId) return;
      setAwaitingNext(false);
    }
  };

  /** 报告逐节流式渲染（每节 ~700ms 打字 + 节间 350ms，§3.2） */
  const streamReport = async (rep: Report, runId: number) => {
    for (let u = 0; u < rep.units.length; u++) {
      if (runIdRef.current !== runId) return;
      const total = rep.units[u].lines.reduce((s, l) => s + l.text.length, 0);
      setReportView({ unit: u, typed: 0, done: false });
      if (reducedRef.current || total === 0) {
        setReportView({ unit: u, typed: total, done: false });
        await wait(100, runId);
      } else {
        const perTick = Math.max(1, Math.ceil(total / (700 / 24)));
        let n = 0;
        while (n < total && runIdRef.current === runId) {
          await wait(24, runId);
          n = Math.min(total, n + perTick);
          setReportView({ unit: u, typed: n, done: false });
        }
        await wait(350, runId);
      }
    }
    if (runIdRef.current === runId) setReportView((v) => ({ ...v, done: true }));
  };

  /* ------------------------------ 编排脚本（§3.1，11 条目） ------------------------------ */

  const startRun = (rawTopic: string) => {
    const t = rawTopic.trim();
    if (!t) return;
    const runId = ++runIdRef.current;
    gateRef.current?.();
    gateRef.current = null;
    setAwaitingNext(false);
    setEntries([]);
    setProgress({});
    setTermLines([]);
    setReport(null);
    reportRef.current = null;
    setReportView({ unit: -1, typed: 0, done: false });
    setReportStarted(false);
    setTab("terminal");
    setPhase("input");
    setCompletedSteps(0);
    setPaused(false);
    setFollow(true);
    setStatus("running");

    const tpl: TopicTemplate = templateFor(copy, t);
    const slug = slugify(t);
    slugRef.current = slug;
    const rep = buildReport(copy, t, tpl);
    setReport(rep);
    reportRef.current = rep;

    void (async () => {
      const alive = () => runIdRef.current === runId;
      const divider = (idx: 1 | 2 | 3 | 4, key: "plan" | "search" | "read" | "write") =>
        pushEntry({
          kind: "divider",
          phase: key,
          label: copy.divider(idx, copy.phases[PHASE_ORDER.indexOf(key)], copy.phaseEn[key]),
        });

      // #1 用户气泡
      pushEntry({ kind: "user", text: t });
      term({ kind: "cmd", text: ` agent.run("${t}")` });
      term({ kind: "note", text: "# simulated backend — no network calls" });
      await wait(300, runId);
      await gate(runId);
      if (!alive()) return;

      // —— 阶段 1 · 规划 ——
      setPhase("plan");
      divider(1, "plan");
      await wait(600, runId);
      if (!alive()) return;
      // #2 Thought：拆子问题
      const thPlan = copy.thoughtPlan(t);
      const idPlan = pushEntry({ kind: "thought", phase: "plan", text: thPlan });
      await typeText(idPlan, thPlan, runId);
      await gate(runId);
      if (!alive()) return;
      // #3 Action plan_topic
      await wait(1000, runId);
      if (!alive()) return;
      const aPlan: ActionData = {
        tool: "plan_topic",
        args: `{ "topic": "${t}" }`,
        list: [...tpl.questions],
        listLabel: copy.planObservationLabel,
      };
      const idAPlan = pushEntry({ kind: "action", phase: "plan", actions: [aPlan] });
      await runAction(idAPlan, 0, aPlan, 900, runId);
      await gate(runId);
      if (!alive()) return;

      // —— 阶段 2 · 搜索 ——
      setPhase("search");
      divider(2, "search");
      await wait(500, runId);
      if (!alive()) return;
      // #4 Thought
      const idThS = pushEntry({ kind: "thought", phase: "search", text: copy.thoughtSearch });
      await typeText(idThS, copy.thoughtSearch, runId);
      await gate(runId);
      if (!alive()) return;
      // #5 Action web_search（Observation 顶部标注「模拟结果」——验收清单 #5）
      await wait(1400, runId);
      if (!alive()) return;
      const aSearch: ActionData = {
        tool: "web_search",
        args: `{ "query": "${tpl.questions[0]}", "max_results": 5 }`,
        list: tpl.results.map((r) => `${r.title} — ${r.domain}`),
        simulated: true,
      };
      const idASearch = pushEntry({ kind: "action", phase: "search", actions: [aSearch] });
      await runAction(idASearch, 0, aSearch, 1200, runId);
      await gate(runId);
      if (!alive()) return;

      // —— 阶段 3 · 阅读 ——
      setPhase("read");
      divider(3, "read");
      await wait(500, runId);
      if (!alive()) return;
      // #6 Thought
      const idThR = pushEntry({ kind: "thought", phase: "read", text: copy.thoughtRead });
      await typeText(idThR, copy.thoughtRead, runId);
      await gate(runId);
      if (!alive()) return;
      // #7 Action fetch_page ×2（连续两张卡，§3.1）
      const aFetches: ActionData[] = tpl.pages.map((p) => ({
        tool: "fetch_page",
        args: `{ "url": "${p.url}" }`,
        observation: copy.fetchObservation(p.inTokens, p.outTokens),
      }));
      const idFetch = pushEntry({ kind: "action", phase: "read", actions: aFetches });
      for (let ai = 0; ai < aFetches.length; ai++) {
        await wait(ai === 0 ? 1200 : 300, runId);
        if (!alive()) return;
        await runAction(idFetch, ai, aFetches[ai], 1200, runId);
        if (!alive()) return;
      }
      await gate(runId);
      if (!alive()) return;

      // —— 阶段 4 · 写作 ——
      setPhase("write");
      divider(4, "write");
      await wait(600, runId);
      if (!alive()) return;
      // #8 Thought
      const idThW = pushEntry({ kind: "thought", phase: "write", text: copy.thoughtWrite });
      await typeText(idThW, copy.thoughtWrite, runId);
      await gate(runId);
      if (!alive()) return;
      // #9 Action write_report（右栏自动切到报告 Tab，§2.3）
      await wait(1500, runId);
      if (!alive()) return;
      setReportStarted(true);
      setTab("report");
      setTabPulse(true);
      const aWrite: ActionData = {
        tool: "write_report",
        args: `{ "outline": [${copy.writeOutline.map((s) => `"${s}"`).join(", ")}] }`,
        observation: copy.writeObservation,
      };
      const idAWrite = pushEntry({ kind: "action", phase: "write", actions: [aWrite] });
      await runAction(idAWrite, 0, aWrite, 1500, runId);
      await gate(runId);
      if (!alive()) return;
      // 报告逐节流式渲染
      await streamReport(rep, runId);
      if (!alive()) return;
      // #10 Thought：验收清单（呼应 Capstone STEP 5）
      await wait(400, runId);
      if (!alive()) return;
      const idThC = pushEntry({ kind: "thought", phase: "write", text: copy.thoughtCheck });
      await typeText(idThC, copy.thoughtCheck, runId);
      await gate(runId);
      if (!alive()) return;
      // #11 完成卡
      await wait(300, runId);
      if (!alive()) return;
      term({ kind: "ok", text: `✓ report saved → ${copy.doneFile(slug)}` });
      pushEntry({ kind: "done", file: copy.doneFile(slug) });
      await gate(runId);
      if (!alive()) return;
      setStatus("done");
    })();
  };

  /** ↻ 重放：startRun 自带重置（使旧 runId 失效）；运行中需确认「放弃当前回放？」（§3.2 中断） */
  const onReplay = () => {
    if (!topic.trim()) return;
    const action = () => startRun(topic);
    if (status === "running") setConfirm({ run: action });
    else action();
  };

  const downloadReport = () => {
    const rep = reportRef.current;
    if (!rep) return;
    const blob = new Blob([rep.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugRef.current}-mini-report.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* ------------------------------ 滚动跟随（§3.2） ------------------------------ */

  useEffect(() => {
    const el = scrollRef.current;
    if (el && followRef.current)
      el.scrollTo({ top: el.scrollHeight, behavior: reducedRef.current ? "auto" : "smooth" });
  }, [entries.length]);
  useEffect(() => {
    const el = scrollRef.current;
    if (el && followRef.current) el.scrollTop = el.scrollHeight;
  }, [progress]);

  const onTraceScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setFollow(el.scrollHeight - el.scrollTop - el.clientHeight < 48);
  };

  /* ------------------------------ 渲染 ------------------------------ */

  const running = status === "running";

  /** 标题 word stagger（S1 / S5 共用） */
  const staggerTitle = (plain: string, grad: string) => (
    <>
      {plain
        .trim()
        .split(/\s+/)
        .map((w, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {w}&nbsp;
          </motion.span>
        ))}
      <motion.span
        className="inline-block font-display text-grad"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: plain.trim().split(/\s+/).length * 0.07,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {grad}
      </motion.span>
    </>
  );

  const renderEntry = (e: Entry) => {
    const prog = progress[e.id];
    const inner = (() => {
      switch (e.kind) {
        case "user":
          return <UserBubble text={e.text ?? ""} />;
        case "thought":
          return <ThoughtCard text={e.text ?? ""} typed={prog?.typed ?? 0} />;
        case "action":
          return (
            <div className="space-y-3">
              {(e.actions ?? []).map((a, ai) => (
                <ActionCard key={ai} action={a} prog={prog?.actions[ai]} copy={copy} />
              ))}
            </div>
          );
        case "divider":
          return (
            <PhaseDivider
              label={e.label ?? ""}
              color={PHASE_COLOR[e.phase ?? "input"]}
            />
          );
        case "done":
          return (
            <DoneCard
              copy={copy}
              file={e.file ?? ""}
              onDownload={downloadReport}
              capstoneTo={L("/capstone")}
            />
          );
      }
    })();
    return (
      <motion.div
        key={e.id}
        className="sb-entry"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        {inner}
      </motion.div>
    );
  };

  const capstoneDemo =
    copy.locale === "en"
      ? [
          '$ python main.py "LangGraph vs OpenAI Agents SDK"',
          "> [plan] split into 4 sub-questions...",
          "> [search] sub-question 1/4 ...",
          "> [read] fetched 6 pages, extracted 42,000 tokens → compressed to 3,800 ...",
          "> [write] generating report...",
          "✅ report saved: reports/langgraph_vs_agents_sdk.md",
        ].join("\n")
      : [
          '$ python main.py "对比 LangGraph 和 OpenAI Agents SDK"',
          "> [计划] 拆分为 4 个子问题...",
          "> [搜索] 子问题 1/4 ...",
          "> [阅读] 抓取 6 个页面，提取正文 42,000 tokens → 压缩为 3,800 tokens ...",
          "> [撰写] 生成报告...",
          "✅ 报告已保存：reports/langgraph_vs_agents_sdk.md",
        ].join("\n");

  return (
    <div className="sandbox-scope">
      {/* ============================ S1 页头 ============================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-texture" aria-hidden />
        <div
          className="absolute -left-32 top-10 h-72 w-72 rounded-full blur-3xl"
          style={{ background: semanticAlpha(SEMANTIC.perceive, 100), opacity: "var(--glow-opacity)" }}
          aria-hidden
        />
        <div
          className="absolute -right-24 top-40 h-80 w-80 rounded-full blur-3xl"
          style={{ background: semanticAlpha(SEMANTIC.memory, 100), opacity: "var(--glow-opacity)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-content px-6 pb-12 pt-36 max-md:px-5">
          {/* 面包屑 */}
          <nav className="mb-8 flex items-center gap-1.5 font-mono text-caption text-text-tertiary">
            <Link to={L("/")} className="transition-colors hover:text-c-perceive">
              {copy.crumbHome}
            </Link>
            <ChevronRight size={13} aria-hidden />
            <span className="text-text-secondary">{copy.crumbHere}</span>
          </nav>

          {/* 模拟演示主徽章（验收清单 #1：呼吸光晕、不可关闭） */}
          <Reveal y={16}>
            <p className="sb-breathe inline-flex items-center gap-2 rounded-full border border-c-plan/60 bg-c-plan/10 px-3.5 py-1.5 font-mono text-[13px] font-semibold tracking-[0.08em] text-c-plan">
              {copy.simBadge}
            </p>
            <p className="mt-3 text-caption text-text-tertiary">
              {copy.simCaptionPre}
              <Link to={L("/capstone")} className="text-c-perceive hover:underline">
                {copy.simCaptionLink}
              </Link>
              {copy.simCaptionPost}
            </p>
          </Reveal>

          <h1 className="mt-6 text-h1 font-bold text-text-primary">
            {staggerTitle(copy.h1a, copy.h1b)}
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-5 max-w-[720px] text-body-lg text-text-secondary">
              {copy.leadA}
              <strong className="text-text-primary">{copy.leadB}</strong>
              {copy.leadC}
            </p>
          </Reveal>
          <Reveal delay={0.35} className="mt-6 flex flex-wrap items-center gap-3">
            <Link to={`${L("/principles")}#react`}>
              <Badge color={SEMANTIC.plan}>{copy.badgeReact}</Badge>
            </Link>
            <Link to={L("/capstone")}>
              <Badge color={SEMANTIC.loop}>{copy.badgeCapstone}</Badge>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============================ S2 工作台 ============================ */}
      <section id="workbench" className="mx-auto max-w-content scroll-mt-24 px-6 pb-20 max-md:px-5">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-panel-border bg-panel text-panel-text">
            {/* 顶栏：三圆点 + 标题（含 simulated run，验收清单 #2）+ 阶段指示器 + 控制组 */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-panel-border bg-panel-2/60 px-4 py-2.5">
              <MacDots />
              <span className="truncate font-mono text-[13px] text-panel-text-2">
                {copy.workbenchTitle}
              </span>
              <div className="mx-auto max-lg:order-last max-lg:w-full max-lg:pt-1">
                <PhaseIndicator copy={copy} phase={phase} done={status === "done"} />
              </div>
              <div className="flex items-center gap-2">
                {/* 速度分段胶囊 1× | 2× */}
                <div
                  role="group"
                  aria-label="speed"
                  className="flex h-7 items-center rounded-full border border-panel-border p-0.5 font-mono text-[11px]"
                >
                  {([1, 2] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={speed === s}
                      onClick={() => setSpeed(s)}
                      className={cn(
                        "rounded-full px-2 py-0.5 transition-colors",
                        speed === s
                          ? "bg-panel-border text-panel-text"
                          : "text-panel-text-3 hover:text-panel-text-2",
                      )}
                    >
                      {s}×
                    </button>
                  ))}
                </div>
                {/* 暂停/继续（仅运行中） */}
                {running && (
                  <button
                    type="button"
                    onClick={() => setPaused((v) => !v)}
                    className="h-7 rounded-full border border-panel-border px-2.5 font-mono text-[11px] text-panel-text-2 transition-colors hover:text-panel-text"
                  >
                    {paused ? copy.resume : copy.pause}
                  </button>
                )}
                {/* 重放 */}
                <button
                  type="button"
                  onClick={onReplay}
                  disabled={!topic.trim()}
                  className="h-7 rounded-full border border-panel-border px-2.5 font-mono text-[11px] text-panel-text-2 transition-colors hover:text-panel-text disabled:opacity-40"
                >
                  {copy.replay}
                </button>
                {/* 逐步开关 */}
                <button
                  type="button"
                  aria-pressed={stepMode}
                  onClick={() => setStepMode((v) => !v)}
                  className={cn(
                    "h-7 rounded-full border px-2.5 font-mono text-[11px] transition-colors",
                    stepMode
                      ? "text-panel-text"
                      : "border-panel-border text-panel-text-3 hover:text-panel-text-2",
                  )}
                  style={
                    stepMode
                      ? {
                          borderColor: semanticAlpha("var(--ph-write)", 60),
                          background: semanticAlpha("var(--ph-write)", 15),
                        }
                      : undefined
                  }
                >
                  {copy.stepMode}
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-[55fr_45fr]">
              {/* 左栏：输入 + 轨迹流 */}
              <div className="flex flex-col border-b border-panel-border lg:border-b-0 lg:border-r">
                {/* 输入区（运行中禁用） */}
                <div className="border-b border-panel-border/70 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={topic}
                      disabled={running}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !running) startRun(topic);
                      }}
                      placeholder={copy.inputPlaceholder}
                      className="min-w-0 flex-1 rounded-[10px] border border-panel-border bg-panel-2 px-3.5 py-2 text-body-sm text-panel-text placeholder:text-panel-text-3 focus:border-panel-accent focus:outline-none disabled:opacity-50"
                    />
                    <button
                      type="button"
                      disabled={!topic.trim() || running}
                      onClick={() => startRun(topic)}
                      className="btn-solid-grad shrink-0 px-4 py-2 text-[13.5px] font-semibold disabled:pointer-events-none disabled:opacity-40"
                    >
                      {copy.run}
                    </button>
                  </div>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="text-caption text-panel-text-3">{copy.presetLabel}</span>
                    {copy.presets.map((p) => (
                      <button
                        key={p.topic}
                        type="button"
                        disabled={running}
                        onClick={() => setTopic(p.topic)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 font-mono text-[11px] transition-colors disabled:opacity-40",
                          topic === p.topic
                            ? "border-panel-accent/60 bg-panel-accent/10 text-panel-accent"
                            : "border-panel-border text-panel-text-2 hover:border-panel-accent/50 hover:text-panel-text",
                        )}
                      >
                        {p.topic}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 轨迹流（内部滚动 + 跟随最新） */}
                <div className="relative">
                  <div
                    ref={scrollRef}
                    onScroll={onTraceScroll}
                    className="max-h-[62vh] min-h-[340px] space-y-4 overflow-y-auto p-4"
                  >
                    {entries.length === 0 ? (
                      <p className="pt-16 text-center font-mono text-caption text-panel-text-3">
                        {copy.locale === "en"
                          ? "// the agent trace will unfold here — Thought → Action → Observation"
                          : "// Agent 轨迹将在这里展开：Thought → Action → Observation"}
                      </p>
                    ) : (
                      entries.map(renderEntry)
                    )}
                  </div>
                  {!follow && entries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFollow(true);
                        scrollRef.current?.scrollTo({
                          top: scrollRef.current.scrollHeight,
                          behavior: "smooth",
                        });
                      }}
                      className="absolute bottom-3 right-3 rounded-full border border-panel-border bg-panel-2 px-3 py-1 font-mono text-[11px] text-panel-text-2 shadow-lg transition-colors hover:text-panel-text"
                    >
                      {copy.backToLatest}
                    </button>
                  )}
                </div>

                {/* 逐步模式控制条（§3.3） */}
                {stepMode && running && (
                  <div className="flex items-center justify-between border-t border-panel-border bg-panel-2/50 px-4 py-2.5">
                    <span className="font-mono text-[11px] text-panel-text-3">
                      {copy.stepProgress(completedSteps, TOTAL_STEPS)}
                    </span>
                    <button
                      type="button"
                      disabled={!awaitingNext}
                      onClick={() => gateRef.current?.()}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-[13px] font-medium transition-opacity disabled:opacity-40",
                        awaitingNext && "sb-breathe-panel",
                      )}
                      style={{ background: "var(--ph-write)", color: "var(--panel-bg)" }}
                    >
                      {copy.nextStep}
                    </button>
                  </div>
                )}
              </div>

              {/* 右栏：终端 / 报告 Tabs */}
              <div className="flex flex-col">
                <div className="flex border-b border-panel-border bg-panel-2/40">
                  {(
                    [
                      { id: "terminal", label: copy.terminalTab, icon: TerminalSquare, disabled: false },
                      { id: "report", label: copy.reportTab, icon: FileText, disabled: !reportStarted },
                    ] as const
                  ).map((tb) => {
                    const active = tab === tb.id;
                    const color = tb.id === "report" ? "var(--ph-write)" : "var(--panel-accent)";
                    return (
                      <button
                        key={tb.id}
                        type="button"
                        disabled={tb.disabled}
                        onClick={() => setTab(tb.id)}
                        className={cn(
                          "relative flex items-center gap-1.5 px-4 py-2.5 font-mono text-[12px] tracking-wide transition-colors disabled:opacity-40",
                          active ? "text-panel-text" : "text-panel-text-3 hover:text-panel-text-2",
                          tb.id === "report" && tabPulse && "sb-tab-pulse rounded-t-md",
                        )}
                        style={active ? { color } : undefined}
                      >
                        <tb.icon size={13} aria-hidden />
                        {tb.label}
                        {active && (
                          <motion.span
                            layoutId={`sb-tab-indicator-${locale}`}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="absolute inset-x-3 bottom-0 h-0.5 rounded-full"
                            style={{ background: color }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="min-h-[360px] flex-1">
                  {tab === "terminal" ? (
                    <TerminalPanel lines={termLines} active={running} copy={copy} />
                  ) : (
                    <ReportPanel
                      report={report}
                      view={reportView}
                      copy={copy}
                      started={reportStarted}
                      onDownload={downloadReport}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============================ S4 拆穿带 ============================ */}
      <section id="how-it-works" className="bg-bg-1">
        <div className="h-[2px] w-full bg-grad-semantics" aria-hidden />
        <div className="mx-auto max-w-content px-6 py-20 max-md:px-5">
          <Reveal className="mb-10">
            <Badge color={SEMANTIC.perceive} className="mb-4">
              {copy.s4Tag}
            </Badge>
            <h2 className="text-h2 font-bold text-text-primary">{copy.s4Title}</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            <Reveal delay={0}>
              <Card accent={SEMANTIC.plan} className="flex h-full flex-col">
                <h3 className="text-h4 font-semibold text-text-primary">{copy.s4c1Title}</h3>
                <p className="mt-2 text-body-sm text-text-secondary">{copy.s4c1Body}</p>
                <div className="diagram-frame mt-4 p-2">
                  <img
                    src="/diagram-react-trace.svg"
                    alt="ReAct trace diagram"
                    className="w-full rounded-md"
                    loading="lazy"
                  />
                </div>
                <Link
                  to={`${L("/principles")}#react`}
                  className="mt-auto inline-block pt-4 text-body-sm font-medium text-c-perceive hover:underline"
                >
                  {copy.s4c1Link}
                </Link>
              </Card>
            </Reveal>
            <Reveal delay={0.1}>
              <Card accent={SEMANTIC.tool} className="flex h-full flex-col">
                <h3 className="text-h4 font-semibold text-text-primary">{copy.s4c2Title}</h3>
                <p className="mt-2 text-body-sm text-text-secondary">{copy.s4c2Body}</p>
                <div className="mt-4">
                  <CodeBlock code={capstoneDemo} type="terminal" maxLines={0} />
                </div>
                <Link
                  to={L("/capstone")}
                  className="mt-auto inline-block pt-4 text-body-sm font-medium text-c-perceive hover:underline"
                >
                  {copy.s4c2Link}
                </Link>
              </Card>
            </Reveal>
            <Reveal delay={0.2}>
              <Card accent={SEMANTIC.loop} className="flex h-full flex-col">
                <h3 className="text-h4 font-semibold text-text-primary">{copy.s4c3Title}</h3>
                <div className="mt-4 flex-1 rounded-xl border border-panel-border bg-panel p-4 font-mono text-caption leading-relaxed text-panel-text-2">
                  <span style={{ color: "var(--panel-accent)" }}>$</span> cat sandbox.ts
                  <br />
                  <br />
                  {copy.s4c3Body}
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================ S5 底部 CTA ============================ */}
      <section className="relative overflow-hidden">
        <div
          className="absolute left-1/2 top-1/2 h-96 w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(closest-side, ${semanticAlpha(SEMANTIC.loop, 60)}, ${semanticAlpha(SEMANTIC.memory, 30)}, transparent)`,
            opacity: "var(--glow-opacity)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[760px] px-6 py-24 text-center max-md:px-5">
          <h2 className="text-h2 font-bold text-text-primary">
            {staggerTitle(copy.s5TitleA, copy.s5TitleB)}
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-4 text-body-lg text-text-secondary">{copy.s5Sub}</p>
          </Reveal>
          <Reveal delay={0.35} className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={L("/capstone")}
              className="btn-solid-grad px-7 py-3 text-[15px] font-semibold"
            >
              {copy.s5Primary}
            </Link>
            <Link
              to={`${L("/principles")}#react`}
              className="btn-outline-grad px-6 py-3 text-[15px] font-medium text-text-primary"
            >
              {copy.s5Ghost}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 中断确认弹层 */}
      <AnimatePresence>
        {confirm && (
          <ConfirmModal
            copy={copy}
            onCancel={() => setConfirm(null)}
            onConfirm={() => {
              confirm.run();
              setConfirm(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
