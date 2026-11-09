/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-yellow': '#F5C518',
        'dark-bg': '#1A1A1A',
        'dark-surface': '#222222',
        'light-bg': '#F4F5F7'
      }
    },
  },
  plugins: [],
}
