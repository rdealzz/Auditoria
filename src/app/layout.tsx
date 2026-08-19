import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const inter = Inter({ variable: "--font-sans-custom", subsets: ["latin"], display: "swap" });
const jetbrains = JetBrains_Mono({
  variable: "--font-mono-custom",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Auditoria — Gestão de Auditorias Internas da Qualidade",
    template: "%s · Auditoria",
  },
  description:
    "Plataforma de gestão do ciclo completo de auditoria interna da qualidade conforme ISO 9001:2015: programa, execução, não-conformidades, ações corretivas e indicadores.",
  keywords: ["auditoria interna", "ISO 9001", "SGQ", "não-conformidade", "ação corretiva"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#16181f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full">
        <ThemeProvider>
          <a
            href="#conteudo"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
          >
            Pular para o conteúdo
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
