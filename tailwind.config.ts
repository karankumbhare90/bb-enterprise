import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0f172a", // Deep Navy
          container: "#131b2e",
        },
        secondary: {
          DEFAULT: "#1e293b", // Slate Blue
          container: "#d5e0f8",
        },
        tertiary: {
          DEFAULT: "#10b981", // Emerald Green (Success/Action)
          container: "#002113",
        },
        background: "#f7f9fb",
        surface: {
          DEFAULT: "#ffffff",
          dim: "#d8dadc",
          bright: "#f7f9fb",
          lowest: "#ffffff",
          low: "#f2f4f6",
          "container-lowest": "#ffffff",
          "container-low": "#f2f4f6",
          container: "#eceef0",
          "container-high": "#e6e8ea",
          "container-highest": "#e0e3e5",
          high: "#e6e8ea",
          highest: "#e0e3e5",
          variant: "#e0e3e5",
          tint: "#565e74",
        },
        text: {
          primary: "#191c1e", // on-surface
          secondary: "#45464d", // on-surface-variant
        },
        outline: {
          DEFAULT: "#76777d",
          variant: "#c6c6cd",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["32px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "1.4", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-md": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "1", fontWeight: "500" }],
      },
      spacing: {
        base: "4px",
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        "2xl": "64px",
        "container-max": "1280px",
        gutter: "24px",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
