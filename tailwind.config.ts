import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#04070F",
          900: "#060B18",
          850: "#0A1226",
          800: "#0D1830",
          700: "#13203D",
          600: "#1B2C50",
        },
        spark: {
          DEFAULT: "#2D9CFF",
          soft: "#6FBCFF",
          dim: "#1A6FCB",
        },
        royal: {
          DEFAULT: "#5F29EA",
          soft: "#8B5CF6",
        },
        mist: {
          100: "#EAF1FB",
          200: "#CCDAF0",
          300: "#A9BEDD",
          400: "#8DA2BF",
          500: "#64789A",
        },
        gain: "#2BD98B",
        loss: "#FF5C7A",
        gold: "#F2B544",
      },
      fontFamily: {
        sans: ["var(--font-plex)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 40px -12px rgba(45, 156, 255, 0.45)",
        card: "0 8px 30px -12px rgba(2, 8, 23, 0.8)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
