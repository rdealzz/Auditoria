'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { perguntarIA } from '@/lib/assistente';
import { Botao, Etiqueta } from './ui';
import { IconeFaisca, IconeX } from './Icones';

const ATALHOS = [
  'Qual a diferença entre não conformidade maior e menor?',
  'Como fazer uma boa análise de causa raiz?',
  'O que é evidência objetiva?',
  'Quantas amostras devo verificar?',
  'Como conduzir a entrevista com o colaborador?'
];

export default function PainelAssistente({ contexto }: { contexto?: Record<string, unknown> }) {
  const [aberto, setAberto] = useState(false);
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [motor, setMotor] = useState<'openai' | 'local' | null>(null);
  const [pensando, setPensando] = useState(false);

  async function consultar(texto: string) {
    if (!texto.trim()) return;
    setPensando(true);
    setResposta('');
    const r = await perguntarIA({ tipo: 'duvida', texto, contexto });
    setResposta(r.texto);
    setMotor(r.motor);
    setPensando(false);
  }

  return (
    <>
      <motion.button
        onClick={() => setAberto((a) => !a)}
        whileTap={{ scale: 0.94 }}
        aria-label="Abrir assistente"
        className="fixed bottom-6 right-6 z-[90] grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-acento to-roxo text-white shadow-nivel2 nao-imprimir"
      >
        {aberto ? <IconeX tamanho={21} /> : <IconeFaisca tamanho={22} />}
      </motion.button>

      <AnimatePresence>
        {aberto && (
          <motion.aside
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="vidro fixed bottom-24 right-6 z-[90] flex max-h-[70vh] w-[min(420px,calc(100vw-3rem))] flex-col overflow-hidden rounded-xl3 border shadow-nivel3 nao-imprimir"
          >
            <header className="flex items-center gap-2 border-b px-5 py-3.5">
              <IconeFaisca tamanho={17} className="text-roxo" />
              <h3 className="flex-1 text-[15px] font-semibold">Assistente do auditor</h3>
              {motor && <Etiqueta tom={motor === 'openai' ? 'roxo' : 'neutro'}>{motor === 'openai' ? 'IA' : 'local'}</Etiqueta>}
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {pensando ? (
                <p className="animate-brilho py-8 text-center text-[13.5px] text-texto3">Analisando…</p>
              ) : resposta ? (
                <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-texto2">{resposta}</p>
              ) : (
                <>
                  <p className="mb-3 text-[13px] text-texto3">Perguntas frequentes durante a auditoria:</p>
                  <ul className="space-y-1.5">
                    {ATALHOS.map((a) => (
                      <li key={a}>
                        <button
                          onClick={() => { setPergunta(a); void consultar(a); }}
                          className="w-full rounded-xl border px-3.5 py-2.5 text-left text-[13px] text-texto2 transition-colors hover:bg-texto/[.05] hover:text-texto"
                        >
                          {a}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); void consultar(pergunta); }}
              className="flex gap-2 border-t px-4 py-3"
            >
              <input
                value={pergunta} onChange={(e) => setPergunta(e.target.value)}
                placeholder="Pergunte algo sobre a auditoria…"
                className="campo flex-1 py-2 text-[14px]"
              />
              <Botao type="submit" variante="primario" tamanho="p" disabled={pensando || !pergunta.trim()}>Enviar</Botao>
            </form>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
