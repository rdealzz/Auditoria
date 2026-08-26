'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { setorPorId } from '@/dados/setores';
import { NORMAS } from '@/dados/sgi';
import type { Auditoria } from '@/lib/tipos';
import { formatarData, progressoGeral, taxaConformidade } from '@/lib/armazenamento';
import { Barra } from './ui';
import { IconeSeta } from './Icones';

const PONTO = { iso9001: 'bg-acento', iso14001: 'bg-verde', iso45001: 'bg-ambar' } as const;

/** Uma auditoria em uma linha: setor, normas cobertas, progresso e resultado. */
export default function LinhaAuditoria({ auditoria, indice }: { auditoria: Auditoria; indice: number }) {
  const p = progressoGeral(auditoria);
  const setor = setorPorId(auditoria.setor);
  const concluida = auditoria.status === 'concluida';
  const destino = concluida ? `/auditorias/${auditoria.id}/relatorio` : `/auditorias/${auditoria.id}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(indice * 0.05, 0.3), ease: [0.32, 0.72, 0, 1] }}
    >
      <Link
        href={destino}
        className="group flex items-center gap-5 rounded-xl2 border bg-superficie px-6 py-5
                   transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-nivel1"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <p className="truncate text-[16px] font-semibold tracking-[-.015em]">{setor?.nome ?? auditoria.setor}</p>
            <span className="flex shrink-0 gap-1">
              {NORMAS.filter((n) => auditoria.normas.includes(n.id)).map((n) => (
                <span key={n.id} title={n.nome} className={`h-1.5 w-1.5 rounded-full ${PONTO[n.id]}`} />
              ))}
            </span>
          </div>
          <p className="mt-1 truncate text-[12.5px] text-texto3">
            {auditoria.empresa} <span className="mx-1 opacity-40">·</span> {formatarData(auditoria.data)}
            {auditoria.naoConformidades.length > 0 && (
              <>
                <span className="mx-1 opacity-40">·</span>
                <span className="text-vermelho">{auditoria.naoConformidades.length} NC</span>
              </>
            )}
          </p>
          {!concluida && <div className="mt-3 max-w-[240px]"><Barra valor={p.percentual} altura={4} /></div>}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[18px] font-semibold tabular-nums leading-none">
            {concluida ? `${taxaConformidade(auditoria)}%` : `${p.percentual}%`}
          </p>
          <p className="mt-1.5 text-[11px] text-texto3">{concluida ? 'conforme' : 'concluído'}</p>
        </div>

        <IconeSeta tamanho={17} className="shrink-0 text-texto3 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </motion.li>
  );
}
