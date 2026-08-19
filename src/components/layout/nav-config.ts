import {
  ClipboardCheck,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShieldAlert,
  Target,
  type LucideIcon,
} from "lucide-react";

export interface ItemNav {
  href: string;
  label: string;
  icon: LucideIcon;
  descricao: string;
}

export interface GrupoNav {
  titulo: string;
  itens: ItemNav[];
}

export const navegacao: GrupoNav[] = [
  {
    titulo: "Visão geral",
    itens: [
      {
        href: "/painel",
        label: "Painel",
        icon: LayoutDashboard,
        descricao: "Indicadores do sistema de gestão da qualidade",
      },
    ],
  },
  {
    titulo: "Ciclo de auditoria",
    itens: [
      {
        href: "/auditorias",
        label: "Auditorias",
        icon: ClipboardCheck,
        descricao: "Programa anual, execução e relatórios",
      },
      {
        href: "/nao-conformidades",
        label: "Não-conformidades",
        icon: ShieldAlert,
        descricao: "Constatações e análise de causa",
      },
      {
        href: "/planos-de-acao",
        label: "Planos de ação",
        icon: Target,
        descricao: "Ações corretivas em 5W2H",
      },
    ],
  },
  {
    titulo: "Configuração",
    itens: [
      {
        href: "/templates",
        label: "Checklists",
        icon: ListChecks,
        descricao: "Modelos de auditoria por norma",
      },
      {
        href: "/configuracoes",
        label: "Configurações",
        icon: Settings,
        descricao: "Organização, usuários e preferências",
      },
    ],
  },
];
