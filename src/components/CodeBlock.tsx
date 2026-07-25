import { useMemo, useState } from "react";
import { Check, Copy, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CodeBlock —— 全站核心代码块组件（design.md §5.3）
 *
 * - 顶栏：macOS 三圆点 + 文件名 + 语言标签 + 复制按钮（已复制态 2s）
 * - 行号列（showLineNumbers 可关）
 * - type="terminal" 终端变体：无行号、$ 青色提示符、成功行绿色
 * - 长代码默认折叠 28 行 + 「展开全部 ▾」
 * - 轻量自绘 tokenizer，语法色按 design.md §2.3
 */

type TokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "func"
  | "decorator"
  | "plain";

interface Token {
  text: string;
  type: TokenType;
}

const TOKEN_COLOR: Record<TokenType, string> = {
  keyword: "#C792EA",
  string: "#C3E88D",
  comment: "#546E7A",
  number: "#F78C6C",
  func: "#82AAFF",
  decorator: "#FBBF24",
  plain: "#E8EDF5",
};

const PY_KEYWORDS = new Set(
  ("import|from|as|def|return|if|elif|else|for|while|in|not|and|or|is|None|True|False|class|with|try|except|finally|raise|lambda|yield|async|await|pass|break|continue|print|len|str|int|float|list|dict|set|tuple|range|enumerate|zip|self|global|assert|del").split(
    "|",
  ),
);

/** 轻量逐行 tokenizer：字符串 → 注释 → 装饰器 → 数字 → 关键字 → 函数调用 */
function tokenizeLine(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  // 合并匹配：注释 / 字符串 / 装饰器 / 数字 / 标识符(含函数调用与关键字)
  const re =
    /(#.*$)|("""[\s\S]*?"""|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@[\w.]+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w]*)(?=\s*\()|([A-Za-z_][\w]*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) tokens.push({ text: line.slice(last, m.index), type: "plain" });
    const [full, comment, str, deco, num, fn, ident] = m;
    if (comment) tokens.push({ text: full, type: "comment" });
    else if (str) tokens.push({ text: full, type: "string" });
    else if (deco) tokens.push({ text: full, type: "decorator" });
    else if (num) tokens.push({ text: full, type: "number" });
    else if (fn) tokens.push({ text: full, type: "func" });
    else if (ident)
      tokens.push({
        text: full,
        type:
          lang === "python" || lang === "py"
            ? PY_KEYWORDS.has(full)
              ? "keyword"
              : "plain"
            : "plain",
      });
    last = m.index + full.length;
  }
  if (last < line.length) tokens.push({ text: line.slice(last), type: "plain" });
  return tokens;
}

function isSuccessLine(line: string): boolean {
  const t = line.trimStart();
  return t.startsWith("✅") || t.startsWith("✓") || t.startsWith("✔");
}

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  /** terminal 终端变体 */
  type?: "code" | "terminal";
  showLineNumbers?: boolean;
  /** 折叠阈值（行），默认 28；0 = 不折叠 */
  maxLines?: number;
  className?: string;
}

export default function CodeBlock({
  code,
  language = "python",
  filename,
  type = "code",
  showLineNumbers,
  maxLines = 28,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isTerminal = type === "terminal";
  const lineNums = showLineNumbers ?? !isTerminal;

  const lines = useMemo(() => code.replace(/\n$/, "").split("\n"), [code]);
  const collapsible = !isTerminal && maxLines > 0 && lines.length > maxLines;
  const visibleLines = collapsible && !expanded ? lines.slice(0, maxLines) : lines;

  const title = filename ?? (isTerminal ? "terminal" : `main.${language === "python" ? "py" : language}`);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border-subtle bg-bg-2",
        className,
      )}
    >
      {/* 顶栏 */}
      <div className="flex items-center justify-between border-b border-border-subtle bg-bg-1/60 px-4 py-2.5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex shrink-0 items-center gap-1.5">
            <i className="h-3 w-3 rounded-full" style={{ background: "#FF5F57" }} />
            <i className="h-3 w-3 rounded-full" style={{ background: "#FEBC2E" }} />
            <i className="h-3 w-3 rounded-full" style={{ background: "#28C840" }} />
          </span>
          <span className="truncate font-mono text-xs text-text-tertiary">{title}</span>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-widest text-text-tertiary">
            {isTerminal ? "bash" : language}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="复制代码"
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs transition-all duration-150 active:scale-95",
              copied
                ? "text-c-tool"
                : "text-text-tertiary hover:bg-bg-3 hover:text-text-primary",
            )}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </div>

      {/* 代码区 */}
      <div className="relative">
        <pre
          className={cn(
            "overflow-x-auto p-4 font-mono text-code transition-[max-height] duration-[400ms]",
            collapsible && !expanded && "overflow-hidden",
          )}
          style={
            collapsible && !expanded
              ? { maxHeight: `calc(${maxLines} * 1.7 * 14.5px + 32px)` }
              : { maxHeight: "10000px" }
          }
        >
          {isTerminal
            ? visibleLines.map((line, i) => {
                const prompt = line.trimStart().startsWith("$");
                const success = isSuccessLine(line);
                return (
                  <div key={i} className="flex">
                    <span
                      className="whitespace-pre"
                      style={{
                        color: success ? "#34D399" : prompt ? "#E8EDF5" : "#9AA7BC",
                      }}
                    >
                      {prompt ? (
                        <>
                          <span style={{ color: "#38BDF8" }}>$</span>
                          {line.slice(line.indexOf("$") + 1)}
                        </>
                      ) : (
                        line || " "
                      )}
                    </span>
                  </div>
                );
              })
            : visibleLines.map((line, i) => (
                <div key={i} className="flex">
                  {lineNums && (
                    <span
                      aria-hidden
                      className="w-12 shrink-0 select-none pr-4 text-right text-text-tertiary"
                    >
                      {i + 1}
                    </span>
                  )}
                  <span className="whitespace-pre">
                    {line.length === 0
                      ? " "
                      : tokenizeLine(line, language).map((t, j) => (
                          <span
                            key={j}
                            style={{
                              color: TOKEN_COLOR[t.type],
                              fontStyle: t.type === "comment" ? "italic" : undefined,
                            }}
                          >
                            {t.text}
                          </span>
                        ))}
                  </span>
                </div>
              ))}
        </pre>
        {collapsible && !expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg-2 to-transparent" />
        )}
      </div>

      {/* 折叠/展开 */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-border-subtle bg-bg-1/60 py-2 font-mono text-xs text-text-secondary transition-colors hover:text-c-perceive"
        >
          {expanded ? (
            <>
              收起 <ChevronUp size={13} />
            </>
          ) : (
            <>
              展开全部（{lines.length} 行） <ChevronDown size={13} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

/** 终端重放按钮（配合 Capstone 演示） */
export function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-text-tertiary transition-colors hover:bg-bg-3 hover:text-c-perceive"
    >
      <RotateCcw size={12} /> 重放
    </button>
  );
}
