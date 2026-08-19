import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Trilha {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  titulo: string;
  descricao?: string;
  trilha?: Trilha[];
  acoes?: React.ReactNode;
}

export function PageHeader({ titulo, descricao, trilha, acoes }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        {trilha && trilha.length > 0 && (
          <nav aria-label="Trilha de navegação">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              {trilha.map((item, i) => (
                <li key={item.label} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="size-3" aria-hidden />}
                  {item.href ? (
                    <Link href={item.href} className="hover:text-foreground">
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current="page">{item.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="text-xl font-semibold tracking-tight">{titulo}</h1>
        {descricao && <p className="max-w-2xl text-sm text-muted-foreground">{descricao}</p>}
      </div>
      {acoes && <div className="flex shrink-0 items-center gap-2 no-print">{acoes}</div>}
    </header>
  );
}
