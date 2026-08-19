"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { ROTULO_PAPEL } from "@/lib/dominio";
import type { Usuario } from "@/lib/types";

interface TopbarProps {
  usuario: Usuario;
  aoAbrirMenu: () => void;
  alertas: number;
}

export function Topbar({ usuario, aoAbrirMenu, alertas }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur no-print">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={aoAbrirMenu} aria-label="Abrir menu">
        <Menu />
      </Button>

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          placeholder="Buscar auditoria, NC ou requisito…"
          aria-label="Buscar"
          className="pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button variant="ghost" size="icon" aria-label={`Notificações: ${alertas} pendências`} className="relative">
          <Bell />
          {alertas > 0 && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-nc-maior ring-2 ring-background" />
          )}
        </Button>
        <ThemeToggle />
        <div className="ml-2 flex items-center gap-2.5 border-l border-border pl-3">
          <Avatar nome={usuario.nome} cor={usuario.avatarCor} className="size-8" />
          <div className="hidden leading-tight md:block">
            <p className="text-sm font-medium">{usuario.nome}</p>
            <p className="text-xs text-muted-foreground">{ROTULO_PAPEL[usuario.papel]}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
