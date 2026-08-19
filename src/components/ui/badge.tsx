import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      tom: {
        conforme: "border-transparent bg-conforme-subtle text-conforme",
        "nc-menor": "border-transparent bg-nc-menor-subtle text-nc-menor",
        "nc-maior": "border-transparent bg-nc-maior-subtle text-nc-maior",
        observacao: "border-transparent bg-observacao-subtle text-observacao",
        primary: "border-transparent bg-primary-subtle text-primary",
        neutro: "border-transparent bg-neutro-subtle text-muted-foreground",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: { tom: "neutro" },
  },
);

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  /** Exibe o ponto colorido antes do texto — útil em tabelas densas. */
  comPonto?: boolean;
}

export function Badge({ className, tom, comPonto, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tom }), className)} {...props}>
      {comPonto && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
      {children}
    </span>
  );
}

export { badgeVariants };
