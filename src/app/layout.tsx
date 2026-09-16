import type { Metadata, Viewport } from 'next';
import './globals.css';
import Provedores from './provedores';

export const metadata: Metadata = {
  title: 'Auditoria — Assistente de Auditorias da Qualidade',
  description:
    'Sistema guiado de auditorias da qualidade baseado em normas ISO: dez etapas, checklist inteligente, evidências e relatório automático.',
  applicationName: 'Auditoria'
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  width: 'device-width',
  initialScale: 1
};

/** Evita o "flash" de tema claro antes da hidratação. */
const scriptTema = `
try {
  var t = localStorage.getItem('auditoria.tema');
  if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
  document.documentElement.setAttribute('data-tema', t);
} catch (e) {}
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: scriptTema }} /></head>
      <body className="min-h-screen antialiased">
        <Provedores>{children}</Provedores>
      </body>
    </html>
  );
}
