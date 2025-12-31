/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#29142e",
        "background-light": "#f7f6f7",
        "background-dark": "#100c12",
        "surface-dark": "#1c151e",
        "border-dark": "#3b2d3e",
        "muted-dark": "#b5a0ba",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px",
      },
    },
  },
  plugins: [],
}