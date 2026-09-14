'use client';

import { useId, useState, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { avaliarSenha } from '@/lib/contas';
import { IconeCadeado, IconeCheck, IconeOlho, IconeOlhoFechado } from './Icones';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  rotulo: string;
  valor: string;
  aoMudar: (valor: string) => void;
  /** Mostra os requisitos e a barra de força — usar no cadastro e na nova senha. */
  medirForca?: boolean;
  dica?: string;
};

/** Campo de senha com o olhinho para mostrar/ocultar o que foi digitado. */
export default function CampoSenha({
  rotulo, valor, aoMudar, medirForca = false, dica, className = '', ...props
}: Props) {
  const [visivel, setVisivel] = useState(false);
  const id = useId();
  const forca = medirForca ? avaliarSenha(valor) : null;
  const cor = forca && (forca.rotulo === 'forte' ? 'bg-verde' : forca.rotulo === 'média' ? 'bg-ambar' : 'bg-vermelho');

  return (
    <div>
      <label htmlFor={id} className="rotulo">{rotulo}</label>
      <div className="relative">
        <IconeCadeado tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
        <input
          {...props}
          id={id}
          type={visivel ? 'text' : 'password'}
          value={valor}
          onChange={(e) => aoMudar(e.target.value)}
          className={`campo pl-11 pr-12 ${className}`}
          spellCheck={false}
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          title={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full
                     text-texto3 transition-colors duration-200 hover:bg-texto/[.07] hover:text-texto"
        >
          {visivel ? <IconeOlhoFechado tamanho={18} /> : <IconeOlho tamanho={18} />}
        </button>
      </div>

      {forca && valor.length > 0 && (
        <div className="mt-2.5">
          <div className="flex items-center gap-2.5">
            <div className="h-1 flex-1 overflow-hidden rounded-pill bg-texto/[.08]">
              <motion.div
                className={`h-full rounded-pill ${cor}`}
                initial={false}
                animate={{ width: `${forca.pontos}%` }}
                transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>
            <span className="w-[42px] text-right text-[11.5px] text-texto3">{forca.rotulo}</span>
          </div>
          <ul className="mt-2 grid gap-1">
            {forca.requisitos.map((r) => (
              <li key={r.texto} className={`flex items-center gap-1.5 text-[12px] ${r.ok ? 'text-verde' : 'text-texto3'}`}>
                <span className={`grid h-3.5 w-3.5 shrink-0 place-items-center rounded-full ${r.ok ? 'bg-verde/15' : 'bg-texto/[.08]'}`}>
                  {r.ok ? <IconeCheck tamanho={9} strokeWidth={3} /> : <span className="h-1 w-1 rounded-full bg-texto3" />}
                </span>
                {r.texto}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dica && !(forca && valor.length > 0) && <span className="mt-1.5 block text-[12px] text-texto3">{dica}</span>}
    </div>
  );
}
