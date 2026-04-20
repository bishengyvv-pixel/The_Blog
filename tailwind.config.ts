import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'brutal': 'var(--shadow-offset) var(--shadow-offset) 0 0 var(--border-color)',
        'brutal-sm': '2px 2px 0 0 var(--border-color)',
        'brutal-lg': '6px 6px 0 0 var(--border-color)',
      },
      fontFamily: {
        'brutal': ['Inter', 'Montserrat', 'Noto Sans SC', 'sans-serif'],
      },
      translate: {
        'brutal': 'var(--shadow-offset)',
      },
      colors: {
        brutal: {
          yellow: '#ffcc00',
          red: '#ff3333',
          blue: '#0066ff',
        }
      }
    },
  },
  plugins: [],
} satisfies Config