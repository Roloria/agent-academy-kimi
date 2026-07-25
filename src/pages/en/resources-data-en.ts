/**
 * Resources page data — English edition.
 * Resource names, links, arXiv IDs and authors stay identical to the zh edition
 * (facts are language-invariant); only descriptions are translated.
 */

export type StageKeyEn = "Stage 1" | "Stage 2" | "Stage 3" | "Stage 4";
export type CategoryKeyEn = "repos" | "courses" | "papers" | "blogs";

export interface RepoEn {
  name: string;
  url: string;
  desc: string;
  /** special markers: benchmark / SDK internal link */
  tag?: "benchmark" | "sdk";
}

export interface CourseEn {
  name: string;
  url: string;
  provider: "HF" | "DeepLearning.AI";
  providerNote?: string;
  stageLabel: string;
  stages: StageKeyEn[];
  desc: string;
}

export interface PaperEn {
  arxiv: string;
  title: string;
  authors: string;
  value: string;
  url: string;
  mustRead?: boolean;
}

export interface BlogEn {
  title: string;
  source: string;
  url: string;
  desc: string;
  classic?: boolean;
}

/** Group 1 · Awesome-style GitHub repositories */
export const REPOS_EN: RepoEn[] = [
  {
    name: "e2b-dev/awesome-ai-agents",
    url: "https://github.com/e2b-dev/awesome-ai-agents",
    desc: "The best-known directory of agent projects (open-source / commercial)",
  },
  {
    name: "kaushikb11/awesome-llm-agents",
    url: "https://github.com/kaushikb11/awesome-llm-agents",
    desc: "A curated selection of LLM agent projects and frameworks",
  },
  {
    name: "Jenqyang/Awesome-AI-Agents",
    url: "https://github.com/Jenqyang/Awesome-AI-Agents",
    desc: "A collection of autonomous agent applications (verified actively maintained)",
  },
  {
    name: "korchasa/awesome-ai-agents",
    url: "https://github.com/korchasa/awesome-ai-agents",
    desc: "A curated list focused on tools and frameworks",
  },
  {
    name: "Shubhamsaboo/awesome-llm-apps",
    url: "https://github.com/Shubhamsaboo/awesome-llm-apps",
    desc: "100+ runnable agent/RAG example applications",
  },
  {
    name: "WooooDyy/LLM-Agent-Paper-List",
    url: "https://github.com/WooooDyy/LLM-Agent-Paper-List",
    desc: "LLM agent paper list (including surveys)",
  },
  {
    name: "assafelovic/gpt-researcher",
    url: "https://github.com/assafelovic/gpt-researcher",
    desc: "The benchmark reference implementation for the Capstone Project",
    tag: "benchmark",
  },
  {
    name: "openai/openai-agents-python",
    url: "https://github.com/openai/openai-agents-python",
    desc: "OpenAI Agents SDK source code and examples",
    tag: "sdk",
  },
];

/** Group 2 · Official free courses (all free or free to audit) */
export const COURSES_EN: CourseEn[] = [
  {
    name: "Hugging Face Agents Course",
    url: "https://huggingface.co/learn/agents-course",
    provider: "HF",
    stageLabel: "Stages 2–3",
    stages: ["Stage 2", "Stage 3"],
    desc: "Free, with units on smolagents / LangGraph / LlamaIndex plus a GAIA-benchmark final assignment",
  },
  {
    name: "ChatGPT Prompt Engineering for Developers",
    url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/",
    provider: "DeepLearning.AI",
    stageLabel: "Stage 1",
    stages: ["Stage 1"],
    desc: "Introductory short course on prompt engineering: instructions, few-shot, structured output",
  },
  {
    name: "AI Agents in LangGraph",
    url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph/",
    provider: "DeepLearning.AI",
    stageLabel: "Stage 3",
    stages: ["Stage 3"],
    desc: "Official LangChain × Tavily collaboration course",
  },
  {
    name: "Functions, Tools and Agents with LangChain",
    url: "https://www.deeplearning.ai/short-courses/functions-tools-agents-langchain/",
    provider: "DeepLearning.AI",
    stageLabel: "Stage 4",
    stages: ["Stage 4"],
    desc: "Hands-on tools and Function Calling",
  },
  {
    name: "Long-Term Agentic Memory With LangGraph",
    url: "https://www.deeplearning.ai/short-courses/long-term-agentic-memory-with-langgraph/",
    provider: "DeepLearning.AI",
    stageLabel: "Stage 4",
    stages: ["Stage 4"],
    desc: "Designing and implementing long-term memory across sessions",
  },
  {
    name: "Evaluating AI Agents",
    url: "https://www.deeplearning.ai/short-courses/evaluating-ai-agents/",
    provider: "DeepLearning.AI",
    providerNote: "× Arize",
    stageLabel: "Stage 4",
    stages: ["Stage 4"],
    desc: "Arize collaboration course: a systematic treatment of agent evaluation",
  },
  {
    name: "Building Agentic RAG with LlamaIndex",
    url: "https://www.deeplearning.ai/short-courses/building-agentic-rag-with-llamaindex/",
    provider: "DeepLearning.AI",
    stageLabel: "Stage 4",
    stages: ["Stage 4"],
    desc: "Agentic RAG where the agent decides on its own when to retrieve",
  },
  {
    name: "Building Code Agents with Hugging Face smolagents",
    url: "https://www.deeplearning.ai/short-courses/building-code-agents-with-hugging-face-smolagents/",
    provider: "DeepLearning.AI",
    stageLabel: "Stage 3 · alternative",
    stages: ["Stage 3"],
    desc: "Build code agents with smolagents",
  },
  {
    name: "LLMs as Operating Systems: Agent Memory",
    url: "https://www.deeplearning.ai/short-courses/llms-as-operating-systems-agent-memory/",
    provider: "DeepLearning.AI",
    providerNote: "× Letta",
    stageLabel: "Stage 4 · memory deep dive",
    stages: ["Stage 4"],
    desc: "Letta collaboration course: a deep dive into agent memory",
  },
  {
    name: "MCP: Build Rich-Context AI Apps with Anthropic",
    url: "https://www.deeplearning.ai/short-courses/mcp-build-rich-context-ai-apps-with-anthropic/",
    provider: "DeepLearning.AI",
    stageLabel: "Stage 4 · tool protocol extension",
    stages: ["Stage 4"],
    desc: "Extending your tool skills with the MCP protocol",
  },
];

/** Group 3 · Classic papers (in recommended reading order) */
export const PAPERS_EN: PaperEn[] = [
  {
    arxiv: "2201.11903",
    title: "Chain-of-Thought Prompting",
    authors: "Wei et al., 2022",
    value: "CoT is the foundation of all agent reasoning",
    url: "https://arxiv.org/abs/2201.11903",
  },
  {
    arxiv: "2005.11401",
    title: "RAG",
    authors: "Lewis et al., 2020",
    value: "The seminal work on retrieval-augmented generation",
    url: "https://arxiv.org/abs/2005.11401",
  },
  {
    arxiv: "2302.04761",
    title: "Toolformer",
    authors: "Meta, 2023",
    value: "Teaching models to call tools on their own",
    url: "https://arxiv.org/abs/2302.04761",
  },
  {
    arxiv: "2210.03629",
    title: "ReAct",
    authors: "Yao et al., 2022",
    value: "The core agent paradigm: interleaved reasoning + acting",
    url: "https://arxiv.org/abs/2210.03629",
    mustRead: true,
  },
  {
    arxiv: "2303.11366",
    title: "Reflexion",
    authors: "Shinn et al., 2023",
    value: "Verbal self-reflection and error correction",
    url: "https://arxiv.org/abs/2303.11366",
  },
  {
    arxiv: "2304.03442",
    title: "Generative Agents",
    authors: "Park et al., 2023",
    value: "Human-like agents with memory streams + reflection + planning",
    url: "https://arxiv.org/abs/2304.03442",
  },
  {
    arxiv: "2305.16291",
    title: "Voyager",
    authors: "Wang et al., 2023",
    value: "A lifelong-learning agent with an ever-expanding skill library",
    url: "https://arxiv.org/abs/2305.16291",
  },
  {
    arxiv: "2309.07864",
    title: "LLM-based Agents Survey",
    authors: "Xi et al., 2023",
    value: "A panoramic survey — build your knowledge map here",
    url: "https://arxiv.org/abs/2309.07864",
  },
  {
    arxiv: "2309.02427",
    title: "CoALA: Cognitive Architectures for Language Agents",
    authors: "2023",
    value: "Unifying the agent design space with cognitive architectures",
    url: "https://arxiv.org/abs/2309.02427",
  },
];

/** Group 4 · Key blogs & docs */
export const BLOGS_EN: BlogEn[] = [
  {
    title: "Lilian Weng: LLM Powered Autonomous Agents",
    source: "lilianweng.github.io",
    url: "https://lilianweng.github.io/posts/2023-06-23-agent/",
    desc: "The most important survey blog post in the agent field",
    classic: true,
  },
  {
    title: "Anthropic: Building Effective Agents",
    source: "anthropic.com",
    url: "https://www.anthropic.com/engineering/building-effective-agents",
    desc: "Workflows vs agents, and a full catalog of design patterns",
  },
  {
    title: "Anthropic: Effective context engineering for AI agents",
    source: "anthropic.com",
    url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    desc: "Context engineering",
  },
  {
    title: "OpenAI Agents SDK Docs",
    source: "openai.github.io/openai-agents-python",
    url: "https://openai.github.io/openai-agents-python/",
    desc: "Official docs (Python): Agent / Runner / tools / sessions / tracing",
  },
  {
    title: "LangGraph Docs",
    source: "langchain-ai.github.io/langgraph",
    url: "https://langchain-ai.github.io/langgraph/",
    desc: "Official docs for the graph-structured agent framework",
  },
  {
    title: "LangSmith Docs",
    source: "docs.smith.langchain.com",
    url: "https://docs.smith.langchain.com/",
    desc: "Observability and evaluation platform",
  },
  {
    title: "OpenAI Cookbook",
    source: "cookbook.openai.com",
    url: "https://cookbook.openai.com/",
    desc: "Official code example library",
  },
  {
    title: "Tavily",
    source: "tavily.com",
    url: "https://www.tavily.com/",
    desc: "A search API built for agents",
  },
];
