/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        surface: 'var(--bg-surface)',
        card: 'var(--bg-card)',
        accent: 'var(--accent)',
        'accent-em': 'var(--accent-em)',
        'accent-warn': 'var(--accent-warn)',
        'accent-danger': 'var(--accent-danger)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
      },
      fontFamily: {
        clash: ['"Clash Display"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
