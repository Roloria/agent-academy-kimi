import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Check, RotateCcw } from "lucide-react";
import { Badge, Reveal } from "@/components/ui-extra";
import { cn } from "@/lib/utils";
import { SEMANTIC } from "@/lib/semantic";

/**
 * S7. Capstone 预告 —— 终端逐行打印演示（内容取自 learning-path brief §三）
 */
const LINES = [
  { text: '$ python main.py "对比 LangGraph 和 OpenAI Agents SDK 的设计理念"', kind: "cmd" },
  { text: "> [计划] 拆分为 4 个子问题...", kind: "out" },
  { text: "> [搜索] 子问题 1/4 ...", kind: "out" },
  { text: "> [阅读] 抓取 6 个页面，提取正文 42,000 tokens → 压缩为 3,800 tokens ...", kind: "out" },
  { text: "> [撰写] 生成报告...", kind: "out" },
  { text: "✅ 报告已保存：reports/langgraph_vs_agents_sdk.md", kind: "ok" },
] as const;

const FEATURES = [
  "自动规划子问题",
  "网页搜索与正文提取",
  "会话记忆与长期记忆",
  "LLM-as-judge 评估",
  "一键部署为无人值守助理",
];

function TerminalDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<number[]>([]);

  const play = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setShown(0);
    setPlaying(true);
    LINES.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setShown(i + 1);
          if (i === LINES.length - 1) setPlaying(false);
        }, (i + 1) * 500),
      );
    });
  };

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="group relative overflow-hidden rounded-xl border border-panel-border bg-panel"
    >
      {/* 顶栏 */}
      <div className="flex items-center justify-between border-b border-panel-border bg-panel-2/60 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <i className="h-3 w-3 rounded-full" style={{ background: "#FF5F57" }} />
            <i className="h-3 w-3 rounded-full" style={{ background: "#FEBC2E" }} />
            <i className="h-3 w-3 rounded-full" style={{ background: "#28C840" }} />
          </span>
          <span className="font-mono text-xs text-panel-text-3">terminal</span>
        </div>
        <button
          type="button"
          onClick={play}
          className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-panel-text-3 opacity-0 transition-all hover:bg-panel-2 hover:text-panel-accent group-hover:opacity-100"
        >
          <RotateCcw size={12} /> 重放
        </button>
      </div>
      {/* 终端体 */}
      <div className="min-h-[216px] p-4 font-mono text-code">
        {LINES.slice(0, shown).map((l, i) => (
          <div
            key={i}
            className={cn(
              l.kind === "ok" && "font-medium",
              "animate-[termLine_.2s_ease-out]",
            )}
            style={{
              color:
                l.kind === "ok"
                  ? "var(--syn-ok)"
                  : l.kind === "cmd"
                    ? "var(--panel-text)"
                    : "var(--panel-text-2)",
            }}
          >
            {l.kind === "cmd" ? (
              <>
                <span style={{ color: "var(--panel-accent)" }}>$</span>
                {l.text.slice(1)}
              </>
            ) : (
              l.text
            )}
          </div>
        ))}
        {playing && (
          <span className="ml-0.5 inline-block h-4 w-2 animate-caret-blink bg-c-perceive align-middle" />
        )}
      </div>
      <style>{`@keyframes termLine { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
}

export default function Capstone() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto grid max-w-content items-center gap-14 px-6 max-md:px-5 lg:grid-cols-2">
        {/* 左：终端演示 */}
        <Reveal y={24}>
          <TerminalDemo />
        </Reveal>

        {/* 右：文字 */}
        <div>
          <Reveal>
            <Badge color={SEMANTIC.loop} className="mb-4">
              CAPSTONE
            </Badge>
            <h2 className="text-h2 font-bold text-text-primary">
              输入一个研究主题，它自动规划、搜索、阅读、撰写——
              <span className="text-c-loop">带引用的研究报告落盘保存</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-7 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-body text-text-secondary">
                  <span className="rounded-md bg-c-tool/10 p-1 text-c-tool">
                    <Check size={14} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              to="/capstone"
              className="btn-outline-grad mt-9 inline-block px-7 py-3 text-[16px] font-medium text-text-primary"
            >
              查看 8 步完整教程 →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
