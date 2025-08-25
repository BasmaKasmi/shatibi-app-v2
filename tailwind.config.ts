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
        "shatibi-orange": "#FD9340",
        "shatibi-red": "#FF2525",
        "shatibi-green": "#19CE15",
        "shatibi-grey": "#898989",
        "shatibi-blue": "#46B5F3",
        "shatibi-purple": "#9747FF",
      },
    },
  },
  plugins: [],
};

export default config;
