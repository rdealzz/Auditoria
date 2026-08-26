import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '[data-tema="escuro"]'],
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        fundo: 'rgb(var(--fundo) / <alpha-value>)',
        superficie: 'rgb(var(--superficie) / <alpha-value>)',
        afundado: 'rgb(var(--afundado) / <alpha-value>)',
        borda: 'rgb(var(--borda) / <alpha-value>)',
        bordaforte: 'rgb(var(--borda-forte) / <alpha-value>)',
        texto: 'rgb(var(--texto) / <alpha-value>)',
        texto2: 'rgb(var(--texto-2) / <alpha-value>)',
        texto3: 'rgb(var(--texto-3) / <alpha-value>)',
        acento: 'rgb(var(--acento) / <alpha-value>)',
        acentoescuro: 'rgb(var(--acento-press) / <alpha-value>)',
        verde: 'rgb(var(--verde) / <alpha-value>)',
        vermelho: 'rgb(var(--vermelho) / <alpha-value>)',
        ambar: 'rgb(var(--ambar) / <alpha-value>)',
        roxo: 'rgb(var(--roxo) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display',
               'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'monospace']
      },
      borderRadius: { xl2: '1.25rem', xl3: '1.75rem', pill: '980px' },
      boxShadow: {
        nivel1: '0 1px 2px rgb(0 0 0 / .05), 0 4px 14px rgb(0 0 0 / .06)',
        nivel2: '0 2px 6px rgb(0 0 0 / .06), 0 18px 44px rgb(0 0 0 / .12)',
        nivel3: '0 30px 70px rgb(0 0 0 / .18)',
        foco: '0 0 0 4px rgb(var(--acento) / .18)'
      },
      transitionTimingFunction: { apple: 'cubic-bezier(.32,.72,0,1)' },
      maxWidth: { conteudo: '1120px' },
      keyframes: {
        subir: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } },
        entrar: { from: { opacity: '0', transform: 'scale(.97)' }, to: { opacity: '1', transform: 'none' } },
        brilho: { '0%,100%': { opacity: '.55' }, '50%': { opacity: '1' } }
      },
      animation: {
        subir: 'subir .55s cubic-bezier(.32,.72,0,1) both',
        entrar: 'entrar .4s cubic-bezier(.32,.72,0,1) both',
        brilho: 'brilho 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
export default config;
