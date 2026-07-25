import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import PageHeader from "./PageHeader";
import CompareTable from "./CompareTable";
import DetailCards from "./DetailCards";
import Selector from "./Selector";

/** S5. 核实来源与免责 */
function Sources() {
  return (
    <section className="py-16">
      <motion.div
        className="mx-auto max-w-prose2 px-6 max-md:px-5"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.55 }}
      >
        <p className="border-t border-border-subtle pt-8 text-sm leading-relaxed text-text-tertiary">
          核实来源（2026 年中检索）：微软 Foundry 博客（MAF 整合）；langchain.com
          官方资源（1.0 发布与 star）；github.com/openai/openai-agents-python（Agents
          SDK）；IT之家（Coze 开源）；各对比页交叉验证 star 量级。star
          数为约数，框架状态可能变化——选型前请以官方仓库为准。
        </p>
      </motion.div>
    </section>
  );
}

/** S6. 章末导航 */
function ChapterNav() {
  return (
    <section className="pb-24">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-6 px-6 max-md:px-5">
        <Link
          to="/principles"
          className="group inline-flex items-center gap-2 text-body text-text-secondary transition-colors hover:text-c-perceive"
        >
          <ArrowLeft size={16} className="transition-transform duration-[250ms] group-hover:-translate-x-1" />
          原理知识库
        </Link>
        <Link to="/capstone" className="group text-right">
          <span className="block text-caption text-text-tertiary">选好兵器，开始造东西</span>
          <span className="inline-flex items-center gap-2 text-body-lg font-semibold text-text-primary transition-colors group-hover:text-c-perceive">
            下一站：实战项目教程
            <ArrowRight size={18} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}

/** 框架横评页 /frameworks */
export default function FrameworksPage() {
  return (
    <main>
      <PageHeader />
      <CompareTable />
      <DetailCards />
      <Selector />
      <Sources />
      <ChapterNav />
    </main>
  );
}
