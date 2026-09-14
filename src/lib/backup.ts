'use client';

/**
 * Exportar e importar auditorias em um arquivo `.json`.
 *
 * Serve para duas coisas: ter uma cópia de segurança (o modo local guarda tudo
 * no navegador do aparelho, e limpar os dados do navegador apaga o histórico) e
 * levar auditorias de um aparelho para outro — do tablet da fábrica para o
 * computador do escritório, por exemplo.
 *
 * O arquivo NÃO contém contas nem senhas: só as auditorias.
 */

import type { Anexo, Assinatura, Auditoria, NaoConformidade, PlanoAcao, Verificacao } from './tipos';
import { NORMAS, type NormaId } from '@/dados/sgi';
import { idNovo, lerPreferencias, listarAuditorias, substituirAuditorias, gravarPreferencias } from './armazenamento';

export const FORMATO = 'auditoria.backup';
export const VERSAO = 1;

export type Preferencias = { empresa: string; auditor: string; normas: NormaId[] };

export type Pacote = {
  formato: typeof FORMATO;
  versao: number;
  geradoEm: string;
  geradoPor?: { usuario: string; nome: string };
  incluiAnexos: boolean;
  auditorias: Auditoria[];
  preferencias?: Preferencias;
};

export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };

/* ────────────────────────── exportar ────────────────────────── */

/** Remove o conteúdo das evidências, mantendo o registro de que elas existem. */
const semConteudo = (anexos: Anexo[]): Anexo[] => anexos.map(({ dataUrl, ...resto }) => resto);

function enxugar(auditoria: Auditoria): Auditoria {
  const verificacoes: Record<string, Verificacao> = {};
  for (const [chave, v] of Object.entries(auditoria.verificacoes)) {
    verificacoes[chave] = { ...v, anexos: semConteudo(v.anexos ?? []) };
  }
  return { ...auditoria, verificacoes };
}

export function montarPacote(
  auditorias: Auditoria[],
  opcoes: { incluirAnexos: boolean; incluirPreferencias: boolean; geradoPor?: { usuario: string; nome: string } }
): Pacote {
  return {
    formato: FORMATO,
    versao: VERSAO,
    geradoEm: new Date().toISOString(),
    geradoPor: opcoes.geradoPor,
    incluiAnexos: opcoes.incluirAnexos,
    auditorias: opcoes.incluirAnexos ? auditorias : auditorias.map(enxugar),
    preferencias: opcoes.incluirPreferencias ? lerPreferencias() : undefined
  };
}

/** Tamanho aproximado do arquivo que será baixado. */
export const tamanhoDoPacote = (pacote: Pacote) => new Blob([JSON.stringify(pacote)]).size;

export const formatarTamanho = (bytes: number) =>
  bytes < 1024 ? `${bytes} B`
    : bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function nomeDoArquivo(auditorias: Auditoria[]) {
  const dia = new Date().toISOString().slice(0, 10);
  if (auditorias.length === 1) return `${auditorias[0].codigo || 'auditoria'}-${dia}.json`;
  return `auditorias-${dia}.json`;
}

/** Entrega o arquivo ao navegador. */
export function baixar(pacote: Pacote, nome: string) {
  const blob = new Blob([JSON.stringify(pacote, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // O objeto só pode ser liberado depois que o download começou.
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ────────────────────────── ler o arquivo ────────────────────────── */

const texto = (v: unknown, padrao = '') => (typeof v === 'string' ? v : padrao);
const lista = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

function sanearAnexo(bruto: Record<string, unknown>): Anexo {
  return {
    id: texto(bruto.id) || idNovo(),
    nome: texto(bruto.nome, 'evidência'),
    tipo: texto(bruto.tipo, 'application/octet-stream'),
    tamanho: typeof bruto.tamanho === 'number' ? bruto.tamanho : 0,
    dataUrl: typeof bruto.dataUrl === 'string' ? bruto.dataUrl : undefined,
    url: typeof bruto.url === 'string' ? bruto.url : undefined,
    criadoEm: texto(bruto.criadoEm) || new Date().toISOString(),
    sugestoesIA: lista<string>(bruto.sugestoesIA)
  };
}

const CLASSIFICACOES = ['maior', 'menor', 'observacao'] as const;
const PAPEIS = ['auditor', 'auditado', 'responsavel'] as const;
const STATUS_PLANO = ['aberta', 'em_andamento', 'concluida', 'atrasada'] as const;

const umDe = <T extends string>(valores: readonly T[], v: unknown, padrao: T): T =>
  valores.includes(v as T) ? (v as T) : padrao;

function sanearPlano(bruto: unknown): PlanoAcao | undefined {
  if (!bruto || typeof bruto !== 'object') return undefined;
  const b = bruto as Record<string, unknown>;
  return {
    oQue: texto(b.oQue), porQue: texto(b.porQue), onde: texto(b.onde), quando: texto(b.quando),
    quem: texto(b.quem), como: texto(b.como), quanto: texto(b.quanto),
    status: umDe(STATUS_PLANO, b.status, 'aberta')
  };
}

/**
 * Uma NC sem `chavesClausulas` derrubava o relatório inteiro (`clausulas()` chama
 * `.map` direto). Tudo o que vem do arquivo passa por aqui antes de ser gravado.
 */
function sanearNC(bruto: unknown): NaoConformidade | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const b = bruto as Record<string, unknown>;
  return {
    id: texto(b.id) || idNovo(),
    itemId: texto(b.itemId),
    blocoId: texto(b.blocoId),
    chavesClausulas: lista<unknown>(b.chavesClausulas).filter((c): c is string => typeof c === 'string'),
    classificacao: umDe(CLASSIFICACOES, b.classificacao, 'menor'),
    descricao: texto(b.descricao),
    evidenciaObjetiva: texto(b.evidenciaObjetiva),
    requisitoDescumprido: texto(b.requisitoDescumprido),
    causaRaiz: typeof b.causaRaiz === 'string' ? b.causaRaiz : undefined,
    plano: sanearPlano(b.plano),
    criadaEm: texto(b.criadaEm) || new Date().toISOString()
  };
}

function sanearAssinatura(bruto: unknown): Assinatura | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const b = bruto as Record<string, unknown>;
  return {
    papel: umDe(PAPEIS, b.papel, 'auditor'),
    nome: texto(b.nome),
    cargo: texto(b.cargo),
    dataHora: texto(b.dataHora) || new Date().toISOString()
  };
}

/** Aceita o que veio do arquivo, completando o que faltar — um JSON antigo não pode quebrar a tela. */
function sanearAuditoria(bruto: unknown): Auditoria | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const b = bruto as Record<string, unknown>;
  if (!texto(b.setor)) return null; // sem setor não há roteiro possível

  const agora = new Date().toISOString();
  const verificacoes: Record<string, Verificacao> = {};
  if (b.verificacoes && typeof b.verificacoes === 'object') {
    for (const [chave, valor] of Object.entries(b.verificacoes as Record<string, unknown>)) {
      if (!valor || typeof valor !== 'object') continue;
      const v = valor as Record<string, unknown>;
      verificacoes[chave] = {
        itemId: texto(v.itemId, chave),
        blocoId: texto(v.blocoId),
        resposta: ['conforme', 'nao_conforme', 'observacao', 'nao_aplicavel'].includes(texto(v.resposta))
          ? (v.resposta as Verificacao['resposta'])
          : undefined,
        comentario: texto(v.comentario),
        evidencia: texto(v.evidencia),
        anexos: lista<Record<string, unknown>>(v.anexos).map(sanearAnexo),
        respondidoEm: typeof v.respondidoEm === 'string' ? v.respondidoEm : undefined
      };
    }
  }

  const normas = lista<string>(b.normas).filter((n): n is NormaId => NORMAS.some((x) => x.id === n));

  return {
    id: texto(b.id) || idNovo(),
    codigo: texto(b.codigo, 'AUD-IMPORTADA'),
    setor: texto(b.setor),
    normas: normas.length ? normas : NORMAS.map((n) => n.id),
    empresa: texto(b.empresa),
    auditor: texto(b.auditor),
    auditado: texto(b.auditado),
    data: texto(b.data) || agora.slice(0, 10),
    escopo: texto(b.escopo),
    objetivo: texto(b.objetivo),
    criterio: texto(b.criterio),
    status: b.status === 'concluida' ? 'concluida' : 'em_andamento',
    blocoAtual: typeof b.blocoAtual === 'number' ? b.blocoAtual : 0,
    blocosLiberados: lista<string>(b.blocosLiberados),
    blocosConcluidos: lista<string>(b.blocosConcluidos),
    verificacoes,
    naoConformidades: lista<unknown>(b.naoConformidades).map(sanearNC).filter((n): n is NaoConformidade => n !== null),
    assinaturas: lista<unknown>(b.assinaturas).map(sanearAssinatura).filter((a): a is Assinatura => a !== null),
    observacoesFinais: texto(b.observacoesFinais),
    criadaEm: texto(b.criadaEm) || agora,
    atualizadaEm: texto(b.atualizadaEm) || texto(b.criadaEm) || agora,
    concluidaEm: typeof b.concluidaEm === 'string' ? b.concluidaEm : undefined,
    tempoTotalMin: typeof b.tempoTotalMin === 'number' ? b.tempoTotalMin : 0
  };
}

export function lerPacote(conteudo: string): Resultado<Pacote> {
  let bruto: unknown;
  try {
    bruto = JSON.parse(conteudo);
  } catch {
    return { ok: false, erro: 'O arquivo não é um JSON válido. Escolha o arquivo gerado pela exportação.' };
  }
  if (!bruto || typeof bruto !== 'object') return { ok: false, erro: 'Arquivo vazio ou em formato desconhecido.' };

  const b = bruto as Record<string, unknown>;
  if (texto(b.formato) !== FORMATO)
    return { ok: false, erro: 'Este arquivo não é uma exportação do Auditoria.' };
  if (typeof b.versao === 'number' && b.versao > VERSAO)
    return { ok: false, erro: `O arquivo foi gerado por uma versão mais nova (v${b.versao}). Atualize o sistema antes de importar.` };

  const auditorias = lista<unknown>(b.auditorias).map(sanearAuditoria).filter((a): a is Auditoria => a !== null);
  if (!auditorias.length) return { ok: false, erro: 'Nenhuma auditoria utilizável foi encontrada no arquivo.' };

  const p = b.preferencias as Record<string, unknown> | undefined;
  return {
    ok: true,
    valor: {
      formato: FORMATO,
      versao: typeof b.versao === 'number' ? b.versao : 1,
      geradoEm: texto(b.geradoEm) || new Date().toISOString(),
      geradoPor: b.geradoPor && typeof b.geradoPor === 'object'
        ? { usuario: texto((b.geradoPor as Record<string, unknown>).usuario), nome: texto((b.geradoPor as Record<string, unknown>).nome) }
        : undefined,
      incluiAnexos: b.incluiAnexos !== false,
      auditorias,
      preferencias: p
        ? { empresa: texto(p.empresa), auditor: texto(p.auditor), normas: lista<NormaId>(p.normas) }
        : undefined
    }
  };
}

/* ────────────────────────── importar ────────────────────────── */

export type Estrategia = 'recente' | 'substituir' | 'pular' | 'copia';

export const ESTRATEGIAS: { valor: Estrategia; texto: string; explicacao: string }[] = [
  { valor: 'recente', texto: 'Ficar com a mais recente', explicacao: 'Compara a data da última alteração e mantém a versão mais nova.' },
  { valor: 'substituir', texto: 'Substituir pela do arquivo', explicacao: 'A versão do arquivo sobrescreve a que está neste aparelho.' },
  { valor: 'pular', texto: 'Manter a deste aparelho', explicacao: 'As repetidas são ignoradas; só entram as auditorias novas.' },
  { valor: 'copia', texto: 'Importar como cópia', explicacao: 'Guarda as duas: a repetida entra como uma auditoria separada.' }
];

export type Previa = {
  total: number;
  novas: Auditoria[];
  repetidas: { doArquivo: Auditoria; local: Auditoria }[];
  incluiAnexos: boolean;
  geradoEm: string;
  geradoPor?: { usuario: string; nome: string };
  temPreferencias: boolean;
};

/** O que aconteceria ao importar — mostrado antes de confirmar. */
export function analisar(pacote: Pacote): Previa {
  const locais = new Map(listarAuditorias().map((a) => [a.id, a]));
  const novas: Auditoria[] = [];
  const repetidas: { doArquivo: Auditoria; local: Auditoria }[] = [];

  for (const a of pacote.auditorias) {
    const local = locais.get(a.id);
    if (local) repetidas.push({ doArquivo: a, local });
    else novas.push(a);
  }

  return {
    total: pacote.auditorias.length,
    novas,
    repetidas,
    incluiAnexos: pacote.incluiAnexos,
    geradoEm: pacote.geradoEm,
    geradoPor: pacote.geradoPor,
    temPreferencias: Boolean(pacote.preferencias)
  };
}

export type Balanco = { novas: number; atualizadas: number; mantidas: number; copias: number };

export function importar(
  pacote: Pacote,
  opcoes: { estrategia: Estrategia; trazerPreferencias: boolean }
): Resultado<Balanco> {
  const atuais = listarAuditorias();
  const porId = new Map(atuais.map((a) => [a.id, a]));
  const balanco: Balanco = { novas: 0, atualizadas: 0, mantidas: 0, copias: 0 };

  for (const doArquivo of pacote.auditorias) {
    const local = porId.get(doArquivo.id);

    if (!local) {
      porId.set(doArquivo.id, doArquivo);
      balanco.novas++;
      continue;
    }

    if (opcoes.estrategia === 'pular') { balanco.mantidas++; continue; }

    if (opcoes.estrategia === 'copia') {
      const copia: Auditoria = {
        ...doArquivo,
        id: idNovo(),
        codigo: `${doArquivo.codigo}-IMP`,
        atualizadaEm: new Date().toISOString()
      };
      porId.set(copia.id, copia);
      balanco.copias++;
      continue;
    }

    const arquivoMaisNovo = new Date(doArquivo.atualizadaEm).getTime() > new Date(local.atualizadaEm).getTime();
    if (opcoes.estrategia === 'substituir' || arquivoMaisNovo) {
      porId.set(doArquivo.id, doArquivo);
      balanco.atualizadas++;
    } else {
      balanco.mantidas++;
    }
  }

  try {
    substituirAuditorias([...porId.values()]);
  } catch {
    return { ok: false, erro: 'Não foi possível gravar: o armazenamento do navegador está cheio. Exporte sem as fotos ou libere espaço.' };
  }

  if (opcoes.trazerPreferencias && pacote.preferencias) gravarPreferencias(pacote.preferencias);
  return { ok: true, valor: balanco };
}
