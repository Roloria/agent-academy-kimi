import CodeBlock from "@/components/CodeBlock";
import { SEMANTIC } from "@/lib/semantic";
import { ChapterHeading, Explain, Figure, KeyPoints } from "./shared";

const FUNCTION_CALLING_CODE = `# Function Calling 示意（OpenAI 风格）
tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "查询指定城市的实时天气",
        "parameters": {
            "type": "object",
            "properties": {"city": {"type": "string", "description": "城市名"}},
            "required": ["city"]
        }
    }
}]
# 模型返回: {"name": "get_weather", "arguments": {"city": "北京"}}
# 宿主代码执行 get_weather("北京")，把结果作为 tool 消息追加后继续对话`;

const FC_STEPS: { name: string; desc: string }[] = [
  { name: "注册工具", desc: "name / description / parameters 的 JSON Schema" },
  { name: "模型输出 tool_call", desc: "结构化 JSON：函数名 + 参数" },
  { name: "宿主程序执行", desc: "模型从不亲自执行函数，执行者是调用方代码" },
  { name: "结果回传", desc: "以 tool 消息追加回上下文" },
  { name: "最终回答", desc: "模型基于结果生成回复" },
];

export default function ChapterTools() {
  return (
    <section aria-label="第四章 工具使用" className="mt-24">
      <ChapterHeading id="tools" index={4} title="工具使用：Function Calling 与 MCP" color={SEMANTIC.tool} />

      <Explain>
        工具使用解决 LLM 两大短板：不知道最新信息、不会精确计算与操作外部世界。
        <strong className="font-bold text-text-primary">Function Calling</strong>{" "}
        的原理并不神秘：开发者用 JSON Schema
        向模型"报菜单"（有哪些函数、参数是什么），模型在需要时输出一段结构化 JSON（函数名 +
        参数），由<strong className="font-bold text-text-primary">外部代码</strong>
        真正执行，再把结果喂回模型继续推理。注意：模型从不亲自执行函数，它只是"下单"，执行者是调用方代码。
        <strong className="font-bold text-text-primary">MCP（Model Context Protocol）</strong>{" "}
        则更进一步：它是 Anthropic 于 2024 年 11 月提出的开放协议，为"AI
        应用连接数据源与工具"定义统一标准——类似 AI 世界的 USB-C 接口，一次实现 MCP
        Server，任何支持 MCP 的客户端都能即插即用，不必为每个模型 × 每个工具写定制集成。
      </Explain>

      <Figure
        src="/diagram-function-calling.svg"
        alt="Function Calling 时序图：开发者代码、LLM、外部函数三条泳道之间的消息流转"
        caption="Function Calling 时序：注册工具 → tool_call → 执行 → 回传 → 最终回答"
      />

      {/* 流程五步编号条 */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">Function Calling 流程</h4>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {FC_STEPS.map((s, i) => (
          <li
            key={s.name}
            className="relative rounded-xl border border-border-subtle bg-bg-1 p-4"
          >
            <span className="font-mono text-caption tracking-[0.12em] text-c-tool">
              STEP {i + 1}
            </span>
            <p className="mt-1.5 text-body-sm font-bold text-text-primary">{s.name}</p>
            <p className="mt-1 text-caption text-text-tertiary">{s.desc}</p>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <CodeBlock code={FUNCTION_CALLING_CODE} language="python" filename="function-calling.py" />
      </div>

      <KeyPoints
        color={SEMANTIC.tool}
        items={[
          <>
            工具描述质量（名称、说明、参数注释）直接影响模型选择正确率，是"提示词工程"的一部分。
          </>,
          <>安全要点：工具参数需校验，危险操作（写库、转账、发邮件）应有人工审批环节。</>,
          <>
            MCP 架构：Host（如 Claude Desktop、IDE）— Client — Server 三层；Server
            以标准方式暴露 Tools（可执行函数）、Resources（可读数据）、Prompts（模板）。
          </>,
        ]}
      />

      {/* MCP 价值：大号渐变文字突出 */}
      <div className="mt-10 rounded-2xl border border-border-subtle bg-bg-1 px-6 py-8 text-center">
        <p className="font-mono text-caption uppercase tracking-[0.12em] text-c-tool">
          MCP 的价值
        </p>
        <p className="text-grad mx-auto mt-3 max-w-xl text-h3 font-black">
          把 M 个模型 × N 个工具的集成复杂度从 M×N 降到 M+N
        </p>
      </div>
    </section>
  );
}
