import { AppShell } from "@/components/layout/app-shell";
import { obterIndicadores, obterUsuarioAtual } from "@/lib/queries";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const usuario = obterUsuarioAtual();
  const { ncsVencidas, acoesAtrasadas } = obterIndicadores();

  return (
    <AppShell usuario={usuario} alertas={ncsVencidas + acoesAtrasadas}>
      <div id="conteudo">{children}</div>
    </AppShell>
  );
}
