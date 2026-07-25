import { Link } from "react-router";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge, SectionHeading } from "@/components/ui-extra";

/**
 * S4. 学习路径总览 —— 五阶段 · 10–15 周（数据取自 learning-path brief §一）
 */
const STAGES = [
  {
    n: 1,
    name: "基础",
    color: "#38BDF8",
    topics: "LLM 基础、提示工程、API 调用",
    weeks: "1–2 周",
    output: "命令行 Chatbot",
  },
  {
    n: 2,
    name: "原理",
    color: "#FBBF24",
    topics: "Agent 架构、ReAct、规划与记忆",
    weeks: "1–2 周",
    output: '手写 50 行"裸 Agent 循环"',
  },
  {
    n: 3,
    name: "框架",
    color: "#34D399",
    topics: "深入 LangGraph 或 OpenAI Agents SDK",
    weeks: "2–3 周",
    output: "用框架重写裸 Agent + 真实工具",
  },
  {
    n: 4,
    name: "技能进阶",
    color: "#A78BFA",
    topics: "RAG、工具设计、记忆、评估与调试",
    weeks: "3–4 周",
    output: "带 RAG + 记忆的问答 Agent + 评估报告",
  },
  {
    n: 5,
    name: "实战",
    color: "#F472B6",
    topics: "独立完成完整 Agent 项目",
    weeks: "3–4 周",
    output: "《个人研究助理 Agent》完整仓库 + 演示 + 复盘",
  },
] as const;

export default function PathOverview() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="04 · 路线图"
          tagColor="#FBBF24"
          title={
            <>
              五阶段 · <span className="font-display text-grad">10–15</span> 周
            </>
          }
          lead="每个阶段都以可运行代码 + 一篇学习笔记双产出收尾"
        />

        {/* 横向时间线 */}
        <div className="relative">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[6px] hidden h-0.5 origin-left bg-border-strong lg:block"
            aria-hidden
          />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-5">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 48 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.1 }}
                className="relative lg:pt-7"
              >
                {/* 时间节点 */}
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.1 + i * 0.15 }}
                  className="absolute -top-[0px] left-0 hidden h-3 w-3 rounded-full lg:block"
                  style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }}
                  aria-hidden
                />
                <Link
                  to={`/path#stage-${s.n}`}
                  className="group relative block h-full overflow-hidden rounded-2xl border border-border-subtle bg-bg-1 p-5 transition-all duration-[250ms] hover:-translate-y-1 hover:border-border-strong"
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-[250ms] group-hover:opacity-100"
                    style={{ background: s.color }}
                  />
                  <span
                    className="pointer-events-none absolute -right-2 -top-4 font-display text-5xl font-bold"
                    style={{ color: `${s.color}33` }}
                    aria-hidden
                  >
                    {s.n}
                  </span>
                  <p className="font-mono text-caption tracking-widest text-text-tertiary">
                    阶段 {s.n}
                  </p>
                  <h3 className="mt-1.5 text-h3 font-bold" style={{ color: s.color }}>
                    {s.name}
                  </h3>
                  <p className="mt-2.5 text-body-sm text-text-secondary">{s.topics}</p>
                  <div className="mt-3">
                    <Badge color={s.color}>{s.weeks}</Badge>
                  </div>
                  <p className="mt-3.5 flex items-start gap-1.5 text-caption text-text-tertiary">
                    <Check size={13} className="mt-0.5 shrink-0 text-c-tool" />
                    产出：{s.output}
                  </p>
                  <p className="mt-3 text-[13px] text-text-secondary transition-colors group-hover:text-c-perceive">
                    查看详情
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      {" "}
                      →
                    </span>
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
