import { motion } from "framer-motion";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { Badge } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";

const TITLE_A = "十把兵器，";
const TITLE_B = "该选哪一把";

/** S1. 页头（本页主色 = 工具绿） */
export default function PageHeader() {
  return (
    <section className="bg-grid-texture relative overflow-hidden pb-16 pt-40 max-md:pt-28">
      {/* 绿色光晕 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${semanticAlpha(SEMANTIC.tool, 8)}, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-prose2 px-6 max-md:px-5">
        {/* 面包屑 */}
        <nav className="mb-6 flex items-center gap-1.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <Link to="/" className="transition-colors hover:text-c-perceive">
            HOME
          </Link>
          <ChevronRight size={12} />
          <span className="text-c-tool">框架横评</span>
        </nav>

        <Badge color={SEMANTIC.tool} className="mb-5">
          11 个框架 · 数据核实于 2026 年中
        </Badge>

        {/* h1：word stagger */}
        <h1 className="text-h1 font-black text-text-primary">
          {TITLE_A.split("").map((ch, i) => (
            <motion.span
              key={`a-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          <span className="text-grad">
            {TITLE_B.split("").map((ch, i) => (
              <motion.span
                key={`b-${i}`}
                className="inline-block"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: (TITLE_A.length + i) * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          className="mt-6 text-body-lg text-text-secondary"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5 }}
        >
          2025–2026 年 Agent 框架格局经历大整合。我们核实了每个框架的真实 GitHub
          数据、维护状态与最小可运行示例，按你的场景给出选型建议。
        </motion.p>

        {/* 时效提示条：琥珀描边通告面板 */}
        <motion.div
          className="mt-8 flex items-start gap-3 rounded-xl border border-c-plan/50 bg-c-plan/5 px-5 py-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-c-plan" />
          <p className="text-body-sm text-text-secondary">
            <strong className="font-semibold text-c-plan">格局变动：</strong>
            微软 2025.10 推出统一的 Microsoft Agent Framework，
            <strong className="font-semibold text-text-primary">2026.4.3 发布 1.0 GA</strong>
            （AutoGen 与 Semantic Kernel 进入维护模式，MAF
            成为微软唯一长期投资方向）；LangChain/LangGraph 2025.10.22 联合发布 1.0；OpenAI
            Swarm 已于 2025.3 归档，由 Agents SDK 接替。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
