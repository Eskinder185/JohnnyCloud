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
      backgroundImage: {
        'grid': 'linear-gradient(rgba(0,230,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,230,255,0.1) 1px, transparent 1px)',
        'vignette': 'radial-gradient(ellipse at center, transparent 0%, rgba(11,18,32,0.8) 100%)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
        },
        gridScan: {
          'to': { backgroundPosition: '200% 0, 0 200%' },
        },
        barDrift: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '1' },
        },
        sweep: {
          'to': { transform: 'rotate(1turn)' },
        },
        spark: {
          '0%': { opacity: '0.25' },
          '50%': { opacity: '0.6' },
          '100%': { opacity: '0.25' },
        },
        combPulse: {
          '0%, 100%': { opacity: '0.9' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
        twinkle: 'twinkle 2s ease-in-out infinite',
        gridScan: 'gridScan 12s linear infinite',
        barDrift: 'barDrift 18s ease-in-out infinite',
        sweep: 'sweep 4.8s linear infinite',
        spark: 'spark 3.2s ease-in-out infinite',
        combPulse: 'combPulse 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
