/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'eomc': {
          'black': '#000000',
          'white': '#FFFFFF',
          'orange': '#FF6B35',
          'purple': '#8B5CF6',
          'pink': '#EC4899',
          'cyan': '#06B6D4',
          'blue': '#3B82F6',
          'grass': '#4ADE80',
          'gray-light': '#F3F4F6',
          'lips': '#DC2626',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
