import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Check, Github, Sparkles, TriangleAlert, X } from "lucide-react";
import { Link } from "react-router";
import CodeBlock from "@/components/CodeBlock";
import { Badge, SectionHeading } from "@/components/ui-extra";
import { SEMANTIC, semanticStyle } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import { CHEATSHEET, DETAILS, type FrameworkDetail } from "./data";

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

/** 单张框架详情卡 */
function DetailCard({ detail: d }: { detail: FrameworkDetail }) {
  const [tab, setTab] = useState(0);
  const code = d.codes[tab];

  return (
    <motion.article
      id={d.anchor}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55 }}
      className="relative scroll-mt-24 overflow-hidden rounded-2xl border border-border-subtle bg-bg-1 p-8 transition-colors duration-[250ms] hover:border-border-strong max-md:p-5"
    >
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
            <strong className="font-semibold text-text-primary">
              {d.positioning.split("，")[0]}
            </strong>
            {d.positioning.slice(d.positioning.split("，")[0].length)}
          </p>

          {d.migrationNote && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-c-plan/40 bg-c-plan/5 px-3.5 py-2.5 text-body-sm text-c-plan">
              <TriangleAlert size={15} className="mt-0.5 shrink-0" />
              {d.migrationNote}
            </p>
          )}

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

          {/* GitHub 外链 */}
          <div className="mt-6 flex flex-wrap gap-3">
            {d.github.map((g) => (
              <a
                key={g.url}
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

/** S3. 框架详情卡 ×10（第 10 张为速查收口卡） */
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

          {/* 10 · 收口速查卡 */}
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
            <p className="mb-3 font-mono text-caption tracking-widest text-text-tertiary">10</p>
            <h3 className="mb-4 text-h3 font-bold text-text-primary">速查表</h3>
            <p className="font-mono text-body-sm leading-loose text-c-tool">{CHEATSHEET}</p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
