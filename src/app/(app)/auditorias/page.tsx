import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardCheck, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AvatarGroup } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listarAuditorias, obterUsuario, obterUsuarios } from "@/lib/queries";
import { META_CONFORMIDADE, ROTULO_STATUS_AUDITORIA } from "@/lib/dominio";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Auditorias" };

export default function AuditoriasPage() {
  const auditorias = listarAuditorias();

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Programa de auditorias"
        descricao="Auditorias internas planejadas e executadas no ciclo 2026, conforme cláusula 9.2 da ISO 9001:2015."
        trilha={[{ label: "Início", href: "/painel" }, { label: "Auditorias" }]}
        acoes={
          <Button size="sm">
            <Plus /> Nova auditoria
          </Button>
        }
      />

      <Card>
        {auditorias.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            titulo="Nenhuma auditoria cadastrada"
            descricao="Crie a primeira auditoria do programa anual para começar a registrar constatações."
            acao={<Button size="sm">Nova auditoria</Button>}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Auditoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Equipe</TableHead>
                <TableHead className="text-right">Conformidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditorias.map((auditoria) => {
                const rotulo = ROTULO_STATUS_AUDITORIA[auditoria.status];
                const equipe = obterUsuarios([
                  auditoria.auditorLiderId,
                  ...auditoria.auditoresIds,
                ]);
                const lider = obterUsuario(auditoria.auditorLiderId);
                const iniciada = auditoria.status !== "planejada";
                const abaixoDaMeta = auditoria.indiceConformidade < META_CONFORMIDADE;

                return (
                  <TableRow key={auditoria.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {auditoria.codigo}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <Link
                        href={`/auditorias/${auditoria.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {auditoria.titulo}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {auditoria.processoAuditado} · {auditoria.unidade}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge tom={rotulo.tom} comPonto>
                        {rotulo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(auditoria.dataConclusao ?? auditoria.dataPlanejada)}
                    </TableCell>
                    <TableCell>
                      <AvatarGroup pessoas={equipe} />
                      <p className="mt-1 text-xs text-muted-foreground">Líder: {lider?.nome}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      {iniciada ? (
                        <div className="ml-auto w-28 space-y-1">
                          <p
                            className={
                              abaixoDaMeta
                                ? "text-sm font-semibold tabular-nums text-nc-maior"
                                : "text-sm font-semibold tabular-nums text-conforme"
                            }
                          >
                            {auditoria.indiceConformidade.toLocaleString("pt-BR")}%
                          </p>
                          <Progress
                            value={auditoria.indiceConformidade}
                            label={`Conformidade da auditoria ${auditoria.codigo}`}
                            indicadorClassName={abaixoDaMeta ? "bg-nc-maior" : "bg-conforme"}
                          />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
