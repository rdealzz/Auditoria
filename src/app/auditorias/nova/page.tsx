'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import Ilustracao from '@/components/Ilustracao';
import { AreaTexto, Botao, Campo, Cartao, Etiqueta, Selecao } from '@/components/ui';
import { IconeSeta, IconeVoltar } from '@/components/Icones';
import { NORMAS, SETORES, nomeNorma, setorPorId } from '@/dados/normas';
import { novaAuditoria, salvarAuditoria } from '@/lib/armazenamento';
import { useApp } from '@/app/provedores';

export default function NovaAuditoria() {
  const router = useRouter();
  const { usuario, avisar } = useApp();

  const [form, setForm] = useState({
    norma: 'iso9001',
    setor: 'producao',
    processo: '',
    empresa: '',
    auditor: usuario?.nome ?? '',
    auditado: '',
    data: new Date().toISOString().slice(0, 10),
    escopo: '',
    objetivo: '',
    criterio: ''
  });

  /* O usuário é lido do armazenamento após a hidratação: preenche o auditor quando ele chega. */
  useEffect(() => {
    if (usuario?.nome) setForm((f) => (f.auditor ? f : { ...f, auditor: usuario.nome }));
  }, [usuario?.nome]);

  const definir = (campo: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }));

  const setor = setorPorId(form.setor);

  /** Preenche escopo, objetivo e critério com um texto técnico coerente com a seleção. */
  function sugerir() {
    const s = setorPorId(form.setor);
    const n = nomeNorma(form.norma);
    setForm((f) => ({
      ...f,
      escopo: f.escopo || `Processos do setor de ${s?.nome ?? f.setor}${f.processo ? ` — ${f.processo}` : ''}, incluindo documentação, infraestrutura, equipamentos, competência, execução, registros e tratamento de não conformidades. Abrange todos os turnos em operação na data da auditoria.`,
      objetivo: f.objetivo || `Verificar a conformidade dos processos do setor de ${s?.nome ?? f.setor} com os requisitos da ${n} e com os procedimentos internos, identificando não conformidades, riscos e oportunidades de melhoria.`,
      criterio: f.criterio || `${n}; procedimentos, instruções de trabalho e planos de controle aplicáveis ao setor; requisitos legais e de clientes pertinentes.`
    }));
    avisar('Escopo, objetivo e critério sugeridos.');
  }

  function iniciar(e: React.FormEvent) {
    e.preventDefault();
    const a = salvarAuditoria(novaAuditoria({ ...form, status: 'em_andamento' }));
    router.push(`/auditorias/${a.id}`);
  }

  if (!usuario) return <Navegacao />;

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-[900px] px-5 py-9 sm:px-7">
        <Link href="/painel" className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-texto3 hover:text-texto">
          <IconeVoltar tamanho={15} />Painel
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-[32px] font-semibold tracking-[-.03em] sm:text-[38px]">Nova auditoria</h1>
          <p className="mt-2 max-w-2xl text-[15px] text-texto2">
            Preencha a identificação. Em seguida o sistema conduz você pelas dez etapas, explicando o que verificar,
            o que perguntar e quais evidências coletar em cada uma.
          </p>
        </motion.div>

        <form onSubmit={iniciar} className="mt-8 space-y-5">
          <Cartao animar atraso={0.05}>
            <h2 className="mb-5 text-[17px] font-semibold">Identificação</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Selecao rotulo="Norma" value={form.norma} onChange={definir('norma')}
                opcoes={NORMAS.map((n) => ({ valor: n.id, texto: `${n.nome}${n.ano !== '—' ? `:${n.ano}` : ''} — ${n.descricao}` }))} />
              <Selecao rotulo="Setor" value={form.setor} onChange={definir('setor')}
                opcoes={SETORES.map((s) => ({ valor: s.id, texto: s.nome }))} />
              <Campo rotulo="Processo" value={form.processo} onChange={definir('processo')}
                placeholder="Ex.: Injeção plástica — linha 2" />
              <Campo rotulo="Empresa" value={form.empresa} onChange={definir('empresa')}
                placeholder="Ex.: Metalúrgica Sul Ltda." required />
              <Campo rotulo="Auditor" value={form.auditor} onChange={definir('auditor')}
                placeholder="Quem conduz a auditoria" required />
              <Campo rotulo="Auditado" value={form.auditado} onChange={definir('auditado')}
                placeholder="Responsável pelo setor" required />
              <Campo rotulo="Data" type="date" value={form.data} onChange={definir('data')} required />
            </div>
          </Cartao>

          {setor && (
            <Cartao animar atraso={0.1}>
              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                <Ilustracao cena={setor.ilustracao} cache={`setor-${setor.id}`} legenda={setor.nome} proporcao="4 / 3" />
                <div>
                  <Etiqueta tom="acento" className="mb-3">Contexto do setor</Etiqueta>
                  <h3 className="text-[19px] font-semibold tracking-[-.02em]">{setor.nome}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-texto2">{setor.contexto}</p>
                  <p className="mb-2 mt-5 text-[12px] font-semibold uppercase tracking-wide text-texto3">Pontos de atenção</p>
                  <ul className="space-y-1.5">
                    {setor.atencao.map((a) => (
                      <li key={a} className="flex gap-2 text-[13.5px] text-texto2">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-acento/60" />{a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Cartao>
          )}

          <Cartao animar atraso={0.15}>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[17px] font-semibold">Escopo, objetivo e critério</h2>
              <Botao type="button" variante="suave" tamanho="p" onClick={sugerir}>Preencher automaticamente</Botao>
            </div>
            <div className="space-y-4">
              <AreaTexto rotulo="Escopo" value={form.escopo} onChange={definir('escopo')} required
                placeholder="Quais processos, turnos, linhas e locais entram nesta auditoria"
                dica="Delimite o que está dentro e o que está fora. Isso evita discussão na reunião de encerramento." />
              <AreaTexto rotulo="Objetivo" value={form.objetivo} onChange={definir('objetivo')} required
                placeholder="O que esta auditoria pretende verificar"
                dica="Objetivo claro orienta a amostragem e o nível de profundidade." />
              <AreaTexto rotulo="Critério da auditoria" value={form.criterio} onChange={definir('criterio')} required
                placeholder="Norma, procedimentos internos, requisitos legais e de clientes"
                dica="É a régua da auditoria: toda não conformidade precisa apontar um critério descumprido." />
            </div>
          </Cartao>

          <div className="flex flex-wrap items-center justify-end gap-3 pb-6">
            <Link href="/painel"><Botao type="button" variante="contorno">Cancelar</Botao></Link>
            <Botao type="submit" variante="primario" tamanho="g">
              Iniciar auditoria <IconeSeta tamanho={17} />
            </Botao>
          </div>
        </form>
      </main>
    </>
  );
}
