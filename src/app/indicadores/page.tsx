'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import { Anel, Cartao, Etiqueta, Vazio } from '@/components/ui';
import { GraficoBarras, GraficoLinha, GraficoRosca } from '@/components/Graficos';
import { NORMAS, SETORES, nomeNorma, setorPorId } from '@/dados/normas';
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

  const ncPorSetor = useMemo(() =>
    SETORES.map((s) => ({
      rotulo: s.nome.split(' ')[0],
      valor: auditorias.filter((a) => a.setor === s.id).reduce((n, a) => n + a.naoConformidades.length, 0)
    })).filter((x) => x.valor > 0).sort((a, b) => b.valor - a.valor).slice(0, 6)
  , [auditorias]);

  const ncPorAuditor = useMemo(() => {
    const mapa = new Map<string, number>();
    auditorias.forEach((a) => {
      if (!a.auditor) return;
      mapa.set(a.auditor, (mapa.get(a.auditor) ?? 0) + a.naoConformidades.length);
    });
    return [...mapa.entries()]
      .map(([rotulo, valor]) => ({ rotulo: rotulo.split(' ')[0], valor }))
      .sort((a, b) => b.valor - a.valor).slice(0, 6);
  }, [auditorias]);

  const porNorma = useMemo(() => {
    const cores = ['rgb(var(--acento))', 'rgb(var(--verde))', 'rgb(var(--ambar))', 'rgb(var(--roxo))', 'rgb(var(--vermelho))', 'rgb(var(--texto-3))'];
    return NORMAS
      .map((n, i) => ({ rotulo: n.nome, cor: cores[i % cores.length], valor: auditorias.filter((a) => a.norma === n.id).length }))
      .filter((x) => x.valor > 0);
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
      const doSetor = auditorias.filter((a) => a.setor === s.id && Object.keys(a.itens).length);
      if (!doSetor.length) return null;
      const media = Math.round(doSetor.reduce((n, a) => n + taxaConformidade(a), 0) / doSetor.length);
      return { setor: s.nome, media, quantidade: doSetor.length };
    }).filter(Boolean).sort((a, b) => b!.media - a!.media) as { setor: string; media: number; quantidade: number }[]
  , [auditorias]);

  if (!usuario) return <Navegacao />;

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-conteudo px-5 py-9 sm:px-7">
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-[32px] font-semibold tracking-[-.03em] sm:text-[38px]">Indicadores</h1>
          <p className="mt-1.5 text-[15px] text-texto3">Desempenho consolidado das auditorias realizadas.</p>
        </motion.header>

        {auditorias.length === 0 ? (
          <Vazio titulo="Sem dados ainda" descricao="Os indicadores aparecem assim que a primeira auditoria for registrada." />
        ) : (
          <div className="space-y-5">
            <section className="grid gap-5 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.6fr)]">
              <Cartao animar className="flex flex-col items-center justify-center gap-4 text-center">
                <Anel valor={m.taxaConformidade} tamanho={150} espessura={13}
                      cor={m.taxaConformidade >= 85 ? 'rgb(var(--verde))' : m.taxaConformidade >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))'}>
                  <div>
                    <p className="text-[34px] font-semibold tabular-nums leading-none">{m.taxaConformidade}%</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-texto3">conforme</p>
                  </div>
                </Anel>
                <div className="grid w-full grid-cols-3 gap-2 border-t pt-4">
                  <Mini rotulo="Auditorias" valor={String(m.total)} />
                  <Mini rotulo="NC totais" valor={String(m.totalNC)} />
                  <Mini rotulo="Tempo médio" valor={formatarDuracao(m.tempoMedioMin)} />
                </div>
              </Cartao>

              <Cartao animar atraso={0.06}>
                <div className="mb-5 flex items-baseline justify-between">
                  <h3 className="text-[16px] font-semibold">Evolução da conformidade</h3>
                  <Etiqueta tom="neutro">últimos meses</Etiqueta>
                </div>
                <GraficoLinha dados={evolucao} />
              </Cartao>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <Cartao animar atraso={0.1}>
                <h3 className="mb-5 text-[16px] font-semibold">Não conformidades por setor</h3>
                <GraficoBarras dados={ncPorSetor} cor="rgb(var(--vermelho))" />
              </Cartao>
              <Cartao animar atraso={0.14}>
                <h3 className="mb-5 text-[16px] font-semibold">Não conformidades por auditor</h3>
                <GraficoBarras dados={ncPorAuditor} cor="rgb(var(--acento))" />
              </Cartao>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <Cartao animar atraso={0.18}>
                <h3 className="mb-5 text-[16px] font-semibold">Auditorias por norma</h3>
                <GraficoRosca dados={porNorma} tamanho={170} />
              </Cartao>

              <Cartao animar atraso={0.22}>
                <h3 className="mb-4 text-[16px] font-semibold">Conformidade média por setor</h3>
                {conformidadePorSetor.length === 0 ? (
                  <p className="py-8 text-center text-[13.5px] text-texto3">Sem itens avaliados ainda.</p>
                ) : (
                  <ul className="space-y-3">
                    {conformidadePorSetor.map((s) => (
                      <li key={s.setor}>
                        <div className="mb-1 flex items-baseline justify-between text-[13px]">
                          <span className="truncate text-texto2">{s.setor}</span>
                          <span className="ml-3 shrink-0 font-semibold tabular-nums">
                            {s.media}% <span className="font-normal text-texto3">· {s.quantidade}</span>
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-pill bg-texto/[.08]">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${s.media}%` }}
                            transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                            className={`h-full rounded-pill ${s.media >= 85 ? 'bg-verde' : s.media >= 60 ? 'bg-ambar' : 'bg-vermelho'}`}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Cartao>
            </section>

            <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
              <Painel rotulo="Concluídas" valor={m.concluidas} />
              <Painel rotulo="Em andamento" valor={m.emAndamento} />
              <Painel rotulo="Pendentes" valor={m.pendentes} />
              <Painel rotulo="Itens avaliados" valor={m.itensRespondidos} />
            </section>
          </div>
        )}
      </main>
    </>
  );
}

function Mini({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="text-center">
      <p className="text-[16px] font-semibold tabular-nums leading-tight">{valor}</p>
      <p className="text-[11px] text-texto3">{rotulo}</p>
    </div>
  );
}

function Painel({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div className="cartao p-5">
      <p className="text-[28px] font-semibold tabular-nums leading-none">{valor}</p>
      <p className="mt-1.5 text-[13px] text-texto2">{rotulo}</p>
    </div>
  );
}
