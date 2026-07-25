import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";

/** MCP 专题页本地辅助组件（章节主色 = 工具绿） */

/** 琥珀警示面板（与框架页时效条同款）：边框自左扫入 + 内容 fade-up */
export function WarningPanel({
  title,
  children,
  className,
}: {
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        "relative flex items-start gap-3 overflow-hidden rounded-xl border border-c-plan/50 bg-c-plan/5 px-5 py-4",
        className,
      )}
    >
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-x-0 top-0 h-0.5 origin-left bg-c-plan"
      />
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-c-plan" />
      <p className="text-body-sm text-text-secondary">
        <strong className="font-semibold text-c-plan">{title}</strong>
        {children}
      </p>
    </motion.div>
  );
}

/** 实战步骤头：JetBrains Mono `STEP N` 绿字自 x:-24 滑入 + h3 */
export function StepHeader({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mt-16">
      <motion.span
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="block font-mono text-body-sm font-semibold tracking-[0.12em] text-c-tool"
      >
        STEP {n}
      </motion.span>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mt-2 text-h3 font-bold text-text-primary"
      >
        {title}
      </motion.h3>
      {children && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-3 text-body text-text-secondary"
        >
          {children}
        </motion.p>
      )}
    </div>
  );
}

/** 验收卡：绿色描边 + 左边框 scaleY 0→1 扫入 */
export function AcceptCard({
  children,
  label = "验收",
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mt-6 flex items-start gap-3 overflow-hidden rounded-xl border border-c-tool/50 bg-c-tool/5 px-5 py-4"
    >
      <motion.span
        aria-hidden
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute inset-y-0 left-0 w-[3px] origin-top bg-c-tool"
      />
      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-c-tool" />
      <p className="text-body-sm text-text-secondary">
        <strong className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-c-tool">
          {label}
        </strong>
        {children}
      </p>
    </motion.div>
  );
}

/** 绿色点睛引用块（左侧 3px 绿竖条） */
export function GreenQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote
      className="rounded-r-xl border-l-[3px] border-c-tool px-5 py-4"
      style={{ background: semanticAlpha(SEMANTIC.tool, 5) }}
    >
      <p className="text-body text-text-primary">{children}</p>
    </blockquote>
  );
}

/** 大号渐变强调句（青 → 绿） */
export function GradientStatement({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn("bg-clip-text text-h3 font-black text-transparent", className)}
      style={{
        backgroundImage:
          "linear-gradient(120deg, var(--c-perceive), var(--c-tool))",
      }}
    >
      {children}
    </p>
  );
}
