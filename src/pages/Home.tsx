import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Hero from "@/pages/home/Hero";
import AgentLoop from "@/pages/home/AgentLoop";
import Compare from "@/pages/home/Compare";
import PathOverview from "@/pages/home/PathOverview";
import Pillars from "@/pages/home/Pillars";
import Authority from "@/pages/home/Authority";
import Capstone from "@/pages/home/Capstone";
import BottomCTA from "@/pages/home/BottomCTA";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** S0. 页面顶部 2px 渐变滚动进度条（GSAP ScrollTrigger scrub） */
function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      },
    );
  });
  return (
    <div
      ref={bar}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-grad-main"
      style={{ transform: "scaleX(0)" }}
      aria-hidden
    />
  );
}

export default function Home() {
  return (
    <>
      <ProgressBar />
      <Hero />
      <AgentLoop />
      <Compare />
      <PathOverview />
      <Pillars />
      <Authority />
      <Capstone />
      <BottomCTA />
    </>
  );
}
