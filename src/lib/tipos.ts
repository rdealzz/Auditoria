export type Resposta = 'conforme' | 'nao_conforme' | 'observacao' | 'nao_aplicavel';

export type Anexo = {
  id: string;
  nome: string;
  tipo: string;      // MIME
  tamanho: number;
  dataUrl?: string;  // modo local
  url?: string;      // modo Supabase Storage
  criadoEm: string;
  sugestoesIA?: string[];
};

export type ItemChecklist = {
  requisitoId: string;
  etapa: number;
  clausula: string;
  titulo: string;
  resposta?: Resposta;
  comentario: string;
  evidencia: string;
  anexos: Anexo[];
  respondidoEm?: string;
};

export type PlanoAcao = {
  oQue: string;      // What
  porQue: string;    // Why
  onde: string;      // Where
  quando: string;    // When (prazo)
  quem: string;      // Who
  como: string;      // How
  quanto: string;    // How much
  status: 'aberta' | 'em_andamento' | 'concluida' | 'atrasada';
};

export type NaoConformidade = {
  id: string;
  requisitoId: string;
  etapa: number;
  clausula: string;
  classificacao: 'maior' | 'menor' | 'observacao';
  descricao: string;
  evidenciaObjetiva: string;
  requisitoDescumprido: string;
  causaRaiz?: string;
  plano?: PlanoAcao;
  criadaEm: string;
};

export type Assinatura = { papel: 'auditor' | 'auditado' | 'responsavel'; nome: string; cargo: string; dataHora: string };

export type StatusAuditoria = 'rascunho' | 'em_andamento' | 'concluida';

export type Auditoria = {
  id: string;
  codigo: string;
  norma: string;
  setor: string;
  processo: string;
  empresa: string;
  auditor: string;
  auditado: string;
  data: string;
  escopo: string;
  objetivo: string;
  criterio: string;
  status: StatusAuditoria;
  etapaAtual: number;
  etapasConcluidas: number[];
  etapasLiberadas: number[];      // etapas cuja explicação já foi lida
  itens: Record<string, ItemChecklist>;
  naoConformidades: NaoConformidade[];
  assinaturas: Assinatura[];
  observacoesFinais: string;
  criadaEm: string;
  atualizadaEm: string;
  concluidaEm?: string;
  tempoTotalMin: number;
};

export type Usuario = { id: string; usuario: string; nome: string; email?: string; perfil: 'administrador'; criadoEm: string };

export type Metricas = {
  total: number;
  emAndamento: number;
  concluidas: number;
  pendentes: number;
  totalNC: number;
  taxaConformidade: number;
  tempoMedioMin: number;
  itensRespondidos: number;
};
