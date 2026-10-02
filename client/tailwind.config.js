/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Stitch Surface & Atmospheric Tiers
        surface: '#0a122a',
        'surface-dim': '#0a122a',
        'surface-bright': '#313852',
        'surface-container-lowest': '#050d25',
        'surface-container-low': '#131a33',
        'surface-container': '#171e37',
        'surface-container-high': '#212942',
        'surface-container-highest': '#2c344d',

        // Stitch Typography & Foreground
        'on-surface': '#dbe1ff',
        'on-surface-variant': '#bcc9ce',
        outline: '#869398',
        'outline-variant': '#3d494d',

        // Stitch Spectral Primary Accents (Sky Azure / Luminous Cyan)
        primary: '#4cd6fb',
        'primary-container': '#00b4d8',
        'on-primary': '#003642',
        'on-primary-container': '#00414f',
        'primary-fixed': '#b3ebff',
        'primary-fixed-dim': '#4cd6fb',

        // Stitch Secondary Accents (Twilight Royal / Daybreak Sky)
        secondary: '#adc6ff',
        'secondary-container': '#006be3',
        'on-secondary': '#002e69',
        'on-secondary-container': '#f2f4ff',
        'secondary-fixed': '#d8e2ff',
        'secondary-fixed-dim': '#adc6ff',

        // Stitch Tertiary Accents (Solar Amber / Golden Hour)
        tertiary: '#ffb781',
        'tertiary-container': '#fc8602',
        'on-tertiary': '#4e2500',
        'on-tertiary-container': '#5e2e00',
        'tertiary-fixed': '#ffdcc4',
        'tertiary-fixed-dim': '#ffb781',

        // Stitch Activity & Environmental Semantic Tokens
        optimal: '#06d6a0',
        caution: '#fb8500',
        azure: '#3a86ff',
        
        // Errors
        error: '#ffb4ab',
        'error-container': '#93000a',
        'on-error': '#690005',
        'on-error-container': '#ffdad6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        'space-2xl': '3rem',
        gutter: '1.5rem',
        'gutter-mobile': '1rem',
        margin: '3rem',
        'margin-mobile': '1.25rem',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
      },
      boxShadow: {
        glass: '0 16px 36px -10px rgba(5, 7, 20, 0.65)',
        'glass-hover': '0 20px 48px -12px rgba(5, 7, 20, 0.85)',
        glow: '0 0 20px rgba(76, 214, 251, 0.35)',
        'glow-amber': '0 0 20px rgba(252, 134, 2, 0.35)',
        'glow-violet': '0 0 24px rgba(124, 58, 237, 0.45)',
        'specular-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
      },
    },
  },
  plugins: [],
}
