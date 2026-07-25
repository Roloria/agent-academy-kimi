import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_LINKS = [
  { to: "/", label: "首页" },
  { to: "/path", label: "学习路径" },
  { to: "/principles", label: "原理知识库" },
  { to: "/frameworks", label: "框架横评" },
  { to: "/capstone", label: "实战项目" },
  { to: "/resources", label: "资源导航" },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 路由切换时关闭抽屉（渲染期间调整状态的推荐模式）
  const [prevPath, setPrevPath] = useState(location.pathname);
  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setOpen(false);
  }

  return (
    <motion.header
      initial={{ y: "-100%" }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 h-16 border-b bg-bg-0/80 backdrop-blur-[12px] transition-shadow duration-300",
        scrolled ? "border-border-subtle shadow-[0_8px_30px_rgba(0,0,0,.35)]" : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-full max-w-content items-center justify-between px-6 max-md:px-5">
        {/* 左：Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Agent Academy Logo" className="h-6 w-6" />
          <span className="font-display text-[17px] font-bold tracking-tight">
            <span className="text-c-perceive">Agent</span>{" "}
            <span className="text-text-primary">Academy</span>
          </span>
          <span className="mt-0.5 hidden text-[13px] text-text-tertiary sm:inline">
            智能体学院
          </span>
        </Link>

        {/* 中：导航链接（桌面） */}
        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "group relative py-1.5 text-[15px] transition-colors",
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 h-0.5 bg-c-perceive transition-all duration-300",
                      isActive ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* 右：GitHub + CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-2 hover:text-text-primary sm:block"
          >
            <Github size={18} />
          </a>
          <Link
            to="/path"
            className="btn-outline-grad hidden px-4 py-1.5 text-[14px] font-medium text-text-primary sm:block"
          >
            开始学习
          </Link>
          <button
            type="button"
            aria-label="打开菜单"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg-2 hover:text-text-primary lg:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* 移动端全屏抽屉 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-bg-0/[0.96] backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-2 px-6 py-8">
              {NAV_LINKS.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-xl px-4 py-3.5 text-h4 transition-colors",
                        isActive
                          ? "bg-bg-2 text-c-perceive"
                          : "text-text-secondary hover:bg-bg-2 hover:text-text-primary",
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.04, duration: 0.3 }}
                className="mt-4 px-4"
              >
                <Link
                  to="/path"
                  className="btn-solid-grad block px-6 py-3 text-center font-medium"
                >
                  开始学习之旅 →
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
