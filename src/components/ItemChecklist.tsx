'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ItemChecklist as TItem, Resposta } from '@/lib/tipos';
import type { Requisito } from '@/dados/etapas';
import { perguntarIA } from '@/lib/assistente';
import Anexos from './Anexos';
import { Botao, Etiqueta } from './ui';
import { IconeAlerta, IconeCheck, IconeFaisca, IconeMenos, IconeOlho, IconeX } from './Icones';

const OPCOES: { valor: Resposta; texto: string; Icone: React.ComponentType<{ tamanho?: number }>; classe: string; ativo: string }[] = [
  { valor: 'conforme', texto: 'Conforme', Icone: IconeCheck, classe: 'text-verde', ativo: 'bg-verde text-white border-verde' },
  { valor: 'nao_conforme', texto: 'Não conforme', Icone: IconeX, classe: 'text-vermelho', ativo: 'bg-vermelho text-white border-vermelho' },
  { valor: 'observacao', texto: 'Observação', Icone: IconeOlho, classe: 'text-ambar', ativo: 'bg-ambar text-white border-ambar' },
  { valor: 'nao_aplicavel', texto: 'Não aplicável', Icone: IconeMenos, classe: 'text-texto3', ativo: 'bg-texto3 text-white border-texto3' }
];

type Props = {
  requisito: Requisito;
  item: TItem;
  indice: number;
  contexto: Record<string, unknown>;
  aoMudar: (item: TItem) => void;
  aoAbrirNC: () => void;
  temNC: boolean;
};

export default function ItemChecklist({ requisito, item, indice, contexto, aoMudar, aoAbrirNC, temNC }: Props) {
  const [explicacao, setExplicacao] = useState('');
  const [carregandoExplicacao, setCarregandoExplicacao] = useState(false);

  const responder = (resposta: Resposta) => {
    aoMudar({ ...item, resposta, respondidoEm: new Date().toISOString() });
    if (resposta === 'nao_conforme' && !temNC) setTimeout(aoAbrirNC, 220);
  };

  async function explicar() {
    if (explicacao) return setExplicacao('');
    setCarregandoExplicacao(true);
    const r = await perguntarIA({ tipo: 'explicar_requisito', contexto: { ...contexto, requisitoId: requisito.id } });
    setExplicacao(r.texto);
    setCarregandoExplicacao(false);
  }

  const respondido = Boolean(item.resposta);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(indice * 0.05, 0.3), ease: [0.32, 0.72, 0, 1] }}
      className={`cartao overflow-hidden p-0 transition-colors duration-300 ${respondido ? 'border-verde/25' : ''}`}
    >
      <div className="p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Etiqueta tom="acento" className="font-mono tabular-nums">{requisito.clausula}</Etiqueta>
          {respondido && (
            <Etiqueta tom={item.resposta === 'conforme' ? 'verde' : item.resposta === 'nao_conforme' ? 'vermelho' : item.resposta === 'observacao' ? 'ambar' : 'neutro'}>
              {OPCOES.find((o) => o.valor === item.resposta)?.texto}
            </Etiqueta>
          )}
          {temNC && <Etiqueta tom="vermelho"><IconeAlerta tamanho={11} />NC registrada</Etiqueta>}
        </div>

        <h3 className="text-[17px] font-semibold tracking-[-.015em]">{requisito.titulo}</h3>

        <p className="mt-2.5 border-l-2 border-acento/30 pl-3 text-[13.5px] italic leading-relaxed text-texto3">
          {requisito.resumoNorma}
        </p>

        <p className="mt-3 text-[14.5px] leading-relaxed text-texto2">
          <strong className="font-semibold text-texto">Em palavras simples: </strong>{requisito.explicacaoSimples}
        </p>

        <div className="mt-4 rounded-xl bg-afundado/70 p-4">
          <p className="mb-2 text-[11.5px] font-semibold uppercase tracking-wide text-texto3">Como verificar</p>
          <ul className="space-y-1.5">
            {requisito.comoVerificar.map((v) => (
              <li key={v} className="flex gap-2 text-[13.5px] leading-snug text-texto2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-acento/60" />{v}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12.5px] text-texto3">
            <strong className="font-medium text-texto2">Evidência típica:</strong> {requisito.evidenciaTipica}
          </p>
        </div>

        <div className="mt-3">
          <Botao type="button" variante="texto" tamanho="pp" onClick={explicar}>
            <IconeFaisca tamanho={13} />
            {carregandoExplicacao ? 'Consultando…' : explicacao ? 'Ocultar explicação' : 'Explicar este requisito'}
          </Botao>
        </div>

        <AnimatePresence>
          {explicacao && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="overflow-hidden"
            >
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-roxo/[.08] p-4 text-[13.5px] leading-relaxed text-texto2">
                {explicacao}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resposta */}
      <div className="border-t bg-afundado/40 p-5 sm:p-6">
        <p className="rotulo">Resultado da verificação</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OPCOES.map((o) => {
            const ativo = item.resposta === o.valor;
            return (
              <button
                key={o.valor}
                type="button"
                onClick={() => responder(o.valor)}
                aria-pressed={ativo}
                className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[13px] font-medium
                            transition-all duration-200 ease-apple active:scale-[.97]
                            ${ativo ? o.ativo : `bg-superficie ${o.classe} hover:bg-texto/[.05]`}`}
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
                  <span className="rotulo">Comentário</span>
                  <textarea
                    value={item.comentario}
                    onChange={(e) => aoMudar({ ...item, comentario: e.target.value })}
                    placeholder="O que foi verificado, com quem e o que foi observado"
                    className="campo min-h-[76px] resize-y text-[14px] leading-relaxed"
                  />
                </label>

                <label className="block">
                  <span className="rotulo">Evidência objetiva</span>
                  <textarea
                    value={item.evidencia}
                    onChange={(e) => aoMudar({ ...item, evidencia: e.target.value })}
                    placeholder="Documento, código, revisão, lote, número de série, data — algo que possa ser reencontrado depois"
                    className="campo min-h-[64px] resize-y text-[14px] leading-relaxed"
                  />
                </label>

                <Anexos
                  anexos={item.anexos}
                  aoMudar={(anexos) => aoMudar({ ...item, anexos })}
                  contexto={{ ...contexto, clausula: requisito.clausula, titulo: requisito.titulo }}
                />

                {item.resposta === 'nao_conforme' && (
                  <Botao type="button" variante={temNC ? 'suave' : 'perigo'} tamanho="p" onClick={aoAbrirNC}>
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
