'use client';

import type { Auditoria, Metricas, Verificacao } from './tipos';
import { roteiroDoSetor } from '@/dados/montagem-roteiro';
import { setorPorId } from '@/dados/setores';
import { totalItens } from '@/dados/roteiro';
import { NORMAS, type NormaId } from '@/dados/sgi';
import { obterSupabase, supabaseAtivo } from './supabase';

const CHAVE_AUDITORIAS = 'auditoria.auditorias.v2';
const CHAVE_PREFERENCIAS = 'auditoria.preferencias.v1';

/* ────────────────────────── util ────────────────────────── */

export const idNovo = () =>
  (globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`);

const noNavegador = () => typeof window !== 'undefined';

function ler<T>(chave: string, padrao: T): T {
  if (!noNavegador()) return padrao;
  try {
    const bruto = window.localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

/** Avisa a interface de que o aparelho não tem mais espaço (ver `provedores`). */
export const EVENTO_SEM_ESPACO = 'auditoria:sem-espaco';

function gravar(chave: string, valor: unknown) {
  if (!noNavegador()) return false;
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
    window.dispatchEvent(new CustomEvent('auditoria:alterado'));
    return true;
  } catch (e) {
    // Silenciar aqui significaria perder a evidência sem ninguém perceber.
    console.warn('Não foi possível gravar localmente.', e);
    window.dispatchEvent(new CustomEvent(EVENTO_SEM_ESPACO));
    return false;
  }
}

/* ────────────────────────── preferências ────────────────────────── */

type Preferencias = { empresa: string; auditor: string; normas: NormaId[] };

export const lerPreferencias = (): Preferencias =>
  ler<Preferencias>(CHAVE_PREFERENCIAS, { empresa: '', auditor: '', normas: NORMAS.map((n) => n.id) });

export const gravarPreferencias = (p: Partial<Preferencias>) =>
  gravar(CHAVE_PREFERENCIAS, { ...lerPreferencias(), ...p });

/* ────────────────────────── auditorias ────────────────────────── */

export function listarAuditorias(): Auditoria[] {
  return ler<Auditoria[]>(CHAVE_AUDITORIAS, []).sort(
    (a, b) => new Date(b.atualizadaEm).getTime() - new Date(a.atualizadaEm).getTime()
  );
}

export const obterAuditoria = (id: string) => listarAuditorias().find((a) => a.id === id);

export function salvarAuditoria(auditoria: Auditoria) {
  const todas = ler<Auditoria[]>(CHAVE_AUDITORIAS, []);
  const i = todas.findIndex((a) => a.id === auditoria.id);
  const atualizada = { ...auditoria, atualizadaEm: new Date().toISOString() };
  if (i >= 0) todas[i] = atualizada;
  else todas.push(atualizada);
  gravar(CHAVE_AUDITORIAS, todas);
  if (supabaseAtivo) void sincronizar(atualizada);
  return atualizada;
}

/** Grava a lista inteira preservando `atualizadaEm` — usado pela importação. */
export function substituirAuditorias(auditorias: Auditoria[]) {
  if (!noNavegador()) return;
  try {
    window.localStorage.setItem(CHAVE_AUDITORIAS, JSON.stringify(auditorias));
  } catch (e) {
    // A importação mostra a própria mensagem; o erro sobe para ela decidir.
    window.dispatchEvent(new CustomEvent(EVENTO_SEM_ESPACO));
    throw e;
  }
  window.dispatchEvent(new CustomEvent('auditoria:alterado'));
  if (supabaseAtivo) for (const a of auditorias) void sincronizar(a);
}

export const excluirAuditoria = (id: string) =>
  gravar(CHAVE_AUDITORIAS, ler<Auditoria[]>(CHAVE_AUDITORIAS, []).filter((a) => a.id !== id));

async function sincronizar(auditoria: Auditoria) {
  const sb = obterSupabase();
  if (!sb) return;
  try {
    await sb.from('auditorias').upsert({ id: auditoria.id, dados: auditoria, atualizada_em: auditoria.atualizadaEm });
  } catch (e) {
    console.warn('Sincronização com Supabase falhou; os dados seguem salvos localmente.', e);
  }
}

/** Gera escopo, objetivo e critério a partir do setor e das normas — o auditor não precisa digitar. */
export function textosPadrao(setorId: string, normas: NormaId[]) {
  const setor = setorPorId(setorId);
  const nomes = NORMAS.filter((n) => normas.includes(n.id)).map((n) => `${n.nome}:${n.ano}`).join(', ');
  const nome = setor?.nome ?? setorId;
  return {
    escopo: `Processos e atividades do setor de ${nome}, incluindo todos os turnos em operação na data da auditoria e as atividades executadas por terceiros dentro da área.`,
    objetivo: `Verificar a conformidade das atividades do setor de ${nome} com os requisitos de ${nomes} e com os procedimentos internos, identificando não conformidades, riscos e oportunidades de melhoria.`,
    criterio: `${nomes}; procedimentos, instruções de trabalho e planos de controle aplicáveis ao setor; requisitos legais e contratuais pertinentes.`
  };
}

export function novaAuditoria(base: Partial<Auditoria> & { setor: string }): Auditoria {
  const agora = new Date().toISOString();
  const sequencia = listarAuditorias().length + 1;
  const normas = base.normas ?? NORMAS.map((n) => n.id);
  const textos = textosPadrao(base.setor, normas);
  return {
    id: idNovo(),
    codigo: `AUD-${new Date().getFullYear()}-${String(sequencia).padStart(3, '0')}`,
    normas,
    empresa: '',
    auditor: '',
    auditado: '',
    data: agora.slice(0, 10),
    ...textos,
    status: 'em_andamento',
    blocoAtual: 0,
    blocosLiberados: [],
    blocosConcluidos: [],
    verificacoes: {},
    naoConformidades: [],
    assinaturas: [],
    observacoesFinais: '',
    criadaEm: agora,
    atualizadaEm: agora,
    tempoTotalMin: 0,
    ...base
  };
}

export const verificacaoVazia = (itemId: string, blocoId: string): Verificacao => ({
  itemId, blocoId, comentario: '', evidencia: '', anexos: []
});

/* ────────────────────────── progresso e métricas ────────────────────────── */

export function progressoBloco(auditoria: Auditoria, blocoId: string) {
  const bloco = roteiroDoSetor(auditoria.setor).find((b) => b.id === blocoId);
  if (!bloco) return { respondidos: 0, total: 0, percentual: 0 };
  const respondidos = bloco.itens.filter((i) => auditoria.verificacoes[i.id]?.resposta).length;
  return { respondidos, total: bloco.itens.length, percentual: bloco.itens.length ? Math.round((respondidos / bloco.itens.length) * 100) : 0 };
}

export function progressoGeral(auditoria: Auditoria) {
  const total = totalItens(roteiroDoSetor(auditoria.setor));
  const respondidos = Object.values(auditoria.verificacoes).filter((v) => v.resposta).length;
  return { respondidos, total, percentual: total ? Math.round((respondidos / total) * 100) : 0 };
}

export function taxaConformidade(auditoria: Auditoria) {
  const avaliadas = Object.values(auditoria.verificacoes).filter((v) => v.resposta && v.resposta !== 'nao_aplicavel');
  if (!avaliadas.length) return 0;
  return Math.round((avaliadas.filter((v) => v.resposta === 'conforme').length / avaliadas.length) * 100);
}

export function contarPorResposta(auditoria: Auditoria) {
  const v = Object.values(auditoria.verificacoes);
  return {
    conforme: v.filter((x) => x.resposta === 'conforme').length,
    nao_conforme: v.filter((x) => x.resposta === 'nao_conforme').length,
    observacao: v.filter((x) => x.resposta === 'observacao').length,
    nao_aplicavel: v.filter((x) => x.resposta === 'nao_aplicavel').length
  };
}

export function calcularMetricas(auditorias: Auditoria[]): Metricas {
  const concluidas = auditorias.filter((a) => a.status === 'concluida');
  const avaliadas = auditorias.flatMap((a) =>
    Object.values(a.verificacoes).filter((v) => v.resposta && v.resposta !== 'nao_aplicavel')
  );
  const tempos = concluidas.map((a) => a.tempoTotalMin).filter((t) => t > 0);
  return {
    total: auditorias.length,
    emAndamento: auditorias.length - concluidas.length,
    concluidas: concluidas.length,
    totalNC: auditorias.reduce((n, a) => n + a.naoConformidades.length, 0),
    taxaConformidade: avaliadas.length
      ? Math.round((avaliadas.filter((v) => v.resposta === 'conforme').length / avaliadas.length) * 100)
      : 0,
    tempoMedioMin: tempos.length ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0,
    verificacoesFeitas: auditorias.reduce((n, a) => n + Object.values(a.verificacoes).filter((v) => v.resposta).length, 0)
  };
}

/* ────────────────────────── usuários e sessão ────────────────────────── */

/**
 * As contas vivem em `lib/contas`: não há mais usuário nem senha embutidos no
 * código. Re‑exportamos aqui para quem já importava deste módulo.
 */
export {
  autenticar, criarConta, encerrarSessao, existeAlgumaConta, listarUsuarios,
  perguntaDe, redefinirSenha, alterarSenha, sessaoAtual
} from './contas';

/* ────────────────────────── formatação ────────────────────────── */

export const formatarData = (iso: string) =>
  new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatarDuracao = (min: number) => {
  if (!min) return '—';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? `${h}h ${m}min` : `${m}min`;
};
