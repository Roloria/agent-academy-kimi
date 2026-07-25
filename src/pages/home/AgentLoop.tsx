import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eye, Lightbulb, Database, Wrench, Zap } from "lucide-react";
import { Quote } from "@/components/ui-extra";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * S2. Agent 循环图解 —— pinned 150vh，滚动进度逐步点亮五个节点
 */
const STEPS = [
  {
    id: "01",
    name: "感知 Perception",
    en: "PERCEPTION",
    color: "#38BDF8",
    icon: Eye,
    desc: "接收用户指令、工具返回结果与环境状态，作为模型输入。",
  },
  {
    id: "02",
    name: "规划 Planning",
    en: "PLANNING",
    color: "#FBBF24",
    icon: Lightbulb,
    desc: "分解目标、制定步骤、自我反思与纠错。",
  },
  {
    id: "03",
    name: "记忆 Memory",
    en: "MEMORY",
    color: "#A78BFA",
    icon: Database,
    desc: "短期记忆保存会话上下文，长期记忆跨会话存储知识。",
  },
  {
    id: "04",
    name: "工具 Tools",
    en: "TOOLS",
    color: "#34D399",
    icon: Wrench,
    desc: "函数调用、API、代码执行、搜索等外部能力。",
  },
  {
    id: "05",
    name: "行动 Action",
    en: "ACTION",
    color: "#F472B6",
    icon: Zap,
    desc: "输出结构化指令执行工具或回复用户，结果重新进入感知，形成闭环。",
  },
] as const;

export default function AgentLoop() {
  const root = useRef<HTMLElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0); // 0..5，已点亮的步骤数

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=150%",
          pin: true,
          onUpdate: (self) => {
            // 每 20% 进度点亮一步
            setActive(Math.min(5, Math.floor(self.progress * 5.999)));
          },
        });
      });
      // 移动端：不 pin，全部点亮
      mm.add("(max-width: 1023px)", () => {
        setActive(5);
      });
    },
    { scope: root },
  );

  const current = STEPS[Math.max(0, active - 1)] ?? STEPS[0];
  const allDone = active >= 5;

  return (
    <section id="what-is-agent" ref={root} className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <div className="grid items-start gap-12 lg:grid-cols-12">
          {/* 左侧文字列 */}
          <div className="lg:col-span-5">
            {/* 章节标签（随 pinned 进度翻牌） */}
            <div className="mb-6 h-[30px] overflow-hidden">
              <div
                key={current.id}
                className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-xs uppercase tracking-[0.12em]"
                style={{
                  color: current.color,
                  borderColor: `${current.color}4D`,
                  backgroundColor: `${current.color}1A`,
                  animation: "loopTagIn 250ms ease-out",
                }}
              >
                {current.id} · {current.name.split(" ")[0]} {current.en}
              </div>
            </div>

            <h2 className="text-h2 font-bold text-text-primary">
              如果说 LLM 是只会说话的大脑，Agent 就是给它装上
              <span className="text-c-perceive">眼睛、手脚和笔记本</span>
            </h2>

            {/* 五个步骤条目 */}
            <div className="mt-10 flex gap-4 max-lg:snap-x max-lg:overflow-x-auto max-lg:pb-4 lg:flex-col lg:gap-0 lg:space-y-2">
              {STEPS.map((s, i) => {
                const on = i < active;
                const Icon = s.icon;
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "relative min-w-[240px] rounded-r-xl py-3 pl-5 pr-3 transition-all duration-500 max-lg:snap-start max-lg:rounded-xl max-lg:border max-lg:border-border-subtle max-lg:bg-bg-1 max-lg:p-4",
                      on ? "opacity-100" : "opacity-30 translate-y-2",
                    )}
                  >
                    <span
                      className="absolute left-0 top-1/2 h-[70%] w-[3px] -translate-y-1/2 rounded-full transition-all duration-500 max-lg:hidden"
                      style={{ background: on ? s.color : "transparent" }}
                    />
                    <div className="flex items-center gap-2.5">
                      <span
                        className="rounded-lg border p-1.5"
                        style={{
                          color: s.color,
                          borderColor: `${s.color}4D`,
                          backgroundColor: `${s.color}14`,
                        }}
                      >
                        <Icon size={16} />
                      </span>
                      <h4 className="text-h4 font-medium text-text-primary">{s.name}</h4>
                    </div>
                    <p className="mt-1.5 text-body-sm text-text-secondary">{s.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <Quote cite="Anthropic《Building Effective Agents》">
                工作流是"人写好的剧本"，Agent 是"模型即兴发挥的演员"。
              </Quote>
            </div>
          </div>

          {/* 右侧大图（sticky 驻留） */}
          <div className="lg:col-span-7">
            <div
              ref={imgWrap}
              className="relative lg:sticky lg:top-24"
              style={{ perspective: "800px" }}
            >
              {/* 节点语义色光晕（随进度切换） */}
              <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                  background: `radial-gradient(45% 45% at 50% 50%, ${current.color}14, transparent 70%)`,
                }}
                aria-hidden
              />
              <img
                src="/diagram-agent-loop.svg"
                alt="Agent 架构环形信息图：LLM 决策核心与感知、规划、记忆、工具、行动五节点闭环"
                className="relative w-full transition-transform duration-700"
                style={{
                  transform: allDone ? "scale(1.03)" : `scale(${1 + active * 0.012})`,
                  filter: `drop-shadow(0 0 ${12 + active * 6}px ${current.color}33)`,
                }}
              />
              <p className="mt-3 text-center font-mono text-caption text-text-tertiary">
                FIG.01 — 感知 → 规划 → 记忆 → 工具 → 行动，循环往复
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes loopTagIn { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
    </section>
  );
}
