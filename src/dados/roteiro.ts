/* ============================================================
   roteiro.ts — Modelo do roteiro técnico de inspeção.
   Um roteiro é composto por blocos; cada bloco reúne itens de
   verificação concretos, com as cláusulas das três normas que
   o item atende.
   ============================================================ */

import { clausulas, normasDe, type Clausula, type NormaId } from './sgi';

export type ItemVerificacao = {
  id: string;
  /** Ação concreta, não pergunta ampla. Ex.: "Qualificação vigente dos soldadores". */
  titulo: string;
  chavesClausulas: string[];
  /** O que fazer, fisicamente, para verificar. */
  verificar: string[];
  /** Evidência objetiva que o auditado precisa apresentar. */
  evidencias: string[];
  documentos: string[];
  registros: string[];
  /** Equipamentos, instrumentos ou controles a inspecionar. */
  inspecionar?: string[];
  /** Riscos e não conformidades mais comuns nessa atividade. */
  riscos: string[];
  /** Como o auditor conclui que o item está atendido. */
  validar: string;
};

export type Bloco = {
  id: string;
  titulo: string;
  proposito: string;
  ilustracao: string;
  itens: ItemVerificacao[];
};

export type Setor = {
  id: string;
  nome: string;
  familia: 'producao' | 'apoio' | 'gestao';
  resumo: string;
  ilustracao: string;
  /** Blocos do núcleo comum aplicáveis, na ordem em que entram no roteiro. */
  nucleo: string[];
  /** Blocos técnicos exclusivos do setor. */
  blocos: Bloco[];
};

/* ─────────── derivados ─────────── */

export const clausulasDoItem = (item: ItemVerificacao): Clausula[] => clausulas(item.chavesClausulas);
export const normasDoItem = (item: ItemVerificacao): NormaId[] => normasDe(item.chavesClausulas);

export const normasDoBloco = (bloco: Bloco): NormaId[] =>
  normasDe(bloco.itens.flatMap((i) => i.chavesClausulas));

export const totalItens = (blocos: Bloco[]) => blocos.reduce((n, b) => n + b.itens.length, 0);
