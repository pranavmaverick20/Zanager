/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Include all React files for class scanning
  ],
  theme: {
    extend: {
      fontFamily: {
        'zanager': ['Lobster', 'sans-serif'],  // Custom font class
        'navitemfont': ['Outfit', 'sans-serif']
      },
    },
  },
  plugins: [],
}

