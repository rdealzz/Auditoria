'use client';

import type { Clausula, NormaId } from '@/dados/sgi';

const CORES: Record<NormaId, string> = {
  iso9001: 'bg-acento/12 text-acento',
  iso14001: 'bg-verde/15 text-verde',
  iso45001: 'bg-ambar/15 text-ambar'
};

const SIGLAS: Record<NormaId, string> = { iso9001: '9001', iso14001: '14001', iso45001: '45001' };

/** Selo compacto da cláusula: identifica a norma pela cor e mostra o código. */
export default function SeloNorma({ clausula, completo = false }: { clausula: Clausula; completo?: boolean }) {
  return (
    <span
      className={`etiqueta font-mono tabular-nums ${CORES[clausula.norma]}`}
      title={`ISO ${SIGLAS[clausula.norma]} — ${clausula.codigo} ${clausula.titulo}`}
    >
      {SIGLAS[clausula.norma]}<span className="opacity-50">·</span>{clausula.codigo}
      {completo && <span className="ml-1 font-sans font-normal opacity-75">{clausula.titulo}</span>}
    </span>
  );
}

export function PontoNorma({ norma }: { norma: NormaId }) {
  const cor = { iso9001: 'bg-acento', iso14001: 'bg-verde', iso45001: 'bg-ambar' }[norma];
  return <span className={`h-1.5 w-1.5 rounded-full ${cor}`} title={`ISO ${SIGLAS[norma]}`} />;
}
