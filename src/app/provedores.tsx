'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Usuario } from '@/lib/tipos';
import { autenticar, encerrarSessao, existeAlgumaConta, sessaoAtual } from '@/lib/contas';
import { EVENTO_SEM_ESPACO } from '@/lib/armazenamento';

type Tema = 'claro' | 'escuro';

type Contexto = {
  usuario: Usuario | null;
  carregando: boolean;
  /** Há pelo menos uma conta criada? Se não, a porta de entrada é o cadastro. */
  temConta: boolean;
  entrar: (usuario: string, senha: string) => Promise<string | null>;
  /** Registra a sessão após criar conta ou redefinir senha, sem repetir o login. */
  definirUsuario: (usuario: Usuario) => void;
  revisarContas: () => void;
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
  const [temConta, setTemConta] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [tema, setTema] = useState<Tema>('claro');
  const [avisos, setAvisos] = useState<{ id: number; texto: string }[]>([]);

  useEffect(() => {
    setUsuario(sessaoAtual());
    setTemConta(existeAlgumaConta());
    const salvo = (localStorage.getItem('auditoria.tema') as Tema | null)
      ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro');
    setTema(salvo);
    document.documentElement.setAttribute('data-tema', salvo);
    setCarregando(false);
  }, []);

  /** Devolve a mensagem de erro, ou `null` quando a entrada foi aceita. */
  const entrar = useCallback(async (login: string, senha: string) => {
    const r = await autenticar(login, senha);
    if (!r.ok) return r.erro;
    setUsuario(r.valor);
    setTemConta(true);
    return null;
  }, []);

  const definirUsuario = useCallback((u: Usuario) => {
    setUsuario(u);
    setTemConta(true);
  }, []);

  const revisarContas = useCallback(() => setTemConta(existeAlgumaConta()), []);

  const sair = useCallback(() => {
    encerrarSessao();
    setUsuario(null);
    setTemConta(existeAlgumaConta());
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

  // Rede de segurança: nenhuma alteração pode falhar sem a pessoa ficar sabendo.
  useEffect(() => {
    const semEspaco = () =>
      avisar('Sem espaço neste aparelho — a última alteração não foi salva. Exporte as auditorias em Minha conta e apague as antigas.');
    window.addEventListener(EVENTO_SEM_ESPACO, semEspaco);
    return () => window.removeEventListener(EVENTO_SEM_ESPACO, semEspaco);
  }, [avisar]);

  const valor = useMemo(
    () => ({ usuario, carregando, temConta, entrar, definirUsuario, revisarContas, sair, tema, alternarTema, avisar }),
    [usuario, carregando, temConta, entrar, definirUsuario, revisarContas, sair, tema, alternarTema, avisar]
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
