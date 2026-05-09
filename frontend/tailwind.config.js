/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0d0e18',
          secondary: '#12131f',
          card:      '#191a2e',
          input:     '#0f1020',
          hover:     '#1e1f38',
        },
        accent: {
          purple:       '#7c3aed',
          'purple-light': '#8b5cf6',
          'purple-dark':  '#6d28d9',
        },
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: {
        'fade-in':    'fadeIn 0.15s ease-out',
        'slide-up':   'slideUp 0.25s ease-out',
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
