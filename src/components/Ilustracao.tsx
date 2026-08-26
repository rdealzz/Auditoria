'use client';

import { useMemo, useState } from 'react';
import { renderIlustracao } from '@/lib/ilustracoes';
import { temFotoEmCache } from '@/dados/imagens';

type Props = {
  cena: string;
  /** slug da etapa/setor: procura /etapas/<slug>.jpg gerado por `npm run imagens` */
  cache?: string;
  legenda?: string;
  proporcao?: string;
  className?: string;
};

/**
 * Mostra a foto em cache quando ela existe (npm run imagens) e recai
 * automaticamente na ilustração vetorial quando não existe ou falha ao carregar.
 */
export default function Ilustracao({ cena, cache, legenda, proporcao = '16 / 9', className = '' }: Props) {
  const [falhou, setFalhou] = useState(false);
  const svg = useMemo(() => renderIlustracao(cena), [cena]);
  const usarFoto = temFotoEmCache(cache) && !falhou;

  return (
    <figure className={`relative overflow-hidden rounded-xl2 border bg-afundado shadow-nivel1 ${className}`}>
      <div style={{ aspectRatio: proporcao }} className="relative w-full">
        {usarFoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/etapas/${cache}.jpg`}
            alt={legenda ?? ''}
            onError={() => setFalhou(true)}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        )}
      </div>
      {legenda && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-8 text-[12.5px] leading-snug text-white">
          {legenda}
        </figcaption>
      )}
    </figure>
  );
}
