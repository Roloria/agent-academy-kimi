import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  ExternalLink,
  Github,
  Rocket,
  Star,
} from "lucide-react";
import CodeBlock, { ReplayButton } from "@/components/CodeBlock";
import { Badge, OpinionQuote, Reveal } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import {
  CODE_STEP1_CONFIG,
  CODE_STEP1_ENV,
  CODE_STEP1_TERMINAL,
  CODE_STEP2_TOOLS,
  CODE_STEP3_AGENT,
  CODE_STEP4_MAIN,
  CODE_STEP5_WRITER,
  CODE_STEP6_EVAL,
  CODE_STEP7_LOGGING,
  CODE_STEP8_HOSTED,
  DEMO_LINES,
} from "./code";

const LOOP = SEMANTIC.loop; // 章节主色：循环粉
const TOOL = SEMANTIC.tool;

/* ---------------------------------- 通用 ---------------------------------- */

function Breadcrumb() {
  return (
    <nav className="mb-8 flex items-center gap-1.5 font-mono text-caption text-text-tertiary">
      <Link to="/" className="transition-colors hover:text-c-perceive">
        HOME
      </Link>
      <ChevronRight size={13} />
      <span className="text-text-secondary">实战项目</span>
    </nav>
  );
}

/** 终端演示卡：延迟 600ms 逐行打印（每行 450ms），附重放 */
function TerminalDemo() {
  const [count, setCount] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setCount(0);
    let interval: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= DEMO_LINES.length) {
            if (interval) clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, 450);
    }, 600);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [runId]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-caption text-text-tertiary">
          最终效果 · 一次真实运行
        </span>
        <ReplayButton onClick={() => setRunId((n) => n + 1)} />
      </div>
      <CodeBlock
        type="terminal"
        code={DEMO_LINES.slice(0, count).join("\n") || " "}
        className="min-h-[calc(6*1.7*14.5px+90px)]"
      />
    </div>
  );
}

/** 验收卡：绿色描边面板 + ✓ 清单 */
function ChecklistCard({ items }: { items: ReactNode[] }) {
  return (
    <Reveal className="relative mt-8 overflow-hidden rounded-xl border border-c-tool/30 bg-c-tool/5 p-5">
      <motion.span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px] origin-top bg-c-tool"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
      />
      <Badge color={TOOL} className="mb-3">
        验收
      </Badge>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <motion.li
            key={i}
            className="flex items-start gap-2.5 text-body-sm text-text-secondary"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.15 + i * 0.1, duration: 0.3 }}
          >
            <Check size={15} className="mt-1 shrink-0 text-c-tool" />
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>
    </Reveal>
  );
}

/** 步骤头：STEP N 粉字 + h2 + 一句话说明 */
function StepHeader({
  no,
  title,
  lead,
}: {
  no: number;
  title: string;
  lead: ReactNode;
}) {
  return (
    <div className="mb-6">
      <motion.span
        className="mb-2 block font-mono text-body-sm font-semibold tracking-[0.12em] text-c-loop"
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.4 }}
      >
        STEP {no}
      </motion.span>
      <h2 className="text-h2 font-bold text-text-primary">{title}</h2>
      <p className="mt-3 text-body-lg text-text-secondary">{lead}</p>
    </div>
  );
}

function StepSection({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <section id={id} data-step className="scroll-mt-24">
      {children}
      {/* 步骤之间：粉色渐变细线 */}
      <motion.div
        aria-hidden
        className="mt-16 h-px origin-left bg-gradient-to-r from-c-loop/60 via-c-loop/20 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.7 }}
      />
    </section>
  );
}

/** 正文段落 */
function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 max-w-[68ch] text-body text-text-secondary">{children}</p>;
}

/** 高亮小卡（工具设计三原则等） */
function InfoCard({
  title,
  color = SEMANTIC.plan,
  children,
}: {
  title: string;
  color?: string;
  children: ReactNode;
}) {
  return (
    <div
      className="my-6 rounded-xl border bg-bg-1 p-5"
      style={{ borderColor: `${color}4D` }}
    >
      <span
        className="mb-3 block font-mono text-caption font-semibold uppercase tracking-[0.12em]"
        style={{ color }}
      >
        {title}
      </span>
      <div className="space-y-2 text-body-sm text-text-secondary">{children}</div>
    </div>
  );
}

/* --------------------------------- 步骤导航 --------------------------------- */

const STEPS = [
  { id: "step-1", no: 1, title: "环境搭建" },
  { id: "step-2", no: 2, title: "定义工具" },
  { id: "step-3", no: 3, title: "设计 Agent 循环" },
  { id: "step-4", no: 4, title: "加入记忆" },
  { id: "step-5", no: 5, title: "结构化报告" },
  { id: "step-6", no: 6, title: "评估与改进" },
  { id: "step-7", no: 7, title: "加固与打磨" },
  { id: "step-8", no: 8, title: "部署与分享（可选）" },
];

function useStepSpy() {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const sections = STEPS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target as HTMLElement);
            if (idx >= 0) setActiveIdx(idx);
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return activeIdx;
}

/** 左侧 sticky 步骤 TOC（≥xl 显示） */
function StepToc({ activeIdx }: { activeIdx: number }) {
  return (
    <aside className="sticky top-24 hidden w-[240px] shrink-0 self-start xl:block">
      <p className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
        教程步骤
      </p>
      <ol className="space-y-1">
        {STEPS.map((step, i) => {
          const done = i < activeIdx;
          const active = i === activeIdx;
          return (
            <li key={step.id}>
              <a
                href={`#${step.id}`}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-2 py-2 text-body-sm transition-colors",
                  active
                    ? "bg-bg-2 text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                <motion.span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                    done
                      ? "border-c-loop bg-c-loop text-bg-0"
                      : active
                        ? "border-c-loop"
                        : "border-border-strong",
                  )}
                  animate={done ? { scale: [0.6, 1] } : { scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
                >
                  {done ? (
                    <Check size={11} strokeWidth={3} />
                  ) : (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        active ? "bg-c-loop" : "bg-border-strong",
                      )}
                    />
                  )}
                </motion.span>
                <span>
                  <span className="mr-1.5 font-mono text-caption">{step.no}</span>
                  {step.title}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <Link
        to="/path"
        className="group mt-6 block rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors hover:border-border-strong"
      >
        <span className="block text-caption text-text-tertiary">前置要求</span>
        <span className="mt-1 flex items-center gap-1 text-body-sm text-text-primary">
          完成学习路径阶段 1–3
          <ArrowRight
            size={14}
            className="text-c-loop transition-transform group-hover:translate-x-1"
          />
        </span>
      </Link>
    </aside>
  );
}

/** 移动端步骤导航（横向滚动条） */
function MobileStepNav({ activeIdx }: { activeIdx: number }) {
  return (
    <div className="sticky top-16 z-30 -mx-5 mb-10 overflow-x-auto border-b border-border-subtle bg-bg-0/85 px-5 py-3 backdrop-blur-md xl:hidden">
      <div className="flex gap-2">
        {STEPS.map((step, i) => (
          <a
            key={step.id}
            href={`#${step.id}`}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-caption transition-colors",
              i === activeIdx
                ? "border-c-loop/50 bg-c-loop/10 text-c-loop"
                : "border-border-subtle text-text-tertiary",
            )}
          >
            {step.no} {step.title}
          </a>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- 页面主体 --------------------------------- */

const TECH_CHIPS = [
  "OpenAI Agents SDK",
  "Tavily API",
  "httpx + trafilatura",
  "SQLiteSession",
  "Tracing",
];

export default function CapstonePage() {
  const activeIdx = useStepSpy();

  return (
    <div className="relative">
      {/* 背景：工程网格 + 粉色光晕 */}
      <div aria-hidden className="bg-grid-texture pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[480px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(244,114,182,0.08), transparent 65%)" }}
      />

      <div className="relative mx-auto max-w-content px-5 md:px-6">
        <div className="xl:flex xl:gap-14">
          <StepToc activeIdx={activeIdx} />

          <div className="min-w-0 max-w-prose2 flex-1 pb-24">
            <MobileStepNav activeIdx={activeIdx} />

            {/* ---------------- S1 页头 + 项目演示 ---------------- */}
            <header className="pb-20 pt-16 md:pt-24">
              <Breadcrumb />
              <Reveal className="mb-5 flex flex-wrap items-center gap-2">
                <Badge color={LOOP}>Capstone</Badge>
                <Badge color={SEMANTIC.perceive}>8 步</Badge>
                <Badge color={SEMANTIC.tool}>Python 3.11+</Badge>
                <Badge color={SEMANTIC.memory}>openai-agents</Badge>
              </Reveal>
              <Reveal delay={0.05}>
                <h1 className="text-h1 font-black text-text-primary">
                  造一个<span className="text-grad">个人研究助理 Agent</span>
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-[68ch] text-body-lg text-text-secondary">
                  输入一个研究主题，它自动规划子问题、搜索网页、抓取并阅读页面、交叉比对来源，最终生成一份带引用的结构化
                  Markdown 研究报告并保存到本地。走完这 8
                  步，你就拥有了一个可写进简历的完整 Agent 项目。
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-6 flex flex-wrap gap-2">
                {TECH_CHIPS.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-md border border-border-subtle bg-bg-1 px-2.5 py-1 font-mono text-caption text-text-secondary"
                  >
                    {chip}
                  </span>
                ))}
              </Reveal>
              <Reveal delay={0.2} className="mt-10">
                <TerminalDemo />
              </Reveal>
            </header>

            {/* ---------------- STEP 1 环境搭建 ---------------- */}
            <StepSection id="step-1">
              <StepHeader
                no={1}
                title="环境搭建"
                lead="创建虚拟环境，安装依赖，用环境变量管理密钥。"
              />
              <P>
                两套搜索方案任选：方案 A 使用 OpenAI 托管 <code>WebSearchTool</code>
                （无需额外密钥，最简单）；方案 B 使用
                Tavily（搜索质量可控、免费额度充足）。教程主体用方案
                B（工具自己写，更能学到东西），步骤 8 给出方案 A 的一行替换。
              </P>
              <div className="space-y-6">
                <CodeBlock type="terminal" code={CODE_STEP1_TERMINAL} />
                <CodeBlock language="bash" filename=".env" code={CODE_STEP1_ENV} showLineNumbers={false} />
                <CodeBlock language="python" filename="config.py" code={CODE_STEP1_CONFIG} />
              </div>
              <ChecklistCard
                items={[
                  <>
                    运行{" "}
                    <code>python -c "from agents import Agent; print('ok')"</code>{" "}
                    正常输出 <code>ok</code>。
                  </>,
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 2 定义工具 ---------------- */}
            <StepSection id="step-2">
              <StepHeader
                no={2}
                title="定义工具（搜索 / 抓取 / 写文件）"
                lead="用 @function_tool 装饰普通 Python 函数，即可变成 Agent 工具。"
              />
              <InfoCard title="工具设计三原则 · 呼应阶段 4">
                <p>① 函数名和 docstring 就是给模型看的“使用说明书”，必须写清何时用、返回什么；</p>
                <p>② 返回值要截断，避免爆上下文；</p>
                <p>③ 错误要“说人话”地返回给模型而不是抛异常，让 Agent 能自我恢复。</p>
              </InfoCard>
              <CodeBlock language="python" filename="tools.py" code={CODE_STEP2_TOOLS} />
              <OpinionQuote>
                工具先单测，再接 Agent，这是最重要的调试纪律。
              </OpinionQuote>
              <ChecklistCard
                items={[
                  "单独写个脚本手动调用三个工具各一次，确认输出格式符合预期。",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 3 设计 Agent 循环 ---------------- */}
            <StepSection id="step-3">
              <StepHeader
                no={3}
                title="设计 Agent 循环"
                lead="Runner.run() 内置了完整的 ReAct 循环，你只需要写好 instructions。"
              />
              <P>
                OpenAI Agents SDK 的 <code>Runner.run()</code> 内置了“模型输出 → 工具调用 →
                结果回填 → 再调模型”的完整循环（即 ReAct 循环的工程化封装），
                <code>max_turns</code> 防止无限循环。我们只需要写好
                instructions——研究助理的工作流程要在这里显式规定（先规划子问题 →
                逐个子问题搜索 → 挑 2-3 篇深读 → 综合成文）。
              </P>
              <CodeBlock language="python" filename="agent.py" code={CODE_STEP3_AGENT} />
              <InfoCard title="这就是 ReAct" color={SEMANTIC.perceive}>
                <p>
                  把第 2 章学到的 Thought → Action → Observation
                  轨迹，对应到 Runner 的循环上——SDK
                  只是把这个循环做了工程化封装。→{" "}
                  <Link
                    to="/principles#react"
                    className="text-c-perceive underline-offset-4 hover:underline"
                  >
                    回到原理知识库复习 ReAct
                  </Link>
                </p>
              </InfoCard>
              <ChecklistCard
                items={[
                  <>
                    跑一个简单主题，确认 Agent 按“规划 → 搜索 → 阅读 → 保存”顺序行动；
                  </>,
                  <>
                    <code>reports/</code> 目录下生成了报告文件。
                  </>,
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 4 加入记忆 ---------------- */}
            <StepSection id="step-4">
              <StepHeader
                no={4}
                title="加入记忆"
                lead="两层记忆：会话记忆让多轮追问不重跑，长期记忆记住你研究过什么。"
              />
              <P>
                ① 会话记忆：用 SDK 自带的 <code>SQLiteSession</code>，同一 session
                内多轮追问（“把第 2 节展开”）不用重跑研究；②
                长期记忆（选做）：把每次研究的元信息（主题、结论摘要、报告路径）追加到{" "}
                <code>memory/research_log.md</code>，在 instructions
                里注入，实现“记住我上次研究过什么”。
              </P>
              <CodeBlock language="python" filename="main.py" code={CODE_STEP4_MAIN} />
              <ChecklistCard
                items={[
                  "第一轮“研究 X”，第二轮追问“刚才的报告里第 3 节提到的数据来源是什么？”",
                  "Agent 应能引用上下文回答，而无需重新搜索。",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 5 生成结构化研究报告 ---------------- */}
            <StepSection id="step-5">
              <StepHeader
                no={5}
                title="生成结构化研究报告"
                lead="报告质量的关键是输出契约：固定骨架 + 明确的写作约束。"
              />
              <P>
                做法：定义报告的固定骨架（Pydantic 模型或强约束的 Markdown
                模板），并在工具 docstring 中写明；更进阶的做法是拆出第二个“写作
                Agent”，研究 Agent 收集素材后把素材交给写作 Agent
                成文（多 Agent 分工的入门形态）。
              </P>
              <CodeBlock language="python" filename="writer.py" code={CODE_STEP5_WRITER} />
              <ChecklistCard
                items={[
                  "生成的报告有摘要；",
                  "每节 ≥ 1 个来源标注；",
                  "参考来源 URL 全部真实出现在搜索结果中（可脚本校验）。",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 6 评估与改进 ---------------- */}
            <StepSection id="step-6">
              <StepHeader
                no={6}
                title="评估与改进"
                lead="先观测、再评估、后迭代——用数据驱动 prompt 迭代。"
              />
              <P>
                OpenAI Agents SDK 默认开启 Tracing（在 platform.openai.com 的
                Traces 页查看每一步工具调用），也可用 LangSmith（设{" "}
                <code>LANGCHAIN_TRACING_V2=true</code>{" "}
                并用其 OpenAI 包装器）。评估方法：建一个 10-15
                条主题的数据集，用 LLM-as-judge
                按“来源真实性 / 覆盖度 / 结构完整性”三维度打分，迭代
                instructions 后对比分数。
              </P>
              <CodeBlock language="python" filename="eval.py" code={CODE_STEP6_EVAL} />
              <InfoCard title="改进清单 · 按收益排序" color={SEMANTIC.loop}>
                <p>① 搜索 query 太宽泛 → 在 instructions 里加“关键词应包含限定词（年份/地区/对象）”；</p>
                <p>② 引用幻觉 → 要求引用格式为 <code>[n] 完整 URL</code> 并脚本校验 URL 是否来自搜索返回；</p>
                <p>③ 报告浅 → 强制“每个子问题至少深读 1 页”。</p>
              </InfoCard>
              <ChecklistCard
                items={[
                  "数据集均分有量化记录；",
                  "至少完成一轮“发现问题 → 修改 → 复测”闭环。",
                ]}
              />
            </StepSection>

            {/* ---------------- STEP 7 加固与打磨 ---------------- */}
            <StepSection id="step-7">
              <StepHeader
                no={7}
                title="加固与打磨"
                lead="上线前补三件小事：成本控制、失败兜底、可观测留痕。"
              />
              <P>
                ① 成本控制：限制 <code>max_turns</code>、正文截断（步骤 2
                已做）、深读页数上限；② 失败兜底：搜索无结果时让 Agent
                换关键词重试一次再放弃；③ 可观测留痕：把每次运行的 trace
                链接和工具调用日志存到 <code>runs/</code> 目录。
              </P>
              <CodeBlock language="python" filename="run_logging.py" code={CODE_STEP7_LOGGING} />
              <ChecklistCard
                items={["观察一次完整运行的工具调用日志输出。"]}
              />
            </StepSection>

            {/* ---------------- STEP 8 部署与分享（可选） ---------------- */}
            <StepSection id="step-8">
              <StepHeader
                no={8}
                title="部署与分享（可选）"
                lead="三条从轻到重的路径，把项目交到别人手里。"
              />
              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-xl border border-border-subtle bg-bg-1 p-5">
                  <span className="mb-2 block font-mono text-caption text-c-loop">路径 1 · 最轻</span>
                  <h4 className="mb-2 text-h4 font-semibold text-text-primary">
                    托管搜索一行替换
                  </h4>
                  <p className="text-body-sm text-text-secondary">
                    把自定义 <code>web_search</code> 换成 SDK 托管工具{" "}
                    <code>WebSearchTool()</code>，省掉 Tavily 依赖。
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-bg-1 p-5">
                  <span className="mb-2 block font-mono text-caption text-c-loop">路径 2 · 适中</span>
                  <h4 className="mb-2 text-h4 font-semibold text-text-primary">加个 Web UI</h4>
                  <p className="text-body-sm text-text-secondary">
                    用 Streamlit/Gradio 包一层输入框 + 进度展示（
                    <code>Runner.run_streamed</code>{" "}
                    可流式展示工具调用过程），10 分钟做出可分享 demo。
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-bg-1 p-5">
                  <span className="mb-2 block font-mono text-caption text-c-loop">路径 3 · 最重</span>
                  <h4 className="mb-2 text-h4 font-semibold text-text-primary">定时任务</h4>
                  <p className="text-body-sm text-text-secondary">
                    用 GitHub Actions 的 schedule
                    触发，每周一自动研究指定主题并把报告提交回仓库——零成本“无人值守研究助理”。
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <CodeBlock language="python" filename="agent.py · 方案 A" code={CODE_STEP8_HOSTED} />
              </div>
              {/* 最终交付清单大卡 */}
              <Reveal className="mt-10 rounded-2xl border border-c-loop/40 bg-gradient-to-br from-c-loop/10 to-accent-2/10 p-6 md:p-8">
                <Badge color={LOOP} className="mb-4">
                  最终交付清单
                </Badge>
                <ul className="grid gap-3 md:grid-cols-2">
                  {[
                    "完整仓库（含 README、架构图、示例报告）",
                    "1 份评估记录",
                    "1 段演示录屏",
                    "1 篇复盘文章",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-body-sm text-text-primary">
                      <Check size={15} className="mt-1 shrink-0 text-c-loop" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </StepSection>
          </div>
        </div>
      </div>

      {/* ---------------- S4 标杆参考带 ---------------- */}
      <section className="relative border-y border-border-subtle bg-bg-1">
        <div className="mx-auto max-w-[760px] px-5 py-20 md:px-6">
          <Reveal>
            <p className="mb-6 text-center text-body-lg text-text-secondary">
              想看看天花板在哪？
            </p>
            <a
              href="https://github.com/assafelovic/gpt-researcher"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-border-subtle bg-bg-2 p-6 transition-all duration-[250ms] hover:border-c-loop/50 hover:shadow-glow-cyan"
            >
              <Github size={26} className="mt-1 shrink-0 text-text-secondary transition-colors group-hover:text-c-loop" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-h4 font-semibold text-text-primary">GPT Researcher</span>
                  <Badge color={SEMANTIC.plan}>
                    <Star size={11} /> 数万 star
                  </Badge>
                </span>
                <span className="mt-2 block text-body-sm text-text-secondary">
                  开源自主研究 Agent，本项目是它的教学简化版。
                </span>
                <span className="mt-3 block font-mono text-caption text-text-tertiary">
                  github.com/assafelovic/gpt-researcher
                </span>
              </span>
              <ExternalLink
                size={16}
                className="shrink-0 text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-c-loop"
              />
            </a>
          </Reveal>
        </div>
      </section>

      {/* ---------------- S5 毕业 CTA ---------------- */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,0.10), rgba(167,139,250,0.06) 45%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[720px] px-5 py-24 text-center md:px-6">
          <Reveal>
            <Rocket size={28} className="mx-auto mb-6 text-c-loop" />
            <h2 className="text-h2 font-bold text-text-primary">
              交付它，你就<span className="text-grad">毕业了</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-body-lg text-text-secondary">
              把仓库链接放进简历，把复盘文章发出去——然后回到学习路径，看看你走过的五个阶段。
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/path"
              className="btn-outline-grad inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium text-text-primary"
            >
              回看学习路径
            </Link>
            <Link
              to="/resources"
              className="group inline-flex items-center gap-1.5 px-4 py-3 text-body-sm text-text-secondary transition-colors hover:text-c-perceive"
            >
              去资源库找下一个项目灵感
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
