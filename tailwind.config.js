/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        loop: {
          bg: '#0d0a14',
          panel: '#1a1428',
          border: '#3d2f5c',
          accent: '#c9a227',
          accentHover: '#e8c547',
          danger: '#c43c3c',
          success: '#3d9e6a',
          muted: '#8b7fa8',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-kill': 'pulseKill 0.5s ease-out',
        'chip-select': 'chipSelect 0.2s ease-out',
      },
      keyframes: {
        pulseKill: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.3)', opacity: '0.8' },
        },
        chipSelect: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
};
