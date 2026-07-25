import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Check,
  Github,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import { Link } from "react-router";
import CodeBlock from "@/components/CodeBlock";
import { Badge, SectionHeading } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha, semanticStyle } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import {
  CHEATSHEET_SEGMENTS,
  DETAILS,
  MAF_LINEAGE,
  type FrameworkDetail,
} from "./data";
import { scrollToId } from "./utils";

/** star 徽章（Space Grotesk，青色） */
function StarBadge({ repo, value, hero }: { repo: string; value: string; hero?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-c-perceive/30 bg-c-perceive/10 px-2 py-0.5 font-nums text-c-perceive",
        hero ? "text-base font-bold" : "text-xs",
      )}
    >
      <span className="font-mono text-[11px] text-text-tertiary">{repo}</span>★ {value}
    </span>
  );
}

/** 序号水印（背景大号 mono 序号，随滚动轻微视差 ±20px） */
function Watermark({ number }: { number: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  return (
    <motion.span
      ref={ref}
      aria-hidden
      style={{ y }}
      className="pointer-events-none absolute -top-6 right-4 select-none font-mono text-[120px] font-bold leading-none text-text-primary/[0.04] max-md:text-[80px]"
    >
      {number}
    </motion.span>
  );
}

/**
 * MAF 专属：血缘关系小图（AutoGen + Semantic Kernel → MAF）。
 * 纯 HTML/CSS + 内联 SVG 虚线绘制（非 SVG 资产）；前代方块可点击回看对应详情卡；
 * 合并箭头为 2s 循环的流动虚线。
 */
function LineageDiagram() {
  return (
    <div className="mt-5 rounded-xl border border-border-subtle bg-bg-2/50 px-4 py-4">
      <style>{`
        @keyframes maf-dash-flow { to { stroke-dashoffset: -18; } }
        .maf-dash { stroke-dasharray: 5 4; animation: maf-dash-flow 2s linear infinite; }
      `}</style>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-3">
        {/* 前代两方框（点击回看对应详情卡） */}
        <div className="flex flex-col gap-2">
          {MAF_LINEAGE.predecessors.map((p, i) => (
            <motion.button
              key={p.name}
              type="button"
              onClick={() => scrollToId(p.target)}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 17,
                delay: 0.3 + i * 0.12,
              }}
              className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-bg-1 px-3 py-2 text-left transition-colors duration-[250ms] hover:border-border-strong"
              title={`回看 ${p.name} 详情卡`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-[3px]"
                style={{ backgroundColor: p.color }}
              />
              <span className="font-mono text-xs font-medium text-text-primary">
                {p.name}
              </span>
              <span
                className="rounded border px-1 py-px font-mono text-[10px]"
                style={semanticStyle(p.color)}
              >
                {p.badge}
              </span>
            </motion.button>
          ))}
        </div>

        {/* 居中合并箭头（虚线扫入 600ms + 2s 流动循环） */}
        <motion.svg
          aria-hidden
          viewBox="0 0 72 64"
          className="h-14 w-16 shrink-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.54 }}
        >
          <path
            d="M4 14 C 34 14, 34 32, 56 32"
            className="maf-dash"
            fill="none"
            stroke={SEMANTIC.perceive}
            strokeWidth="1.5"
          />
          <path
            d="M4 50 C 34 50, 34 32, 56 32"
            className="maf-dash"
            fill="none"
            stroke={SEMANTIC.perceive}
            strokeWidth="1.5"
          />
          <path
            d="M54 25 L68 32 L54 39"
            fill="none"
            stroke={SEMANTIC.perceive}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>

        {/* MAF 结果方框（青色发光） */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 420, damping: 17, delay: 0.66 }}
          className="flex items-center gap-2.5 rounded-lg border px-3 py-2"
          style={{
            borderColor: semanticAlpha(SEMANTIC.perceive, 40),
            backgroundColor: semanticAlpha(SEMANTIC.perceive, 8),
          }}
        >
          <span
            className="h-3 w-3 shrink-0 rounded-[3px]"
            style={{
              backgroundColor: SEMANTIC.perceive,
              boxShadow: `0 0 10px ${semanticAlpha(SEMANTIC.perceive, 70)}`,
            }}
          />
          <span className="font-mono text-xs font-semibold text-c-perceive">
            {MAF_LINEAGE.merged.name}
          </span>
          <span
            className="rounded border px-1 py-px font-mono text-[10px]"
            style={semanticStyle(SEMANTIC.perceive)}
          >
            {MAF_LINEAGE.merged.badge}
          </span>
        </motion.div>
      </div>
      <p className="mt-3 font-mono text-[11px] text-text-tertiary">{MAF_LINEAGE.caption}</p>
    </div>
  );
}

/** 单张框架详情卡 */
function DetailCard({ detail: d }: { detail: FrameworkDetail }) {
  const [tab, setTab] = useState(0);
  const code = d.codes[tab];
  const isMaf = d.anchor === "detail-maf";
  const bold = d.boldPrefix ?? d.positioning.split("，")[0];

  return (
    <motion.article
      id={d.anchor}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55 }}
      className={cn(
        "relative scroll-mt-24 overflow-hidden rounded-2xl border bg-bg-1 p-8 transition-colors duration-[250ms] max-md:p-5",
        isMaf
          ? "border-c-perceive/30 hover:border-c-perceive/50"
          : "border-border-subtle hover:border-border-strong",
      )}
    >
      {/* MAF 专属：顶部 3px 青→紫渐变带（scaleX 0→1，700ms，延迟 200ms）——全页仅此卡 */}
      {isMaf && (
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-0 h-[3px] origin-left"
          style={{
            background: `linear-gradient(90deg, ${SEMANTIC.perceive}, ${SEMANTIC.memory})`,
          }}
        />
      )}

      <Watermark number={d.number} />

      {/* 头部：序号 + 名称 + 出品方 + star / 状态徽章 */}
      <header className="relative mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-caption tracking-widest text-text-tertiary">
            {d.number}
          </span>
          {d.lowCode && <Badge color={SEMANTIC.memory}>低代码</Badge>}
          <span
            className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs"
            style={semanticStyle(d.status.tone === "green" ? SEMANTIC.tool : SEMANTIC.plan)}
          >
            {d.status.label}
          </span>
          {d.langs?.map((l) => (
            <span
              key={l.label}
              className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-2 px-2 py-0.5 font-mono text-xs text-text-secondary"
            >
              {l.label}
              {l.note && <span className="text-[10px] text-c-perceive">{l.note}</span>}
            </span>
          ))}
          {/* MAF 专属：右上角渐变徽章「最新 GA · 2026.4.3」（白字，青紫渐变底） */}
          {isMaf && (
            <span
              className="ml-auto inline-flex items-center rounded-md px-2.5 py-1 font-nums text-xs font-bold text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${SEMANTIC.perceive}, ${SEMANTIC.memory})`,
              }}
            >
              最新 GA · 2026.4.3
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h3 className="text-h3 font-bold text-text-primary">{d.name}</h3>
          <span className="text-caption text-text-tertiary">{d.vendor}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {d.stars.map((s) => (
            <StarBadge key={s.repo} repo={s.repo} value={s.value} hero={d.starHero} />
          ))}
        </div>
      </header>

      <div className="relative grid gap-8 lg:grid-cols-[55fr_45fr]">
        {/* 左栏：信息 */}
        <div>
          <p className="text-body text-text-secondary">
            <strong className="font-semibold text-text-primary">{bold}</strong>
            {d.positioning.slice(bold.length)}
          </p>

          {/* MAF 专属：血缘关系小图（定位句下方） */}
          {isMaf && <LineageDiagram />}

          {d.migrationNote &&
            (d.migrationTarget ? (
              <button
                type="button"
                onClick={() => scrollToId(d.migrationTarget!)}
                className="mt-4 flex w-full items-start gap-2 rounded-lg border border-c-perceive/40 bg-c-perceive/5 px-3.5 py-2.5 text-left text-body-sm text-c-perceive transition-colors duration-[250ms] hover:border-c-perceive hover:bg-c-perceive/10"
              >
                <ArrowUp size={15} className="mt-0.5 shrink-0" />
                {d.migrationNote}
              </button>
            ) : (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-c-plan/40 bg-c-plan/5 px-3.5 py-2.5 text-body-sm text-c-plan">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" />
                {d.migrationNote}
              </p>
            ))}

          {d.highlight && (
            <p className="mt-4 flex items-center gap-2 text-body-sm font-medium">
              <Sparkles size={15} className="shrink-0 text-c-tool" />
              <span className="text-grad font-nums text-base font-bold">{d.highlight}</span>
            </p>
          )}

          {/* 核心概念 Chips */}
          <div className="mt-5">
            <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
              核心概念
            </p>
            <div className="flex flex-wrap gap-1.5">
              {d.concepts.map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-border-subtle bg-bg-2 px-2 py-0.5 font-mono text-xs text-c-tool"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* 适用场景 */}
          <p className="mt-5 text-body-sm text-text-secondary">
            <span className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
              适用场景
            </span>
            {d.scenarios}
          </p>

          {/* 优点 / 缺点 */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-c-tool">
                优点
              </p>
              <ul className="space-y-1.5">
                {d.pros.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-body-sm text-text-secondary">
                    <Check size={14} className="mt-1 shrink-0 text-c-tool" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-c-loop">
                缺点
              </p>
              <ul className="space-y-1.5">
                {d.cons.map((c) => (
                  <li key={c} className="flex items-start gap-1.5 text-body-sm text-text-secondary">
                    <X size={14} className="mt-1 shrink-0 text-c-loop" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 一句差异定位（bg-2 小卡，mono 引述） */}
          {d.diffNote && (
            <p className="mt-5 rounded-lg bg-bg-2 px-4 py-3 font-mono text-[13px] leading-relaxed text-text-secondary">
              {d.diffNote}
            </p>
          )}

          {/* GitHub 外链 */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {d.github.map((g) => (
              <span key={g.url} className="inline-flex items-center gap-2">
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3.5 py-2 font-mono text-[13px] text-text-secondary transition-colors hover:border-c-perceive hover:text-c-perceive"
                >
                  <Github size={15} />
                  {g.label}
                  <span className="transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
                {g.meta && (
                  <span className="font-mono text-caption text-text-tertiary">{g.meta}</span>
                )}
              </span>
            ))}
          </div>

          {/* OpenAI Agents SDK 专属：Capstone 内链 */}
          {d.anchor === "detail-agents-sdk" && (
            <Link
              to="/capstone"
              className="group mt-4 inline-flex items-center gap-1.5 text-body-sm text-c-perceive"
            >
              本站 Capstone 教程使用此 SDK
              <ArrowRight
                size={14}
                className="transition-transform duration-[250ms] group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* 右栏：代码示例 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          {d.codes.length > 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {d.codes.map((c, i) => (
                <button
                  key={c.filename}
                  type="button"
                  onClick={() => setTab(i)}
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-xs transition-all duration-[250ms]",
                    tab === i
                      ? "border-c-tool bg-c-tool/15 text-c-tool"
                      : "border-border-subtle bg-bg-1 text-text-secondary hover:border-border-strong hover:text-text-primary",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          <CodeBlock
            key={code.filename}
            code={code.code}
            language="python"
            filename={code.filename}
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

/** S3. 框架详情卡 ×10 + 第 11 张速查收口卡 */
export default function DetailCards() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="DEEP DIVE"
          tagColor={SEMANTIC.tool}
          title="逐框架详情：定位、优缺点与最小示例"
          lead="每张卡包含一句话定位、核心概念、真实优缺点与可直接运行的最小代码示例。"
        />
        <div className="space-y-12">
          {DETAILS.map((d) => (
            <DetailCard key={d.anchor} detail={d} />
          ))}

          {/* 11 · 收口速查卡 */}
          <motion.aside
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-2xl border border-c-tool/40 bg-bg-1 p-8 max-md:p-5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
              style={{ background: `linear-gradient(90deg, ${SEMANTIC.tool}, transparent)` }}
            />
            <p className="mb-3 font-mono text-caption tracking-widest text-text-tertiary">11</p>
            <h3 className="mb-4 text-h3 font-bold text-text-primary">速查表</h3>
            <p className="font-mono text-body-sm leading-loose">
              {CHEATSHEET_SEGMENTS.map((s) => (
                <span
                  key={s.text}
                  className={s.accent ? "font-semibold text-c-tool" : "text-text-secondary"}
                >
                  {s.text}
                </span>
              ))}
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
