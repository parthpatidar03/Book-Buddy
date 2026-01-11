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
        // Concrete Studio Palette
        primary: {
          50: '#ecfdf5', // Emerald-50
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        dark: {
          bg: '#18181B', // Zinc-950
          card: '#27272A', // Zinc-800
          text: '#FAFAFA', // Zinc-50
          muted: '#A1A1AA', // Zinc-400
          border: '#3F3F46', // Zinc-700
        },

        gssoc: {
          base: "#00020F",       // Main background
          dark: "#00041F",       // Deep section/Footer
          card: "#11152B",       // Card background
          "card-border": "#24315B", // Card border
          "text-primary": "#FFFFFF",
          "text-secondary": "#A7ADBE",
          primary: "#4C75FF",    // Brand primary
          "primary-to": "#1A4FFF", // Gradient end
        }
      },
      fontFamily: {
        sans: ['"Mulish"', 'sans-serif'],
        serif: ['"Lora"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
