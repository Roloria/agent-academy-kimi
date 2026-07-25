<div align="center">

# 🎓 Agent Academy · 智能体学院

**从原理到实战，走完 Agent 学习的完整周期**

基于公开 GitHub 开源项目、经典论文与互联网知识库系统整理的
**AI Agent 一站式中文学习平台**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

</div>

---

## 🤔 为什么做这个网站？

学 Agent 的人很多，学明白的人很少。教程遍地都是，但它们要么只讲框架 API、要么只复述论文——**缺少一条从「LLM 基础」走到「独立交付完整 Agent 项目」的完整路径**。

Agent Academy 把这条路径修好了：

```
LLM 基础 → Agent 原理 → 框架深入 → 技能进阶 → 🔥 独立交付完整 Agent 项目
 阶段 1      阶段 2       阶段 3      阶段 4         阶段 5（Capstone）
```

不是收藏夹式的链接堆砌，而是**一条有顺序、有产出、有验收的学习流水线**。每个阶段都有明确的目标、主题、资源与交付物——走完它，你将亲手造出一个可写进简历的 Agent 项目。

## ✨ 六大板块

| 板块 | 内容 | 亮点 |
|------|------|------|
| 🏠 **首页** | Agent 循环图解 · 学习路径总览 | 3D 粒子 Agent 环，滚动驱动的"感知→规划→记忆→工具→行动"循环叙事 |
| 🗺️ **学习路径** | 五阶段完整路线图（10–15 周） | 每阶段含目标/主题/精选资源/产出物，sticky 阶段导航，锚点直达 |
| 🧠 **原理知识库** | 6 章教科书级长文 | ReAct · Plan-and-Execute · Reflexion · CoT · 记忆系统 · Function Calling · MCP · 多智能体，配工程图风格插图与 13 条可验证参考文献 |
| ⚔️ **框架横评** | 10 大框架对比 | LangChain/LangGraph · AutoGen · CrewAI · OpenAI Agents SDK · smolagents · LlamaIndex · Semantic Kernel · Dify · Coze —— 可筛选对比表 + 最小代码示例 + 四场景选型向导 |
| 🔥 **实战项目** | 《个人研究助理 Agent》8 步教程 | 基于 OpenAI Agents SDK：自动搜索 → 阅读 → 交叉验证 → 生成带引用的研究报告。全部代码可运行，每步配验收清单 |
| 📚 **资源导航** | 35 条精选资源 | 8 个 awesome 仓库 · 10 门免费课程 · 9 篇经典论文 · 8 篇关键博客，可筛选 |

## 🎯 内容信条

- **可验证**：所有框架 GitHub 链接、star 量级、arXiv 编号、时效信息（如 2025.10 微软 Agent Framework 整合、LangChain 1.0 发布）均经联网核实
- **不断章取义**：代码示例完整可运行，不是伪代码截图
- **区分事实与观点**：经验性判断以「工程观点」明确标注，不冒充真理
- **时效诚实**：框架格局 2025–2026 剧烈变化，维护状态如实标注

## 🎨 设计语言

深色工程美学 × 终端质感。**五语义色即知识框架**，全站一致：

🟦 感知 `#38BDF8` · 🟨 规划 `#FBBF24` · 🟪 记忆 `#A78BFA` · 🟩 工具 `#34D399` · 🟥 循环 `#F472B6`

R3F 粒子环 · GSAP 滚动叙事 · Framer Motion 微交互 · Lenis 平滑滚动 · JetBrains Mono 代码美学

## 🚀 快速开始

```bash
git clone https://github.com/Roloria/agent-academy-kimi.git
cd agent-academy-kimi
npm install
npm run dev        # 开发预览
npm run build      # 构建到 dist/
```

## 📁 项目结构

```
src/
├── components/        # Navbar / Footer / Layout / CodeBlock（复制/折叠/终端变体）
├── pages/
│   ├── home/          # 首页 8 大区块（含 R3F 粒子环）
│   ├── path/          # 学习路径
│   ├── principles/    # 原理知识库（6 章）
│   ├── frameworks/    # 框架横评（对比表 + 详情卡 + 选型）
│   ├── capstone/      # 实战教程（8 步 + 全部代码）
│   └── resources/     # 资源导航
└── lib/semantic.ts    # 五语义色系统
```

## 🗺️ Roadmap

- [ ] **v1.1 内容增强**：MCP 专题章节 · Microsoft Agent Framework 补充 · 深色/浅色模式切换
- [ ] **v1.2 学习闭环**：章节自测题 · 学习进度打卡（localStorage）· 结课证书生成
- [ ] **v1.3 全栈化**：用户登录 · 进度云同步 · 笔记与讨论
- [ ] **v2.0 交互实战**：浏览器内 Agent 演示沙盒 · 配套视频 · 英文版 i18n
- [ ] **持续维护**：每季度复核框架数据与链接有效性

## 🙏 内容来源

本站内容整理自公开资料，包括但不限于：[ReAct](https://arxiv.org/abs/2210.03629) · [Reflexion](https://arxiv.org/abs/2303.11366) · [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) · [Hugging Face Agents Course](https://huggingface.co/learn/agents-course) · 各框架官方文档。各框架商标归其所有者，本站仅供学习交流。

## 📄 License

MIT — 欢迎 Star ⭐ / Fork / 提 Issue 与 PR！
