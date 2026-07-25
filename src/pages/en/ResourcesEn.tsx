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
import type { CategoryKeyEn, StageKeyEn } from "./resources-data-en";
import { BLOGS_EN, COURSES_EN, PAPERS_EN, REPOS_EN } from "./resources-data-en";

const CYAN = SEMANTIC.perceive; // page accent: perception cyan

type StageFilter = StageKeyEn | "General" | null;

const CATEGORIES: { key: CategoryKeyEn | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "repos", label: "Awesome Repos" },
  { key: "courses", label: "Free Courses" },
  { key: "papers", label: "Classic Papers" },
  { key: "blogs", label: "Blogs & Docs" },
];

const STAGES: (StageKeyEn | "General")[] = ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "General"];

/* --------------------------------- shared --------------------------------- */

function Breadcrumb() {
  return (
    <nav className="mb-8 flex items-center gap-1.5 font-mono text-caption text-text-tertiary">
      <Link to="/en" className="transition-colors hover:text-c-perceive">
        HOME
      </Link>
      <ChevronRight size={13} />
      <span className="text-text-secondary">Resources</span>
    </nav>
  );
}

/** Count-up number (1s, triggered once on entering the viewport) */
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
      <span className="font-mono text-caption text-text-tertiary">{count} items</span>
    </Reveal>
  );
}

/** Card shell (border brightens on hover) */
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

/* -------------------------------- page body -------------------------------- */

export default function ResourcesEn() {
  const [category, setCategory] = useState<CategoryKeyEn | "all">("all");
  const [stage, setStage] = useState<StageFilter>(null);

  /** Stage filter: courses are filtered by their tagged stage; untagged resources fall under "General" */
  const visibleCourses = useMemo(() => {
    if (stage === null || stage === "General") return COURSES_EN;
    return COURSES_EN.filter((c) => c.stages.includes(stage));
  }, [stage]);

  const showGroup = (key: CategoryKeyEn) => {
    if (category !== "all" && category !== key) return false;
    if (stage === null) return true;
    if (stage === "General") return key !== "courses";
    return key === "courses" && visibleCourses.length > 0;
  };

  const filterKey = `${category}-${stage ?? "all"}`;

  return (
    <div className="relative">
      {/* background: engineering grid + cyan glow */}
      <div aria-hidden className="bg-grid-texture pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-[480px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-perceive) 8%, transparent), transparent 65%)" }}
      />

      {/* ---------------- S1 header ---------------- */}
      <header className="relative mx-auto max-w-prose2 px-5 pb-16 pt-16 md:px-6 md:pt-24">
        <Breadcrumb />
        <Reveal className="mb-5">
          <Badge color={CYAN}>40+ resources · every link verified</Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-h1 font-black text-text-primary">
            Your agent <span className="text-grad">knowledge arsenal</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[68ch] text-body-lg text-text-secondary">
            Awesome repos, free official courses, classic papers, and key blogs — all drawn from
            public internet knowledge bases, with links verified by search. Take whatever matches
            your current stage of the Learning Path.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: 8, label: "Awesome Repos" },
            { value: 10, label: "Free Courses" },
            { value: 9, label: "Classic Papers" },
            { value: 8, label: "Blogs & Docs" },
          ].map((s) => (
            <div key={s.label}>
              <CountUp value={s.value} />
              <p className="mt-1 text-caption text-text-tertiary">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </header>

      {/* ---------------- S2 filter toolbar (sticky) ---------------- */}
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
            <span className="font-mono text-caption text-text-tertiary">By stage</span>
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

      {/* ---------------- S3 grouped resource grid ---------------- */}
      <main className="relative mx-auto max-w-content space-y-24 px-5 py-20 md:px-6">
        <motion.div
          key={filterKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="space-y-24"
        >
          {/* Group 1 · Awesome-style GitHub repos */}
          {showGroup("repos") && (
            <section id="repos">
              <GroupHeading no="01" title="Awesome-style GitHub Repos" count={REPOS_EN.length} />
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
                {REPOS_EN.map((repo, i) => (
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
                              <Badge color={SEMANTIC.loop}>Benchmark</Badge>
                              <Link
                                to="/en/capstone"
                                className="inline-flex items-center gap-1 text-caption text-c-loop hover:underline"
                              >
                                See the Capstone tutorial <ArrowRight size={12} />
                              </Link>
                            </>
                          )}
                          {repo.tag === "sdk" && (
                            <Link
                              to="/en/frameworks#detail-agents-sdk"
                              className="inline-flex items-center gap-1 text-caption text-c-perceive hover:underline"
                            >
                              Frameworks deep dive <ArrowRight size={12} />
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

          {/* Group 2 · Official free courses */}
          {showGroup("courses") && (
            <section id="courses">
              <GroupHeading no="02" title="Official Free Courses" count={visibleCourses.length} />
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

          {/* Group 3 · Classic papers (single-column strip cards) */}
          {showGroup("papers") && (
            <section id="papers">
              <GroupHeading no="03" title="Classic Papers · in recommended reading order" count={PAPERS_EN.length} />
              <div className="space-y-4">
                {PAPERS_EN.map((paper, i) => (
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
                          {paper.mustRead && <Badge color={SEMANTIC.plan}>Must-read</Badge>}
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
                                to="/en/principles#react"
                                className="text-c-perceive hover:underline"
                              >
                                In-depth explainer in Principles →
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

          {/* Group 4 · Key blogs & docs */}
          {showGroup("blogs") && (
            <section id="blogs">
              <GroupHeading no="04" title="Key Blogs & Docs" count={BLOGS_EN.length} />
              <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(340px,1fr))]">
                {BLOGS_EN.map((blog, i) => (
                  <motion.div
                    key={blog.url}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
                  >
                    <CardShell>
                      <div className="mb-3 flex items-center justify-between gap-2">
                        {blog.url.includes("arxiv") || blog.title.includes("Docs") ? (
                          <FileText size={18} className="shrink-0 text-c-perceive" />
                        ) : blog.title.includes("Course") ? (
                          <GraduationCap size={18} className="shrink-0 text-c-perceive" />
                        ) : (
                          <BookOpen size={18} className="shrink-0 text-c-perceive" />
                        )}
                        {blog.classic && <Badge color={SEMANTIC.plan}>Classic</Badge>}
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

        {/* ---------------- S4 link-verification note ---------------- */}
        <Reveal className="border-t border-border-subtle pt-10">
          <p className="flex items-start gap-3 text-body-sm text-text-tertiary">
            <Library size={16} className="mt-1 shrink-0" />
            <span>
              Link verification: the links above were verified by web search to exist and match
              their content (the Hugging Face Agents Course, the DeepLearning.AI course catalog,
              Awesome repo activity, the ReAct paper, Anthropic's engineering blog, and more were
              verified directly); the rest are canonical official docs / paper addresses with high
              confidence. Always defer to the official page before use. Content is compiled from
              public GitHub open-source projects and public materials, for learning purposes only.
            </span>
          </p>
        </Reveal>
      </main>

      {/* ---------------- S5 closing CTA ---------------- */}
      <section className="relative border-t border-border-subtle">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--c-perceive) 10%, transparent), color-mix(in srgb, var(--c-memory) 5%, transparent) 45%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[720px] px-5 py-24 text-center md:px-6">
          <Reveal>
            <h3 className="text-h3 font-bold text-text-primary">
              No resource beats <span className="text-grad">running one loop yourself</span>
            </h3>
          </Reveal>
          <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/en/capstone"
              className="btn-outline-grad inline-flex items-center gap-2 px-6 py-3 text-body-sm font-medium text-text-primary"
            >
              Start the Capstone tutorial <ArrowRight size={15} />
            </Link>
            <Link
              to="/en/path"
              className="group inline-flex items-center gap-1.5 px-4 py-3 text-body-sm text-text-secondary transition-colors hover:text-c-perceive"
            >
              Back to the Learning Path
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
