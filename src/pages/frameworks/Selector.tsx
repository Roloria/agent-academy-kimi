import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Factory, FlaskConical, GraduationCap, Puzzle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading, OpinionQuote } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import { SELECTOR_TABS } from "./data";
import { scrollToId } from "./utils";

const TAB_ICONS: Record<string, LucideIcon> = {
  beginner: GraduationCap,
  production: Factory,
  research: FlaskConical,
  lowcode: Puzzle,
};

/** S4. 选型向导：四场景 Tabs 决策面板 */
export default function Selector() {
  const [active, setActive] = useState(SELECTOR_TABS[0].key);
  const tab = SELECTOR_TABS.find((t) => t.key === active) ?? SELECTOR_TABS[0];

  return (
    <section id="selector" className="scroll-mt-24 bg-bg-1 py-24 max-md:py-16">
      <div className="mx-auto max-w-prose2 px-6 max-md:px-5">
        <SectionHeading
          tag="SELECTOR"
          tagColor={SEMANTIC.tool}
          title="按你的场景，直接给答案"
          lead="四个最常见的学习者场景，每个场景给出排序后的推荐与一句话理由。点击框架名可回看上方详情卡。"
        />

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="选型场景"
          className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-border-subtle"
        >
          {SELECTOR_TABS.map((t) => {
            const Icon = TAB_ICONS[t.key];
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActive(t.key)}
                className={cn(
                  "relative flex items-center gap-2 pb-3 text-body font-medium transition-colors duration-[250ms]",
                  isActive ? "text-c-tool" : "text-text-secondary hover:text-text-primary",
                )}
              >
                <Icon size={17} />
                {t.label}
                {isActive && (
                  <motion.span
                    layoutId="selector-tab-indicator"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-c-tool"
                    transition={{ duration: 0.25 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 内容：排序推荐列表 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="mb-6 text-body-sm text-text-tertiary">{tab.sub}</p>
            <ol className="space-y-4">
              {tab.items.map((item, i) => (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.07 }}
                  className="flex items-start gap-4 rounded-xl border border-border-subtle bg-bg-0 p-5"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18, delay: i * 0.07 }}
                    className="text-grad flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-2 font-nums text-base font-bold"
                  >
                    {i + 1}
                  </motion.span>
                  <div>
                    {item.target ? (
                      <button
                        type="button"
                        onClick={() => scrollToId(item.target!)}
                        className="text-left text-body font-semibold text-text-primary underline decoration-c-tool/50 decoration-dotted underline-offset-4 transition-colors hover:text-c-tool"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <p className="text-body font-semibold text-text-primary">{item.name}</p>
                    )}
                    <p className="mt-1 text-body-sm text-text-secondary">{item.reason}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
            {tab.footnote && (
              <div className="mt-6">
                <OpinionQuote>{tab.footnote}</OpinionQuote>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
