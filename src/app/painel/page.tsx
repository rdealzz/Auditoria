'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import { Anel, Barra, Botao, Cartao, Etiqueta, Vazio } from '@/components/ui';
import { GraficoBarras, GraficoRosca } from '@/components/Graficos';
import { IconeAlerta, IconeCheck, IconeDoc, IconeMais, IconeRelogio, IconeSeta } from '@/components/Icones';
import {
  calcularMetricas, formatarDataHora, formatarDuracao, listarAuditorias, progressoGeral
} from '@/lib/armazenamento';
import type { Auditoria, Metricas } from '@/lib/tipos';
import { ETAPAS } from '@/dados/etapas';
import { nomeNorma, setorPorId } from '@/dados/normas';
import { useApp } from '../provedores';

export default function Painel() {
  const { usuario } = useApp();
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [metricas, setMetricas] = useState<Metricas | null>(null);

  useEffect(() => {
    const carregar = () => {
      const lista = listarAuditorias();
      setAuditorias(lista);
      setMetricas(calcularMetricas(lista));
    };
    carregar();
    window.addEventListener('auditoria:alterado', carregar);
    return () => window.removeEventListener('auditoria:alterado', carregar);
  }, []);

  if (!usuario || !metricas) return <Navegacao />;

  const emAndamento = auditorias.filter((a) => a.status === 'em_andamento' || a.status === 'rascunho');
  const concluidas = auditorias.filter((a) => a.status === 'concluida');

  const ncPorEtapa = ETAPAS.map((e) => ({
    rotulo: String(e.numero),
    valor: auditorias.reduce((n, a) => n + a.naoConformidades.filter((nc) => nc.etapa === e.numero).length, 0)
  }));

  const distribuicao = [
    { rotulo: 'Conforme', cor: 'rgb(var(--verde))', valor: contar(auditorias, 'conforme') },
    { rotulo: 'Não conforme', cor: 'rgb(var(--vermelho))', valor: contar(auditorias, 'nao_conforme') },
    { rotulo: 'Observação', cor: 'rgb(var(--ambar))', valor: contar(auditorias, 'observacao') },
    { rotulo: 'Não aplicável', cor: 'rgb(var(--texto-3))', valor: contar(auditorias, 'nao_aplicavel') }
  ];

  const acoes = auditorias
    .flatMap((a) => a.naoConformidades.map((nc) => ({ nc, auditoria: a })))
    .sort((x, y) => new Date(y.nc.criadaEm).getTime() - new Date(x.nc.criadaEm).getTime())
    .slice(0, 5);

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-conteudo px-5 py-9 sm:px-7">
        <motion.header
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-[13px] text-texto3">{saudacao()}, {usuario.nome.split(' ')[0]}</p>
            <h1 className="mt-1 text-[32px] font-semibold tracking-[-.03em] sm:text-[38px]">Painel</h1>
          </div>
          <Link href="/auditorias/nova">
            <Botao variante="primario" tamanho="m"><IconeMais tamanho={17} />Nova auditoria</Botao>
          </Link>
        </motion.header>

        <section className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
          <Kpi indice={0} rotulo="Em andamento" valor={metricas.emAndamento} detalhe="auditorias ativas" tom="acento" Icone={IconeDoc} />
          <Kpi indice={1} rotulo="Concluídas" valor={metricas.concluidas} detalhe="com relatório emitido" tom="verde" Icone={IconeCheck} />
          <Kpi indice={2} rotulo="Pendentes" valor={metricas.pendentes} detalhe="rascunhos não iniciados" tom="ambar" Icone={IconeRelogio} />
          <Kpi indice={3} rotulo="Não conformidades" valor={metricas.totalNC} detalhe="registradas no período" tom="vermelho" Icone={IconeAlerta} />
        </section>

        <section className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <Cartao animar atraso={0.15} className="flex flex-col items-center justify-center gap-4 text-center">
            <Anel valor={metricas.taxaConformidade} tamanho={150} espessura={13}
                  cor={metricas.taxaConformidade >= 85 ? 'rgb(var(--verde))' : metricas.taxaConformidade >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))'}>
              <div>
                <p className="text-[34px] font-semibold tabular-nums leading-none">{metricas.taxaConformidade}%</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-texto3">conforme</p>
              </div>
            </Anel>
            <div>
              <h3 className="text-[16px] font-semibold">Taxa de conformidade</h3>
              <p className="mt-1 text-[13px] text-texto3">
                {metricas.itensRespondidos} itens avaliados · tempo médio {formatarDuracao(metricas.tempoMedioMin)}
              </p>
            </div>
          </Cartao>

          <Cartao animar atraso={0.2}>
            <div className="mb-5 flex items-baseline justify-between">
              <h3 className="text-[16px] font-semibold">Distribuição das constatações</h3>
              <Etiqueta tom="neutro">todas as auditorias</Etiqueta>
            </div>
            <GraficoRosca dados={distribuicao} />
          </Cartao>
        </section>

        <Cartao animar atraso={0.25} className="mb-6">
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="text-[16px] font-semibold">Não conformidades por etapa</h3>
            <Etiqueta tom="neutro">1 a 10</Etiqueta>
          </div>
          <GraficoBarras dados={ncPorEtapa} cor="rgb(var(--vermelho))" altura={170} />
          <p className="mt-3 text-[12px] text-texto3">
            As etapas com mais constatações indicam onde concentrar treinamento e ações de melhoria.
          </p>
        </Cartao>

        <section className="mb-6">
          <div className="mb-3.5 flex items-baseline justify-between">
            <h2 className="text-[21px] font-semibold tracking-[-.02em]">Auditorias em andamento</h2>
            <Link href="/historico" className="text-[13px] text-acento hover:underline">Ver histórico</Link>
          </div>

          {emAndamento.length === 0 ? (
            <Vazio
              titulo="Nenhuma auditoria em andamento"
              descricao="Crie uma auditoria e o sistema conduz você pelas dez etapas, explicando o que verificar em cada uma."
              acao={<Link href="/auditorias/nova"><Botao variante="primario"><IconeMais tamanho={16} />Criar primeira auditoria</Botao></Link>}
            />
          ) : (
            <div className="grid gap-3.5 md:grid-cols-2">
              {emAndamento.slice(0, 4).map((a, i) => <CartaoAuditoria key={a.id} auditoria={a} indice={i} />)}
            </div>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Cartao animar atraso={0.1}>
            <h3 className="mb-4 text-[16px] font-semibold">Últimos relatórios</h3>
            {concluidas.length === 0 ? (
              <p className="py-6 text-center text-[13.5px] text-texto3">Nenhum relatório emitido ainda.</p>
            ) : (
              <ul className="divide-y">
                {concluidas.slice(0, 5).map((a) => (
                  <li key={a.id}>
                    <Link href={`/auditorias/${a.id}/relatorio`} className="flex items-center gap-3 py-3 transition-colors hover:bg-texto/[.03]">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-verde/12 text-verde"><IconeDoc tamanho={17} /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-medium">{a.codigo} · {setorPorId(a.setor)?.nome}</span>
                        <span className="block truncate text-[12px] text-texto3">
                          {a.empresa || 'Sem empresa'} · {a.concluidaEm ? formatarDataHora(a.concluidaEm) : '—'}
                        </span>
                      </span>
                      <IconeSeta tamanho={16} className="shrink-0 text-texto3" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>

          <Cartao animar atraso={0.15}>
            <h3 className="mb-4 text-[16px] font-semibold">Últimas ações</h3>
            {acoes.length === 0 ? (
              <p className="py-6 text-center text-[13.5px] text-texto3">Nenhuma não conformidade registrada ainda.</p>
            ) : (
              <ul className="space-y-3">
                {acoes.map(({ nc, auditoria }) => (
                  <li key={nc.id} className="flex gap-3">
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl
                      ${nc.classificacao === 'maior' ? 'bg-vermelho/12 text-vermelho' : nc.classificacao === 'menor' ? 'bg-ambar/15 text-ambar' : 'bg-acento/12 text-acento'}`}>
                      <IconeAlerta tamanho={15} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-medium">{nc.descricao || 'Constatação sem descrição'}</p>
                      <p className="mt-0.5 truncate text-[11.5px] text-texto3">
                        {auditoria.codigo} · Etapa {nc.etapa} · Cláusula {nc.clausula}
                        {nc.plano?.quando ? ` · prazo ${nc.plano.quando}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Cartao>
        </section>
      </main>
    </>
  );
}

function contar(auditorias: Auditoria[], resposta: string) {
  return auditorias.reduce((n, a) => n + Object.values(a.itens).filter((i) => i.resposta === resposta).length, 0);
}

function saudacao() {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
}

function Kpi({
  rotulo, valor, detalhe, tom, Icone, indice
}: { rotulo: string; valor: number; detalhe: string; tom: 'acento' | 'verde' | 'ambar' | 'vermelho'; Icone: React.ComponentType<{ tamanho?: number }>; indice: number }) {
  const cores = {
    acento: 'bg-acento/12 text-acento', verde: 'bg-verde/15 text-verde',
    ambar: 'bg-ambar/15 text-ambar', vermelho: 'bg-vermelho/15 text-vermelho'
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: indice * 0.06, ease: [0.32, 0.72, 0, 1] }}
      className="cartao p-5"
    >
      <span className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${cores[tom]}`}><Icone tamanho={17} /></span>
      <p className="text-[30px] font-semibold tabular-nums leading-none tracking-[-.02em]">{valor}</p>
      <p className="mt-1.5 text-[13.5px] font-medium text-texto">{rotulo}</p>
      <p className="mt-0.5 text-[11.5px] text-texto3">{detalhe}</p>
    </motion.div>
  );
}

function CartaoAuditoria({ auditoria, indice }: { auditoria: Auditoria; indice: number }) {
  const p = progressoGeral(auditoria);
  const setor = setorPorId(auditoria.setor);
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: indice * 0.06, ease: [0.32, 0.72, 0, 1] }}
      className="min-w-0"
    >
      <Link href={`/auditorias/${auditoria.id}`}
        className="group block min-w-0 cartao p-5 transition-all duration-300 ease-apple hover:-translate-y-1 hover:shadow-nivel2">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[15.5px] font-semibold">{setor?.nome ?? auditoria.setor}</p>
            <p className="mt-0.5 truncate text-[12.5px] text-texto3">
              {auditoria.codigo} · {nomeNorma(auditoria.norma)} · {auditoria.empresa || 'Sem empresa'}
            </p>
          </div>
          <Etiqueta tom={auditoria.status === 'rascunho' ? 'ambar' : 'acento'}>
            {auditoria.status === 'rascunho' ? 'Pendente' : 'Em andamento'}
          </Etiqueta>
        </div>
        <div className="mb-2 flex items-baseline justify-between text-[12px]">
          <span className="text-texto3">Etapa {auditoria.etapaAtual} de 10</span>
          <span className="font-semibold tabular-nums text-texto2">{p.percentual}%</span>
        </div>
        <Barra valor={p.percentual} />
        <p className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-acento">
          Continuar <IconeSeta tamanho={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </p>
      </Link>
    </motion.div>
  );
}
