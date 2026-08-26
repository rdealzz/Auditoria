/* ============================================================
   montagem-roteiro.ts — Monta o roteiro completo de um setor.
   Os blocos técnicos vêm primeiro, porque é onde está o valor
   da inspeção; o núcleo comum do SGI fecha o roteiro.
   ============================================================ */

import { NUCLEO } from './nucleo';
import { setorPorId } from './setores';
import { totalItens, type Bloco, type Setor } from './roteiro';
import type { NormaId } from './sgi';

export function roteiroDoSetor(setorId: string): Bloco[] {
  const setor = setorPorId(setorId);
  if (!setor) return [];
  const comuns = setor.nucleo.map((id) => NUCLEO[id]).filter(Boolean);
  return [...setor.blocos, ...comuns];
}

export function roteiroFiltrado(setorId: string, normas: NormaId[]): Bloco[] {
  if (normas.length === 0) return roteiroDoSetor(setorId);
  return roteiroDoSetor(setorId)
    .map((bloco) => ({
      ...bloco,
      itens: bloco.itens.filter((item) =>
        item.chavesClausulas.some((chave) => {
          const sigla = chave.split(':')[0];
          return normas.includes(
            sigla === '9001' ? 'iso9001' : sigla === '14001' ? 'iso14001' : 'iso45001'
          );
        })
      )
    }))
    .filter((bloco) => bloco.itens.length > 0);
}

export const resumoSetor = (setor: Setor) => {
  const blocos = roteiroDoSetor(setor.id);
  return { blocos: blocos.length, itens: totalItens(blocos) };
};

export const itemPorId = (setorId: string, itemId: string) =>
  roteiroDoSetor(setorId).flatMap((b) => b.itens).find((i) => i.id === itemId);

export const blocoDoItem = (setorId: string, itemId: string) =>
  roteiroDoSetor(setorId).find((b) => b.itens.some((i) => i.id === itemId));
