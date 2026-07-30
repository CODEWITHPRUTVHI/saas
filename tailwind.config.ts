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
        // User Palette Hex Mapping
        indigo:     "#3D52A0", // Deep Royal Indigo
        periwinkle: "#7091E6", // Electric Periwinkle Blue
        slate:      "#8697C4", // Slate Blue
        silver:     "#ADBBDA", // Soft Silver Blue
        lavender:   "#EDE8F5", // Soft Lavender Background

        // Semantic aliases
        surface:    "#FFFFFF",
        "bg-1":     "#EDE8F5",
        "bg-2":     "#E3DCF0",
        border:     "#ADBBDA",
        muted:      "#8697C4",

        // Brand Aliases
        deep:       "#3D52A0",
        neon:       "#7091E6",
        "mc-blue":  "#7091E6",
        "mc-pink":  "#8697C4",
        "mc-yellow":"#ADBBDA",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(61, 82, 160, 0.08), 0 0 0 1px #ADBBDA",
        hover:"0 8px 28px -4px rgba(61, 82, 160, 0.16), 0 0 0 1.5px #7091E6",
        glow: "0 0 20px rgba(112, 145, 230, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
