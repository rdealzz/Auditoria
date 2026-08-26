'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { NaoConformidade, PlanoAcao } from '@/lib/tipos';
import { perguntarIA } from '@/lib/assistente';
import { AreaTexto, Botao, Campo, Etiqueta } from './ui';
import { IconeFaisca, IconeX } from './Icones';

const CLASSES: { valor: NaoConformidade['classificacao']; texto: string; ajuda: string; ativo: string }[] = [
  { valor: 'maior', texto: 'Maior', ajuda: 'Falha total do requisito ou desvio que compromete a entrega ao cliente', ativo: 'bg-vermelho text-white border-vermelho' },
  { valor: 'menor', texto: 'Menor', ajuda: 'Desvio pontual e isolado, sem comprometer a eficácia do processo', ativo: 'bg-ambar text-white border-ambar' },
  { valor: 'observacao', texto: 'Observação', ajuda: 'Ainda atende, mas apresenta tendência de desvio ou fragilidade', ativo: 'bg-acento text-white border-acento' }
];

const PLANO_VAZIO: PlanoAcao = {
  oQue: '', porQue: '', onde: '', quando: '', quem: '', como: '', quanto: '', status: 'aberta'
};

type Props = {
  nc: NaoConformidade;
  contexto: Record<string, unknown>;
  aoSalvar: (nc: NaoConformidade) => void;
  aoFechar: () => void;
  aoExcluir?: () => void;
};

export default function ModalNC({ nc, contexto, aoSalvar, aoFechar, aoExcluir }: Props) {
  const [dados, setDados] = useState<NaoConformidade>({ ...nc, plano: nc.plano ?? { ...PLANO_VAZIO } });
  const [ocupado, setOcupado] = useState<'texto' | 'plano' | null>(null);

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
      contexto: { ...contexto, clausula: dados.clausula, evidencia: dados.evidenciaObjetiva }
    });
    definir('descricao', r.texto);
    setOcupado(null);
  }

  async function gerarPlano() {
    setOcupado('plano');
    const r = await perguntarIA({
      tipo: 'plano_acao',
      texto: dados.descricao,
      contexto: { ...contexto, clausula: dados.clausula }
    });
    try {
      const p = JSON.parse(r.texto) as PlanoAcao;
      setDados((d) => ({ ...d, plano: { ...PLANO_VAZIO, ...p } }));
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
        className="fixed inset-0 z-[120] grid place-items-end bg-black/45 backdrop-blur-sm sm:place-items-center sm:p-6 nao-imprimir"
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="flex max-h-[92vh] w-full max-w-[680px] flex-col overflow-hidden rounded-t-xl3 border bg-superficie shadow-nivel3 sm:rounded-xl3"
        >
          <header className="flex items-center gap-3 border-b px-6 py-4">
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] font-semibold tracking-[-.02em]">Registro de não conformidade</h2>
              <p className="mt-0.5 truncate text-[12.5px] text-texto3">
                Etapa {dados.etapa} · Cláusula {dados.clausula}
              </p>
            </div>
            <button onClick={aoFechar} aria-label="Fechar"
              className="grid h-8 w-8 place-items-center rounded-full text-texto3 hover:bg-texto/[.07] hover:text-texto">
              <IconeX tamanho={17} />
            </button>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div>
              <span className="rotulo">Classificação</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {CLASSES.map((c) => {
                  const ativo = dados.classificacao === c.valor;
                  return (
                    <button
                      key={c.valor} type="button" onClick={() => definir('classificacao', c.valor)}
                      className={`rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ease-apple active:scale-[.98]
                                  ${ativo ? c.ativo : 'bg-superficie hover:bg-texto/[.05]'}`}
                    >
                      <span className="block text-[13.5px] font-semibold">{c.texto}</span>
                      <span className={`mt-0.5 block text-[11px] leading-snug ${ativo ? 'text-white/80' : 'text-texto3'}`}>{c.ajuda}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="rotulo mb-0">Descrição da constatação</span>
                <Botao type="button" variante="texto" tamanho="pp" onClick={melhorarTexto} disabled={ocupado === 'texto' || !dados.descricao.trim()}>
                  <IconeFaisca tamanho={12} />{ocupado === 'texto' ? 'Melhorando…' : 'Melhorar redação'}
                </Botao>
              </div>
              <textarea
                value={dados.descricao}
                onChange={(e) => definir('descricao', e.target.value)}
                placeholder="Escreva o que foi constatado. Pode ser um rascunho — o assistente ajuda a estruturar."
                className="campo min-h-[130px] resize-y text-[14px] leading-relaxed"
              />
              <p className="mt-1.5 text-[11.5px] text-texto3">
                Descreva o fato, nunca a pessoa. Estrutura recomendada: constatação, evidência objetiva e requisito descumprido.
              </p>
            </div>

            <AreaTexto
              rotulo="Evidência objetiva"
              value={dados.evidenciaObjetiva}
              onChange={(e) => definir('evidenciaObjetiva', e.target.value)}
              placeholder="Ex.: IT-PRD-012 rev. 03 no posto 4, sendo a rev. 05 a vigente conforme lista mestra LM-01, em 26/08/2026"
              dica="Precisa ser reencontrável seis meses depois: código, revisão, lote, número de série, local e data."
            />

            <Campo
              rotulo="Requisito descumprido"
              value={dados.requisitoDescumprido}
              onChange={(e) => definir('requisitoDescumprido', e.target.value)}
              placeholder="Cláusula e título do requisito"
            />

            <AreaTexto
              rotulo="Causa raiz (preenchida pelo auditado)"
              value={dados.causaRaiz ?? ''}
              onChange={(e) => definir('causaRaiz', e.target.value)}
              placeholder="Deixe em branco se a análise ainda será feita pelo setor"
              dica="Se a causa for 'falta de atenção do operador', a análise ainda não terminou."
            />

            <div className="rounded-xl2 border p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold">Plano de ação</h3>
                  <Etiqueta tom="neutro">5W2H</Etiqueta>
                </div>
                <Botao type="button" variante="suave" tamanho="pp" onClick={gerarPlano} disabled={ocupado === 'plano'}>
                  <IconeFaisca tamanho={12} />{ocupado === 'plano' ? 'Gerando…' : 'Gerar automaticamente'}
                </Botao>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AreaTexto rotulo="O quê" value={dados.plano?.oQue ?? ''} onChange={(e) => definirPlano('oQue', e.target.value)} className="min-h-[70px]" />
                <AreaTexto rotulo="Por quê" value={dados.plano?.porQue ?? ''} onChange={(e) => definirPlano('porQue', e.target.value)} className="min-h-[70px]" />
                <Campo rotulo="Onde" value={dados.plano?.onde ?? ''} onChange={(e) => definirPlano('onde', e.target.value)} />
                <Campo rotulo="Quando (prazo)" type="date" value={dados.plano?.quando ?? ''} onChange={(e) => definirPlano('quando', e.target.value)} />
                <Campo rotulo="Quem (responsável)" value={dados.plano?.quem ?? ''} onChange={(e) => definirPlano('quem', e.target.value)} />
                <Campo rotulo="Quanto (custo estimado)" value={dados.plano?.quanto ?? ''} onChange={(e) => definirPlano('quanto', e.target.value)} />
                <div className="sm:col-span-2">
                  <AreaTexto rotulo="Como" value={dados.plano?.como ?? ''} onChange={(e) => definirPlano('como', e.target.value)} className="min-h-[80px]" />
                </div>
                <div className="sm:col-span-2">
                  <span className="rotulo">Status</span>
                  <div className="flex flex-wrap gap-2">
                    {(['aberta', 'em_andamento', 'concluida', 'atrasada'] as const).map((s) => (
                      <button
                        key={s} type="button" onClick={() => definirPlano('status', s)}
                        className={`rounded-pill border px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-200
                          ${dados.plano?.status === s ? 'border-acento bg-acento text-white' : 'hover:bg-texto/[.05]'}`}
                      >
                        {({ aberta: 'Aberta', em_andamento: 'Em andamento', concluida: 'Concluída', atrasada: 'Atrasada' })[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="flex items-center gap-3 border-t px-6 py-4">
            {aoExcluir && (
              <Botao type="button" variante="perigo" tamanho="p" onClick={aoExcluir}>Excluir</Botao>
            )}
            <div className="flex-1" />
            <Botao type="button" variante="contorno" onClick={aoFechar}>Cancelar</Botao>
            <Botao type="button" variante="primario" onClick={() => aoSalvar(dados)} disabled={!dados.descricao.trim()}>
              Salvar não conformidade
            </Botao>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
