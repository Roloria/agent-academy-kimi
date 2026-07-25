import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Check, RotateCcw } from "lucide-react";
import { Badge, Reveal } from "@/components/ui-extra";
import { cn } from "@/lib/utils";
import { SEMANTIC } from "@/lib/semantic";
import { useLanguage } from "@/providers/use-language";

/**
 * S7. Capstone preview — line-by-line terminal demo (content from learning-path brief §3)
 */
const LINES = [
  { text: '$ python main.py "Compare the design philosophies of LangGraph and the OpenAI Agents SDK"', kind: "cmd" },
  { text: "> [Plan] Split into 4 sub-questions...", kind: "out" },
  { text: "> [Search] Sub-question 1/4 ...", kind: "out" },
  { text: "> [Read] Fetched 6 pages, extracted 42,000 tokens of body text → compressed to 3,800 tokens ...", kind: "out" },
  { text: "> [Write] Generating report...", kind: "out" },
  { text: "✅ Report saved: reports/langgraph_vs_agents_sdk.md", kind: "ok" },
] as const;

const FEATURES = [
  "Automatic sub-question planning",
  "Web search and body-text extraction",
  "Session memory and long-term memory",
  "LLM-as-judge evaluation",
  "One-click deploy as an unattended assistant",
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
      {/* Title bar */}
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
          <RotateCcw size={12} /> Replay
        </button>
      </div>
      {/* Terminal body */}
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
  const { localize } = useLanguage();
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto grid max-w-content items-center gap-14 px-6 max-md:px-5 lg:grid-cols-2">
        {/* Left: terminal demo */}
        <Reveal y={24}>
          <TerminalDemo />
        </Reveal>

        {/* Right: copy */}
        <div>
          <Reveal>
            <Badge color={SEMANTIC.loop} className="mb-4">
              CAPSTONE
            </Badge>
            <h2 className="text-h2 font-bold text-text-primary">
              Give it a research topic and it plans, searches, reads and writes
              automatically —{" "}
              <span className="text-c-loop">a research report with citations, saved to disk</span>
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
              to={localize("/capstone")}
              className="btn-outline-grad mt-9 inline-block px-7 py-3 text-[16px] font-medium text-text-primary"
            >
              See the full 8-step tutorial →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
