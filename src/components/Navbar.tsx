import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Menu, Moon, Sun, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
import { useLanguage, useT } from "@/providers/use-language";

/** Navbar v2 链接组（7 项，v2-design.md §3.1）：首页项移除（Logo 即回首页），新增 MCP 专题与沙盒演示 */
const NAV_LINKS = [
  { to: "/path", zh: "学习路径", en: "Path" },
  { to: "/principles", zh: "原理知识库", en: "Principles" },
  { to: "/frameworks", zh: "框架横评", en: "Frameworks" },
  { to: "/mcp", zh: "MCP 专题", en: "MCP" },
  { to: "/capstone", zh: "实战项目", en: "Capstone" },
  { to: "/sandbox", zh: "沙盒演示", en: "Sandbox" },
  { to: "/resources", zh: "资源导航", en: "Resources" },
] as const;

/** 主题切换按钮（v2-design.md §1.4）：36×36 圆形 icon 按钮，Sun ↔ Moon 旋转切换 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useT();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("切换浅色模式", "Switch to dark mode")}
      aria-pressed={!isDark}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-bg-1 text-text-secondary transition-all duration-150 hover:border-border-strong hover:text-text-primary active:scale-[0.92]"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          className="flex"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** 中/EN 分段控件（v2-design.md §2.3）：切换时跳转当前路径的对应语言版本 */
export function LanguageSwitch({
  className,
  layoutId = "lang-seg-highlight",
}: {
  className?: string;
  layoutId?: string;
}) {
  const { lang, toggleLanguage } = useLanguage();
  const segments = [
    { id: "zh" as const, label: "中" },
    { id: "en" as const, label: "EN" },
  ];
  return (
    <div
      role="group"
      aria-label="语言切换 / Language"
      className={cn(
        "flex h-9 items-center rounded-full border border-border-subtle p-0.5",
        className,
      )}
    >
      {segments.map((seg) => {
        const active = lang === seg.id;
        return (
          <button
            key={seg.id}
            type="button"
            aria-pressed={active}
            onClick={() => {
              if (!active) toggleLanguage();
            }}
            className={cn(
              "relative flex h-full flex-1 items-center justify-center rounded-full px-3 text-[13px] font-medium transition-colors",
              active
                ? "text-text-primary"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-bg-2"
              />
            )}
            <span className="relative">{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { localize, lang } = useLanguage();
  const t = useT();

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
        "sticky top-0 z-50 h-16 border-b backdrop-blur-[12px] transition-shadow duration-300",
        scrolled ? "border-border-subtle" : "border-transparent",
      )}
      style={{
        background: "var(--navbar-bg)",
        boxShadow: scrolled ? "var(--navbar-shadow)" : undefined,
      }}
    >
      <nav className="mx-auto flex h-full max-w-content items-center justify-between px-6 max-md:px-5">
        {/* 左：Logo（即回首页） */}
        <Link to={localize("/")} className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="Agent Academy Logo" className="h-6 w-6" />
          <span className="font-display text-[17px] font-bold tracking-tight">
            <span className="text-c-perceive">Agent</span>{" "}
            <span className="text-text-primary">Academy</span>
          </span>
          {lang === "zh" && (
            <span className="mt-0.5 hidden text-[13px] text-text-tertiary sm:inline">
              智能体学院
            </span>
          )}
        </Link>

        {/* 中：导航链接（桌面 ≥1200px，7 项，间距 18px） */}
        <div className="hidden items-center gap-[18px] min-[1200px]:flex">
          {NAV_LINKS.map(({ to, zh, en }) => (
            <NavLink
              key={to}
              to={localize(to)}
              className={({ isActive }) =>
                cn(
                  "group relative py-1.5 text-[14.5px] transition-colors",
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t(zh, en)}
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

        {/* 右：主题切换 → 语言分段 → GitHub → CTA（1200–1320px 隐藏 CTA） */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitch className="max-[1199px]:hidden" />
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hidden rounded-lg p-2 text-text-secondary transition-colors hover:bg-bg-2 hover:text-text-primary min-[1200px]:block"
          >
            <Github size={18} />
          </a>
          <Link
            to={localize("/path")}
            className="btn-outline-grad hidden px-4 py-1.5 text-[14px] font-medium text-text-primary min-[1320px]:block"
          >
            {t("开始学习", "Start Learning")}
          </Link>
          <button
            type="button"
            aria-label={t("打开菜单", "Open menu")}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-text-secondary hover:bg-bg-2 hover:text-text-primary min-[1200px]:hidden"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* 移动端全屏抽屉（<1200px） */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 top-16 z-40 bg-bg-0/[0.96] backdrop-blur-md min-[1200px]:hidden"
          >
            <div className="flex h-full flex-col px-6 py-8">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map(({ to, zh, en }, i) => (
                  <motion.div
                    key={to}
                    initial={{ x: -24, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <NavLink
                      to={localize(to)}
                      className={({ isActive }) =>
                        cn(
                          "block rounded-xl px-4 py-3.5 text-h4 transition-colors",
                          isActive
                            ? "bg-bg-2 text-c-perceive"
                            : "text-text-secondary hover:bg-bg-2 hover:text-text-primary",
                        )
                      }
                    >
                      {t(zh, en)}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              {/* 抽屉底部：语言分段控件（宽 100%）+ GitHub */}
              <motion.div
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: NAV_LINKS.length * 0.04, duration: 0.3 }}
                className="mt-auto flex items-center gap-3 px-1 pt-8"
              >
                <LanguageSwitch className="flex-1" layoutId="lang-seg-highlight-drawer" />
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-subtle text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                >
                  <Github size={17} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
