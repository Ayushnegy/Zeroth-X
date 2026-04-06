import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        foreground: "#0F172A",
        card: "#FFFFFF",
        primary: "#3B82F6",
        success: "#22C55E",
        border: "#E2E8F0",
        secondaryBg: "#F1F5F9",
        secondaryText: "#64748B",
      },
    },
  },
  plugins: [],
};
export default config;
