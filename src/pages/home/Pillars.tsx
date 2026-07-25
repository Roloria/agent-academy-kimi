import { Link } from "react-router";
import { motion } from "framer-motion";
import { CircleDot, Table2, TerminalSquare } from "lucide-react";
import { SectionHeading } from "@/components/ui-extra";

/**
 * S5. 三大内容支柱 —— 「学什么，都在这里」
 */
const PILLARS = [
  {
    id: "01",
    title: "原理知识库",
    color: "#FBBF24",
    icon: CircleDot,
    desc: "从 ReAct 到 Reflexion，从记忆系统到 MCP 协议与多智能体协作——用「通俗解释 + 关键要点 + 伪代码」三段式讲透 Agent 的内部机制。",
    stats: "6 大章节 · 5 种推理范式 · 13 条可验证来源",
    cta: "进入知识库",
    to: "/principles",
  },
  {
    id: "02",
    title: "框架横评",
    color: "#34D399",
    icon: Table2,
    desc: "LangChain/LangGraph、OpenAI Agents SDK、CrewAI、smolagents、Dify、Coze……10 大主流框架的定位、优缺点、最小代码示例与场景化选型建议。",
    stats: "10 个框架 · 真实 GitHub 数据 · 4 类选型场景",
    cta: "查看横评",
    to: "/frameworks",
  },
  {
    id: "03",
    title: "实战项目",
    color: "#F472B6",
    icon: TerminalSquare,
    desc: "8 个步骤、全部真实可运行代码，用 OpenAI Agents SDK 构建《个人研究助理 Agent》：自动规划、搜索、阅读、综合，生成带引用的研究报告。",
    stats: "8 步教程 · 3+ 工具 · 含评估与部署",
    cta: "开始实战",
    to: "/capstone",
  },
] as const;

export default function Pillars() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="05 · 内容模块"
          tagColor="#34D399"
          title="学什么，都在这里"
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 56 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                whileHover={{ scale: 1.02 }}
                className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border-subtle bg-bg-1 p-7 transition-colors duration-300 hover:border-border-strong"
              >
                {/* 渐变大字水印 */}
                <span
                  className="pointer-events-none absolute -bottom-8 -right-3 select-none font-display text-[120px] font-bold leading-none opacity-5 transition-opacity duration-300 group-hover:opacity-10"
                  style={{
                    background: `linear-gradient(135deg, ${p.color}, transparent)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                  aria-hidden
                >
                  {p.id}
                </span>

                <p className="font-mono text-caption tracking-[0.2em] text-text-tertiary">
                  MODULE {p.id}/03
                </p>
                <span
                  className="mt-5 inline-flex w-fit rounded-xl border p-3"
                  style={{
                    color: p.color,
                    borderColor: `${p.color}4D`,
                    backgroundColor: `${p.color}14`,
                  }}
                >
                  <Icon size={24} />
                </span>
                <h3 className="mt-5 text-h3 font-bold text-text-primary">{p.title}</h3>
                <p className="mt-3 flex-1 text-body-sm text-text-secondary">{p.desc}</p>
                <p className="mt-4 font-mono text-caption text-text-tertiary">
                  {p.stats}
                </p>
                <Link
                  to={p.to}
                  className="mt-6 inline-flex w-fit items-center gap-1.5 text-[15px] font-medium transition-colors"
                  style={{ color: p.color }}
                >
                  {p.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
