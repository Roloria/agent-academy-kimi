import { Link } from "react-router";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers/use-language";

/**
 * S8. Bottom CTA — "Time to start your first loop"
 */
const TITLE_WORDS = ["Agents ", "are loops — ", "think, act, observe, rethink. ", "So is learning."];

export default function BottomCTA() {
  const { localize } = useLanguage();
  return (
    <section className="relative overflow-hidden py-28 max-md:py-20">
      {/* Background: radial cyan-violet gradient glow + grid */}
      <div className="bg-grid-texture absolute inset-0 opacity-[0.03]" aria-hidden />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 50%, color-mix(in srgb, var(--c-perceive) 7%, transparent), transparent 65%), radial-gradient(35% 45% at 65% 60%, color-mix(in srgb, var(--c-memory) 6%, transparent), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-[720px] px-6 text-center max-md:px-5">
        <h2 className="text-h1 font-black leading-[1.2] tracking-[-0.02em] text-text-primary">
          {TITLE_WORDS.map((w, i) => (
            <motion.span
              key={i}
              className={i === 2 ? "text-grad" : undefined}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {w}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-body-lg text-text-secondary"
        >
          In 10–15 weeks, you'll graduate with a complete agent project.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 0 24px color-mix(in srgb, var(--c-perceive) 20%, transparent)",
                "0 0 44px color-mix(in srgb, var(--c-perceive) 38%, transparent)",
                "0 0 24px color-mix(in srgb, var(--c-perceive) 20%, transparent)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full"
          >
            <Link to={localize("/path")} className="btn-solid-grad inline-block px-9 py-4 text-[17px] font-medium">
              Start Learning →
            </Link>
          </motion.div>
          <Link
            to={localize("/resources")}
            className="group text-[16px] text-text-secondary transition-colors hover:text-c-perceive"
          >
            Browse the resource library first
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              {" "}
              →
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
