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
        gold: {
          DEFAULT: "#C49634",
          light: "#D4AF37",
          dark: "#A67C00",
        },
        surface: {
          DEFAULT: "#121212",
          dark: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C49634 0%, #D4AF37 50%, #A67C00 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
