import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Building2, CalendarDays, FileText, Printer, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  listarNCsDaAuditoria,
  obterAuditoria,
  obterTemplate,
  obterUsuario,
  obterUsuarios,
} from "@/lib/queries";
import { META_CONFORMIDADE, ROTULO_CONSTATACAO, ROTULO_STATUS_AUDITORIA, ROTULO_STATUS_NC } from "@/lib/dominio";
import { formatDate, formatDateLong } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const auditoria = obterAuditoria(id);
  return { title: auditoria ? `${auditoria.codigo} — ${auditoria.titulo}` : "Auditoria" };
}

export default async function AuditoriaDetalhePage({ params }: Props) {
  const { id } = await params;
  const auditoria = obterAuditoria(id);
  if (!auditoria) notFound();

  const lider = obterUsuario(auditoria.auditorLiderId);
  const auditores = obterUsuarios(auditoria.auditoresIds);
  const responsavel = obterUsuario(auditoria.responsavelAreaId);
  const template = obterTemplate(auditoria.templateId);
  const ncs = listarNCsDaAuditoria(auditoria.id);
  const rotulo = ROTULO_STATUS_AUDITORIA[auditoria.status];
  const abaixoDaMeta = auditoria.indiceConformidade < META_CONFORMIDADE;
  const progresso = (auditoria.perguntasRespondidas / auditoria.totalPerguntas) * 100;

  return (
    <div className="space-y-6">
      <PageHeader
        titulo={auditoria.titulo}
        descricao={auditoria.escopo}
        trilha={[
          { label: "Início", href: "/painel" },
          { label: "Auditorias", href: "/auditorias" },
          { label: auditoria.codigo },
        ]}
        acoes={
          <>
            <Button variant="secondary" size="sm">
              <Printer /> Relatório
            </Button>
            <Button size="sm">Continuar execução</Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Badge tom={rotulo.tom} comPonto>
          {rotulo.label}
        </Badge>
        <Badge tom="outline">{auditoria.norma}</Badge>
        <span className="font-mono text-xs text-muted-foreground">{auditoria.codigo}</span>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ficha da auditoria</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="size-3.5" aria-hidden /> Unidade / processo
                </dt>
                <dd className="mt-1 text-sm">
                  {auditoria.unidade} · {auditoria.processoAuditado}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" aria-hidden /> Período
                </dt>
                <dd className="mt-1 text-sm">
                  {auditoria.dataInicio
                    ? `Iniciada em ${formatDateLong(auditoria.dataInicio)}`
                    : `Planejada para ${formatDateLong(auditoria.dataPlanejada)}`}
                  {auditoria.dataConclusao &&
                    ` · encerrada em ${formatDate(auditoria.dataConclusao)}`}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users className="size-3.5" aria-hidden /> Equipe auditora
                </dt>
                <dd className="mt-2 space-y-1.5">
                  {[lider, ...auditores].filter(Boolean).map((u) => (
                    <span key={u!.id} className="flex items-center gap-2 text-sm">
                      <Avatar nome={u!.nome} cor={u!.avatarCor} className="size-6" />
                      {u!.nome}
                      {u!.id === lider?.id && (
                        <Badge tom="primary" className="text-[10px]">
                          líder
                        </Badge>
                      )}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <FileText className="size-3.5" aria-hidden /> Checklist aplicado
                </dt>
                <dd className="mt-1 text-sm">
                  {template ? `${template.nome} (v${template.versao})` : "—"}
                </dd>
                <dd className="mt-3 text-xs text-muted-foreground">
                  Responsável pela área: {responsavel?.nome}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>Meta institucional de {META_CONFORMIDADE}%.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p
                className={
                  abaixoDaMeta
                    ? "text-4xl font-semibold tabular-nums text-nc-maior"
                    : "text-4xl font-semibold tabular-nums text-conforme"
                }
              >
                {auditoria.indiceConformidade.toLocaleString("pt-BR")}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Índice de conformidade ponderado pelo peso dos requisitos
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Checklist preenchido</span>
                <span className="tabular-nums">
                  {auditoria.perguntasRespondidas}/{auditoria.totalPerguntas}
                </span>
              </div>
              <Progress value={progresso} label="Progresso do checklist" />
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
              {(["nc_maior", "nc_menor", "observacao"] as const).map((tipo) => (
                <div key={tipo}>
                  <p className="text-xl font-semibold tabular-nums">
                    {ncs.filter((nc) => nc.tipo === tipo).length}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {ROTULO_CONSTATACAO[tipo].label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Constatações registradas</CardTitle>
          <CardDescription>
            Cada constatação cita o requisito da norma e a evidência objetiva que a sustenta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {ncs.length === 0 ? (
            <EmptyState
              icon={FileText}
              titulo="Nenhuma constatação registrada"
              descricao="As não-conformidades e observações aparecem aqui conforme o checklist é preenchido."
            />
          ) : (
            ncs.map((nc) => (
              <Link
                key={nc.id}
                href={`/nao-conformidades#${nc.codigo}`}
                className="block space-y-2 rounded-lg border border-border p-4 transition-colors hover:bg-surface-hover"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{nc.codigo}</span>
                  <Badge tom={ROTULO_CONSTATACAO[nc.tipo].tom} comPonto>
                    {ROTULO_CONSTATACAO[nc.tipo].label}
                  </Badge>
                  <Badge tom="outline">
                    Cláusula {nc.requisito.clausula} — {nc.requisito.titulo}
                  </Badge>
                  <Badge tom={ROTULO_STATUS_NC[nc.status].tom}>
                    {ROTULO_STATUS_NC[nc.status].label}
                  </Badge>
                </div>
                <p className="text-sm">{nc.descricao}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Evidência objetiva:</span> {nc.evidenciaObjetiva}
                </p>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
