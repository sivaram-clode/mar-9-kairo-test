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
        linkedin: {
          blue: "#0a66c2",
          "blue-hover": "#004182",
          "blue-light": "#e8f3ff",
          bg: "#f3f2ef",
          card: "#ffffff",
          border: "#e0dfdc",
          text: "#000000e6",
          "text-secondary": "#00000099",
          "text-tertiary": "#00000066",
          green: "#057642",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      boxShadow: {
        card: "0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)",
        "card-hover": "0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
