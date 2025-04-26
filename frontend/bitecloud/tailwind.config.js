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
      animation: {
        floating: "float 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
      },
      animationDelay: {
        0: "0ms",
        150: "150ms",
        300: "300ms",
        450: "450ms",
      },
    },
  },
  plugins: [],
}

