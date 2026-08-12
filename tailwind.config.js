/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#FF8C42', dark: '#E07020', light: '#FFD9B8', soft: '#FFF3E8' },
        skyblue: { DEFAULT: '#4A90E2', dark: '#2B6FB1', light: '#D9E9FA', soft: '#EDF5FE' },
        coral: { DEFAULT: '#FF6B6B', dark: '#E04A4A', light: '#FFD6D6', soft: '#FFF0F0' },
        ink: '#2C3E50',
        paper: '#F8F9FA',
        line: '#E1E8ED',
        gold: '#D4A017',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', 'sans-serif'],
        display: ['Quicksand', '"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        card: '0 4px 16px rgba(44,62,80,0.08)',
        float: '0 10px 30px rgba(255,140,66,0.35)',
        pop: '0 8px 30px rgba(44,62,80,0.16)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        pop: 'pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-up': 'slideUp 0.35s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        wiggle: 'wiggle 0.6s ease-in-out',
        wave: 'wave 1.2s ease-in-out infinite',
        'stamp-in': 'stampIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        pop: { '0%': { transform: 'scale(0.6)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(24px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        wiggle: { '0%,100%': { transform: 'rotate(-6deg)' }, '50%': { transform: 'rotate(6deg)' } },
        wave: { '0%,100%': { transform: 'scaleY(0.4)' }, '50%': { transform: 'scaleY(1)' } },
        stampIn: { '0%': { transform: 'scale(2.2) rotate(-25deg)', opacity: '0' }, '100%': { transform: 'scale(1) rotate(-12deg)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}