'use client';

import { motion } from 'framer-motion';
import type { Bloco } from '@/dados/roteiro';
import { normasDoBloco } from '@/dados/roteiro';
import { NORMAS } from '@/dados/sgi';
import Ilustracao from './Ilustracao';
import { Botao } from './ui';
import { IconeSeta } from './Icones';

const CORES = { iso9001: 'text-acento', iso14001: 'text-verde', iso45001: 'text-ambar' } as const;
const PONTOS = { iso9001: 'bg-acento', iso14001: 'bg-verde', iso45001: 'bg-ambar' } as const;

/**
 * Abertura do bloco: uma tela, poucos elementos, uma decisão.
 * O conteúdo técnico fica em cada verificação, não aqui.
 */
export default function AberturaBloco({
  bloco, numero, total, aoIniciar
}: { bloco: Bloco; numero: number; total: number; aoIniciar: () => void }) {
  const normas = normasDoBloco(bloco);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      className="mx-auto flex min-h-[calc(100vh-13rem)] max-w-[720px] flex-col justify-center py-14 text-center"
    >
      <p className="text-[13px] font-medium tabular-nums tracking-wide text-texto3">
        Bloco {numero} de {total}
      </p>

      <h1 className="mt-3 text-[38px] font-semibold leading-[1.05] tracking-[-.035em] sm:text-[52px]">
        {bloco.titulo}
      </h1>

      <p className="mx-auto mt-5 max-w-[540px] text-[18px] leading-relaxed text-texto2">
        {bloco.proposito}
      </p>

      <div className="mx-auto mt-8 w-full max-w-[520px]">
        <Ilustracao cena={bloco.ilustracao} legenda="" proporcao="21 / 9" />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        <span className="text-[14px] tabular-nums text-texto2">
          <strong className="font-semibold text-texto">{bloco.itens.length}</strong> verificações
        </span>
        {normas.map((id) => {
          const n = NORMAS.find((x) => x.id === id)!;
          return (
            <span key={id} className={`flex items-center gap-1.5 text-[14px] ${CORES[id]}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${PONTOS[id]}`} />
              {n.nome}
            </span>
          );
        })}
      </div>

      <div className="mt-10">
        <Botao variante="primario" tamanho="g" onClick={aoIniciar}>
          Iniciar verificação <IconeSeta tamanho={18} />
        </Botao>
      </div>
    </motion.div>
  );
}
