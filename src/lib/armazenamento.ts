'use client';

import type { Auditoria, ItemChecklist, Metricas, Usuario } from './tipos';
import { ETAPAS, TOTAL_REQUISITOS } from '@/dados/etapas';
import { obterSupabase, supabaseAtivo } from './supabase';

const CHAVE_AUDITORIAS = 'auditoria.auditorias.v1';
const CHAVE_SESSAO = 'auditoria.sessao.v1';
const CHAVE_USUARIOS = 'auditoria.usuarios.v1';

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

function gravar(chave: string, valor: unknown) {
  if (!noNavegador()) return;
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
    window.dispatchEvent(new CustomEvent('auditoria:alterado'));
  } catch (e) {
    console.warn('Não foi possível gravar localmente.', e);
  }
}

/* ────────────────────────── auditorias ────────────────────────── */

export function listarAuditorias(): Auditoria[] {
  return ler<Auditoria[]>(CHAVE_AUDITORIAS, []).sort(
    (a, b) => new Date(b.atualizadaEm).getTime() - new Date(a.atualizadaEm).getTime()
  );
}

export function obterAuditoria(id: string): Auditoria | undefined {
  return listarAuditorias().find((a) => a.id === id);
}

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

export function excluirAuditoria(id: string) {
  gravar(CHAVE_AUDITORIAS, ler<Auditoria[]>(CHAVE_AUDITORIAS, []).filter((a) => a.id !== id));
}

async function sincronizar(auditoria: Auditoria) {
  const sb = obterSupabase();
  if (!sb) return;
  try {
    await sb.from('auditorias').upsert({ id: auditoria.id, dados: auditoria, atualizada_em: auditoria.atualizadaEm });
  } catch (e) {
    console.warn('Sincronização com Supabase falhou; os dados seguem salvos localmente.', e);
  }
}

export function novaAuditoria(base: Partial<Auditoria>): Auditoria {
  const agora = new Date().toISOString();
  const sequencia = listarAuditorias().length + 1;
  return {
    id: idNovo(),
    codigo: `AUD-${new Date().getFullYear()}-${String(sequencia).padStart(3, '0')}`,
    norma: 'iso9001',
    setor: 'producao',
    processo: '',
    empresa: '',
    auditor: '',
    auditado: '',
    data: agora.slice(0, 10),
    escopo: '',
    objetivo: '',
    criterio: '',
    status: 'rascunho',
    etapaAtual: 1,
    etapasConcluidas: [],
    etapasLiberadas: [],
    itens: {},
    naoConformidades: [],
    assinaturas: [],
    observacoesFinais: '',
    criadaEm: agora,
    atualizadaEm: agora,
    tempoTotalMin: 0,
    ...base
  };
}

export function itemVazio(requisitoId: string): ItemChecklist {
  const etapa = ETAPAS.find((e) => e.requisitos.some((r) => r.id === requisitoId));
  const req = etapa?.requisitos.find((r) => r.id === requisitoId);
  return {
    requisitoId,
    etapa: etapa?.numero ?? 0,
    clausula: req?.clausula ?? '',
    titulo: req?.titulo ?? '',
    comentario: '',
    evidencia: '',
    anexos: []
  };
}

/* ────────────────────────── métricas ────────────────────────── */

export function progressoEtapa(auditoria: Auditoria, numeroEtapa: number) {
  const etapa = ETAPAS.find((e) => e.numero === numeroEtapa);
  if (!etapa) return { respondidos: 0, total: 0, percentual: 0 };
  const total = etapa.requisitos.length;
  const respondidos = etapa.requisitos.filter((r) => auditoria.itens[r.id]?.resposta).length;
  return { respondidos, total, percentual: total ? Math.round((respondidos / total) * 100) : 0 };
}

export function progressoGeral(auditoria: Auditoria) {
  const respondidos = Object.values(auditoria.itens).filter((i) => i.resposta).length;
  return {
    respondidos,
    total: TOTAL_REQUISITOS,
    percentual: Math.round((respondidos / TOTAL_REQUISITOS) * 100)
  };
}

export function taxaConformidade(auditoria: Auditoria) {
  const itens = Object.values(auditoria.itens).filter((i) => i.resposta && i.resposta !== 'nao_aplicavel');
  if (!itens.length) return 0;
  const conformes = itens.filter((i) => i.resposta === 'conforme').length;
  return Math.round((conformes / itens.length) * 100);
}

export function contarPorResposta(auditoria: Auditoria) {
  const itens = Object.values(auditoria.itens);
  return {
    conforme: itens.filter((i) => i.resposta === 'conforme').length,
    nao_conforme: itens.filter((i) => i.resposta === 'nao_conforme').length,
    observacao: itens.filter((i) => i.resposta === 'observacao').length,
    nao_aplicavel: itens.filter((i) => i.resposta === 'nao_aplicavel').length
  };
}

export function calcularMetricas(auditorias: Auditoria[]): Metricas {
  const concluidas = auditorias.filter((a) => a.status === 'concluida');
  const emAndamento = auditorias.filter((a) => a.status === 'em_andamento');
  const pendentes = auditorias.filter((a) => a.status === 'rascunho');
  const totalNC = auditorias.reduce((n, a) => n + a.naoConformidades.length, 0);

  const avaliados = auditorias.flatMap((a) =>
    Object.values(a.itens).filter((i) => i.resposta && i.resposta !== 'nao_aplicavel')
  );
  const conformes = avaliados.filter((i) => i.resposta === 'conforme').length;

  const tempos = concluidas.map((a) => a.tempoTotalMin).filter((t) => t > 0);

  return {
    total: auditorias.length,
    emAndamento: emAndamento.length,
    concluidas: concluidas.length,
    pendentes: pendentes.length,
    totalNC,
    taxaConformidade: avaliados.length ? Math.round((conformes / avaliados.length) * 100) : 0,
    tempoMedioMin: tempos.length ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0,
    itensRespondidos: auditorias.reduce((n, a) => n + Object.values(a.itens).filter((i) => i.resposta).length, 0)
  };
}

/* ────────────────────────── usuários e sessão ────────────────────────── */

const USUARIO_SEMENTE: Usuario = {
  id: 'u-erick',
  usuario: 'erick.jesus',
  nome: 'Erick Jesus',
  perfil: 'administrador',
  criadoEm: new Date('2026-01-01').toISOString()
};

/** Credenciais iniciais. Nesta versão todos os perfis têm exatamente as mesmas permissões. */
const CREDENCIAIS: Record<string, string> = { 'erick.jesus': 'qualidade' };

export function listarUsuarios(): Usuario[] {
  const salvos = ler<Usuario[]>(CHAVE_USUARIOS, []);
  return salvos.some((u) => u.usuario === USUARIO_SEMENTE.usuario) ? salvos : [USUARIO_SEMENTE, ...salvos];
}

export function autenticar(usuario: string, senha: string): Usuario | null {
  const login = usuario.trim().toLowerCase();
  if (CREDENCIAIS[login] && CREDENCIAIS[login] === senha) {
    const u = listarUsuarios().find((x) => x.usuario === login) ?? USUARIO_SEMENTE;
    gravar(CHAVE_SESSAO, u);
    return u;
  }
  return null;
}

export function sessaoAtual(): Usuario | null {
  return ler<Usuario | null>(CHAVE_SESSAO, null);
}

export function encerrarSessao() {
  if (noNavegador()) window.localStorage.removeItem(CHAVE_SESSAO);
}

/* ────────────────────────── formatação ────────────────────────── */

export const formatarData = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const formatarDataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const formatarDuracao = (min: number) => {
  if (!min) return '—';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? `${h}h ${m}min` : `${m}min`;
};
