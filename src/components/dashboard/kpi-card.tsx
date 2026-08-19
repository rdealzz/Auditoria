import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  titulo: string;
  valor: string;
  icon: LucideIcon;
  /** Variação percentual em relação ao período anterior. */
  variacao?: number;
  /** Quando true, uma variação positiva é ruim (ex.: NCs abertas). */
  inverterTom?: boolean;
  detalhe?: string;
  destaque?: "neutro" | "alerta" | "critico";
}

export function KpiCard({
  titulo,
  valor,
  icon: Icon,
  variacao,
  inverterTom,
  detalhe,
  destaque = "neutro",
}: KpiCardProps) {
  const positivo = variacao !== undefined && variacao > 0;
  const estavel = variacao !== undefined && variacao === 0;
  const bom = inverterTom ? !positivo : positivo;
  const SetaIcon = estavel ? Minus : positivo ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{titulo}</p>
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-lg",
            destaque === "critico" && "bg-nc-maior-subtle text-nc-maior",
            destaque === "alerta" && "bg-nc-menor-subtle text-nc-menor",
            destaque === "neutro" && "bg-primary-subtle text-primary",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </span>
      </div>

      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{valor}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {variacao !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium tabular-nums",
              estavel ? "text-muted-foreground" : bom ? "text-conforme" : "text-nc-maior",
            )}
          >
            <SetaIcon className="size-3.5" aria-hidden />
            {variacao > 0 ? "+" : ""}
            {variacao.toLocaleString("pt-BR")} p.p.
          </span>
        )}
        {detalhe && <span className="text-muted-foreground">{detalhe}</span>}
      </div>
    </Card>
  );
}
