import { ArrowUpRight, BookOpen, FileText } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui-extra";
import { ChapterHeading } from "./shared";

interface RefItem {
  no: string;
  title: string;
  source: string;
  href: string;
}

// Paper titles kept in their original language (they are proper citations)
const PAPERS: RefItem[] = [
  {
    no: "01",
    title: "ReAct: Synergizing Reasoning and Acting in Language Models",
    source: "Yao et al., ICLR 2023",
    href: "https://arxiv.org/abs/2210.03629",
  },
  {
    no: "02",
    title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models",
    source: "Wei et al., NeurIPS 2022",
    href: "https://arxiv.org/abs/2201.11903",
  },
  {
    no: "03",
    title: "Reflexion: Language Agents with Verbal Reinforcement Learning",
    source: "Shinn et al., NeurIPS 2023",
    href: "https://arxiv.org/abs/2303.11366",
  },
  {
    no: "04",
    title:
      "Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large Language Models",
    source: "Wang et al., ACL 2023",
    href: "https://arxiv.org/abs/2305.04091",
  },
  {
    no: "05",
    title: "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation",
    source: "Wu et al., 2023",
    href: "https://arxiv.org/abs/2308.08155",
  },
  {
    no: "06",
    title: "A Survey on Large Language Model based Autonomous Agents",
    source: "Wang et al., 2023",
    href: "https://arxiv.org/abs/2308.11432",
  },
];

const RESOURCES: RefItem[] = [
  {
    no: "07",
    title: "OpenAI Function Calling Guide",
    source: "platform.openai.com",
    href: "https://platform.openai.com/docs/guides/function-calling",
  },
  {
    no: "08",
    title: "Anthropic Tool Use Documentation",
    source: "docs.anthropic.com",
    href: "https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview",
  },
  {
    no: "09",
    title: "Anthropic engineering blog: Building Effective Agents (the Workflow vs. Agent distinction)",
    source: "anthropic.com",
    href: "https://www.anthropic.com/engineering/building-effective-agents",
  },
  {
    no: "10",
    title: "Model Context Protocol Official Documentation",
    source: "modelcontextprotocol.io",
    href: "https://modelcontextprotocol.io/introduction",
  },
  {
    no: "11",
    title: "BabyAGI official repository (early practice of the Plan-and-Execute idea)",
    source: "github.com/yoheinakajima/babyagi",
    href: "https://github.com/yoheinakajima/babyagi",
  },
  {
    no: "12",
    title: "LangChain Plan-and-Execute Documentation",
    source: "python.langchain.com",
    href: "https://python.langchain.com/docs/how_to/plan_and_execute/",
  },
  {
    no: "13",
    title: "CrewAI Official Documentation",
    source: "docs.crewai.com",
    href: "https://docs.crewai.com/",
  },
];

function RefGroup({
  icon,
  title,
  items,
  delay = 0,
}: {
  icon: ReactNode;
  title: string;
  items: RefItem[];
  delay?: number;
}) {
  return (
    <div>
      <h4 className="mb-4 flex items-center gap-2 text-h4 font-bold text-text-primary">
        <span className="text-c-plan">{icon}</span>
        {title}
      </h4>
      <ul className="overflow-hidden rounded-xl border border-border-subtle">
        {items.map((item, i) => (
          <li key={item.no}>
            <Reveal delay={delay + i * 0.04} y={12}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline gap-4 border-b border-border-subtle px-4 py-3.5 transition-colors duration-200 last:border-0 hover:bg-bg-2"
              >
                <span className="shrink-0 font-mono text-caption text-text-tertiary">
                  {item.no}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-body-sm font-medium text-text-primary">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block font-mono text-caption text-text-tertiary">
                    {item.source}
                  </span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 self-center text-text-tertiary transition-transform duration-[250ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-c-perceive"
                />
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChapterReferences() {
  return (
    <section aria-label="Chapter 6: References" className="mt-24">
      <ChapterHeading id="references" index={6} title="References" />
      <p className="mb-10 text-body text-text-secondary">
        Every factual claim in this chapter is publicly verifiable. The papers and official
        documentation below are the best entry points for going deeper.
      </p>
      <div className="space-y-12">
        <RefGroup icon={<FileText size={18} />} title="Papers" items={PAPERS} />
        <RefGroup icon={<BookOpen size={18} />} title="Official Docs & Resources" items={RESOURCES} delay={0.1} />
      </div>
    </section>
  );
}
