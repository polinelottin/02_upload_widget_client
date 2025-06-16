import { theme } from 'tailwindcss/defaultConfig'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}

