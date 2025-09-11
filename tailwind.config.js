/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem", // ~20px
        sm: "2rem",
        lg: "3rem",
        xl: "4rem",
        "2xl": "5rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["EB Garamond", "Georgia", "serif"],
      },
      colors: {
        ink: {
          900: "#0a0a0a",
          700: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
};