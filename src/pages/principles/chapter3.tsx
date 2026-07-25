import CodeBlock from "@/components/CodeBlock";
import { Card } from "@/components/ui-extra";
import { SEMANTIC } from "@/lib/semantic";
import { ChapterHeading, Explain } from "./shared";

const VECTOR_MEMORY_CODE = `# 向量记忆读写示意
def remember(text):
    vector_db.upsert(embedding(text), metadata={"text": text})

def recall(query, k=5):
    results = vector_db.query(embedding(query), top_k=k)
    return [r.metadata["text"] for r in results]

# 主循环中：每轮把 recall(当前任务) 的结果注入提示词
prompt = build_prompt(goal, short_term_history, recall(goal))`;

const WINDOW_STRATEGIES: { name: string; desc: string }[] = [
  { name: "滑动窗口", desc: "只保留最近 N 轮；" },
  { name: "摘要压缩", desc: "用 LLM 把旧历史压缩成摘要；" },
  { name: "分层记忆", desc: "重要信息置顶（系统提示）、细节下沉到检索层。" },
];

const LONG_TERM_TYPES: { name: string; desc: string }[] = [
  { name: "情景记忆", desc: "过往交互记录" },
  { name: "语义记忆", desc: "事实知识" },
  { name: "程序性记忆", desc: "技能与流程" },
];

export default function ChapterMemory() {
  return (
    <section aria-label="第三章 记忆系统" className="mt-24">
      <ChapterHeading id="memory" index={3} title="记忆系统" color={SEMANTIC.memory} />

      <Explain>
        LLM 本身没有记忆——每次调用都是"失忆重逢"。Agent 的记忆其实是
        <strong className="font-bold text-text-primary">外部工程</strong>
        ：短期记忆就是把最近的对话和观察不断塞进提示词（受上下文窗口容量限制）；长期记忆则像外挂硬盘，把重要信息向量化存进数据库，需要时按语义相似度检索回来。记忆系统的设计决定了
        Agent 是"金鱼"还是"老兵"。
      </Explain>

      {/* 短期 vs 长期 双列对比卡 */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Card accent={SEMANTIC.memory}>
          <p className="text-body font-bold text-text-primary">短期记忆</p>
          <p className="font-mono text-caption tracking-[0.08em] text-c-memory">
            Short-term / Working Memory
          </p>
          <p className="mt-3 text-body-sm text-text-secondary">
            即上下文窗口内的对话历史、工具观察、反思记录。直接可用但容量有限。
          </p>
        </Card>
        <Card accent={SEMANTIC.memory}>
          <p className="text-body font-bold text-text-primary">长期记忆</p>
          <p className="font-mono text-caption tracking-[0.08em] text-c-memory">
            Long-term Memory
          </p>
          <p className="mt-3 text-body-sm text-text-secondary">跨会话持久化，常分为三类：</p>
          <ul className="mt-2 space-y-1.5">
            {LONG_TERM_TYPES.map((t) => (
              <li key={t.name} className="flex gap-2 text-body-sm text-text-secondary">
                <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-c-memory" />
                <span>
                  <strong className="font-semibold text-text-primary">{t.name}</strong>（{t.desc}）
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* 上下文窗口管理三策略 */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">上下文窗口管理</h4>
      <p className="text-body text-text-secondary">超出窗口时需取舍，常见策略：</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {WINDOW_STRATEGIES.map((s, i) => (
          <Card key={s.name} accent={SEMANTIC.memory} number={`0${i + 1}`} className="p-5">
            <p className="text-body font-bold text-text-primary">{s.name}</p>
            <p className="mt-2 text-body-sm text-text-secondary">{s.desc}</p>
          </Card>
        ))}
      </div>

      {/* 向量检索记忆 */}
      <h4 className="mb-4 mt-12 text-h4 font-bold text-text-primary">向量检索记忆</h4>
      <p className="text-body text-text-secondary">
        文本经 Embedding
        模型转为向量存入向量数据库，按余弦相似度召回相关片段（RAG 思想在记忆上的应用）。
      </p>
      <div className="mt-6">
        <CodeBlock code={VECTOR_MEMORY_CODE} language="python" filename="vector-memory.py" />
      </div>
    </section>
  );
}
