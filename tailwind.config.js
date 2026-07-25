/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Agent Academy 设计 token（v2-design.md §1：全部引用 CSS 变量，支持深/浅双主题）。
        // 注：颜色走 RGB 通道变量（--*-ch）以兼容 /opacity 修饰符；
        // 完整 hex 变量（--*）仍保留，供渐变、color-mix 与内联样式使用。
        bg: {
          0: "rgb(var(--bg-0-ch) / <alpha-value>)",
          1: "rgb(var(--bg-1-ch) / <alpha-value>)",
          2: "rgb(var(--bg-2-ch) / <alpha-value>)",
          3: "rgb(var(--bg-3-ch) / <alpha-value>)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "border-subtle": "rgb(var(--border-subtle-ch) / <alpha-value>)",
        "border-strong": "rgb(var(--border-strong-ch) / <alpha-value>)",
        "text-primary": "rgb(var(--text-primary-ch) / <alpha-value>)",
        "text-secondary": "rgb(var(--text-secondary-ch) / <alpha-value>)",
        "text-tertiary": "rgb(var(--text-tertiary-ch) / <alpha-value>)",
        // Agent 五组件语义色
        "c-perceive": "rgb(var(--c-perceive-ch) / <alpha-value>)",
        "c-plan": "rgb(var(--c-plan-ch) / <alpha-value>)",
        "c-memory": "rgb(var(--c-memory-ch) / <alpha-value>)",
        "c-tool": "rgb(var(--c-tool-ch) / <alpha-value>)",
        "c-loop": "rgb(var(--c-loop-ch) / <alpha-value>)",
        "accent-2": "rgb(var(--accent-2-ch) / <alpha-value>)",
        // 固定深色面板（两主题一致：代码块/终端/工程图容器）
        panel: {
          DEFAULT: "rgb(var(--panel-bg-ch) / <alpha-value>)",
          2: "rgb(var(--panel-bg-2-ch) / <alpha-value>)",
          border: "rgb(var(--panel-border-ch) / <alpha-value>)",
          text: {
            DEFAULT: "rgb(var(--panel-text-ch) / <alpha-value>)",
            2: "rgb(var(--panel-text-2-ch) / <alpha-value>)",
            3: "rgb(var(--panel-text-3-ch) / <alpha-value>)",
          },
          accent: "rgb(var(--panel-accent-ch) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-ch) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 代码语法高亮（v2-design.md §1.2，两主题一致）
        syn: {
          keyword: "rgb(var(--syn-keyword-ch) / <alpha-value>)",
          string: "rgb(var(--syn-string-ch) / <alpha-value>)",
          func: "rgb(var(--syn-fn-ch) / <alpha-value>)",
          comment: "rgb(var(--syn-comment-ch) / <alpha-value>)",
          number: "rgb(var(--syn-num-ch) / <alpha-value>)",
          decorator: "rgb(var(--syn-tag-ch) / <alpha-value>)",
          variable: "rgb(var(--syn-var-ch) / <alpha-value>)",
          success: "rgb(var(--syn-ok-ch) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', "ui-sans-serif", "system-ui", "sans-serif"],
        display: ['"Space Grotesk"', '"Noto Sans SC"', "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["clamp(44px, 7vw, 84px)", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h1: ["clamp(34px, 5vw, 56px)", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h2: ["clamp(28px, 3.6vw, 40px)", { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        h3: ["24px", { lineHeight: "1.35", letterSpacing: "-0.01em" }],
        h4: ["19px", { lineHeight: "1.4" }],
        "body-lg": ["18px", { lineHeight: "1.75" }],
        body: ["16.5px", { lineHeight: "1.8" }],
        "body-sm": ["14.5px", { lineHeight: "1.7" }],
        caption: ["13px", { lineHeight: "1.5" }],
        code: ["14.5px", { lineHeight: "1.7" }],
      },
      maxWidth: {
        content: "1200px",
        prose2: "880px",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "glow-cyan": "0 8px 24px rgba(56,189,248,.25)",
      },
      backgroundImage: {
        "grad-main": "linear-gradient(135deg, var(--c-perceive), var(--c-memory))",
        "grad-semantics":
          "linear-gradient(90deg, var(--c-perceive), var(--c-plan), var(--c-memory), var(--c-tool), var(--c-loop))",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "float-y": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "float-y": "float-y 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
