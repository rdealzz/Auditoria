import {
  auditorias,
  historicoConformidade,
  naoConformidades,
  ncPorProcesso,
  planosAcao,
  templates,
  usuarios,
} from "./mock-data";
import { META_CONFORMIDADE, STATUS_NC_ABERTOS } from "./dominio";
import { daysUntil } from "./utils";
import type { Auditoria, NaoConformidade, PlanoAcao, Usuario } from "./types";

/* ---------------------------------------------------------------------------
   Camada de acesso a dados.
   Hoje lê dos dados de demonstração; ao plugar o Supabase basta reescrever
   estas funções — os componentes permanecem inalterados.
--------------------------------------------------------------------------- */

export function obterUsuario(id: string): Usuario | undefined {
  return usuarios.find((u) => u.id === id);
}

export function obterUsuarios(ids: string[]): Usuario[] {
  return ids.map(obterUsuario).filter((u): u is Usuario => Boolean(u));
}

export function obterUsuarioAtual(): Usuario {
  return usuarios[0];
}

export function listarAuditorias(): Auditoria[] {
  return [...auditorias].sort((a, b) => b.dataPlanejada.localeCompare(a.dataPlanejada));
}

export function obterAuditoria(id: string): Auditoria | undefined {
  return auditorias.find((a) => a.id === id);
}

export function listarNaoConformidades(): NaoConformidade[] {
  return [...naoConformidades].sort((a, b) => b.abertaEm.localeCompare(a.abertaEm));
}

export function obterNaoConformidade(id: string): NaoConformidade | undefined {
  return naoConformidades.find((nc) => nc.id === id);
}

export function listarNCsDaAuditoria(auditoriaId: string): NaoConformidade[] {
  return naoConformidades.filter((nc) => nc.auditoriaId === auditoriaId);
}

export function listarPlanosAcao(): PlanoAcao[] {
  return [...planosAcao].sort((a, b) => a.quando.localeCompare(b.quando));
}

export function obterPlanoDaNC(ncId: string): PlanoAcao | undefined {
  return planosAcao.find((pa) => pa.naoConformidadeId === ncId);
}

export function listarTemplates() {
  return templates;
}

export function obterTemplate(id: string) {
  return templates.find((t) => t.id === id);
}

export interface IndicadoresPainel {
  indiceConformidade: number;
  variacaoConformidade: number;
  metaConformidade: number;
  ncsAbertas: number;
  ncsMaioresAbertas: number;
  ncsVencidas: number;
  auditoriasEmAndamento: number;
  auditoriasPlanejadas: number;
  taxaFechamentoNoPrazo: number;
  acoesAtrasadas: number;
}

/**
 * Consolida os indicadores do painel.
 * O índice de conformidade considera apenas auditorias já encerradas, para
 * não distorcer a média com auditorias parcialmente respondidas.
 */
export function obterIndicadores(): IndicadoresPainel {
  const encerradas = auditorias.filter((a) => a.status === "concluida");
  const indice =
    encerradas.reduce((soma, a) => soma + a.indiceConformidade, 0) / (encerradas.length || 1);

  const [penultimo, ultimo] = historicoConformidade.slice(-2);

  const abertas = naoConformidades.filter((nc) => STATUS_NC_ABERTOS.includes(nc.status));
  const encerradasNC = naoConformidades.filter((nc) => nc.encerradaEm);
  const noPrazo = encerradasNC.filter((nc) => nc.encerradaEm! <= nc.prazo);

  return {
    indiceConformidade: Number(indice.toFixed(1)),
    variacaoConformidade: Number((ultimo.indice - penultimo.indice).toFixed(1)),
    metaConformidade: META_CONFORMIDADE,
    ncsAbertas: abertas.length,
    ncsMaioresAbertas: abertas.filter((nc) => nc.tipo === "nc_maior").length,
    ncsVencidas: abertas.filter((nc) => daysUntil(nc.prazo) < 0).length,
    auditoriasEmAndamento: auditorias.filter(
      (a) => a.status === "em_execucao" || a.status === "em_relatorio",
    ).length,
    auditoriasPlanejadas: auditorias.filter((a) => a.status === "planejada").length,
    taxaFechamentoNoPrazo: encerradasNC.length
      ? Number(((noPrazo.length / encerradasNC.length) * 100).toFixed(0))
      : 0,
    acoesAtrasadas: planosAcao.filter((pa) => pa.status === "atrasada").length,
  };
}

export function obterHistoricoConformidade() {
  return historicoConformidade;
}

export function obterNCsPorProcesso() {
  return ncPorProcesso;
}

/** Distribuição das constatações por classificação, para o gráfico de rosca. */
export function obterDistribuicaoNCs() {
  const contagem = { nc_maior: 0, nc_menor: 0, observacao: 0 };
  for (const nc of naoConformidades) contagem[nc.tipo] += 1;
  return [
    { nome: "NC maior", valor: contagem.nc_maior, cor: "var(--nc-maior)" },
    { nome: "NC menor", valor: contagem.nc_menor, cor: "var(--nc-menor)" },
    { nome: "Observação", valor: contagem.observacao, cor: "var(--observacao)" },
  ];
}

/** Não-conformidades abertas ordenadas pela proximidade do prazo. */
export function listarNCsCriticas(limite = 5): NaoConformidade[] {
  return naoConformidades
    .filter((nc) => STATUS_NC_ABERTOS.includes(nc.status))
    .sort((a, b) => a.prazo.localeCompare(b.prazo))
    .slice(0, limite);
}
