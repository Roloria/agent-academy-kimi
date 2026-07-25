import type { CSSProperties } from "react";

/** 语义色（Agent 五组件色彩语言，design.md §2.2） */
export const SEMANTIC = {
  perceive: "#38BDF8",
  plan: "#FBBF24",
  memory: "#A78BFA",
  tool: "#34D399",
  loop: "#F472B6",
} as const;

export type SemanticColor = keyof typeof SEMANTIC;

export function semanticColor(key: SemanticColor | string): string {
  return SEMANTIC[key as SemanticColor] ?? key;
}

/** 语义色工具样式（10% 底 / 同色文字 / 30% 描边） */
export function semanticStyle(color: string): CSSProperties {
  return {
    backgroundColor: `${color}1A`,
    color,
    borderColor: `${color}4D`,
  };
}
