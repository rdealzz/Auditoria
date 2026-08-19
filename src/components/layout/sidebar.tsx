"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, X } from "lucide-react";
import { navegacao } from "./nav-config";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  aberta: boolean;
  aoFechar: () => void;
}

export function Sidebar({ aberta, aoFechar }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay do drawer no mobile */}
      <div
        onClick={aoFechar}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity lg:hidden",
          aberta ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:translate-x-0",
          aberta ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <Link href="/painel" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="size-4.5" aria-hidden />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-semibold tracking-tight">Auditoria</span>
              <span className="mt-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                SGQ · ISO 9001
              </span>
            </span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={aoFechar} aria-label="Fechar menu">
            <X />
          </Button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-thin px-3 py-4" aria-label="Menu principal">
          {navegacao.map((grupo) => (
            <div key={grupo.titulo}>
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {grupo.titulo}
              </p>
              <ul className="space-y-0.5">
                {grupo.itens.map((item) => {
                  const ativo = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={aoFechar}
                        aria-current={ativo ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          ativo
                            ? "bg-primary-subtle font-medium text-primary"
                            : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
                        )}
                      >
                        <item.icon className="size-4 shrink-0" aria-hidden />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <p className="rounded-md bg-surface-muted px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
            Ambiente de demonstração com dados fictícios.
          </p>
        </div>
      </aside>
    </>
  );
}
