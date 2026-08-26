'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Resposta, Verificacao } from '@/lib/tipos';
import type { ItemVerificacao } from '@/dados/roteiro';
import { clausulas } from '@/dados/sgi';
import { perguntarIA } from '@/lib/assistente';
import Anexos from './Anexos';
import SeloNorma from './SeloNorma';
import { Botao } from './ui';
import { IconeAlerta, IconeCheck, IconeFaisca, IconeMenos, IconeOlho, IconeX } from './Icones';

const OPCOES: { valor: Resposta; texto: string; Icone: React.ComponentType<{ tamanho?: number }>; cor: string; ativo: string }[] = [
  { valor: 'conforme', texto: 'Conforme', Icone: IconeCheck, cor: 'text-verde', ativo: 'bg-verde text-white border-verde' },
  { valor: 'nao_conforme', texto: 'Não conforme', Icone: IconeX, cor: 'text-vermelho', ativo: 'bg-vermelho text-white border-vermelho' },
  { valor: 'observacao', texto: 'Observação', Icone: IconeOlho, cor: 'text-ambar', ativo: 'bg-ambar text-white border-ambar' },
  { valor: 'nao_aplicavel', texto: 'N/A', Icone: IconeMenos, cor: 'text-texto3', ativo: 'bg-texto3 text-white border-texto3' }
];

type Aba = 'verificar' | 'evidencias' | 'riscos';

const ABAS: { id: Aba; texto: string }[] = [
  { id: 'verificar', texto: 'Como verificar' },
  { id: 'evidencias', texto: 'O que exigir' },
  { id: 'riscos', texto: 'Onde costuma falhar' }
];

export default function CartaoVerificacao({
  item, verificacao, indice, contexto, aoMudar, aoAbrirNC, temNC
}: {
  item: ItemVerificacao;
  verificacao: Verificacao;
  indice: number;
  contexto: Record<string, unknown>;
  aoMudar: (v: Verificacao) => void;
  aoAbrirNC: () => void;
  temNC: boolean;
}) {
  const [aba, setAba] = useState<Aba>('verificar');
  const [explicacao, setExplicacao] = useState('');
  const [carregando, setCarregando] = useState(false);

  const respondido = Boolean(verificacao.resposta);
  const refs = clausulas(item.chavesClausulas);

  const responder = (resposta: Resposta) => {
    aoMudar({ ...verificacao, resposta, respondidoEm: new Date().toISOString() });
    if (resposta === 'nao_conforme' && !temNC) setTimeout(aoAbrirNC, 220);
  };

  async function explicar() {
    if (explicacao) return setExplicacao('');
    setCarregando(true);
    const r = await perguntarIA({ tipo: 'explicar_requisito', contexto: { ...contexto, itemId: item.id } });
    setExplicacao(r.texto);
    setCarregando(false);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(indice * 0.04, 0.24), ease: [0.32, 0.72, 0, 1] }}
      className={`overflow-hidden rounded-xl2 border bg-superficie transition-colors duration-300
                  ${respondido ? 'border-verde/30' : ''}`}
    >
      <div className="p-6 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center gap-1.5">
          {refs.map((c) => <SeloNorma key={c.chave} clausula={c} />)}
          {temNC && (
            <span className="etiqueta bg-vermelho/12 text-vermelho"><IconeAlerta tamanho={11} />NC registrada</span>
          )}
        </div>

        <h3 className="text-[19px] font-semibold leading-snug tracking-[-.02em]">{item.titulo}</h3>

        {/* Abas: mantém a tela limpa e o conteúdo técnico a um toque */}
        <div className="mt-5 flex gap-1 rounded-pill bg-texto/[.05] p-1">
          {ABAS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              className={`flex-1 rounded-pill px-3 py-1.5 text-[12.5px] font-medium transition-all duration-200 ease-apple
                ${aba === a.id ? 'bg-superficie text-texto shadow-nivel1' : 'text-texto3 hover:text-texto2'}`}
            >
              {a.texto}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[140px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={aba}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            >
              {aba === 'verificar' && (
                <ol className="space-y-2.5">
                  {item.verificar.map((v, i) => (
                    <li key={v} className="flex gap-3 text-[14.5px] leading-relaxed text-texto2">
                      <span className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-acento/12 text-[11px] font-semibold tabular-nums text-acento">
                        {i + 1}
                      </span>
                      {v}
                    </li>
                  ))}
                  {item.inspecionar && item.inspecionar.length > 0 && (
                    <li className="mt-4 rounded-xl bg-afundado/70 px-4 py-3">
                      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-texto3">Inspecionar fisicamente</p>
                      <p className="text-[13.5px] leading-relaxed text-texto2">{item.inspecionar.join(' · ')}</p>
                    </li>
                  )}
                </ol>
              )}

              {aba === 'evidencias' && (
                <div className="space-y-4">
                  <Lista titulo="Evidência objetiva" itens={item.evidencias} cor="bg-verde/60" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Lista titulo="Documentos" itens={item.documentos} cor="bg-acento/50" />
                    <Lista titulo="Registros" itens={item.registros} cor="bg-acento/50" />
                  </div>
                </div>
              )}

              {aba === 'riscos' && (
                <div className="space-y-4">
                  <Lista titulo="Riscos e não conformidades comuns" itens={item.riscos} cor="bg-vermelho/50" />
                  <p className="rounded-xl bg-acento/[.07] px-4 py-3 text-[13.5px] leading-relaxed text-texto2">
                    <strong className="font-semibold text-texto">Como validar: </strong>{item.validar}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <Botao variante="texto" tamanho="pp" onClick={explicar} className="mt-1">
          <IconeFaisca tamanho={13} />
          {carregando ? 'Consultando…' : explicacao ? 'Ocultar detalhamento' : 'Detalhar com o assistente'}
        </Botao>

        <AnimatePresence>
          {explicacao && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-3 whitespace-pre-wrap rounded-xl bg-roxo/[.07] p-4 text-[13.5px] leading-relaxed text-texto2">
                {explicacao}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t bg-afundado/40 p-6 sm:p-7">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OPCOES.map((o) => {
            const ativo = verificacao.resposta === o.valor;
            return (
              <button
                key={o.valor}
                onClick={() => responder(o.valor)}
                aria-pressed={ativo}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[13px] font-medium
                            transition-all duration-200 ease-apple active:scale-[.97]
                            ${ativo ? o.ativo : `bg-superficie ${o.cor} hover:bg-texto/[.05]`}`}
              >
                <o.Icone tamanho={15} />{o.texto}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {respondido && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-5">
                <label className="block">
                  <span className="rotulo">Evidência apresentada</span>
                  <textarea
                    value={verificacao.evidencia}
                    onChange={(e) => aoMudar({ ...verificacao, evidencia: e.target.value })}
                    placeholder="Documento, código, revisão, lote, número de série, data — algo reencontrável depois"
                    className="campo min-h-[68px] resize-y text-[14px] leading-relaxed"
                  />
                </label>

                <label className="block">
                  <span className="rotulo">Observação do auditor</span>
                  <textarea
                    value={verificacao.comentario}
                    onChange={(e) => aoMudar({ ...verificacao, comentario: e.target.value })}
                    placeholder="O que foi verificado, com quem e o que foi constatado"
                    className="campo min-h-[68px] resize-y text-[14px] leading-relaxed"
                  />
                </label>

                <Anexos
                  anexos={verificacao.anexos}
                  aoMudar={(anexos) => aoMudar({ ...verificacao, anexos })}
                  contexto={{ ...contexto, item: item.titulo }}
                />

                {verificacao.resposta === 'nao_conforme' && (
                  <Botao variante={temNC ? 'suave' : 'perigo'} tamanho="p" onClick={aoAbrirNC}>
                    <IconeAlerta tamanho={14} />{temNC ? 'Editar não conformidade' : 'Registrar não conformidade'}
                  </Botao>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

function Lista({ titulo, itens, cor }: { titulo: string; itens: string[]; cor: string }) {
  if (!itens.length) return null;
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-texto3">{titulo}</p>
      <ul className="space-y-1.5">
        {itens.map((i) => (
          <li key={i} className="flex gap-2.5 text-[13.5px] leading-snug text-texto2">
            <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${cor}`} />{i}
          </li>
        ))}
      </ul>
    </div>
  );
}
