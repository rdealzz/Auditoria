import type { NormaId } from '@/dados/sgi';

export type Resposta = 'conforme' | 'nao_conforme' | 'observacao' | 'nao_aplicavel';

export type Anexo = {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataUrl?: string;
  url?: string;
  criadoEm: string;
  sugestoesIA?: string[];
};

export type Verificacao = {
  itemId: string;
  blocoId: string;
  resposta?: Resposta;
  comentario: string;
  evidencia: string;
  anexos: Anexo[];
  respondidoEm?: string;
};

export type PlanoAcao = {
  oQue: string;
  porQue: string;
  onde: string;
  quando: string;
  quem: string;
  como: string;
  quanto: string;
  status: 'aberta' | 'em_andamento' | 'concluida' | 'atrasada';
};

export type NaoConformidade = {
  id: string;
  itemId: string;
  blocoId: string;
  /** Cláusulas do item, para que o relatório mostre a norma descumprida. */
  chavesClausulas: string[];
  classificacao: 'maior' | 'menor' | 'observacao';
  descricao: string;
  evidenciaObjetiva: string;
  requisitoDescumprido: string;
  causaRaiz?: string;
  plano?: PlanoAcao;
  criadaEm: string;
};

export type Assinatura = { papel: 'auditor' | 'auditado' | 'responsavel'; nome: string; cargo: string; dataHora: string };

export type StatusAuditoria = 'em_andamento' | 'concluida';

export type Auditoria = {
  id: string;
  codigo: string;
  setor: string;
  /** Normas em escopo. O SGI audita as três ao mesmo tempo por padrão. */
  normas: NormaId[];
  empresa: string;
  auditor: string;
  auditado: string;
  data: string;
  /** Complementos opcionais: gerados automaticamente e editáveis depois. */
  escopo: string;
  objetivo: string;
  criterio: string;
  status: StatusAuditoria;
  blocoAtual: number;
  blocosLiberados: string[];
  blocosConcluidos: string[];
  verificacoes: Record<string, Verificacao>;
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
  totalNC: number;
  taxaConformidade: number;
  tempoMedioMin: number;
  verificacoesFeitas: number;
};
