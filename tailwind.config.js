/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Agent Academy 设计 token（design.md §2）
        bg: {
          0: "#070A12",
          1: "#0B0F1A",
          2: "#111827",
          3: "#1A2333",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "border-subtle": "#1E293B",
        "border-strong": "#334155",
        "text-primary": "#E8EDF5",
        "text-secondary": "#9AA7BC",
        "text-tertiary": "#5C6B82",
        // Agent 五组件语义色
        "c-perceive": "#38BDF8",
        "c-plan": "#FBBF24",
        "c-memory": "#A78BFA",
        "c-tool": "#34D399",
        "c-loop": "#F472B6",
        "accent-2": "#A78BFA",
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
          DEFAULT: "#38BDF8",
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
        // 代码语法高亮（design.md §2.3）
        syn: {
          keyword: "#C792EA",
          string: "#C3E88D",
          func: "#82AAFF",
          comment: "#546E7A",
          number: "#F78C6C",
          decorator: "#FBBF24",
          variable: "#E8EDF5",
          success: "#34D399",
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
        "grad-main": "linear-gradient(135deg, #38BDF8, #A78BFA)",
        "grad-semantics": "linear-gradient(90deg, #38BDF8, #FBBF24, #A78BFA, #34D399, #F472B6)",
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
