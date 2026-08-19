import type {
  StatusAcao,
  StatusAuditoria,
  StatusNaoConformidade,
  TipoConstatacao,
  Papel,
} from "./types";

type Tom = "conforme" | "nc-menor" | "nc-maior" | "observacao" | "primary" | "neutro";

interface Rotulo {
  label: string;
  tom: Tom;
  descricao?: string;
}

export const ROTULO_STATUS_AUDITORIA: Record<StatusAuditoria, Rotulo> = {
  planejada: { label: "Planejada", tom: "neutro" },
  em_execucao: { label: "Em execução", tom: "primary" },
  em_relatorio: { label: "Em relatório", tom: "observacao" },
  concluida: { label: "Concluída", tom: "conforme" },
  cancelada: { label: "Cancelada", tom: "neutro" },
};

export const ROTULO_CONSTATACAO: Record<TipoConstatacao, Rotulo> = {
  conforme: { label: "Conforme", tom: "conforme" },
  nc_maior: {
    label: "NC maior",
    tom: "nc-maior",
    descricao: "Falha sistêmica ou ausência total de requisito da norma.",
  },
  nc_menor: {
    label: "NC menor",
    tom: "nc-menor",
    descricao: "Falha pontual que não compromete a eficácia do sistema.",
  },
  observacao: {
    label: "Observação",
    tom: "observacao",
    descricao: "Situação que pode evoluir para não-conformidade.",
  },
  oportunidade_melhoria: { label: "Oportunidade de melhoria", tom: "primary" },
  nao_aplicavel: { label: "Não aplicável", tom: "neutro" },
};

export const ROTULO_STATUS_NC: Record<StatusNaoConformidade, Rotulo> = {
  aberta: { label: "Aberta", tom: "nc-maior" },
  em_analise: { label: "Em análise de causa", tom: "nc-menor" },
  acao_definida: { label: "Ação definida", tom: "observacao" },
  em_execucao: { label: "Em execução", tom: "primary" },
  aguardando_verificacao: { label: "Aguardando verificação", tom: "observacao" },
  encerrada_eficaz: { label: "Encerrada — eficaz", tom: "conforme" },
  encerrada_ineficaz: { label: "Encerrada — ineficaz", tom: "nc-maior" },
};

export const ROTULO_STATUS_ACAO: Record<StatusAcao, Rotulo> = {
  pendente: { label: "Pendente", tom: "neutro" },
  em_andamento: { label: "Em andamento", tom: "primary" },
  concluida: { label: "Concluída", tom: "conforme" },
  atrasada: { label: "Atrasada", tom: "nc-maior" },
  cancelada: { label: "Cancelada", tom: "neutro" },
};

export const ROTULO_PAPEL: Record<Papel, string> = {
  admin: "Administrador",
  auditor_lider: "Auditor líder",
  auditor: "Auditor",
  auditado: "Auditado",
  gestor: "Gestor da qualidade",
};

/** Status que ainda demandam tratamento — usado nos indicadores. */
export const STATUS_NC_ABERTOS: StatusNaoConformidade[] = [
  "aberta",
  "em_analise",
  "acao_definida",
  "em_execucao",
  "aguardando_verificacao",
];

/**
 * Meta de índice de conformidade definida pela política da qualidade.
 * Abaixo disso a auditoria dispara plano de ação obrigatório.
 */
export const META_CONFORMIDADE = 90;
