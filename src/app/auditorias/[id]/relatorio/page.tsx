'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navegacao from '@/components/Navegacao';
import { Anel, Botao, Etiqueta } from '@/components/ui';
import { IconeImprimir, IconeVoltar } from '@/components/Icones';
import { ETAPAS } from '@/dados/etapas';
import { nomeNorma, setorPorId } from '@/dados/normas';
import type { Auditoria } from '@/lib/tipos';
import {
  contarPorResposta, formatarData, formatarDataHora, formatarDuracao, obterAuditoria, progressoGeral, taxaConformidade
} from '@/lib/armazenamento';
import { useApp } from '@/app/provedores';

const ROTULOS: Record<string, string> = {
  conforme: 'Conforme', nao_conforme: 'Não conforme', observacao: 'Observação', nao_aplicavel: 'Não aplicável'
};
const TONS: Record<string, 'verde' | 'vermelho' | 'ambar' | 'neutro'> = {
  conforme: 'verde', nao_conforme: 'vermelho', observacao: 'ambar', nao_aplicavel: 'neutro'
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
        <main className="mx-auto max-w-conteudo px-5 py-20 text-center">
          <h1 className="text-[24px] font-semibold">Relatório não encontrado</h1>
          <Link href="/painel" className="mt-5 inline-block"><Botao variante="primario">Voltar ao painel</Botao></Link>
        </main>
      </>
    );
  }

  const setor = setorPorId(auditoria.setor);
  const taxa = taxaConformidade(auditoria);
  const contagem = contarPorResposta(auditoria);
  const prog = progressoGeral(auditoria);
  const anexos = Object.values(auditoria.itens).flatMap((i) => i.anexos);

  return (
    <>
      <Navegacao />

      <div className="mx-auto max-w-[900px] px-5 py-8 sm:px-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 nao-imprimir">
          <Link href={`/auditorias/${auditoria.id}`} className="inline-flex items-center gap-1.5 text-[13px] text-texto3 hover:text-texto">
            <IconeVoltar tamanho={15} />Voltar à auditoria
          </Link>
          <Botao variante="primario" onClick={() => window.print()}>
            <IconeImprimir tamanho={16} />Gerar PDF
          </Botao>
        </div>

        <article className="cartao space-y-10 p-8 sm:p-11">
          {/* Capa */}
          <header className="border-b pb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-acento">Relatório de auditoria</p>
            <h1 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-.03em]">
              {setor?.nome ?? auditoria.setor}
            </h1>
            <p className="mt-1.5 text-[16px] text-texto2">{auditoria.empresa}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Etiqueta tom="acento">{auditoria.codigo}</Etiqueta>
              <Etiqueta tom="neutro">{nomeNorma(auditoria.norma)}</Etiqueta>
              <Etiqueta tom="neutro">{formatarData(auditoria.data)}</Etiqueta>
              <Etiqueta tom={auditoria.status === 'concluida' ? 'verde' : 'ambar'}>
                {auditoria.status === 'concluida' ? 'Concluída' : 'Em andamento'}
              </Etiqueta>
            </div>
          </header>

          {/* Sumário */}
          <section>
            <Titulo numero="1">Sumário</Titulo>
            <ol className="grid gap-1.5 text-[14px] text-texto2 sm:grid-cols-2">
              {['Dados da auditoria', 'Resultados e indicadores', 'Checklist completo', 'Não conformidades',
                'Planos de ação', 'Evidências anexadas', 'Conclusão', 'Assinaturas'].map((t, i) => (
                <li key={t} className="flex gap-2"><span className="tabular-nums text-texto3">{i + 2}.</span>{t}</li>
              ))}
            </ol>
          </section>

          {/* Dados */}
          <section>
            <Titulo numero="2">Dados da auditoria</Titulo>
            <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              <Dado rotulo="Empresa" valor={auditoria.empresa} />
              <Dado rotulo="Setor" valor={setor?.nome ?? auditoria.setor} />
              <Dado rotulo="Processo" valor={auditoria.processo || '—'} />
              <Dado rotulo="Norma" valor={nomeNorma(auditoria.norma)} />
              <Dado rotulo="Auditor" valor={auditoria.auditor} />
              <Dado rotulo="Auditado" valor={auditoria.auditado} />
              <Dado rotulo="Data" valor={formatarData(auditoria.data)} />
              <Dado rotulo="Duração" valor={formatarDuracao(auditoria.tempoTotalMin)} />
            </dl>
            <div className="mt-5 space-y-4">
              <Bloco rotulo="Escopo" texto={auditoria.escopo} />
              <Bloco rotulo="Objetivo" texto={auditoria.objetivo} />
              <Bloco rotulo="Critério da auditoria" texto={auditoria.criterio} />
            </div>
          </section>

          {/* Resultados */}
          <section>
            <Titulo numero="3">Resultados e indicadores</Titulo>
            <div className="flex flex-wrap items-center gap-8">
              <Anel valor={taxa} tamanho={124} espessura={11}
                    cor={taxa >= 85 ? 'rgb(var(--verde))' : taxa >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))'}>
                <div>
                  <p className="text-[27px] font-semibold tabular-nums leading-none">{taxa}%</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wide text-texto3">conforme</p>
                </div>
              </Anel>
              <div className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-4">
                <Metrica rotulo="Itens avaliados" valor={prog.respondidos} />
                <Metrica rotulo="Conformes" valor={contagem.conforme} tom="text-verde" />
                <Metrica rotulo="Não conformes" valor={contagem.nao_conforme} tom="text-vermelho" />
                <Metrica rotulo="Observações" valor={contagem.observacao} tom="text-ambar" />
              </div>
            </div>

            <table className="mt-7 w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b text-left text-texto3">
                  <th className="py-2 font-medium">Etapa</th>
                  <th className="py-2 text-center font-medium">Itens</th>
                  <th className="py-2 text-center font-medium">C</th>
                  <th className="py-2 text-center font-medium">NC</th>
                  <th className="py-2 text-center font-medium">Obs.</th>
                  <th className="py-2 text-center font-medium">N/A</th>
                </tr>
              </thead>
              <tbody>
                {ETAPAS.map((e) => {
                  const itens = e.requisitos.map((r) => auditoria.itens[r.id]).filter(Boolean);
                  const c = (v: string) => itens.filter((i) => i!.resposta === v).length;
                  return (
                    <tr key={e.numero} className="border-b">
                      <td className="py-2">{e.numero}. {e.titulo}</td>
                      <td className="py-2 text-center tabular-nums">{itens.length}</td>
                      <td className="py-2 text-center tabular-nums text-verde">{c('conforme')}</td>
                      <td className="py-2 text-center tabular-nums text-vermelho">{c('nao_conforme')}</td>
                      <td className="py-2 text-center tabular-nums text-ambar">{c('observacao')}</td>
                      <td className="py-2 text-center tabular-nums text-texto3">{c('nao_aplicavel')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {/* Checklist */}
          <section className="quebra-pagina">
            <Titulo numero="4">Checklist completo</Titulo>
            <div className="space-y-6">
              {ETAPAS.map((e) => {
                const itens = e.requisitos.map((r) => ({ r, i: auditoria.itens[r.id] })).filter((x) => x.i?.resposta);
                if (!itens.length) return null;
                return (
                  <div key={e.numero}>
                    <h3 className="mb-2.5 text-[15px] font-semibold">Etapa {e.numero} — {e.titulo}</h3>
                    <div className="space-y-2.5">
                      {itens.map(({ r, i }) => (
                        <div key={r.id} className="rounded-xl border p-3.5">
                          <div className="mb-1.5 flex flex-wrap items-center gap-2">
                            <Etiqueta tom="neutro" className="font-mono">{r.clausula}</Etiqueta>
                            <Etiqueta tom={TONS[i!.resposta!]}>{ROTULOS[i!.resposta!]}</Etiqueta>
                          </div>
                          <p className="text-[13.5px] font-medium">{r.titulo}</p>
                          {i!.comentario && <p className="mt-1.5 text-[13px] leading-relaxed text-texto2">{i!.comentario}</p>}
                          {i!.evidencia && (
                            <p className="mt-1.5 text-[12.5px] text-texto3">
                              <strong className="font-medium text-texto2">Evidência: </strong>{i!.evidencia}
                            </p>
                          )}
                          {i!.anexos.length > 0 && (
                            <p className="mt-1 text-[11.5px] text-texto3">{i!.anexos.length} anexo(s)</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Não conformidades */}
          <section className="quebra-pagina">
            <Titulo numero="5">Não conformidades</Titulo>
            {auditoria.naoConformidades.length === 0 ? (
              <p className="text-[14px] text-texto2">Não foram identificadas não conformidades nesta auditoria.</p>
            ) : (
              <div className="space-y-4">
                {auditoria.naoConformidades.map((nc, i) => (
                  <div key={nc.id} className="rounded-xl2 border p-5">
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <Etiqueta tom={nc.classificacao === 'maior' ? 'vermelho' : nc.classificacao === 'menor' ? 'ambar' : 'acento'}>
                        NC {String(i + 1).padStart(2, '0')} · {nc.classificacao === 'observacao' ? 'Observação' : `${nc.classificacao === 'maior' ? 'Maior' : 'Menor'}`}
                      </Etiqueta>
                      <Etiqueta tom="neutro" className="font-mono">{nc.clausula}</Etiqueta>
                      <Etiqueta tom="neutro">Etapa {nc.etapa}</Etiqueta>
                    </div>
                    <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-texto">{nc.descricao}</p>
                    {nc.evidenciaObjetiva && (
                      <p className="mt-2.5 text-[13px] text-texto2">
                        <strong className="font-medium">Evidência objetiva: </strong>{nc.evidenciaObjetiva}
                      </p>
                    )}
                    <p className="mt-1.5 text-[13px] text-texto2">
                      <strong className="font-medium">Requisito descumprido: </strong>{nc.requisitoDescumprido}
                    </p>
                    {nc.causaRaiz && (
                      <p className="mt-1.5 text-[13px] text-texto2"><strong className="font-medium">Causa raiz: </strong>{nc.causaRaiz}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Planos de ação */}
          <section>
            <Titulo numero="6">Planos de ação (5W2H)</Titulo>
            {auditoria.naoConformidades.filter((n) => n.plano?.oQue).length === 0 ? (
              <p className="text-[14px] text-texto2">Nenhum plano de ação registrado até o momento.</p>
            ) : (
              <div className="space-y-4">
                {auditoria.naoConformidades.filter((n) => n.plano?.oQue).map((nc, i) => (
                  <div key={nc.id} className="rounded-xl2 border p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Etiqueta tom="acento">Plano NC {String(i + 1).padStart(2, '0')}</Etiqueta>
                      <Etiqueta tom={nc.plano!.status === 'concluida' ? 'verde' : nc.plano!.status === 'atrasada' ? 'vermelho' : 'ambar'}>
                        {({ aberta: 'Aberta', em_andamento: 'Em andamento', concluida: 'Concluída', atrasada: 'Atrasada' })[nc.plano!.status]}
                      </Etiqueta>
                    </div>
                    <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
                      <Dado rotulo="O quê" valor={nc.plano!.oQue} />
                      <Dado rotulo="Por quê" valor={nc.plano!.porQue} />
                      <Dado rotulo="Onde" valor={nc.plano!.onde} />
                      <Dado rotulo="Quando" valor={nc.plano!.quando ? formatarData(nc.plano!.quando) : '—'} />
                      <Dado rotulo="Quem" valor={nc.plano!.quem} />
                      <Dado rotulo="Quanto" valor={nc.plano!.quanto || '—'} />
                    </dl>
                    <p className="mt-2.5 text-[13px] text-texto2"><strong className="font-medium">Como: </strong>{nc.plano!.como}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Evidências */}
          <section className="quebra-pagina">
            <Titulo numero="7">Evidências anexadas</Titulo>
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
          </section>

          {/* Conclusão */}
          <section>
            <Titulo numero="8">Conclusão</Titulo>
            <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed text-texto2">
              {auditoria.observacoesFinais || 'Conclusão não registrada.'}
            </p>
          </section>

          {/* Assinaturas */}
          <section>
            <Titulo numero="9">Assinaturas</Titulo>
            {auditoria.assinaturas.length === 0 ? (
              <p className="text-[14px] text-texto2">Nenhuma assinatura registrada.</p>
            ) : (
              <div className="grid gap-8 pt-6 sm:grid-cols-2">
                {auditoria.assinaturas.map((a, i) => (
                  <div key={i} className="border-t pt-2.5 text-center">
                    <p className="text-[14px] font-medium">{a.nome}</p>
                    <p className="text-[12.5px] text-texto3">{a.cargo}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-wide text-texto3">
                      {a.papel === 'auditor' ? 'Auditor' : a.papel === 'auditado' ? 'Auditado' : 'Responsável'} · {formatarDataHora(a.dataHora)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <footer className="border-t pt-5 text-center text-[11.5px] text-texto3">
            Relatório gerado em {formatarDataHora(new Date().toISOString())} · {auditoria.codigo}
          </footer>
        </article>
      </div>
    </>
  );
}

function Titulo({ numero, children }: { numero: string; children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-baseline gap-2.5 text-[19px] font-semibold tracking-[-.02em]">
      <span className="text-[13px] tabular-nums text-acento">{numero}</span>{children}
    </h2>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-texto3">{rotulo}</dt>
      <dd className="mt-0.5 text-[14px] text-texto">{valor || '—'}</dd>
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
      <p className={`text-[24px] font-semibold tabular-nums leading-none ${tom}`}>{valor}</p>
      <p className="mt-1 text-[11.5px] text-texto3">{rotulo}</p>
    </div>
  );
}
