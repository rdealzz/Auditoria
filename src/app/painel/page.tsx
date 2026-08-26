'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import { Anel, Botao, Vazio } from '@/components/ui';
import LinhaAuditoria from '@/components/LinhaAuditoria';
import { IconeMais } from '@/components/Icones';
import type { Auditoria, Metricas } from '@/lib/tipos';
import { calcularMetricas, formatarDuracao, listarAuditorias } from '@/lib/armazenamento';
import { useApp } from '../provedores';

export default function Painel() {
  const { usuario } = useApp();
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [m, setM] = useState<Metricas | null>(null);

  useEffect(() => {
    const carregar = () => {
      const lista = listarAuditorias();
      setAuditorias(lista);
      setM(calcularMetricas(lista));
    };
    carregar();
    window.addEventListener('auditoria:alterado', carregar);
    return () => window.removeEventListener('auditoria:alterado', carregar);
  }, []);

  if (!usuario || !m) return <Navegacao />;

  const abertas = auditorias.filter((a) => a.status === 'em_andamento');
  const concluidas = auditorias.filter((a) => a.status === 'concluida');
  const cor = m.taxaConformidade >= 85 ? 'rgb(var(--verde))' : m.taxaConformidade >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))';

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-[900px] px-6 pb-24 pt-12 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-[13px] text-texto3">{saudacao()}, {usuario.nome.split(' ')[0]}</p>
          <h1 className="mt-2 text-[42px] font-semibold leading-[1.05] tracking-[-.035em] sm:text-[54px]">
            {abertas.length > 0 ? 'Continue de onde parou' : 'Pronto para auditar'}
          </h1>
          <div className="mt-7">
            <Link href="/auditorias/nova">
              <Botao variante="primario" tamanho="g"><IconeMais tamanho={18} />Nova auditoria</Botao>
            </Link>
          </div>
        </motion.header>

        {/* Resumo enxuto: um número grande e três apoios */}
        {auditorias.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
            className="mb-16 flex flex-wrap items-center gap-x-14 gap-y-8 border-y py-9"
          >
            <Anel valor={m.taxaConformidade} tamanho={132} espessura={11} cor={cor}>
              <div>
                <p className="text-[30px] font-semibold tabular-nums leading-none">{m.taxaConformidade}%</p>
                <p className="mt-1 text-[10.5px] uppercase tracking-wide text-texto3">conforme</p>
              </div>
            </Anel>
            <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-4">
              <Numero valor={String(m.totalNC)} rotulo="não conformidades" tom={m.totalNC ? 'text-vermelho' : undefined} />
              <Numero valor={String(m.emAndamento)} rotulo="em andamento" />
              <Numero valor={String(m.concluidas)} rotulo="concluídas" />
              <Numero valor={formatarDuracao(m.tempoMedioMin)} rotulo="tempo médio" />
            </div>
          </motion.section>
        )}

        <section className="mb-14">
          {abertas.length === 0 && concluidas.length === 0 ? (
            <Vazio
              titulo="Nenhuma auditoria ainda"
              descricao="Escolha um setor e o sistema monta o roteiro técnico com os requisitos das três normas do SGI."
              acao={<Link href="/auditorias/nova"><Botao variante="primario">Começar</Botao></Link>}
            />
          ) : (
            <>
              {abertas.length > 0 && (
                <>
                  <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">Em andamento</h2>
                  <ul className="mb-12 space-y-2.5">
                    {abertas.slice(0, 5).map((a, i) => <LinhaAuditoria key={a.id} auditoria={a} indice={i} />)}
                  </ul>
                </>
              )}

              {concluidas.length > 0 && (
                <>
                  <div className="mb-4 flex items-baseline justify-between">
                    <h2 className="text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">Concluídas</h2>
                    <Link href="/historico" className="text-[13px] text-acento transition-opacity hover:opacity-70">
                      Ver todas
                    </Link>
                  </div>
                  <ul className="space-y-2.5">
                    {concluidas.slice(0, 4).map((a, i) => <LinhaAuditoria key={a.id} auditoria={a} indice={i} />)}
                  </ul>
                </>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

function Numero({ valor, rotulo, tom = 'text-texto' }: { valor: string; rotulo: string; tom?: string }) {
  return (
    <div>
      <p className={`text-[28px] font-semibold tabular-nums leading-none ${tom}`}>{valor}</p>
      <p className="mt-2 text-[12px] leading-snug text-texto3">{rotulo}</p>
    </div>
  );
}
