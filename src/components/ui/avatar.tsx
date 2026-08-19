import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  nome: string;
  cor?: string;
  className?: string;
}

export function Avatar({ nome, cor, className }: AvatarProps) {
  return (
    <span
      title={nome}
      className={cn(
        "flex size-7 shrink-0 select-none items-center justify-center rounded-full text-[11px] font-semibold text-white",
        className,
      )}
      style={{ backgroundColor: cor ?? "var(--primary)" }}
    >
      {initials(nome)}
    </span>
  );
}

interface AvatarGroupProps {
  pessoas: { nome: string; avatarCor: string }[];
  max?: number;
}

export function AvatarGroup({ pessoas, max = 3 }: AvatarGroupProps) {
  const visiveis = pessoas.slice(0, max);
  const restante = pessoas.length - visiveis.length;
  return (
    <div className="flex items-center -space-x-2">
      {visiveis.map((p) => (
        <Avatar
          key={p.nome}
          nome={p.nome}
          cor={p.avatarCor}
          className="ring-2 ring-surface"
        />
      ))}
      {restante > 0 && (
        <span className="flex size-7 items-center justify-center rounded-full bg-surface-muted text-[11px] font-semibold text-muted-foreground ring-2 ring-surface">
          +{restante}
        </span>
      )}
    </div>
  );
}
