/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)", // 8px
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "main-gray": "var(--main-gray)",
        "dark-gray": "var(--dark-gray)",
        "light-gray": "var(--light-gray)",
        black: "var(--black)",
        destructive: "var(--destructive)",
        "movie-title": "var(--movie-title)",
        "star-yellow": "var(--star-yellow)",
        tag: {
          blue: {
            bg: "var(--tag-blue-bg)",
            text: "var(--tag-blue-text)",
          },
          green: {
            bg: "var(--tag-green-bg)",
            text: "var(--tag-green-text)",
          },
          purple: {
            bg: "var(--tag-purple-bg)",
            text: "var(--tag-purple-text)",
          },
        },
      },
      backgroundImage: {
        "rank-now":
          "linear-gradient(rgba(0,0,0,0.4), rgba(102,102,102,0.4)), linear-gradient(#3C3C3C, #3C3C3C)",
        "rank-best":
          "linear-gradient(rgba(255,255,255,0.2), rgba(0,151,133,0.2)), linear-gradient(#009785, #009785)",
        "rank-review":
          "linear-gradient(rgba(255,255,255,0.2), rgba(157,48,207,0.2)), linear-gradient(#ECC4FF, #ECC4FF)",
        "rank-tag":
          "linear-gradient(rgba(255,255,255,0.2), rgba(35,121,219,0.2)), linear-gradient(#C4E0FF, #C4E0FF)",
        "tag-recomm": "linear-gradient(to right, #FFD5FE, #BCFFFF)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
