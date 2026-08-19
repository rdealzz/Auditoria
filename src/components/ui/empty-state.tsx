import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  titulo: string;
  descricao: string;
  acao?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  titulo,
  descricao,
  acao,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="flex size-11 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold">{titulo}</p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">{descricao}</p>
      </div>
      {acao}
    </div>
  );
}
