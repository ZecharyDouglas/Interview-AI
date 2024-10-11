// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         customGray: "#dee2e6", // Define your custom color here
//       },
//       fontFamily: {
//         sans: ["Inter", "sans"],
//       },
//     },
//   },
//   plugins: [],
// };
// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Adjust based on your folder structure
    "./public/index.html", // Add any other files where Tailwind classes are used
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        customdarkblue: "#00F",
        custommiddleblue: "#36F",
        customlightblue: "#69F",
        customlighterblue: "#9CF",
        customverylightblue: "#CCF",
      },
    },
  },
};
