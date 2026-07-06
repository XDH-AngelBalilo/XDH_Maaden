import type { Config } from "tailwindcss";

// Palette per docs/CDE Backbone - UI Layout.html
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#f4f3f0",
        panel: "#ffffff",
        ink: "#1f2024",
        muted: "#6b6d76",
        gold: "#c9a227",
        "gold-dk": "#9a7b1a",
        charcoal: "#23242a",
        "charcoal-2": "#2e3038",
        ok: "#2e7d32",
        warn: "#b26a00",
        err: "#c62828",
        line: "#e3e1da",
      },
      fontFamily: {
        sans: ["Segoe UI", "system-ui", "sans-serif"],
        mono: ["Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
