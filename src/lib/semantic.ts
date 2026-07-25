import type { CSSProperties } from "react";

/**
 * 语义色（Agent 五组件色彩语言，design.md §2.2）。
 * v2 起全部引用 CSS 变量（v2-design.md §1）：深色 = v1 亮色板，
 * 浅色 = 加深版（light-mode.md §2），由 <html data-theme> 切换。
 */
export const SEMANTIC = {
  perceive: "var(--c-perceive)",
  plan: "var(--c-plan)",
  memory: "var(--c-memory)",
  tool: "var(--c-tool)",
  loop: "var(--c-loop)",
} as const;

export type SemanticColor = keyof typeof SEMANTIC;

export function semanticColor(key: SemanticColor | string): string {
  return SEMANTIC[key as SemanticColor] ?? key;
}

/**
 * 语义色透明版（替代 v1 的 hex 后缀拼接，如 `${color}1A`）。
 * pct 为不透明度百分比：10 ≈ 1A、8 ≈ 14、20 ≈ 33、30 ≈ 4D、40 ≈ 66。
 */
export function semanticAlpha(color: string, pct: number): string {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

/** 语义色工具样式（10% 底 / 同色文字 / 30% 描边） */
export function semanticStyle(color: string): CSSProperties {
  return {
    backgroundColor: semanticAlpha(color, 10),
    color,
    borderColor: semanticAlpha(color, 30),
  };
}
