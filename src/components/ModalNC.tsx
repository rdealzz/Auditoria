'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { NaoConformidade, PlanoAcao } from '@/lib/tipos';
import { clausulas } from '@/dados/sgi';
import { perguntarIA } from '@/lib/assistente';
import SeloNorma from './SeloNorma';
import { AreaTexto, Botao, Campo } from './ui';
import { IconeFaisca, IconeX } from './Icones';

const CLASSES: { valor: NaoConformidade['classificacao']; texto: string; ajuda: string; ativo: string }[] = [
  { valor: 'maior', texto: 'Maior', ajuda: 'Falha total do requisito ou desvio que compromete a entrega', ativo: 'bg-vermelho text-white border-vermelho' },
  { valor: 'menor', texto: 'Menor', ajuda: 'Desvio pontual e isolado, sem comprometer a eficácia', ativo: 'bg-ambar text-white border-ambar' },
  { valor: 'observacao', texto: 'Observação', ajuda: 'Ainda atende, mas com tendência de desvio', ativo: 'bg-acento text-white border-acento' }
];

const PLANO_VAZIO: PlanoAcao = { oQue: '', porQue: '', onde: '', quando: '', quem: '', como: '', quanto: '', status: 'aberta' };

export default function ModalNC({
  nc, contexto, aoSalvar, aoFechar, aoExcluir
}: {
  nc: NaoConformidade;
  contexto: Record<string, unknown>;
  aoSalvar: (nc: NaoConformidade) => void;
  aoFechar: () => void;
  aoExcluir?: () => void;
}) {
  const [dados, setDados] = useState<NaoConformidade>({ ...nc, plano: nc.plano ?? { ...PLANO_VAZIO } });
  const [ocupado, setOcupado] = useState<'texto' | 'plano' | null>(null);
  const [verPlano, setVerPlano] = useState(Boolean(nc.plano?.oQue));

  const definir = <K extends keyof NaoConformidade>(campo: K, valor: NaoConformidade[K]) =>
    setDados((d) => ({ ...d, [campo]: valor }));

  const definirPlano = (campo: keyof PlanoAcao, valor: string) =>
    setDados((d) => ({ ...d, plano: { ...(d.plano ?? PLANO_VAZIO), [campo]: valor } as PlanoAcao }));

  async function melhorarTexto() {
    if (!dados.descricao.trim()) return;
    setOcupado('texto');
    const r = await perguntarIA({
      tipo: 'melhorar_nc',
      texto: dados.descricao,
      contexto: { ...contexto, clausula: dados.requisitoDescumprido, evidencia: dados.evidenciaObjetiva }
    });
    definir('descricao', r.texto);
    setOcupado(null);
  }

  async function gerarPlano() {
    setOcupado('plano');
    setVerPlano(true);
    const r = await perguntarIA({ tipo: 'plano_acao', texto: dados.descricao, contexto });
    try {
      setDados((d) => ({ ...d, plano: { ...PLANO_VAZIO, ...(JSON.parse(r.texto) as PlanoAcao) } }));
    } catch {
      definirPlano('como', r.texto);
    }
    setOcupado(null);
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={aoFechar}
        className="fixed inset-0 z-[120] grid place-items-end bg-black/40 backdrop-blur-sm sm:place-items-center sm:p-6 nao-imprimir"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[92vh] w-full max-w-[660px] flex-col overflow-hidden rounded-t-xl3 border bg-superficie shadow-nivel3 sm:rounded-xl3"
        >
          <header className="flex items-start gap-3 border-b px-7 py-5">
            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] font-semibold tracking-[-.02em]">Não conformidade</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {clausulas(dados.chavesClausulas).map((c) => <SeloNorma key={c.chave} clausula={c} />)}
              </div>
            </div>
            <button onClick={aoFechar} aria-label="Fechar"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-texto3 hover:bg-texto/[.07] hover:text-texto">
              <IconeX tamanho={17} />
            </button>
          </header>

          <div className="flex-1 space-y-6 overflow-y-auto px-7 py-6">
            <div>
              <span className="rotulo">Classificação</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {CLASSES.map((c) => {
                  const ativo = dados.classificacao === c.valor;
                  return (
                    <button
                      key={c.valor} onClick={() => definir('classificacao', c.valor)}
                      className={`rounded-xl border px-3.5 py-3 text-left transition-all duration-200 ease-apple active:scale-[.98]
                                  ${ativo ? c.ativo : 'bg-superficie hover:bg-texto/[.05]'}`}
                    >
                      <span className="block text-[14px] font-semibold">{c.texto}</span>
                      <span className={`mt-1 block text-[11px] leading-snug ${ativo ? 'text-white/80' : 'text-texto3'}`}>{c.ajuda}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="rotulo mb-0">Constatação</span>
                <Botao variante="texto" tamanho="pp" onClick={melhorarTexto} disabled={ocupado === 'texto' || !dados.descricao.trim()}>
                  <IconeFaisca tamanho={12} />{ocupado === 'texto' ? 'Melhorando…' : 'Melhorar redação'}
                </Botao>
              </div>
              <textarea
                value={dados.descricao}
                onChange={(e) => definir('descricao', e.target.value)}
                placeholder="Escreva o que foi constatado. Pode ser rascunho — o assistente estrutura."
                className="campo min-h-[120px] resize-y text-[14px] leading-relaxed"
              />
            </div>

            <AreaTexto
              rotulo="Evidência objetiva"
              value={dados.evidenciaObjetiva}
              onChange={(e) => definir('evidenciaObjetiva', e.target.value)}
              placeholder="Ex.: EPS-014 rev. 02 no posto 3, com RQPS vencido, em 26/08/2026"
              dica="Precisa ser reencontrável seis meses depois."
            />

            <AreaTexto
              rotulo="Causa raiz (preenchida pelo auditado)"
              value={dados.causaRaiz ?? ''}
              onChange={(e) => definir('causaRaiz', e.target.value)}
              placeholder="Deixe em branco se a análise ainda será feita pelo setor"
            />

            {!verPlano ? (
              <div className="flex flex-wrap items-center gap-3 rounded-xl2 border border-dashed px-5 py-4">
                <p className="flex-1 text-[13.5px] text-texto3">Plano de ação 5W2H</p>
                <Botao variante="suave" tamanho="p" onClick={() => setVerPlano(true)}>Preencher</Botao>
                <Botao variante="suave" tamanho="p" onClick={gerarPlano} disabled={ocupado === 'plano'}>
                  <IconeFaisca tamanho={12} />{ocupado === 'plano' ? 'Gerando…' : 'Gerar'}
                </Botao>
              </div>
            ) : (
              <div className="rounded-xl2 border p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-[15px] font-semibold">Plano de ação · 5W2H</h3>
                  <Botao variante="suave" tamanho="pp" onClick={gerarPlano} disabled={ocupado === 'plano'}>
                    <IconeFaisca tamanho={12} />{ocupado === 'plano' ? 'Gerando…' : 'Gerar'}
                  </Botao>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AreaTexto rotulo="O quê" value={dados.plano?.oQue ?? ''} onChange={(e) => definirPlano('oQue', e.target.value)} className="min-h-[66px]" />
                  <AreaTexto rotulo="Por quê" value={dados.plano?.porQue ?? ''} onChange={(e) => definirPlano('porQue', e.target.value)} className="min-h-[66px]" />
                  <Campo rotulo="Onde" value={dados.plano?.onde ?? ''} onChange={(e) => definirPlano('onde', e.target.value)} />
                  <Campo rotulo="Quando" type="date" value={dados.plano?.quando ?? ''} onChange={(e) => definirPlano('quando', e.target.value)} />
                  <Campo rotulo="Quem" value={dados.plano?.quem ?? ''} onChange={(e) => definirPlano('quem', e.target.value)} />
                  <Campo rotulo="Quanto" value={dados.plano?.quanto ?? ''} onChange={(e) => definirPlano('quanto', e.target.value)} />
                  <div className="sm:col-span-2">
                    <AreaTexto rotulo="Como" value={dados.plano?.como ?? ''} onChange={(e) => definirPlano('como', e.target.value)} className="min-h-[76px]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="flex items-center gap-3 border-t px-7 py-4">
            {aoExcluir && <Botao variante="perigo" tamanho="p" onClick={aoExcluir}>Excluir</Botao>}
            <div className="flex-1" />
            <Botao variante="contorno" onClick={aoFechar}>Cancelar</Botao>
            <Botao variante="primario" onClick={() => aoSalvar(dados)} disabled={!dados.descricao.trim()}>Salvar</Botao>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
