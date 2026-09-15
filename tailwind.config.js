/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          card: 'var(--color-card)',
          'card-hover': 'var(--color-card-hover)',
          border: 'var(--color-border)',
          primary: 'var(--color-primary)',
          'primary-hover': 'var(--color-primary-hover)',
          accent: 'var(--color-accent)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
        },
      },
      boxShadow: {
        glow: '0 0 20px -5px var(--color-primary-glow)',
        'accent-glow': '0 0 20px -5px var(--color-accent-glow)',
      },
    },
  },
  plugins: [],
}
