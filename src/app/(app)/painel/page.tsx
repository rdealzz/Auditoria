import Link from "next/link";
import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, ClipboardCheck, ShieldAlert, Target } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  GraficoConformidade,
  GraficoDistribuicao,
  GraficoNCsPorProcesso,
} from "@/components/dashboard/graficos";
import {
  listarAuditorias,
  listarNCsCriticas,
  obterDistribuicaoNCs,
  obterHistoricoConformidade,
  obterIndicadores,
  obterNCsPorProcesso,
  obterUsuario,
} from "@/lib/queries";
import { ROTULO_CONSTATACAO, ROTULO_STATUS_AUDITORIA } from "@/lib/dominio";
import { daysUntil, formatDate, formatPercent } from "@/lib/utils";

export const metadata: Metadata = { title: "Painel" };

export default function PainelPage() {
  const kpis = obterIndicadores();
  const criticas = listarNCsCriticas();
  const emAndamento = listarAuditorias().filter(
    (a) => a.status === "em_execucao" || a.status === "em_relatorio",
  );

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Painel da qualidade"
        descricao="Indicadores consolidados do programa de auditoria interna do SGQ, conforme cláusula 9.2 da ISO 9001:2015."
        acoes={
          <>
            <Button variant="secondary" size="sm">
              Exportar relatório
            </Button>
            <Button size="sm">Nova auditoria</Button>
          </>
        }
      />

      <section aria-label="Indicadores" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          titulo="Índice de conformidade"
          valor={formatPercent(kpis.indiceConformidade)}
          icon={CheckCircle2}
          variacao={kpis.variacaoConformidade}
          detalhe={`meta ${kpis.metaConformidade}%`}
        />
        <KpiCard
          titulo="Não-conformidades abertas"
          valor={String(kpis.ncsAbertas)}
          icon={ShieldAlert}
          inverterTom
          destaque={kpis.ncsMaioresAbertas > 0 ? "critico" : "neutro"}
          detalhe={`${kpis.ncsMaioresAbertas} maior(es) · ${kpis.ncsVencidas} vencida(s)`}
        />
        <KpiCard
          titulo="Fechamento no prazo"
          valor={formatPercent(kpis.taxaFechamentoNoPrazo, 0)}
          icon={Target}
          destaque={kpis.taxaFechamentoNoPrazo < 80 ? "alerta" : "neutro"}
          detalhe="ações corretivas encerradas"
        />
        <KpiCard
          titulo="Auditorias em andamento"
          valor={String(kpis.auditoriasEmAndamento)}
          icon={ClipboardCheck}
          detalhe={`${kpis.auditoriasPlanejadas} planejada(s)`}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução do índice de conformidade</CardTitle>
            <CardDescription>
              Média ponderada das auditorias encerradas em cada mês, comparada à meta da política
              da qualidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoConformidade dados={obterHistoricoConformidade()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constatações por classificação</CardTitle>
            <CardDescription>Distribuição no exercício de 2026.</CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoDistribuicao dados={obterDistribuicaoNCs()} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Não-conformidades por processo</CardTitle>
            <CardDescription>
              Concentração das constatações — apoia a priorização do próximo programa de auditoria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GraficoNCsPorProcesso dados={obterNCsPorProcesso()} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prazos mais próximos</CardTitle>
            <CardDescription>Não-conformidades pendentes de tratamento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {criticas.map((nc) => {
              const dias = daysUntil(nc.prazo);
              const vencida = dias < 0;
              return (
                <Link
                  key={nc.id}
                  href={`/nao-conformidades#${nc.codigo}`}
                  className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-surface-hover"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{nc.codigo}</span>
                      <Badge tom={ROTULO_CONSTATACAO[nc.tipo].tom} comPonto>
                        {ROTULO_CONSTATACAO[nc.tipo].label}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-sm">{nc.descricao}</p>
                    <p
                      className={
                        vencida
                          ? "text-xs font-medium text-nc-maior"
                          : "text-xs text-muted-foreground"
                      }
                    >
                      <CalendarClock className="mr-1 inline size-3" aria-hidden />
                      {vencida
                        ? `Vencida há ${Math.abs(dias)} dia(s)`
                        : `Vence em ${dias} dia(s) · ${formatDate(nc.prazo)}`}
                    </p>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Auditorias em andamento</CardTitle>
            <CardDescription>Progresso de preenchimento dos checklists.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {emAndamento.map((auditoria) => {
              const lider = obterUsuario(auditoria.auditorLiderId);
              const progresso =
                (auditoria.perguntasRespondidas / auditoria.totalPerguntas) * 100;
              const rotulo = ROTULO_STATUS_AUDITORIA[auditoria.status];
              return (
                <Link
                  key={auditoria.id}
                  href={`/auditorias/${auditoria.id}`}
                  className="space-y-3 rounded-lg border border-border p-4 transition-colors hover:bg-surface-hover"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <p className="font-mono text-xs text-muted-foreground">{auditoria.codigo}</p>
                      <p className="text-sm font-medium">{auditoria.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {auditoria.unidade} · líder {lider?.nome}
                      </p>
                    </div>
                    <Badge tom={rotulo.tom} comPonto>
                      {rotulo.label}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {auditoria.perguntasRespondidas} de {auditoria.totalPerguntas} requisitos
                      </span>
                      <span className="tabular-nums">{Math.round(progresso)}%</span>
                    </div>
                    <Progress value={progresso} label="Progresso do checklist" />
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
