import { useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  LanguageContext,
  toEnPath,
  toZhPath,
} from "@/providers/language-context";
import type { Lang, LanguageContextValue } from "@/providers/language-context";

const STORAGE_KEY = "aa-lang";

/**
 * LanguageProvider：中英双语平行路由（v2-design.md §2）。
 * 语言状态以 URL 为唯一事实源；localStorage 仅在用户主动切换后记录偏好，
 * 首次访问不做 IP/浏览器语言强跳。
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isEn = location.pathname === "/en" || location.pathname.startsWith("/en/");
  const lang: Lang = isEn ? "en" : "zh";

  // <html lang> 同步（zh-CN / en）
  useEffect(() => {
    document.documentElement.lang = isEn ? "en" : "zh-CN";
  }, [isEn]);

  const localize = useCallback(
    (zhPath: string) => (isEn ? toEnPath(zhPath) : zhPath),
    [isEn],
  );

  const toggleLanguage = useCallback(() => {
    const targetPath = isEn
      ? toZhPath(location.pathname)
      : toEnPath(location.pathname);
    try {
      window.localStorage.setItem(STORAGE_KEY, isEn ? "zh" : "en");
    } catch {
      /* ignore */
    }
    navigate(`${targetPath}${location.search}${location.hash}`);
  }, [isEn, location.pathname, location.search, location.hash, navigate]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, isEn, localize, toggleLanguage }),
    [lang, isEn, localize, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}
