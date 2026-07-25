/**
 * 资源导航数据 —— 名称、说明、链接逐字取自
 * research/learning-path.md §四（链接已核实）。
 */

export type StageKey = "阶段 1" | "阶段 2" | "阶段 3" | "阶段 4";
export type CategoryKey = "repos" | "courses" | "papers" | "blogs";

export interface Repo {
  name: string;
  url: string;
  desc: string;
  /** 特殊标记：标杆 / SDK 内链 */
  tag?: "benchmark" | "sdk";
}

export interface Course {
  name: string;
  url: string;
  provider: "HF" | "DeepLearning.AI";
  providerNote?: string;
  stageLabel: string;
  stages: StageKey[];
  desc: string;
}

export interface Paper {
  arxiv: string;
  title: string;
  authors: string;
  value: string;
  url: string;
  mustRead?: boolean;
}

export interface Blog {
  title: string;
  source: string;
  url: string;
  desc: string;
  classic?: boolean;
}

/** 组 1 · Awesome 类 GitHub 仓库（§4.1） */
export const REPOS: Repo[] = [
  {
    name: "e2b-dev/awesome-ai-agents",
    url: "https://github.com/e2b-dev/awesome-ai-agents",
    desc: "最知名的 Agent 项目大全（开源/商业分类）",
  },
  {
    name: "kaushikb11/awesome-llm-agents",
    url: "https://github.com/kaushikb11/awesome-llm-agents",
    desc: "LLM Agent 项目与框架精选",
  },
  {
    name: "Jenqyang/Awesome-AI-Agents",
    url: "https://github.com/Jenqyang/Awesome-AI-Agents",
    desc: "自主 Agent 应用集合（已检索确认活跃维护）",
  },
  {
    name: "korchasa/awesome-ai-agents",
    url: "https://github.com/korchasa/awesome-ai-agents",
    desc: "聚焦工具与框架的精选清单",
  },
  {
    name: "Shubhamsaboo/awesome-llm-apps",
    url: "https://github.com/Shubhamsaboo/awesome-llm-apps",
    desc: "100+ 可运行的 Agent/RAG 示例应用",
  },
  {
    name: "WooooDyy/LLM-Agent-Paper-List",
    url: "https://github.com/WooooDyy/LLM-Agent-Paper-List",
    desc: "LLM Agent 论文清单（含综述）",
  },
  {
    name: "assafelovic/gpt-researcher",
    url: "https://github.com/assafelovic/gpt-researcher",
    desc: "Capstone 的标杆参考实现",
    tag: "benchmark",
  },
  {
    name: "openai/openai-agents-python",
    url: "https://github.com/openai/openai-agents-python",
    desc: "OpenAI Agents SDK 源码与示例",
    tag: "sdk",
  },
];

/** 组 2 · 官方免费课程（§4.2，均免费或免费旁听） */
export const COURSES: Course[] = [
  {
    name: "Hugging Face Agents Course",
    url: "https://huggingface.co/learn/agents-course",
    provider: "HF",
    stageLabel: "阶段 2–3",
    stages: ["阶段 2", "阶段 3"],
    desc: "免费、含 smolagents/LangGraph/LlamaIndex 三框架单元 + GAIA 基准期末作业",
  },
  {
    name: "ChatGPT Prompt Engineering for Developers",
    url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
    provider: "DeepLearning.AI",
    stageLabel: "阶段 1",
    stages: ["阶段 1"],
    desc: "提示工程入门短课：指令、few-shot、结构化输出",
  },
  {
    name: "AI Agents in LangGraph",
    url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",
    provider: "DeepLearning.AI",
    stageLabel: "阶段 3",
    stages: ["阶段 3"],
    desc: "LangChain × Tavily 官方合作课",
  },
  {
    name: "Functions, Tools and Agents with LangChain",
    url: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/",
    provider: "DeepLearning.AI",
    stageLabel: "阶段 4",
    stages: ["阶段 4"],
    desc: "工具与 Function Calling 实战",
  },
  {
    name: "Long-Term Agentic Memory With LangGraph",
    url: "https://www.deeplearning.ai/short-courses/long-term-agentic-memory-with-langgraph/",
    provider: "DeepLearning.AI",
    stageLabel: "阶段 4",
    stages: ["阶段 4"],
    desc: "跨会话长期记忆的设计与实现",
  },
  {
    name: "Evaluating AI Agents",
    url: "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/",
    provider: "DeepLearning.AI",
    providerNote: "× Arize",
    stageLabel: "阶段 4",
    stages: ["阶段 4"],
    desc: "Arize 合作课，系统讲 Agent 评估",
  },
  {
    name: "Building Agentic RAG with LlamaIndex",
    url: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/",
    provider: "DeepLearning.AI",
    stageLabel: "阶段 4",
    stages: ["阶段 4"],
    desc: "让 Agent 自主决定何时检索的 Agentic RAG",
  },
  {
    name: "Building Code Agents with Hugging Face smolagents",
    url: "https://www.deeplearning.ai/short-courses/building-code-agents-with-hugging-face-smolagents/",
    provider: "DeepLearning.AI",
    stageLabel: "阶段 3 备选",
    stages: ["阶段 3"],
    desc: "用 smolagents 构建代码 Agent",
  },
  {
    name: "LLMs as Operating Systems: Agent Memory",
    url: "https://www.deeplearning.ai/short-courses/llms-as-operating-systems-agent-memory/",
    provider: "DeepLearning.AI",
    providerNote: "× Letta",
    stageLabel: "阶段 4 记忆专题",
    stages: ["阶段 4"],
    desc: "Letta 合作课：Agent 记忆专题",
  },
  {
    name: "MCP: Build Rich-Context AI Apps with Anthropic",
    url: "https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/",
    provider: "DeepLearning.AI",
    stageLabel: "阶段 4 工具协议拓展",
    stages: ["阶段 4"],
    desc: "MCP 工具协议拓展",
  },
];

/** 组 3 · 经典论文（§4.3，按阅读顺序） */
export const PAPERS: Paper[] = [
  {
    arxiv: "2201.11903",
    title: "Chain-of-Thought Prompting",
    authors: "Wei et al., 2022",
    value: "CoT 是一切 Agent 推理的地基",
    url: "https://arxiv.org/abs/2201.11903",
  },
  {
    arxiv: "2005.11401",
    title: "RAG",
    authors: "Lewis et al., 2020",
    value: "检索增强生成的开山之作",
    url: "https://arxiv.org/abs/2005.11401",
  },
  {
    arxiv: "2302.04761",
    title: "Toolformer",
    authors: "Meta, 2023",
    value: "让模型自学调用工具",
    url: "https://arxiv.org/abs/2302.04761",
  },
  {
    arxiv: "2210.03629",
    title: "ReAct",
    authors: "Yao et al., 2022",
    value: "Agent 范式核心：推理+行动交替",
    url: "https://arxiv.org/abs/2210.03629",
    mustRead: true,
  },
  {
    arxiv: "2303.11366",
    title: "Reflexion",
    authors: "Shinn et al., 2023",
    value: "语言化自我反思与纠错",
    url: "https://arxiv.org/abs/2303.11366",
  },
  {
    arxiv: "2304.03442",
    title: "Generative Agents",
    authors: "Park et al., 2023",
    value: "记忆流 + 反思 + 规划的拟人 Agent",
    url: "https://arxiv.org/abs/2304.03442",
  },
  {
    arxiv: "2305.16291",
    title: "Voyager",
    authors: "Wang et al., 2023",
    value: "终身学习 Agent：技能库自动扩展",
    url: "https://arxiv.org/abs/2305.16291",
  },
  {
    arxiv: "2309.07864",
    title: "LLM-based Agents Survey",
    authors: "Xi et al., 2023",
    value: "全景综述，建立知识地图",
    url: "https://arxiv.org/abs/2309.07864",
  },
  {
    arxiv: "2309.02427",
    title: "CoALA: Cognitive Architectures for Language Agents",
    authors: "2023",
    value: "用认知架构统一 Agent 设计空间",
    url: "https://arxiv.org/abs/2309.02427",
  },
];

/** 组 4 · 关键博客 / 文档（§4.4） */
export const BLOGS: Blog[] = [
  {
    title: "Lilian Weng《LLM Powered Autonomous Agents》",
    source: "lilianweng.github.io",
    url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
    desc: "Agent 领域最重要的综述博客",
    classic: true,
  },
  {
    title: "Anthropic《Building Effective Agents》",
    source: "anthropic.com",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
    desc: "工作流 vs Agent、设计模式全集",
  },
  {
    title: "Anthropic《Effective context engineering for AI agents》",
    source: "anthropic.com",
    url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    desc: "上下文工程",
  },
  {
    title: "OpenAI Agents SDK 文档",
    source: "openai.github.io/openai-agents-python",
    url: "https://openai.github.io/openai-agents-python/",
    desc: "官方文档（Python）：Agent / Runner / 工具 / 会话 / 追踪",
  },
  {
    title: "LangGraph 文档",
    source: "langchain-ai.github.io/langgraph",
    url: "https://langchain-ai.github.io/langgraph/",
    desc: "图结构 Agent 框架官方文档",
  },
  {
    title: "LangSmith 文档",
    source: "docs.smith.langchain.com",
    url: "https://docs.smith.langchain.com/",
    desc: "观测与评估平台",
  },
  {
    title: "OpenAI Cookbook",
    source: "cookbook.openai.com",
    url: "https://cookbook.openai.com/",
    desc: "官方代码示例库",
  },
  {
    title: "Tavily",
    source: "tavily.com",
    url: "https://www.tavily.com/",
    desc: "Agent 搜索 API",
  },
];
