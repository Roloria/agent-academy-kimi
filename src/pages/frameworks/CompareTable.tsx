import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { SectionHeading } from "@/components/ui-extra";
import { SEMANTIC, semanticStyle } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import { COMPARE_ROWS, type FilterKey } from "./data";
import { scrollToId } from "./utils";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "code", label: "代码框架" },
  { key: "lowcode", label: "低代码平台" },
  { key: "multi", label: "多智能体" },
  { key: "maintenance", label: "维护模式" },
  { key: "msft", label: "微软系" },
];

/** S2. 速览对比表（可筛选，点击行跳转详情卡） */
export default function CompareTable() {
  const [filter, setFilter] = useState<FilterKey>("all");

  const rows = useMemo(
    () => COMPARE_ROWS.filter((r) => filter === "all" || r.filters.includes(filter)),
    [filter],
  );

  return (
    <section id="compare" className="scroll-mt-24 py-24 max-md:py-16">
      <div className="mx-auto max-w-content px-6 max-md:px-5">
        <SectionHeading
          tag="COMPARE"
          tagColor={SEMANTIC.tool}
          title="十一框架速览对比"
          lead="点击任意一行，直达该框架的详情卡（含最小可运行示例）。"
        />

        {/* 筛选器 Chips */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-body-sm transition-all duration-[250ms]",
                  active
                    ? "border-c-tool bg-c-tool/15 font-medium text-c-tool"
                    : "border-border-subtle bg-bg-1 text-text-secondary hover:border-border-strong hover:text-text-primary",
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* 表格（移动端横向滚动） */}
        <motion.div
          className="overflow-x-auto rounded-2xl border border-border-subtle bg-bg-1"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <table className="w-full min-w-[960px] border-collapse text-left text-body-sm">
            <motion.thead
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <tr className="border-b border-border-strong bg-bg-2">
                {["框架", "语言", "出品方", "核心特点", "适合人群", "状态", "详情"].map((h) => (
                  <th
                    key={h}
                    className="sticky top-0 whitespace-nowrap bg-bg-2 px-4 py-3.5 font-mono text-caption font-medium uppercase tracking-[0.12em] text-text-tertiary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </motion.thead>
            <tbody>
              <AnimatePresence initial={false}>
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    onClick={() => scrollToId(r.target)}
                    className={cn(
                      "cursor-pointer border-b border-border-subtle transition-colors last:border-0 hover:bg-bg-2",
                      r.pinned && "bg-bg-2/40",
                    )}
                    style={
                      r.pinned
                        ? { boxShadow: `inset 2px 0 0 ${SEMANTIC.perceive}` }
                        : undefined
                    }
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 font-medium text-text-primary">
                      {r.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[13px] text-text-secondary">
                      {r.language}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-text-secondary">{r.vendor}</td>
                    <td className="px-4 py-3.5 text-text-secondary">{r.feature}</td>
                    <td className="px-4 py-3.5 text-text-secondary">{r.audience}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs"
                          style={semanticStyle(
                            r.status.tone === "green" ? SEMANTIC.tool : SEMANTIC.plan,
                          )}
                        >
                          {r.status.label}
                        </span>
                        {r.extraStatus?.map((b) => (
                          <span
                            key={b.label}
                            className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs"
                            style={semanticStyle(b.color)}
                          >
                            {b.label}
                          </span>
                        ))}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-c-perceive">
                        详情
                        <ArrowDownRight size={14} />
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>

        <p className="mt-4 text-caption text-text-tertiary">
          star 数为约数（2026 年中），发布前建议再复核一次。
        </p>
      </div>
    </section>
  );
}
