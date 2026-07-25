import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SEMANTIC } from "@/lib/semantic";
import { Badge, Reveal } from "@/components/ui-extra";

/** 章节号计数进场（00 → target，400ms） */
function CountUp({ value, color }: { value: number; color: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 400);
      setN(Math.round(p * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} style={{ color }}>
      {String(n).padStart(2, "0")}
    </span>
  );
}

/** 章标题：前置 JetBrains Mono 章节号（章节色）+ h2 */
export function ChapterHeading({
  id,
  index,
  title,
  color = SEMANTIC.plan,
}: {
  id: string;
  index: number;
  title: string;
  color?: string;
}) {
  return (
    <Reveal className="mb-10" y={24}>
      <div id={id} className="scroll-mt-28">
        <span className="mb-3 block font-mono text-body-sm font-semibold tracking-[0.12em]">
          <CountUp value={index} color={color} />
          <span className="ml-2 text-text-tertiary">/</span>
          <span className="ml-2 text-text-tertiary">CHAPTER</span>
        </span>
        <h2 className="text-h2 font-black text-text-primary">{title}</h2>
        <span
          aria-hidden
          className="mt-5 block h-0.5 w-16 rounded-full"
          style={{ background: color }}
        />
      </div>
    </Reveal>
  );
}

/** 小节标题（h3，如 2.1 ReAct） */
export function SubHeading({
  id,
  index,
  title,
  color = SEMANTIC.plan,
}: {
  id: string;
  index: string;
  title: string;
  color?: string;
}) {
  return (
    <div id={id} className="mb-6 mt-16 scroll-mt-28">
      <h3 className="flex flex-wrap items-baseline gap-3 text-h3 font-bold text-text-primary">
        <span className="font-mono text-body-sm font-semibold" style={{ color }}>
          {index}
        </span>
        {title}
      </h3>
    </div>
  );
}

/** 「通俗解释」段：青色小标签 + body-lg 段落（fade-up 500ms） */
export function Explain({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <span className="inline-block rounded-md border border-c-perceive/30 bg-c-perceive/10 px-2 py-0.5 font-mono text-caption tracking-[0.12em] text-c-perceive">
        通俗解释
      </span>
      <p className="mt-4 text-body-lg text-text-secondary">{children}</p>
    </motion.div>
  );
}

/** 「关键要点」列表：前置 ◆ 语义色方块 */
export function KeyPoints({
  items,
  color = SEMANTIC.plan,
  label = "关键要点",
}: {
  items: ReactNode[];
  color?: string;
  label?: string;
}) {
  return (
    <div className="mt-10">
      <p className="mb-4 flex items-center gap-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
        <span aria-hidden style={{ color }}>
          ◆
        </span>
        {label}
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 text-body text-text-secondary">
            <span
              aria-hidden
              className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rotate-45"
              style={{ background: color }}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** SVG 插图 + 图注（整体 fade-up 进场） */
export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: ReactNode;
}) {
  return (
    <Reveal className="my-10">
      <figure>
        <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-bg-1 p-3 sm:p-5">
          <img src={src} alt={alt} loading="lazy" className="w-full min-w-[560px]" />
        </div>
        <figcaption className="mt-3 text-center font-mono text-caption text-text-tertiary">
          {caption}
        </figcaption>
      </figure>
    </Reveal>
  );
}

/** arXiv 徽章（外链 arxiv.org/abs/…） */
export function ArxivBadge({ id }: { id: string }) {
  return (
    <a
      href={`https://arxiv.org/abs/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex transition-opacity hover:opacity-80"
    >
      <Badge color={SEMANTIC.plan}>ARXIV:{id}</Badge>
    </a>
  );
}

/** 论文出处行：mono caption + arXiv 徽章 */
export function PaperLine({ children }: { children: ReactNode }) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-caption text-text-tertiary">
      {children}
    </p>
  );
}

/** 定义卡：bg-2 圆角面板 + 左侧 3px 竖条 */
export function DefinitionCard({
  children,
  color = SEMANTIC.perceive,
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("my-8 rounded-xl border border-border-subtle bg-bg-2 px-6 py-5", className)}
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {children}
    </div>
  );
}
