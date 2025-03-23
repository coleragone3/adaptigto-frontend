/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB', // Rich blue for trust and technology
        secondary: '#10B981', // Emerald green for success and money
        accent: '#7C3AED', // Purple for luxury and sophistication
        background: {
          dark: '#1E293B', // Slate dark for card table feel
          light: '#F8FAFC', // Light background
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 