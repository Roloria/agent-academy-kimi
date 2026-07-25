import CodeBlock from "@/components/CodeBlock";
import { Quote } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import {
  ChapterHeading,
  DefinitionCard,
  Explain,
  Figure,
  KeyPoints,
} from "./shared";

const AGENT_LOOP_CODE = `# Agent 主循环（最简伪代码）
def agent_loop(goal):
    memory = [system_prompt, goal]          # 初始化上下文
    while not done:
        thought = llm.think(memory)         # 规划：决定下一步
        if thought.is_final_answer:         # 模型判断任务完成
            return thought.answer
        action = thought.chosen_action      # 选择工具与参数
        observation = execute(action)       # 行动：调用工具
        memory.append(thought, action, observation)  # 记忆更新，回到循环`;

const COMPARE_ROWS: { dim: string; chatbot: string; workflow: string; agent: string }[] = [
  { dim: "交互模式", chatbot: "一问一答", workflow: "固定流程自动执行", agent: "多步自主循环" },
  { dim: "决策权", chatbot: "无（只生成文本）", workflow: "人预先编排步骤", agent: "模型动态决定下一步" },
  { dim: "环境反馈", chatbot: "不感知", workflow: "按预设处理", agent: "每步观察结果并调整" },
  { dim: "适用场景", chatbot: "问答、闲聊", workflow: "流程确定、高频重复", agent: "目标明确但路径不确定的任务" },
];

const LOOP_PARTS: { name: string; en: string; color: string; desc: string }[] = [
  { name: "感知", en: "Perception", color: SEMANTIC.perceive, desc: "接收用户指令、工具返回结果、环境状态，作为模型输入。" },
  { name: "规划", en: "Planning", color: SEMANTIC.plan, desc: "分解目标、制定步骤、自我反思与纠错（见第 2 节）。" },
  { name: "记忆", en: "Memory", color: SEMANTIC.memory, desc: "短期记忆保存当前会话上下文，长期记忆跨会话存储知识（见第 3 节）。" },
  { name: "工具", en: "Tools", color: SEMANTIC.tool, desc: "函数调用、API、代码执行、搜索等（见第 4 节）。" },
  { name: "行动", en: "Action", color: SEMANTIC.loop, desc: "输出结构化指令执行工具或回复用户，结果重新进入感知，形成闭环。" },
];

export default function ChapterWhatIsAgent() {
  return (
    <section aria-label="第一章 什么是 AI Agent">
      <ChapterHeading id="what-is-agent" index={1} title="什么是 AI Agent" />

      <Explain>
        如果说大语言模型（LLM）是一个"只会说话的大脑"，那么 AI Agent
        就是给这个大脑装上了眼睛、手脚和笔记本：它能感知环境（读取信息）、拆解任务（规划）、记住做过的事（记忆）、调用外部工具（使用手），并在一个循环里反复"想—做—看结果—再想"，直到任务完成。关键区别在于
        <strong className="font-bold text-text-primary">自主性</strong>
        ：Agent 不是回答一次就结束，而是自己决定下一步做什么、什么时候停。
      </Explain>

      <DefinitionCard>
        <p className="text-body text-text-primary">
          AI Agent 是以 LLM 为决策核心、能够感知环境、自主规划并调用工具采取行动、通过多步循环达成目标的系统。
        </p>
        <p className="mt-4 font-mono text-body-sm leading-relaxed">
          <span className="text-text-tertiary">Agent = </span>
          <span style={{ color: SEMANTIC.perceive }}>LLM（大脑）</span>
          <span className="text-text-tertiary"> + </span>
          <span style={{ color: SEMANTIC.plan }}>规划（Planning）</span>
          <span className="text-text-tertiary"> + </span>
          <span style={{ color: SEMANTIC.memory }}>记忆（Memory）</span>
          <span className="text-text-tertiary"> + </span>
          <span style={{ color: SEMANTIC.tool }}>工具使用（Tool Use）</span>
        </p>
      </DefinitionCard>

      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">
        与 Chatbot / 工作流的区别
      </h4>
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full min-w-[640px] border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border-strong bg-bg-2 text-left">
              <th className="px-4 py-3 font-medium text-text-tertiary">维度</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Chatbot</th>
              <th className="px-4 py-3 font-medium text-text-secondary">工作流（Workflow）</th>
              <th className="bg-c-perceive/5 px-4 py-3 font-semibold text-c-perceive">Agent</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.dim} className="border-b border-border-subtle last:border-0">
                <td className="px-4 py-3 font-medium text-text-primary">{row.dim}</td>
                <td className="px-4 py-3 text-text-secondary">{row.chatbot}</td>
                <td className="px-4 py-3 text-text-secondary">{row.workflow}</td>
                <td className="bg-c-perceive/5 px-4 py-3 text-text-primary">{row.agent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <Quote cite="Anthropic《Building Effective Agents》">
          工作流是"人写好的剧本"，Agent 是"模型即兴发挥的演员"
        </Quote>
        <p className="mt-3 text-body-sm text-text-tertiary">
          Anthropic 在其工程博客中也明确区分：Workflow 由预定义代码路径编排 LLM
          和工具，Agent 则由 LLM 动态指导自身流程与工具使用。
        </p>
      </div>

      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">
        Agent 核心架构：感知—规划—记忆—工具—行动循环
      </h4>
      <ul className="space-y-3">
        {LOOP_PARTS.map((part) => (
          <li key={part.name} className="flex gap-3 text-body text-text-secondary">
            <span
              aria-hidden
              className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full"
              style={{ background: part.color, boxShadow: `0 0 8px ${part.color}66` }}
            />
            <span>
              <strong className="font-bold" style={{ color: part.color }}>
                {part.name}
              </strong>
              <span className="ml-1 font-mono text-caption text-text-tertiary">（{part.en}）</span>
              ：{part.desc}
            </span>
          </li>
        ))}
      </ul>

      <Figure
        src="/diagram-agent-loop.svg"
        alt="Agent 架构环形信息图：LLM 决策核心居中，感知、规划、记忆、工具、行动五个节点围成闭环"
        caption="感知—规划—记忆—工具—行动闭环"
      />

      <CodeBlock code={AGENT_LOOP_CODE} language="python" filename="agent-loop.py" />

      <KeyPoints
        items={[
          <>Agent 的本质是"LLM + 循环 + 工具 + 反馈"，循环让模型具备多步自主性。</>,
          <>
            判断一个系统是不是 Agent，看"下一步做什么"由谁决定：代码决定 =
            工作流；模型决定 = Agent。
          </>,
          <>
            自主性越强，可控性与成本风险越大，工程中常在两者之间权衡（如限定最大步数、审批关键操作）。
          </>,
        ]}
      />
    </section>
  );
}
