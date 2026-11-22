/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F8FAFC',
          subtle: '#F1F5F9',
          dark: '#0F172A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          dark: '#1E293B',
        },
        brand: {
          primary: '#1E3A8A', // Deep Academic Navy
          interactive: '#2563EB', // Tech Blue
          hover: '#1D4ED8',
          accent: '#3B82F6',
        },
        accent: {
          innovation: '#10B981', // Emerald
          prestige: '#D97706',   // Amber Gold
          rose: '#E11D48',
        },
        border: {
          subtle: '#E2E8F0',
          focus: '#2563EB',
        },
        text: {
          primary: '#0F172A',
          secondary: '#475569',
          muted: '#94A3B8',
        }
      },
      borderRadius: {
        'default': '10px',
        'card': '12px',
        'input': '10px',
        'button': '10px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', '"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.03)',
        'elevated': '0 12px 24px -6px rgba(15, 23, 42, 0.08)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.06)',
      },
      backdropBlur: {
        'glass': '12px',
      }
    },
  },
  plugins: [],
};

