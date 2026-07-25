import { createContext } from "react";

export type Lang = "zh" | "en";

export interface LanguageContextValue {
  /** 当前语言（以 URL 为准：/en 前缀 = en，其余 = zh） */
  lang: Lang;
  /** 当前路径是否处于英文分支 */
  isEn: boolean;
  /** 给定 zh 路径，返回当前语言下的等价路径 */
  localize: (zhPath: string) => string;
  /**
   * 切换到另一语言：跳转当前页的另一语言等价路由（/foo ↔ /en/foo，
   * 保留 query 与 hash），并写入 localStorage（v2-design.md §2.3）。
   */
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

/** zh 路径 ↔ en 路径互转 */
export function toEnPath(zhPath: string): string {
  if (zhPath === "/" || zhPath === "") return "/en";
  return `/en${zhPath.startsWith("/") ? zhPath : `/${zhPath}`}`;
}

export function toZhPath(path: string): string {
  if (path === "/en" || path === "/en/") return "/";
  return path.replace(/^\/en(?=\/)/, "");
}
