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

// Pseudocode kept verbatim from the zh edition (code comments stay in Chinese)
const SUPERVISOR_CODE = `# 监督者模式伪代码
def supervisor_loop(task):
    subtasks = supervisor.decompose(task)
    results = {}
    for sub in subtasks:
        worker = select_agent(sub.skill_needed)   # 分配给专业 Agent
        results[sub.id] = worker.run(sub)
    return supervisor.synthesize(results)`;

const PATTERNS: { name: string; zh: string; oneline: string; trait: string }[] = [
  {
    name: "Supervisor / Orchestrator",
    zh: "监督者模式",
    oneline: "A central Agent decomposes the task, dispatches it to specialized sub-Agents and synthesizes the results.",
    trait: "Clear structure, easy to control — the most commonly used pattern in engineering.",
  },
  {
    name: "Hierarchical",
    zh: "层级模式",
    oneline: "Multi-layer management: the top sets strategy, the middle decomposes, the bottom executes.",
    trait: "Suits large, complex tasks (e.g. simulating a software company).",
  },
  {
    name: "Debate",
    zh: "辩论模式",
    oneline: "Multiple Agents challenge each other on the same problem and converge after several rounds of exchange.",
    trait: "Can improve reasoning accuracy and reduce hallucination.",
  },
  {
    name: "Swarm / Society",
    zh: "群体 / 社会模式",
    oneline: "Many peer Agents interact autonomously, with emergent collective behavior.",
    trait: "Often used for social simulation and research.",
  },
];

export default function ChapterMultiAgent() {
  return (
    <section aria-label="Chapter 5: Multi-Agent Systems" className="mt-24">
      <ChapterHeading id="multi-agent" index={5} title="Multi-Agent Systems" color={SEMANTIC.loop} />

      <Explain>
        A single Agent has limited ability — just as one person can hardly be a great product
        manager, programmer and tester at the same time. A multi-agent system lets multiple Agents
        with clearly divided roles &ldquo;talk&rdquo; to each other and collaborate: some draft
        plans, some write code, some find faults. The hard problem shifts from &ldquo;how smart is
        one model&rdquo; to &ldquo;how is the team organized&rdquo; — who directs whom, what to do
        when opinions clash, and how to avoid mutual flattery drifting off course.
      </Explain>

      <Figure
        src="/diagram-multi-agent.svg"
        alt="Topology diagram of four multi-agent collaboration patterns: supervisor, hierarchical, debate, swarm"
        caption="Four collaboration topologies: supervisor (star) / hierarchical (tree) / debate (back-and-forth) / swarm (network)"
      />

      {/* Four collaboration pattern cards */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">Major Collaboration Patterns</h4>
      <div className="grid gap-4 sm:grid-cols-2">
        {PATTERNS.map((p) => (
          <Card key={p.name} accent={SEMANTIC.loop}>
            <p className="text-body font-bold text-text-primary">{p.name}</p>
            <p className="font-mono text-caption tracking-[0.08em] text-c-loop">{p.zh}</p>
            <p className="mt-3 text-body-sm text-text-secondary">{p.oneline}</p>
            <p className="mt-2 border-t border-border-subtle pt-2 text-caption text-text-tertiary">
              {p.trait}
            </p>
          </Card>
        ))}
      </div>

      {/* Representative systems */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">Representative Systems</h4>
      <div className="space-y-4">
        <Card accent={SEMANTIC.loop} className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-body font-bold text-text-primary">AutoGen (Microsoft)</p>
            <ArxivBadge id="2308.08155" />
          </div>
          <p className="mt-2 text-body-sm text-text-secondary">
            Built around the &ldquo;conversable agent&rdquo; abstraction: all collaboration is
            modeled as message conversations between Agents. Developers flexibly orchestrate
            dialogue patterns with natural language + code, with human-in-the-loop support and tool
            execution; it later evolved into AutoGen AgentChat / Microsoft Agent Framework.
          </p>
        </Card>
        <Card accent={SEMANTIC.loop} className="p-5">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-body font-bold text-text-primary">CrewAI</p>
            <Badge color={SEMANTIC.loop}>Role-Task-Crew</Badge>
          </div>
          <p className="mt-2 text-body-sm text-text-secondary">
            Built around the Role–Task–Crew abstraction: each Agent has a role, a goal and a
            backstory; multiple Agents form a Crew that executes Tasks in sequential or
            hierarchical processes. Close to the &ldquo;virtual team&rdquo; intuition, with a low
            barrier to entry — well suited for business-process applications.
          </p>
        </Card>
      </div>

      <div className="mt-8">
        <CodeBlock code={SUPERVISOR_CODE} language="python" filename="supervisor.py" />
      </div>

      {/* Engineering opinion (flagged as experiential opinion) */}
      <div className="mt-10">
        <OpinionQuote>
          <Badge color={SEMANTIC.plan} className="mb-2">
            Engineering Opinion
          </Badge>
          <p>
            Multi-agent is no silver bullet: collaboration overhead (communication rounds, context
            bloat) drives up cost and latency — a single Agent with good tools is often enough.
          </p>
        </OpinionQuote>
      </div>

      <KeyPoints
        color={SEMANTIC.loop}
        items={[
          <>
            Role division and persona prompting are key to performance; explicit termination
            conditions and arbitration mechanisms prevent endless dialogue.
          </>,
          <>Evaluate multi-agent systems on both task success rate and token cost.</>,
        ]}
      />
    </section>
  );
}
