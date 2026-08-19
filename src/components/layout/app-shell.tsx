"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { Usuario } from "@/lib/types";

interface AppShellProps {
  usuario: Usuario;
  alertas: number;
  children: React.ReactNode;
}

export function AppShell({ usuario, alertas, children }: AppShellProps) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="min-h-dvh lg:pl-64">
      <Sidebar aberta={menuAberto} aoFechar={() => setMenuAberto(false)} />
      <Topbar usuario={usuario} alertas={alertas} aoAbrirMenu={() => setMenuAberto(true)} />
      <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
