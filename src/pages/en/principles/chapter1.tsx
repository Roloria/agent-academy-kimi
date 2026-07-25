import CodeBlock from "@/components/CodeBlock";
import { Quote } from "@/components/ui-extra";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";
import {
  ChapterHeading,
  DefinitionCard,
  Explain,
  Figure,
  KeyPoints,
} from "./shared";

// Pseudocode kept verbatim from the zh edition (v1 fidelity rule: code comments stay in Chinese)
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
  { dim: "Interaction mode", chatbot: "One question, one answer", workflow: "A fixed pipeline executed automatically", agent: "A multi-step autonomous loop" },
  { dim: "Decision authority", chatbot: "None (only generates text)", workflow: "Humans pre-orchestrate the steps", agent: "The model dynamically decides the next step" },
  { dim: "Environmental feedback", chatbot: "Not perceived", workflow: "Handled per preset rules", agent: "Observes the result at every step and adjusts" },
  { dim: "Best for", chatbot: "Q&A, chit-chat", workflow: "Deterministic, high-frequency repetitive flows", agent: "Tasks with a clear goal but an uncertain path" },
];

const LOOP_PARTS: { name: string; zh: string; color: string; desc: string }[] = [
  { name: "Perception", zh: "感知", color: SEMANTIC.perceive, desc: "Receives user instructions, tool results and environment state as model input." },
  { name: "Planning", zh: "规划", color: SEMANTIC.plan, desc: "Breaks down goals, lays out steps, self-reflects and self-corrects (see Chapter 2)." },
  { name: "Memory", zh: "记忆", color: SEMANTIC.memory, desc: "Short-term memory keeps the current session context; long-term memory stores knowledge across sessions (see Chapter 3)." },
  { name: "Tools", zh: "工具", color: SEMANTIC.tool, desc: "Function calling, APIs, code execution, search and more (see Chapter 4)." },
  { name: "Action", zh: "行动", color: SEMANTIC.loop, desc: "Emits structured commands to run tools or reply to the user; results re-enter perception, closing the loop." },
];

export default function ChapterWhatIsAgent() {
  return (
    <section aria-label="Chapter 1: What Is an AI Agent">
      <ChapterHeading id="what-is-agent" index={1} title="What Is an AI Agent" />

      <Explain>
        If a large language model (LLM) is a &ldquo;brain that can only talk&rdquo;, then an AI
        Agent gives that brain eyes, hands, feet and a notebook: it can perceive its environment
        (read information), break down tasks (planning), remember what it has done (memory), call
        external tools (use its hands), and loop through &ldquo;think &mdash; act &mdash; observe
        &mdash; think again&rdquo; until the task is done. The key difference is{" "}
        <strong className="font-bold text-text-primary">autonomy</strong>: an Agent does not stop
        after a single answer — it decides for itself what to do next and when to stop.
      </Explain>

      <DefinitionCard>
        <p className="text-body text-text-primary">
          An AI Agent is a system that uses an LLM as its decision-making core: it perceives its
          environment, plans autonomously, takes action by calling tools, and achieves goals
          through a multi-step loop.
        </p>
        <p className="mt-4 font-mono text-body-sm leading-relaxed">
          <span className="text-text-tertiary">Agent = </span>
          <span style={{ color: SEMANTIC.perceive }}>LLM (brain)</span>
          <span className="text-text-tertiary"> + </span>
          <span style={{ color: SEMANTIC.plan }}>Planning</span>
          <span className="text-text-tertiary"> + </span>
          <span style={{ color: SEMANTIC.memory }}>Memory</span>
          <span className="text-text-tertiary"> + </span>
          <span style={{ color: SEMANTIC.tool }}>Tool Use</span>
        </p>
      </DefinitionCard>

      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">
        How It Differs from a Chatbot / Workflow
      </h4>
      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full min-w-[640px] border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-border-strong bg-bg-2 text-left">
              <th className="px-4 py-3 font-medium text-text-tertiary">Dimension</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Chatbot</th>
              <th className="px-4 py-3 font-medium text-text-secondary">Workflow</th>
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
        <Quote cite="Anthropic, Building Effective Agents">
          A workflow is a script written by humans; an Agent is an actor improvising under the
          model&rsquo;s direction
        </Quote>
        <p className="mt-3 text-body-sm text-text-tertiary">
          Anthropic draws the same line in its engineering blog: workflows orchestrate LLMs and
          tools through predefined code paths, while agents let the LLM dynamically direct its own
          process and tool usage.
        </p>
      </div>

      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">
        Core Architecture: Perception — Planning — Memory — Tools — Action Loop
      </h4>
      <ul className="space-y-3">
        {LOOP_PARTS.map((part) => (
          <li key={part.name} className="flex gap-3 text-body text-text-secondary">
            <span
              aria-hidden
              className="mt-[0.6em] h-2 w-2 shrink-0 rounded-full"
              style={{ background: part.color, boxShadow: `0 0 8px ${semanticAlpha(part.color, 40)}` }}
            />
            <span>
              <strong className="font-bold" style={{ color: part.color }}>
                {part.name}
              </strong>
              <span className="ml-1 font-mono text-caption text-text-tertiary">（{part.zh}）</span>
              : {part.desc}
            </span>
          </li>
        ))}
      </ul>

      <Figure
        src="/diagram-agent-loop.svg"
        alt="Agent architecture ring infographic: the LLM decision core in the center, with Perception, Planning, Memory, Tools and Action nodes forming a closed loop"
        caption="The Perception — Planning — Memory — Tools — Action loop"
      />

      <CodeBlock code={AGENT_LOOP_CODE} language="python" filename="agent-loop.py" />

      <KeyPoints
        items={[
          <>An Agent is essentially &ldquo;LLM + loop + tools + feedback&rdquo;; the loop is what gives the model multi-step autonomy.</>,
          <>
            To tell whether a system is an Agent, ask who decides &ldquo;what to do next&rdquo;:
            code decides = workflow; the model decides = Agent.
          </>,
          <>
            Greater autonomy means higher controllability and cost risks; engineering practice
            trades one off against the other (e.g. capping the max number of steps, requiring
            approval for critical operations).
          </>,
        ]}
      />
    </section>
  );
}
