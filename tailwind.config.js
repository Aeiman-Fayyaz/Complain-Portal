/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D76BA",
        secondary: "#8EC748",
        accent: "#EAF2F7",
      },
      backgroundImage: {
        'gradient-primary': "linear-gradient(to right, #0D76BA, #8EC748)",
        'gradient-secondary': "linear-gradient(to right, #8EC748, #0D76BA)",
      },
      animation: {
        slideUp: "slideUp 0.5s ease-out",
        fadeIn: "fadeIn 0.3s ease-in",
        scaleIn: "scaleIn 0.3s ease-out",
        spin: "spin 1s linear infinite",
      },
      keyframes: {
        slideUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      boxShadow: {
        "card": "0 10px 30px rgba(13, 118, 186, 0.1)",
        "card-lg": "0 20px 40px rgba(13, 118, 186, 0.15)",
      },
      borderRadius: {
        "xl": "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
    },
  },
  plugins: [],
}
