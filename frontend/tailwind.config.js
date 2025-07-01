/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Invoom Brand Colors
        invoom: {
          primary: '#1e2a5c',      // Dark Blue (main brand color)
          secondary: '#FFB800',    // Yellow/Orange (accent color)
          dark: '#121222',         // Very Dark (text/dark elements)
          light: '#f8f9fa',       // Light background
        },
        // Alias for primary colors
        primary: {
          50: '#eff2ff',
          100: '#e2e8ff',
          200: '#c9d4fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#1e2a5c',  // Main brand blue
          950: '#121222',  // Very dark
        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#FFB800',  // Main brand yellow
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        'sans': ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
