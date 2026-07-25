import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Code,
  Cpu,
  Database,
  FileText,
  Monitor,
  Plug,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { Reveal } from "@/components/ui-extra";
import {
  ChapterHeading,
  SubHeading,
  Explain,
  KeyPoints,
  Figure,
} from "@/pages/principles/shared";
import { WarningPanel, GreenQuote } from "./shared";

/** 第一章 · MCP 全景回顾（design/v2/mcp.md §S3） */
export default function ChapterOverview() {
  return (
    <section aria-label="第一章 MCP 全景回顾" className="mt-24">
      <ChapterHeading id="overview" index={1} title="MCP 全景回顾" color={SEMANTIC.tool} />

      {/* ===== 1.1 为什么是 MCP ===== */}
      <SubHeading id="why" index="1.1" title="为什么是 MCP：从 M×N 到 M+N" color={SEMANTIC.tool} />

      <Explain>
        在 Function Calling 的世界里，假设有{" "}
        <strong className="font-bold text-text-primary">M 个 AI 应用</strong>
        （Claude Desktop、ChatGPT、你的自研 Agent、IDE 插件……）和{" "}
        <strong className="font-bold text-text-primary">N 个能力提供方</strong>
        （文件系统、GitHub、数据库、Slack、浏览器……）。
        <strong className="font-bold text-text-primary">没有标准时</strong>
        ：每个应用想接每个能力，都要单独写一套适配代码（API 认证、数据格式、工具描述 schema
        各不相同），集成总数是 <strong className="font-bold text-c-loop">M × N</strong>；
        <strong className="font-bold text-text-primary">有了 MCP 后</strong>
        ：应用方只需实现一次 "MCP Client"，能力方只需实现一次 "MCP
        Server"，任何符合协议的 Client 都能即插即用地使用任何 Server，集成总数降为{" "}
        <strong className="font-bold text-c-tool">M + N</strong>。
      </Explain>

      <Figure
        src="/diagram-mcp-mn.svg"
        alt="左右对比图：左侧无标准时 3 个应用与 4 个工具之间 12 条杂乱连线，右侧有了 MCP 后各只连一条线到中央 MCP 圆环共 7 条"
        caption="集成数量：M×N → M+N"
      />

      {/* 类比卡：bg-2 面板 + 左侧 3px 绿色竖条 */}
      <Reveal>
        <div className="my-8 rounded-xl border border-border-subtle bg-bg-2 px-6 py-5" style={{ borderLeft: "3px solid var(--c-tool)" }}>
          <p className="font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
            一句话记住 MCP
          </p>
          <ul className="mt-4 space-y-3.5">
            {[
              { icon: Plug, text: "USB-C 之于硬件 —— 一个接口连接所有外设" },
              { icon: Code, text: "LSP 之于编辑器 —— 任何编辑器接入任何语言的智能提示" },
              { icon: Cpu, text: "MCP 之于 AI 应用 —— 任何 AI 应用接入任何外部工具与数据源" },
            ].map((row) => (
              <li key={row.text} className="flex items-center gap-3 text-body text-text-secondary">
                <row.icon size={17} className="shrink-0 text-c-tool" aria-hidden />
                {row.text}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* 时间线：三段节点横排 */}
      <Reveal className="my-10">
        <ol className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-0">
          {[
            "2024.11 Anthropic 开源发布",
            "OpenAI / Google / 微软相继采纳",
            "2025 底 治理移交 Linux 基金会 AAIF · 成为事实标准",
          ].map((node, i, arr) => (
            <li key={node} className="flex items-start gap-3 sm:flex-1 sm:flex-col sm:gap-0">
              <span className="flex items-center gap-3 sm:w-full">
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-c-tool shadow-[0_0_8px_var(--c-tool)]" />
                {i < arr.length - 1 && (
                  <span aria-hidden className="hidden h-px flex-1 bg-border-subtle sm:block" />
                )}
              </span>
              <span className="font-mono text-caption leading-relaxed text-text-tertiary sm:mt-2.5 sm:pr-6">
                {node}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>

      <KeyPoints
        color={SEMANTIC.tool}
        items={[
          <>
            协议不绑定任何模型厂商：MCP 由 Anthropic 开源发起，但 OpenAI、Google、微软等主流厂商均已采纳，治理已移交
            Linux 基金会旗下的 Agentic AI Foundation（AAIF）。
          </>,
          <>
            "USB-C 接口"类比的确切含义：像 USB-C 统一了硬件外设的物理接口一样，MCP 统一了 AI
            应用与外部能力之间的连接方式——Server 写一次，任何兼容 Client 即插即用。
          </>,
        ]}
      />

      {/* ===== 1.2 三层架构 ===== */}
      <SubHeading id="architecture" index="1.2" title="三层架构：Host / Client / Server" color={SEMANTIC.tool} />

      <Figure
        src="/diagram-mcp-arch.svg"
        alt="MCP 三层架构工程图：顶层 Host 面板内含三个 Client，经 stdio 与 Streamable HTTP 三条连线接到底层三个 Server"
        caption="三层架构：Host（会话与授权）→ Client（1:1 协议端）→ Server（暴露能力）"
      />

      {/* 三个角色卡 */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            name: "Host 宿主",
            color: SEMANTIC.perceive,
            desc: "最终用户面对的应用：管理 LLM 会话与用户授权界面，内部为每个 Server 创建一个 Client。",
            eg: "Claude Desktop / Cursor / VS Code / 你的 Agent",
          },
          {
            name: "Client 客户端",
            color: SEMANTIC.plan,
            desc: "Host 内部与某个具体 Server 保持 1:1 连接的协议端：握手、能力协商、发送 JSON-RPC 请求。",
            eg: "每个 Server 对应一个 Client",
          },
          {
            name: "Server 服务端",
            color: SEMANTIC.tool,
            desc: "轻量进程或服务，通过标准化接口暴露工具、资源、提示词；可为本地子进程或远程 HTTP 服务。",
            eg: "filesystem / 远程 GitHub / 你写的工具",
          },
        ].map((role, i) => (
          <motion.div
            key={role.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-border-subtle bg-bg-1 p-5 transition-colors duration-[250ms] hover:border-border-strong"
            style={{ borderTop: `2px solid ${role.color}` }}
          >
            <h4 className="text-h4 font-bold" style={{ color: role.color }}>
              {role.name}
            </h4>
            <p className="mt-2.5 text-body-sm text-text-secondary">{role.desc}</p>
            <p className="mt-3 font-mono text-caption text-text-tertiary">{role.eg}</p>
          </motion.div>
        ))}
      </div>

      <Reveal className="mt-8">
        <GreenQuote>
          Server 不需要知道模型是谁，模型也不需要知道 Server 怎么实现——协议在中间做翻译。消息格式统一为
          JSON-RPC 2.0。
        </GreenQuote>
      </Reveal>

      {/* ===== 1.3 三大原语 ===== */}
      <SubHeading id="primitives" index="1.3" title="三大原语" color={SEMANTIC.tool} />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Wrench,
            name: "Tools 工具",
            ctrl: "模型决定调用",
            color: SEMANTIC.tool,
            highlight: true,
            desc: "可执行函数：查天气、写文件、发消息（有副作用）",
            analogy: "≈ Function Calling 的 function",
          },
          {
            icon: Database,
            name: "Resources 资源",
            ctrl: "应用/用户控制",
            color: SEMANTIC.perceive,
            highlight: false,
            desc: "可读取的上下文数据：文件内容、数据库记录、API 响应（只读，类似 GET）",
            analogy: "≈ 可挂载的“数据源”",
          },
          {
            icon: FileText,
            name: "Prompts 提示词",
            ctrl: "用户触发",
            color: SEMANTIC.plan,
            highlight: false,
            desc: "预定义的提示词模板/工作流，供用户一键选用",
            analogy: "≈ 可复用的 prompt 模板库",
          },
        ].map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={cn(
              "rounded-xl border bg-bg-1 p-5 transition-colors duration-[250ms]",
              p.highlight
                ? "border-c-tool/60 shadow-[0_0_24px_-6px_var(--c-tool)]"
                : "border-border-subtle hover:border-border-strong",
            )}
            style={p.highlight ? { background: semanticAlpha(SEMANTIC.tool, 5) } : undefined}
          >
            <p.icon size={20} style={{ color: p.color }} aria-hidden />
            <h4 className="mt-3 text-h4 font-bold text-text-primary">{p.name}</h4>
            <span
              className="mt-2 inline-block rounded-md border px-2 py-0.5 font-mono text-caption tracking-[0.12em]"
              style={{
                color: p.color,
                borderColor: semanticAlpha(p.color, 30),
                background: semanticAlpha(p.color, 10),
              }}
            >
              {p.ctrl}
            </span>
            <p className="mt-3 text-body-sm text-text-secondary">{p.desc}</p>
            <p className="mt-2.5 font-mono text-caption text-text-tertiary">{p.analogy}</p>
            {p.highlight && (
              <p className="mt-2 font-mono text-caption tracking-[0.12em] text-c-tool">最常用</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* 进阶折叠条 */}
      <PrimitivesAccordion />

      {/* ===== 1.4 传输方式 ===== */}
      <SubHeading id="transport" index="1.4" title="传输方式" color={SEMANTIC.tool} />

      <Reveal>
        <p className="text-body text-text-secondary">规范当前定义两种标准传输：</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-1">
                {["传输", "场景", "说明"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-5 py-3.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-body-sm text-text-secondary">
              <tr className="border-b border-border-subtle align-top">
                <td className="px-5 py-4 font-mono font-semibold text-c-tool">stdio</td>
                <td className="px-5 py-4 whitespace-nowrap">本地</td>
                <td className="px-5 py-4">
                  Host 把 Server 作为子进程启动，走标准输入/输出。零网络开销、零认证复杂度，适合本地工具（文件系统、git、数据库）。
                </td>
              </tr>
              <tr className="align-top">
                <td className="px-5 py-4 font-mono font-semibold text-c-perceive">Streamable HTTP</td>
                <td className="px-5 py-4 whitespace-nowrap">远程</td>
                <td className="px-5 py-4">
                  单一 HTTP 端点（POST 发 JSON-RPC，可选 GET 升级 SSE 流），支持会话管理（
                  <code>Mcp-Session-Id</code> 头）、断线续传，配合 OAuth 2.1 认证。
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>

      <WarningPanel title="版本注意（已核实）：" className="mt-6">
        2024-11-05 初版规范的远程传输为 <strong className="font-semibold text-text-primary">HTTP + SSE 双端点</strong>
        → 2025-03-26 修订版引入 <strong className="font-semibold text-text-primary">Streamable HTTP</strong> 取而代之 →
        <strong className="font-semibold text-text-primary">2025-11-25 修订版</strong>
        （当前最新）正式将旧 SSE 传输标记为 deprecated。老教程里的 <code>sse</code>{" "}
        写法仅为向后兼容保留——<strong className="font-semibold text-c-plan">新项目一律用 Streamable HTTP</strong>
        （<code>mcp.run(transport="streamable-http")</code>）。
      </WarningPanel>
    </section>
  );
}

/** 进阶折叠条：Roots / Sampling / Elicitation */
function PrimitivesAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-6 rounded-xl border border-border-subtle bg-bg-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-5 py-3.5 text-body-sm font-medium text-text-primary"
      >
        <span className="flex items-center gap-2">
          <Monitor size={15} className="text-c-tool" aria-hidden />
          进阶：Roots / Sampling / Elicitation
        </span>
        <ChevronDown
          size={15}
          className={cn("text-text-tertiary transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="border-t border-border-subtle px-5 py-4 text-body-sm text-text-secondary">
              规范还定义了 Roots、Sampling、Elicitation 等客户端能力，入门阶段掌握三大原语即可。
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
