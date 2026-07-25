import CodeBlock from "@/components/CodeBlock";
import { SEMANTIC } from "@/lib/semantic";
import { ChapterHeading, Explain, Figure, KeyPoints } from "./shared";

// Code sample kept verbatim from the zh edition (JSON/annotations stay in Chinese per fidelity rule)
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
  { name: "Register tools", desc: "JSON Schema of name / description / parameters" },
  { name: "Model outputs a tool_call", desc: "Structured JSON: function name + arguments" },
  { name: "Host program executes", desc: "The model never runs the function itself; the caller's code is the executor" },
  { name: "Result returned", desc: "Appended back into the context as a tool message" },
  { name: "Final answer", desc: "The model generates a reply based on the result" },
];

export default function ChapterTools() {
  return (
    <section aria-label="Chapter 4: Tool Use" className="mt-24">
      <ChapterHeading id="tools" index={4} title="Tool Use: Function Calling & MCP" color={SEMANTIC.tool} />

      <Explain>
        Tool use fixes two big LLM shortcomings: not knowing up-to-date information, and being
        unable to compute precisely or operate on the outside world.{" "}
        <strong className="font-bold text-text-primary">Function Calling</strong>{" "}
        is no mystery: the developer &ldquo;reads out the menu&rdquo; to the model with JSON Schema
        (which functions exist, what parameters they take); when needed, the model outputs a
        structured JSON blob (function name + arguments), which{" "}
        <strong className="font-bold text-text-primary">external code</strong>{" "}
        actually executes, and the result is fed back to the model to continue reasoning. Note: the
        model never executes the function itself — it only &ldquo;places the order&rdquo;; the
        caller&rsquo;s code is the executor.{" "}
        <strong className="font-bold text-text-primary">MCP (Model Context Protocol)</strong>{" "}
        goes further: an open protocol proposed by Anthropic in November 2024 that defines a
        unified standard for &ldquo;connecting AI applications to data sources and tools&rdquo; —
        like a USB-C port for the AI world. Implement an MCP Server once, and any MCP-capable
        client can plug and play, instead of writing a custom integration for every model × every
        tool.
      </Explain>

      <Figure
        src="/diagram-function-calling.svg"
        alt="Function Calling sequence diagram: message flow between three lanes — developer code, the LLM, and external functions"
        caption="Function Calling sequence: register tools → tool_call → execute → return → final answer"
      />

      {/* Five-step numbered flow */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">The Function Calling Flow</h4>
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
            Tool description quality (name, docstring, parameter annotations) directly affects
            selection accuracy — it is part of prompt engineering.
          </>,
          <>Security essentials: validate tool arguments; dangerous operations (DB writes, transfers, sending email) need a human approval step.</>,
          <>
            MCP architecture: three layers — Host (e.g. Claude Desktop, IDEs), Client, Server. A
            Server exposes Tools (executable functions), Resources (readable data) and Prompts
            (templates) in a standard way.
          </>,
        ]}
      />

      {/* MCP value: large gradient text */}
      <div className="mt-10 rounded-2xl border border-border-subtle bg-bg-1 px-6 py-8 text-center">
        <p className="font-mono text-caption uppercase tracking-[0.12em] text-c-tool">
          The Value of MCP
        </p>
        <p className="text-grad mx-auto mt-3 max-w-xl text-h3 font-black">
          Cut the integration complexity of M models × N tools from M×N down to M+N
        </p>
      </div>
    </section>
  );
}
