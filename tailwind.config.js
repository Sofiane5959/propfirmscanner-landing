/** @type {import('tailwindcss').Config} */

/**
 * PropFirmScanner — Tailwind config (Sprint 2 MERGED)
 *
 * STRATEGY: Non-breaking migration.
 * - All existing tokens preserved (brand-*, dark-*, font-sans, animations).
 * - New design system tokens added alongside (bg-bg-base, text-text-primary,
 *   text-display, py-section-default, etc.).
 * - Pages refactored Sprint 2+ use new tokens.
 * - Old tokens deprecated gradually, removed at end of Sprint 2 once all pages migrated.
 *
 * See DESIGN_SYSTEM.md for usage rules.
 */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ========================================================================
      // COLORS
      // ========================================================================
      colors: {
        // --- LEGACY (existing, preserved for non-migrated pages) -------------
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Echelle legacy : les valeurs viennent des variables CSS de
        // app/globals.css. Nuit = Graphite, Jour = Papier (inversee).
        dark: {
          50: 'rgb(var(--dark-50) / <alpha-value>)',
          100: 'rgb(var(--dark-100) / <alpha-value>)',
          200: 'rgb(var(--dark-200) / <alpha-value>)',
          300: 'rgb(var(--dark-300) / <alpha-value>)',
          400: 'rgb(var(--dark-400) / <alpha-value>)',
          500: 'rgb(var(--dark-500) / <alpha-value>)',
          600: 'rgb(var(--dark-600) / <alpha-value>)',
          700: 'rgb(var(--dark-700) / <alpha-value>)',
          750: 'rgb(var(--dark-750) / <alpha-value>)',
          800: 'rgb(var(--dark-800) / <alpha-value>)',
          900: 'rgb(var(--dark-900) / <alpha-value>)',
          950: 'rgb(var(--dark-950) / <alpha-value>)',
        },

        // --- DESIGN SYSTEM v1.0 — themes Papier (jour) / Graphite (nuit) -----
        // Toutes les valeurs sont des variables CSS definies dans globals.css
        // (:root = Papier, .dark = Graphite). Le format rgb(var() / alpha)
        // garde les modificateurs d'opacite (bg-bg-elevated/60, bg-accent/10).
        bg: {
          base: 'rgb(var(--bg-base) / <alpha-value>)',
          elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          hover: 'rgb(var(--border-hover) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',  // texte, chiffres, liens
          hover: 'rgb(var(--accent-btn) / <alpha-value>)', // fond des boutons principaux (texte blanc)
          subtle: 'rgb(var(--accent) / 0.14)',
          border: 'rgb(var(--accent) / 0.3)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          subtle: 'rgba(245, 158, 11, 0.1)',
        },
        danger: {
          DEFAULT: '#EF4444',
          subtle: 'rgba(239, 68, 68, 0.1)',
        },
      },

      // ========================================================================
      // TYPOGRAPHY
      // ========================================================================
      fontFamily: {
        // Updated to use next/font CSS variables (loaded in lib/fonts.ts).
        // Falls back gracefully if variables aren't set yet.
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        // NEW design system sizes — see DESIGN_SYSTEM.md §3
        // Tailwind defaults (text-xs, text-sm, text-base, etc.) still work.
        display: ['56px', { lineHeight: '64px', letterSpacing: '-0.02em', fontWeight: '600' }],
        h1: ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '600' }],
        h2: ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        h3: ['20px', { lineHeight: '28px', letterSpacing: '0', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px', letterSpacing: '0', fontWeight: '400' }],
        small: ['14px', { lineHeight: '20px', letterSpacing: '0', fontWeight: '400' }],
        tiny: ['12px', { lineHeight: '16px', letterSpacing: '0', fontWeight: '500' }],
      },

      // ========================================================================
      // SPACING
      // ========================================================================
      spacing: {
        // Standardized section paddings — only 3 values for Sprint 2+ pages
        'section-compact': '48px',
        'section-default': '80px',
        'section-spacious': '128px',
      },

      // ========================================================================
      // BORDER RADIUS
      // ========================================================================
      // Sprint 2+ pages should prefer rounded-md (6px) and rounded-lg (8px).
      // We DON'T override the defaults here to keep legacy pages intact.
      // (rounded-xl/2xl still work for existing components.)

      // ========================================================================
      // ANIMATIONS
      // ========================================================================
      animation: {
        // Legacy (preserved)
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
