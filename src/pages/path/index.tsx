import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  NotebookPen,
} from "lucide-react";
import { Badge, Card, ExternalLinkCard, Reveal } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import { cn } from "@/lib/utils";

/**
 * 学习路径页 /path —— 五阶段详细路线图
 * 内容逐字取自 learning-path.md brief §一、§二（design/path.md）
 */

/* ---------------------------------- 数据类型 ---------------------------------- */

interface ResourceLink {
  title: string;
  desc?: string;
  href: string;
}

interface PaperLink {
  badge: string;
  title: string;
  href: string;
}

interface StageDef {
  n: number;
  name: string;
  title: string;
  weeks: string;
  color: string;
  goals: ReactNode[];
  topicsNode: ReactNode;
  resources?: ResourceLink[];
  papers?: PaperLink[];
  resourcesIntro?: ReactNode;
  outputs: ReactNode[];
  crossLink?: { label: string; to: string };
  afterOutputs?: ReactNode;
}

/** 主题条目（编号列表用） */
function TopicList({
  items,
  color,
}: {
  items: { name: ReactNode; desc?: ReactNode }[];
  color: string;
}) {
  return (
    <ol className="space-y-5">
      {items.map((t, i) => (
        <Reveal key={i} delay={i * 0.06} y={20}>
          <li className="flex gap-4">
            <span
              className="mt-0.5 shrink-0 font-mono text-sm font-semibold"
              style={{ color }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className="text-body font-medium text-text-primary">{t.name}</p>
              {t.desc && (
                <p className="mt-0.5 text-body-sm text-text-secondary">{t.desc}</p>
              )}
            </div>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

/** 阶段 3：两条路线 Tabs（Tab A / Tab B 切换，指示条 2px 250ms slide） */
function RouteTabs({ color }: { color: string }) {
  const [tab, setTab] = useState<"a" | "b">("a");
  const TABS = [
    { key: "a" as const, label: "路线 A · OpenAI Agents SDK" },
    { key: "b" as const, label: "路线 B · LangGraph" },
  ];

  const panels: Record<"a" | "b", ReactNode> = {
    a: (
      <div>
        <p className="text-body font-medium text-text-primary">
          OpenAI Agents SDK（轻量、官方、上手快）
        </p>
        <div className="mt-4">
          <p className="mb-2.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            核心抽象
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Agent（instructions + tools + model）",
              "Runner（执行循环）",
              "function_tool（工具装饰器）",
              "handoffs（多 Agent 交接）",
              "Sessions（会话记忆）",
              "Tracing（观测）",
            ].map((c) => (
              <Badge key={c} color={color} className="normal-case tracking-normal">
                {c}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ExternalLinkCard
            href="https://openai.github.io/openai-agents-python/"
            title="官方文档（Python）"
            desc="openai.github.io/openai-agents-python"
          />
          <ExternalLinkCard
            href="https://github.com/openai/openai-agents-python"
            title="GitHub 仓库 openai/openai-agents-python"
            desc="github.com"
          />
        </div>
      </div>
    ),
    b: (
      <div>
        <p className="text-body font-medium text-text-primary">
          LangGraph（图结构、可控性强、生态大）
        </p>
        <div className="mt-4">
          <p className="mb-2.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            核心抽象
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "StateGraph（状态图）",
              "节点（Node）与边（Edge）",
              "条件路由",
              "Checkpointer（持久化/断点续跑）",
              "Human-in-the-loop",
            ].map((c) => (
              <Badge key={c} color={color} className="normal-case tracking-normal">
                {c}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ExternalLinkCard
            href="https://langchain-ai.github.io/langgraph/"
            title="官方文档"
            desc="langchain-ai.github.io/langgraph"
          />
          <ExternalLinkCard
            href="https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/"
            title="DeepLearning.AI 短课《AI Agents in LangGraph》"
            desc="LangChain × Tavily 官方合作课"
          />
        </div>
      </div>
    ),
  };

  return (
    <div>
      <p className="mb-4 text-body-sm text-text-secondary">
        两条路线任选其一（建议主修一条、了解另一条）
      </p>
      <div className="flex gap-6 border-b border-border-subtle">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "relative pb-3 text-body-sm font-medium transition-colors duration-[250ms]",
                active ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId="route-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5"
                  style={{ background: color }}
                  transition={{ duration: 0.25 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pt-6"
        >
          {panels[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- 五阶段内容（逐字取自 brief） ---------------------------------- */

const STAGES: StageDef[] = [
  {
    n: 1,
    name: "基础",
    title: "LLM 基础、提示工程、API 调用",
    weeks: "1–2 周",
    color: SEMANTIC.perceive,
    goals: [
      "理解 LLM 的本质（token、上下文窗口、temperature、system/user/assistant 消息结构）。",
      "掌握提示工程核心技巧（指令清晰、few-shot、思维链 CoT、结构化输出）。",
      "能用官方 SDK 完成一次完整的 API 调用，并理解费用与限流。",
    ],
    topicsNode: (
      <TopicList
        color={SEMANTIC.perceive}
        items={[
          { name: "Transformer 与 LLM 直觉认知", desc: "不做数学推导，重在直觉。" },
          {
            name: "消息格式与对话状态",
            desc: (
              <>
                <code>messages</code> 数组、角色分工、上下文管理。
              </>
            ),
          },
          {
            name: "提示工程",
            desc: "指令分层、输出格式约束（JSON）、few-shot 示例、CoT 提示。",
          },
          {
            name: "API 实操",
            desc: "鉴权（环境变量存 Key）、流式响应、错误重试、用量统计。",
          },
        ]}
      />
    ),
    resources: [
      {
        title: "DeepLearning.AI 短课《ChatGPT Prompt Engineering for Developers》",
        desc: "deeplearning.ai 短课",
        href: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
      },
      {
        title: "Learn Prompting 开源指南",
        desc: "中英双语、免费",
        href: "https://www.promptingguide.ai/zh",
      },
      {
        title: "OpenAI 官方提示工程指南",
        desc: "platform.openai.com",
        href: "https://platform.openai.com/docs/guides/prompt-engineering",
      },
      {
        title: "Andrej Karpathy《Neural Networks: Zero to Hero》",
        desc: "可选，建立底层直觉",
        href: "https://karpathy.ai/zero-to-hero.html",
      },
      {
        title: "OpenAI Cookbook",
        desc: "官方代码示例库",
        href: "https://cookbook.openai.com/",
      },
    ],
    outputs: [
      <>
        一个命令行 Chatbot：支持多轮对话、流式输出、<code>temperature</code>{" "}
        可调、累计 token 费用打印。
      </>,
      "学习笔记：《什么是 system prompt？为什么 few-shot 有效？》",
    ],
  },
  {
    n: 2,
    name: "原理",
    title: "Agent 架构、ReAct、规划与记忆",
    weeks: "1–2 周",
    color: SEMANTIC.plan,
    goals: [
      "说清楚 Agent = LLM + 工具 + 循环 的本质，能画出 Agent 架构图。",
      "理解 ReAct（Thought → Action → Observation）范式并能手写实现。",
      "理解规划（Plan-and-Execute、任务分解）与记忆（短期/长期）的设计取舍。",
    ],
    topicsNode: (
      <TopicList
        color={SEMANTIC.plan}
        items={[
          {
            name: "Agent 三大组件",
            desc: "规划（Planning）、记忆（Memory）、工具使用（Tool Use）。",
          },
          { name: "ReAct 范式", desc: "推理与行动交替，如何减少幻觉。" },
          {
            name: "规划模式",
            desc: "任务分解、自我反思（Reflexion）、多步执行的控制流。",
          },
          {
            name: "记忆模式",
            desc: "上下文内短期记忆 vs 向量库长期记忆；记忆写入/检索时机。",
          },
        ]}
      />
    ),
    resources: [
      {
        title: "Lilian Weng 经典长文《LLM Powered Autonomous Agents》",
        desc: "Agent 领域最重要的综述博客",
        href: "https://lilianweng.github.io/posts/2023-06-23-agent/",
      },
      {
        title: "Anthropic 工程博客《Building Effective Agents》",
        desc: "工作流 vs Agent、设计模式全集",
        href: "https://www.anthropic.com/engineering/building-effective-agents",
      },
    ],
    papers: [
      {
        badge: "arXiv:2210.03629",
        title: "ReAct: Synergizing Reasoning and Acting in Language Models",
        href: "https://arxiv.org/abs/2210.03629",
      },
      {
        badge: "arXiv:2303.11366",
        title: "Reflexion: Language Agents with Verbal Reinforcement Learning",
        href: "https://arxiv.org/abs/2303.11366",
      },
      {
        badge: "arXiv:2309.07864",
        title:
          "The Rise and Potential of Large Language Model Based Agents: A Survey（综述）",
        href: "https://arxiv.org/abs/2309.07864",
      },
    ],
    outputs: [
      <>
        <strong className="font-medium text-text-primary">手写“裸 Agent 循环”</strong>
        ：不依赖任何框架，用 OpenAI 原生 <code>chat.completions</code> +
        函数分发，实现 Thought → Action → Observation 循环，配 2
        个工具（计算器 + 本地文件读取）。
      </>,
      "学习笔记：《我用 50 行代码复现了 ReAct》。",
    ],
    crossLink: { label: "配套阅读：原理知识库", to: "/principles" },
  },
  {
    n: 3,
    name: "框架",
    title: "深入一个主流框架",
    weeks: "2–3 周",
    color: SEMANTIC.tool,
    goals: [
      "深入掌握一个框架的核心抽象，能用它快速搭建可维护的 Agent。",
      "理解“何时该用框架、何时裸写”的判断标准。",
    ],
    topicsNode: <RouteTabs color={SEMANTIC.tool} />,
    resourcesIntro: "通用资源",
    resources: [
      {
        title: "Hugging Face《Agents Course》",
        desc: "免费、含 smolagents / LangGraph / LlamaIndex 三框架单元 + GAIA 基准期末作业",
        href: "https://huggingface.co/learn/agents-course",
      },
    ],
    outputs: [
      "用所选框架重写阶段 2 的裸 Agent，对比代码量与可维护性。",
      <>
        给 Agent 接入一个<strong className="font-medium text-text-primary">真实外部工具</strong>
        （如天气 API、Tavily 搜索），输出一个能回答“今天天气如何并建议穿衣”的小应用。
      </>,
      "学习笔记：《裸写 vs 框架：我选 XX 的理由》。",
    ],
    crossLink: { label: "拿不定主意？看框架横评", to: "/frameworks" },
  },
  {
    n: 4,
    name: "技能进阶",
    title: "RAG、工具设计、Function Calling、记忆、评估与调试",
    weeks: "3–4 周",
    color: SEMANTIC.memory,
    goals: [
      "掌握生产级 Agent 的四块进阶拼图：检索增强、工具工程、长期记忆、评估与观测。",
    ],
    topicsNode: (
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            t: "RAG",
            d: "Embedding、向量检索、分块策略、混合检索（关键词 + 向量）、重排序；Agentic RAG（让 Agent 自主决定何时检索）。",
          },
          {
            t: "工具设计与 Function Calling",
            d: "工具 schema 设计原则（命名、docstring、参数校验、幂等性）、错误信息回传给模型的技巧、工具粒度取舍。",
          },
          {
            t: "记忆",
            d: "会话级记忆（Session/Checkpointer）、跨会话长期记忆（向量库 / 结构化用户画像）、记忆写入策略。",
          },
          {
            t: "评估与调试",
            d: "轨迹（trace）分析、失败模式分类（工具误选、循环、幻觉引用）、用 LangSmith 建数据集 + 自动评估（LLM-as-judge）、回归测试。",
          },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.06} y={20}>
            <Card accent={SEMANTIC.memory} number={String(i + 1).padStart(2, "0")} className="h-full">
              <p className="text-body font-semibold text-text-primary">{c.t}</p>
              <p className="mt-2 text-body-sm text-text-secondary">{c.d}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    ),
    resources: [
      {
        title: "DeepLearning.AI 短课《Functions, Tools and Agents with LangChain》",
        desc: "deeplearning.ai 短课",
        href: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/",
      },
      {
        title: "DeepLearning.AI 短课《Long-Term Agentic Memory With LangGraph》",
        desc: "deeplearning.ai 短课",
        href: "https://www.deeplearning.ai/short-courses/long-term-agentic-memory-with-langgraph/",
      },
      {
        title: "DeepLearning.AI 短课《Evaluating AI Agents》",
        desc: "Arize 合作课，系统讲 Agent 评估",
        href: "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/",
      },
      {
        title: "DeepLearning.AI 短课《Building Agentic RAG with LlamaIndex》",
        desc: "deeplearning.ai 短课",
        href: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/",
      },
      {
        title: "LangSmith 官方文档",
        desc: "观测与评估平台",
        href: "https://docs.smith.langchain.com/",
      },
      {
        title: "OpenAI Function Calling 官方指南",
        desc: "platform.openai.com",
        href: "https://platform.openai.com/docs/guides/function-calling",
      },
    ],
    papers: [
      {
        badge: "arXiv:2005.11401",
        title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        href: "https://arxiv.org/abs/2005.11401",
      },
      {
        badge: "arXiv:2302.04761",
        title: "Toolformer: Language Models Can Teach Themselves to Use Tools",
        href: "https://arxiv.org/abs/2302.04761",
      },
    ],
    outputs: [
      "一个“文档问答 Agent”：支持上传 PDF/Markdown → 向量化入库 → Agent 自主决定何时检索、何时直接回答，带长期记忆（记住用户偏好）。",
      "一份 LangSmith 评估报告：≥ 20 条测试用例的数据集、基线分数、一次 prompt 迭代后的对比分数。",
    ],
  },
  {
    n: 5,
    name: "实战",
    title: "独立完成完整 Agent 项目",
    weeks: "3–4 周",
    color: SEMANTIC.loop,
    goals: [
      "走完“需求 → 设计 → 实现 → 评估 → 部署 → 复盘”全流程，产出可写进简历的作品。",
    ],
    topicsNode: (
      <div className="space-y-6">
        <div>
          <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            要求 · 必须包含
          </p>
          <ul className="space-y-2.5">
            {["≥ 3 个工具", "某种记忆机制", "可观测（trace 或日志）", "最小评估集", "README 与演示"].map(
              (r) => (
                <li key={r} className="flex items-start gap-2.5 text-body-sm text-text-secondary">
                  <Check size={16} className="mt-0.5 shrink-0" style={{ color: SEMANTIC.loop }} />
                  {r}
                </li>
              ),
            )}
          </ul>
        </div>
        <p className="text-body-sm text-text-secondary">
          <span className="font-medium text-text-primary">推荐题目：</span>
          即 Capstone《个人研究助理 Agent》。也可自选（如：求职跟踪
          Agent、代码审查 Agent、竞品监控 Agent）。
        </p>
        <div>
          <p className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            标杆参考
          </p>
          <ExternalLinkCard
            href="https://github.com/assafelovic/gpt-researcher"
            title="GPT Researcher"
            desc="开源自主研究 Agent"
          />
        </div>
      </div>
    ),
    outputs: [
      "完整 GitHub 仓库（代码 + README + 架构图 + 演示录屏）。",
      "复盘文章：设计决策、踩坑记录、评估数据、下一步改进。",
    ],
    afterOutputs: (
      <Reveal delay={0.1}>
        <Link
          to="/capstone"
          className="group block p-8 text-center transition-transform duration-[250ms] ease-out hover:-translate-y-1"
          style={{
            borderRadius: 24,
            border: "1.5px solid transparent",
            backgroundImage:
              "linear-gradient(#0B0F1A, #0B0F1A), linear-gradient(135deg, #F472B6, #A78BFA)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
          }}
        >
          <p className="text-h3 font-bold text-text-primary">
            准备好了？
            <span className="ml-2 inline-block text-c-loop transition-transform duration-[250ms] group-hover:translate-x-1">
              →
            </span>
          </p>
          <p className="mt-2 text-body-sm text-text-secondary">
            进入 Capstone 8 步教程，完成你的毕业项目
          </p>
        </Link>
      </Reveal>
    ),
  },
];

/** sticky 阶段卡上的产出物速览（取自 brief §一总览表） */
const DELIVERABLES: Record<number, string> = {
  1: "命令行 Chatbot（含流式输出、token 统计）",
  2: "手写 50 行“裸 Agent 循环”（不用任何框架）",
  3: "用框架重写裸 Agent，并加一个真实工具",
  4: "带 RAG + 记忆的问答 Agent，附 LangSmith 评估报告",
  5: "《个人研究助理 Agent》完整仓库 + 演示 + 复盘文章",
};

/* ---------------------------------- S1 页头 Hero ---------------------------------- */

const TITLE_SEGS: { text: string; grad?: boolean }[] = [
  { text: "从第一行" },
  { text: " API 调用，" },
  { text: "到" },
  { text: "独立交付", grad: true },
  { text: "一个" },
  { text: " Agent 项目" },
];

const STATS = [
  { num: "5", label: "阶段" },
  { num: "10–15", label: "周" },
  { num: "5", label: "个阶段产出物" },
  { num: "1", label: "个毕业项目" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid-texture pb-20 pt-40 max-md:pt-28">
      {/* 顶部青色光晕 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56,189,248,0.12), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-prose2 px-6 max-md:px-5">
        <p className="font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          HOME / 学习路径
        </p>
        <div className="mt-5">
          <Badge color={SEMANTIC.perceive}>完整周期 · 10–15 周</Badge>
        </div>
        <h1 className="mt-5 text-h1 font-black text-text-primary">
          {TITLE_SEGS.map((s, i) => (
            <motion.span
              key={i}
              className={cn("inline-block", s.grad && "text-grad")}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.15 + i * 0.06,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {s.text}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-6 max-w-2xl text-body-lg text-text-secondary"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          五个阶段，每周 6–8
          小时。每个阶段都以“可运行代码 + 一篇学习笔记”双产出收尾——你留下的不只是笔记，而是一串能跑的仓库。
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4"
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-baseline gap-3">
              <span className="font-display text-[32px] font-bold leading-none text-text-primary">
                {s.num}
              </span>
              <span className="text-caption text-text-tertiary">{s.label}</span>
              {i < STATS.length - 1 && (
                <span className="ml-7 hidden text-text-tertiary sm:inline">·</span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------- S2 Sticky 阶段导航 ---------------------------------- */

function StageNav() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(Number(e.target.getAttribute("data-stage")));
          }
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const s of STAGES) {
      const el = document.getElementById(`stage-${s.n}`);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  const scrollTo = (n: number) => {
    document
      .getElementById(`stage-${n}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-16 z-40 border-b border-border-subtle bg-bg-0/85 backdrop-blur-[12px]">
      <div className="mx-auto flex max-w-content overflow-x-auto px-6 max-md:px-5">
        {STAGES.map((s, i) => {
          const isActive = active === s.n;
          return (
            <motion.button
              key={s.n}
              type="button"
              onClick={() => scrollTo(s.n)}
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              className={cn(
                "relative flex shrink-0 items-center gap-2.5 px-4 py-3.5 text-left transition-colors duration-[250ms]",
                isActive ? "" : "hover:bg-bg-1",
              )}
            >
              {isActive && (
                <span
                  className="absolute inset-x-0 top-0 h-0.5 transition-colors duration-[250ms]"
                  style={{ background: s.color }}
                />
              )}
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="flex flex-col">
                <span className="flex items-baseline gap-1.5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-tertiary">
                    阶段 {s.n}
                  </span>
                  <span
                    className="text-body-sm font-medium transition-colors duration-[250ms]"
                    style={{ color: isActive ? s.color : "#9AA7BC" }}
                  >
                    {s.name}
                  </span>
                </span>
                <span className="text-caption text-text-tertiary">{s.weeks}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------- S3 阶段详情 ---------------------------------- */

function SubHead({ label, color }: { label: string; color: string }) {
  return (
    <Reveal y={24}>
      <h4 className="mb-5 flex items-center gap-2.5 text-h4 font-semibold text-text-primary">
        <span className="h-3.5 w-1 rounded-full" style={{ background: color }} />
        {label}
      </h4>
    </Reveal>
  );
}

function StageSection({
  def,
  nextColor,
}: {
  def: StageDef;
  nextColor?: string;
}) {
  const topicsLabel =
    def.n === 3 ? "两条路线" : def.n === 5 ? "项目要求" : "学习主题";

  return (
    <section
      id={`stage-${def.n}`}
      data-stage={def.n}
      className="relative scroll-mt-40"
    >
      {/* 章节色光晕 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-24 h-[480px] w-[480px]"
        style={{
          background: `radial-gradient(closest-side, ${def.color}14, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-content px-6 max-md:px-5">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-14">
          {/* 左：sticky 阶段卡 */}
          <div className="lg:sticky lg:top-40 lg:self-start">
            <motion.div
              className="font-display text-[88px] font-bold leading-none"
              style={{ color: def.color }}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {String(def.n).padStart(2, "0")}
            </motion.div>
            <Reveal delay={0.1}>
              <h2 className="mt-4 text-h2 font-bold text-text-primary">
                {def.name}
              </h2>
              <p className="mt-2 text-body-sm text-text-secondary">{def.title}</p>
              <div className="mt-4">
                <Badge color={def.color}>{def.weeks}</Badge>
              </div>
              <div className="mt-6 rounded-xl border border-border-subtle bg-bg-1 p-4">
                <p className="font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
                  产出物速览
                </p>
                <p className="mt-2 text-body-sm text-text-secondary">
                  {DELIVERABLES[def.n]}
                </p>
              </div>
            </Reveal>
          </div>

          {/* 右：内容列 */}
          <div className="max-w-[720px] space-y-14">
            {/* 目标 */}
            <div>
              <SubHead label="目标" color={def.color} />
              <ul className="space-y-3">
                {def.goals.map((g, i) => (
                  <Reveal key={i} delay={i * 0.06} y={20}>
                    <li className="flex items-start gap-3 text-body text-text-secondary">
                      <Check
                        size={18}
                        className="mt-1 shrink-0"
                        style={{ color: def.color }}
                      />
                      <span>{g}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>

            {/* 学习主题 / 两条路线 / 项目要求 */}
            <div>
              <SubHead label={topicsLabel} color={def.color} />
              {def.topicsNode}
            </div>

            {/* 推荐资源 */}
            {def.resources && def.resources.length > 0 && (
              <div>
                <SubHead label={def.resourcesIntro ? String(def.resourcesIntro) : "推荐资源"} color={def.color} />
                <div className="grid gap-3">
                  {def.resources.map((r, i) => (
                    <Reveal key={r.href} delay={i * 0.05} y={16}>
                      <ExternalLinkCard href={r.href} title={r.title} desc={r.desc} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* 论文（ARXIV 徽章样式） */}
            {def.papers && def.papers.length > 0 && (
              <div>
                <SubHead label="论文" color={def.color} />
                <div className="grid gap-3">
                  {def.papers.map((p, i) => (
                    <Reveal key={p.href} delay={i * 0.05} y={16}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors duration-[250ms] hover:border-border-strong"
                      >
                        <Badge color={def.color} className="shrink-0">
                          {p.badge}
                        </Badge>
                        <span className="min-w-0 flex-1 text-body-sm text-text-secondary transition-colors group-hover:text-text-primary">
                          {p.title}
                        </span>
                        <ArrowUpRight
                          size={15}
                          className="shrink-0 text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-text-primary"
                        />
                      </a>
                    </Reveal>
                  ))}
                </div>
              </div>
            )}

            {/* 产出物：绿色描边「交付物」面板 */}
            <div>
              <SubHead label="产出物" color={SEMANTIC.tool} />
              <motion.div
                className="rounded-2xl border border-c-tool/40 bg-c-tool/5 p-6"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Badge color={SEMANTIC.tool} className="mb-4">
                  交付物
                </Badge>
                <ul className="space-y-3">
                  {def.outputs.map((o, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-body text-text-secondary"
                    >
                      <Check size={18} className="mt-1 shrink-0 text-c-tool" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* 交叉链接 */}
            {def.crossLink && (
              <Reveal>
                <Link
                  to={def.crossLink.to}
                  className="group inline-flex items-center gap-2 text-body font-medium text-c-perceive"
                >
                  {def.crossLink.label}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-[250ms] group-hover:translate-x-1"
                  />
                </Link>
              </Reveal>
            )}

            {def.afterOutputs}
          </div>
        </div>
      </div>

      {/* 章节间分隔：语义色渐变细线 scaleX */}
      {nextColor && (
        <motion.div
          aria-hidden
          className="mx-auto mt-32 h-px max-w-content origin-left max-md:mt-16 max-md:mx-5"
          style={{
            background: `linear-gradient(90deg, ${def.color}66, ${nextColor}66, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      )}
    </section>
  );
}

/* ---------------------------------- S4 双产出原则 ---------------------------------- */

function Typewriter({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [len, setLen] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLen(text.length);
      return;
    }
    const id = window.setInterval(() => {
      setLen((l) => {
        if (l >= text.length) {
          window.clearInterval(id);
          return l;
        }
        return l + 1;
      });
    }, 40);
    return () => window.clearInterval(id);
  }, [inView, text]);

  return (
    <span ref={ref}>
      {text.slice(0, len)}
      <span className="animate-caret-blink text-c-perceive">▎</span>
    </span>
  );
}

function DualOutput() {
  const cards = [
    {
      icon: <Code2 size={20} />,
      title: "可运行代码",
      desc: "每个阶段的产出物都能跑、能展示、能写进简历。",
    },
    {
      icon: <NotebookPen size={20} />,
      title: "一篇学习笔记",
      desc: "用自己的话讲清楚学到的概念，是检验理解的最好方式。",
    },
  ];

  return (
    <section className="mt-32 bg-bg-1 py-24 max-md:mt-16 max-md:py-16">
      <div className="mx-auto max-w-[760px] px-6 text-center max-md:px-5">
        <Reveal>
          <h3 className="text-h3 font-bold text-text-primary">每个阶段的双产出</h3>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1}>
              <Card accent={SEMANTIC.perceive} className="h-full text-left">
                <span className="mb-3 inline-block text-c-perceive">{c.icon}</span>
                <p className="text-body font-semibold text-text-primary">{c.title}</p>
                <p className="mt-2 text-body-sm text-text-secondary">{c.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 font-mono text-body-sm text-text-secondary">
          <span className="text-c-perceive">$</span>{" "}
          <Typewriter text="git log --oneline  # 10 周后，这里是你自己的成长轨迹" />
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------- S5 页面底部导航 ---------------------------------- */

function BottomNav() {
  const items = [
    {
      to: "/",
      label: "上一站：首页",
      icon: (
        <ArrowLeft
          size={16}
          className="transition-transform duration-[250ms] group-hover:-translate-x-1"
        />
      ),
    },
    {
      to: "/principles",
      label: "下一站：原理知识库",
      icon: (
        <ArrowRight
          size={16}
          className="transition-transform duration-[250ms] group-hover:translate-x-1"
        />
      ),
    },
  ];

  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto grid max-w-content gap-4 px-6 max-md:px-5 sm:grid-cols-2">
        {items.map((it, i) => (
          <Reveal key={it.to} delay={i * 0.1}>
            <Link
              to={it.to}
              className="group flex items-center justify-between rounded-2xl border border-border-subtle bg-bg-1 p-6 transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:border-border-strong"
            >
              <span className="text-body font-medium text-text-secondary transition-colors group-hover:text-text-primary">
                {it.label}
              </span>
              <span className="text-c-perceive">{it.icon}</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------- 页面 ---------------------------------- */

export default function PathPage() {
  const location = useLocation();

  // 支持 /path#stage-N 锚点直达（首页 S4 卡片跳转目标）
  useEffect(() => {
    if (!location.hash) return;
    const t = window.setTimeout(() => {
      document
        .querySelector(location.hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 400);
    return () => window.clearTimeout(t);
  }, [location.hash]);

  return (
    <>
      <Hero />
      <StageNav />
      <div className="space-y-0 pt-24 max-md:pt-16">
        {STAGES.map((s, i) => (
          <StageSection key={s.n} def={s} nextColor={STAGES[i + 1]?.color} />
        ))}
      </div>
      <DualOutput />
      <BottomNav />
    </>
  );
}
