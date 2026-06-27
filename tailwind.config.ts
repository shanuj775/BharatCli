import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#070B14",
        panel: "#101827",
        cyan: "#00E5FF",
        emerald: "#00D084",
        amber: "#FF9F1C",
        yellow: "#FFD60A",
        danger: "#FF4D4F",
        violet: "#8B5CF6"
      },
      boxShadow: {
        glow: "0 0 32px rgba(0, 229, 255, 0.12)",
        emerald: "0 0 28px rgba(0, 208, 132, 0.14)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Consolas", "monospace"]
      }
    }
  },
  plugins: []
};

export default config;
