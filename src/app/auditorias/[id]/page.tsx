'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import ExplicacaoEtapa from '@/components/ExplicacaoEtapa';
import ItemChecklist from '@/components/ItemChecklist';
import ModalNC from '@/components/ModalNC';
import PainelAssistente from '@/components/PainelAssistente';
import Conclusao from '@/components/Conclusao';
import { Botao, Etiqueta } from '@/components/ui';
import { IconeCheck, IconeSeta, IconeVoltar } from '@/components/Icones';
import { ETAPAS, TOTAL_ETAPAS, etapaPorNumero } from '@/dados/etapas';
import { nomeNorma, setorPorId } from '@/dados/normas';
import type { Auditoria, ItemChecklist as TItem, NaoConformidade } from '@/lib/tipos';
import {
  idNovo, itemVazio, obterAuditoria, progressoEtapa, progressoGeral, salvarAuditoria
} from '@/lib/armazenamento';
import { useApp } from '@/app/provedores';

export default function PaginaAuditoria() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { usuario, avisar } = useApp();

  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);
  const [naoEncontrada, setNaoEncontrada] = useState(false);
  const [ncEmEdicao, setNcEmEdicao] = useState<NaoConformidade | null>(null);
  const topo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = obterAuditoria(id);
    if (a) setAuditoria(a);
    else setNaoEncontrada(true);
  }, [id]);

  /* Contabiliza o tempo efetivo com a auditoria aberta. */
  useEffect(() => {
    if (!auditoria || auditoria.status === 'concluida') return;
    const t = setInterval(() => {
      setAuditoria((a) => (a ? salvarAuditoria({ ...a, tempoTotalMin: a.tempoTotalMin + 1 }) : a));
    }, 60_000);
    return () => clearInterval(t);
  }, [auditoria?.id, auditoria?.status]);

  const atualizar = useCallback((mudanca: Partial<Auditoria>) => {
    setAuditoria((a) => (a ? salvarAuditoria({ ...a, ...mudanca }) : a));
  }, []);

  const etapa = auditoria ? etapaPorNumero(auditoria.etapaAtual) : undefined;
  const setor = auditoria ? setorPorId(auditoria.setor) : undefined;

  const contexto = useMemo(
    () => auditoria && {
      empresa: auditoria.empresa, setor: setor?.nome ?? auditoria.setor, processo: auditoria.processo,
      norma: nomeNorma(auditoria.norma), auditor: auditoria.auditor, auditado: auditoria.auditado,
      criterio: auditoria.criterio, etapa: auditoria.etapaAtual
    },
    [auditoria, setor]
  );

  if (naoEncontrada) {
    return (
      <>
        <Navegacao />
        <main className="mx-auto max-w-conteudo px-5 py-20 text-center">
          <h1 className="text-[26px] font-semibold">Auditoria não encontrada</h1>
          <p className="mt-2 text-[15px] text-texto3">Ela pode ter sido excluída ou criada em outro navegador.</p>
          <Link href="/painel" className="mt-6 inline-block"><Botao variante="primario">Voltar ao painel</Botao></Link>
        </main>
      </>
    );
  }

  if (!usuario || !auditoria || !etapa || !contexto) return <Navegacao />;

  const emExplicacao = !auditoria.etapasLiberadas.includes(etapa.numero);
  const progEtapa = progressoEtapa(auditoria, etapa.numero);
  const progGeral = progressoGeral(auditoria);
  const etapaCompleta = progEtapa.respondidos === progEtapa.total;
  const ultimaEtapa = etapa.numero === TOTAL_ETAPAS;

  /* ───────────── ações ───────────── */

  function liberarVerificacao() {
    atualizar({ etapasLiberadas: [...auditoria!.etapasLiberadas, etapa!.numero] });
    setTimeout(() => topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  function mudarItem(item: TItem) {
    atualizar({ itens: { ...auditoria!.itens, [item.requisitoId]: item } });
  }

  function irPara(numero: number) {
    if (numero < 1 || numero > TOTAL_ETAPAS) return;
    atualizar({ etapaAtual: numero });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function concluirEtapa() {
    if (!etapaCompleta) return avisar('Responda todos os requisitos antes de avançar.');
    const concluidas = auditoria!.etapasConcluidas.includes(etapa!.numero)
      ? auditoria!.etapasConcluidas
      : [...auditoria!.etapasConcluidas, etapa!.numero];
    atualizar({ etapasConcluidas: concluidas, etapaAtual: Math.min(TOTAL_ETAPAS, etapa!.numero + 1) });
    avisar(`Etapa ${etapa!.numero} concluída.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function abrirNC(requisitoId: string) {
    const existente = auditoria!.naoConformidades.find((n) => n.requisitoId === requisitoId);
    if (existente) return setNcEmEdicao(existente);

    const req = etapa!.requisitos.find((r) => r.id === requisitoId)!;
    const item = auditoria!.itens[requisitoId];
    setNcEmEdicao({
      id: idNovo(),
      requisitoId,
      etapa: etapa!.numero,
      clausula: req.clausula,
      classificacao: 'menor',
      descricao: item?.comentario ?? '',
      evidenciaObjetiva: item?.evidencia ?? '',
      requisitoDescumprido: `${req.clausula} — ${req.titulo} (${nomeNorma(auditoria!.norma)})`,
      criadaEm: new Date().toISOString()
    });
  }

  function salvarNC(nc: NaoConformidade) {
    const outras = auditoria!.naoConformidades.filter((n) => n.id !== nc.id);
    atualizar({ naoConformidades: [...outras, nc] });
    setNcEmEdicao(null);
    avisar('Não conformidade registrada.');
  }

  function excluirNC(ncId: string) {
    atualizar({ naoConformidades: auditoria!.naoConformidades.filter((n) => n.id !== ncId) });
    setNcEmEdicao(null);
  }

  function concluirAuditoria() {
    atualizar({
      status: 'concluida',
      concluidaEm: new Date().toISOString(),
      etapasConcluidas: ETAPAS.map((e) => e.numero)
    });
    avisar('Auditoria concluída. Gerando relatório…');
    setTimeout(() => router.push(`/auditorias/${auditoria!.id}/relatorio`), 500);
  }

  /* ───────────── interface ───────────── */

  return (
    <>
      <Navegacao />

      {/* Barra de progresso das etapas */}
      <div className="vidro sticky top-[54px] z-40 border-b nao-imprimir">
        <div className="mx-auto max-w-conteudo px-5 py-3 sm:px-7">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[14px] font-semibold tracking-[-.01em]">
                Passo {etapa.numero} de {TOTAL_ETAPAS}
              </span>
              <span className="text-[13px] text-texto3">{etapa.titulo}</span>
            </div>
            <span className="text-[13px] font-semibold tabular-nums text-acento">{progGeral.percentual}%</span>
          </div>

          <div className="flex gap-1">
            {ETAPAS.map((e) => {
              const concluida = auditoria.etapasConcluidas.includes(e.numero);
              const atual = e.numero === etapa.numero;
              const acessivel = concluida || e.numero <= Math.max(...auditoria.etapasConcluidas, 0) + 1;
              return (
                <button
                  key={e.numero}
                  onClick={() => acessivel && irPara(e.numero)}
                  disabled={!acessivel}
                  title={`Etapa ${e.numero} — ${e.titulo}`}
                  aria-label={`Etapa ${e.numero}: ${e.titulo}`}
                  className={`h-1.5 flex-1 rounded-pill transition-all duration-500 ease-apple
                    ${concluida ? 'bg-verde' : atual ? 'bg-acento' : 'bg-texto/[.12]'}
                    ${acessivel ? 'cursor-pointer hover:opacity-75' : 'cursor-not-allowed'}`}
                />
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between text-[11.5px] text-texto3">
            <span>{auditoria.codigo} · {setor?.nome} · {auditoria.empresa}</span>
            <span className="tabular-nums">
              {emExplicacao ? 'Explicação' : `${progEtapa.respondidos}/${progEtapa.total} requisitos nesta etapa`}
            </span>
          </div>
        </div>
      </div>

      <main ref={topo} className="mx-auto max-w-conteudo px-5 py-8 sm:px-7">
        <AnimatePresence mode="wait">
          {emExplicacao ? (
            <motion.div
              key={`explicacao-${etapa.numero}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            >
              <ExplicacaoEtapa etapa={etapa} setor={setor} aoIniciar={liberarVerificacao} />
            </motion.div>
          ) : (
            <motion.div
              key={`verificacao-${etapa.numero}`}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="pb-28"
            >
              <header className="mb-6">
                <div className="mb-2.5 flex flex-wrap items-center gap-2">
                  <Etiqueta tom="acento">Etapa {etapa.numero}</Etiqueta>
                  <Etiqueta tom={etapaCompleta ? 'verde' : 'neutro'}>
                    {progEtapa.respondidos} de {progEtapa.total} verificados
                  </Etiqueta>
                </div>
                <h1 className="text-[28px] font-semibold tracking-[-.03em] sm:text-[34px]">{etapa.titulo}</h1>
                <p className="mt-1.5 text-[15px] text-texto3">Checklist inteligente — marque cada requisito e registre a evidência.</p>
                <button
                  onClick={() => atualizar({ etapasLiberadas: auditoria.etapasLiberadas.filter((n) => n !== etapa.numero) })}
                  className="mt-3 text-[13px] text-acento hover:underline"
                >
                  Rever a explicação desta etapa
                </button>
              </header>

              <div className="space-y-4">
                {etapa.requisitos.map((r, i) => (
                  <ItemChecklist
                    key={r.id}
                    requisito={r}
                    indice={i}
                    item={auditoria.itens[r.id] ?? itemVazio(r.id)}
                    contexto={contexto}
                    aoMudar={mudarItem}
                    aoAbrirNC={() => abrirNC(r.id)}
                    temNC={auditoria.naoConformidades.some((n) => n.requisitoId === r.id)}
                  />
                ))}
              </div>

              {ultimaEtapa && etapaCompleta && (
                <Conclusao auditoria={auditoria} aoAtualizar={atualizar} aoConcluir={concluirAuditoria} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Navegação inferior da verificação */}
      {!emExplicacao && (
        <div className="fixed inset-x-0 bottom-0 z-40 nao-imprimir">
          <div className="vidro mx-auto mb-5 flex w-[min(680px,calc(100vw-2rem))] items-center gap-3 rounded-pill border px-4 py-3 shadow-nivel2">
            <Botao variante="suave" tamanho="p" onClick={() => irPara(etapa.numero - 1)} disabled={etapa.numero === 1}>
              <IconeVoltar tamanho={15} />Anterior
            </Botao>

            <div className="min-w-0 flex-1 text-center">
              <p className="truncate text-[12.5px] font-medium">
                {etapaCompleta ? 'Etapa completa' : `Faltam ${progEtapa.total - progEtapa.respondidos} requisitos`}
              </p>
              <p className="truncate text-[11px] text-texto3">
                {auditoria.naoConformidades.filter((n) => n.etapa === etapa.numero).length} NC nesta etapa
              </p>
            </div>

            {ultimaEtapa ? (
              <Botao variante="primario" tamanho="p" onClick={concluirAuditoria} disabled={!etapaCompleta}>
                <IconeCheck tamanho={15} />Concluir
              </Botao>
            ) : (
              <Botao variante="primario" tamanho="p" onClick={concluirEtapa} disabled={!etapaCompleta}>
                Próxima etapa <IconeSeta tamanho={15} />
              </Botao>
            )}
          </div>
        </div>
      )}

      {ncEmEdicao && (
        <ModalNC
          nc={ncEmEdicao}
          contexto={contexto}
          aoSalvar={salvarNC}
          aoFechar={() => setNcEmEdicao(null)}
          aoExcluir={
            auditoria.naoConformidades.some((n) => n.id === ncEmEdicao.id)
              ? () => excluirNC(ncEmEdicao.id)
              : undefined
          }
        />
      )}

      <PainelAssistente contexto={contexto} />
    </>
  );
}
