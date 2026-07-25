/**
 * Capstone《个人研究助理 Agent》全部代码 —— 逐字取自
 * research/learning-path.md §三（不得改写代码逻辑）。
 * 使用 String.raw 保留代码中的 \n 字面量。
 */

/** 步骤 1 · 终端：创建虚拟环境 + 安装依赖 */
export const CODE_STEP1_TERMINAL = String.raw`python -m venv .venv && source .venv/bin/activate
pip install openai-agents tavily-python httpx trafilatura python-dotenv`;

/** 步骤 1 · .env */
export const CODE_STEP1_ENV = String.raw`# .env
OPENAI_API_KEY=sk-...
TAVILY_API_KEY=tvly-...`;

/** 步骤 1 · config.py */
export const CODE_STEP1_CONFIG = String.raw`# config.py
import os
from dotenv import load_dotenv

load_dotenv()
MODEL = "gpt-4o-mini"          # 主力模型，成本可控
MAX_STEPS = 15                  # Agent 循环最大步数，防失控
REPORT_DIR = "reports"`;

/** 步骤 2 · tools.py */
export const CODE_STEP2_TOOLS = String.raw`# tools.py
import os, httpx, trafilatura
from tavily import TavilyClient
from agents import function_tool

tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])

@function_tool
def web_search(query: str, max_results: int = 5) -> str:
    """搜索互联网，返回标题+摘要+URL 列表。
    用于寻找与研究主题相关的资料来源。
    参数 query 应是具体的关键词短语，而非完整长句。"""
    resp = tavily.search(query=query, max_results=max_results)
    lines = [
        f"[{i}] {r['title']}\n    {r['url']}\n    {r['content'][:300]}"
        for i, r in enumerate(resp["results"], 1)
    ]
    return "\n\n".join(lines) or "未找到结果"

@function_tool
def fetch_page(url: str) -> str:
    """抓取一个网页并提取正文（去导航/广告）。
    仅当 web_search 返回的 URL 值得深读时调用。
    返回正文前 4000 字符；失败时返回错误说明。"""
    try:
        html = httpx.get(url, timeout=15, follow_redirects=True).text
        text = trafilatura.extract(html) or ""
        return text[:4000] if text else "页面无可用正文"
    except Exception as e:
        return f"抓取失败：{type(e).__name__}: {e}"

@function_tool
def save_report(filename: str, markdown: str) -> str:
    """把最终研究报告写入 reports/ 目录。
    参数 markdown 必须是完整的 Markdown 报告（含标题、摘要、正文、参考来源）。
    仅当报告内容已全部写好时调用一次。"""
    os.makedirs("reports", exist_ok=True)
    path = os.path.join("reports", filename)
    with open(path, "w", encoding="utf-8") as f:
        f.write(markdown)
    return f"已保存 {path}（{len(markdown)} 字符）"`;

/** 步骤 3 · agent.py */
export const CODE_STEP3_AGENT = String.raw`# agent.py
from agents import Agent, Runner
from tools import web_search, fetch_page, save_report
from config import MODEL, MAX_STEPS

INSTRUCTIONS = """你是一名严谨的个人研究助理。工作流程：
1. 规划：把用户主题拆成 3-5 个可独立搜索的子问题（在思考中列出，不必调用工具）。
2. 搜索：对每个子问题调用 web_search，关键词要具体。
3. 阅读：从每个子问题的结果中挑 1-2 个最权威 URL 调用 fetch_page 深读。
4. 综合：交叉比对来源，标注分歧点；每个关键结论都要对应来源 URL。
5. 交付：调用 save_report 保存最终报告（结构：标题/摘要/分节正文/参考来源），
   然后用一段话向用户汇报核心发现。

约束：不要编造来源；来源不足时明确说"证据有限"；最多深读 6 个页面。"""

researcher = Agent(
    name="research-assistant",
    model=MODEL,
    instructions=INSTRUCTIONS,
    tools=[web_search, fetch_page, save_report],
)

if __name__ == "__main__":
    import asyncio
    topic = input("研究主题：")
    result = asyncio.run(Runner.run(researcher, topic, max_turns=MAX_STEPS))
    print(result.final_output)`;

/** 步骤 4 · main.py */
export const CODE_STEP4_MAIN = String.raw`# main.py（会话记忆版入口）
import asyncio
from agents import Runner, SQLiteSession
from agent import researcher
from config import MAX_STEPS

session = SQLiteSession(session_id="default-user", db_path="memory/conversations.db")

async def chat():
    print("研究助理已就绪（输入 quit 退出）")
    while True:
        topic = input("\n你：")
        if topic.lower() == "quit":
            break
        result = await Runner.run(researcher, topic,
                                  session=session, max_turns=MAX_STEPS)
        print(f"\n助理：{result.final_output}")

if __name__ == "__main__":
    asyncio.run(chat())`;

/** 步骤 5 · writer.py */
export const CODE_STEP5_WRITER = String.raw`# writer.py（进阶：写作 Agent + 结构化输出）
from pydantic import BaseModel
from agents import Agent

class ResearchReport(BaseModel):
    title: str
    summary: str            # 200 字内摘要
    sections: list[dict]    # [{"heading": ..., "content": ..., "sources": [url, ...]}]
    references: list[str]   # 全部来源 URL

writer = Agent(
    name="report-writer",
    model="gpt-4o",   # 写作质量优先，可用更强的模型
    instructions="把研究素材整理为结构清晰的 Markdown 报告。"
                 "每个论点必须标注来源编号；禁止出现素材之外的事实。",
    output_type=ResearchReport,   # SDK 原生支持结构化输出
)

# 在研究 Agent 中以 handoff 或 agents-as-tools 方式调用 writer`;

/** 步骤 6 · eval.py */
export const CODE_STEP6_EVAL = String.raw`# eval.py（最小评估循环：LLM-as-judge）
import asyncio, json
from agents import Agent, Runner

judge = Agent(
    name="judge",
    model="gpt-4o",
    instructions="""你是研究质量评审。按 1-5 分评三个维度并输出 JSON：
    - source_fidelity：结论是否都能在所给来源中找到依据（抓幻觉）
    - coverage：是否覆盖了主题的主要方面
    - structure：报告结构是否完整（摘要/分节/参考来源）
    输出：{"source_fidelity": x, "coverage": x, "structure": x, "comment": "..."}""",
)

async def evaluate(topic: str, report_md: str, sources: list[str]) -> dict:
    prompt = f"主题：{topic}\n\n报告：\n{report_md}\n\n来源列表：\n{sources}"
    result = await Runner.run(judge, prompt)
    return json.loads(result.final_output)

# 用法：对数据集里每个主题跑一遍，记录均分；改 prompt 后重跑对比`;

/** 步骤 7 · run_logging.py */
export const CODE_STEP7_LOGGING = String.raw`# run_logging.py（轻量运行日志）
import json, time, os
from agents import Runner, RunHooks

class LogHooks(RunHooks):
    async def on_tool_start(self, context, agent, tool):
        print(f"  → 调用工具 {tool.name}")

    async def on_tool_end(self, context, agent, tool, result):
        print(f"  ← {tool.name} 返回 {len(str(result))} 字符")

# Runner.run(..., hooks=LogHooks())`;

/** 步骤 8 · 托管搜索一行替换 */
export const CODE_STEP8_HOSTED = String.raw`from agents import Agent, WebSearchTool
researcher = Agent(name="research-assistant", model=MODEL,
                   instructions=INSTRUCTIONS,
                   tools=[WebSearchTool(), fetch_page, save_report])`;

/** S1 页头终端演示（brief「最终效果」原文） */
export const DEMO_LINES = [
  '$ python main.py "对比 LangGraph 和 OpenAI Agents SDK 的设计理念"',
  "> [计划] 拆分为 4 个子问题...",
  "> [搜索] 子问题 1/4 ...",
  "> [阅读] 抓取 6 个页面，提取正文 42,000 tokens → 压缩为 3,800 tokens ...",
  "> [撰写] 生成报告...",
  "✅ 报告已保存：reports/langgraph_vs_agents_sdk.md",
];
