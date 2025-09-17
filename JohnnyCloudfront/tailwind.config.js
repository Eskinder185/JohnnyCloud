/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jc: {
          bg: '#0B1220',
          surface: '#1A1F2E',
          surface2: '#252B3D',
          text: '#FFFFFF',
          dim: '#A0AEC0',
          cyan: '#00E6FF',
          pink: '#EC5DFE',
          green: '#7CFFB2',
        },
        // Typography color tokens
        text: {
          primary: '#E6F1FF',
          secondary: '#B5C7DB',
          muted: '#8EA0B5',
          inverse: '#0B1220',
        },
        link: {
          DEFAULT: '#7FD1FF',
          hover: '#A7E3FF',
        },
        severity: {
          success: '#3DDC97',
          warning: '#F6C453',
          danger: '#FF6B6B',
          info: '#6FB7FF',
        }
      },
      boxShadow: {
        glow: '0 0 20px rgba(0, 230, 255, 0.3)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }], // 40px
        'h2': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],   // 32px
        'h3': ['1.5rem', { lineHeight: '1.25', fontWeight: '600' }], // 24px
        'body-lg': ['1.125rem', { lineHeight: '1.55', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'small': ['0.875rem', { lineHeight: '1.55', fontWeight: '400' }], // 14px
        'meta': ['0.8125rem', { lineHeight: '1.55', fontWeight: '400' }], // 13px
      },
      // Legacy background configurations removed
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        // Legacy background animation keyframes removed
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
        // Legacy background animations removed
      },
    },
  },
  plugins: [],
}
