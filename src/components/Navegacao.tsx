'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useApp } from '@/app/provedores';
import { Avatar } from './ui';
import { IconeEscudo, IconeGrafico, IconeHistorico, IconeLua, IconePainel, IconeSair, IconeSol } from './Icones';

const itens = [
  { href: '/painel', texto: 'Painel', Icone: IconePainel },
  { href: '/historico', texto: 'Histórico', Icone: IconeHistorico },
  { href: '/indicadores', texto: 'Indicadores', Icone: IconeGrafico }
];

export default function Navegacao() {
  const { usuario, sair, tema, alternarTema, carregando } = useApp();
  const caminho = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !usuario) router.replace('/');
  }, [carregando, usuario, router]);

  if (!usuario) return null;

  return (
    <header className="vidro sticky top-0 z-50 flex h-[54px] items-center gap-2 border-b px-4 sm:px-6 nao-imprimir">
      <Link href="/painel" className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-texto hover:opacity-80">
        <IconeEscudo tamanho={19} className="text-acento" />
        <span className="hidden sm:inline">Auditoria</span>
      </Link>

      <nav className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto">
        {itens.map(({ href, texto, Icone }) => {
          const ativo = caminho === href || caminho.startsWith(href + '/');
          return (
            <Link
              key={href} href={href}
              className={`flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[13px] transition-colors duration-200
                ${ativo ? 'bg-acento/12 font-medium text-acento' : 'text-texto2 hover:bg-texto/[.06] hover:text-texto'}`}
            >
              <Icone tamanho={15} />
              <span className="hidden md:inline">{texto}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={alternarTema}
        aria-label={tema === 'claro' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        className="grid h-8 w-8 place-items-center rounded-full text-texto2 transition-colors hover:bg-texto/[.07] hover:text-texto"
      >
        {tema === 'claro' ? <IconeLua tamanho={17} /> : <IconeSol tamanho={17} />}
      </button>

      <div className="flex items-center gap-2 rounded-pill border py-1 pl-1 pr-1 sm:pr-3">
        <Avatar nome={usuario.nome} tamanho={26} />
        <div className="hidden leading-tight sm:block">
          <p className="text-[12.5px] font-medium text-texto">{usuario.nome}</p>
          <p className="text-[10.5px] uppercase tracking-wide text-texto3">Administrador</p>
        </div>
      </div>

      <button
        onClick={sair}
        aria-label="Sair"
        className="grid h-8 w-8 place-items-center rounded-full text-texto2 transition-colors hover:bg-vermelho/12 hover:text-vermelho"
      >
        <IconeSair tamanho={17} />
      </button>
    </header>
  );
}
