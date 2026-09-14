'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from './provedores';
import { Botao } from '@/components/ui';
import CampoSenha from '@/components/CampoSenha';
import MolduraAcesso, { Aviso } from '@/components/MolduraAcesso';
import { IconeUsuario } from '@/components/Icones';
import { SETORES } from '@/dados/setores';
import { NORMAS } from '@/dados/sgi';
import { resumoSetor } from '@/dados/montagem-roteiro';

export default function Entrar() {
  const { entrar, usuario, carregando, temConta } = useApp();
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (carregando) return;
    if (usuario) router.replace('/painel');
    // Sistema recém‑instalado: a primeira pessoa cria a própria conta.
    else if (!temConta) router.replace('/criar-conta');
  }, [carregando, usuario, temConta, router]);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    const falha = await entrar(login, senha);
    if (falha) {
      setErro(falha);
      setEnviando(false);
    } else {
      router.replace('/painel');
    }
  }

  return (
    <MolduraAcesso
      titulo="Auditoria"
      descricao="Auditorias do Sistema de Gestão Integrado"
      rodape={
        <div className="flex justify-center gap-7 text-center">
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
      }
    >
      <form onSubmit={submeter} className="cartao vidro space-y-4 p-7">
        <label className="block">
          <span className="rotulo">Usuário</span>
          <div className="relative">
            <IconeUsuario tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
            <input
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              autoComplete="username" autoFocus required placeholder="seu.usuario"
              className="campo pl-11" spellCheck={false}
            />
          </div>
        </label>

        <CampoSenha
          rotulo="Senha" valor={senha} aoMudar={setSenha}
          autoComplete="current-password" required placeholder="••••••••"
        />

        <div className="flex justify-end">
          <Link href="/redefinir-senha" className="text-[13px] text-acento hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        {erro && <Aviso texto={erro} />}

        <Botao type="submit" variante="primario" tamanho="g" className="w-full" disabled={enviando}>
          {enviando ? 'Entrando…' : 'Entrar'}
        </Botao>

        <p className="pt-1 text-center text-[13px] text-texto3">
          Ainda não tem acesso?{' '}
          <Link href="/criar-conta" className="font-medium text-acento hover:underline">Criar conta</Link>
        </p>
      </form>
    </MolduraAcesso>
  );
}
