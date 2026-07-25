/**
 * 沙盒页双语文案 + 主题模板库 + 迷你报告模板（design/v2/sandbox.md §3.4 / §3.5）。
 * 所有模拟来源统一使用 .example 假域名；报告与引用均为演示数据。
 */

export type Locale = "zh" | "en";

export interface SearchResult {
  title: string;
  domain: string;
}

export interface FetchPage {
  url: string;
  inTokens: string;
  outTokens: string;
}

/** 一个主题的完整模拟数据（§3.4） */
export interface TopicTemplate {
  questions: [string, string, string, string];
  results: SearchResult[]; // 5 条
  pages: [FetchPage, FetchPage];
  /** 预设主题的精调摘要；通用模板为空（用通用插值） */
  abstract?: string;
}

export interface ReportLine {
  t: "title" | "quote" | "h" | "p" | "li" | "ref" | "gap";
  text: string;
  url?: string;
  md: string;
}

export interface ReportUnit {
  lines: ReportLine[];
}

export interface Report {
  units: ReportUnit[];
  markdown: string;
}

export interface SandboxCopy {
  locale: Locale;
  /* S1 页头 */
  crumbHome: string;
  crumbHere: string;
  simBadge: string;
  simCaptionPre: string;
  simCaptionLink: string;
  simCaptionPost: string;
  h1a: string;
  h1b: string;
  leadA: string;
  leadB: string;
  leadC: string;
  badgeReact: string;
  badgeCapstone: string;
  /* S2 工作台 */
  workbenchTitle: string;
  phases: [string, string, string, string, string];
  pause: string;
  resume: string;
  replay: string;
  stepMode: string;
  nextStep: string;
  stepProgress: (done: number, total: number) => string;
  inputPlaceholder: string;
  run: string;
  presetLabel: string;
  terminalTab: string;
  reportTab: string;
  reportLockedHint: string;
  terminalIdleHint: string;
  watermark: string;
  generatedBadge: string;
  download: string;
  backToLatest: string;
  confirmTitle: string;
  confirmCancel: string;
  confirmOk: string;
  running: string;
  simulatedNote: string;
  /* 轨迹文案（§3.1） */
  divider: (index: number, phase: string, phaseEn: string) => string;
  phaseEn: Record<"plan" | "search" | "read" | "write", string>;
  thoughtPlan: (t: string) => string;
  thoughtSearch: string;
  thoughtRead: string;
  thoughtWrite: string;
  thoughtCheck: string;
  planObservationLabel: string;
  fetchObservation: (inTokens: string, outTokens: string) => string;
  writeObservation: string;
  doneTitle: string;
  doneFile: (slug: string) => string;
  doneDownload: string;
  doneCapstone: string;
  writeOutline: [string, string, string, string];
  /* S4 拆穿带 */
  s4Tag: string;
  s4Title: string;
  s4c1Title: string;
  s4c1Body: string;
  s4c1Link: string;
  s4c2Title: string;
  s4c2Body: string;
  s4c2Link: string;
  s4c3Title: string;
  s4c3Body: string;
  /* S5 CTA */
  s5TitleA: string;
  s5TitleB: string;
  s5Sub: string;
  s5Primary: string;
  s5Ghost: string;
  /* 数据 */
  presets: { topic: string; template: TopicTemplate }[];
  generic: (topic: string) => TopicTemplate;
  reportDisclaimer1: string;
  reportDisclaimer2: string;
  reportTitleSuffix: string;
  abstractHeading: string;
  genericAbstract: (t: string) => string;
  sec1Heading: string;
  sec1Body: (t: string) => string;
  sec2Heading: string;
  sec2Bullets: (t: string) => [string, string, string];
  sec3Heading: string;
  sec3Body: (t: string) => string;
  refsHeading: string;
  refLabel: (t: string, kind: 1 | 2 | 3) => string;
}

/* ------------------------------- 通用数据构建 ------------------------------- */

/** 主题 → slug：提取 ASCII 字母数字段连字符化；纯中文等场景回退 "topic"（§3.5） */
export function slugify(topic: string): string {
  const parts = topic.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  const slug = parts.join("-").slice(0, 48).replace(/-+$/g, "");
  return slug || "topic";
}

/** 按用户输入匹配预设精调模板，否则用通用模板（§3.4） */
export function templateFor(copy: SandboxCopy, topic: string): TopicTemplate {
  const hit = copy.presets.find(
    (p) => p.topic.trim().toLowerCase() === topic.trim().toLowerCase(),
  );
  return hit ? hit.template : copy.generic(topic);
}

/** 迷你报告（§3.5）：结构化单元（供流式渲染）+ 完整 Markdown（供 Blob 下载） */
export function buildReport(
  copy: SandboxCopy,
  topic: string,
  tpl: TopicTemplate,
): Report {
  const slug = slugify(topic);
  const title = `${topic} — ${copy.reportTitleSuffix}`;
  const abstract = tpl.abstract ?? copy.genericAbstract(topic);
  const refs = ([1, 2, 3] as const).map((n) => ({
    text: `[${n}] ${copy.refLabel(topic, n)}`,
    url:
      n === 1
        ? `https://docs.example/${slug}`
        : n === 2
          ? `https://blog.example/${slug}-intro`
          : `https://wiki.example/${slug}-patterns`,
  }));

  const units: ReportUnit[] = [
    {
      lines: [
        { t: "title", text: title, md: `# ${title}` },
        { t: "gap", text: "", md: "" },
        { t: "quote", text: copy.reportDisclaimer1, md: `> ${copy.reportDisclaimer1}` },
        { t: "quote", text: copy.reportDisclaimer2, md: `> ${copy.reportDisclaimer2}` },
      ],
    },
    {
      lines: [
        { t: "h", text: copy.abstractHeading, md: `## ${copy.abstractHeading}` },
        { t: "p", text: abstract, md: abstract },
      ],
    },
    {
      lines: [
        { t: "h", text: copy.sec1Heading, md: `## ${copy.sec1Heading}` },
        { t: "p", text: copy.sec1Body(topic), md: copy.sec1Body(topic) },
      ],
    },
    {
      lines: [
        { t: "h", text: copy.sec2Heading, md: `## ${copy.sec2Heading}` },
        ...copy.sec2Bullets(topic).map(
          (b): ReportLine => ({ t: "li", text: b, md: `- ${b}` }),
        ),
      ],
    },
    {
      lines: [
        { t: "h", text: copy.sec3Heading, md: `## ${copy.sec3Heading}` },
        { t: "p", text: copy.sec3Body(topic), md: copy.sec3Body(topic) },
      ],
    },
    {
      lines: [
        { t: "h", text: copy.refsHeading, md: `## ${copy.refsHeading}` },
        ...refs.map(
          (r): ReportLine => ({
            t: "ref",
            text: `${r.text} — ${r.url}`,
            url: r.url,
            md: `${r.text} — ${r.url}`,
          }),
        ),
      ],
    },
  ];

  const markdown =
    units.map((u) => u.lines.map((l) => l.md).join("\n")).join("\n\n") + "\n";
  return { units, markdown };
}

/* --------------------------------- 中文文案 --------------------------------- */

export const ZH: SandboxCopy = {
  locale: "zh",
  crumbHome: "HOME",
  crumbHere: "沙盒演示",
  simBadge: "⚠ 模拟演示 SIMULATED DEMO",
  simCaptionPre:
    "本页所有输出均为前端模板回放，未调用任何真实模型或网络 API——想跑真的，去 ",
  simCaptionLink: "实战教程",
  simCaptionPost: "。",
  h1a: "看一个 Agent ",
  h1b: "跑起来",
  leadA: "这就是你在实战教程里要亲手构建的《个人研究助理》。输入一个研究主题，观察它如何像 ReAct 论文描述的那样：",
  leadB: "想（Thought）→ 做（Action）→ 看（Observation）→ 再想",
  leadC: "——直到交付一份带引用的迷你研究报告。",
  badgeReact: "REACT · ARXIV:2210.03629",
  badgeCapstone: "CAPSTONE 同款项目",
  workbenchTitle: "research-assistant — simulated run",
  phases: ["输入", "规划", "搜索", "阅读", "写作"],
  pause: "⏸ 暂停",
  resume: "▶ 继续",
  replay: "↻ 重放",
  stepMode: "逐步",
  nextStep: "下一步 →",
  stepProgress: (done, total) => `${done} / ${total}`,
  inputPlaceholder: "输入一个研究主题，例如：对比 LangGraph 和 OpenAI Agents SDK",
  run: "▶ 运行",
  presetLabel: "或选一个预设主题：",
  terminalTab: "终端 TERMINAL",
  reportTab: "报告 REPORT",
  reportLockedHint: "写作阶段开始后，报告将在这里逐节生成。",
  terminalIdleHint: "# 输入主题并点击「运行」，工具调用日志将实时打印在这里",
  watermark: "模拟数据",
  generatedBadge: "✓ 已生成",
  download: "⬇ 下载 .md",
  backToLatest: "↓ 回到最新",
  confirmTitle: "放弃当前回放？",
  confirmCancel: "取消",
  confirmOk: "放弃并重置",
  running: "running…",
  simulatedNote: "(模拟结果)",
  divider: (index, phase, phaseEn) => `阶段 ${index} · ${phase} ${phaseEn}`,
  phaseEn: { plan: "PLAN", search: "SEARCH", read: "READ", write: "WRITE" },
  thoughtPlan: (t) =>
    `我需要研究主题「${t}」。这个主题比较宽泛，我先把它拆成 4 个子问题，再逐个搜索、阅读、综合。`,
  thoughtSearch: "计划完成。先从子问题 1 开始检索最新资料。",
  thoughtRead:
    "搜索结果看起来相关。我抓取排名最高的两个页面，提取正文并压缩，避免上下文爆炸。",
  thoughtWrite:
    "信息已经足够。我按固定骨架生成报告：摘要 → 三节正文 → 参考来源，每节标注引用编号。",
  thoughtCheck:
    "检查清单：① 有摘要 ✓ ② 每节 ≥1 个来源 ✓ ③ 引用编号与参考来源对应 ✓。可以交付。",
  planObservationLabel: "已拆分为 4 个子问题：",
  fetchObservation: (inTokens, outTokens) =>
    `提取正文 ${inTokens} tokens → 压缩为 ${outTokens} tokens`,
  writeObservation: "报告草稿 1,180 字",
  doneTitle: "✅ 报告已生成",
  doneFile: (slug) => `reports/${slug}.md`,
  doneDownload: "⬇ 下载报告",
  doneCapstone: "→ 用真实代码实现它（8 步教程）",
  writeOutline: ["摘要", "背景与定义", "核心要点", "对比与结论"],
  s4Tag: "HOW IT WORKS",
  s4Title: "它是真的吗？",
  s4c1Title: "这次回放对应论文里的什么？",
  s4c1Body:
    "左栏的 Thought / Action / Observation 条目，就是 ReAct 论文（arXiv:2210.03629）轨迹的逐帧对照——配色与本站原理页的轨迹图一致。",
  s4c1Link: "重读 ReAct 原理 →",
  s4c2Title: "真实版本长什么样？",
  s4c2Body:
    "真实的终端输出长这样：真实的 LLM、真实的 Tavily 搜索 API、真实落盘的 Markdown 报告。",
  s4c2Link: "8 步完整教程，全部真实代码 →",
  s4c3Title: "这个沙盒怎么实现的？",
  s4c3Body:
    "没有模型、没有 API——只有一份编排好的脚本 + 打字机效果。真正神奇的部分（LLM 的推理）在教程里由你自己接入。",
  s5TitleA: "模拟到此为止——",
  s5TitleB: "现在去造一个真的",
  s5Sub: "8 步、全部真实可运行代码：真实的 LLM、真实的搜索 API、真实落盘的报告。",
  s5Primary: "开始 8 步实战教程 →",
  s5Ghost: "先补原理：ReAct 循环",
  presets: [
    {
      topic: "对比 LangGraph 和 OpenAI Agents SDK",
      template: {
        questions: [
          "LangGraph 与 OpenAI Agents SDK 各自的设计哲学是什么？",
          "两者在状态管理与编排模型上有何差异？",
          "生态、学习成本与生产适用场景对比如何？",
          "学习者应该先从哪一个入手？",
        ],
        results: [
          { title: "LangGraph 官方文档", domain: "docs.example" },
          { title: "OpenAI Agents SDK 快速上手", domain: "docs.example" },
          { title: "LangGraph vs Agents SDK：编排之争", domain: "blog.example" },
          { title: "Agent 框架选型指南（2025）", domain: "wiki.example" },
          { title: "从手写循环到框架：迁移经验谈", domain: "blog.example" },
        ],
        pages: [
          {
            url: "https://docs.example/langgraph",
            inTokens: "8,200",
            outTokens: "1,400",
          },
          {
            url: "https://docs.example/agents-sdk",
            inTokens: "6,700",
            outTokens: "1,150",
          },
        ],
        abstract:
          "围绕「对比 LangGraph 和 OpenAI Agents SDK」，本报告检索了 4 个子问题、阅读 2 个页面。结论先行：LangGraph 是图式编排底座，控制粒度细、适合长期演进的复杂工作流；OpenAI Agents SDK 是轻量封装，上手快、适合快速验证。学习路径建议先手写最小循环，再按需迁移。",
      },
    },
    {
      topic: "MCP 协议解决了什么问题",
      template: {
        questions: [
          "MCP 出现之前，应用与工具的集成方式有什么痛点？",
          "MCP 的三层架构（Host / Client / Server）如何分工？",
          "MCP 与 Function Calling 是什么关系？",
          "接入 MCP 生态需要哪些成本？",
        ],
        results: [
          { title: "MCP 官方文档", domain: "docs.example" },
          { title: "MCP 规范与版本说明", domain: "spec.example" },
          { title: "没有标准的 M×N 集成噩梦", domain: "blog.example" },
          { title: "awesome-mcp-servers 生态列表", domain: "hub.example" },
          { title: "Function Calling 与 MCP 对比", domain: "wiki.example" },
        ],
        pages: [
          {
            url: "https://docs.example/mcp",
            inTokens: "9,400",
            outTokens: "1,600",
          },
          {
            url: "https://spec.example/mcp versioning",
            inTokens: "5,800",
            outTokens: "980",
          },
        ],
        abstract:
          "围绕「MCP 协议解决了什么问题」，本报告检索了 4 个子问题、阅读 2 个页面。结论先行：MCP 把应用与工具之间 M×N 的私有集成，统一为 M+N 的标准协议——Host 内的 Client 通过 stdio 或 Streamable HTTP 连接各类 Server。它与 Function Calling 互补而非替代：一个管「模型怎么选工具」，一个管「工具怎么被发现与连接」。",
      },
    },
    {
      topic: "ReAct 与 Reflexion 的区别",
      template: {
        questions: [
          "ReAct 的 Thought-Action-Observation 循环如何工作？",
          "Reflexion 的自我反思机制是什么？",
          "两者在记忆使用与适用任务上有何差异？",
          "能否将 ReAct 与 Reflexion 组合使用？",
        ],
        results: [
          { title: "ReAct 论文解读（arXiv:2210.03629）", domain: "blog.example" },
          { title: "Reflexion 论文摘要", domain: "wiki.example" },
          { title: "推理与行动：ReAct 实践指南", domain: "docs.example" },
          { title: "自我反思 Agent 的评估结果", domain: "journal.example" },
          { title: "ReAct vs Reflexion 选择建议", domain: "blog.example" },
        ],
        pages: [
          {
            url: "https://blog.example/react-explained",
            inTokens: "7,600",
            outTokens: "1,300",
          },
          {
            url: "https://wiki.example/reflexion",
            inTokens: "6,100",
            outTokens: "1,050",
          },
        ],
        abstract:
          "围绕「ReAct 与 Reflexion 的区别」，本报告检索了 4 个子问题、阅读 2 个页面。结论先行：ReAct 在每一步交替「推理」与「行动」，解决的是边想边做；Reflexion 在一次尝试结束后生成文字反思并存入记忆，解决的是跨轮次改进。两者正交，常见组合是 ReAct 做执行循环、Reflexion 做外层复盘。",
      },
    },
  ],
  generic: (t) => ({
    questions: [
      `「${t}」的背景与核心定义是什么？`,
      `「${t}」涉及哪些关键技术或组件？`,
      `「${t}」的主流方案或观点有哪些，如何对比？`,
      `关于「${t}」，实践中有哪些经验与建议？`,
    ],
    results: [
      { title: `${t} 官方文档`, domain: "docs.example" },
      { title: `${t} 入门指南`, domain: "blog.example" },
      { title: `${t} 深度解析`, domain: "wiki.example" },
      { title: `${t} 工程实践`, domain: "dev.example" },
      { title: `${t} 常见问题`, domain: "forum.example" },
    ],
    pages: [
      { url: `https://docs.example/${slugify(t)}`, inTokens: "8,200", outTokens: "1,400" },
      { url: `https://blog.example/${slugify(t)}-intro`, inTokens: "6,400", outTokens: "1,100" },
    ],
  }),
  reportDisclaimer1:
    "⚠️ 本报告由沙盒模拟生成，内容与引用均为演示数据，仅供理解 Agent 工作流程。",
  reportDisclaimer2: "真实版本教程：/capstone",
  reportTitleSuffix: "迷你研究报告",
  abstractHeading: "摘要",
  genericAbstract: (t) =>
    `围绕「${t}」，本报告从背景定义、核心要点、对比结论三个角度进行了快速调研，共检索 4 个子问题、阅读 2 个页面，形成以下结构化结论。`,
  sec1Heading: "1. 背景与定义",
  sec1Body: (t) =>
    `${t}是当前 AI Agent 领域的一个关键议题。[1] 从官方文档的定义出发，它解决的核心问题是：如何让模型从"单次问答"走向"多步自主完成任务"。[2]`,
  sec2Heading: "2. 核心要点",
  sec2Bullets: (t) => [
    `要点一：架构层面，${t}涉及规划、记忆与工具使用的协同 [1]`,
    `要点二：工程层面，需要显式的循环控制与可观测性 [3]`,
    `要点三：评估层面，成功率与 token 成本需同时考量 [2]`,
  ],
  sec3Heading: "3. 对比与结论",
  sec3Body: (t) =>
    `综合检索结果，${t}的主流实践路径有两条：轻量封装优先（快速验证）与编排底座优先（长期演进）。[1][3] 对学习者而言，建议先手写最小循环建立直觉，再迁移到成熟框架。`,
  refsHeading: "参考来源（模拟数据）",
  refLabel: (t, kind) =>
    kind === 1 ? `${t} 官方文档` : kind === 2 ? `${t} 入门指南` : `${t} 工程实践`,
};

/* --------------------------------- English copy --------------------------------- */

export const EN: SandboxCopy = {
  locale: "en",
  crumbHome: "HOME",
  crumbHere: "Sandbox",
  simBadge: "⚠ SIMULATED DEMO 模拟演示",
  simCaptionPre:
    "Everything on this page is a front-end template replay — no real model or network API is called. To run it for real, go to the ",
  simCaptionLink: "Capstone tutorial",
  simCaptionPost: ".",
  h1a: "Watch an Agent ",
  h1b: "Run",
  leadA:
    "This is the Personal Research Assistant you'll build in the Capstone. Enter a topic and watch it loop — ",
  leadB: "Think → Act → Observe → Think again",
  leadC: " — until it delivers a mini research report with citations.",
  badgeReact: "REACT · ARXIV:2210.03629",
  badgeCapstone: "SAME PROJECT AS CAPSTONE",
  workbenchTitle: "research-assistant — simulated run",
  phases: ["Input", "Plan", "Search", "Read", "Write"],
  pause: "⏸ Pause",
  resume: "▶ Resume",
  replay: "↻ Replay",
  stepMode: "Step",
  nextStep: "Next →",
  stepProgress: (done, total) => `${done} / ${total}`,
  inputPlaceholder: "Enter a research topic, e.g. LangGraph vs OpenAI Agents SDK",
  run: "▶ Run",
  presetLabel: "Or pick a preset topic:",
  terminalTab: "TERMINAL",
  reportTab: "REPORT",
  reportLockedHint: "Once the write phase begins, the report will stream in here, section by section.",
  terminalIdleHint: "# enter a topic and hit Run — tool-call logs stream here in real time",
  watermark: "SIMULATED",
  generatedBadge: "✓ Generated",
  download: "⬇ Download .md",
  backToLatest: "↓ Back to latest",
  confirmTitle: "Discard the current replay?",
  confirmCancel: "Cancel",
  confirmOk: "Discard & reset",
  running: "running…",
  simulatedNote: "(simulated results)",
  divider: (index, _phase, phaseEn) => `Phase ${index} · ${phaseEn}`,
  phaseEn: { plan: "PLAN", search: "SEARCH", read: "READ", write: "WRITE" },
  thoughtPlan: (t) =>
    `I need to research "${t}". The topic is broad, so I'll break it into 4 sub-questions, then search, read, and synthesize them one by one.`,
  thoughtSearch: "Plan complete. Starting with sub-question 1 to retrieve the latest sources.",
  thoughtRead:
    "The results look relevant. I'll fetch the two top-ranked pages, extract the body text, and compress it to avoid context explosion.",
  thoughtWrite:
    "I have enough information. I'll generate the report from a fixed skeleton: abstract → three sections → references, with citation numbers in each section.",
  thoughtCheck:
    "Checklist: ① has an abstract ✓ ② every section cites ≥1 source ✓ ③ citation numbers match the references ✓. Ready to deliver.",
  planObservationLabel: "Split into 4 sub-questions:",
  fetchObservation: (inTokens, outTokens) =>
    `extracted ${inTokens} tokens of body text → compressed to ${outTokens} tokens`,
  writeObservation: "report draft, 1,180 words",
  doneTitle: "✅ Report generated",
  doneFile: (slug) => `reports/${slug}.md`,
  doneDownload: "⬇ Download report",
  doneCapstone: "→ Build it for real (8-step tutorial)",
  writeOutline: ["Abstract", "Background & Definition", "Key Points", "Comparison & Conclusion"],
  s4Tag: "HOW IT WORKS",
  s4Title: "Is it real?",
  s4c1Title: "Which paper does this replay?",
  s4c1Body:
    "The Thought / Action / Observation entries on the left are a frame-by-frame match of a ReAct trace (arXiv:2210.03629) — same color language as the trace diagram on our Principles page.",
  s4c1Link: "Re-read the ReAct principle →",
  s4c2Title: "What does the real version look like?",
  s4c2Body:
    "Real terminal output looks like this: a real LLM, a real Tavily search API, and a Markdown report actually written to disk.",
  s4c2Link: "Full 8-step tutorial, all real code →",
  s4c3Title: "How is this sandbox built?",
  s4c3Body:
    "No model, no API — just a choreographed script plus a typewriter effect. The truly magical part (LLM reasoning) is wired up by you in the tutorial.",
  s5TitleA: "Simulation ends here — ",
  s5TitleB: "go build a real one",
  s5Sub: "8 steps, all runnable real code: a real LLM, a real search API, a report really saved to disk.",
  s5Primary: "Start the 8-step Capstone →",
  s5Ghost: "Review first: the ReAct loop",
  presets: [
    {
      topic: "LangGraph vs OpenAI Agents SDK",
      template: {
        questions: [
          "What are the design philosophies of LangGraph and OpenAI Agents SDK?",
          "How do they differ in state management and orchestration models?",
          "How do ecosystem, learning curve, and production fit compare?",
          "Which one should a learner start with?",
        ],
        results: [
          { title: "LangGraph official docs", domain: "docs.example" },
          { title: "OpenAI Agents SDK quickstart", domain: "docs.example" },
          { title: "LangGraph vs Agents SDK: the orchestration debate", domain: "blog.example" },
          { title: "Agent framework selection guide (2025)", domain: "wiki.example" },
          { title: "From hand-rolled loops to frameworks", domain: "blog.example" },
        ],
        pages: [
          { url: "https://docs.example/langgraph", inTokens: "8,200", outTokens: "1,400" },
          { url: "https://docs.example/agents-sdk", inTokens: "6,700", outTokens: "1,150" },
        ],
        abstract:
          'Around "LangGraph vs OpenAI Agents SDK", this report searched 4 sub-questions and read 2 pages. Bottom line: LangGraph is a graph-based orchestration foundation with fine-grained control for complex, long-lived workflows; OpenAI Agents SDK is a lightweight wrapper that is quick to adopt for fast validation. Learners should hand-roll a minimal loop first, then migrate as needed.',
      },
    },
    {
      topic: "What problem does MCP solve",
      template: {
        questions: [
          "Before MCP, what were the pain points of app-tool integration?",
          "How do the three MCP layers (Host / Client / Server) divide responsibilities?",
          "What is the relationship between MCP and Function Calling?",
          "What does it cost to join the MCP ecosystem?",
        ],
        results: [
          { title: "MCP official documentation", domain: "docs.example" },
          { title: "MCP spec & versioning", domain: "spec.example" },
          { title: "The M×N integration nightmare without a standard", domain: "blog.example" },
          { title: "awesome-mcp-servers ecosystem list", domain: "hub.example" },
          { title: "Function Calling vs MCP", domain: "wiki.example" },
        ],
        pages: [
          { url: "https://docs.example/mcp", inTokens: "9,400", outTokens: "1,600" },
          { url: "https://spec.example/mcp-versioning", inTokens: "5,800", outTokens: "980" },
        ],
        abstract:
          'Around "What problem does MCP solve", this report searched 4 sub-questions and read 2 pages. Bottom line: MCP turns M×N private integrations between apps and tools into an M+N standard protocol — Clients inside a Host connect to Servers over stdio or Streamable HTTP. It complements rather than replaces Function Calling: one governs how a model picks tools, the other how tools are discovered and connected.',
      },
    },
    {
      topic: "ReAct vs Reflexion",
      template: {
        questions: [
          "How does the ReAct Thought-Action-Observation loop work?",
          "What is Reflexion's self-reflection mechanism?",
          "How do they differ in memory use and suitable tasks?",
          "Can ReAct and Reflexion be combined?",
        ],
        results: [
          { title: "ReAct paper explained (arXiv:2210.03629)", domain: "blog.example" },
          { title: "Reflexion paper abstract", domain: "wiki.example" },
          { title: "Reasoning + acting: a ReAct field guide", domain: "docs.example" },
          { title: "Evaluation results for self-reflective agents", domain: "journal.example" },
          { title: "ReAct vs Reflexion: how to choose", domain: "blog.example" },
        ],
        pages: [
          { url: "https://blog.example/react-explained", inTokens: "7,600", outTokens: "1,300" },
          { url: "https://wiki.example/reflexion", inTokens: "6,100", outTokens: "1,050" },
        ],
        abstract:
          'Around "ReAct vs Reflexion", this report searched 4 sub-questions and read 2 pages. Bottom line: ReAct interleaves reasoning and acting at every step — thinking while doing; Reflexion writes a verbal self-critique after an attempt and stores it in memory — improving across attempts. They are orthogonal: a common combo is ReAct as the execution loop with Reflexion as the outer review.',
      },
    },
  ],
  generic: (t) => ({
    questions: [
      `What is the background and core definition of "${t}"?`,
      `What key technologies or components does "${t}" involve?`,
      `What mainstream approaches or views on "${t}" exist, and how do they compare?`,
      `What practical experience and advice exist around "${t}"?`,
    ],
    results: [
      { title: `${t} official docs`, domain: "docs.example" },
      { title: `${t} getting-started guide`, domain: "blog.example" },
      { title: `${t} deep dive`, domain: "wiki.example" },
      { title: `${t} engineering practices`, domain: "dev.example" },
      { title: `${t} FAQ`, domain: "forum.example" },
    ],
    pages: [
      { url: `https://docs.example/${slugify(t)}`, inTokens: "8,200", outTokens: "1,400" },
      { url: `https://blog.example/${slugify(t)}-intro`, inTokens: "6,400", outTokens: "1,100" },
    ],
  }),
  reportDisclaimer1:
    "⚠️ This report was generated by the sandbox simulation. All content and citations are demo data, for understanding agent workflows only.",
  reportDisclaimer2: "Build the real version: /en/capstone",
  reportTitleSuffix: "Mini Research Report",
  abstractHeading: "Abstract",
  genericAbstract: (t) =>
    `Around "${t}", this report ran a quick survey across background & definition, key points, and comparative conclusions — 4 sub-questions searched, 2 pages read, structured findings below.`,
  sec1Heading: "1. Background & Definition",
  sec1Body: (t) =>
    `${t} is a key topic in today's AI agent landscape. [1] Starting from the official definition, the core problem it solves is: moving models from "single-shot Q&A" to "multi-step autonomous task completion". [2]`,
  sec2Heading: "2. Key Points",
  sec2Bullets: (t) => [
    `Architecture: ${t} involves coordination of planning, memory, and tool use [1]`,
    `Engineering: explicit loop control and observability are required [3]`,
    `Evaluation: success rate and token cost must be weighed together [2]`,
  ],
  sec3Heading: "3. Comparison & Conclusion",
  sec3Body: (t) =>
    `Across the sources, there are two mainstream paths for ${t}: lightweight wrappers first (fast validation) vs orchestration foundations first (long-term evolution). [1][3] For learners, hand-roll a minimal loop to build intuition, then migrate to mature frameworks.`,
  refsHeading: "References (simulated)",
  refLabel: (t, kind) =>
    kind === 1 ? `${t} official docs` : kind === 2 ? `${t} getting-started guide` : `${t} engineering practices`,
};

export function getCopy(locale: Locale): SandboxCopy {
  return locale === "en" ? EN : ZH;
}
