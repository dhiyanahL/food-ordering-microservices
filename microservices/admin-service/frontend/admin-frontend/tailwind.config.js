/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkGreen: "#103713",
        oliveGreen: "#628B35",
        lightGreen: "#A3C394",
        softBeige: "#F2EBE3",
        offWhite: "#FFFDF5",
      },
      fontFamily: {
        kalnia: ['"Kalnia"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

