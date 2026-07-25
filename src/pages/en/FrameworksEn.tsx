/**
 * Frameworks — English edition (/en/frameworks).
 * Full professional translation of the updated Chinese comparison page
 * (11 frameworks incl. Microsoft Agent Framework). Code samples, GitHub
 * links, star counts and dates are identical across languages (v2-design.md §2.1);
 * terminology follows the v2-design.md §2.2 glossary.
 */
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  Factory,
  FlaskConical,
  Github,
  GraduationCap,
  Puzzle,
  Sparkles,
  TriangleAlert,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import CodeBlock from "@/components/CodeBlock";
import { Badge, OpinionQuote, SectionHeading } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha, semanticStyle } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import {
  CODE_AGENTS_SDK,
  CODE_AUTOGEN,
  CODE_COZE,
  CODE_CREWAI,
  CODE_DIFY,
  CODE_LANGCHAIN,
  CODE_LANGGRAPH,
  CODE_LLAMAINDEX,
  CODE_MAF_AZURE,
  CODE_MAF_QUICKSTART,
  CODE_MAF_WORKFLOW,
  CODE_SEMANTIC_KERNEL,
  CODE_SMOLAGENTS,
} from "../frameworks/data";
import { scrollToId } from "../frameworks/utils";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type FilterKey = "all" | "code" | "lowcode" | "multi" | "maintenance" | "msft";

interface CompareRow {
  name: string;
  language: string;
  vendor: string;
  feature: string;
  audience: string;
  status: { label: string; tone: "green" | "amber" };
  extraStatus?: { label: string; color: string }[];
  pinned?: boolean;
  target: string;
  filters: FilterKey[];
}

const COMPARE_ROWS: CompareRow[] = [
  {
    name: "Microsoft Agent Framework",
    language: "Python / .NET",
    vendor: "Microsoft",
    feature:
      "Official merge of AutoGen orchestration + Semantic Kernel engineering; graph-based Workflows; dual-language",
    audience: "Microsoft/Azure stacks, .NET enterprises, AutoGen/SK migrations",
    status: { label: "1.0 GA", tone: "green" },
    extraStatus: [{ label: "2026.4", color: "var(--c-perceive)" }],
    pinned: true,
    target: "detail-maf",
    filters: ["code", "multi", "msft"],
  },
  {
    name: "LangChain",
    language: "Python / JS",
    vendor: "LangChain Inc.",
    feature: "Largest ecosystem, most integrations (600+); create_agent spins up agents fast",
    audience: "Beginners, teams needing rich integrations",
    status: { label: "1.0", tone: "green" },
    target: "detail-langchain",
    filters: ["code"],
  },
  {
    name: "LangGraph",
    language: "Python (TS Beta)",
    vendor: "LangChain Inc.",
    feature: "StateGraph orchestration with persistence, interruptible recovery, human-in-the-loop",
    audience: "Production / complex-workflow engineers",
    status: { label: "1.0", tone: "green" },
    target: "detail-langchain",
    filters: ["code"],
  },
  {
    name: "AutoGen",
    language: "Python",
    vendor: "Microsoft",
    feature: "Async message-driven multi-agent conversations",
    audience: "Researchers, multi-agent dialogue experiments",
    status: { label: "Maintenance", tone: "amber" },
    target: "detail-autogen",
    filters: ["code", "multi", "maintenance", "msft"],
  },
  {
    name: "CrewAI",
    language: "Python",
    vendor: "CrewAI Inc.",
    feature: "Role-playing multi-agent crews (Crew + Flow); fastest to learn",
    audience: "Content/research pipelines, rapid prototypes",
    status: { label: "Active", tone: "green" },
    target: "detail-crewai",
    filters: ["code", "multi"],
  },
  {
    name: "OpenAI Agents SDK",
    language: "Python",
    vendor: "OpenAI",
    feature: "Swarm successor; four primitives — Agent/Handoff/Guardrail/Tracing; minimalist",
    audience: "Developers building production agents on OpenAI",
    status: { label: "Active", tone: "green" },
    target: "detail-agents-sdk",
    filters: ["code", "multi"],
  },
  {
    name: "smolagents",
    language: "Python",
    vendor: "Hugging Face",
    feature: "Code-as-action (CodeAgent); a few thousand lines of core code; model-agnostic",
    audience: "Researchers, HF ecosystem users, learning agent internals",
    status: { label: "Active", tone: "green" },
    target: "detail-smolagents",
    filters: ["code"],
  },
  {
    name: "LlamaIndex",
    language: "Python / TS",
    vendor: "LlamaIndex Inc.",
    feature: "Data-centric RAG + agents (Workflows, AgentWorkflow)",
    audience: "Knowledge-base Q&A, RAG-first apps",
    status: { label: "Active", tone: "green" },
    target: "detail-llamaindex",
    filters: ["code"],
  },
  {
    name: "Semantic Kernel",
    language: "C# / Python",
    vendor: "Microsoft",
    feature: "Enterprise plugin/planner abstractions; .NET friendly",
    audience: "Microsoft/Azure/.NET enterprise teams",
    status: { label: "Maintenance", tone: "amber" },
    target: "detail-semantic-kernel",
    filters: ["code", "maintenance", "msft"],
  },
  {
    name: "Dify",
    language: "Python / TS",
    vendor: "LangGenius",
    feature: "Open-source low-code LLM app platform: visual orchestration + RAG + agents",
    audience: "Low-code users, product/ops, internal platforms",
    status: { label: "Active", tone: "green" },
    target: "detail-dify",
    filters: ["lowcode"],
  },
  {
    name: "Coze",
    language: "Go / TS (open source)",
    vendor: "ByteDance",
    feature: "Zero-code drag-and-drop agent building; plugins/knowledge base/workflows; open-sourced Jul 2025",
    audience: "Non-developers, China ecosystem, fast bot launches",
    status: { label: "Active", tone: "green" },
    target: "detail-coze",
    filters: ["lowcode"],
  },
];

interface CodeVariant {
  label: string;
  filename: string;
  code: string;
}

interface FrameworkDetail {
  anchor: string;
  number: string;
  name: string;
  vendor: string;
  stars: { repo: string; value: string }[];
  starHero?: boolean;
  status: { label: string; tone: "green" | "amber" };
  lowCode?: boolean;
  boldPrefix: string;
  positioning: string;
  langs?: { label: string; note?: string }[];
  concepts: string[];
  scenarios: string;
  pros: string[];
  cons: string[];
  diffNote?: string;
  github: { label: string; url: string; meta?: string }[];
  codes: CodeVariant[];
  migrationNote?: string;
  migrationTarget?: string;
  highlight?: string;
}

/** MAF lineage mini-diagram copy (English) */
const MAF_LINEAGE = {
  predecessors: [
    { name: "AutoGen", badge: "Maintenance", color: "var(--c-plan)", target: "detail-autogen" },
    { name: "Semantic Kernel", badge: "Maintenance", color: "var(--c-memory)", target: "detail-semantic-kernel" },
  ],
  merged: { name: "MAF", badge: "1.0 GA", color: "var(--c-perceive)" },
  caption: "Public preview 2025.10 · Merged team · Built-in migration assistants for both predecessors",
} as const;

const DETAILS: FrameworkDetail[] = [
  {
    anchor: "detail-maf",
    number: "01",
    name: "Microsoft Agent Framework",
    vendor: "Microsoft · MIT License",
    stars: [{ repo: "agent-framework", value: "~12k" }],
    status: { label: "1.0 GA", tone: "green" },
    boldPrefix: "Microsoft's official unified agent framework and runtime",
    positioning:
      "Microsoft's official unified agent framework and runtime — merging AutoGen's multi-agent orchestration with Semantic Kernel's enterprise foundation (type safety, middleware, observability, plugins) into one open-source SDK. 1.0 GA shipped 2026-04-03 with stable APIs and LTS.",
    langs: [{ label: "PYTHON" }, { label: "C#/.NET", note: "first-class" }],
    concepts: [
      "ChatAgent",
      "as_agent()",
      "Workflow",
      "SequentialBuilder",
      "ConcurrentBuilder",
      "Middleware",
      "Checkpoint",
      "OpenTelemetry",
      "MCP / A2A native",
    ],
    scenarios:
      "Production-grade systems on the Microsoft/Azure stack ｜ First choice for .NET/C# enterprise teams ｜ Official migration target for AutoGen/SK projects ｜ Multi-agent collaboration plus production compliance.",
    pros: [
      "One SDK ends the “prototype in AutoGen, production in SK” dilemma",
      "Dual-language + model-agnostic (OpenAI/Azure/Anthropic/Bedrock/Gemini/Ollama)",
      "Full production feature set (middleware, checkpoint recovery, OTel, MCP/A2A, Foundry guardrails)",
      "Stable APIs post-GA + built-in migration assistants",
    ],
    cons: [
      "Young framework (~12k stars; far fewer tutorials than the LangChain ecosystem; preview-era and current docs are mixed)",
      "Python release cadence lags .NET; fine-grained sub-package split takes discernment",
      "Best experience depends on the Azure/Foundry ecosystem",
      "Migration from AutoGen/SK is not zero-cost (message-driven conversations → graph workflows requires redesign)",
    ],
    diffNote:
      "LangGraph = neutral orchestration base; Agents SDK = lightweight OpenAI-native wrapper; MAF = Microsoft's official merge of AutoGen + SK — dual-language stacks and enterprise compliance are the differentiators; ecosystem neutrality and community size are the trade-offs.",
    github: [
      {
        label: "github.com/microsoft/agent-framework",
        url: "https://github.com/microsoft/agent-framework",
        meta: "2.1k forks · MIT",
      },
    ],
    codes: [
      { label: "quickstart.py", filename: "quickstart.py", code: CODE_MAF_QUICKSTART },
      { label: "azure.py", filename: "azure.py", code: CODE_MAF_AZURE },
      { label: "workflow.py", filename: "workflow.py", code: CODE_MAF_WORKFLOW },
    ],
  },
  {
    anchor: "detail-langchain",
    number: "02",
    name: "LangChain / LangGraph",
    vendor: "LangChain Inc.",
    stars: [
      { repo: "langchain", value: "~130k" },
      { repo: "langgraph", value: "~30k" },
    ],
    status: { label: "1.0", tone: "green" },
    boldPrefix: "LangChain is the largest LLM application framework",
    positioning:
      "LangChain is the largest LLM application framework (the high-level “get it running fast” layer); LangGraph is the same company's low-level orchestration runtime (state graphs + persistence + human-in-the-loop). Both shipped 1.0 jointly on Oct 22, 2025. The official path: start with LangChain's create_agent to get running quickly, then drop down to LangGraph's StateGraph when you need fine-grained control.",
    concepts: [
      "create_agent",
      "600+ integrations",
      "LCEL",
      "StateGraph",
      "Checkpointer",
      "interrupt()",
      "Supervisor / Handoff",
      "LangSmith",
    ],
    scenarios:
      "RAG and tool-calling agent prototypes (LangChain); production-grade long-running agents and multi-agent systems needing loops, branches, resume, human approval and audit trails (LangGraph — in production at ~400 companies incl. Klarna, Uber and LinkedIn).",
    pros: [
      "Unmatched ecosystem and docs; model-agnostic — switching models is one line",
      "LangGraph's state persistence and recoverability are the most mature in its class",
      "APIs stabilizing since 1.0",
    ],
    cons: [
      "Many abstraction layers; deep stacks when debugging edge cases",
      "Steep LangGraph learning curve (you must learn to “think in graphs”)",
      "Historically frequent API changes (eased after 1.0)",
    ],
    github: [
      { label: "langchain-ai/langchain", url: "https://github.com/langchain-ai/langchain" },
      { label: "langchain-ai/langgraph", url: "https://github.com/langchain-ai/langgraph" },
    ],
    codes: [
      { label: "LangChain create_agent (4 core lines)", filename: "langchain_agent.py", code: CODE_LANGCHAIN },
      { label: "LangGraph StateGraph skeleton", filename: "langgraph_agent.py", code: CODE_LANGGRAPH },
    ],
  },
  {
    anchor: "detail-autogen",
    number: "03",
    name: "Microsoft AutoGen",
    vendor: "Microsoft",
    stars: [{ repo: "autogen", value: "~55k" }],
    status: { label: "Maintenance", tone: "amber" },
    boldPrefix: "Microsoft's “multi-agent as conversation” framework",
    positioning:
      "Microsoft's “multi-agent as conversation” framework, modeling multi-agent collaboration as async message passing and dialogue. In maintenance mode since Oct 2025 (bug fixes only, no new features). Microsoft officially recommends migrating new projects to the Microsoft Agent Framework (MAF), which unifies AutoGen and Semantic Kernel; the community fork is AG2.",
    concepts: [
      "AssistantAgent",
      "UserProxyAgent",
      "GroupChat",
      "GroupChatManager",
      "Async event-driven",
      "Magentic-One",
    ],
    scenarios:
      "Research and experiments with multi-agent dialogues/debates/collaboration, teaching multi-agent interaction patterns, existing projects in Azure enterprise environments.",
    pros: [
      "Natural expressiveness of the multi-agent conversation paradigm; widely cited in research",
      "More modern async architecture since 0.4",
      "The AG2 community fork keeps evolving (incl. A2A protocol support)",
    ],
    cons: [
      "Architecture was rebuilt (0.2→0.4 breaking changes); learning materials are mixed old/new",
      "In maintenance mode — long-term bets should move to MAF/AG2",
      "Conversational orchestration consumes more tokens",
    ],
    github: [{ label: "microsoft/autogen", url: "https://github.com/microsoft/autogen" }],
    codes: [{ label: "AssistantAgent minimal example", filename: "autogen_chat.py", code: CODE_AUTOGEN }],
    migrationNote:
      "Official migration target is GA: see #01 Microsoft Agent Framework (click the lineage diagram in its card to jump back here). The community fork AG2 remains active.",
    migrationTarget: "detail-maf",
  },
  {
    anchor: "detail-crewai",
    number: "04",
    name: "CrewAI",
    vendor: "CrewAI Inc.",
    stars: [{ repo: "crewAI", value: "~50k" }],
    status: { label: "Active", tone: "green" },
    boldPrefix: "A multi-agent orchestration framework built on the “role-playing crew” metaphor",
    positioning:
      "A multi-agent orchestration framework built on the “role-playing crew” metaphor — give each agent a role/goal/backstory, assemble a Crew, assign Tasks, and it runs. It has the largest community and the fastest onboarding among independent frameworks.",
    concepts: ["Agent", "Task", "Crew", "Flow", "Process", "YAML config", "Task delegation"],
    scenarios:
      "Content production pipelines (research → writing → editing), research-report generation, business analysis — tasks with naturally clear role division; rapid prototypes and demos.",
    pros: [
      "Intuitive concepts (zero to a running multi-agent system in 30 minutes)",
      "Friendly documentation",
      "Independent of LangChain, no legacy baggage",
      "Flow provides the deterministic control production needs",
    ],
    cons: [
      "The role abstraction is a “black box” when you need fine-grained control over agent internals",
      "Reliability on complex tasks is weaker than graph-based frameworks like LangGraph",
      "Feature gradient between the commercial (CrewAI AMP) and open-source editions",
    ],
    github: [{ label: "crewAIInc/crewAI", url: "https://github.com/crewAIInc/crewAI" }],
    codes: [{ label: "Researcher + writer two-agent Crew", filename: "crewai_team.py", code: CODE_CREWAI }],
    highlight: "Zero to a running multi-agent system in 30 minutes",
  },
  {
    anchor: "detail-agents-sdk",
    number: "05",
    name: "OpenAI Agents SDK",
    vendor: "OpenAI · production successor to Swarm",
    stars: [{ repo: "openai-agents-python", value: "~25k" }],
    status: { label: "Active", tone: "green" },
    boldPrefix: "OpenAI's official lightweight multi-agent framework",
    positioning:
      "OpenAI's official lightweight multi-agent framework, released Mar 2025 as the production-grade successor to the experimental Swarm project — covering multi-agent workflows with just four core primitives: Agent, Handoff, Guardrail and Tracing.",
    concepts: ["Agent", "Handoff", "Guardrail", "Tracing", "Runner", "Sessions", "MCP"],
    scenarios:
      "Rapidly building customer-service routing and triage-style multi-agent apps on OpenAI models (other providers compatible); production agents with observability requirements.",
    pros: [
      "Minimal API surface — productive within hours",
      "Guardrails make safety checks first-class",
      "Built-in tracing out of the box",
      "Maintained by OpenAI",
    ],
    cons: [
      "Deliberately thin orchestration — complex coordination (parallel fan-in, fine-grained state machines) must be built outside the SDK",
      "Best within the OpenAI ecosystem; the cross-model experience is second-tier",
    ],
    github: [
      { label: "openai/openai-agents-python", url: "https://github.com/openai/openai-agents-python" },
    ],
    codes: [{ label: "Triage → weather-bot Handoff", filename: "agents_sdk.py", code: CODE_AGENTS_SDK }],
  },
  {
    anchor: "detail-smolagents",
    number: "06",
    name: "Hugging Face smolagents",
    vendor: "Hugging Face",
    stars: [{ repo: "smolagents", value: "~25k" }],
    status: { label: "Active", tone: "green" },
    boldPrefix: "Hugging Face's minimalist agent library",
    positioning:
      "Hugging Face's minimalist agent library (a few thousand lines of core code), championing “code as action” — agents write and execute Python directly to compose tool calls, using ~30% fewer steps and LLM calls than traditional JSON tool calling on official benchmarks.",
    concepts: [
      "CodeAgent",
      "ToolCallingAgent",
      "@tool",
      "InferenceClientModel",
      "LiteLLMModel",
      "E2B / Docker sandbox",
    ],
    scenarios:
      "Learning agent internals (short, readable source — superb teaching material), research and benchmarks, the HF ecosystem (sharing tools/agents on the Hub), “write code to solve it” tasks (data processing, multi-step computation).",
    pros: [
      "Minimalist and transparent, few dependencies",
      "Fully model-agnostic (first-class open-model experience)",
      "The CodeAgent paradigm is efficient on complex tasks",
      "Maintained by Hugging Face, fast iteration",
    ],
    cons: [
      "Code execution introduces safety and stability concerns (needs sandboxing)",
      "Lacks production-grade persistence/audit enterprise features",
      "Smaller ecosystem than LangChain",
    ],
    github: [{ label: "huggingface/smolagents", url: "https://github.com/huggingface/smolagents" }],
    codes: [{ label: "CodeAgent minimal example", filename: "smolagents_agent.py", code: CODE_SMOLAGENTS }],
    highlight: "Official benchmark: ~30% fewer steps and LLM calls than traditional JSON tool calling",
  },
  {
    anchor: "detail-llamaindex",
    number: "07",
    name: "LlamaIndex",
    vendor: "LlamaIndex Inc.",
    stars: [{ repo: "llama_index", value: "~45k" }],
    status: { label: "Active", tone: "green" },
    boldPrefix: "A data-centric LLM framework",
    positioning:
      "A data-centric LLM framework — one of the industry's de facto RAG standards — offering agent and multi-agent Workflow capabilities on top of powerful data connection, indexing and retrieval, ideal for “knowledge-base-first” intelligent applications.",
    concepts: [
      "Document / Node",
      "Index",
      "Retriever",
      "QueryEngine",
      "FunctionAgent",
      "AgentWorkflow",
      "LlamaHub connectors",
    ],
    scenarios:
      "Enterprise knowledge-base Q&A, agentic RAG (retrieval interleaved with reasoning), agent apps connecting many heterogeneous data sources (PDFs, databases, Notion, Slack…).",
    pros: [
      "The most complete data ingestion and indexing capabilities",
      "Smooth upgrade path from RAG to agents",
      "Comprehensive docs and tutorials",
      "Python/TS dual stack",
    ],
    cons: [
      "Pure agent orchestration is not its home turf (complex multi-agent control is weaker than LangGraph)",
      "Scattered package structure (llama-index-core + many integration packs) — beginners get lost",
      "Fast-moving APIs",
    ],
    github: [{ label: "run-llama/llama_index", url: "https://github.com/run-llama/llama_index" }],
    codes: [{ label: "FunctionAgent minimal example", filename: "llamaindex_agent.py", code: CODE_LLAMAINDEX }],
  },
  {
    anchor: "detail-semantic-kernel",
    number: "08",
    name: "Semantic Kernel",
    vendor: "Microsoft",
    stars: [{ repo: "semantic-kernel", value: "~25k" }],
    status: { label: "Maintenance", tone: "amber" },
    boldPrefix: "Microsoft's enterprise AI orchestration SDK",
    positioning:
      "Microsoft's enterprise AI orchestration SDK — embedding LLM capabilities into existing (especially .NET) business systems via the Kernel + Plugin/Function abstraction. In maintenance mode together with AutoGen since Oct 2025; succeeded by the Microsoft Agent Framework.",
    concepts: [
      "Kernel",
      "Plugin / KernelFunction",
      "Planners",
      "ChatCompletionAgent",
      "AgentGroupChat",
      "Connectors",
    ],
    scenarios:
      "Embedding AI into existing .NET/C# enterprise systems; Azure-stack teams. New projects should evaluate the Microsoft Agent Framework directly.",
    pros: [
      "Best-in-class C#/.NET support (Python second)",
      "Plugin design fits enterprise engineering practice (DI, middleware, telemetry)",
      "Microsoft enterprise support",
    ],
    cons: [
      "In maintenance mode; the future converges on MAF",
      "Frequent Python API changes, lagging docs",
      "Agent capabilities were historically weak (multi-agent depended on AutoGen)",
    ],
    github: [
      { label: "microsoft/semantic-kernel", url: "https://github.com/microsoft/semantic-kernel" },
    ],
    codes: [{ label: "Kernel + Plugin minimal example", filename: "semantic_kernel.py", code: CODE_SEMANTIC_KERNEL }],
    migrationNote:
      "In maintenance mode. Official migration target is GA: see #01 Microsoft Agent Framework (click the lineage diagram in its card to jump back here).",
    migrationTarget: "detail-maf",
  },
  {
    anchor: "detail-dify",
    number: "09",
    name: "Dify",
    vendor: "LangGenius",
    stars: [{ repo: "dify", value: "~140k" }],
    starHero: true,
    status: { label: "Active", tone: "green" },
    lowCode: true,
    boldPrefix: "An open-source, self-hostable all-in-one LLM application platform",
    positioning:
      "An open-source, self-hostable all-in-one LLM application platform — a visual canvas for orchestrating agents, workflows and RAG, plus full LLMOps (evaluation, logging, monitoring). One of the hottest AI application platform projects on GitHub.",
    concepts: ["Visual node canvas", "Chatflow", "Workflow", "Knowledge-base RAG", "Tool/plugin marketplace", "LLMOps", "One-click API publishing"],
    scenarios:
      "Building enterprise knowledge-base Q&A, customer-service bots and content pipelines with little or no code; private deployment as an SMB internal AI platform; teams opening AI app building to non-engineers.",
    pros: [
      "Full-stack out of the box (UI + backend + RAG + observability), extremely active community",
      "Permissive Apache-2.0-style license (additional terms apply; multi-tenant SaaS requires authorization)",
      "Broad model support (major international and Chinese models)",
      "Adopted by 30+ Fortune 500 companies",
    ],
    cons: [
      "The low-code canvas gets bloated under complex logic; less flexible than code frameworks",
      "Deep customization requires reading its Python/Vue source",
      "Some enterprise features (SSO, audit) are paywalled",
    ],
    github: [{ label: "langgenius/dify", url: "https://github.com/langgenius/dify" }],
    codes: [{ label: "Calling a published app's API", filename: "dify_api.py", code: CODE_DIFY }],
  },
  {
    anchor: "detail-coze",
    number: "10",
    name: "Coze",
    vendor: "ByteDance",
    stars: [{ repo: "coze-studio", value: "10k+ within days" }],
    status: { label: "Active", tone: "green" },
    lowCode: true,
    boldPrefix: "ByteDance's AI agent development platform",
    positioning:
      "ByteDance's AI agent development platform — drag nodes to orchestrate agents and workflows with zero/low code; the most widely used among consumers and SMBs in China. On Jul 26, 2025 it open-sourced its core engines Coze Studio (dev platform) and Coze Loop (evaluation & ops) under Apache 2.0, passing 10k stars within days.",
    concepts: ["Bot / agent", "Plugins", "Knowledge-base RAG", "Workflow engine", "Multi-channel publishing", "Coze Loop evaluation & ops"],
    scenarios:
      "Non-developers shipping a usable bot in 5 minutes; customer-service/marketing/knowledge-base scenarios on Chinese models (Doubao, DeepSeek, etc.) and IM channels; private in-enterprise deployment under Apache 2.0 (runs on 2 cores / 4 GB).",
    pros: [
      "Lowest onboarding barrier in its class; rich template ecosystem",
      "Naturally smooth integration with Chinese models and channels",
      "Permissive, commercial-friendly license; low deployment threshold",
    ],
    cons: [
      "Feature gaps between open-source and commercial editions (e.g. voice timbre is commercial-only)",
      "Deep customization means reading Go + TypeScript source",
      "Visual orchestration also has a ceiling under complex logic",
      "Overseas ecosystem weaker than Dify",
    ],
    github: [
      { label: "coze-dev/coze-studio", url: "https://github.com/coze-dev/coze-studio" },
      { label: "coze-dev/coze-loop (evaluation & ops)", url: "https://github.com/coze-dev/coze-loop" },
    ],
    codes: [{ label: "Calling a self-hosted Coze Studio bot", filename: "coze_api.py", code: CODE_COZE }],
  },
];

/** Closing cheat sheet (MAF segment bold + cyan) */
const CHEATSHEET_SEGMENTS: { text: string; accent?: boolean }[] = [
  {
    text: "Learn the internals: smolagents / Agents SDK ｜ Production at scale: LangGraph ｜ Team pipelines: CrewAI ｜ Knowledge bases: LlamaIndex ｜ ",
  },
  { text: "Microsoft-stack/.NET: go straight to MAF (GA Apr 2026)", accent: true },
  { text: " ｜ No code: Dify (self-hosted) / Coze (China)" },
];

interface SelectorItem {
  name: string;
  target?: string;
  reason: string;
}

interface SelectorTab {
  key: string;
  label: string;
  sub: string;
  items: SelectorItem[];
  footnote?: string;
}

const SELECTOR_TABS: SelectorTab[] = [
  {
    key: "beginner",
    label: "Beginner",
    sub: "Understand how agents work and write your first running agent",
    items: [
      {
        name: "OpenAI Agents SDK or smolagents",
        target: "detail-agents-sdk",
        reason: "Few primitives, low mental load; smolagents' short source is ideal for learning the internals.",
      },
      {
        name: "LangChain create_agent",
        target: "detail-langchain",
        reason: "Results in 4 lines of code, with the largest ecosystem attached.",
      },
      {
        name: "Coze (China) / Dify (self-hosted)",
        target: "detail-coze",
        reason: "No code: drag out your first bot, build intuition, then come back to code.",
      },
    ],
  },
  {
    key: "production",
    label: "Production",
    sub: "Shipping, stability and observability",
    items: [
      {
        name: "LangGraph",
        target: "detail-langchain",
        reason: "Most mature state persistence, resume, human-in-the-loop and audit trails; production-proven at 400+ companies; stacks with LangChain/LangSmith.",
      },
      {
        name: "OpenAI Agents SDK",
        target: "detail-agents-sdk",
        reason: "The production shortcut inside the OpenAI ecosystem (Guardrails + Tracing out of the box).",
      },
      {
        name: "Microsoft Agent Framework",
        target: "detail-maf",
        reason: "Stable APIs + LTS commitment since GA (Apr 2026); Microsoft/Azure/.NET teams can shortlist it as first choice — checkpoint recovery, OTel and Foundry guardrails out of the box.",
      },
      {
        name: "CrewAI (Crew + Flow)",
        target: "detail-crewai",
        reason: "Business pipelines with clear role division; engineering determinism backed by Flow.",
      },
    ],
  },
  {
    key: "research",
    label: "Research",
    sub: "Multi-agent experiments, benchmarks, reading source",
    items: [
      {
        name: "AutoGen / AG2",
        target: "detail-autogen",
        reason: "The classic implementation of the multi-agent conversation paradigm, widely cited; new projects can look at the AG2 community fork. (In maintenance mode — evaluate MAF for new projects)",
      },
      {
        name: "smolagents",
        target: "detail-smolagents",
        reason: "CodeAgent paradigm + model-agnostic; easy to swap in open models for evaluations.",
      },
      {
        name: "LangGraph",
        target: "detail-langchain",
        reason: "The standard base for multi-agent topology research (Supervisor/Handoff/Network).",
      },
    ],
  },
  {
    key: "lowcode",
    label: "Low-code / No-code",
    sub: "Ship without writing code",
    items: [
      {
        name: "Coze",
        target: "detail-coze",
        reason: "China scenarios, multi-channel publishing, minimal onboarding; the open-source edition is self-hostable under Apache 2.0.",
      },
      {
        name: "Dify",
        target: "detail-dify",
        reason: "Open-source self-hosting, enterprise knowledge base + LLMOps in one, overseas ecosystem.",
      },
    ],
    footnote:
      "Rule of thumb: choose low-code when “configurers” outnumber “developers”; once the logic gets complex enough that the canvas starts tying itself in knots, migrate back to a code framework (both Dify and Coze support API embedding and can mix with code frameworks).",
  },
];

/* ------------------------------------------------------------------ */
/* S1. Page header                                                     */
/* ------------------------------------------------------------------ */

const TITLE_A = "Eleven frameworks.";
const TITLE_B = "Which one is yours?";

/** word-stagger heading (whitespace-safe) */
function StaggerWords({ text, startDelay, className }: { text: string; startDelay: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: startDelay + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}

function PageHeader() {
  return (
    <section className="bg-grid-texture relative overflow-hidden pb-16 pt-40 max-md:pt-28">
      {/* green glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full"
        style={{
          background: `radial-gradient(closest-side, ${semanticAlpha(SEMANTIC.tool, 8)}, transparent)`,
        }}
      />
      <div className="relative mx-auto max-w-prose2 px-6 max-md:px-5">
        {/* breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          <Link to="/en" className="transition-colors hover:text-c-perceive">
            HOME
          </Link>
          <ChevronRight size={12} />
          <span className="text-c-tool">Frameworks</span>
        </nav>

        <Badge color={SEMANTIC.tool} className="mb-5">
          11 frameworks · data verified mid-2026
        </Badge>

        <h1 className="text-h1 font-black text-text-primary">
          <StaggerWords text={TITLE_A} startDelay={0} />
          <StaggerWords text={TITLE_B} startDelay={0.35} className="text-grad" />
        </h1>

        <motion.p
          className="mt-6 text-body-lg text-text-secondary"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.5 }}
        >
          The agent framework landscape went through a major consolidation in 2025–2026. We
          verified every framework's real GitHub data, maintenance status and a minimal
          runnable example — and give you scenario-based selection advice.
        </motion.p>

        {/* timeliness notice: amber outlined panel */}
        <motion.div
          className="mt-8 flex items-start gap-3 rounded-xl border border-c-plan/50 bg-c-plan/5 px-5 py-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-c-plan" />
          <p className="text-body-sm text-text-secondary">
            <strong className="font-semibold text-c-plan">Landscape shift: </strong>
            Microsoft launched the unified Microsoft Agent Framework in Oct 2025,
            <strong className="font-semibold text-text-primary"> shipping 1.0 GA on Apr 3, 2026</strong>
            {" "}(AutoGen and Semantic Kernel entered maintenance mode; MAF is Microsoft's sole
            long-term investment in agents). LangChain/LangGraph jointly released 1.0 on Oct 22,
            2025; OpenAI Swarm was archived in Mar 2025, succeeded by the Agents SDK.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S2. Comparison table                                                */
/* ------------------------------------------------------------------ */

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "code", label: "Code frameworks" },
  { key: "lowcode", label: "Low-code platforms" },
  { key: "multi", label: "Multi-agent" },
  { key: "maintenance", label: "Maintenance mode" },
  { key: "msft", label: "Microsoft" },
];

function CompareTable() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const rows = COMPARE_ROWS.filter((r) => filter === "all" || r.filters.includes(filter));

  return (
    <section id="compare" className="scroll-mt-24 py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="COMPARE"
          tagColor={SEMANTIC.tool}
          title="Eleven frameworks at a glance"
          lead="Click any row to jump to its detail card (with a minimal runnable example)."
        />

        {/* filter chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-body-sm transition-all duration-[250ms]",
                  active
                    ? "border-c-tool bg-c-tool/15 font-medium text-c-tool"
                    : "border-border-subtle bg-bg-1 text-text-secondary hover:border-border-strong hover:text-text-primary",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* table (horizontal scroll on mobile) */}
        <motion.div
          className="overflow-x-auto rounded-2xl border border-border-subtle bg-bg-1"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <table className="w-full min-w-[960px] border-collapse text-left text-body-sm">
            <motion.thead
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <tr className="border-b border-border-strong bg-bg-2">
                {["Framework", "Language", "Vendor", "Key traits", "Best for", "Status", "Details"].map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 whitespace-nowrap bg-bg-2 px-4 py-3.5 font-mono text-caption font-medium uppercase tracking-[0.12em] text-text-tertiary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </motion.thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    onClick={() => scrollToId(r.target)}
                    className={cn(
                      "cursor-pointer border-b border-border-subtle transition-colors last:border-0 hover:bg-bg-2",
                      r.pinned && "bg-bg-2/40",
                    )}
                    style={
                      r.pinned ? { boxShadow: `inset 2px 0 0 ${SEMANTIC.perceive}` } : undefined
                    }
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-medium text-text-primary">
                      {r.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[13px] text-text-secondary">
                      {r.language}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-text-secondary">{r.vendor}</td>
                    <td className="px-4 py-3.5 text-text-secondary">{r.feature}</td>
                    <td className="px-4 py-3.5 text-text-secondary">{r.audience}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs"
                          style={semanticStyle(
                            r.status.tone === "green" ? SEMANTIC.tool : SEMANTIC.plan,
                          )}
                        >
                          {r.status.label}
                        </span>
                        {r.extraStatus?.map((b) => (
                          <span
                            key={b.label}
                            className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs"
                            style={semanticStyle(b.color)}
                          >
                            {b.label}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-c-perceive">
                        Details
                        <ArrowDownRight size={14} />
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>

        <p className="mt-4 text-caption text-text-tertiary">
          Star counts are approximate (mid-2026) — re-verify before making decisions.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S3. Detail cards                                                    */
/* ------------------------------------------------------------------ */

function StarBadge({ repo, value, hero }: { repo: string; value: string; hero?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-c-perceive/30 bg-c-perceive/10 px-2 py-0.5 font-nums text-c-perceive",
        hero ? "text-base font-bold" : "text-xs",
      )}
    >
      <span className="font-mono text-[11px] text-text-tertiary">{repo}</span>★ {value}
    </span>
  );
}

function Watermark({ number }: { number: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  return (
    <motion.span
      ref={ref}
      aria-hidden
      style={{ y }}
      className="pointer-events-none absolute -top-6 right-4 select-none font-mono text-[120px] font-bold leading-none text-text-primary/[0.04] max-md:text-[80px]"
    >
      {number}
    </motion.span>
  );
}

/** MAF lineage mini-diagram (AutoGen + Semantic Kernel → MAF), HTML/CSS + inline SVG */
function LineageDiagram() {
  return (
    <div className="mt-5 rounded-xl border border-border-subtle bg-bg-2/50 px-4 py-4">
      <style>{`
        @keyframes maf-dash-flow-en { to { stroke-dashoffset: -18; } }
        .maf-dash-en { stroke-dasharray: 5 4; animation: maf-dash-flow-en 2s linear infinite; }
      `}</style>
      <div className="flex flex-wrap items-center gap-x-1 gap-y-3">
        <div className="flex flex-col gap-2">
          {MAF_LINEAGE.predecessors.map((p, i) => (
            <motion.button
              key={p.name}
              type="button"
              onClick={() => scrollToId(p.target)}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 420, damping: 17, delay: 0.3 + i * 0.12 }}
              className="flex items-center gap-2.5 rounded-lg border border-border-subtle bg-bg-1 px-3 py-2 text-left transition-colors duration-[250ms] hover:border-border-strong"
              title={`Back to the ${p.name} card`}
            >
              <span className="h-3 w-3 shrink-0 rounded-[3px]" style={{ backgroundColor: p.color }} />
              <span className="font-mono text-xs font-medium text-text-primary">{p.name}</span>
              <span className="rounded border px-1 py-px font-mono text-[10px]" style={semanticStyle(p.color)}>
                {p.badge}
              </span>
            </motion.button>
          ))}
        </div>

        <motion.svg
          aria-hidden
          viewBox="0 0 72 64"
          className="h-14 w-16 shrink-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.54 }}
        >
          <path d="M4 14 C 34 14, 34 32, 56 32" className="maf-dash-en" fill="none" stroke={SEMANTIC.perceive} strokeWidth="1.5" />
          <path d="M4 50 C 34 50, 34 32, 56 32" className="maf-dash-en" fill="none" stroke={SEMANTIC.perceive} strokeWidth="1.5" />
          <path d="M54 25 L68 32 L54 39" fill="none" stroke={SEMANTIC.perceive} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 420, damping: 17, delay: 0.66 }}
          className="flex items-center gap-2.5 rounded-lg border px-3 py-2"
          style={{
            borderColor: semanticAlpha(SEMANTIC.perceive, 40),
            backgroundColor: semanticAlpha(SEMANTIC.perceive, 8),
          }}
        >
          <span
            className="h-3 w-3 shrink-0 rounded-[3px]"
            style={{
              backgroundColor: SEMANTIC.perceive,
              boxShadow: `0 0 10px ${semanticAlpha(SEMANTIC.perceive, 70)}`,
            }}
          />
          <span className="font-mono text-xs font-semibold text-c-perceive">
            {MAF_LINEAGE.merged.name}
          </span>
          <span className="rounded border px-1 py-px font-mono text-[10px]" style={semanticStyle(SEMANTIC.perceive)}>
            {MAF_LINEAGE.merged.badge}
          </span>
        </motion.div>
      </div>
      <p className="mt-3 font-mono text-[11px] text-text-tertiary">{MAF_LINEAGE.caption}</p>
    </div>
  );
}

function DetailCard({ detail: d }: { detail: FrameworkDetail }) {
  const [tab, setTab] = useState(0);
  const code = d.codes[tab];
  const isMaf = d.anchor === "detail-maf";

  return (
    <motion.article
      id={d.anchor}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55 }}
      className={cn(
        "relative scroll-mt-24 overflow-hidden rounded-2xl border bg-bg-1 p-8 transition-colors duration-[250ms] max-md:p-5",
        isMaf
          ? "border-c-perceive/30 hover:border-c-perceive/50"
          : "border-border-subtle hover:border-border-strong",
      )}
    >
      {/* MAF only: top 3px cyan→purple gradient band */}
      {isMaf && (
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-0 h-[3px] origin-left"
          style={{
            background: `linear-gradient(90deg, ${SEMANTIC.perceive}, ${SEMANTIC.memory})`,
          }}
        />
      )}

      <Watermark number={d.number} />

      <header className="relative mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-caption tracking-widest text-text-tertiary">
            {d.number}
          </span>
          {d.lowCode && <Badge color={SEMANTIC.memory}>LOW-CODE</Badge>}
          <span
            className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs"
            style={semanticStyle(d.status.tone === "green" ? SEMANTIC.tool : SEMANTIC.plan)}
          >
            {d.status.label}
          </span>
          {d.langs?.map((l) => (
            <span
              key={l.label}
              className="inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-2 px-2 py-0.5 font-mono text-xs text-text-secondary"
            >
              {l.label}
              {l.note && <span className="text-[10px] text-c-perceive">{l.note}</span>}
            </span>
          ))}
          {/* MAF only: top-right gradient badge */}
          {isMaf && (
            <span
              className="ml-auto inline-flex items-center rounded-md px-2.5 py-1 font-nums text-xs font-bold text-white shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${SEMANTIC.perceive}, ${SEMANTIC.memory})`,
              }}
            >
              Latest GA · Apr 3, 2026
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h3 className="text-h3 font-bold text-text-primary">{d.name}</h3>
          <span className="text-caption text-text-tertiary">{d.vendor}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {d.stars.map((s) => (
            <StarBadge key={s.repo} repo={s.repo} value={s.value} hero={d.starHero} />
          ))}
        </div>
      </header>

      <div className="relative grid gap-8 lg:grid-cols-[55fr_45fr]">
        {/* left: info */}
        <div>
          <p className="text-body text-text-secondary">
            <strong className="font-semibold text-text-primary">{d.boldPrefix}</strong>
            {d.positioning.slice(d.boldPrefix.length)}
          </p>

          {isMaf && <LineageDiagram />}

          {d.migrationNote &&
            (d.migrationTarget ? (
              <button
                type="button"
                onClick={() => scrollToId(d.migrationTarget!)}
                className="mt-4 flex w-full items-start gap-2 rounded-lg border border-c-perceive/40 bg-c-perceive/5 px-3.5 py-2.5 text-left text-body-sm text-c-perceive transition-colors duration-[250ms] hover:border-c-perceive hover:bg-c-perceive/10"
              >
                <ArrowUp size={15} className="mt-0.5 shrink-0" />
                {d.migrationNote}
              </button>
            ) : (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-c-plan/40 bg-c-plan/5 px-3.5 py-2.5 text-body-sm text-c-plan">
                <TriangleAlert size={15} className="mt-0.5 shrink-0" />
                {d.migrationNote}
              </p>
            ))}

          {d.highlight && (
            <p className="mt-4 flex items-center gap-2 text-body-sm font-medium">
              <Sparkles size={15} className="shrink-0 text-c-tool" />
              <span className="text-grad font-nums text-base font-bold">{d.highlight}</span>
            </p>
          )}

          {/* core concepts */}
          <div className="mt-5">
            <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
              Core concepts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {d.concepts.map((c) => (
                <span
                  key={c}
                  className="rounded-md border border-border-subtle bg-bg-2 px-2 py-0.5 font-mono text-xs text-c-tool"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* scenarios */}
          <p className="mt-5 text-body-sm text-text-secondary">
            <span className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
              Best for
            </span>
            {d.scenarios}
          </p>

          {/* pros / cons */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-c-tool">
                Pros
              </p>
              <ul className="space-y-1.5">
                {d.pros.map((p) => (
                  <li key={p} className="flex items-start gap-1.5 text-body-sm text-text-secondary">
                    <Check size={14} className="mt-1 shrink-0 text-c-tool" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-c-loop">
                Cons
              </p>
              <ul className="space-y-1.5">
                {d.cons.map((c) => (
                  <li key={c} className="flex items-start gap-1.5 text-body-sm text-text-secondary">
                    <X size={14} className="mt-1 shrink-0 text-c-loop" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* one-line differentiation */}
          {d.diffNote && (
            <p className="mt-5 rounded-lg bg-bg-2 px-4 py-3 font-mono text-[13px] leading-relaxed text-text-secondary">
              {d.diffNote}
            </p>
          )}

          {/* GitHub links */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {d.github.map((g) => (
              <span key={g.url} className="inline-flex items-center gap-2">
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-lg border border-border-subtle px-3.5 py-2 font-mono text-[13px] text-text-secondary transition-colors hover:border-c-perceive hover:text-c-perceive"
                >
                  <Github size={15} />
                  {g.label}
                  <span className="transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                    ↗
                  </span>
                </a>
                {g.meta && (
                  <span className="font-mono text-caption text-text-tertiary">{g.meta}</span>
                )}
              </span>
            ))}
          </div>

          {/* OpenAI Agents SDK only: Capstone internal link */}
          {d.anchor === "detail-agents-sdk" && (
            <Link
              to="/en/capstone"
              className="group mt-4 inline-flex items-center gap-1.5 text-body-sm text-c-perceive"
            >
              This site's Capstone tutorial uses this SDK
              <ArrowRight
                size={14}
                className="transition-transform duration-[250ms] group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {/* right: code samples */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          {d.codes.length > 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {d.codes.map((c, i) => (
                <button
                  key={c.filename}
                  type="button"
                  onClick={() => setTab(i)}
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-xs transition-all duration-[250ms]",
                    tab === i
                      ? "border-c-tool bg-c-tool/15 text-c-tool"
                      : "border-border-subtle bg-bg-1 text-text-secondary hover:border-border-strong hover:text-text-primary",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
          <CodeBlock
            key={code.filename}
            code={code.code}
            language="python"
            filename={code.filename}
          />
        </motion.div>
      </div>
    </motion.article>
  );
}

function DetailCards() {
  return (
    <section className="py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="DEEP DIVE"
          tagColor={SEMANTIC.tool}
          title="Framework by framework: positioning, trade-offs and minimal examples"
          lead="Each card includes a one-line positioning, core concepts, honest pros and cons, and a minimal code sample you can run directly."
        />
        <div className="space-y-12">
          {DETAILS.map((d) => (
            <DetailCard key={d.anchor} detail={d} />
          ))}

          {/* 11 · closing cheat sheet */}
          <motion.aside
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55 }}
            className="relative overflow-hidden rounded-2xl border border-c-tool/40 bg-bg-1 p-8 max-md:p-5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-0.5"
              style={{ background: `linear-gradient(90deg, ${SEMANTIC.tool}, transparent)` }}
            />
            <p className="mb-3 font-mono text-caption tracking-widest text-text-tertiary">11</p>
            <h3 className="mb-4 text-h3 font-bold text-text-primary">Cheat sheet</h3>
            <p className="font-mono text-body-sm leading-loose">
              {CHEATSHEET_SEGMENTS.map((s) => (
                <span
                  key={s.text}
                  className={s.accent ? "font-semibold text-c-tool" : "text-text-secondary"}
                >
                  {s.text}
                </span>
              ))}
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S4. Selector wizard                                                 */
/* ------------------------------------------------------------------ */

const TAB_ICONS: Record<string, LucideIcon> = {
  beginner: GraduationCap,
  production: Factory,
  research: FlaskConical,
  lowcode: Puzzle,
};

function Selector() {
  const [active, setActive] = useState(SELECTOR_TABS[0].key);
  const tab = SELECTOR_TABS.find((t) => t.key === active) ?? SELECTOR_TABS[0];

  return (
    <section id="selector" className="scroll-mt-24 bg-bg-1 py-24 max-md:py-16">
      <div className="mx-auto max-w-prose2 px-6 max-md:px-5">
        <SectionHeading
          tag="SELECTOR"
          tagColor={SEMANTIC.tool}
          title="Straight answers for your scenario"
          lead="The four most common learner scenarios, each with ranked recommendations and a one-line rationale. Click a framework name to revisit its detail card above."
        />

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Selection scenarios"
          className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-border-subtle"
        >
          {SELECTOR_TABS.map((t) => {
            const Icon = TAB_ICONS[t.key];
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActive(t.key)}
                className={cn(
                  "relative flex items-center gap-2 pb-3 text-body font-medium transition-colors duration-[250ms]",
                  isActive ? "text-c-tool" : "text-text-secondary hover:text-text-primary",
                )}
              >
                <Icon size={17} />
                {t.label}
                {isActive && (
                  <motion.span
                    layoutId="selector-tab-indicator-en"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-c-tool"
                    transition={{ duration: 0.25 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="mb-6 text-body-sm text-text-tertiary">{tab.sub}</p>
            <ol className="space-y-4">
              {tab.items.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="flex items-start gap-4 rounded-xl border border-border-subtle bg-bg-0 p-5"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18, delay: i * 0.07 }}
                    className="text-grad flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-2 font-nums text-base font-bold"
                  >
                    {i + 1}
                  </motion.span>
                  <div>
                    {item.target ? (
                      <button
                        type="button"
                        onClick={() => scrollToId(item.target!)}
                        className="text-left text-body font-semibold text-text-primary underline decoration-c-tool/50 decoration-dotted underline-offset-4 transition-colors hover:text-c-tool"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <p className="text-body font-semibold text-text-primary">{item.name}</p>
                    )}
                    <p className="mt-1 text-body-sm text-text-secondary">{item.reason}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            {tab.footnote && (
              <div className="mt-6">
                <OpinionQuote>{tab.footnote}</OpinionQuote>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S5. Sources & disclaimer                                            */
/* ------------------------------------------------------------------ */

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
          Sources (verified mid-2026): Microsoft Foundry blog (MAF consolidation);
          langchain.com official resources (1.0 releases and star counts);
          github.com/openai/openai-agents-python (Agents SDK); IT Home (Coze open-sourcing);
          star magnitudes cross-checked across comparison pages. Star counts are approximate
          and framework status may change — always check the official repositories before
          making a selection.
        </p>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* S6. Chapter navigation                                              */
/* ------------------------------------------------------------------ */

function ChapterNav() {
  return (
    <section className="pb-24">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-6 px-6 max-md:px-5">
        <Link
          to="/en/principles"
          className="group inline-flex items-center gap-2 text-body text-text-secondary transition-colors hover:text-c-perceive"
        >
          <ArrowLeft size={16} className="transition-transform duration-[250ms] group-hover:-translate-x-1" />
          Principles
        </Link>
        <Link to="/en/capstone" className="group text-right">
          <span className="block text-caption text-text-tertiary">
            Picked your weapon? Time to build
          </span>
          <span className="inline-flex items-center gap-2 text-body-lg font-semibold text-text-primary transition-colors group-hover:text-c-perceive">
            Next: the Capstone Project tutorial
            <ArrowRight size={18} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}

/** Frameworks comparison page — English (/en/frameworks) */
export default function FrameworksEn() {
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
