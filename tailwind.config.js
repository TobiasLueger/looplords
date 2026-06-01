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
        'player-hop': 'playerHop 0.19s ease-out',
        'player-strike': 'playerStrike 0.32s ease-out',
        'enemy-splatter': 'enemySplatter 0.32s ease-out forwards',
        'enemy-death': 'enemyDeath 0.32s ease-out forwards',
        'teleport-vanish': 'teleportVanish 0.22s ease-in forwards',
        'teleport-appear': 'teleportAppear 0.3s ease-out forwards',
        'smoke-puff': 'smokePuff 0.55s ease-out forwards',
        'player-grapple': 'playerGrapple 0.45s ease-in infinite',
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
        playerHop: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '45%': { transform: 'translateY(-28%) scale(1.04)' },
        },
        playerStrike: {
          '0%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
          '35%': { transform: 'translateY(-6%) scale(1.14) rotate(-14deg)' },
          '65%': { transform: 'translateY(2%) scale(1.06) rotate(8deg)' },
          '100%': { transform: 'translateY(0) scale(1) rotate(0deg)' },
        },
        enemySplatter: {
          '0%': { opacity: '0', transform: 'scale(0.35)' },
          '25%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.45)' },
        },
        enemyDeath: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '35%': { transform: 'scale(1.08) rotate(-10deg)', opacity: '1' },
          '100%': { transform: 'scale(0.55) rotate(18deg)', opacity: '0' },
        },
        teleportVanish: {
          '0%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0)' },
          '55%': { transform: 'scale(1.06)', opacity: '0.65', filter: 'blur(1px)' },
          '100%': { transform: 'scale(0.35)', opacity: '0', filter: 'blur(6px)' },
        },
        teleportAppear: {
          '0%': { transform: 'scale(0.4)', opacity: '0', filter: 'blur(8px)' },
          '45%': { transform: 'scale(1.08)', opacity: '0.85', filter: 'blur(2px)' },
          '100%': { transform: 'scale(1)', opacity: '1', filter: 'blur(0)' },
        },
        smokePuff: {
          '0%': { transform: 'scale(0.35)', opacity: '0' },
          '25%': { transform: 'scale(0.95)', opacity: '0.9' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
        playerGrapple: {
          '0%, 100%': { transform: 'translateY(2%) scale(1.02, 0.96)' },
          '50%': { transform: 'translateY(6%) scale(1.06, 0.9)' },
        },
      },
    },
  },
  plugins: [],
};
