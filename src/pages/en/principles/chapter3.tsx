import CodeBlock from "@/components/CodeBlock";
import { Card } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import { ChapterHeading, Explain } from "./shared";

// Pseudocode kept verbatim from the zh edition (code comments stay in Chinese)
const VECTOR_MEMORY_CODE = `# 向量记忆读写示意
def remember(text):
    vector_db.upsert(embedding(text), metadata={"text": text})

def recall(query, k=5):
    results = vector_db.query(embedding(query), top_k=k)
    return [r.metadata["text"] for r in results]

# 主循环中：每轮把 recall(当前任务) 的结果注入提示词
prompt = build_prompt(goal, short_term_history, recall(goal))`;

const WINDOW_STRATEGIES: { name: string; desc: string }[] = [
  { name: "Sliding window", desc: "Keep only the most recent N turns;" },
  { name: "Summarization", desc: "Use the LLM to compress older history into a summary;" },
  { name: "Hierarchical memory", desc: "Pin important information at the top (system prompt) and push details down to a retrieval layer." },
];

const LONG_TERM_TYPES: { name: string; desc: string }[] = [
  { name: "Episodic memory", desc: "records of past interactions" },
  { name: "Semantic memory", desc: "factual knowledge" },
  { name: "Procedural memory", desc: "skills and procedures" },
];

export default function ChapterMemory() {
  return (
    <section aria-label="Chapter 3: Memory Systems" className="mt-24">
      <ChapterHeading id="memory" index={3} title="Memory Systems" color={SEMANTIC.memory} />

      <Explain>
        LLMs have no memory of their own — every call is an amnesiac reunion. An Agent&rsquo;s
        memory is really{" "}
        <strong className="font-bold text-text-primary">external engineering</strong>: short-term
        memory keeps stuffing the recent dialogue and observations into the prompt (bounded by the
        context window); long-term memory works like an external hard drive, vectorizing important
        information into a database and retrieving it by semantic similarity when needed. Memory
        design decides whether an Agent is a &ldquo;goldfish&rdquo; or a &ldquo;veteran&rdquo;.
      </Explain>

      {/* Short-term vs long-term two-column cards */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card accent={SEMANTIC.memory}>
          <p className="text-body font-bold text-text-primary">Short-term Memory</p>
          <p className="font-mono text-caption tracking-[0.08em] text-c-memory">
            短期记忆 / Working Memory
          </p>
          <p className="mt-3 text-body-sm text-text-secondary">
            The conversation history, tool observations and reflection records living inside the
            context window. Immediately usable, but limited in capacity.
          </p>
        </Card>
        <Card accent={SEMANTIC.memory}>
          <p className="text-body font-bold text-text-primary">Long-term Memory</p>
          <p className="font-mono text-caption tracking-[0.08em] text-c-memory">
            长期记忆
          </p>
          <p className="mt-3 text-body-sm text-text-secondary">
            Persisted across sessions, usually in three categories:
          </p>
          <ul className="mt-2 space-y-1.5">
            {LONG_TERM_TYPES.map((t) => (
              <li key={t.name} className="flex gap-2 text-body-sm text-text-secondary">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-c-memory" />
                <span>
                  <strong className="font-semibold text-text-primary">{t.name}</strong> ({t.desc})
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Three context-window management strategies */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">Context Window Management</h4>
      <p className="text-body text-text-secondary">
        When content exceeds the window, trade-offs are required. Common strategies:
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {WINDOW_STRATEGIES.map((s, i) => (
          <Card key={s.name} accent={SEMANTIC.memory} number={`0${i + 1}`} className="p-5">
            <p className="text-body font-bold text-text-primary">{s.name}</p>
            <p className="mt-2 text-body-sm text-text-secondary">{s.desc}</p>
          </Card>
        ))}
      </div>

      {/* Vector-retrieval memory */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">Vector-Retrieval Memory</h4>
      <p className="text-body text-text-secondary">
        Text is embedded into vectors by an embedding model and stored in a vector database;
        relevant fragments are recalled by cosine similarity (the RAG idea applied to memory).
      </p>
      <div className="mt-6">
        <CodeBlock code={VECTOR_MEMORY_CODE} language="python" filename="vector-memory.py" />
      </div>
    </section>
  );
}
