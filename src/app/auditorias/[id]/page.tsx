'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import AberturaBloco from '@/components/AberturaBloco';
import CartaoVerificacao from '@/components/CartaoVerificacao';
import ModalNC from '@/components/ModalNC';
import PainelAssistente from '@/components/PainelAssistente';
import Conclusao from '@/components/Conclusao';
import { Botao } from '@/components/ui';
import { IconeCheck, IconeSeta, IconeVoltar } from '@/components/Icones';
import { roteiroDoSetor } from '@/dados/montagem-roteiro';
import { setorPorId } from '@/dados/setores';
import { clausulas, NORMAS } from '@/dados/sgi';
import type { Auditoria, NaoConformidade, Verificacao } from '@/lib/tipos';
import {
  idNovo, obterAuditoria, progressoBloco, progressoGeral, salvarAuditoria, verificacaoVazia
} from '@/lib/armazenamento';
import { useApp } from '@/app/provedores';

export default function PaginaAuditoria() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { usuario, avisar } = useApp();

  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);
  const [ausente, setAusente] = useState(false);
  const [ncEmEdicao, setNcEmEdicao] = useState<NaoConformidade | null>(null);
  const topo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = obterAuditoria(id);
    if (a) setAuditoria(a);
    else setAusente(true);
  }, [id]);

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

  const blocos = useMemo(() => (auditoria ? roteiroDoSetor(auditoria.setor) : []), [auditoria?.setor]);
  const setor = auditoria ? setorPorId(auditoria.setor) : undefined;
  const bloco = blocos[auditoria?.blocoAtual ?? 0];

  const contexto = useMemo(
    () => auditoria && {
      empresa: auditoria.empresa, setor: setor?.nome ?? auditoria.setor, setorId: auditoria.setor,
      auditor: auditoria.auditor, auditado: auditoria.auditado,
      normas: NORMAS.filter((n) => auditoria.normas.includes(n.id)).map((n) => n.nome).join(', ')
    },
    [auditoria, setor]
  );

  if (ausente) {
    return (
      <>
        <Navegacao />
        <main className="mx-auto max-w-conteudo px-6 py-24 text-center">
          <h1 className="text-[26px] font-semibold">Auditoria não encontrada</h1>
          <p className="mt-2 text-[15px] text-texto3">Ela pode ter sido excluída ou criada em outro navegador.</p>
          <Link href="/painel" className="mt-7 inline-block"><Botao variante="primario">Voltar ao painel</Botao></Link>
        </main>
      </>
    );
  }

  if (!usuario || !auditoria || !bloco || !contexto) return <Navegacao />;

  const emAbertura = !auditoria.blocosLiberados.includes(bloco.id);
  const prog = progressoBloco(auditoria, bloco.id);
  const geral = progressoGeral(auditoria);
  const completo = prog.respondidos === prog.total;
  const ultimo = auditoria.blocoAtual === blocos.length - 1;

  /* ───────── ações ───────── */

  function liberar() {
    atualizar({ blocosLiberados: [...auditoria!.blocosLiberados, bloco.id] });
    setTimeout(() => topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }

  function mudarVerificacao(v: Verificacao) {
    atualizar({ verificacoes: { ...auditoria!.verificacoes, [v.itemId]: v } });
  }

  function irPara(indice: number) {
    if (indice < 0 || indice >= blocos.length) return;
    atualizar({ blocoAtual: indice });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function concluirBloco() {
    if (!completo) return avisar('Responda todas as verificações antes de avançar.');
    const concluidos = auditoria!.blocosConcluidos.includes(bloco.id)
      ? auditoria!.blocosConcluidos
      : [...auditoria!.blocosConcluidos, bloco.id];
    atualizar({ blocosConcluidos: concluidos, blocoAtual: Math.min(blocos.length - 1, auditoria!.blocoAtual + 1) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function abrirNC(itemId: string) {
    const existente = auditoria!.naoConformidades.find((n) => n.itemId === itemId);
    if (existente) return setNcEmEdicao(existente);

    const item = bloco.itens.find((i) => i.id === itemId)!;
    const v = auditoria!.verificacoes[itemId];
    const refs = clausulas(item.chavesClausulas);
    setNcEmEdicao({
      id: idNovo(),
      itemId,
      blocoId: bloco.id,
      chavesClausulas: item.chavesClausulas,
      classificacao: 'menor',
      descricao: v?.comentario ?? '',
      evidenciaObjetiva: v?.evidencia ?? '',
      requisitoDescumprido: refs.map((c) => `${c.norma.replace('iso', 'ISO ')} ${c.codigo} — ${c.titulo}`).join('; '),
      criadaEm: new Date().toISOString()
    });
  }

  function salvarNC(nc: NaoConformidade) {
    atualizar({ naoConformidades: [...auditoria!.naoConformidades.filter((n) => n.id !== nc.id), nc] });
    setNcEmEdicao(null);
    avisar('Não conformidade registrada.');
  }

  function concluirAuditoria() {
    atualizar({
      status: 'concluida',
      concluidaEm: new Date().toISOString(),
      blocosConcluidos: blocos.map((b) => b.id)
    });
    avisar('Auditoria concluída.');
    setTimeout(() => router.push(`/auditorias/${auditoria!.id}/relatorio`), 450);
  }

  /* ───────── interface ───────── */

  return (
    <>
      <Navegacao />

      <div className="vidro sticky top-[54px] z-40 border-b nao-imprimir">
        <div className="mx-auto max-w-[880px] px-6 py-3 sm:px-8">
          <div className="mb-2.5 flex items-baseline justify-between gap-3">
            <p className="truncate text-[13px] text-texto3">
              <span className="font-medium text-texto2">{setor?.nome}</span>
              <span className="mx-1.5 opacity-40">·</span>{auditoria.empresa}
            </p>
            <p className="shrink-0 text-[13px] font-semibold tabular-nums text-acento">{geral.percentual}%</p>
          </div>
          <div className="flex gap-1">
            {blocos.map((b, i) => {
              const feito = auditoria.blocosConcluidos.includes(b.id);
              const atual = i === auditoria.blocoAtual;
              const acessivel = feito || i <= auditoria.blocosConcluidos.length;
              return (
                <button
                  key={b.id}
                  onClick={() => acessivel && irPara(i)}
                  disabled={!acessivel}
                  title={b.titulo}
                  aria-label={`Bloco ${i + 1}: ${b.titulo}`}
                  className={`h-1 flex-1 rounded-pill transition-all duration-500 ease-apple
                    ${feito ? 'bg-verde' : atual ? 'bg-acento' : 'bg-texto/[.12]'}
                    ${acessivel ? 'cursor-pointer hover:opacity-70' : 'cursor-not-allowed'}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <main ref={topo} className="mx-auto max-w-[880px] px-6 sm:px-8">
        <AnimatePresence mode="wait">
          {emAbertura ? (
            <motion.div
              key={`abertura-${bloco.id}`}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AberturaBloco
                bloco={bloco}
                numero={auditoria.blocoAtual + 1}
                total={blocos.length}
                aoIniciar={liberar}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`verificacao-${bloco.id}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="py-10 pb-32"
            >
              <header className="mb-8">
                <p className="text-[12.5px] font-medium tabular-nums tracking-wide text-texto3">
                  Bloco {auditoria.blocoAtual + 1} de {blocos.length}
                  <span className="mx-2 opacity-40">·</span>
                  {prog.respondidos} de {prog.total} verificadas
                </p>
                <h1 className="mt-2 text-[30px] font-semibold tracking-[-.03em] sm:text-[36px]">{bloco.titulo}</h1>
                <button
                  onClick={() => atualizar({ blocosLiberados: auditoria.blocosLiberados.filter((b) => b !== bloco.id) })}
                  className="mt-3 text-[13px] text-acento transition-opacity hover:opacity-70"
                >
                  Rever a abertura do bloco
                </button>
              </header>

              <div className="space-y-4">
                {bloco.itens.map((item, i) => (
                  <CartaoVerificacao
                    key={item.id}
                    item={item}
                    indice={i}
                    verificacao={auditoria.verificacoes[item.id] ?? verificacaoVazia(item.id, bloco.id)}
                    contexto={contexto}
                    aoMudar={mudarVerificacao}
                    aoAbrirNC={() => abrirNC(item.id)}
                    temNC={auditoria.naoConformidades.some((n) => n.itemId === item.id)}
                  />
                ))}
              </div>

              {ultimo && completo && (
                <Conclusao auditoria={auditoria} aoAtualizar={atualizar} aoConcluir={concluirAuditoria} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!emAbertura && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-5 nao-imprimir">
          <div className="vidro mx-auto flex w-full max-w-[560px] items-center gap-3 rounded-pill border px-4 py-2.5 shadow-nivel2">
            <Botao variante="suave" tamanho="p" onClick={() => irPara(auditoria.blocoAtual - 1)} disabled={auditoria.blocoAtual === 0}>
              <IconeVoltar tamanho={15} />
            </Botao>
            <p className="min-w-0 flex-1 truncate text-center text-[12.5px] text-texto3">
              {completo ? 'Bloco completo' : `Faltam ${prog.total - prog.respondidos}`}
            </p>
            {ultimo ? (
              <Botao variante="primario" tamanho="p" onClick={concluirAuditoria} disabled={!completo}>
                <IconeCheck tamanho={15} />Concluir
              </Botao>
            ) : (
              <Botao variante="primario" tamanho="p" onClick={concluirBloco} disabled={!completo}>
                Próximo <IconeSeta tamanho={15} />
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
              ? () => {
                  atualizar({ naoConformidades: auditoria.naoConformidades.filter((n) => n.id !== ncEmEdicao.id) });
                  setNcEmEdicao(null);
                }
              : undefined
          }
        />
      )}

      <PainelAssistente contexto={contexto} />
    </>
  );
}
