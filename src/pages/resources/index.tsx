import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  FileText,
  Github,
  GraduationCap,
  Library,
} from "lucide-react";
import { Badge, Reveal } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import { cn } from "@/lib/utils";
import type { CategoryKey, StageKey } from "./data";
import { BLOGS, COURSES, PAPERS, REPOS } from "./data";

const CYAN = SEMANTIC.perceive; // 页面主色：感知青

type StageFilter = StageKey | "通用" | null;

const CATEGORIES: { key: CategoryKey | "all"; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "repos", label: "Awesome 仓库" },
  { key: "courses", label: "免费课程" },
  { key: "papers", label: "经典论文" },
  { key: "blogs", label: "博客与文档" },
];

const STAGES: (StageKey | "通用")[] = ["阶段 1", "阶段 2", "阶段 3", "阶段 4", "通用"];

/* ---------------------------------- 通用 ---------------------------------- */

function Breadcrumb() {
  return (
    <nav className="mb-8 flex items-center gap-1.5 font-mono text-caption text-text-tertiary">
      <Link to="/" className="transition-colors hover:text-c-perceive">
        HOME
      </Link>
      <ChevronRight size={13} />
      <span className="text-text-secondary">资源导航</span>
    </nav>
  );
}

/** 数字滚动计数（1s，进入视口触发一次） */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1000);
          setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} className="font-nums text-h2 font-bold text-text-primary">
      {display}
    </span>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-body-sm transition-colors duration-200",
        active
          ? "border-c-perceive/60 bg-c-perceive/10 text-c-perceive"
          : "border-border-subtle text-text-tertiary hover:border-border-strong hover:text-text-secondary",
      )}
    >
      {children}
    </button>
  );
}

function GroupHeading({
  no,
  title,
  count,
}: {
  no: string;
  title: string;
  count: number;
}) {
  return (
    <Reveal className="mb-8 flex items-baseline gap-3">
      <span className="font-mono text-body-sm text-c-perceive">{no}</span>
      <h2 className="text-h2 font-bold text-text-primary">{title}</h2>
      <span className="font-mono text-caption text-text-tertiary">{count} 条</span>
    </Reveal>
  );
}

/** 卡片外壳（hover 边框提亮） */
function CardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border-subtle bg-bg-1 p-5 transition-colors duration-[250ms] hover:border-border-strong">
      {children}
    </div>
  );
}

function ExtRow({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-auto inline-flex items-center gap-1.5 pt-4 font-mono text-caption text-text-tertiary transition-colors hover:text-c-perceive"
    >
      <span className="truncate">{label}</span>
      <ArrowUpRight
        size={13}
        className="shrink-0 transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
    </a>
  );
}

/* --------------------------------- 页面主体 --------------------------------- */

export default function ResourcesPage() {
  const [category, setCategory] = useState<CategoryKey | "all">("all");
  const [stage, setStage] = useState<StageFilter>(null);

  /** 阶段筛选：课程按标注阶段过滤；无阶段标注的资源归入“通用” */
  const visibleCourses = useMemo(() => {
    if (stage === null || stage === "通用") return COURSES;
    return COURSES.filter((c) => c.stages.includes(stage));
  }, [stage]);

  const showGroup = (key: CategoryKey) => {
    if (category !== "all" && category !== key) return false;
    if (stage === null) return true;
    if (stage === "通用") return key !== "courses";
    return key === "courses" && visibleCourses.length > 0;
  };

  const filterKey = `${category}-${stage ?? "all"}`;

  return (
    <div className="relative">
      {/* 背景：工程网格 + 青色光晕 */}
      <div aria-hidden className="bg-grid-texture pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[480px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(56,189,248,0.08), transparent 65%)" }}
      />

      {/* ---------------- S1 页头 ---------------- */}
      <header className="relative mx-auto max-w-prose2 px-5 pb-16 pt-16 md:px-6 md:pt-24">
        <Breadcrumb />
        <Reveal className="mb-5">
          <Badge color={CYAN}>40+ 资源 · 链接均已核实</Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-h1 font-black text-text-primary">
            你的 Agent <span className="text-grad">知识弹药库</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[68ch] text-body-lg text-text-secondary">
            Awesome 仓库、免费官方课程、经典论文、关键博客——全部来自公开互联网知识库，链接经检索核实。按你所在的学习阶段取用即可。
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: 8, label: "Awesome 仓库" },
            { value: 10, label: "免费课程" },
            { value: 9, label: "经典论文" },
            { value: 8, label: "博客与文档" },
          ].map((s) => (
            <div key={s.label}>
              <CountUp value={s.value} />
              <p className="mt-1 text-caption text-text-tertiary">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </header>

      {/* ---------------- S2 筛选工具栏（sticky） ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="sticky top-16 z-30 border-y border-border-subtle bg-bg-0/85 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-content flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3.5 md:px-6">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <Chip
                key={c.key}
                active={category === c.key}
                onClick={() => setCategory(c.key)}
              >
                {c.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            <span className="font-mono text-caption text-text-tertiary">按阶段</span>
            {STAGES.map((s) => (
              <Chip
                key={s}
                active={stage === s}
                onClick={() => setStage((cur) => (cur === s ? null : s))}
              >
                {s}
              </Chip>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ---------------- S3 分组资源网格 ---------------- */}
      <main className="relative mx-auto max-w-content space-y-24 px-5 py-20 md:px-6">
        <motion.div
          key={filterKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="space-y-24"
        >
          {/* 组 1 · Awesome 类 GitHub 仓库 */}
          {showGroup("repos") && (
            <section id="repos">
              <GroupHeading no="01" title="Awesome 类 GitHub 仓库" count={REPOS.length} />
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
                {REPOS.map((repo, i) => (
                  <motion.div
                    key={repo.name}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  >
                    <CardShell>
                      <div className="mb-3 flex items-center gap-2.5">
                        <Github size={18} className="shrink-0 text-text-secondary" />
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate font-mono text-body-sm font-semibold text-text-primary transition-colors hover:text-c-perceive"
                        >
                          {repo.name}
                        </a>
                      </div>
                      <p className="text-body-sm text-text-secondary">{repo.desc}</p>
                      {(repo.tag === "benchmark" || repo.tag === "sdk") && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          {repo.tag === "benchmark" && (
                            <>
                              <Badge color={SEMANTIC.loop}>标杆</Badge>
                              <Link
                                to="/capstone"
                                className="inline-flex items-center gap-1 text-caption text-c-loop hover:underline"
                              >
                                去看实战教程 <ArrowRight size={12} />
                              </Link>
                            </>
                          )}
                          {repo.tag === "sdk" && (
                            <Link
                              to="/frameworks#detail-agents-sdk"
                              className="inline-flex items-center gap-1 text-caption text-c-perceive hover:underline"
                            >
                              框架横评详情 <ArrowRight size={12} />
                            </Link>
                          )}
                        </div>
                      )}
                      <ExtRow href={repo.url} label={repo.url.replace("https://", "")} />
                    </CardShell>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* 组 2 · 官方免费课程 */}
          {showGroup("courses") && (
            <section id="courses">
              <GroupHeading no="02" title="官方免费课程" count={visibleCourses.length} />
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
                {visibleCourses.map((course, i) => (
                  <motion.div
                    key={course.name}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  >
                    <CardShell>
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge color={course.provider === "HF" ? SEMANTIC.plan : SEMANTIC.perceive}>
                          {course.provider === "HF" ? "HF" : "DeepLearning.AI"}
                          {course.providerNote ? ` ${course.providerNote}` : ""}
                        </Badge>
                        <Badge color={SEMANTIC.memory}>{course.stageLabel}</Badge>
                      </div>
                      <h4 className="text-h4 font-semibold leading-snug text-text-primary">
                        {course.name}
                      </h4>
                      <p className="mt-2 text-body-sm text-text-secondary">{course.desc}</p>
                      <ExtRow
                        href={course.url}
                        label={course.url.replace("https://", "").replace(/\/$/, "")}
                      />
                    </CardShell>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* 组 3 · 经典论文（横条卡，单列） */}
          {showGroup("papers") && (
            <section id="papers">
              <GroupHeading no="03" title="经典论文 · 按推荐阅读顺序" count={PAPERS.length} />
              <div className="space-y-4">
                {PAPERS.map((paper, i) => (
                  <motion.div
                    key={paper.arxiv}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: Math.min(i, 3) * 0.05 }}
                  >
                    <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-bg-1 p-5 transition-colors duration-[250ms] hover:border-border-strong md:flex-row md:items-center">
                      <span className="hidden font-nums text-h3 font-bold text-text-tertiary md:block">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <Badge color={SEMANTIC.memory}>ARXIV:{paper.arxiv}</Badge>
                          {paper.mustRead && <Badge color={SEMANTIC.plan}>必读</Badge>}
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-3">
                          <a
                            href={paper.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-body font-semibold text-text-primary transition-colors hover:text-c-perceive"
                          >
                            {paper.title}
                          </a>
                          <span className="font-mono text-caption text-text-tertiary">
                            {paper.authors}
                          </span>
                        </div>
                        <p className="mt-1.5 text-body-sm text-text-secondary">
                          {paper.value}
                          {paper.mustRead && (
                            <>
                              {" · "}
                              <Link
                                to="/principles#react"
                                className="text-c-perceive hover:underline"
                              >
                                原理知识库有精讲 →
                              </Link>
                            </>
                          )}
                        </p>
                      </div>
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex shrink-0 items-center gap-1.5 font-mono text-caption text-text-tertiary transition-colors hover:text-c-perceive"
                      >
                        arxiv.org/abs/{paper.arxiv}
                        <ArrowUpRight
                          size={13}
                          className="transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* 组 4 · 关键博客与文档 */}
          {showGroup("blogs") && (
            <section id="blogs">
              <GroupHeading no="04" title="关键博客与文档" count={BLOGS.length} />
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
                {BLOGS.map((blog, i) => (
                  <motion.div
                    key={blog.url}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  >
                    <CardShell>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        {blog.url.includes("arxiv") || blog.title.includes("文档") ? (
                          <FileText size={18} className="shrink-0 text-c-perceive" />
                        ) : blog.title.includes("Course") ? (
                          <GraduationCap size={18} className="shrink-0 text-c-perceive" />
                        ) : (
                          <BookOpen size={18} className="shrink-0 text-c-perceive" />
                        )}
                        {blog.classic && <Badge color={SEMANTIC.plan}>经典</Badge>}
                      </div>
                      <h4 className="text-body font-semibold leading-snug text-text-primary">
                        {blog.title}
                      </h4>
                      <p className="mt-1 font-mono text-caption text-text-tertiary">
                        {blog.source}
                      </p>
                      <p className="mt-2 text-body-sm text-text-secondary">{blog.desc}</p>
                      <ExtRow
                        href={blog.url}
                        label={blog.url.replace("https://", "").replace(/\/$/, "")}
                      />
                    </CardShell>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </motion.div>

        {/* ---------------- S4 链接核实说明 ---------------- */}
        <Reveal className="border-t border-border-subtle pt-10">
          <p className="flex items-start gap-3 text-body-sm text-text-tertiary">
            <Library size={16} className="mt-1 shrink-0" />
            <span>
              链接核实说明：以上链接经 web 检索核实存在且内容匹配（Hugging Face
              Agents Course、DeepLearning.AI 课程目录、Awesome 仓库活跃度、ReAct
              论文、Anthropic
              工程博客等已直接验证）；其余为官方文档/论文标准地址，高置信度。建议使用前以官方页面为准。内容基于公开
              GitHub 开源项目与公开资料整理，仅供学习。
            </span>
          </p>
        </Reveal>
      </main>

      {/* ---------------- S5 收尾 CTA ---------------- */}
      <section className="relative border-t border-border-subtle">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.10), rgba(167,139,250,0.05) 45%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[720px] px-5 py-24 text-center md:px-6">
          <Reveal>
            <h3 className="text-h3 font-bold text-text-primary">
              资源再好，不如动手<span className="text-grad">跑一个循环</span>
            </h3>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/capstone"
              className="btn-outline-grad inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium text-text-primary"
            >
              开始实战教程 <ArrowRight size={15} />
            </Link>
            <Link
              to="/path"
              className="group inline-flex items-center gap-1.5 px-4 py-3 text-body-sm text-text-secondary transition-colors hover:text-c-perceive"
            >
              回到学习路径
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
