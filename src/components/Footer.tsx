import { Link } from "react-router";
import { Github, ArrowUpRight } from "lucide-react";
import { useLanguage, useT } from "@/providers/use-language";

/** 「学习」栏（v2 新增 MCP 专题、沙盒演示，v2-design.md §3.3） */
const LEARN_LINKS = [
  { to: "/path", zh: "学习路径", en: "Learning Path" },
  { to: "/principles", zh: "原理知识库", en: "Principles" },
  { to: "/frameworks", zh: "框架横评", en: "Frameworks" },
  { to: "/mcp", zh: "MCP 专题", en: "MCP Deep Dive" },
  { to: "/capstone", zh: "实战项目", en: "Capstone Project" },
  { to: "/sandbox", zh: "沙盒演示", en: "Sandbox" },
  { to: "/resources", zh: "资源导航", en: "Resources" },
] as const;

const RESOURCE_LINKS = [
  { href: "https://huggingface.co/learn/agents-course", label: "Hugging Face Agents Course" },
  { href: "https://www.deeplearning.ai/short-courses/", label: "DeepLearning.AI 短课" },
  { href: "https://github.com/e2b-dev/awesome-ai-agents", label: "awesome-ai-agents" },
  { href: "https://github.com/openai/openai-cookbook", label: "OpenAI Cookbook" },
];

const REF_LINKS = [
  { href: "https://arxiv.org/abs/2210.03629", label: "ReAct 论文" },
  { href: "https://www.anthropic.com/engineering/building-effective-agents", label: "Anthropic 工程博客" },
  { href: "https://modelcontextprotocol.io", label: "MCP 文档" },
];

function ExtCol({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-body-sm text-text-secondary hover:text-c-perceive"
            >
              {label}
              <ArrowUpRight
                size={13}
                className="opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { localize } = useLanguage();
  const t = useT();
  return (
    <footer className="relative mt-24">
      {/* 五色语义渐变线 + 分隔线 */}
      <div className="h-0.5 w-full bg-grad-semantics opacity-70" />
      <div className="border-t border-border-subtle bg-bg-1">
        <div className="mx-auto max-w-content px-6 py-14 max-md:px-5">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* 品牌 */}
            <div>
              <div className="flex items-center gap-2.5">
                <img src="/logo.svg" alt="" className="h-6 w-6" />
                <span className="font-display text-[16px] font-bold">
                  <span className="text-c-perceive">Agent</span>{" "}
                  <span className="text-text-primary">Academy</span>
                </span>
              </div>
              <p className="mt-4 max-w-xs text-body-sm text-text-secondary">
                {t(
                  "从原理到实战，走完 Agent 学习的完整周期。",
                  "From first principles to a shipped project — the full agent learning cycle.",
                )}
              </p>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="mt-5 inline-flex rounded-lg border border-border-subtle p-2 text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
              >
                <Github size={17} />
              </a>
            </div>

            {/* 学习 */}
            <div>
              <h4 className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-text-tertiary">
                {t("学习", "Learn")}
              </h4>
              <ul className="space-y-2.5">
                {LEARN_LINKS.map(({ to, zh, en }) => (
                  <li key={to}>
                    <Link
                      to={localize(to)}
                      className="text-body-sm text-text-secondary hover:text-c-perceive"
                    >
                      {t(zh, en)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ExtCol title={t("资源", "Resources")} links={RESOURCE_LINKS} />
            <ExtCol title={t("参考", "Reference")} links={REF_LINKS} />
          </div>

          {/* 底行（终端装饰行双语彩蛋，v2-design.md §3.3） */}
          <div className="mt-12 flex flex-col gap-4 border-t border-border-subtle pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-caption text-text-tertiary">
              {t(
                "本站内容基于公开 GitHub 开源项目与公开资料整理 · 仅供学习 · 各框架商标归其所有者",
                "Curated from public open-source projects and public materials · For learning only · Trademarks belong to their owners",
              )}
            </p>
            <p className="w-fit rounded-full border border-panel-border bg-panel px-3 py-1 font-mono text-caption text-panel-text-2">
              <span className="text-panel-accent">$</span> agent.run(
              {t('"学习"', '"learn"')}) <span className="text-syn-success">✓ 200 OK</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
