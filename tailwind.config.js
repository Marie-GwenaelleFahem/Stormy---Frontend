/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#7C3AED',
        'primary-dark': '#5B21B6',
        'secondary': '#EC4899',
        'accent': '#06B6D4',
      },
    },
  },
  plugins: [],
}