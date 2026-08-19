import type { Metadata } from "next";
import { ListChecks, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listarTemplates } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Checklists" };

export default function TemplatesPage() {
  const templates = listarTemplates();

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Checklists de auditoria"
        descricao="Modelos versionados de checklist, organizados por seção e vinculados aos requisitos da norma."
        trilha={[{ label: "Início", href: "/painel" }, { label: "Checklists" }]}
        acoes={
          <Button size="sm">
            <Plus /> Novo checklist
          </Button>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {templates.map((template) => {
          const perguntas = template.secoes.reduce((s, sec) => s + sec.perguntas.length, 0);
          return (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary-subtle text-primary">
                    <ListChecks className="size-4" aria-hidden />
                  </span>
                  <Badge tom={template.ativo ? "conforme" : "neutro"} comPonto>
                    {template.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <CardTitle className="mt-2 leading-snug">{template.nome}</CardTitle>
                <CardDescription>{template.descricao}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto space-y-3">
                <div className="flex flex-wrap gap-2">
                  <Badge tom="outline">{template.norma}</Badge>
                  <Badge tom="outline">v{template.versao}</Badge>
                  <Badge tom="outline">
                    {template.secoes.length} seção(ões) · {perguntas} requisito(s)
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Atualizado em {formatDate(template.atualizadoEm)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {templates[0].secoes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pré-visualização — {templates[0].nome}</CardTitle>
            <CardDescription>
              Cada pergunta cita a cláusula avaliada, seu peso no índice de conformidade e se exige
              evidência objetiva.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {templates[0].secoes.map((secao) => (
              <div key={secao.id} className="space-y-2">
                <p className="text-sm font-semibold">
                  <span className="mr-2 font-mono text-xs text-muted-foreground">
                    {secao.clausula}
                  </span>
                  {secao.titulo}
                </p>
                <ul className="space-y-2">
                  {secao.perguntas.map((pergunta) => (
                    <li
                      key={pergunta.id}
                      className="rounded-lg border border-border p-3 text-sm"
                    >
                      <p>{pergunta.texto}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Badge tom="outline">Cláusula {pergunta.requisito.clausula}</Badge>
                        <Badge tom="outline">Peso {pergunta.peso}</Badge>
                        {pergunta.exigeEvidencia && (
                          <Badge tom="primary">Exige evidência</Badge>
                        )}
                      </div>
                      {pergunta.orientacao && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium">Orientação ao auditor:</span>{" "}
                          {pergunta.orientacao}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
