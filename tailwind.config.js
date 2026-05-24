/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./utils/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#fffaf2",
        blush: "#ffd9e8",
        mint: "#c8f7e1",
        skysoft: "#cde7ff",
        lilac: "#ddd6fe",
        ink: "#243042"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(68, 84, 111, 0.14)"
      }
    }
  },
  plugins: []
};
