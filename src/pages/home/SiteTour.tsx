import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Maximize2, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui-extra";
import { useLanguage, useT } from "@/providers/use-language";
import { cn } from "@/lib/utils";

/**
 * S1b. 站点导览带（home-video.md）：Hero（S1）与 Agent 循环图解（S2）之间。
 * 左栏：/intro-loop.mp4 播放器卡片（固定深色面板，两主题一致）；
 * 右栏：五色索引列表（承接 /mcp 与 /sandbox 的首页导流）。
 */

const VIDEO_SRC = "/intro-loop.mp4";
const POSTER = "/video-poster.jpg";

interface IndexRow {
  dot: string; // 语义色 CSS 变量
  name: { zh: string; en: string };
  to: string;
  /** 一行两链时的第二个链接 */
  second?: { name: { zh: string; en: string }; to: string };
  desc: { zh: string; en: string };
}

const INDEX_ROWS: IndexRow[] = [
  {
    dot: "var(--c-perceive)",
    name: { zh: "学习路径", en: "Learning Path" },
    to: "/path",
    desc: { zh: "五阶段路线图", en: "The five-stage roadmap" },
  },
  {
    dot: "var(--c-plan)",
    name: { zh: "原理知识库", en: "Principles" },
    to: "/principles",
    desc: { zh: "ReAct、记忆与规划", en: "ReAct, memory and planning" },
  },
  {
    dot: "var(--c-tool)",
    name: { zh: "框架横评", en: "Frameworks" },
    to: "/frameworks",
    second: { name: { zh: "MCP 专题", en: "MCP" }, to: "/mcp" },
    desc: { zh: "选对兵器、接通生态", en: "Pick the right tool, join the ecosystem" },
  },
  {
    dot: "var(--c-memory)",
    name: { zh: "资源导航", en: "Resources" },
    to: "/resources",
    desc: { zh: "课程、论文与 Awesome 仓库", en: "Courses, papers and awesome lists" },
  },
  {
    dot: "var(--c-loop)",
    name: { zh: "实战项目", en: "Capstone" },
    to: "/capstone",
    second: { name: { zh: "沙盒演示", en: "Sandbox" }, to: "/sandbox" },
    desc: { zh: "先看演示，再造真的", en: "Watch the demo, then build the real thing" },
  },
];

/** 视频懒加载与离视口暂停（home-video.md 技术验收清单） */
function useTourVideo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion() ?? false;
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);

  // IO 预视区 400px 才加载视频源（preload="none"，首屏 LCP 不受影响）
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoaded(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 离开视口 2 秒后 pause，回到视口恢复 play
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.clearTimeout(timer);
        setInView(true);
      } else {
        timer = window.setTimeout(() => setInView(false), 2000);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const playing = reduced ? manualPlay : inView;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !loaded) return;
    if (playing) {
      v.play().catch(() => {
        /* 自动播放被拦截时保持 poster，不报错 */
      });
    } else {
      v.pause();
    }
  }, [loaded, playing]);

  return { wrapRef, videoRef, reduced, loaded, playing, setManualPlay };
}

/** 播放器卡片（含灯箱） */
function TourVideoCard() {
  const t = useT();
  const { wrapRef, videoRef, reduced, loaded, playing, setManualPlay } = useTourVideo();
  const [zoom, setZoom] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);

  const closeZoom = useCallback(() => setZoom(false), []);

  // Esc 关闭 + 初始焦点
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeZoom();
    };
    window.addEventListener("keydown", onKey);
    lightboxRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, closeZoom]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
      >
        {/* 悬浮徽章 */}
        <span className="absolute -right-2 -top-2 z-10 rounded-full border border-panel-accent/60 bg-panel px-2.5 py-0.5 font-mono text-[11px] tracking-[0.08em] text-panel-accent">
          AGENT LOOP · {t("站点导览", "SITE TOUR")}
        </span>

        {/* 深色面板卡片（两主题一致，深色面板守恒规则） */}
        <div
          ref={wrapRef}
          className="rounded-2xl border border-panel-border bg-panel p-3 transition-[border-color] duration-[250ms] hover:border-border-strong"
          style={{
            boxShadow: "var(--card-shadow)",
            animation:
              playing && !reduced ? "tourGlow 6s ease-in-out infinite" : undefined,
          }}
        >
          <motion.div layoutId="tour-video-frame" className="relative">
            <video
              ref={videoRef}
              src={loaded ? VIDEO_SRC : undefined}
              poster={POSTER}
              autoPlay={!reduced}
              muted
              loop
              playsInline
              preload="none"
              className="aspect-video w-full rounded-[10px] object-cover"
              onError={(e) => {
                // 加载失败 → poster 静帧兜底，不报错
                e.currentTarget.removeAttribute("src");
              }}
            />
            {/* reduced-motion：poster + 居中播放按钮 */}
            {reduced && (
              <button
                type="button"
                aria-label={playing ? t("暂停视频", "Pause video") : t("播放视频", "Play video")}
                onClick={() => setManualPlay(!playing)}
                className="absolute inset-0 flex items-center justify-center rounded-[10px] bg-black/25 transition-colors hover:bg-black/40"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-panel-border bg-panel/90 text-panel-text">
                  {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
                </span>
              </button>
            )}
          </motion.div>

          {/* 播放器 chrome 行 */}
          <div className="flex h-9 items-center justify-between px-1">
            <span className="font-mono text-xs text-panel-text-2">
              ▶ intro-loop.mp4 · 8s · {t("静音循环", "muted loop")}
            </span>
            <button
              type="button"
              onClick={() => setZoom(true)}
              className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-panel-text-3 transition-colors hover:bg-panel-2 hover:text-panel-accent"
            >
              <Maximize2 size={12} aria-hidden />
              {t("放大", "Expand")}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 灯箱：Esc / 点击遮罩关闭 */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            ref={lightboxRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={t("站点导览视频", "Site tour video")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeZoom}
            className="fixed inset-0 z-[80] flex items-center justify-center p-6 outline-none"
            style={{ background: "var(--overlay-scrim)" }}
          >
            <motion.div
              layoutId="tour-video-frame"
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[960px] rounded-2xl border border-panel-border bg-panel p-3"
            >
              <video
                src={VIDEO_SRC}
                poster={POSTER}
                autoPlay
                muted
                loop
                playsInline
                className="aspect-video w-full rounded-[10px] object-cover"
              />
              <p className="flex h-9 items-center px-1 font-mono text-xs text-panel-text-2">
                ▶ intro-loop.mp4 · 8s · {t("静音循环", "muted loop")} · Esc{" "}
                {t("关闭", "to close")}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 播放中的微弱外发光（reduced-motion 下关闭） */}
      <style>{`@keyframes tourGlow { 0%,100% { box-shadow: 0 0 32px rgba(56,189,248,.04) } 50% { box-shadow: 0 0 32px rgba(56,189,248,.10) } }`}</style>
    </>
  );
}

/** 右栏索引行：8px 语义色圆点 + 内链，hover 行底色 + 箭头位移 */
function IndexLink({
  name,
  to,
  t,
}: {
  name: { zh: string; en: string };
  to: string;
  t: <T>(zh: T, en: T) => T;
}) {
  const { localize } = useLanguage();
  return (
    <Link
      to={localize(to)}
      className="font-medium text-text-primary transition-colors hover:text-c-perceive"
    >
      {t(name.zh, name.en)}
    </Link>
  );
}

export default function SiteTour() {
  const t = useT();
  return (
    <section id="tour" className="border-t border-border-subtle">
      <div className="mx-auto max-w-content px-6 py-[72px] max-md:px-5">
        {/* 顶部 2px 五色渐变短标 */}
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          aria-hidden
          className="mb-12 block h-0.5 w-24 origin-left rounded-full bg-grad-semantics"
        />

        <div className="grid items-center gap-12 lg:grid-cols-[46fr_54fr]">
          {/* 左栏：视频播放器卡片 */}
          <TourVideoCard />

          {/* 右栏：文字与索引 */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-4">SITE TOUR</Badge>
              <h2 className="text-h2 font-bold text-text-primary">
                {t(
                  "五色节点转一圈，",
                  "One orbit of five nodes — ",
                )}
                <span className="font-display text-grad">
                  {t("就是本站的一张地图", "that's the map of this site")}
                </span>
              </h2>
              <p className="mt-5 max-w-[52ch] text-body text-text-secondary">
                {t(
                  "环上的五种颜色 = Agent 的五大组件 = 本站的内容结构。青色是感知与入门，琥珀是原理与规划，紫色是记忆与进阶，绿色是工具与框架，粉色是行动与实战——跟着颜色走，就走完了整个学习周期。",
                  "The five colors on the ring are the five components of an agent — and the structure of this site. Cyan for perception and getting started, amber for principles and planning, violet for memory and advanced skills, green for tools and frameworks, pink for action and the capstone. Follow the colors through a full learning cycle.",
                )}
              </p>
            </motion.div>

            {/* 五色索引列表 */}
            <ul className="mt-8 space-y-1">
              {INDEX_ROWS.map((row, i) => (
                <motion.li
                  key={row.to}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <div
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-[250ms] hover:bg-bg-2",
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: row.dot, boxShadow: `0 0 8px ${row.dot}` }}
                    />
                    <span className="text-body-sm">
                      <IndexLink name={row.name} to={row.to} t={t} />
                      {row.second && (
                        <>
                          <span className="mx-1.5 text-text-tertiary">&</span>
                          <IndexLink name={row.second.name} to={row.second.to} t={t} />
                        </>
                      )}
                      <span className="ml-2 text-text-tertiary">
                        —— {t(row.desc.zh, row.desc.en)}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="ml-auto shrink-0 text-text-tertiary transition-all duration-200 group-hover:translate-x-1 group-hover:text-c-perceive"
                    >
                      →
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
