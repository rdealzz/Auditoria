'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useApp } from '../provedores';
import { Botao } from '@/components/ui';
import CampoSenha from '@/components/CampoSenha';
import MolduraAcesso, { Aviso } from '@/components/MolduraAcesso';
import { IconeChave, IconeCheck, IconeUsuario } from '@/components/Icones';
import { conferirResposta, perguntaDe, redefinirSenha } from '@/lib/contas';

type Passo = 'usuario' | 'pergunta' | 'senha' | 'pronto';

const PASSOS: { id: Passo; titulo: string }[] = [
  { id: 'usuario', titulo: 'Usuário' },
  { id: 'pergunta', titulo: 'Segurança' },
  { id: 'senha', titulo: 'Nova senha' }
];

export default function RedefinirSenha() {
  const { avisar } = useApp();
  const router = useRouter();

  const [passo, setPasso] = useState<Passo>('usuario');
  const [login, setLogin] = useState('');
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  function avancarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    const p = perguntaDe(login);
    if (!p) { setErro('Não encontramos uma conta com esse usuário.'); return; }
    setPergunta(p);
    setPasso('pergunta');
  }

  async function avancarPergunta(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setOcupado(true);
    const ok = await conferirResposta(login, resposta);
    setOcupado(false);
    if (!ok) { setErro('A resposta não confere com a que foi cadastrada.'); return; }
    setPasso('senha');
  }

  async function concluir(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setOcupado(true);
    const r = await redefinirSenha(login, resposta, senha, confirmacao);
    setOcupado(false);
    if (!r.ok) { setErro(r.erro); return; }
    setPasso('pronto');
    avisar('Senha redefinida. Entre com a nova senha.');
  }

  const indice = PASSOS.findIndex((p) => p.id === passo);

  return (
    <MolduraAcesso
      largura={440}
      voltar={{ href: '/', texto: 'Entrar' }}
      titulo="Redefinir senha"
      descricao={
        passo === 'pronto'
          ? 'Tudo certo — sua senha foi trocada.'
          : 'Confirme quem você é pela pergunta de segurança escolhida no cadastro e escolha uma senha nova.'
      }
    >
      {passo !== 'pronto' && (
        <ol className="mb-5 flex items-center justify-center gap-2">
          {PASSOS.map((p, i) => (
            <li key={p.id} className="flex items-center gap-2">
              <span
                className={`grid h-6 w-6 place-items-center rounded-full text-[11.5px] font-semibold transition-colors duration-300
                  ${i < indice ? 'bg-verde/15 text-verde' : i === indice ? 'bg-acento text-white' : 'bg-texto/[.08] text-texto3'}`}
              >
                {i < indice ? <IconeCheck tamanho={12} strokeWidth={2.6} /> : i + 1}
              </span>
              <span className={`text-[12.5px] ${i === indice ? 'font-medium text-texto' : 'text-texto3'}`}>{p.titulo}</span>
              {i < PASSOS.length - 1 && <span className="mx-1 h-px w-5 bg-texto/15" />}
            </li>
          ))}
        </ol>
      )}

      <div className="cartao vidro p-7">
        {passo === 'usuario' && (
          <form onSubmit={avancarUsuario} className="space-y-4">
            <label className="block">
              <span className="rotulo">Qual é o seu usuário?</span>
              <div className="relative">
                <IconeUsuario tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
                <input
                  value={login} onChange={(e) => setLogin(e.target.value)}
                  autoComplete="username" autoFocus required placeholder="seu.usuario"
                  className="campo pl-11" spellCheck={false}
                />
              </div>
            </label>
            {erro && <Aviso texto={erro} />}
            <Botao type="submit" variante="primario" tamanho="g" className="w-full">Continuar</Botao>
          </form>
        )}

        {passo === 'pergunta' && (
          <form onSubmit={avancarPergunta} className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl2 bg-acento/[.08] px-4 py-3">
              <IconeChave tamanho={18} className="mt-0.5 shrink-0 text-acento" />
              <p className="text-[14px] leading-snug text-texto2">{pergunta}</p>
            </div>
            <label className="block">
              <span className="rotulo">Sua resposta</span>
              <input
                value={resposta} onChange={(e) => setResposta(e.target.value)}
                autoFocus required placeholder="Resposta cadastrada" className="campo"
                spellCheck={false} autoComplete="off"
              />
            </label>
            {erro && <Aviso texto={erro} />}
            <div className="flex gap-2">
              <Botao type="button" variante="suave" tamanho="g" className="flex-1" onClick={() => { setErro(''); setPasso('usuario'); }}>
                Voltar
              </Botao>
              <Botao type="submit" variante="primario" tamanho="g" className="flex-1" disabled={ocupado}>
                {ocupado ? 'Conferindo…' : 'Continuar'}
              </Botao>
            </div>
          </form>
        )}

        {passo === 'senha' && (
          <form onSubmit={concluir} className="space-y-5">
            <CampoSenha
              rotulo="Nova senha" valor={senha} aoMudar={setSenha} medirForca
              autoComplete="new-password" required autoFocus placeholder="Crie a nova senha"
            />
            <div>
              <CampoSenha
                rotulo="Confirmar nova senha" valor={confirmacao} aoMudar={setConfirmacao}
                autoComplete="new-password" required placeholder="Repita a nova senha"
              />
              {confirmacao.length > 0 && senha !== confirmacao && (
                <span className="mt-1.5 block text-[12px] text-vermelho">As senhas não conferem.</span>
              )}
            </div>
            {erro && <Aviso texto={erro} />}
            <Botao type="submit" variante="primario" tamanho="g" className="w-full" disabled={ocupado}>
              {ocupado ? 'Salvando…' : 'Redefinir senha'}
            </Botao>
          </form>
        )}

        {passo === 'pronto' && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="grid justify-items-center gap-4 py-2 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-verde/15 text-verde">
              <IconeCheck tamanho={26} strokeWidth={2.4} />
            </span>
            <p className="text-[15px] leading-snug text-texto2">
              A senha de <strong className="font-medium text-texto">{login}</strong> foi redefinida.
              Use a senha nova para entrar.
            </p>
            <Botao variante="primario" tamanho="g" className="w-full" onClick={() => router.replace('/')}>
              Ir para a entrada
            </Botao>
          </motion.div>
        )}
      </div>

      {passo !== 'pronto' && (
        <p className="mt-6 text-center text-[13px] text-texto3">
          Lembrou a senha? <Link href="/" className="font-medium text-acento hover:underline">Voltar para a entrada</Link>
        </p>
      )}
    </MolduraAcesso>
  );
}
