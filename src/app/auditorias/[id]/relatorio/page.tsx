'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navegacao from '@/components/Navegacao';
import SeloNorma from '@/components/SeloNorma';
import { Anel, Botao } from '@/components/ui';
import { IconeImprimir, IconeVoltar } from '@/components/Icones';
import { roteiroDoSetor } from '@/dados/montagem-roteiro';
import { setorPorId } from '@/dados/setores';
import { clausulas, NORMAS, type NormaId } from '@/dados/sgi';
import type { Auditoria } from '@/lib/tipos';
import {
  contarPorResposta, formatarData, formatarDataHora, formatarDuracao,
  obterAuditoria, progressoGeral, taxaConformidade
} from '@/lib/armazenamento';
import { useApp } from '@/app/provedores';

const ROTULOS: Record<string, string> = {
  conforme: 'Conforme', nao_conforme: 'Não conforme', observacao: 'Observação', nao_aplicavel: 'Não aplicável'
};
const TONS: Record<string, string> = {
  conforme: 'bg-verde/15 text-verde',
  nao_conforme: 'bg-vermelho/15 text-vermelho',
  observacao: 'bg-ambar/15 text-ambar',
  nao_aplicavel: 'bg-texto/[.07] text-texto3'
};

export default function Relatorio() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useApp();
  const [auditoria, setAuditoria] = useState<Auditoria | null>(null);

  useEffect(() => { setAuditoria(obterAuditoria(id) ?? null); }, [id]);

  if (!usuario) return <Navegacao />;
  if (!auditoria) {
    return (
      <>
        <Navegacao />
        <main className="mx-auto max-w-conteudo px-6 py-24 text-center">
          <h1 className="text-[24px] font-semibold">Relatório não encontrado</h1>
          <Link href="/painel" className="mt-6 inline-block"><Botao variante="primario">Voltar ao painel</Botao></Link>
        </main>
      </>
    );
  }

  const setor = setorPorId(auditoria.setor);
  const blocos = roteiroDoSetor(auditoria.setor);
  const taxa = taxaConformidade(auditoria);
  const contagem = contarPorResposta(auditoria);
  const prog = progressoGeral(auditoria);
  const anexos = Object.values(auditoria.verificacoes).flatMap((v) => v.anexos);
  const normas = NORMAS.filter((n) => auditoria.normas.includes(n.id));

  /* Conformidade por norma: cada verificação conta para todas as normas que atende. */
  const porNorma = normas.map((n) => {
    let avaliadas = 0, conformes = 0, ncs = 0;
    blocos.forEach((b) => b.itens.forEach((item) => {
      const cobre = clausulas(item.chavesClausulas).some((c) => c.norma === n.id);
      const v = auditoria.verificacoes[item.id];
      if (!cobre || !v?.resposta || v.resposta === 'nao_aplicavel') return;
      avaliadas++;
      if (v.resposta === 'conforme') conformes++;
      if (v.resposta === 'nao_conforme') ncs++;
    }));
    return { norma: n, avaliadas, conformes, ncs, taxa: avaliadas ? Math.round((conformes / avaliadas) * 100) : 0 };
  });

  const corTaxa = (t: number) => (t >= 85 ? 'rgb(var(--verde))' : t >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))');

  return (
    <>
      <Navegacao />

      <div className="mx-auto max-w-[900px] px-6 py-8 sm:px-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 nao-imprimir">
          <Link href={`/auditorias/${auditoria.id}`} className="inline-flex items-center gap-1.5 text-[13px] text-texto3 transition-colors hover:text-texto">
            <IconeVoltar tamanho={15} />Voltar à auditoria
          </Link>
          <Botao variante="primario" onClick={() => window.print()}>
            <IconeImprimir tamanho={16} />Gerar PDF
          </Botao>
        </div>

        <article className="rounded-xl2 border bg-superficie p-9 shadow-nivel1 sm:p-12">
          <header className="border-b pb-9 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-acento">
              Relatório de auditoria do SGI
            </p>
            <h1 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-.03em]">
              {setor?.nome ?? auditoria.setor}
            </h1>
            <p className="mt-2 text-[16px] text-texto2">{auditoria.empresa}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="etiqueta bg-acento/12 text-acento">{auditoria.codigo}</span>
              {normas.map((n) => (
                <span key={n.id} className={`etiqueta ${
                  n.id === 'iso9001' ? 'bg-acento/12 text-acento'
                  : n.id === 'iso14001' ? 'bg-verde/15 text-verde' : 'bg-ambar/15 text-ambar'}`}>
                  {n.nome}:{n.ano}
                </span>
              ))}
              <span className="etiqueta bg-texto/[.07] text-texto2">{formatarData(auditoria.data)}</span>
            </div>
          </header>

          <Secao numero="1" titulo="Dados da auditoria">
            <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              <Dado rotulo="Empresa / unidade" valor={auditoria.empresa} />
              <Dado rotulo="Setor" valor={setor?.nome ?? auditoria.setor} />
              <Dado rotulo="Auditor" valor={auditoria.auditor} />
              <Dado rotulo="Auditado" valor={auditoria.auditado || '—'} />
              <Dado rotulo="Data" valor={formatarData(auditoria.data)} />
              <Dado rotulo="Duração" valor={formatarDuracao(auditoria.tempoTotalMin)} />
            </dl>
            <div className="mt-6 space-y-3">
              <Bloco rotulo="Escopo" texto={auditoria.escopo} />
              <Bloco rotulo="Objetivo" texto={auditoria.objetivo} />
              <Bloco rotulo="Critério" texto={auditoria.criterio} />
            </div>
          </Secao>

          <Secao numero="2" titulo="Resultados">
            <div className="flex flex-wrap items-center gap-10">
              <Anel valor={taxa} tamanho={128} espessura={11} cor={corTaxa(taxa)}>
                <div>
                  <p className="text-[28px] font-semibold tabular-nums leading-none">{taxa}%</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-texto3">conforme</p>
                </div>
              </Anel>
              <div className="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-4">
                <Metrica rotulo="Verificações" valor={prog.respondidos} />
                <Metrica rotulo="Conformes" valor={contagem.conforme} tom="text-verde" />
                <Metrica rotulo="Não conformes" valor={contagem.nao_conforme} tom="text-vermelho" />
                <Metrica rotulo="Observações" valor={contagem.observacao} tom="text-ambar" />
              </div>
            </div>

            <h3 className="mb-4 mt-9 text-[15px] font-semibold">Desempenho por norma</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {porNorma.map((p) => (
                <div key={p.norma.id} className="rounded-xl border p-4">
                  <p className="text-[13px] font-semibold">{p.norma.nome}</p>
                  <p className="mt-0.5 text-[11.5px] text-texto3">{p.norma.foco}</p>
                  <p className="mt-3 text-[26px] font-semibold tabular-nums leading-none">{p.taxa}%</p>
                  <p className="mt-1.5 text-[11.5px] tabular-nums text-texto3">
                    {p.avaliadas} avaliadas · {p.ncs} NC
                  </p>
                </div>
              ))}
            </div>

            <table className="mt-9 w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b text-left text-texto3">
                  <th className="py-2 font-medium">Bloco</th>
                  <th className="py-2 text-center font-medium">Itens</th>
                  <th className="py-2 text-center font-medium">C</th>
                  <th className="py-2 text-center font-medium">NC</th>
                  <th className="py-2 text-center font-medium">Obs.</th>
                  <th className="py-2 text-center font-medium">N/A</th>
                </tr>
              </thead>
              <tbody>
                {blocos.map((b) => {
                  const vs = b.itens.map((i) => auditoria.verificacoes[i.id]).filter(Boolean);
                  const c = (r: string) => vs.filter((v) => v!.resposta === r).length;
                  return (
                    <tr key={b.id} className="border-b">
                      <td className="py-2.5 pr-3">{b.titulo}</td>
                      <td className="py-2.5 text-center tabular-nums">{vs.length}</td>
                      <td className="py-2.5 text-center tabular-nums text-verde">{c('conforme')}</td>
                      <td className="py-2.5 text-center tabular-nums text-vermelho">{c('nao_conforme')}</td>
                      <td className="py-2.5 text-center tabular-nums text-ambar">{c('observacao')}</td>
                      <td className="py-2.5 text-center tabular-nums text-texto3">{c('nao_aplicavel')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Secao>

          <Secao numero="3" titulo="Roteiro verificado" quebra>
            <div className="space-y-8">
              {blocos.map((b) => {
                const feitos = b.itens.map((i) => ({ i, v: auditoria.verificacoes[i.id] })).filter((x) => x.v?.resposta);
                if (!feitos.length) return null;
                return (
                  <div key={b.id}>
                    <h3 className="mb-3 text-[15px] font-semibold">{b.titulo}</h3>
                    <div className="space-y-2.5">
                      {feitos.map(({ i, v }) => (
                        <div key={i.id} className="rounded-xl border p-4">
                          <div className="mb-2 flex flex-wrap items-center gap-1.5">
                            {clausulas(i.chavesClausulas).map((c) => <SeloNorma key={c.chave} clausula={c} />)}
                            <span className={`etiqueta ${TONS[v!.resposta!]}`}>{ROTULOS[v!.resposta!]}</span>
                          </div>
                          <p className="text-[14px] font-medium leading-snug">{i.titulo}</p>
                          {v!.evidencia && (
                            <p className="mt-2 text-[13px] leading-relaxed text-texto2">
                              <strong className="font-medium">Evidência: </strong>{v!.evidencia}
                            </p>
                          )}
                          {v!.comentario && (
                            <p className="mt-1.5 text-[13px] leading-relaxed text-texto3">{v!.comentario}</p>
                          )}
                          {v!.anexos.length > 0 && (
                            <p className="mt-1.5 text-[11.5px] text-texto3">{v!.anexos.length} anexo(s)</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Secao>

          <Secao numero="4" titulo="Não conformidades" quebra>
            {auditoria.naoConformidades.length === 0 ? (
              <p className="text-[14px] text-texto2">Não foram identificadas não conformidades nesta auditoria.</p>
            ) : (
              <div className="space-y-4">
                {auditoria.naoConformidades.map((nc, i) => (
                  <div key={nc.id} className="rounded-xl2 border p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                      <span className={`etiqueta ${
                        nc.classificacao === 'maior' ? 'bg-vermelho/15 text-vermelho'
                        : nc.classificacao === 'menor' ? 'bg-ambar/15 text-ambar' : 'bg-acento/12 text-acento'}`}>
                        NC {String(i + 1).padStart(2, '0')} · {nc.classificacao === 'observacao' ? 'Observação' : nc.classificacao === 'maior' ? 'Maior' : 'Menor'}
                      </span>
                      {clausulas(nc.chavesClausulas).map((c) => <SeloNorma key={c.chave} clausula={c} />)}
                    </div>
                    <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-texto">{nc.descricao}</p>
                    {nc.evidenciaObjetiva && (
                      <p className="mt-3 text-[13px] text-texto2">
                        <strong className="font-medium">Evidência objetiva: </strong>{nc.evidenciaObjetiva}
                      </p>
                    )}
                    <p className="mt-1.5 text-[13px] text-texto2">
                      <strong className="font-medium">Requisito descumprido: </strong>{nc.requisitoDescumprido}
                    </p>
                    {nc.causaRaiz && (
                      <p className="mt-1.5 text-[13px] text-texto2"><strong className="font-medium">Causa raiz: </strong>{nc.causaRaiz}</p>
                    )}
                    {nc.plano?.oQue && (
                      <div className="mt-4 rounded-xl bg-afundado/60 p-4">
                        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-texto3">Plano de ação · 5W2H</p>
                        <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                          <Dado rotulo="O quê" valor={nc.plano.oQue} />
                          <Dado rotulo="Por quê" valor={nc.plano.porQue} />
                          <Dado rotulo="Onde" valor={nc.plano.onde} />
                          <Dado rotulo="Quando" valor={nc.plano.quando ? formatarData(nc.plano.quando) : '—'} />
                          <Dado rotulo="Quem" valor={nc.plano.quem} />
                          <Dado rotulo="Quanto" valor={nc.plano.quanto || '—'} />
                        </dl>
                        <p className="mt-2.5 text-[13px] text-texto2"><strong className="font-medium">Como: </strong>{nc.plano.como}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Secao>

          <Secao numero="5" titulo="Evidências anexadas" quebra>
            {anexos.length === 0 ? (
              <p className="text-[14px] text-texto2">Nenhum anexo registrado.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {anexos.map((a) => (
                  <figure key={a.id} className="overflow-hidden rounded-xl border">
                    {a.dataUrl && a.tipo.startsWith('image/') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.dataUrl} alt={a.nome} className="h-28 w-full object-cover" />
                    ) : (
                      <div className="grid h-28 place-items-center bg-afundado text-[11px] text-texto3">{a.tipo}</div>
                    )}
                    <figcaption className="truncate px-2.5 py-2 text-[11px] text-texto3">{a.nome}</figcaption>
                  </figure>
                ))}
              </div>
            )}
          </Secao>

          <Secao numero="6" titulo="Conclusão">
            <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-texto2">
              {auditoria.observacoesFinais || 'Conclusão não registrada.'}
            </p>
          </Secao>

          <Secao numero="7" titulo="Assinaturas">
            {auditoria.assinaturas.length === 0 ? (
              <p className="text-[14px] text-texto2">Nenhuma assinatura registrada.</p>
            ) : (
              <div className="grid gap-9 pt-8 sm:grid-cols-2">
                {auditoria.assinaturas.map((a, i) => (
                  <div key={i} className="border-t pt-3 text-center">
                    <p className="text-[14px] font-medium">{a.nome}</p>
                    <p className="text-[12.5px] text-texto3">{a.cargo}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-texto3">
                      {a.papel === 'auditor' ? 'Auditor' : a.papel === 'auditado' ? 'Auditado' : 'Responsável'} · {formatarDataHora(a.dataHora)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Secao>

          <footer className="mt-10 border-t pt-6 text-center text-[11.5px] text-texto3">
            Emitido em {formatarDataHora(new Date().toISOString())} · {auditoria.codigo}
          </footer>
        </article>
      </div>
    </>
  );
}

function Secao({ numero, titulo, children, quebra = false }: { numero: string; titulo: string; children: React.ReactNode; quebra?: boolean }) {
  return (
    <section className={`mt-11 ${quebra ? 'quebra-pagina' : ''}`}>
      <h2 className="mb-5 flex items-baseline gap-3 text-[20px] font-semibold tracking-[-.02em]">
        <span className="text-[13px] tabular-nums text-acento">{numero}</span>{titulo}
      </h2>
      {children}
    </section>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-texto3">{rotulo}</dt>
      <dd className="mt-0.5 text-[14px] leading-snug text-texto">{valor || '—'}</dd>
    </div>
  );
}

function Bloco({ rotulo, texto }: { rotulo: string; texto: string }) {
  return (
    <div className="rounded-xl bg-afundado/60 p-4">
      <p className="mb-1 text-[11px] uppercase tracking-wide text-texto3">{rotulo}</p>
      <p className="text-[13.5px] leading-relaxed text-texto2">{texto || '—'}</p>
    </div>
  );
}

function Metrica({ rotulo, valor, tom = 'text-texto' }: { rotulo: string; valor: number; tom?: string }) {
  return (
    <div>
      <p className={`text-[26px] font-semibold tabular-nums leading-none ${tom}`}>{valor}</p>
      <p className="mt-1.5 text-[11.5px] text-texto3">{rotulo}</p>
    </div>
  );
}
