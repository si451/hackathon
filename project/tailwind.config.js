/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cc-green': '#00FF94',
        'cc-green-dark': '#00D67A',
        'cc-black': '#0A0A0A',
        'cc-gray-dark': '#1A1A1A',
        'cc-gray': '#2A2A2A',
        'cc-gray-light': '#3A3A3A',
        'cc-white': '#FFFFFF',
        'cc-off-white': '#F5F5F5',
      },
    },
  },
  plugins: [],
}