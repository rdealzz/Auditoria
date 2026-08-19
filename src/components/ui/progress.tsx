import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  className?: string;
  indicadorClassName?: string;
  label?: string;
}

export function Progress({ value, className, indicadorClassName, label }: ProgressProps) {
  const seguro = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(seguro)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-muted", className)}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-all", indicadorClassName)}
        style={{ width: `${seguro}%` }}
      />
    </div>
  );
}
