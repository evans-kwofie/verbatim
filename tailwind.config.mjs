/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    fontFamily: {
      serif: ['"Playfair Display"', 'Georgia', 'serif'],
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: '#000000',
          light: '#0A0A0A',
        },
        ink: {
          DEFAULT: '#F0EDE8',
          light: '#8A8A8A',
          faint: '#2A2A2A',
        },
        accent: '#8B7355',
      },
      spacing: {
        section: '8rem',
        block: '4rem',
        element: '2rem',
      },
      fontSize: {
        display: ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        heading: ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        subheading: ['clamp(1.25rem, 2vw, 1.75rem)', { lineHeight: '1.3' }],
        body: ['1.125rem', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.05em' }],
      },
      transitionDuration: {
        600: '600ms',
        800: '800ms',
        1200: '1200ms',
      },
    },
  },
  plugins: [],
};
