/* ---------------------------------------------------------------------------
   Domínio — Auditoria Interna da Qualidade (ISO 9001:2015)
   A terminologia segue a norma: requisito, evidência objetiva, constatação
   (finding), não-conformidade maior/menor, oportunidade de melhoria e
   ação corretiva com verificação de eficácia (cláusula 10.2).
--------------------------------------------------------------------------- */

export type Papel = "admin" | "auditor_lider" | "auditor" | "auditado" | "gestor";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: Papel;
  cargo: string;
  avatarCor: string;
}

/** Status do ciclo de vida de uma auditoria. */
export type StatusAuditoria =
  | "planejada"
  | "em_execucao"
  | "em_relatorio"
  | "concluida"
  | "cancelada";

/** Classificação da constatação conforme ISO 19011 / ISO 9001. */
export type TipoConstatacao =
  | "conforme"
  | "nc_maior"
  | "nc_menor"
  | "observacao"
  | "oportunidade_melhoria"
  | "nao_aplicavel";

export type StatusNaoConformidade =
  | "aberta"
  | "em_analise"
  | "acao_definida"
  | "em_execucao"
  | "aguardando_verificacao"
  | "encerrada_eficaz"
  | "encerrada_ineficaz";

export type StatusAcao = "pendente" | "em_andamento" | "concluida" | "atrasada" | "cancelada";

export type TipoResposta = "conformidade" | "escala" | "texto" | "numero";

/** Requisito da norma verificado por uma pergunta do checklist. */
export interface RequisitoNorma {
  clausula: string;
  titulo: string;
}

export interface PerguntaChecklist {
  id: string;
  ordem: number;
  texto: string;
  requisito: RequisitoNorma;
  tipoResposta: TipoResposta;
  peso: number;
  exigeEvidencia: boolean;
  orientacao?: string;
}

export interface SecaoChecklist {
  id: string;
  titulo: string;
  clausula: string;
  perguntas: PerguntaChecklist[];
}

export interface TemplateAuditoria {
  id: string;
  nome: string;
  norma: string;
  versao: string;
  descricao: string;
  ativo: boolean;
  secoes: SecaoChecklist[];
  atualizadoEm: string;
}

export interface Auditoria {
  id: string;
  codigo: string;
  titulo: string;
  escopo: string;
  processoAuditado: string;
  unidade: string;
  templateId: string;
  norma: string;
  status: StatusAuditoria;
  dataPlanejada: string;
  dataInicio?: string;
  dataConclusao?: string;
  auditorLiderId: string;
  auditoresIds: string[];
  responsavelAreaId: string;
  /** Índice de conformidade em %, calculado a partir das respostas ponderadas. */
  indiceConformidade: number;
  totalPerguntas: number;
  perguntasRespondidas: number;
}

export interface Resposta {
  id: string;
  auditoriaId: string;
  perguntaId: string;
  tipo: TipoConstatacao;
  observacao?: string;
  evidencias: string[];
  respondidoEm: string;
}

export interface NaoConformidade {
  id: string;
  codigo: string;
  auditoriaId: string;
  perguntaId?: string;
  requisito: RequisitoNorma;
  tipo: Extract<TipoConstatacao, "nc_maior" | "nc_menor" | "observacao">;
  descricao: string;
  evidenciaObjetiva: string;
  status: StatusNaoConformidade;
  responsavelId: string;
  abertaEm: string;
  prazo: string;
  encerradaEm?: string;
  causaRaiz?: string;
  metodoAnaliseCausa?: "5_porques" | "ishikawa" | "5w2h";
}

/** Plano de ação no formato 5W2H, vinculado a uma não-conformidade. */
export interface PlanoAcao {
  id: string;
  codigo: string;
  naoConformidadeId: string;
  oQue: string;
  porQue: string;
  onde: string;
  quando: string;
  quem: string;
  responsavelId: string;
  como: string;
  quantoCusta?: number;
  status: StatusAcao;
  progresso: number;
  criadoEm: string;
  concluidoEm?: string;
  eficaciaVerificada?: boolean;
  observacaoEficacia?: string;
}
