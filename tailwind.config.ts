import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18351f",
        sage: "#4f8f45",
        mint: "#e9f5e6",
        clay: "#2f7d32",
        linen: "#f8fcf6",
        paper: "#fffdfa"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 32, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
