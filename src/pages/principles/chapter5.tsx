import CodeBlock from "@/components/CodeBlock";
import { Badge, Card, OpinionQuote } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import {
  ArxivBadge,
  ChapterHeading,
  Explain,
  Figure,
  KeyPoints,
} from "./shared";

const SUPERVISOR_CODE = `# 监督者模式伪代码
def supervisor_loop(task):
    subtasks = supervisor.decompose(task)
    results = {}
    for sub in subtasks:
        worker = select_agent(sub.skill_needed)   # 分配给专业 Agent
        results[sub.id] = worker.run(sub)
    return supervisor.synthesize(results)`;

const PATTERNS: { name: string; en: string; oneline: string; trait: string }[] = [
  {
    name: "监督者模式",
    en: "Supervisor / Orchestrator",
    oneline: "一个中心 Agent 分解任务、派发给专业子 Agent 并汇总结果。",
    trait: "结构清晰、易管控，是工程中最常用模式。",
  },
  {
    name: "层级模式",
    en: "Hierarchical",
    oneline: "多层管理，顶层管战略、中层管分解、底层执行。",
    trait: "适合大型复杂任务（如模拟软件公司）。",
  },
  {
    name: "辩论模式",
    en: "Debate",
    oneline: "多个 Agent 就同一问题互相质疑、多轮交锋后收敛。",
    trait: "可提高推理准确性与减少幻觉。",
  },
  {
    name: "群体 / 社会模式",
    en: "Swarm / Society",
    oneline: "大量对等 Agent 自主交互、涌现集体行为。",
    trait: "常用于社会模拟与研究。",
  },
];

export default function ChapterMultiAgent() {
  return (
    <section aria-label="第五章 多智能体系统" className="mt-24">
      <ChapterHeading id="multi-agent" index={5} title="多智能体系统" color={SEMANTIC.loop} />

      <Explain>
        单个 Agent
        能力有限，就像一个人难以同时当好产品经理、程序员和测试。多智能体系统（Multi-Agent
        System）让多个分工明确的 Agent
        互相"对话"协作：有的出方案、有的写代码、有的挑错。难点从"单个模型聪不聪明"变成"团队怎么组织"——谁指挥谁、意见不合怎么办、如何避免互相吹捧跑偏。
      </Explain>

      <Figure
        src="/diagram-multi-agent.svg"
        alt="多智能体四种协作模式拓扑图：监督者、层级、辩论、群体"
        caption="四种协作模式拓扑：监督者（星型）/ 层级（树形）/ 辩论（往返）/ 群体（网络）"
      />

      {/* 四种协作模式卡片 */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">主要协作模式</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        {PATTERNS.map((p) => (
          <Card key={p.name} accent={SEMANTIC.loop}>
            <p className="text-body font-bold text-text-primary">{p.name}</p>
            <p className="font-mono text-caption tracking-[0.08em] text-c-loop">{p.en}</p>
            <p className="mt-3 text-body-sm text-text-secondary">{p.oneline}</p>
            <p className="mt-2 border-t border-border-subtle pt-2 text-caption text-text-tertiary">
              {p.trait}
            </p>
          </Card>
        ))}
      </div>

      {/* 代表系统 */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">代表系统</h4>
      <div className="space-y-4">
        <Card accent={SEMANTIC.loop} className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-body font-bold text-text-primary">AutoGen（微软）</p>
            <ArxivBadge id="2308.08155" />
          </div>
          <p className="mt-2 text-body-sm text-text-secondary">
            以"可对话 Agent"为核心抽象，所有协作都被建模为 Agent
            间的消息会话。开发者用自然语言 +
            代码灵活编排对话模式，支持人机协同（Human-in-the-loop）与工具执行，后续演进为
            AutoGen AgentChat / Microsoft Agent Framework。
          </p>
        </Card>
        <Card accent={SEMANTIC.loop} className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-body font-bold text-text-primary">CrewAI</p>
            <Badge color={SEMANTIC.loop}>Role-Task-Crew</Badge>
          </div>
          <p className="mt-2 text-body-sm text-text-secondary">
            以"角色—任务—团队（Role-Task-Crew）"为抽象，每个 Agent
            有角色（role）、目标（goal）、背景故事（backstory），多个 Agent 组成 Crew
            按顺序或层级流程执行
            Tasks，贴近"虚拟团队"直觉，上手门槛低，适合业务流程类应用。
          </p>
        </Card>
      </div>

      <div className="mt-8">
        <CodeBlock code={SUPERVISOR_CODE} language="python" filename="supervisor.py" />
      </div>

      {/* 工程观点（经验性观点标注） */}
      <div className="mt-10">
        <OpinionQuote>
          <Badge color={SEMANTIC.plan} className="mb-2">
            工程观点
          </Badge>
          <p>
            多智能体不是银弹：协作开销（通信轮次、上下文膨胀）会推高成本与延迟，单 Agent +
            好工具常常已足够。
          </p>
        </OpinionQuote>
      </div>

      <KeyPoints
        color={SEMANTIC.loop}
        items={[
          <>
            分工与角色提示（persona
            prompting）是性能关键；明确的终止条件与裁决机制可防止无限对话。
          </>,
          <>评估多智能体系统要同时看任务成功率与 token 成本。</>,
        ]}
      />
    </section>
  );
}
