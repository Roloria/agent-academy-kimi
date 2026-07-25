import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/providers/use-language";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ParticleRing = lazy(() => import("@/pages/home/ParticleRing"));

const BADGE_TEXT = "AGENT = LLM + PLANNING + MEMORY + TOOLS";

const STATS = [
  { target: 5, suffix: "", label: "Learning Stages" },
  { target: 15, prefix: "10–", label: "Weeks, Full Cycle" },
  { target: 11, suffix: "", label: "Frameworks Compared" },
  { target: 8, suffix: "", label: "Hands-on Steps" },
] as const;

/** Badge typewriter (characters appear over 400ms) */
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
  const { localize } = useLanguage();

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });
      // Particle ring entrance happens inside R3F; content sequence total ~1.6s
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
      // Rolling number counters (1s, easeOut, 200ms delay)
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

      // Scroll parallax: content drifts up at 0.6 rate, ring scales slightly
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
      {/* Three background layers: ① grid texture ② particle ring ③ cyan glow at bottom */}
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
            "radial-gradient(60% 100% at 50% 100%, color-mix(in srgb, var(--c-perceive) 6%, transparent), transparent 70%)",
        }}
        aria-hidden
      />

      {/* Content column */}
      <div className="hero-content relative z-10 mx-auto flex w-full max-w-[960px] flex-1 flex-col items-center justify-center px-6 pb-24 pt-16 text-center">
        {/* Badge typewriter */}
        <p className="mb-8 inline-flex min-h-[30px] items-center rounded-full border border-c-perceive/40 bg-c-perceive/10 px-4 py-1 font-mono text-caption tracking-[0.12em] text-c-perceive">
          {badge}
          <span className="ml-0.5 inline-block h-3.5 w-px animate-caret-blink bg-c-perceive" />
        </p>

        {/* Main title */}
        <h1 className="text-display font-black leading-[1.15] tracking-[-0.02em]">
          <span className="hero-word block">Master</span>
          <span className="hero-word block font-display text-grad">AI Agents</span>
          <span className="hero-word block">From Principles to Your Own Project</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-sub mt-7 max-w-[640px] text-body-lg text-text-secondary">
          Built on public GitHub open-source projects, classic papers and open
          knowledge bases — learn how agents work, the mainstream frameworks and
          the core skills, with one goal: complete the full learning cycle and
          build a complete agent project with your own hands.
        </p>

        {/* CTA row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={localize("/path")}
            className="hero-cta btn-solid-grad px-7 py-3 text-[16px] font-medium"
          >
            Start Learning →
          </Link>
          <button
            type="button"
            onClick={scrollToS2}
            className="hero-cta group px-5 py-3 text-[16px] text-text-secondary transition-colors hover:text-c-perceive"
          >
            See what an agent is first
            <span className="inline-block transition-transform duration-200 group-hover:translate-y-1">
              {" "}
              ↓
            </span>
          </button>
        </div>
      </div>

      {/* Bottom stats bar */}
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
        {/* Scroll hint */}
        <div className="mt-8 flex flex-col items-center gap-1 text-text-tertiary">
          <span className="font-mono text-[11px] tracking-[0.3em]">SCROLL</span>
          <ChevronDown size={16} className="animate-float-y" />
        </div>
      </div>
    </section>
  );
}
