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
        // New 5-tone indigo palette
        indigo:     "#3D52A0",
        periwinkle: "#7091E6",
        slate:      "#8697C4",
        silver:     "#ADBBDA",
        lavender:   "#EDE8F5",

        // Semantic aliases
        surface:    "#FFFFFF",
        "bg-1":     "#EDE8F5",
        "bg-2":     "#ddd8ee",
        border:     "#ADBBDA",
        muted:      "#8697C4",

        // Legacy brand aliases kept for backward compat
        deep:       "#3D52A0",
        neon:       "#7091E6",
        "mc-blue":  "#7091E6",
        "mc-pink":  "#8697C4",
        "mc-yellow":"#ADBBDA",

        brand: {
          50:      "#EDE8F5",
          100:     "#ADBBDA",
          500:     "#7091E6",
          600:     "#3D52A0",
          700:     "#2c3e80",
          accent:  "#7091E6",
          cyan:    "#8697C4",
          emerald: "#10b981",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card:  "0 1px 3px rgba(61,82,160,.07), 0 4px 16px rgba(61,82,160,.10)",
        hover: "0 4px 8px rgba(61,82,160,.10), 0 12px 32px rgba(61,82,160,.16)",
        input: "0 0 0 3px rgba(112,145,230,.18)",
        glow:  "0 2px 12px rgba(61,82,160,.25)",
        "glow-emerald": "0 2px 12px rgba(16,185,129,.25)",
      },
      borderRadius: {
        card: "16px",
        btn:  "12px",
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #3D52A0 0%, #7091E6 60%, #ADBBDA 100%)",
        "gradient-cta":  "linear-gradient(135deg, #3D52A0 0%, #5a70c0 100%)",
        "gradient-soft": "linear-gradient(135deg, #EDE8F5 0%, #ADBBDA 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
