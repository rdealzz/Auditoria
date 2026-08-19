import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Select } from "@/components/ui/input";
import {
  listarNaoConformidades,
  obterAuditoria,
  obterPlanoDaNC,
  obterUsuario,
} from "@/lib/queries";
import { ROTULO_CONSTATACAO, ROTULO_STATUS_NC } from "@/lib/dominio";
import { daysUntil, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Não-conformidades" };

export default function NaoConformidadesPage() {
  const ncs = listarNaoConformidades();

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Não-conformidades"
        descricao="Constatações registradas nas auditorias, com análise de causa e ação corretiva conforme cláusula 10.2 da ISO 9001:2015."
        trilha={[{ label: "Início", href: "/painel" }, { label: "Não-conformidades" }]}
        acoes={
          <Select aria-label="Filtrar por classificação" defaultValue="todas" className="w-44">
            <option value="todas">Todas as classificações</option>
            <option value="nc_maior">Apenas NC maior</option>
            <option value="nc_menor">Apenas NC menor</option>
            <option value="observacao">Apenas observações</option>
          </Select>
        }
      />

      {ncs.length === 0 ? (
        <Card>
          <EmptyState
            icon={ShieldAlert}
            titulo="Nenhuma não-conformidade registrada"
            descricao="Um bom sinal — ou as auditorias do ciclo ainda não foram executadas."
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {ncs.map((nc) => {
            const auditoria = obterAuditoria(nc.auditoriaId);
            const responsavel = obterUsuario(nc.responsavelId);
            const plano = obterPlanoDaNC(nc.id);
            const dias = daysUntil(nc.prazo);
            const pendente = !nc.encerradaEm;
            const vencida = pendente && dias < 0;

            return (
              <Card key={nc.id} id={nc.codigo} className="scroll-mt-20">
                <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{nc.codigo}</span>
                      <Badge tom={ROTULO_CONSTATACAO[nc.tipo].tom} comPonto>
                        {ROTULO_CONSTATACAO[nc.tipo].label}
                      </Badge>
                      <Badge tom={ROTULO_STATUS_NC[nc.status].tom}>
                        {ROTULO_STATUS_NC[nc.status].label}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-medium leading-snug">
                      {nc.descricao}
                    </CardTitle>
                    <CardDescription>
                      Cláusula {nc.requisito.clausula} — {nc.requisito.titulo}
                      {auditoria && (
                        <>
                          {" · "}
                          <Link
                            href={`/auditorias/${auditoria.id}`}
                            className="hover:text-foreground hover:underline"
                          >
                            {auditoria.codigo}
                          </Link>
                        </>
                      )}
                    </CardDescription>
                  </div>

                  <div className="text-right text-xs">
                    <p className={vencida ? "font-medium text-nc-maior" : "text-muted-foreground"}>
                      {nc.encerradaEm
                        ? `Encerrada em ${formatDate(nc.encerradaEm)}`
                        : vencida
                          ? `Vencida há ${Math.abs(dias)} dia(s)`
                          : `Prazo: ${formatDate(nc.prazo)}`}
                    </p>
                    {responsavel && (
                      <span className="mt-2 flex items-center justify-end gap-2 text-muted-foreground">
                        <Avatar
                          nome={responsavel.nome}
                          cor={responsavel.avatarCor}
                          className="size-6"
                        />
                        {responsavel.nome}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="rounded-lg border border-border bg-surface-muted p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Evidência objetiva
                    </p>
                    <p className="mt-1 text-sm">{nc.evidenciaObjetiva}</p>
                  </div>

                  {nc.causaRaiz ? (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Causa raiz
                        {nc.metodoAnaliseCausa && (
                          <span className="ml-2 normal-case tracking-normal">
                            ({nc.metodoAnaliseCausa.replace(/_/g, " ")})
                          </span>
                        )}
                      </p>
                      <p className="mt-1 text-sm">{nc.causaRaiz}</p>
                    </div>
                  ) : (
                    pendente && (
                      <p className="flex items-center gap-2 rounded-lg border border-nc-menor/40 bg-nc-menor-subtle px-3 py-2 text-xs text-nc-menor">
                        <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
                        Análise de causa pendente — exigida antes da definição do plano de ação.
                      </p>
                    )
                  )}

                  {plano && (
                    <Link
                      href={`/planos-de-acao#${plano.codigo}`}
                      className="flex items-center justify-between rounded-lg border border-border p-3 text-sm transition-colors hover:bg-surface-hover"
                    >
                      <span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {plano.codigo}
                        </span>{" "}
                        · {plano.oQue}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {plano.progresso}% concluído
                      </span>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
