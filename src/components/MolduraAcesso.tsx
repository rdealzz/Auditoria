'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { IconeEscudo, IconeVoltar } from './Icones';

/** Moldura comum às telas de entrar, criar conta e redefinir senha. */
export default function MolduraAcesso({
  titulo, descricao, voltar, children, rodape, largura = 420
}: {
  titulo: string;
  descricao: string;
  voltar?: { href: string; texto: string };
  children: ReactNode;
  rodape?: ReactNode;
  largura?: number;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-acento/20 blur-[130px]" />
        <div className="absolute bottom-[-22%] right-[-8%] h-[440px] w-[600px] rounded-full bg-roxo/15 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="w-full"
        style={{ maxWidth: largura }}
      >
        {voltar && (
          <Link
            href={voltar.href}
            className="mb-5 inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[13.5px] text-texto2
                       transition-colors duration-200 hover:bg-texto/[.06] hover:text-texto"
          >
            <IconeVoltar tamanho={15} /> {voltar.texto}
          </Link>
        )}

        <div className="mb-8 text-center">
          <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br from-acento to-roxo text-white shadow-nivel2">
            <IconeEscudo tamanho={26} strokeWidth={1.9} />
          </span>
          <h1 className="text-[30px] font-semibold tracking-[-.03em] text-texto">{titulo}</h1>
          <p className="mx-auto mt-2 max-w-[330px] text-[14.5px] leading-snug text-texto3">{descricao}</p>
        </div>

        {children}

        {rodape && <div className="mt-6">{rodape}</div>}
      </motion.div>
    </main>
  );
}

/** Aviso de erro usado nos formulários de acesso. */
export function Aviso({ texto, tom = 'erro' }: { texto: string; tom?: 'erro' | 'sucesso' }) {
  const cores = tom === 'erro' ? 'bg-vermelho/12 text-vermelho' : 'bg-verde/12 text-verde';
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role={tom === 'erro' ? 'alert' : 'status'}
      className={`rounded-xl px-4 py-2.5 text-[13.5px] leading-snug ${cores}`}
    >
      {texto}
    </motion.p>
  );
}
