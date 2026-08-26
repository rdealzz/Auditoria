'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from './provedores';
import { Botao } from '@/components/ui';
import { IconeCadeado, IconeEscudo, IconeUsuario } from '@/components/Icones';
import { SETORES } from '@/dados/setores';
import { NORMAS } from '@/dados/sgi';
import { resumoSetor } from '@/dados/montagem-roteiro';

export default function Login() {
  const { entrar, usuario, carregando } = useApp();
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!carregando && usuario) router.replace('/painel');
  }, [carregando, usuario, router]);

  function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    const u = entrar(login, senha);
    if (u) router.replace('/painel');
    else {
      setErro('Usuário ou senha incorretos.');
      setEnviando(false);
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      {/* Fundo com luz difusa */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-18%] h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-acento/20 blur-[130px]" />
        <div className="absolute bottom-[-22%] right-[-8%] h-[440px] w-[600px] rounded-full bg-roxo/15 blur-[130px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="mb-9 text-center">
          <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br from-acento to-roxo text-white shadow-nivel2">
            <IconeEscudo tamanho={26} strokeWidth={1.9} />
          </span>
          <h1 className="text-[34px] font-semibold tracking-[-.03em] text-texto">Auditoria</h1>
          <p className="mx-auto mt-2 max-w-[300px] text-[15px] leading-snug text-texto3">
            Auditorias do Sistema de Gestão Integrado
          </p>
        </div>

        <form onSubmit={submeter} className="cartao vidro space-y-4 p-7">
          <label className="block">
            <span className="rotulo">Usuário</span>
            <div className="relative">
              <IconeUsuario tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
              <input
                value={login} onChange={(e) => setLogin(e.target.value)}
                autoComplete="username" autoFocus required placeholder="erick.jesus"
                className="campo pl-11" spellCheck={false}
              />
            </div>
          </label>

          <label className="block">
            <span className="rotulo">Senha</span>
            <div className="relative">
              <IconeCadeado tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
              <input
                type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
                autoComplete="current-password" required placeholder="••••••••"
                className="campo pl-11"
              />
            </div>
          </label>

          {erro && (
            <motion.p
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-vermelho/12 px-4 py-2.5 text-[13.5px] text-vermelho"
            >
              {erro}
            </motion.p>
          )}

          <Botao type="submit" variante="primario" tamanho="g" className="w-full" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </Botao>

          <p className="pt-1 text-center text-[12px] leading-relaxed text-texto3">
            Acesso inicial: <strong className="font-medium text-texto2">erick.jesus</strong> / <strong className="font-medium text-texto2">qualidade</strong>
            <br />Perfil administrador — nesta versão todos os usuários têm as mesmas permissões.
          </p>
        </form>

        <div className="mt-7 flex justify-center gap-7 text-center">
          {[
            { n: SETORES.length, t: 'setores' },
            { n: SETORES.reduce((n, s) => n + resumoSetor(s).itens, 0), t: 'verificações' },
            { n: NORMAS.length, t: 'normas do SGI' }
          ].map((i) => (
            <div key={i.t}>
              <p className="text-[19px] font-semibold tabular-nums text-texto">{i.n}</p>
              <p className="text-[11.5px] text-texto3">{i.t}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
