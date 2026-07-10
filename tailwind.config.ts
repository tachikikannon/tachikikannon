import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy:    { DEFAULT: '#1a2a4a', light: '#2d4a6e' },
        gold:    { DEFAULT: '#c8a96e', light: '#e0c99a' },
        teal:    { DEFAULT: '#5b9ea0' },
        cream:   { DEFAULT: '#f7f5f0', alt: '#f0ece4' },
        onsenji: { DEFAULT: '#1a4a3a', light: '#2d6b57' },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', 'sans-serif'],
        serif: ['"Noto Serif JP"', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
