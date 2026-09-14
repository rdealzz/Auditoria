'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../provedores';
import { Botao, Selecao } from '@/components/ui';
import CampoSenha from '@/components/CampoSenha';
import MolduraAcesso, { Aviso } from '@/components/MolduraAcesso';
import { IconeUsuario } from '@/components/Icones';
import { criarConta, existeAlgumaConta, normalizarUsuario, PERGUNTAS, usuarioDisponivel } from '@/lib/contas';

export default function CriarConta() {
  const { usuario, carregando, definirUsuario, avisar } = useApp();
  const router = useRouter();

  const [nome, setNome] = useState('');
  const [login, setLogin] = useState('');
  const [loginTocado, setLoginTocado] = useState(false);
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [pergunta, setPergunta] = useState<string>(PERGUNTAS[0]);
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [primeira, setPrimeira] = useState(false);

  useEffect(() => {
    if (!carregando && usuario) router.replace('/painel');
  }, [carregando, usuario, router]);

  useEffect(() => { setPrimeira(!existeAlgumaConta()); }, []);

  // Enquanto a pessoa não editar o usuário, ele é sugerido a partir do nome.
  const sugestao = useMemo(() => normalizarUsuario(nome), [nome]);
  const loginFinal = loginTocado ? normalizarUsuario(login) : sugestao;

  const confereConfirmacao = confirmacao.length > 0 && senha !== confirmacao;
  const loginEmUso = loginFinal.length >= 3 && !usuarioDisponivel(loginFinal);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    const r = await criarConta({ usuario: loginFinal, nome, senha, confirmacao, pergunta, resposta });
    if (!r.ok) {
      setErro(r.erro);
      setEnviando(false);
      return;
    }
    definirUsuario(r.valor);
    avisar(`Conta criada. Bem‑vindo, ${r.valor.nome.split(' ')[0]}!`);
    router.replace('/painel');
  }

  return (
    <MolduraAcesso
      largura={460}
      voltar={primeira ? undefined : { href: '/', texto: 'Entrar' }}
      titulo={primeira ? 'Criar a primeira conta' : 'Criar conta'}
      descricao={
        primeira
          ? 'Nenhuma conta foi criada ainda neste sistema. Escolha o seu usuário e a sua senha — o acesso fica guardado neste dispositivo.'
          : 'Escolha um usuário e uma senha para acessar as auditorias.'
      }
    >
      <form onSubmit={submeter} className="cartao vidro space-y-5 p-7">
        <label className="block">
          <span className="rotulo">Nome completo</span>
          <input
            value={nome} onChange={(e) => setNome(e.target.value)}
            autoComplete="name" autoFocus required placeholder="Como você assina os relatórios"
            className="campo"
          />
        </label>

        <label className="block">
          <span className="rotulo">Usuário</span>
          <div className="relative">
            <IconeUsuario tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
            <input
              value={loginFinal}
              onChange={(e) => { setLoginTocado(true); setLogin(e.target.value); }}
              autoComplete="username" required placeholder="seu.usuario"
              className="campo pl-11" spellCheck={false}
            />
          </div>
          <span className={`mt-1.5 block text-[12px] ${loginEmUso ? 'text-vermelho' : 'text-texto3'}`}>
            {loginEmUso
              ? 'Esse usuário já está em uso — escolha outro.'
              : 'É com ele que você entra. Só letras, números, ponto, hífen e sublinhado — sem e‑mail.'}
          </span>
        </label>

        <CampoSenha
          rotulo="Senha" valor={senha} aoMudar={setSenha} medirForca
          autoComplete="new-password" required placeholder="Crie uma senha"
        />

        <div>
          <CampoSenha
            rotulo="Confirmar senha" valor={confirmacao} aoMudar={setConfirmacao}
            autoComplete="new-password" required placeholder="Repita a senha"
          />
          {confereConfirmacao && (
            <span className="mt-1.5 block text-[12px] text-vermelho">As senhas não conferem.</span>
          )}
        </div>

        <div className="rounded-xl2 border border-dashed p-4">
          <p className="mb-3 text-[13px] leading-snug text-texto3">
            Para recuperar o acesso caso esqueça a senha — como não usamos e‑mail, a redefinição
            é feita por esta pergunta.
          </p>
          <Selecao
            rotulo="Pergunta de segurança"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            opcoes={PERGUNTAS.map((p) => ({ valor: p, texto: p }))}
          />
          <label className="mt-3 block">
            <span className="rotulo">Resposta</span>
            <input
              value={resposta} onChange={(e) => setResposta(e.target.value)}
              required placeholder="Sua resposta" className="campo" spellCheck={false} autoComplete="off"
            />
            <span className="mt-1.5 block text-[12px] text-texto3">
              Maiúsculas e acentos não importam na hora de conferir.
            </span>
          </label>
        </div>

        {erro && <Aviso texto={erro} />}

        <Botao type="submit" variante="primario" tamanho="g" className="w-full" disabled={enviando || loginEmUso}>
          {enviando ? 'Criando conta…' : 'Criar conta'}
        </Botao>

        {!primeira && (
          <p className="pt-1 text-center text-[13px] text-texto3">
            Já tem conta? <Link href="/" className="font-medium text-acento hover:underline">Entrar</Link>
          </p>
        )}
      </form>
    </MolduraAcesso>
  );
}
