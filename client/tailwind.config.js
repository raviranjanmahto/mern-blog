/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#f3f4f6",
        primary: "#222222",
        accent: "#34495E",
      },
    },
  },
  plugins: [],
};
