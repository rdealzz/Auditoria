'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import { Anel, Vazio } from '@/components/ui';
import { GraficoBarras, GraficoLinha } from '@/components/Graficos';
import { SETORES } from '@/dados/setores';
import { roteiroDoSetor } from '@/dados/montagem-roteiro';
import { clausulas, NORMAS } from '@/dados/sgi';
import type { Auditoria } from '@/lib/tipos';
import { calcularMetricas, formatarDuracao, listarAuditorias, taxaConformidade } from '@/lib/armazenamento';
import { useApp } from '../provedores';

export default function Indicadores() {
  const { usuario } = useApp();
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);

  useEffect(() => {
    const carregar = () => setAuditorias(listarAuditorias());
    carregar();
    window.addEventListener('auditoria:alterado', carregar);
    return () => window.removeEventListener('auditoria:alterado', carregar);
  }, []);

  const m = useMemo(() => calcularMetricas(auditorias), [auditorias]);

  /* Conformidade e NC por norma, somando todas as auditorias. */
  const porNorma = useMemo(() => NORMAS.map((n) => {
    let avaliadas = 0, conformes = 0, ncs = 0;
    auditorias.forEach((a) => {
      if (!a.normas.includes(n.id)) return;
      roteiroDoSetor(a.setor).forEach((b) => b.itens.forEach((item) => {
        if (!clausulas(item.chavesClausulas).some((c) => c.norma === n.id)) return;
        const v = a.verificacoes[item.id];
        if (!v?.resposta || v.resposta === 'nao_aplicavel') return;
        avaliadas++;
        if (v.resposta === 'conforme') conformes++;
        if (v.resposta === 'nao_conforme') ncs++;
      }));
    });
    return { norma: n, avaliadas, ncs, taxa: avaliadas ? Math.round((conformes / avaliadas) * 100) : 0 };
  }).filter((x) => x.avaliadas > 0), [auditorias]);

  const ncPorSetor = useMemo(() =>
    SETORES.map((s) => ({
      rotulo: s.nome.split(/[ /]/)[0],
      valor: auditorias.filter((a) => a.setor === s.id).reduce((n, a) => n + a.naoConformidades.length, 0)
    })).filter((x) => x.valor > 0).sort((a, b) => b.valor - a.valor).slice(0, 7)
  , [auditorias]);

  const ncPorAuditor = useMemo(() => {
    const mapa = new Map<string, number>();
    auditorias.forEach((a) => {
      if (!a.auditor) return;
      mapa.set(a.auditor, (mapa.get(a.auditor) ?? 0) + a.naoConformidades.length);
    });
    const escolhidos = [...mapa.entries()]
      .filter(([, valor]) => valor > 0).sort((a, b) => b[1] - a[1]).slice(0, 7);

    // Só o primeiro nome caberia no gráfico, mas duas "Ana" viram a mesma coluna:
    // quando o primeiro nome repete, acrescenta a inicial do sobrenome.
    const vezes = new Map<string, number>();
    escolhidos.forEach(([nome]) => {
      const primeiro = nome.trim().split(/\s+/)[0];
      vezes.set(primeiro, (vezes.get(primeiro) ?? 0) + 1);
    });

    return escolhidos.map(([nome, valor]) => {
      const partes = nome.trim().split(/\s+/);
      const primeiro = partes[0];
      const rotulo = (vezes.get(primeiro) ?? 0) > 1 && partes[1]
        ? `${primeiro} ${partes[1][0].toUpperCase()}.`
        : primeiro;
      return { rotulo, valor };
    });
  }, [auditorias]);

  const evolucao = useMemo(() => {
    const meses = new Map<string, { soma: number; n: number }>();
    auditorias.filter((a) => a.status === 'concluida').forEach((a) => {
      const chave = a.data.slice(0, 7);
      const atual = meses.get(chave) ?? { soma: 0, n: 0 };
      meses.set(chave, { soma: atual.soma + taxaConformidade(a), n: atual.n + 1 });
    });
    return [...meses.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(-6)
      .map(([chave, v]) => ({
        rotulo: new Date(`${chave}-02`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
        valor: Math.round(v.soma / v.n)
      }));
  }, [auditorias]);

  const conformidadePorSetor = useMemo(() =>
    SETORES.map((s) => {
      const doSetor = auditorias.filter((a) => a.setor === s.id && Object.keys(a.verificacoes).length);
      if (!doSetor.length) return null;
      return {
        setor: s.nome,
        media: Math.round(doSetor.reduce((n, a) => n + taxaConformidade(a), 0) / doSetor.length),
        quantidade: doSetor.length
      };
    }).filter(Boolean).sort((a, b) => b!.media - a!.media) as { setor: string; media: number; quantidade: number }[]
  , [auditorias]);

  if (!usuario) return <Navegacao />;

  const cor = (t: number) => (t >= 85 ? 'rgb(var(--verde))' : t >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))');
  const barra = (t: number) => (t >= 85 ? 'bg-verde' : t >= 60 ? 'bg-ambar' : 'bg-vermelho');

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-[900px] px-6 pb-24 pt-12 sm:px-8">
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <h1 className="text-[38px] font-semibold leading-[1.05] tracking-[-.035em] sm:text-[46px]">Indicadores</h1>
          <p className="mt-2 text-[15px] text-texto3">Desempenho consolidado do Sistema de Gestão Integrado.</p>
        </motion.header>

        {auditorias.length === 0 ? (
          <Vazio titulo="Sem dados ainda" descricao="Os indicadores aparecem quando a primeira auditoria for registrada." />
        ) : (
          <div className="space-y-16">
            <section className="flex flex-wrap items-center gap-x-14 gap-y-8 border-y py-9">
              <Anel valor={m.taxaConformidade} tamanho={140} espessura={12} cor={cor(m.taxaConformidade)}>
                <div>
                  <p className="text-[32px] font-semibold tabular-nums leading-none">{m.taxaConformidade}%</p>
                  <p className="mt-1 text-[10.5px] uppercase tracking-wide text-texto3">conforme</p>
                </div>
              </Anel>
              <div className="grid flex-1 grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-4">
                <Numero valor={String(m.total)} rotulo="auditorias" />
                <Numero valor={String(m.totalNC)} rotulo="não conformidades" tom={m.totalNC ? 'text-vermelho' : undefined} />
                <Numero valor={String(m.verificacoesFeitas)} rotulo="verificações" />
                <Numero valor={formatarDuracao(m.tempoMedioMin)} rotulo="tempo médio" />
              </div>
            </section>

            {porNorma.length > 0 && (
              <section>
                <h2 className="mb-5 text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">Conformidade por norma</h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {porNorma.map((p) => (
                    <div key={p.norma.id} className="rounded-xl2 border bg-superficie p-6">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${
                          p.norma.id === 'iso9001' ? 'bg-acento' : p.norma.id === 'iso14001' ? 'bg-verde' : 'bg-ambar'}`} />
                        <p className="text-[14px] font-semibold">{p.norma.nome}</p>
                      </div>
                      <p className="mt-4 text-[34px] font-semibold tabular-nums leading-none">{p.taxa}%</p>
                      <p className="mt-2 text-[12px] tabular-nums text-texto3">
                        {p.avaliadas} verificações · {p.ncs} NC
                      </p>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-pill bg-texto/[.08]">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${p.taxa}%` }}
                          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                          className={`h-full rounded-pill ${barra(p.taxa)}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {evolucao.length > 1 && (
              <section>
                <h2 className="mb-5 text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">Evolução da conformidade</h2>
                <GraficoLinha dados={evolucao} />
              </section>
            )}

            <section className="grid gap-12 sm:grid-cols-2">
              <div>
                <h2 className="mb-5 text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">NC por setor</h2>
                <GraficoBarras dados={ncPorSetor} cor="rgb(var(--vermelho))" altura={180} />
              </div>
              <div>
                <h2 className="mb-5 text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">NC por auditor</h2>
                <GraficoBarras dados={ncPorAuditor} cor="rgb(var(--acento))" altura={180} />
              </div>
            </section>

            {conformidadePorSetor.length > 0 && (
              <section>
                <h2 className="mb-5 text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">Conformidade média por setor</h2>
                <ul className="space-y-4">
                  {conformidadePorSetor.map((s) => (
                    <li key={s.setor}>
                      <div className="mb-1.5 flex items-baseline justify-between text-[13.5px]">
                        <span className="truncate text-texto2">{s.setor}</span>
                        <span className="ml-3 shrink-0 font-semibold tabular-nums">
                          {s.media}% <span className="font-normal text-texto3">· {s.quantidade}</span>
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-pill bg-texto/[.08]">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${s.media}%` }}
                          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                          className={`h-full rounded-pill ${barra(s.media)}`}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </main>
    </>
  );
}

function Numero({ valor, rotulo, tom = 'text-texto' }: { valor: string; rotulo: string; tom?: string }) {
  return (
    <div>
      <p className={`text-[28px] font-semibold tabular-nums leading-none ${tom}`}>{valor}</p>
      <p className="mt-2 text-[12px] leading-snug text-texto3">{rotulo}</p>
    </div>
  );
}
