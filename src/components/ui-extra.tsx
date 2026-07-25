import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SEMANTIC, semanticStyle } from "@/lib/semantic";

/** 通用 UI 辅助组件（design.md §5.4） */

/** Badge：JetBrains Mono 12px 大写，语义色徽章 */
export function Badge({
  children,
  color = SEMANTIC.perceive,
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs uppercase tracking-[0.12em]",
        className,
      )}
      style={semanticStyle(color)}
    >
      {children}
    </span>
  );
}

/** Card：bg-1 底 + 描边 + hover 顶部语义色条 + 上浮 */
export function Card({
  children,
  accent,
  className,
  number,
}: {
  children: ReactNode;
  /** 语义色：hover 时顶部 2px 色条 */
  accent?: string;
  className?: string;
  /** 左上角 JetBrains Mono 编号，如 "01" */
  number?: string;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:border-border-strong",
        className,
      )}
    >
      {accent && (
        <span
          className="absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100"
          style={{ background: accent }}
        />
      )}
      {number && (
        <span className="mb-3 block font-mono text-caption tracking-widest text-text-tertiary">
          {number}
        </span>
      )}
      {children}
    </div>
  );
}

/** Reveal：全站统一「内容块浮现」进场（y:32 → 0, opacity 0→1, 550ms, power2.out） */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/** 章节小标题（mono 徽章 + 标题） */
export function SectionHeading({
  tag,
  tagColor = SEMANTIC.perceive,
  title,
  lead,
  align = "left",
  className,
}: {
  tag?: string;
  tagColor?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-12",
        align === "center" && "flex flex-col items-center text-center",
        className,
      )}
    >
      {tag && (
        <Badge color={tagColor} className="mb-4">
          {tag}
        </Badge>
      )}
      <h2 className="text-h2 font-bold text-text-primary">{title}</h2>
      {lead && (
        <p className="mt-4 max-w-2xl text-body-lg text-text-secondary">{lead}</p>
      )}
    </Reveal>
  );
}

/** 工程观点引用块（左侧琥珀竖条） */
export function OpinionQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="rounded-r-xl border-l-[3px] border-c-plan bg-c-plan/5 px-5 py-4 text-body-sm text-text-secondary">
      {children}
    </blockquote>
  );
}

/** 引用块（左侧青色竖条） */
export function Quote({ children, cite }: { children: ReactNode; cite?: string }) {
  return (
    <blockquote className="rounded-r-xl border-l-[3px] border-c-perceive bg-c-perceive/5 px-5 py-4">
      <p className="text-body text-text-primary">{children}</p>
      {cite && (
        <cite className="mt-2 block font-mono text-caption not-italic text-text-tertiary">
          — {cite}
        </cite>
      )}
    </blockquote>
  );
}

/** 外链卡片：hover 右上角 ↗ 位移 (+2,-2) */
export function ExternalLinkCard({
  href,
  title,
  desc,
  icon,
  className,
}: {
  href: string;
  title: string;
  desc?: string;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors duration-[250ms] hover:border-border-strong",
        className,
      )}
    >
      {icon && <span className="mt-0.5 shrink-0 text-c-perceive">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-sm font-medium text-text-primary">
          {title}
        </span>
        {desc && (
          <span className="mt-0.5 block text-caption text-text-tertiary">{desc}</span>
        )}
      </span>
      <ArrowUpRight
        size={15}
        className="shrink-0 text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-c-perceive"
      />
    </a>
  );
}
