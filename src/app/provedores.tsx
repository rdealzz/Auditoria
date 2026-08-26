'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Usuario } from '@/lib/tipos';
import { autenticar, encerrarSessao, sessaoAtual } from '@/lib/armazenamento';

type Tema = 'claro' | 'escuro';

type Contexto = {
  usuario: Usuario | null;
  carregando: boolean;
  entrar: (usuario: string, senha: string) => Usuario | null;
  sair: () => void;
  tema: Tema;
  alternarTema: () => void;
  avisar: (mensagem: string) => void;
};

const Ctx = createContext<Contexto | null>(null);

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp precisa estar dentro de <Provedores>');
  return c;
};

export default function Provedores({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [tema, setTema] = useState<Tema>('claro');
  const [avisos, setAvisos] = useState<{ id: number; texto: string }[]>([]);

  useEffect(() => {
    setUsuario(sessaoAtual());
    const salvo = (localStorage.getItem('auditoria.tema') as Tema | null)
      ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro');
    setTema(salvo);
    document.documentElement.setAttribute('data-tema', salvo);
    setCarregando(false);
  }, []);

  const entrar = useCallback((login: string, senha: string) => {
    const u = autenticar(login, senha);
    if (u) setUsuario(u);
    return u;
  }, []);

  const sair = useCallback(() => {
    encerrarSessao();
    setUsuario(null);
  }, []);

  const alternarTema = useCallback(() => {
    setTema((atual) => {
      const novo: Tema = atual === 'claro' ? 'escuro' : 'claro';
      document.documentElement.setAttribute('data-tema', novo);
      localStorage.setItem('auditoria.tema', novo);
      return novo;
    });
  }, []);

  const avisar = useCallback((texto: string) => {
    const id = Date.now() + Math.random();
    setAvisos((a) => [...a, { id, texto }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), 3200);
  }, []);

  const valor = useMemo(
    () => ({ usuario, carregando, entrar, sair, tema, alternarTema, avisar }),
    [usuario, carregando, entrar, sair, tema, alternarTema, avisar]
  );

  return (
    <Ctx.Provider value={valor}>
      {children}
      {/* No topo: a barra de ação flutuante das etapas ocupa a base da tela. */}
      <div className="pointer-events-none fixed inset-x-0 top-[66px] z-[200] grid justify-items-center gap-2 nao-imprimir">
        {avisos.map((a) => (
          <div key={a.id} className="animate-entrar rounded-pill bg-[rgb(28_28_30/.94)] px-5 py-3 text-[14px] text-white shadow-nivel2 backdrop-blur">
            {a.texto}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}
