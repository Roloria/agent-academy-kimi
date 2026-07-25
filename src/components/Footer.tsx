import { Link } from "react-router";
import { Github, ArrowUpRight } from "lucide-react";

const LEARN_LINKS = [
  { to: "/path", label: "学习路径" },
  { to: "/principles", label: "原理知识库" },
  { to: "/frameworks", label: "框架横评" },
  { to: "/capstone", label: "实战项目" },
  { to: "/resources", label: "资源导航" },
];

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
                从原理到实战，走完 Agent 学习的完整周期。
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
                学习
              </h4>
              <ul className="space-y-2.5">
                {LEARN_LINKS.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-body-sm text-text-secondary hover:text-c-perceive"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <ExtCol title="资源" links={RESOURCE_LINKS} />
            <ExtCol title="参考" links={REF_LINKS} />
          </div>

          {/* 底行 */}
          <div className="mt-12 flex flex-col gap-4 border-t border-border-subtle pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-caption text-text-tertiary">
              本站内容基于公开 GitHub 开源项目与公开资料整理 · 仅供学习 · 各框架商标归其所有者
            </p>
            <p className="font-mono text-caption text-text-tertiary">
              <span className="text-c-perceive">$</span> agent.run("学习"){" "}
              <span className="text-c-tool">✓ 200 OK</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
