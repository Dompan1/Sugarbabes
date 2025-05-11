/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4F81', // Pink (huvudfärg)
          light: '#FFA5C4',
          dark: '#E6005C',
        },
        secondary: {
          DEFAULT: '#FF0000', // Red (accent)
          light: '#FF6666',
          dark: '#CC0000',
        },
        background: '#FFFFFF', // White
        text: '#333333', // Dark gray for text
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'DM Sans', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
} 