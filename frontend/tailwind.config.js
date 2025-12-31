/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#bc06f9",
        "background-light": "#f8f5f8",
        "background-dark": "#121212",
        "primary-text": "#E0E0E0",
        "accent-start": "#8A2BE2",
        "accent-end": "#4169E1",
        "sidebar-dark": "rgba(24, 24, 24, 0.5)",
        "accent-dark": "#1A1A1A",
      },
      fontFamily: {
        "display": ["Poppins", "sans-serif"],
        "body": ["Inter", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
      boxShadow: {
        'neumorphic': '5px 5px 10px #0a0a0a, -5px -5px 10px #1a1a1a',
        'neumorphic-inset': 'inset 5px 5px 10px #0a0a0a, inset -5px -5px 10px #1a1a1a',
      },
    },
  },
  plugins: [],
}