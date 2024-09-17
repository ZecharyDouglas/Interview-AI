/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        customGray: "#dee2e6", // Define your custom color here
      },
      fontFamily: {
        sans: ["Inter", "sans"],
      },
    },
  },
  plugins: [],
};
