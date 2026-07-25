import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Eye, Lightbulb, Database, Wrench, Zap } from "lucide-react";
import { Quote } from "@/components/ui-extra";
import { cn } from "@/lib/utils";
import { SEMANTIC, semanticAlpha } from "@/lib/semantic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * S2. Agent loop diagram — pinned at 150vh, scroll progress lights up five nodes
 */
const STEPS = [
  {
    id: "01",
    name: "Perception",
    en: "PERCEPTION",
    color: SEMANTIC.perceive,
    icon: Eye,
    desc: "Receives user instructions, tool results and environment state as model input.",
  },
  {
    id: "02",
    name: "Planning",
    en: "PLANNING",
    color: SEMANTIC.plan,
    icon: Lightbulb,
    desc: "Breaks down goals, plans steps, self-reflects and self-corrects.",
  },
  {
    id: "03",
    name: "Memory",
    en: "MEMORY",
    color: SEMANTIC.memory,
    icon: Database,
    desc: "Short-term memory keeps the conversation context; long-term memory stores knowledge across sessions.",
  },
  {
    id: "04",
    name: "Tools",
    en: "TOOLS",
    color: SEMANTIC.tool,
    icon: Wrench,
    desc: "External capabilities such as function calling, APIs, code execution and search.",
  },
  {
    id: "05",
    name: "Action",
    en: "ACTION",
    color: SEMANTIC.loop,
    icon: Zap,
    desc: "Emits structured instructions to run tools or reply to the user; the results re-enter perception, closing the loop.",
  },
] as const;

export default function AgentLoop() {
  const root = useRef<HTMLElement>(null);
  const imgWrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0); // 0..5, number of lit steps

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
            // Light one step per 20% of progress
            setActive(Math.min(5, Math.floor(self.progress * 5.999)));
          },
        });
      });
      // Mobile: no pin, everything lit
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
          {/* Left text column */}
          <div className="lg:col-span-5">
            {/* Section tag (flips with pinned progress) */}
            <div className="mb-6 h-[30px] overflow-hidden">
              <div
                key={current.id}
                className="inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-xs uppercase tracking-[0.12em]"
                style={{
                  color: current.color,
                  borderColor: semanticAlpha(current.color, 30),
                  backgroundColor: semanticAlpha(current.color, 10),
                  animation: "loopTagIn 250ms ease-out",
                }}
              >
                {current.id} · {current.en}
              </div>
            </div>

            <h2 className="text-h2 font-bold text-text-primary">
              If an LLM is a brain that can only talk, an Agent gives it{" "}
              <span className="text-c-perceive">eyes, hands and a notebook</span>
            </h2>

            {/* Five step entries */}
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
                          borderColor: semanticAlpha(s.color, 30),
                          backgroundColor: semanticAlpha(s.color, 8),
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
              <Quote cite='Anthropic, "Building Effective Agents"'>
                Workflows are scripts written by humans; agents are actors
                improvising with the model.
              </Quote>
            </div>
          </div>

          {/* Right large diagram (sticky) */}
          <div className="lg:col-span-7">
            <div
              ref={imgWrap}
              className="relative lg:sticky lg:top-24"
              style={{ perspective: "800px" }}
            >
              {/* Semantic-color glow of the current node (follows progress) */}
              <div
                className="absolute inset-0 transition-all duration-700"
                style={{
                  background: `radial-gradient(45% 45% at 50% 50%, ${semanticAlpha(current.color, 8)}, transparent 70%)`,
                }}
                aria-hidden
              />
              <img
                src="/diagram-agent-loop.svg"
                alt="Agent architecture ring diagram: the LLM decision core in a closed loop with five nodes — perception, planning, memory, tools and action"
                className="relative w-full transition-transform duration-700"
                style={{
                  transform: allDone ? "scale(1.03)" : `scale(${1 + active * 0.012})`,
                  filter: `drop-shadow(0 0 ${12 + active * 6}px ${semanticAlpha(current.color, 20)})`,
                }}
              />
              <p className="mt-3 text-center font-mono text-caption text-text-tertiary">
                FIG.01 — Perception → Planning → Memory → Tools → Action, on repeat
              </p>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes loopTagIn { from { transform: translateY(12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
    </section>
  );
}
