"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Alterna entre claro e escuro.
 * Os dois ícones são sempre renderizados e a visibilidade é resolvida por CSS
 * (variante `dark:`), evitando o hydration mismatch clássico de ler o tema no
 * cliente antes da hidratação.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Alternar entre tema claro e escuro"
    >
      <Moon className="dark:hidden" aria-hidden />
      <Sun className="hidden dark:block" aria-hidden />
    </Button>
  );
}
