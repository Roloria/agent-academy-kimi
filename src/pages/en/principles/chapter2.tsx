import CodeBlock from "@/components/CodeBlock";
import { Card } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import {
  ArxivBadge,
  ChapterHeading,
  Explain,
  Figure,
  KeyPoints,
  PaperLine,
  SubHeading,
} from "./shared";

// Pseudocode / trace kept verbatim from the zh edition (code comments stay in Chinese)
const REACT_TRACE = `# ReAct 轨迹示例（HotpotQA 风格）
Thought 1: 我需要找出 Apple Remote 最初控制的设备。
Action 1: Search["Apple Remote"]
Observation 1: Apple Remote 是苹果公司推出的遥控器，最初设计用于控制 Front Row……
Thought 2: 它最初用于控制 Front Row，我需要查 Front Row 能控制什么设备。
Action 2: Search["Front Row"]
Observation 2: Front Row 可在 Mac 电脑上运行……
Thought 3: 答案是 Mac 电脑。
Action 3: Finish["Mac"]`;

const PLAN_EXECUTE_CODE = `# Plan-and-Execute 伪代码
plan = planner.make_plan(goal)            # 一次生成完整步骤列表
for step in plan:
    result = executor.run(step)           # 执行器逐步完成（内部可用 ReAct）
    if plan_needs_revision(result):
        plan = replanner.revise(goal, plan, result)`;

const REFLEXION_CODE = `# Reflexion 循环伪代码
for trial in range(max_trials):
    trajectory = react_agent.run(task, memory=reflections)
    score = evaluate(trajectory)          # 环境或启发式打分
    if score >= threshold:
        return trajectory.result
    reflections.append(reflector.reflect(trajectory))  # 生成语言化教训`;

const PARADIGMS: { name: string; desc: string; arxiv: string; anchor: string }[] = [
  { name: "ReAct", desc: "Reasoning and acting interleaved: think—act—observe—think again", arxiv: "2210.03629", anchor: "#react" },
  { name: "Plan-and-Execute", desc: "Plan first, execute next, re-plan when needed", arxiv: "2305.04091", anchor: "#plan-and-execute" },
  { name: "Reflexion", desc: "After failure, write an “error notebook” — verbalized reflection", arxiv: "2303.11366", anchor: "#reflexion" },
  { name: "Chain-of-Thought (CoT)", desc: "Lay the scratch paper out flat and reason step by step", arxiv: "2201.11903", anchor: "#cot" },
];

export default function ChapterReasoning() {
  return (
    <section aria-label="Chapter 2: Core Reasoning Paradigms" className="mt-24">
      <ChapterHeading id="reasoning" index={2} title="Core Reasoning Paradigms" />

      <p className="text-body-lg text-text-secondary">
        An Agent&rsquo;s &ldquo;thinking&rdquo; is not magic. Researchers have proposed several
        reusable reasoning paradigms — they determine how the model decomposes problems, when it
        acts, and how it recovers from failure. The four paradigms below are the underlying
        building blocks of almost every modern Agent system.
      </p>

      {/* Paradigm navigation cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PARADIGMS.map((p) => (
          <a key={p.name} href={p.anchor} className="block transition-transform hover:-translate-y-0.5">
            <Card accent={SEMANTIC.plan} className="h-full p-5">
              <p className="text-body font-bold text-text-primary">{p.name}</p>
              <p className="mt-1 text-body-sm text-text-secondary">{p.desc}</p>
              <span className="mt-3 inline-block font-mono text-caption tracking-[0.12em] text-text-tertiary">
                ARXIV:{p.arxiv}
              </span>
            </Card>
          </a>
        ))}
      </div>

      {/* 2.1 ReAct */}
      <SubHeading id="react" index="2.1" title="ReAct: The Thought–Action–Observation Loop" />
      <Explain>
        Make the model work like a detective on a case — first &ldquo;think&rdquo; (write down the
        reasoning: what do I know now, what is missing), then &ldquo;act&rdquo; (take an action:
        search, query, run code), then &ldquo;observe&rdquo; (look at the action&rsquo;s result),
        and carry the new clue into the next round of thinking. The ReAct paper (Yao et al., ICLR
        2023, arXiv:2210.03629) was the first to systematically interleave Reasoning and Acting,
        significantly outperforming pure-reasoning or pure-acting methods on tasks such as
        HotpotQA and FEVER.
      </Explain>
      <PaperLine>
        <span>ReAct · Yao et al., ICLR 2023</span>
        <ArxivBadge id="2210.03629" />
      </PaperLine>

      <Figure
        src="/diagram-react-trace.svg"
        alt="ReAct trace timeline: three rounds of Thought, Action and Observation cards interleaved into a loop"
        caption={
          <>
            <span style={{ color: SEMANTIC.plan }}>Thought (amber)</span>
            {" → "}
            <span style={{ color: SEMANTIC.tool }}>Action (green)</span>
            {" → "}
            <span style={{ color: SEMANTIC.perceive }}>Observation (cyan)</span>
            , interleaved, returning to thought between rounds
          </>
        }
      />

      <CodeBlock code={REACT_TRACE} language="text" filename="react-trace.txt" type="terminal" />

      <KeyPoints
        items={[
          <>Three components: Thought (verbalized reasoning), Action (operations on the environment), Observation (environment feedback).</>,
          <>Reasoning traces are written into the context, making Agent behavior interpretable and debuggable.</>,
          <>Limitation: growing traces consume the context window; a wrong Thought can cascade, and needs a reflection mechanism to recover.</>,
        ]}
      />

      {/* 2.2 Plan-and-Execute */}
      <SubHeading id="plan-and-execute" index="2.2" title="Plan-and-Execute: Plan First, Execute Next" />
      <Explain>
        ReAct is like &ldquo;checking the map as you walk&rdquo;; Plan-and-Execute is like
        &ldquo;drawing the full route before leaving home&rdquo;. The Planner first decomposes the
        goal into a complete multi-step plan, the Executor runs it step by step, and a Re-planner
        revises the plan from intermediate results when needed. This pattern comes from early
        autonomous-Agent practice such as BabyAGI; academically, Plan-and-Solve Prompting (Wang et
        al., ACL 2023, arXiv:2305.04091) validated that &ldquo;plan first, then solve&rdquo;
        improves zero-shot reasoning.
      </Explain>
      <PaperLine>
        <span>Originating in early practice such as BabyAGI · Plan-and-Solve Prompting (Wang et al., ACL 2023)</span>
        <ArxivBadge id="2305.04091" />
      </PaperLine>

      <div className="mt-8">
        <CodeBlock code={PLAN_EXECUTE_CODE} language="python" filename="plan-and-execute.py" />
      </div>

      <KeyPoints
        items={[
          <>Strengths: strong global goal awareness, long tasks stay on track, and each step can use a different model/tool.</>,
          <>Weaknesses: high upfront planning cost; plans go stale quickly in fast-changing environments and need re-planning.</>,
          <>Engineering practice: LangChain/LangGraph provide reference Plan-and-Execute implementations.</>,
        ]}
      />

      {/* 2.3 Reflexion */}
      <SubHeading id="reflexion" index="2.3" title="Reflexion: The Reflection Mechanism" />
      <Explain>
        After failing an exam, humans write an error notebook. Reflexion (Shinn et al., NeurIPS
        2023, arXiv:2303.11366) lets an Agent do the same after failure: generate a verbalized
        self-reflection over the failed trajectory (&ldquo;my mistake was not checking the boundary
        condition&rdquo;), store it in memory, and retry with that lesson in hand. It replaces
        parameter updates with{" "}
        <strong className="font-bold text-text-primary">verbal reinforcement</strong>, achieving
        trial-and-error learning without changing model weights.
      </Explain>
      <PaperLine>
        <span>Reflexion · Shinn et al., NeurIPS 2023</span>
        <ArxivBadge id="2303.11366" />
      </PaperLine>

      <div className="mt-8">
        <CodeBlock code={REFLEXION_CODE} language="python" filename="reflexion.py" />
      </div>

      <KeyPoints
        items={[
          <>Three roles: Actor (executes), Evaluator (scores the outcome), Self-Reflection (produces reflection text stored in episodic memory).</>,
          <>Significant gains over baselines on HumanEval code generation and ALFWorld decision-making tasks.</>,
          <>
            Key prerequisite: a reliable evaluation signal (e.g. unit tests, environment rewards) —
            otherwise reflections may &ldquo;summarize nonsense&rdquo;.
          </>,
        ]}
      />

      {/* 2.4 CoT */}
      <SubHeading id="cot" index="2.4" title="Chain-of-Thought and Its Relationship to Agents" />
      <Explain>
        Chain-of-Thought (CoT, Wei et al., NeurIPS 2022, arXiv:2201.11903) makes the model
        &ldquo;lay its scratch paper out flat&rdquo; — reasoning step by step before concluding.
        CoT solves the problem of{" "}
        <strong className="font-bold text-text-primary">reasoning quality within a single answer</strong>;
        Agent paradigms such as ReAct embed CoT into a{" "}
        <strong className="font-bold text-text-primary">multi-turn loop</strong>, so each step of
        reasoning can trigger an action and absorb new information. In short: CoT is the
        Agent&rsquo;s &ldquo;unit of thought&rdquo;; an Agent is the systematic upgrade of
        &ldquo;CoT + action + feedback&rdquo; — CoT thinks more clearly, and an Agent can verify
        and change reality after thinking.
      </Explain>
      <PaperLine>
        <span>CoT · Wei et al., NeurIPS 2022</span>
        <ArxivBadge id="2201.11903" />
      </PaperLine>

      {/* Relationship diagram: CoT → + action + feedback → Agent */}
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-xl border border-c-plan/30 bg-c-plan/5 px-4 py-4 text-center">
          <p className="font-mono text-body-sm font-semibold text-c-plan">CoT</p>
          <p className="mt-1 text-caption text-text-tertiary">unit of thought</p>
        </div>
        <span aria-hidden className="text-center font-mono text-text-tertiary">
          →
        </span>
        <div className="flex-1 rounded-xl border border-c-tool/30 bg-c-tool/5 px-4 py-4 text-center">
          <p className="font-mono text-body-sm font-semibold text-c-tool">+ Action + Feedback</p>
          <p className="mt-1 text-caption text-text-tertiary">multi-turn loop</p>
        </div>
        <span aria-hidden className="text-center font-mono text-text-tertiary">
          →
        </span>
        <div className="flex-1 rounded-xl border border-c-perceive/30 bg-c-perceive/5 px-4 py-4 text-center">
          <p className="font-mono text-body-sm font-semibold text-c-perceive">Agent</p>
          <p className="mt-1 text-caption text-text-tertiary">systematic upgrade</p>
        </div>
      </div>

      <KeyPoints
        items={[
          <>CoT: explicit intermediate reasoning steps within a single turn; ReAct = the multi-turn extension interleaving CoT with actions.</>,
          <>Paradigms compose: a Plan-and-Execute Executor often runs ReAct internally, and Reflexion can be layered on after ReAct fails.</>,
        ]}
      />
    </section>
  );
}
