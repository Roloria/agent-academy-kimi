import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ParticleRing = lazy(() => import("./ParticleRing"));

const BADGE_TEXT = "AGENT = LLM + 规划 + 记忆 + 工具";

const STATS = [
  { target: 5, suffix: "", label: "个学习阶段" },
  { target: 15, prefix: "10–", label: "周完整周期" },
  { target: 10, suffix: "", label: "大框架横评" },
  { target: 8, suffix: "", label: "步实战教程" },
] as const;

/** 徽章打字机（400ms 逐字出现） */
function useTypewriter(text: string, start: boolean, speed = 400) {
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (!start) return;
    const per = speed / text.length;
    const id = window.setInterval(() => {
      setLen((v) => {
        if (v >= text.length) {
          window.clearInterval(id);
          return v;
        }
        return v + 1;
      });
    }, per);
    return () => window.clearInterval(id);
  }, [start, text, speed]);
  return text.slice(0, len);
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [typing, setTyping] = useState(false);
  const badge = useTypewriter(BADGE_TEXT, typing);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });
      // 粒子环入场由 R3F 内部完成；内容序列 total ~1.6s
      tl.add(() => setTyping(true), 0.1);
      tl.fromTo(
        ".hero-word",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" },
        0.35,
      );
      tl.fromTo(
        ".hero-sub",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      );
      tl.fromTo(
        ".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: "power2.out" },
        "-=0.2",
      );
      tl.fromTo(
        ".hero-stats",
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.1",
      );
      // 数字滚动计数（1s, easeOut, 延迟 200ms）
      tl.add(() => {
        document.querySelectorAll<HTMLElement>(".hero-stat-num").forEach((el) => {
          const target = Number(el.dataset.target ?? 0);
          const obj = { v: 0 };
          gsap.to(obj, {
            v: target,
            duration: 1,
            delay: 0.2,
            ease: "power1.out",
            onUpdate: () => {
              el.textContent = `${el.dataset.prefix ?? ""}${Math.round(obj.v)}`;
            },
          });
        });
      }, "-=0.3");

      // 滚动视差：内容 0.6 速率上飘，环轻微放大
      gsap.to(".hero-content", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(".hero-ring", {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  const scrollToS2 = () => {
    document.getElementById("what-is-agent")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={root} className="relative flex min-h-[100dvh] flex-col overflow-hidden">
      {/* 背景三层：① 网格平铺 ② 粒子环 ③ 底部青色光晕 */}
      <div className="bg-grid-texture absolute inset-0 opacity-[0.03]" aria-hidden />
      <div className="hero-ring absolute inset-0" aria-hidden>
        <Suspense
          fallback={
            <img
              src="/diagram-agent-loop.svg"
              alt=""
              className="absolute left-1/2 top-1/2 w-[min(90vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-40"
            />
          }
        >
          <ParticleRing />
        </Suspense>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 100%, rgba(56,189,248,0.06), transparent 70%)",
        }}
        aria-hidden
      />

      {/* 内容列 */}
      <div className="hero-content relative z-10 mx-auto flex w-full max-w-[960px] flex-1 flex-col items-center justify-center px-6 pb-24 pt-16 text-center">
        {/* 徽章打字机 */}
        <p className="mb-8 inline-flex min-h-[30px] items-center rounded-full border border-c-perceive/40 bg-c-perceive/10 px-4 py-1 font-mono text-caption tracking-[0.12em] text-c-perceive">
          {badge}
          <span className="ml-0.5 inline-block h-3.5 w-px animate-caret-blink bg-c-perceive" />
        </p>

        {/* 主标题 */}
        <h1 className="text-display font-black leading-[1.15] tracking-[-0.02em]">
          <span className="hero-word block">完整学习</span>
          <span className="hero-word block font-display text-grad">AI Agent</span>
          <span className="hero-word block">从原理到独立项目</span>
        </h1>

        {/* 副标题 */}
        <p className="hero-sub mt-7 max-w-[640px] text-body-lg text-text-secondary">
          基于公开的 GitHub 开源项目、经典论文与互联网知识库，系统学习 Agent
          的工作原理、主流框架与核心技能——以走完完整学习周期、亲手搭建一个完整
          Agent 项目为终点。
        </p>

        {/* CTA 行 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/path"
            className="hero-cta btn-solid-grad px-7 py-3 text-[16px] font-medium"
          >
            开始学习之旅 →
          </Link>
          <button
            type="button"
            onClick={scrollToS2}
            className="hero-cta group px-5 py-3 text-[16px] text-text-secondary transition-colors hover:text-c-perceive"
          >
            先看看 Agent 是什么
            <span className="inline-block transition-transform duration-200 group-hover:translate-y-1">
              {" "}
              ↓
            </span>
          </button>
        </div>
      </div>

      {/* 底部数据条 */}
      <div className="hero-stats relative z-10 mx-auto w-full max-w-[960px] px-6 pb-10">
        <div className="grid grid-cols-2 gap-y-6 border-t border-border-subtle pt-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="hero-stat-num font-display text-4xl font-bold text-text-primary"
                data-target={s.target}
                data-prefix={"prefix" in s ? s.prefix : ""}
              >
                {"prefix" in s ? s.prefix : ""}0
              </p>
              <p className="mt-1 text-caption text-text-tertiary">{s.label}</p>
            </div>
          ))}
        </div>
        {/* 滚动提示 */}
        <div className="mt-8 flex flex-col items-center gap-1 text-text-tertiary">
          <span className="font-mono text-[11px] tracking-[0.3em]">SCROLL</span>
          <ChevronDown size={16} className="animate-float-y" />
        </div>
      </div>
    </section>
  );
}
