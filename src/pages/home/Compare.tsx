import { motion } from "framer-motion";
import { MessageSquare, Workflow, RefreshCcw } from "lucide-react";
import { SectionHeading } from "@/components/ui-extra";
import { cn } from "@/lib/utils";

/**
 * S3. 与 Chatbot 的区别 —— 三段对比（数据取自 principles brief §1）
 */
const CARDS = [
  {
    name: "Chatbot",
    icon: MessageSquare,
    highlight: false,
    rows: [
      ["交互模式", "一问一答"],
      ["决策权", "无（只生成文本）"],
      ["环境反馈", "不感知"],
      ["适用场景", "问答、闲聊"],
    ],
  },
  {
    name: "工作流",
    en: "Workflow",
    icon: Workflow,
    highlight: false,
    rows: [
      ["交互模式", "固定流程自动执行"],
      ["决策权", "人预先编排步骤"],
      ["环境反馈", "按预设处理"],
      ["适用场景", "流程确定、高频重复"],
    ],
  },
  {
    name: "Agent",
    en: "智能体",
    icon: RefreshCcw,
    highlight: true,
    rows: [
      ["交互模式", "多步自主循环"],
      ["决策权", "模型动态决定下一步"],
      ["环境反馈", "每步观察结果并调整"],
      ["适用场景", "目标明确但路径不确定的任务"],
    ],
  },
] as const;

export default function Compare() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="03 · 对比"
          tagColor="#A78BFA"
          title="它不只是聊天机器人"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.12 + (c.highlight ? 0.15 : 0),
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={cn(
                  "group relative rounded-2xl border bg-bg-1 p-6 transition-all duration-[250ms] hover:-translate-y-1.5",
                  c.highlight
                    ? "border-c-perceive/70 shadow-[0_0_40px_rgba(56,189,248,.08)] hover:border-c-perceive"
                    : "border-border-subtle hover:border-border-strong",
                )}
              >
                {c.highlight && (
                  <>
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-grad-main px-3 py-0.5 font-mono text-[11px] font-medium tracking-wider text-white">
                      这是你要构建的
                    </span>
                    <span
                      className="pointer-events-none absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          "radial-gradient(70% 50% at 50% 0%, rgba(56,189,248,.07), transparent 70%)",
                      }}
                    />
                  </>
                )}
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "rounded-lg border p-2",
                      c.highlight
                        ? "border-c-perceive/40 bg-c-perceive/10 text-c-perceive"
                        : "border-border-subtle bg-bg-2 text-text-secondary",
                    )}
                  >
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-h4 font-bold text-text-primary">
                      {c.name}
                    </h3>
                    {"en" in c && c.en && (
                      <p className="text-caption text-text-tertiary">{c.en}</p>
                    )}
                  </div>
                </div>
                <dl className="mt-5 space-y-3">
                  {c.rows.map(([k, v]) => (
                    <div key={k} className="flex gap-3">
                      <dt className="w-[68px] shrink-0 text-caption text-text-tertiary">
                        {k}
                      </dt>
                      <dd
                        className={cn(
                          "text-[15px]",
                          c.highlight ? "text-text-primary" : "text-text-secondary",
                        )}
                      >
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            );
          })}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 text-center font-mono text-caption text-text-tertiary"
        >
          判断标准：下一步做什么由谁决定？代码决定 = 工作流，模型决定 = Agent。
        </motion.p>
      </div>
    </section>
  );
}
