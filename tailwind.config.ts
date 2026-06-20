import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sinai Taxi brand palette — mirrored from the mobile app
        // so the marketplace reads as the same product.
        brand: {
          50:  '#EEF3FF',
          100: '#DCE7FF',
          200: '#B9CFFF',
          300: '#8FB1FF',
          400: '#5388FF',
          500: '#1E5EFF',  // primary
          600: '#1045D9',
          700: '#0E37AA',
          800: '#0E2D80',
          900: '#0E1430',  // deep navy (hero backdrops)
          950: '#06081A',
        },
        ink: {
          50:  '#F7F9FC',
          100: '#EEF2F8',
          200: '#E1E7F1',
          300: '#C7D0DF',
          400: '#9AA3B7',
          500: '#697186',
          600: '#4B5468',
          700: '#33394A',
          800: '#1C2030',
          900: '#0A0E1B',
        },
        accent: {
          // Warm citrine used as a single eyebrow / badge accent
          // — gives the cool-blue palette a counterpoint.
          400: '#FFC857',
          500: '#F5A623',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tightest: '-0.06em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        // Subtle elevation tuned for a light surface — used on
        // cards, buttons, and the floating search bar.
        soft: '0 1px 2px rgba(11,15,30,0.04), 0 8px 24px rgba(11,15,30,0.06)',
        glow: '0 24px 60px -20px rgba(30,94,255,0.45)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        floaty: 'floaty 5s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(30,94,255,0.18), transparent), linear-gradient(rgba(11,15,30,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(11,15,30,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-md': '60px 60px',
      },
    },
  },
  plugins: [],
};

export default config;
