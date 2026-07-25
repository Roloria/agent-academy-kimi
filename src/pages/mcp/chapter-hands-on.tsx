import { motion } from "framer-motion";
import { SEMANTIC } from "@/lib/semantic";
import CodeBlock from "@/components/CodeBlock";
import { Reveal } from "@/components/ui-extra";
import { ChapterHeading } from "@/pages/principles/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepHeader, WarningPanel, AcceptCard } from "./shared";
import {
  CODE_INSTALL,
  CODE_SERVER,
  CODE_INSPECTOR,
  CODE_CLAUDE_STDIO,
  CODE_CLAUDE_REMOTE,
  CODE_CLIENT,
} from "./code";

/** CodeBlock 统一进场包装（opacity/scale） */
function CodeReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.985 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-6"
    >
      {children}
    </motion.div>
  );
}

/** 第二章 · 动手实战：30 行写一个 MCP Server（design/v2/mcp.md §S4） */
export default function ChapterHandsOn() {
  return (
    <section aria-label="第二章 动手实战" className="mt-24">
      <ChapterHeading
        id="hands-on"
        index={2}
        title="动手实战：30 行写一个 MCP Server"
        color={SEMANTIC.tool}
      />

      {/* ===== STEP 1 ===== */}
      <StepHeader n={1} title="安装官方 Python SDK" />
      <CodeReveal>
        <CodeBlock code={CODE_INSTALL} language="bash" type="terminal" filename="terminal" />
      </CodeReveal>

      {/* ===== STEP 2 ===== */}
      <StepHeader n={2} title="最小可运行 Server（FastMCP 高级 API）">
        官方 SDK 内置 FastMCP，用装饰器即可暴露能力——工具、资源、提示词各一个，就是完整 Server。
      </StepHeader>
      <WarningPanel title="注意：" className="mt-5">
        这里的 FastMCP 是<strong className="font-semibold text-text-primary">官方 </strong>
        <code>mcp</code>
        <strong className="font-semibold text-text-primary"> 包内置的 </strong>
        <code>mcp.server.fastmcp</code>
        <strong className="font-semibold text-text-primary"> 模块</strong>，
        <strong className="font-semibold text-c-plan">不是</strong>第三方那个独立的{" "}
        <code>fastmcp</code> 包。
      </WarningPanel>
      <CodeReveal>
        <CodeBlock code={CODE_SERVER} language="python" filename="server.py" />
      </CodeReveal>
      <Reveal>
        <p className="mt-3 text-center font-mono text-caption text-text-tertiary">
          类型注解 + docstring 会被 SDK 自动转成 JSON Schema——这就是模型"看到"的接口文档。
        </p>
      </Reveal>

      {/* ===== STEP 3 ===== */}
      <StepHeader n={3} title="本地调试：MCP Inspector">
        SDK 自带调试 UI，可以在浏览器里可视化地调用你的工具、资源与提示词。
      </StepHeader>
      <CodeReveal>
        <CodeBlock code={CODE_INSPECTOR} language="bash" type="terminal" filename="terminal" />
      </CodeReveal>

      {/* ===== STEP 4 ===== */}
      <StepHeader n={4} title="在 Claude Desktop 中连接">
        编辑配置文件：
      </StepHeader>
      <Reveal className="mt-4">
        <ul className="space-y-2 text-body-sm text-text-secondary">
          <li>
            <span className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">macOS</span>
            <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>
          </li>
          <li>
            <span className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">Windows</span>
            <code>%APPDATA%\Claude\claude_desktop_config.json</code>
          </li>
        </ul>
      </Reveal>
      <WarningPanel title="提醒：" className="mt-5">
        改完配置需<strong className="font-semibold text-c-plan">完全退出并重启</strong>{" "}
        Claude Desktop 才会生效。
      </WarningPanel>
      <CodeReveal>
        <Tabs defaultValue="stdio">
          <TabsList className="border border-panel-border bg-panel-2/60">
            <TabsTrigger value="stdio" className="font-mono text-xs data-[state=active]:bg-panel data-[state=active]:text-panel-text">
              stdio · 本地 Server
            </TabsTrigger>
            <TabsTrigger value="remote" className="font-mono text-xs data-[state=active]:bg-panel data-[state=active]:text-panel-text">
              streamable-http · 远程
            </TabsTrigger>
          </TabsList>
          <TabsContent value="stdio">
            <CodeBlock code={CODE_CLAUDE_STDIO} language="json" filename="claude_desktop_config.json" maxLines={0} />
          </TabsContent>
          <TabsContent value="remote">
            <CodeBlock code={CODE_CLAUDE_REMOTE} language="json" filename="claude_desktop_config.json（远程 Server）" maxLines={0} />
          </TabsContent>
        </Tabs>
      </CodeReveal>
      <AcceptCard>重启 Claude Desktop 后对话框出现 🔨 工具图标 = 连接成功。</AcceptCard>

      {/* ===== STEP 5 ===== */}
      <StepHeader n={5} title="在自己的 Agent 中连接（官方 SDK 客户端写法）" />
      <CodeReveal>
        <CodeBlock code={CODE_CLIENT} language="python" filename="client.py" maxLines={0} />
      </CodeReveal>
      <Reveal className="mt-6">
        <p className="text-body-lg text-text-secondary">
          拿到 <code>list_tools()</code> 的 schema 后，把它翻译成任意模型厂商的 Function
          Calling 格式喂给 LLM，模型选中某个工具时调用 <code>session.call_tool()</code>{" "}
          执行——
          <strong className="font-bold text-c-tool">MCP 不绑定任何一家模型</strong>。
        </p>
      </Reveal>
    </section>
  );
}
