/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      colors: {
        primary: '#4F46E5',
        success: '#10B981',
        danger: '#EF4444',
        neutral: {
          50: '#F9FAFB',
          200: '#E5E7EB',
          500: '#6B7280',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}
