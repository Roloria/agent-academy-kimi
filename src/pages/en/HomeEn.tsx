import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Hero from "@/pages/en/home/Hero";
import SiteTour from "@/pages/home/SiteTour";
import AgentLoop from "@/pages/en/home/AgentLoop";
import Compare from "@/pages/en/home/Compare";
import PathOverview from "@/pages/en/home/PathOverview";
import Pillars from "@/pages/en/home/Pillars";
import Authority from "@/pages/en/home/Authority";
import Capstone from "@/pages/en/home/Capstone";
import BottomCTA from "@/pages/en/home/BottomCTA";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * English home page (/en) — mirrors src/pages/Home.tsx section for section.
 * SiteTour and ParticleRing are locale-aware / copy-free shared components and
 * are reused directly; all other sections live under src/pages/en/home/.
 */

/** S0. 2px gradient scroll progress bar at the top of the page (GSAP ScrollTrigger scrub) */
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

export default function HomeEn() {
  return (
    <>
      <ProgressBar />
      <Hero />
      <SiteTour />
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
