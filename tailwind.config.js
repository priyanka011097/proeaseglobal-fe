/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ethnic-wear palette inspired by classic Indian e-commerce stores
        maroon: {
          DEFAULT: '#7B1530',
          dark: '#5E0F24',
          light: '#9B2748',
        },
        blush: '#FFF6F2',
        cream: '#FBEEE8',
        beige: '#F3E3D8',
        sale: '#C0392B',
        ink: '#2B2B2B',
      },
      fontFamily: {
        body: ['Belleza', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        prata: ['Prata', 'serif'],
      },
    },
  },
  plugins: [],
}
