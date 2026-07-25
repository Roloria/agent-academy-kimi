import { useCallback, useContext } from "react";
import { LanguageContext } from "@/providers/language-context";
import type { LanguageContextValue } from "@/providers/language-context";

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <LanguageProvider>");
  return ctx;
}

/** 文案辅助：按当前语言取文案（组件内快捷方式） */
export function useT() {
  const { lang } = useLanguage();
  return useCallback(<T,>(zh: T, en: T): T => (lang === "en" ? en : zh), [lang]);
}
