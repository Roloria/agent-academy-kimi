/**
 * 框架横评页数据 —— 全部内容逐字取自 research/frameworks.md brief
 * （star 为约数，核实于 2026 年中）
 */

export type FilterKey = "all" | "code" | "lowcode" | "multi" | "maintenance" | "msft";

export interface CompareRow {
  name: string;
  language: string;
  vendor: string;
  feature: string;
  audience: string;
  status: { label: string; tone: "green" | "amber" };
  /** 附加状态徽章（如 MAF 的 `2026.4` 青色徽章），color 为语义色 CSS 变量 */
  extraStatus?: { label: string; color: string }[];
  /** 置顶推荐行：bg-2 40% 常驻高亮 + 左侧 2px 青色竖条 */
  pinned?: boolean;
  /** 点击行滚动到的详情卡锚点 */
  target: string;
  filters: FilterKey[];
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    name: "Microsoft Agent Framework",
    language: "Python / .NET",
    vendor: "微软",
    feature: "AutoGen 编排 + SK 工程化的官方合并体，图式 Workflow，双语言",
    audience: "微软/Azure 栈、.NET 企业、AutoGen/SK 迁移",
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
    feature: "生态最大、集成最多（600+），create_agent 快速搭 Agent",
    audience: "入门者、需要丰富集成的团队",
    status: { label: "1.0", tone: "green" },
    target: "detail-langchain",
    filters: ["code"],
  },
  {
    name: "LangGraph",
    language: "Python（TS Beta）",
    vendor: "LangChain Inc.",
    feature: "状态图（StateGraph）编排，持久化、可中断恢复、人在环",
    audience: "生产级/复杂工作流工程师",
    status: { label: "1.0", tone: "green" },
    target: "detail-langchain",
    filters: ["code"],
  },
  {
    name: "AutoGen",
    language: "Python",
    vendor: "微软",
    feature: "异步消息驱动的多智能体对话",
    audience: "研究者、多智能体对话实验",
    status: { label: "维护模式", tone: "amber" },
    target: "detail-autogen",
    filters: ["code", "multi", "maintenance", "msft"],
  },
  {
    name: "CrewAI",
    language: "Python",
    vendor: "CrewAI Inc.",
    feature: "角色扮演式多 Agent 团队（Crew + Flow），上手最快",
    audience: "内容/研究流水线、快速原型",
    status: { label: "活跃", tone: "green" },
    target: "detail-crewai",
    filters: ["code", "multi"],
  },
  {
    name: "OpenAI Agents SDK",
    language: "Python",
    vendor: "OpenAI",
    feature: "Swarm 后继；Agent/Handoff/Guardrail/Tracing 四个原语，极简",
    audience: "想用 OpenAI 生态做生产 Agent 的开发者",
    status: { label: "活跃", tone: "green" },
    target: "detail-agents-sdk",
    filters: ["code", "multi"],
  },
  {
    name: "smolagents",
    language: "Python",
    vendor: "Hugging Face",
    feature: "代码即动作（CodeAgent），几千行核心代码，模型无关",
    audience: "研究者、HF 生态用户、学习 Agent 原理",
    status: { label: "活跃", tone: "green" },
    target: "detail-smolagents",
    filters: ["code"],
  },
  {
    name: "LlamaIndex",
    language: "Python / TS",
    vendor: "LlamaIndex Inc.",
    feature: "数据为中心的 RAG + Agent（Workflows、AgentWorkflow）",
    audience: "知识库问答、RAG 为主的应用",
    status: { label: "活跃", tone: "green" },
    target: "detail-llamaindex",
    filters: ["code"],
  },
  {
    name: "Semantic Kernel",
    language: "C# / Python",
    vendor: "微软",
    feature: "企业级插件/规划器抽象，.NET 友好",
    audience: "微软/Azure/.NET 企业团队",
    status: { label: "维护模式", tone: "amber" },
    target: "detail-semantic-kernel",
    filters: ["code", "maintenance", "msft"],
  },
  {
    name: "Dify",
    language: "Python / TS",
    vendor: "LangGenius",
    feature: "开源低代码 LLM 应用平台：可视化编排 + RAG + Agent",
    audience: "低代码用户、产品/运营、企业内部平台",
    status: { label: "活跃", tone: "green" },
    target: "detail-dify",
    filters: ["lowcode"],
  },
  {
    name: "Coze（扣子）",
    language: "Go / TS（开源版）",
    vendor: "字节跳动",
    feature: "零代码拖拽编排智能体，插件/知识库/工作流齐全；2025.7 开源",
    audience: "零基础用户、国内生态、快速上线 Bot",
    status: { label: "活跃", tone: "green" },
    target: "detail-coze",
    filters: ["lowcode"],
  },
];

/* ------------------------------------------------------------------ */
/* 最小示例代码（逐字取自 brief）                                        */
/* ------------------------------------------------------------------ */

/* MAF 三段代码：逐字取自 research/v2/maf.md（1.0 GA 稳定 API） */
export const CODE_MAF_QUICKSTART = `# pip install agent-framework   # 1.0 起无需 --pre；Python 3.10+
# 需环境变量 OPENAI_API_KEY
import asyncio
from agent_framework.openai import OpenAIChatClient

def get_weather(city: str) -> str:
    """查询指定城市的天气。"""
    return f"{city}：晴，26°C"

async def main():
    agent = OpenAIChatClient(model="gpt-4o-mini").as_agent(
        name="WeatherBot",
        instructions="你是一位简洁的中文助手，回答天气问题时优先调用工具。",
        tools=[get_weather],
    )
    response = await agent.run("北京今天天气怎么样？")
    print(response.text)

asyncio.run(main())`;

export const CODE_MAF_AZURE = `from agent_framework.azure import AzureOpenAIChatClient
from azure.identity import AzureCliCredential

agent = AzureOpenAIChatClient(
    credential=AzureCliCredential(),   # 走 az login 凭据；或用 api_key=...
    deployment_name="gpt-4o",
).as_agent(instructions="You are helpful.")`;

export const CODE_MAF_WORKFLOW = `from agent_framework import SequentialBuilder

workflow = SequentialBuilder().participants([writer, reviewer]).build()
async for event in workflow.run_stream("写一篇 Agent 框架科普"):
    print(event)`;

export const CODE_LANGCHAIN = `# pip install langchain openai
from langchain.agents import create_agent

def get_weather(city: str) -> str:
    """查询指定城市的天气。"""
    return f"{city}：晴，26°C"

agent = create_agent(model="openai:gpt-4o", tools=[get_weather])
result = agent.invoke(
    {"messages": [{"role": "user", "content": "北京今天天气怎么样？"}]}
)
print(result["messages"][-1].content)`;

export const CODE_LANGGRAPH = `from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    input: str
    output: str

def draft(state: AgentState):
    return {"output": f"草稿：{state['input']}"}

builder = StateGraph(AgentState)
builder.add_node("draft", draft)
builder.set_entry_point("draft")
builder.add_edge("draft", END)
app = builder.compile()
print(app.invoke({"input": "写一篇 Agent 框架科普", "output": ""})["output"])`;

export const CODE_AUTOGEN = `# pip install autogen-agentchat autogen-ext[openai]
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

async def main():
    model_client = OpenAIChatCompletionClient(model="gpt-4o")
    agent = AssistantAgent(
        name="assistant",
        model_client=model_client,
        system_message="你是一位简洁的中文技术写作助手。",
    )
    result = await agent.run(task="用一句话解释什么是 AI Agent")
    print(result.messages[-1].content)
    await model_client.close()

asyncio.run(main())`;

export const CODE_CREWAI = `# pip install crewai
from crewai import Agent, Task, Crew

researcher = Agent(
    role="行业研究员",
    goal="挖掘 AI Agent 领域的最新动态",
    backstory="你是资深科技记者，擅长快速提炼要点。",
)
writer = Agent(
    role="科普作者",
    goal="把技术内容写得通俗易懂",
    backstory="你长期为开发者社区撰写入门教程。",
)
task1 = Task(description="调研 2026 年主流 Agent 框架趋势", expected_output="3 条要点", agent=researcher)
task2 = Task(description="根据调研要点写一段 100 字科普", expected_output="一段中文科普短文", agent=writer)
crew = Crew(agents=[researcher, writer], tasks=[task1, task2])
print(crew.kickoff())`;

export const CODE_AGENTS_SDK = `# pip install openai-agents
from agents import Agent, Runner

def get_weather(city: str) -> str:
    """查询城市天气。"""
    return f"{city}：多云，22°C"

triage = Agent(name="分诊员", instructions="天气问题转交天气助手。")
weather_bot = Agent(name="天气助手", instructions="用工具回答天气。", tools=[get_weather])
triage.handoffs = [weather_bot]

result = Runner.run_sync(triage, "上海明天天气如何？")
print(result.final_output)`;

export const CODE_SMOLAGENTS = `# pip install smolagents
from smolagents import CodeAgent, InferenceClientModel, tool

@tool
def multiply(a: float, b: float) -> float:
    """两数相乘。
    Args:
        a: 第一个数
        b: 第二个数
    """
    return a * b

agent = CodeAgent(
    tools=[multiply],
    model=InferenceClientModel(),  # 默认走 HF Inference API（需 HF_TOKEN）
    max_steps=5,
)
print(agent.run("23 乘以 47 等于多少？"))`;

export const CODE_LLAMAINDEX = `# pip install llama-index
from llama_index.core.agent.workflow import FunctionAgent
from llama_index.llms.openai import OpenAI

def search_docs(query: str) -> str:
    """检索内部文档，返回相关片段。"""
    return "检索结果：Agent 框架横评见 frameworks.md"

agent = FunctionAgent(
    tools=[search_docs],
    llm=OpenAI(model="gpt-4o"),
    system_prompt="你是知识库助手，优先调用检索工具回答。",
)

async def main():
    print(await agent.run("框架对比文档放在哪里？"))

import asyncio
asyncio.run(main())`;

export const CODE_SEMANTIC_KERNEL = `# pip install semantic-kernel
import asyncio
from semantic_kernel import Kernel
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
from semantic_kernel.functions import kernel_function

class WeatherPlugin:
    @kernel_function(description="查询城市天气")
    def get_weather(self, city: str) -> str:
        return f"{city}：晴，26°C"

async def main():
    kernel = Kernel()
    kernel.add_service(OpenAIChatCompletion(ai_model_id="gpt-4o"))
    kernel.add_plugin(WeatherPlugin(), plugin_name="weather")
    result = await kernel.invoke_prompt("用 weather 插件查一下杭州的天气")
    print(result)

asyncio.run(main())`;

export const CODE_DIFY = `# 前提：在 Dify 中创建应用并获得 API Key；示例用 requests 调对话接口
import requests

API_KEY = "app-xxxxxxxx"  # Dify 控制台 → 应用 → API 访问
URL = "http://localhost/v1/chat-messages"  # 自托管地址；云端为 https://api.dify.ai/v1

resp = requests.post(
    URL,
    headers={"Authorization": f"Bearer {API_KEY}"},
    json={
        "inputs": {},
        "query": "帮我总结 Agent 框架选型的三条原则",
        "response_mode": "blocking",
        "user": "learner-001",
    },
    timeout=60,
)
print(resp.json()["answer"])`;

export const CODE_COZE = `# 前提：本地部署 Coze Studio（docker compose），创建并发布 Bot，生成访问令牌
import requests

TOKEN = "pat_xxxxxxxx"   # Coze 个人访问令牌
BOT_ID = "75xxxxxxxxxx"  # Bot 的 ID
URL = "http://localhost:8888/v3/chat"  # 自托管地址；云端为 https://api.coze.cn/v3/chat

resp = requests.post(
    URL,
    headers={"Authorization": f"Bearer {TOKEN}"},
    json={
        "bot_id": BOT_ID,
        "user_id": "learner-001",
        "stream": False,
        "auto_save_history": True,
        "additional_messages": [
            {"role": "user", "content": "一句话说明 Agent 和 Workflow 的区别", "content_type": "text"}
        ],
    },
    timeout=60,
)
print(resp.json())`;

/* ------------------------------------------------------------------ */
/* 框架详情卡数据（定位 / 核心概念 / 场景 / 优缺点 / GitHub 逐字取自 brief） */
/* ------------------------------------------------------------------ */

export interface CodeVariant {
  label: string;
  filename: string;
  code: string;
}

export interface FrameworkDetail {
  /** 锚点 id（detail-xxx） */
  anchor: string;
  number: string;
  name: string;
  vendor: string;
  /** star 徽章（可多个仓库） */
  stars: { repo: string; value: string }[];
  /** star 徽章加大一号（全表最高） */
  starHero?: boolean;
  status: { label: string; tone: "green" | "amber" };
  lowCode?: boolean;
  /** 定位句中加粗的前缀（缺省取第一个「，」之前） */
  boldPrefix?: string;
  positioning: string;
  /** 语言徽章（如 MAF 的 PYTHON / C#·.NET 一等公民） */
  langs?: { label: string; note?: string }[];
  concepts: string[];
  scenarios: string;
  pros: string[];
  cons: string[];
  /** 一句差异定位（bg-2 小卡，mono 引述） */
  diffNote?: string;
  github: { label: string; url: string; meta?: string }[];
  codes: CodeVariant[];
  /** 琥珀色迁移/时效提示行 */
  migrationNote?: string;
  /** 迁移提示升级为双向锚点卡：点击滚动到该详情卡（青色描边） */
  migrationTarget?: string;
  /** 高亮行（如 CrewAI 30 分钟亮点） */
  highlight?: string;
}

/** MAF 血缘关系小图数据（DetailCards 中专属渲染） */
export const MAF_LINEAGE = {
  predecessors: [
    { name: "AutoGen", badge: "维护模式", color: "var(--c-plan)", target: "detail-autogen" },
    { name: "Semantic Kernel", badge: "维护模式", color: "var(--c-memory)", target: "detail-semantic-kernel" },
  ],
  merged: { name: "MAF", badge: "1.0 GA", color: "var(--c-perceive)" },
  caption: "2025.10 公开预览 · 两支团队合并开发 · 内置两套迁移助手",
} as const;

export const DETAILS: FrameworkDetail[] = [
  {
    anchor: "detail-maf",
    number: "01",
    name: "Microsoft Agent Framework",
    vendor: "Microsoft · MIT License",
    stars: [{ repo: "agent-framework", value: "~1.2万" }],
    status: { label: "1.0 GA", tone: "green" },
    boldPrefix: "微软官方的统一 Agent 开发框架与运行时",
    positioning:
      "微软官方的统一 Agent 开发框架与运行时——将 AutoGen 的多智能体编排与 Semantic Kernel 的企业级地基（类型安全、中间件、可观测性、插件生态）合并为一个开源 SDK，2026.4.3 发布 1.0 GA，稳定 API + 长期支持承诺。",
    langs: [{ label: "PYTHON" }, { label: "C#/.NET", note: "一等公民" }],
    concepts: [
      "ChatAgent",
      "as_agent()",
      "Workflow",
      "SequentialBuilder",
      "ConcurrentBuilder",
      "中间件",
      "Checkpoint",
      "OpenTelemetry",
      "MCP / A2A 原生",
    ],
    scenarios:
      "微软/Azure 技术栈团队构建生产级系统 ｜ .NET/C# 企业团队首选 ｜ AutoGen/SK 存量项目官方迁移目标 ｜ 多智能体协作 + 生产级合规兼得。",
    pros: [
      "一个 SDK 终结“原型选 AutoGen、生产选 SK”两难",
      "双语言 + 模型无关（OpenAI/Azure/Anthropic/Bedrock/Gemini/Ollama）",
      "生产特性齐全（中间件、检查点恢复、OTel、MCP/A2A、Foundry 护栏）",
      "GA 后 API 稳定 + 内置迁移助手",
    ],
    cons: [
      "年轻框架（约 1.2 万 star，教程案例远少于 LangChain 生态，预览期资料新旧混杂）",
      "Python 版节奏滞后 .NET 版、子包拆分较细需辨别",
      "最佳体验依赖 Azure/Foundry 生态",
      "从 AutoGen/SK 迁移非零成本（对话消息驱动 → 图式工作流需重构设计）",
    ],
    diffNote:
      "LangGraph = 中立编排底座；Agents SDK = OpenAI 生态轻量封装；MAF = 微软生态下“AutoGen 编排 + SK 工程化”的官方合并体——跨语言双栈与企业合规是差异点，生态中立性与社区规模是短板。",
    github: [
      {
        label: "github.com/microsoft/agent-framework",
        url: "https://github.com/microsoft/agent-framework",
        meta: "2.1k fork · MIT",
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
      { repo: "langchain", value: "~13万" },
      { repo: "langgraph", value: "~3万" },
    ],
    status: { label: "1.0", tone: "green" },
    positioning:
      "LangChain 是生态最大的 LLM 应用开发框架（高层“快糙快搭”层），LangGraph 是同公司的底层编排运行时（状态图 + 持久化 + 人在环），两者 2025 年 10 月 22 日联合发布 1.0，官方推荐路径是“先用 LangChain 的 create_agent 快速跑通，需要精细控制时下钻到 LangGraph 的 StateGraph”。",
    concepts: [
      "create_agent",
      "600+ 集成",
      "LCEL",
      "StateGraph",
      "Checkpointer",
      "interrupt()",
      "Supervisor / Handoff",
      "LangSmith",
    ],
    scenarios:
      "RAG、工具调用 Agent 原型（LangChain）；需要循环/分支/断点恢复/人工审批/审计追踪的生产级长运行 Agent 与多 Agent 系统（LangGraph，Klarna、Uber、LinkedIn 等约 400 家公司生产使用）。",
    pros: [
      "生态与文档无敌，模型无关、换模型一行代码",
      "LangGraph 的状态持久化与可恢复性是同类中最成熟",
      "1.0 后 API 趋于稳定",
    ],
    cons: [
      "抽象层多、调试边缘 case 时栈较深",
      "LangGraph 学习曲线陡（要会“用图思考”）",
      "历史上 API 变动频繁（1.0 后缓解）",
    ],
    github: [
      { label: "langchain-ai/langchain", url: "https://github.com/langchain-ai/langchain" },
      { label: "langchain-ai/langgraph", url: "https://github.com/langchain-ai/langgraph" },
    ],
    codes: [
      { label: "LangChain create_agent（4 行核心代码）", filename: "langchain_agent.py", code: CODE_LANGCHAIN },
      { label: "LangGraph StateGraph 骨架", filename: "langgraph_agent.py", code: CODE_LANGGRAPH },
    ],
  },
  {
    anchor: "detail-autogen",
    number: "03",
    name: "Microsoft AutoGen",
    vendor: "微软",
    stars: [{ repo: "autogen", value: "~5.5万" }],
    status: { label: "维护模式", tone: "amber" },
    positioning:
      "微软出品的“多智能体即对话”框架，把多 Agent 协作建模为异步消息传递与会话；2025 年 10 月起进入维护模式（仅修 bug，不出新特性），微软官方推荐新项目迁移到统一了 AutoGen 与 Semantic Kernel 的 Microsoft Agent Framework（MAF），社区分支为 AG2。",
    concepts: [
      "AssistantAgent",
      "UserProxyAgent",
      "GroupChat",
      "GroupChatManager",
      "异步事件驱动",
      "Magentic-One",
    ],
    scenarios: "多 Agent 对话/辩论/协作的研究与实验、教学演示多智能体交互模式、Azure 企业环境存量项目。",
    pros: [
      "多 Agent 对话范式表达力自然，研究社区引用多",
      "0.4 后异步架构更现代",
      "AG2 社区分支继续演进（含 A2A 协议支持）",
    ],
    cons: [
      "架构曾大改（0.2→0.4 破坏性变更），学习资料新旧混杂",
      "已进入维护模式，长期押注需转 MAF/AG2",
      "对话式编排的 token 消耗偏高",
    ],
    github: [{ label: "microsoft/autogen", url: "https://github.com/microsoft/autogen" }],
    codes: [{ label: "AssistantAgent 最小示例", filename: "autogen_chat.py", code: CODE_AUTOGEN }],
    migrationNote:
      "官方迁移目标已 GA：见 #01 Microsoft Agent Framework（点击卡片内血缘图可回看本节）。社区分支 AG2 继续活跃。",
    migrationTarget: "detail-maf",
  },
  {
    anchor: "detail-crewai",
    number: "04",
    name: "CrewAI",
    vendor: "CrewAI Inc.",
    stars: [{ repo: "crewAI", value: "~5万" }],
    status: { label: "活跃", tone: "green" },
    positioning:
      "以“角色扮演团队”为隐喻的多 Agent 编排框架——给每个 Agent 定义 role/goal/backstory，组一个 Crew 分派 Task 就能跑，是独立框架中社区最大、上手最快的一个。",
    concepts: ["Agent", "Task", "Crew", "Flow", "Process", "YAML 配置", "任务委派"],
    scenarios:
      "内容生产流水线（调研→写作→编辑）、研究报告生成、业务分析等“角色分工”天然清晰的任务；快速原型与演示。",
    pros: [
      "概念直觉（30 分钟内从零到可运行的多 Agent 系统）",
      "文档友好",
      "独立于 LangChain、无历史包袱",
      "Flow 提供生产所需的确定性控制",
    ],
    cons: [
      "角色抽象在需要细粒度控制 Agent 内部行为时偏“黑盒”",
      "复杂任务上可靠性弱于 LangGraph 一类图式框架",
      "商业版（CrewAI AMP）与开源版功能有梯度",
    ],
    github: [{ label: "crewAIInc/crewAI", url: "https://github.com/crewAIInc/crewAI" }],
    codes: [{ label: "研究员 + 作者双 Agent Crew", filename: "crewai_team.py", code: CODE_CREWAI }],
    highlight: "30 分钟从零到可运行的多 Agent 系统",
  },
  {
    anchor: "detail-agents-sdk",
    number: "05",
    name: "OpenAI Agents SDK",
    vendor: "OpenAI · Swarm 生产级继任者",
    stars: [{ repo: "openai-agents-python", value: "~2.5万" }],
    status: { label: "活跃", tone: "green" },
    positioning:
      "OpenAI 官方轻量级多 Agent 框架，2025 年 3 月发布，是实验项目 Swarm 的生产级继任者——只用 Agent、Handoff、Guardrail、Tracing 四个核心原语覆盖多智能体工作流。",
    concepts: ["Agent", "Handoff", "Guardrail", "Tracing", "Runner", "Sessions", "MCP"],
    scenarios:
      "基于 OpenAI 模型（也兼容其他 provider）快速构建客服分流、分诊式多 Agent 应用；对可观测性有要求的生产 Agent。",
    pros: [
      "API 面积极简，数小时即可上手",
      "Guardrail 把安全校验做成一等公民",
      "内置 tracing 开箱即用",
      "OpenAI 官方维护",
    ],
    cons: [
      "编排能力“刻意单薄”——复杂协调（如并行汇聚、精细状态机）要在 SDK 之外自己实现",
      "生态围绕 OpenAI 最佳，跨模型体验次之",
    ],
    github: [
      { label: "openai/openai-agents-python", url: "https://github.com/openai/openai-agents-python" },
    ],
    codes: [{ label: "分诊员 → 天气助手 Handoff", filename: "agents_sdk.py", code: CODE_AGENTS_SDK }],
  },
  {
    anchor: "detail-smolagents",
    number: "06",
    name: "Hugging Face smolagents",
    vendor: "Hugging Face",
    stars: [{ repo: "smolagents", value: "~2.5万" }],
    status: { label: "活跃", tone: "green" },
    positioning:
      "Hugging Face 出品的极简 Agent 库（核心代码仅几千行），主打“代码即动作”——让 Agent 直接编写并执行 Python 代码来组合工具调用，官方基准上比传统 JSON 工具调用少约 30% 的步骤与 LLM 调用。",
    concepts: [
      "CodeAgent",
      "ToolCallingAgent",
      "@tool",
      "InferenceClientModel",
      "LiteLLMModel",
      "E2B / Docker 沙箱",
    ],
    scenarios:
      "学习 Agent 原理（源码短、可读性强，是绝佳教学材料）、研究与 benchmark、HF 生态（Hub 上分享工具/Agent）、需要“写代码解决问题”型任务（数据处理、多步计算）。",
    pros: [
      "极简透明、依赖少",
      "模型完全无关（开源模型体验一流）",
      "CodeAgent 范式在复杂任务上效率高",
      "HF 官方维护、迭代快",
    ],
    cons: [
      "代码执行引入安全与稳定性问题（需沙箱）",
      "缺少生产级持久化/审计等企业特性",
      "生态规模小于 LangChain",
    ],
    github: [{ label: "huggingface/smolagents", url: "https://github.com/huggingface/smolagents" }],
    codes: [{ label: "CodeAgent 最小示例", filename: "smolagents_agent.py", code: CODE_SMOLAGENTS }],
    highlight: "官方基准：比传统 JSON 工具调用少约 30% 的步骤与 LLM 调用",
  },
  {
    anchor: "detail-llamaindex",
    number: "07",
    name: "LlamaIndex",
    vendor: "LlamaIndex Inc.",
    stars: [{ repo: "llama_index", value: "~4.5万" }],
    status: { label: "活跃", tone: "green" },
    positioning:
      "以数据为中心的 LLM 框架——业界 RAG 事实标准之一，在强大的数据连接/索引/检索能力之上提供 Agent 与多 Agent Workflow 能力，适合“知识库优先”的智能应用。",
    concepts: [
      "Document / Node",
      "Index",
      "Retriever",
      "QueryEngine",
      "FunctionAgent",
      "AgentWorkflow",
      "LlamaHub 连接器",
    ],
    scenarios:
      "企业知识库问答、Agentic RAG（检索与推理交织）、需要连接大量异构数据源（PDF、数据库、Notion、Slack…）的 Agent 应用。",
    pros: [
      "数据接入与索引能力最全",
      "RAG 到 Agent 的升级路径平滑",
      "文档与教程体系完善",
      "Python/TS 双栈",
    ],
    cons: [
      "纯 Agent 编排不是它的主战场（复杂多 Agent 控制弱于 LangGraph）",
      "包结构较散（llama-index-core + 大量集成包），初学者易迷路",
      "API 演进快",
    ],
    github: [{ label: "run-llama/llama_index", url: "https://github.com/run-llama/llama_index" }],
    codes: [{ label: "FunctionAgent 最小示例", filename: "llamaindex_agent.py", code: CODE_LLAMAINDEX }],
  },
  {
    anchor: "detail-semantic-kernel",
    number: "08",
    name: "Semantic Kernel",
    vendor: "微软",
    stars: [{ repo: "semantic-kernel", value: "~2.5万" }],
    status: { label: "维护模式", tone: "amber" },
    positioning:
      "微软的企业级 AI 编排 SDK——用 Kernel + Plugin/Function 的抽象把 LLM 能力嵌入现有（尤其 .NET）业务系统；2025 年 10 月起与 AutoGen 一同进入维护模式，后继者为 Microsoft Agent Framework。",
    concepts: [
      "Kernel",
      "Plugin / KernelFunction",
      "Planners",
      "ChatCompletionAgent",
      "AgentGroupChat",
      "Connectors",
    ],
    scenarios:
      "存量 .NET/C# 企业系统嵌入 AI 能力、Azure 技术栈团队；新项目建议直接评估 Microsoft Agent Framework。",
    pros: [
      "C#/.NET 支持是同类中最好的（Python 版次之）",
      "插件化设计契合企业工程实践（DI、中间件、遥测）",
      "微软企业级支持",
    ],
    cons: [
      "进入维护模式，前景收敛到 MAF",
      "Python 版 API 变动频繁、文档滞后",
      "Agent 能力长期偏弱（多 Agent 依赖 AutoGen）",
    ],
    github: [
      { label: "microsoft/semantic-kernel", url: "https://github.com/microsoft/semantic-kernel" },
    ],
    codes: [{ label: "Kernel + Plugin 最小示例", filename: "semantic_kernel.py", code: CODE_SEMANTIC_KERNEL }],
    migrationNote:
      "已进入维护模式。官方迁移目标已 GA：见 #01 Microsoft Agent Framework（点击卡片内血缘图可回看本节）。",
    migrationTarget: "detail-maf",
  },
  {
    anchor: "detail-dify",
    number: "09",
    name: "Dify",
    vendor: "LangGenius",
    stars: [{ repo: "dify", value: "~14万" }],
    starHero: true,
    status: { label: "活跃", tone: "green" },
    lowCode: true,
    positioning:
      "开源、自托管的一站式 LLM 应用开发平台——可视化画布编排 Agent/工作流/RAG，外加完整的 LLMOps（评测、日志、监控），是 GitHub 上最火爆的 AI 应用平台项目之一。",
    concepts: ["可视化节点画布", "Chatflow", "Workflow", "知识库 RAG", "工具/插件市场", "LLMOps", "API 一键发布"],
    scenarios:
      "不写（少写）代码快速搭建企业知识库问答、客服机器人、内容生成流水线；中小企业内部 AI 平台私有化部署；需要给非工程师开放 AI 应用搭建能力的团队。",
    pros: [
      "全栈开箱即用（UI + 后端 + RAG + 观测），社区极活跃",
      "Apache 2.0 类宽松开源（有附加条款，多租户 SaaS 需授权）",
      "模型接入广（国内外主流模型均可）",
      "30+ 家财富 500 强企业采用",
    ],
    cons: [
      "低代码画布在复杂逻辑下变得臃肿，灵活性不及代码框架",
      "深度定制需要读懂其 Python/Vue 源码",
      "企业级特性（SSO、审计）部分在付费版",
    ],
    github: [{ label: "langgenius/dify", url: "https://github.com/langgenius/dify" }],
    codes: [{ label: "调用已发布应用的 API", filename: "dify_api.py", code: CODE_DIFY }],
  },
  {
    anchor: "detail-coze",
    number: "10",
    name: "Coze 扣子",
    vendor: "字节跳动",
    stars: [{ repo: "coze-studio", value: "开源数日破万 · 数万" }],
    status: { label: "活跃", tone: "green" },
    lowCode: true,
    positioning:
      "字节跳动的 AI Agent 开发平台——拖拽节点即可零代码/低代码编排智能体与工作流，国内 C 端与中小企业使用最广；2025 年 7 月 26 日将核心引擎 Coze Studio（开发平台）与 Coze Loop（评测运维平台）以 Apache 2.0 协议开源，开源数日 star 即破万。",
    concepts: ["Bot / 智能体", "插件 Plugin", "知识库 RAG", "工作流引擎", "多渠道发布", "Coze Loop 评测运维"],
    scenarios:
      "零基础用户 5 分钟做出可用 Bot；依托国内模型（豆包/DeepSeek 等）与 IM 渠道的业务客服/营销/知识库场景；Apache 2.0 下企业内部私有化部署（2 核 4G 即可跑）。",
    pros: [
      "上手门槛全类别最低，模板生态丰富",
      "国内模型与渠道整合天然顺滑",
      "开源协议宽松可商用、部署门槛低",
    ],
    cons: [
      "开源版与商业版存在功能差（如音色等能力限商业版）",
      "深度定制需啃 Go + TypeScript 源码",
      "复杂逻辑下可视化编排同样有天花板",
      "海外生态弱于 Dify",
    ],
    github: [
      { label: "coze-dev/coze-studio", url: "https://github.com/coze-dev/coze-studio" },
      { label: "coze-dev/coze-loop（评测与运维）", url: "https://github.com/coze-dev/coze-loop" },
    ],
    codes: [{ label: "调用自托管 Coze Studio 的 Bot", filename: "coze_api.py", code: CODE_COZE }],
  },
];

/** 收口速查表（maf-card.md §5：MAF 片段加粗 + 青色） */
export const CHEATSHEET_SEGMENTS: { text: string; accent?: boolean }[] = [
  {
    text: "入门摸原理 smolagents / Agents SDK ｜ 上线扛流量 LangGraph ｜ 团队流水线 CrewAI ｜ 知识库 LlamaIndex ｜ ",
  },
  { text: "微软系/.NET 直接上 MAF（2026.4 GA）", accent: true },
  { text: " ｜ 不写代码 Dify（私有化）/ Coze（国内）" },
];

/* ------------------------------------------------------------------ */
/* S4 选型向导（brief §十一）                                            */
/* ------------------------------------------------------------------ */

export interface SelectorItem {
  name: string;
  /** 点击滚动回详情卡；无对应卡则为空 */
  target?: string;
  reason: string;
}

export interface SelectorTab {
  key: string;
  label: string;
  sub: string;
  items: SelectorItem[];
  /** 末尾判断标准行（无序号） */
  footnote?: string;
}

export const SELECTOR_TABS: SelectorTab[] = [
  {
    key: "beginner",
    label: "入门",
    sub: "理解 Agent 原理，写出第一个能跑的 Agent",
    items: [
      {
        name: "OpenAI Agents SDK 或 smolagents",
        target: "detail-agents-sdk",
        reason: "原语少、心智负担低；smolagents 源码短，适合读源码学原理。",
      },
      {
        name: "LangChain create_agent",
        target: "detail-langchain",
        reason: "4 行代码出成果，顺便接入最大生态。",
      },
      {
        name: "Coze（国内）/ Dify（私有化）",
        target: "detail-coze",
        reason: "不想写代码：先拖出第一个 Bot，建立直觉后再回代码。",
      },
    ],
  },
  {
    key: "production",
    label: "生产",
    sub: "要上线、要稳定、要可观测",
    items: [
      {
        name: "LangGraph",
        target: "detail-langchain",
        reason: "状态持久化、断点恢复、人在环、审计追踪最成熟，400+ 公司生产验证；与 LangChain/LangSmith 配套成栈。",
      },
      {
        name: "OpenAI Agents SDK",
        target: "detail-agents-sdk",
        reason: "OpenAI 生态内的生产捷径（Guardrail + Tracing 开箱即用）。",
      },
      {
        name: "Microsoft Agent Framework",
        target: "detail-maf",
        reason:
          "2026.4 GA 后 API 稳定 + LTS 承诺；微软/Azure/.NET 栈团队可直接列为首选，检查点恢复 + OTel + Foundry 护栏开箱即用。",
      },
      {
        name: "CrewAI（Crew + Flow）",
        target: "detail-crewai",
        reason: "角色分工清晰的业务流水线，工程确定性靠 Flow 兜底。",
      },
    ],
  },
  {
    key: "research",
    label: "研究",
    sub: "多智能体实验、benchmark、读源码",
    items: [
      {
        name: "AutoGen / AG2",
        target: "detail-autogen",
        reason:
          "多 Agent 对话范式的经典实现，论文引用多；新项目可看社区分支 AG2。（已进维护模式，新项目评估 MAF）",
      },
      {
        name: "smolagents",
        target: "detail-smolagents",
        reason: "CodeAgent 范式 + 模型无关，方便换开源模型跑评测。",
      },
      {
        name: "LangGraph",
        target: "detail-langchain",
        reason: "多 Agent 拓扑（Supervisor/Handoff/Network）研究的标准底座。",
      },
    ],
  },
  {
    key: "lowcode",
    label: "低代码·零代码",
    sub: "不写代码也要交付",
    items: [
      {
        name: "Coze 扣子",
        target: "detail-coze",
        reason: "国内场景、多渠道发布、极简上手；开源版可私有化，Apache 2.0。",
      },
      {
        name: "Dify",
        target: "detail-dify",
        reason: "开源私有化、企业知识库 + LLMOps 一体化、海外生态。",
      },
    ],
    footnote:
      "判断标准：团队里“配置者”多于“开发者”选低代码；逻辑复杂到画布开始打结时，就该迁回代码框架（Dify/Coze 均支持 API 嵌入，可与代码框架混用）。",
  },
];
