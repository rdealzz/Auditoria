import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Target } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { listarPlanosAcao, obterNaoConformidade, obterUsuario } from "@/lib/queries";
import { ROTULO_STATUS_ACAO } from "@/lib/dominio";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Planos de ação" };

/** Campos do 5W2H exibidos na ficha da ação. */
const CAMPOS_5W2H = [
  { chave: "oQue", rotulo: "O que" },
  { chave: "porQue", rotulo: "Por que" },
  { chave: "onde", rotulo: "Onde" },
  { chave: "quem", rotulo: "Quem" },
  { chave: "como", rotulo: "Como" },
] as const;

export default function PlanosAcaoPage() {
  const planos = listarPlanosAcao();

  return (
    <div className="space-y-6">
      <PageHeader
        titulo="Planos de ação"
        descricao="Ações corretivas estruturadas em 5W2H, vinculadas às não-conformidades e sujeitas a verificação de eficácia."
        trilha={[{ label: "Início", href: "/painel" }, { label: "Planos de ação" }]}
      />

      {planos.length === 0 ? (
        <Card>
          <EmptyState
            icon={Target}
            titulo="Nenhum plano de ação"
            descricao="Os planos são criados a partir das não-conformidades que já tiveram a causa raiz analisada."
          />
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {planos.map((plano) => {
            const nc = obterNaoConformidade(plano.naoConformidadeId);
            const responsavel = obterUsuario(plano.responsavelId);
            const rotulo = ROTULO_STATUS_ACAO[plano.status];

            return (
              <Card key={plano.id} id={plano.codigo} className="flex flex-col scroll-mt-20">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{plano.codigo}</span>
                    <Badge tom={rotulo.tom} comPonto>
                      {rotulo.label}
                    </Badge>
                    {plano.eficaciaVerificada && (
                      <Badge tom="conforme">
                        <CheckCircle2 className="size-3" aria-hidden /> Eficácia verificada
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-medium leading-snug">{plano.oQue}</CardTitle>
                  {nc && (
                    <CardDescription>
                      Trata{" "}
                      <Link
                        href={`/nao-conformidades#${nc.codigo}`}
                        className="hover:text-foreground hover:underline"
                      >
                        {nc.codigo}
                      </Link>{" "}
                      · cláusula {nc.requisito.clausula}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex-1 space-y-4">
                  <dl className="space-y-2 text-sm">
                    {CAMPOS_5W2H.map(({ chave, rotulo: label }) => (
                      <div key={chave} className="grid grid-cols-[68px_1fr] gap-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {label}
                        </dt>
                        <dd>{plano[chave]}</dd>
                      </div>
                    ))}
                    <div className="grid grid-cols-[68px_1fr] gap-3">
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Quando
                      </dt>
                      <dd>{formatDate(plano.quando)}</dd>
                    </div>
                    {plano.quantoCusta !== undefined && (
                      <div className="grid grid-cols-[68px_1fr] gap-3">
                        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Quanto
                        </dt>
                        <dd className="tabular-nums">
                          {plano.quantoCusta.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {plano.observacaoEficacia && (
                    <p className="rounded-lg border border-conforme/40 bg-conforme-subtle p-3 text-xs text-conforme">
                      {plano.observacaoEficacia}
                    </p>
                  )}
                </CardContent>

                <div className="space-y-2 border-t border-border px-5 py-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-2">
                      {responsavel && (
                        <Avatar
                          nome={responsavel.nome}
                          cor={responsavel.avatarCor}
                          className="size-5"
                        />
                      )}
                      {responsavel?.nome}
                    </span>
                    <span className="tabular-nums">{plano.progresso}%</span>
                  </div>
                  <Progress
                    value={plano.progresso}
                    label={`Progresso do plano ${plano.codigo}`}
                    indicadorClassName={
                      plano.status === "atrasada"
                        ? "bg-nc-maior"
                        : plano.status === "concluida"
                          ? "bg-conforme"
                          : undefined
                    }
                  />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
