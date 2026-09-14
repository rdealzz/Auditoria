'use client';

import { useState } from 'react';
import { useApp } from '../provedores';
import Navegacao from '@/components/Navegacao';
import { Botao, Cartao } from '@/components/ui';
import CampoSenha from '@/components/CampoSenha';
import { Aviso } from '@/components/MolduraAcesso';
import PainelBackup from '@/components/PainelBackup';
import { alterarSenha } from '@/lib/contas';
import { formatarData } from '@/lib/armazenamento';

export default function MinhaConta() {
  const { usuario, avisar } = useApp();
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);

  if (!usuario) return <Navegacao />;

  async function trocar(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario) return;
    setErro('');
    setOcupado(true);
    const r = await alterarSenha(usuario.usuario, atual, nova, confirmacao);
    setOcupado(false);
    if (!r.ok) { setErro(r.erro); return; }
    setAtual(''); setNova(''); setConfirmacao('');
    avisar('Senha alterada.');
  }

  return (
    <>
      <Navegacao />
      <main className="mx-auto w-full max-w-[640px] px-5 py-8 sm:px-6">
        <h1 className="text-[27px] font-semibold tracking-[-.02em] text-texto">Minha conta</h1>
        <p className="mt-1 text-[13.5px] text-texto3">Dados de acesso e backup deste aparelho.</p>

        <Cartao className="mt-6" animar>
          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              { t: 'Nome', v: usuario.nome },
              { t: 'Usuário', v: usuario.usuario },
              { t: 'Perfil', v: 'Administrador' },
              { t: 'Conta criada em', v: formatarData(usuario.criadoEm) }
            ].map((i) => (
              <div key={i.t}>
                <dt className="text-[12px] uppercase tracking-wide text-texto3">{i.t}</dt>
                <dd className="text-[15px] text-texto">{i.v}</dd>
              </div>
            ))}
          </dl>
        </Cartao>

        <Cartao className="mt-4" animar atraso={0.08}>
          <h2 className="text-[17px] font-semibold text-texto">Trocar senha</h2>
          <form onSubmit={trocar} className="mt-4 space-y-5">
            <CampoSenha rotulo="Senha atual" valor={atual} aoMudar={setAtual} autoComplete="current-password" required />
            <CampoSenha rotulo="Nova senha" valor={nova} aoMudar={setNova} medirForca autoComplete="new-password" required />
            <div>
              <CampoSenha rotulo="Confirmar nova senha" valor={confirmacao} aoMudar={setConfirmacao} autoComplete="new-password" required />
              {confirmacao.length > 0 && nova !== confirmacao && (
                <span className="mt-1.5 block text-[12px] text-vermelho">As senhas não conferem.</span>
              )}
            </div>
            {erro && <Aviso texto={erro} />}
            <Botao type="submit" variante="primario" disabled={ocupado}>
              {ocupado ? 'Salvando…' : 'Salvar nova senha'}
            </Botao>
          </form>
        </Cartao>

        <h2 id="backup" className="mt-10 scroll-mt-20 text-[21px] font-semibold tracking-[-.02em] text-texto">
          Backup e transferência
        </h2>
        <p className="mb-4 mt-1 text-[13.5px] leading-snug text-texto3">
          As auditorias ficam guardadas apenas neste aparelho. Exporte de tempos em tempos —
          é a única cópia que sobrevive à limpeza dos dados do navegador.
        </p>
        <PainelBackup />
      </main>
    </>
  );
}
