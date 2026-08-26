/* ============================================================
   Catálogo de setores auditáveis.
   Cada setor traz seus blocos técnicos e escolhe quais blocos
   do núcleo comum do SGI entram no roteiro.
   ============================================================ */

import type { Setor } from '../roteiro';
import { SOLDA } from './solda';
import { PINTURA } from './pintura';
import { GALVANIZACAO } from './galvanizacao';
import { CNC } from './cnc';
import { FABRICACAO } from './fabricacao';
import { MONTAGEM } from './montagem';
import { QUALIDADE } from './qualidade';
import { ENGENHARIA } from './engenharia';
import { CONTRATOS } from './contratos';
import { SESMT } from './sesmt';
import { ALMOXARIFADO } from './almoxarifado';
import { RECEBIMENTO } from './recebimento';
import { EXPEDICAO } from './expedicao';
import { MANUTENCAO } from './manutencao';

export const SETORES: Setor[] = [
  FABRICACAO, SOLDA, CNC, MONTAGEM, PINTURA, GALVANIZACAO,
  QUALIDADE, ENGENHARIA, MANUTENCAO,
  RECEBIMENTO, ALMOXARIFADO, EXPEDICAO,
  CONTRATOS, SESMT
];

export const setorPorId = (id: string) => SETORES.find((s) => s.id === id);

export const FAMILIAS: { id: Setor['familia']; nome: string }[] = [
  { id: 'producao', nome: 'Produção' },
  { id: 'apoio', nome: 'Apoio' },
  { id: 'gestao', nome: 'Gestão' }
];
