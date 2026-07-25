<div align="center">

# 🎓 Agent Academy · 智能体学院

**从原理到实战，走完 Agent 学习的完整周期**

基于公开 GitHub 开源项目、经典论文与互联网知识库系统整理的
**AI Agent 一站式中文学习平台（含全站英文版）**

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

## ✨ 八大板块（v2）

| 板块 | 内容 | 亮点 |
|------|------|------|
| 🏠 **首页** | Agent 循环图解 · 学习路径总览 · 导览视频 | 3D 粒子 Agent 环，滚动驱动的"感知→规划→记忆→工具→行动"循环叙事 |
| 🗺️ **学习路径** | 五阶段完整路线图（10–15 周） | 每阶段含目标/主题/精选资源/产出物，sticky 阶段导航，锚点直达 |
| 🧠 **原理知识库** | 6 章教科书级长文 | ReAct · Plan-and-Execute · Reflexion · CoT · 记忆系统 · Function Calling · MCP · 多智能体 |
| ⚔️ **框架横评** | 11 大框架对比 | MAF · LangChain/LangGraph · AutoGen · CrewAI · OpenAI Agents SDK · smolagents · LlamaIndex · Semantic Kernel · Dify · Coze —— 可筛选对比表 + 最小代码示例 + 选型向导 |
| 🔌 **MCP 专题** | Model Context Protocol 深度专题（v2 新增） | FastMCP Server 动手实战 · FC vs MCP 对比 · 生态图谱 · 安全最佳实践 |
| 🔥 **实战项目** | 《个人研究助理 Agent》8 步教程 | 基于 OpenAI Agents SDK，全部代码可运行，每步配验收清单 |
| 🕹️ **沙盒演示** | 浏览器内 Agent 运行模拟（v2 新增） | 输入主题 → 流式回放 Thought/Action/Observation 全流程 → 生成迷你报告（显著标注"模拟演示"） |
| 📚 **资源导航** | 35 条精选资源 | 8 个 awesome 仓库 · 10 门免费课程 · 9 篇经典论文 · 8 篇关键博客，可筛选 |

**全站中英双语**（`/en` 平行路由）· **深色/浅色模式切换** · 16 条路由

## 🎯 内容信条

- **可验证**：所有框架 GitHub 链接、star 量级、arXiv 编号、时效信息（如 2026.4.3 MAF 1.0 GA、LangChain 1.0 发布）均经联网核实
- **不断章取义**：代码示例完整可运行，不是伪代码截图
- **区分事实与观点**：经验性判断以「工程观点」明确标注，不冒充真理
- **诚实模拟**：沙盒页所有输出为前端模板回放并显著标注，不冒充真实模型调用

## 🎨 设计语言

深色工程美学 × 终端质感（支持浅色模式）。**五语义色即知识框架**，全站一致：

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

> ⚠️ 说明：`public/intro-loop.mp4` 与 `public/video-poster.jpg`（导览视频及封面帧）为二进制资产，未包含在本仓库中——移除 `src/pages/home/SiteTour.tsx` 引用或自行补入同名文件即可正常构建。`package-lock.json` 同样未包含，`npm install` 会自动生成。

## 📁 项目结构

```
src/
├── components/        # Navbar / Footer / Layout / CodeBlock（复制/折叠/终端变体/双语）
├── providers/         # LanguageProvider（中英双语，URL 平行路由）
├── hooks/             # use-theme（深色/浅色切换）
├── pages/
│   ├── home/          # 首页（含 R3F 粒子环、SiteTour 视频导览带）
│   ├── path/          # 学习路径
│   ├── principles/    # 原理知识库（6 章）
│   ├── frameworks/    # 框架横评（11 框架，含 MAF）
│   ├── mcp/           # MCP 专题（v2）
│   ├── sandbox/       # Agent 演示沙盒（v2）
│   ├── capstone/      # 实战教程（8 步 + 全部代码）
│   ├── resources/     # 资源导航
│   └── en/            # 全站英文版
└── lib/semantic.ts    # 五语义色系统（CSS 变量双主题）
```

## 🗺️ Roadmap

- [x] **v1.0**：6 大页面 · 五阶段学习路径 · 10 框架横评 · Capstone 实战教程
- [x] **v1.1 内容增强** ✅：MCP 专题页 `/mcp` · Microsoft Agent Framework 详情卡 · 深色/浅色模式切换
- [x] **v2.0 交互实战** ✅：Agent 演示沙盒 `/sandbox` · 导览视频 · 全站英文版 `/en`
- [ ] **v1.2 学习闭环**：章节自测题 · 学习进度打卡（localStorage）· 结课证书生成
- [ ] **v1.3 全栈化**：用户登录 · 进度云同步 · 笔记与讨论
- [ ] **持续维护**：每季度复核框架数据与链接有效性

## 🙏 内容来源

本站内容整理自公开资料，包括但不限于：[ReAct](https://arxiv.org/abs/2210.03629) · [Reflexion](https://arxiv.org/abs/2303.11366) · [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) · [Hugging Face Agents Course](https://huggingface.co/learn/agents-course) · [MCP 官方文档](https://modelcontextprotocol.io) · 各框架官方文档。各框架商标归其所有者，本站仅供学习交流。

## 📄 License

MIT — 欢迎 Star ⭐ / Fork / 提 Issue 与 PR！
