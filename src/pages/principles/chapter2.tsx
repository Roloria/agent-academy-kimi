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
  { name: "ReAct", desc: "推理与行动交错：想—做—看—再想", arxiv: "2210.03629", anchor: "#react" },
  { name: "Plan-and-Execute", desc: "先规划、后执行，必要时重规划", arxiv: "2305.04091", anchor: "#plan-and-execute" },
  { name: "Reflexion", desc: "失败后写「错题本」，语言化反思", arxiv: "2303.11366", anchor: "#reflexion" },
  { name: "思维链 CoT", desc: "把草稿纸摊开，一步步推理", arxiv: "2201.11903", anchor: "#cot" },
];

export default function ChapterReasoning() {
  return (
    <section aria-label="第二章 核心推理范式" className="mt-24">
      <ChapterHeading id="reasoning" index={2} title="核心推理范式" />

      <p className="text-body-lg text-text-secondary">
        Agent 的"思考"并不是玄学。研究者们提出了几种可复用的推理范式——它们决定了模型如何拆解问题、何时行动、如何从失败中恢复。以下四个范式是几乎所有现代
        Agent 系统的底层积木。
      </p>

      {/* 范式导航小卡 */}
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
      <SubHeading id="react" index="2.1" title="ReAct：Thought–Action–Observation 循环" />
      <Explain>
        让模型像侦探办案一样工作——先"想"（写下推理：我现在知道什么、缺什么），再"做"（采取行动：搜索、查询、执行代码），然后"看"（观察行动结果），带着新线索继续下一轮思考。论文
        ReAct（Yao et al., ICLR 2023, arXiv:2210.03629）首次系统提出将推理（Reasoning）与行动（Acting）交错进行，在
        HotpotQA、FEVER 等任务上显著优于纯推理或纯行动方法。
      </Explain>
      <PaperLine>
        <span>ReAct · Yao et al., ICLR 2023</span>
        <ArxivBadge id="2210.03629" />
      </PaperLine>

      <Figure
        src="/diagram-react-trace.svg"
        alt="ReAct 轨迹时间线：三个回合的 Thought、Action、Observation 卡片交错连接成循环"
        caption={
          <>
            <span style={{ color: SEMANTIC.plan }}>Thought（琥珀）</span>
            {" → "}
            <span style={{ color: SEMANTIC.tool }}>Action（绿）</span>
            {" → "}
            <span style={{ color: SEMANTIC.perceive }}>Observation（青）</span>
            ，交错进行，回合之间回到思考
          </>
        }
      />

      <CodeBlock code={REACT_TRACE} language="text" filename="react-trace.txt" type="terminal" />

      <KeyPoints
        items={[
          <>三大组件：Thought（语言化推理）、Action（对环境的操作）、Observation（环境反馈）。</>,
          <>推理轨迹写入上下文，使 Agent 行为可解释、可调试。</>,
          <>局限：轨迹增长占用上下文窗口；错误 Thought 可能级联，需要反思机制补救。</>,
        ]}
      />

      {/* 2.2 Plan-and-Execute */}
      <SubHeading id="plan-and-execute" index="2.2" title="Plan-and-Execute：先规划、后执行" />
      <Explain>
        ReAct 像"边走边看地图"，Plan-and-Execute 像"出门前先把全程路线画好"。Planner
        先把目标拆成完整的多步计划，Executor 逐步执行，必要时 Re-planner
        根据中间结果修订计划。这一模式源自 BabyAGI 等早期自主 Agent 实践，学术上
        Plan-and-Solve Prompting（Wang et al., ACL 2023,
        arXiv:2305.04091）验证了"先规划再求解"对零样本推理的提升。
      </Explain>
      <PaperLine>
        <span>源自 BabyAGI 等早期实践 · Plan-and-Solve Prompting（Wang et al., ACL 2023）</span>
        <ArxivBadge id="2305.04091" />
      </PaperLine>

      <div className="mt-8">
        <CodeBlock code={PLAN_EXECUTE_CODE} language="python" filename="plan-and-execute.py" />
      </div>

      <KeyPoints
        items={[
          <>优点：全局目标感强、长任务不易偏航、各步骤可用不同模型/工具。</>,
          <>缺点：前期规划开销大；环境变化快时计划易失效，需重规划（Re-planning）。</>,
          <>工程实践：LangChain/LangGraph 提供 Plan-and-Execute 参考实现。</>,
        ]}
      />

      {/* 2.3 Reflexion */}
      <SubHeading id="reflexion" index="2.3" title="Reflexion：反思机制" />
      <Explain>
        人类考试失利后会写错题本，Reflexion（Shinn et al., NeurIPS 2023,
        arXiv:2303.11366）就是让 Agent 失败后"写错题本"：对失败的轨迹生成语言化的自我反思（"我刚才错在没检查边界条件"），存入记忆，下一次尝试时带着这条经验重来。它用
        <strong className="font-bold text-text-primary">语言强化</strong>
        替代参数更新，不改模型权重也能实现"试错学习"。
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
          <>三角色：Actor（执行）、Evaluator（评估结果）、Self-Reflection（生成反思文本存入情景记忆）。</>,
          <>在 HumanEval 代码生成、ALFWorld 决策任务上相对基线有显著提升。</>,
          <>关键前提：存在可靠的评估信号（如单元测试、环境奖励），否则反思可能"瞎总结"。</>,
        ]}
      />

      {/* 2.4 CoT */}
      <SubHeading id="cot" index="2.4" title="Chain-of-Thought 与 Agent 的关系" />
      <Explain>
        思维链（Chain-of-Thought, Wei et al., NeurIPS 2022,
        arXiv:2201.11903）是让模型"把草稿纸摊开"，一步步推理再下结论。CoT 解决的是
        <strong className="font-bold text-text-primary">单次回答内部的推理质量</strong>
        问题；而 Agent 范式（如 ReAct）把 CoT 嵌进
        <strong className="font-bold text-text-primary">多轮循环</strong>
        中，让每一步推理都能触发行动、吸收新信息。可以说：CoT 是 Agent 的"思维单元"，Agent 是"CoT +
        行动 + 反馈"的系统化升级——CoT 想得更清楚，Agent 想完之后还能动手去验证和改变现实。
      </Explain>
      <PaperLine>
        <span>CoT · Wei et al., NeurIPS 2022</span>
        <ArxivBadge id="2201.11903" />
      </PaperLine>

      {/* 关系图解：CoT → + 行动 + 反馈 → Agent */}
      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 rounded-xl border border-c-plan/30 bg-c-plan/5 px-4 py-4 text-center">
          <p className="font-mono text-body-sm font-semibold text-c-plan">CoT</p>
          <p className="mt-1 text-caption text-text-tertiary">思维单元</p>
        </div>
        <span aria-hidden className="text-center font-mono text-text-tertiary">
          →
        </span>
        <div className="flex-1 rounded-xl border border-c-tool/30 bg-c-tool/5 px-4 py-4 text-center">
          <p className="font-mono text-body-sm font-semibold text-c-tool">+ 行动 + 反馈</p>
          <p className="mt-1 text-caption text-text-tertiary">多轮循环</p>
        </div>
        <span aria-hidden className="text-center font-mono text-text-tertiary">
          →
        </span>
        <div className="flex-1 rounded-xl border border-c-perceive/30 bg-c-perceive/5 px-4 py-4 text-center">
          <p className="font-mono text-body-sm font-semibold text-c-perceive">Agent</p>
          <p className="mt-1 text-caption text-text-tertiary">系统化升级</p>
        </div>
      </div>

      <KeyPoints
        items={[
          <>CoT：单轮内显式中间推理步骤；ReAct = CoT 与行动交错的多轮扩展。</>,
          <>推理范式可组合：Plan-and-Execute 的 Executor 内部常用 ReAct，ReAct 失败后可叠加 Reflexion。</>,
        ]}
      />
    </section>
  );
}
