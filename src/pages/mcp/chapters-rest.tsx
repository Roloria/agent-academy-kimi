import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bug,
  Globe,
  KeyRound,
  Lock,
  MessagesSquare,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import { Badge, ExternalLinkCard, Reveal } from "@/components/ui-extra";
import { ChapterHeading, SubHeading } from "@/pages/principles/shared";
import { WarningPanel, GradientStatement } from "./shared";

/* ================= 第三章 · 从 Function Calling 到 MCP ================= */

const VS_ROWS = [
  {
    dim: "作用域",
    fc: "单模型、单应用内：函数定义写死在你的代码里，随请求发送",
    mcp: "跨应用、跨模型的开放协议：Server 独立部署，任何兼容 Client 都能连",
  },
  {
    dim: "发现机制",
    fc: "开发者在 prompt/请求里静态声明可用工具列表",
    mcp: "运行时动态发现：Client 连接后调用 tools/list、resources/list、prompts/list，工具可热插拔",
    bold: true,
  },
  {
    dim: "复用性",
    fc: "每个应用重写一遍集成（M×N）",
    mcp: "写一次 Server，处处复用（M+N）；也能直接装社区现成的 Server",
  },
  {
    dim: "生态",
    fc: "各家 schema 略有差异（OpenAI / Anthropic / Gemini 格式不互通）",
    mcp: "统一 JSON-RPC 2.0 消息格式，配套官方多语言 SDK、官方 Server 市场/注册表",
  },
  {
    dim: "执行位置",
    fc: "你的应用进程内",
    mcp: "独立进程（stdio 子进程）或独立服务（远程 HTTP），天然带进程/网络隔离边界",
  },
];

const UPGRADE_STEPS = [
  { n: "①", text: "用 Function Calling 理解“模型如何表达调用意图”", to: "/principles#tools", external: true },
  { n: "②", text: "把函数改造成 MCP Server 的工具", to: "#hands-on", external: false },
  { n: "③", text: "学会用现成 Server（而不是自己造轮子）", to: "#ecosystem", external: false },
  { n: "④", text: "理解多 Server 编排与安全治理", to: "#security", external: false },
];

export function ChapterVs() {
  return (
    <section aria-label="第三章 从 Function Calling 到 MCP" className="mt-24">
      <ChapterHeading
        id="vs-function-calling"
        index={3}
        title="从 Function Calling 到 MCP"
        color={SEMANTIC.tool}
      />

      <Reveal>
        <GradientStatement>
          Function Calling 没有过时——它是模型层的底层能力；MCP 是它之上的工程协议层。
        </GradientStatement>
        <p className="mt-4 text-body text-text-secondary">
          两者的关系是“MCP 把工具发现/调用标准化，最终仍翻译成各模型的 function calling 格式”。
        </p>
      </Reveal>

      {/* 五维对比表 */}
      <Reveal className="mt-8">
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-1">
                {["维度", "Function Calling", "MCP"].map((h, i) => (
                  <th
                    key={h}
                    className={cn(
                      "px-5 py-3.5 font-mono text-caption uppercase tracking-[0.12em]",
                      i === 2 ? "text-c-tool" : "text-text-tertiary",
                    )}
                    style={i === 2 ? { background: semanticAlpha(SEMANTIC.tool, 5) } : undefined}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VS_ROWS.map((row, i) => (
                <motion.tr
                  key={row.dim}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className={cn(
                    "align-top text-body-sm text-text-secondary",
                    i < VS_ROWS.length - 1 && "border-b border-border-subtle",
                    row.bold && "font-semibold",
                  )}
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-text-primary">{row.dim}</td>
                  <td className="px-5 py-4">{row.fc}</td>
                  <td className="px-5 py-4" style={{ background: semanticAlpha(SEMANTIC.tool, 5) }}>
                    {row.mcp}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* 升级路径四步条 */}
      <Reveal className="mt-10">
        <p className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
          升级路径建议
        </p>
        <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {UPGRADE_STEPS.map((s, i) => {
            const inner = (
              <>
                <span className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-c-tool/50 font-mono text-caption text-c-tool">
                    {i + 1}
                  </span>
                  <span className="text-body-sm text-text-secondary group-hover:text-text-primary">
                    {s.text}
                  </span>
                </span>
                {i < UPGRADE_STEPS.length - 1 && (
                  <span aria-hidden className="mt-2 hidden text-c-tool lg:absolute lg:-right-3.5 lg:top-1/2 lg:mt-0 lg:block lg:-translate-y-1/2">
                    →
                  </span>
                )}
              </>
            );
            const cls =
              "group relative flex-1 rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors duration-[250ms] hover:border-c-tool/60";
            return (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.12, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex-1"
              >
                {s.external ? (
                  <Link to={s.to} className={cn("block", cls)}>{inner}</Link>
                ) : (
                  <a href={s.to} className={cn("block", cls)}>{inner}</a>
                )}
              </motion.li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}

/* ================= 第四章 · 生态图谱 ================= */

const OFFICIAL_SERVERS = [
  { name: "filesystem", desc: "受限目录内的文件读写/搜索，最常用的本地工具", hot: true },
  { name: "fetch", desc: "抓取网页并转成 Markdown" },
  { name: "git", desc: "读取/操作 Git 仓库" },
  { name: "memory", desc: "基于知识图谱的持久化记忆" },
  { name: "sequential-thinking", desc: "结构化分步推理" },
  { name: "time", desc: "时间与时区转换" },
  { name: "everything", desc: "全功能演示/测试 Server" },
];

const FRAMEWORK_ROWS = [
  {
    fw: "OpenAI Agents SDK",
    how: "原生内置",
    api: "from agents.mcp import MCPServerStdio, MCPServerStreamableHttp，传给 Agent(mcp_servers=[...])；另有 MCPServerSse（已弃用）、MCPServerManager（多 Server 生命周期）、HostedMCPTool（托管执行）",
  },
  {
    fw: "LangChain / LangGraph",
    how: "官方适配器包 langchain-mcp-adapters",
    api: "MultiServerMCPClient({...}) + await client.get_tools()，工具自动转成 LangChain Tool 喂给 create_agent",
  },
  {
    fw: "PydanticAI",
    how: "原生内置",
    api: "MCPServerStdio(...) / MCPServerStreamableHTTP(url) 作为 toolset 传入 Agent；还能反向把 Agent 暴露为 MCP Server",
  },
  {
    fw: "Claude（Desktop / Code）",
    how: "协议发起方，原生支持",
    api: "claude_desktop_config.json / claude mcp add",
  },
  {
    fw: "VS Code / Cursor / Windsurf",
    how: "编辑器内置 MCP 客户端",
    api: "与 Claude Desktop 同构的 mcpServers JSON 配置",
  },
  {
    fw: "Spring AI（Java）",
    how: "官方 starter",
    api: "spring-ai-starter-mcp-client/server",
  },
];

export function ChapterEcosystem() {
  return (
    <section aria-label="第四章 生态图谱" className="mt-24">
      <ChapterHeading id="ecosystem" index={4} title="生态图谱" color={SEMANTIC.tool} />
      <p className="-mt-4 font-mono text-caption text-text-tertiary">
        以下信息已核实，生态变化快，安装前请以官方仓库为准
      </p>

      <SubHeading id="official-servers" index="4.1" title="官方参考 Server" color={SEMANTIC.tool} />

      <WarningPanel title="重要调整：">
        2025 年官方仓库 <code>modelcontextprotocol/servers</code> 大调整：
        <strong className="font-semibold text-text-primary">仅保留 7 个官方维护的参考 Server</strong>，
        GitHub、Slack、Postgres、Brave Search、Google Drive、Puppeteer 等移交厂商维护（旧版归档至{" "}
        <code>servers-archived</code>）。
        <strong className="font-semibold text-c-plan">装 Server 前先查是否已有“厂商官方版”，不要用归档旧包。</strong>
      </WarningPanel>

      <div className="mt-6 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {OFFICIAL_SERVERS.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-border-subtle bg-bg-1 p-4 transition-colors duration-[250ms] hover:border-c-tool/60"
          >
            <p className="flex items-center justify-between gap-2 font-mono text-body-sm font-semibold text-c-tool">
              {s.name}
              {s.hot && <Badge color={SEMANTIC.tool}>最常用</Badge>}
            </p>
            <p className="mt-2 text-caption text-text-tertiary">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 厂商官方版高亮行 */}
      <Reveal className="mt-6">
        <a
          href="https://api.githubcopilot.com/mcp/"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-c-tool/40 bg-c-tool/5 px-5 py-4 transition-colors duration-[250ms] hover:border-c-tool"
        >
          <Globe size={17} className="shrink-0 text-c-tool" aria-hidden />
          <span className="text-body-sm text-text-secondary">
            <strong className="font-semibold text-text-primary">厂商接管示例：GitHub 官方远程 MCP Server</strong>{" "}
            托管于 <code>https://api.githubcopilot.com/mcp/</code>
            ，替代了已停止维护的 npm 包 <code>@modelcontextprotocol/server-github</code>；Postgres、Brave
            Search 等同理转向厂商官方维护版本。
          </span>
          <span className="flex items-center gap-2">
            <Badge color={SEMANTIC.perceive}>OAUTH / PAT</Badge>
            <ArrowUpRight size={15} className="text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-c-tool" />
          </span>
        </a>
      </Reveal>

      <SubHeading id="community" index="4.2" title="社区精选" color={SEMANTIC.tool} />

      <div className="grid gap-3 sm:grid-cols-2">
        <ExternalLinkCard
          href="https://github.com/punkpeye/awesome-mcp-servers"
          title="awesome-mcp-servers"
          desc="最大的社区收录列表（punkpeye/awesome-mcp-servers），按类别（数据库、云平台、浏览器自动化、生产力……）索引数百个 Server"
        />
        <ExternalLinkCard
          href="https://modelcontextprotocol.io"
          title="MCP Registry"
          desc="官方注册表，供发布和发现 Server"
        />
      </div>

      <SubHeading id="framework-support" index="4.3" title="主流框架的 MCP 支持" color={SEMANTIC.tool} />

      <Reveal>
        <div className="overflow-x-auto rounded-xl border border-border-subtle">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-1">
                {["框架", "集成方式", "关键 API"].map((h) => (
                  <th key={h} className="px-5 py-3.5 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FRAMEWORK_ROWS.map((row, i) => (
                <motion.tr
                  key={row.fw}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={cn(
                    "align-top text-body-sm text-text-secondary",
                    i < FRAMEWORK_ROWS.length - 1 && "border-b border-border-subtle",
                  )}
                >
                  <td className="whitespace-nowrap px-5 py-4 font-semibold text-text-primary">{row.fw}</td>
                  <td className="px-5 py-4">{row.how}</td>
                  <td className="px-5 py-4 font-mono text-caption leading-relaxed text-c-perceive">{row.api}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}

/* ================= 第五章 · 安全与工程注意 ================= */

const SECURITY_CARDS = [
  {
    id: "01",
    icon: Bug,
    color: SEMANTIC.loop,
    title: "工具投毒 Tool Poisoning",
    body: "恶意 Server 可在工具描述（description）中嵌入隐藏指令，诱导模型泄露数据或误调其他工具（Invariant Labs 首次披露该攻击面）。",
    fix: "只安装可信来源的 Server；接入前用 mcp-scan 等开源扫描器审计工具描述；把工具元数据当作不可信输入。",
  },
  {
    id: "02",
    icon: MessagesSquare,
    color: SEMANTIC.loop,
    title: "间接提示词注入",
    body: "工具返回的内容（网页、邮件、Issue）可能夹带恶意指令。",
    fix: "隔离不可信内容、不让检索结果直接驱动高危工具调用。",
  },
  {
    id: "03",
    icon: Lock,
    color: SEMANTIC.plan,
    title: "权限最小化",
    body: "filesystem 只挂载必要子目录；数据库用只读账号；拆分读/写工具；框架层用工具白名单过滤（如 OpenAI Agents SDK 的 tool_filter=create_static_tool_filter(allowed_tool_names=[...])）。",
  },
  {
    id: "04",
    icon: UserCheck,
    color: SEMANTIC.plan,
    title: "Human-in-the-loop",
    body: "对写操作/删改类工具禁用自动批准，要求人工确认（OpenAI Agents SDK 支持 require_approval 策略）。",
    stat: "自动批准攻击成功率 80%+ → 人工确认后 < 5%",
  },
  {
    id: "05",
    icon: KeyRound,
    color: SEMANTIC.perceive,
    title: "远程 MCP 认证",
    body: "Streamable HTTP 传输必须启用认证——规范推荐 OAuth 2.1 + PKCE，禁止 token 透传（token passthrough），校验 token audience；本地 stdio Server 绝不暴露到网络。",
  },
  {
    id: "06",
    icon: Globe,
    color: SEMANTIC.perceive,
    title: "会话与传输安全",
    body: "校验 Origin 头防 DNS rebinding；绑定 127.0.0.1；妥善管理 Mcp-Session-Id；远程一律 HTTPS。",
  },
  {
    id: "07",
    icon: ShieldAlert,
    color: SEMANTIC.loop,
    title: "工具伪装 Tool Shadowing",
    body: "多 Server 场景下用全限定名（server 前缀）避免同名工具冲突，身份无法验证时 fail-closed。",
  },
];

export function ChapterSecurity() {
  return (
    <section aria-label="第五章 安全与工程注意" className="mt-24">
      <ChapterHeading id="security" index={5} title="安全与工程注意" color={SEMANTIC.tool} />
      <Reveal>
        <p className="-mt-4 text-body-lg text-text-secondary">
          MCP 让模型获得了<strong className="font-bold text-text-primary">真实的执行能力</strong>
          ——安全必须前置考虑。
        </p>
      </Reveal>

      <ol className="mt-10 space-y-4">
        {SECURITY_CARDS.map((c, i) => (
          <motion.li
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="rounded-xl border border-border-subtle bg-bg-1 p-5 transition-colors duration-[250ms] hover:border-border-strong"
            style={{ borderLeft: `3px solid ${c.color}` }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                className="rounded-md border px-2 py-0.5 font-mono text-caption tracking-[0.12em]"
                style={{
                  color: c.color,
                  borderColor: semanticAlpha(c.color, 30),
                  background: semanticAlpha(c.color, 10),
                }}
              >
                SEC {c.id}
              </motion.span>
              <c.icon size={17} style={{ color: c.color }} aria-hidden />
              <h4 className="text-h4 font-bold text-text-primary">{c.title}</h4>
            </div>
            <p className="mt-3 text-body-sm text-text-secondary">{c.body}</p>
            {c.stat && (
              <p
                className="mt-3 bg-clip-text text-h4 font-black text-transparent"
                style={{ backgroundImage: "linear-gradient(120deg, var(--c-loop), var(--c-tool))" }}
              >
                {c.stat}
              </p>
            )}
            {c.fix && (
              <p className="mt-3 text-body-sm">
                <strong className="mr-2 font-mono text-caption uppercase tracking-[0.12em] text-c-tool">对策</strong>
                <span className="text-text-secondary">{c.fix}</span>
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

/* ================= 第六章 · 参考来源与小结 ================= */

const REFERENCES: { title: string; url: string; note?: string }[] = [
  { title: "官方文档站（架构、概念、Quickstart）", url: "https://modelcontextprotocol.io" },
  {
    title: "协议规范（含 2025-11-25 最新修订与 changelog）",
    url: "https://modelcontextprotocol.io/specification/2025-11-25",
    note: "版本规则见 https://modelcontextprotocol.io/specification/versioning",
  },
  { title: "协议主仓库", url: "https://github.com/modelcontextprotocol/modelcontextprotocol" },
  {
    title: "官方参考 Servers（归档旧实现见 servers-archived）",
    url: "https://github.com/modelcontextprotocol/servers",
  },
  { title: "Python SDK（含 FastMCP）", url: "https://github.com/modelcontextprotocol/python-sdk" },
  { title: "TypeScript SDK", url: "https://github.com/modelcontextprotocol/typescript-sdk" },
  { title: "社区精选 awesome-mcp-servers", url: "https://github.com/punkpeye/awesome-mcp-servers" },
  {
    title: "GitHub 官方远程 MCP Server（文档见 GitHub Docs “GitHub MCP Server”）",
    url: "https://api.githubcopilot.com/mcp/",
  },
  {
    title: "LangChain 适配器 langchain-mcp-adapters",
    url: "https://github.com/langchain-ai/langchain-mcp-adapters",
    note: "文档：https://docs.langchain.com/oss/python/langchain/mcp",
  },
  {
    title: "OpenAI Agents SDK MCP 文档",
    url: "https://openai.github.io/openai-agents-python/mcp/",
  },
  {
    title: "安全研究：Invariant Labs《Tool Poisoning Attacks》+ 扫描器 mcp-scan",
    url: "https://github.com/invariantlabs-ai/mcp-scan",
  },
];

const RECAP = [
  "MCP = AI 能力的标准插座，把 M×N 的集成爆炸降为 M+N；",
  "架构三层：Host（管会话与授权）→ Client（1:1 协议端）→ Server（暴露 Tools/Resources/Prompts）；",
  "传输两种：本地 stdio、远程 Streamable HTTP（旧 SSE 已弃用）；",
  "写 Server 用官方 Python SDK 的 mcp.server.fastmcp.FastMCP，三个装饰器 @mcp.tool() / @mcp.resource() / @mcp.prompt() 即完成；",
  "生态已成熟：官方参考 Server + 厂商官方版 + awesome-mcp-servers，主流框架（OpenAI Agents SDK / LangChain / PydanticAI）全部原生支持；",
  "安全第一：防工具投毒、权限最小化、远程必认证、写操作要人工确认。",
];

export function ChapterReferences() {
  return (
    <section aria-label="第六章 参考来源与小结" className="mt-24">
      <ChapterHeading id="references" index={6} title="参考来源与小结" color={SEMANTIC.tool} />

      <ol className="space-y-3">
        {REFERENCES.map((r, i) => (
          <motion.li
            key={r.url}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="flex items-baseline gap-3"
          >
            <span className="shrink-0 font-mono text-caption text-c-tool">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-body-sm text-text-secondary">
              {r.title}：
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all font-mono text-caption text-c-perceive hover:underline"
              >
                {r.url}
                <ArrowUpRight size={12} className="ml-0.5 inline" aria-hidden />
              </a>
              {r.note && <span className="mt-1 block font-mono text-caption text-text-tertiary">{r.note}</span>}
            </span>
          </motion.li>
        ))}
      </ol>

      {/* 小结卡：绿色渐变描边大卡 */}
      <Reveal className="mt-12">
        <div
          className="rounded-2xl p-[1.5px]"
          style={{
            background: "linear-gradient(135deg, var(--c-tool), var(--c-perceive))",
            boxShadow: "0 0 32px -8px color-mix(in srgb, var(--c-tool) 35%, transparent)",
          }}
        >
          <div className="rounded-2xl bg-bg-1 px-7 py-7">
            <p className="font-mono text-caption uppercase tracking-[0.12em] text-c-tool">RECAP</p>
            <h3 className="mt-2 text-h3 font-bold text-text-primary">六句话带走 MCP</h3>
            <ul className="mt-5 space-y-3">
              {RECAP.map((line) => (
                <li key={line} className="flex gap-3 text-body-sm text-text-secondary">
                  <span aria-hidden className="mt-0.5 shrink-0 font-mono text-c-tool">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
