import type { Config } from 'tailwindcss'
import daisyUi from 'daisyui'
import daysyThemes from 'daisyui/src/theming/themes'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        brand: '#ffdd04',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...daysyThemes['light'],
          accent: '#ffdd04',
          secondary: '#222222',
        },
      },
    ],
  },
  darkTheme: 'light',
  base: true, // applies background color and foreground color for root element by default
  styled: true, // include daisyUI colors and design decisions for all components
  utils: true, // adds responsive and modifier utility classes
  prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
  logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  themeRoot: ':root', // The element that receives theme color CSS variables
  plugins: [daisyUi],
} satisfies Config
