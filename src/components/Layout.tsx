import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/** 滚动到顶部按钮：滚动 600px 后淡入 */
function ScrollTopButton() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          type="button"
          aria-label="回到顶部"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 rounded-full border border-border-subtle bg-bg-2 p-3 text-text-secondary shadow-lg transition-colors hover:border-c-perceive hover:text-c-perceive"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * 全站共享布局（嵌套路由模式：内容槽 = <Outlet/>）。
 * Navbar 为 sticky 布局，处于正常文档流，无需顶部内边距。
 */
export default function Layout() {
  const location = useLocation();

  // Lenis 全站平滑滚动（lerp 0.1）+ GSAP ScrollTrigger 同步
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  // 路由切换回顶部
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return (
    <div className="min-h-[100dvh] bg-bg-0 text-text-primary">
      <div className="noise-overlay" aria-hidden />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollTopButton />
    </div>
  );
}
