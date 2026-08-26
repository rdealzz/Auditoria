'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import { Botao } from '@/components/ui';
import { IconeSeta, IconeVoltar } from '@/components/Icones';
import { FAMILIAS, SETORES } from '@/dados/setores';
import { resumoSetor } from '@/dados/montagem-roteiro';
import { NORMAS, type NormaId } from '@/dados/sgi';
import { gravarPreferencias, lerPreferencias, novaAuditoria, salvarAuditoria } from '@/lib/armazenamento';
import { useApp } from '@/app/provedores';

const CORES: Record<NormaId, { ativo: string; ponto: string }> = {
  iso9001: { ativo: 'border-acento bg-acento/10 text-acento', ponto: 'bg-acento' },
  iso14001: { ativo: 'border-verde bg-verde/10 text-verde', ponto: 'bg-verde' },
  iso45001: { ativo: 'border-ambar bg-ambar/10 text-ambar', ponto: 'bg-ambar' }
};

/**
 * Início em dois toques: escolher o setor e confirmar.
 * Empresa e auditor vêm da última auditoria; escopo, objetivo e critério
 * são gerados e continuam editáveis depois.
 */
export default function NovaAuditoria() {
  const router = useRouter();
  const { usuario } = useApp();

  const [setor, setSetor] = useState<string | null>(null);
  const [empresa, setEmpresa] = useState('');
  const [normas, setNormas] = useState<NormaId[]>(NORMAS.map((n) => n.id));
  const [iniciando, setIniciando] = useState(false);

  useEffect(() => {
    const p = lerPreferencias();
    setEmpresa(p.empresa);
    if (p.normas?.length) setNormas(p.normas);
  }, []);

  const escolhido = useMemo(() => SETORES.find((s) => s.id === setor), [setor]);
  const resumo = escolhido ? resumoSetor(escolhido) : null;

  function alternarNorma(id: NormaId) {
    setNormas((atual) => (atual.includes(id) ? atual.filter((n) => n !== id) : [...atual, id]));
  }

  function iniciar() {
    if (!setor || !empresa.trim() || normas.length === 0) return;
    setIniciando(true);
    gravarPreferencias({ empresa: empresa.trim(), auditor: usuario?.nome ?? '', normas });
    const a = salvarAuditoria(
      novaAuditoria({ setor, normas, empresa: empresa.trim(), auditor: usuario?.nome ?? '' })
    );
    router.push(`/auditorias/${a.id}`);
  }

  if (!usuario) return <Navegacao />;

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-[980px] px-6 pb-40 pt-10 sm:px-8">
        <Link href="/painel" className="mb-8 inline-flex items-center gap-1.5 text-[13px] text-texto3 transition-colors hover:text-texto">
          <IconeVoltar tamanho={15} />Painel
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-.035em] sm:text-[52px]">
            Qual setor você vai auditar?
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-texto2">
            O roteiro técnico do setor é montado automaticamente, com os requisitos das três normas do SGI.
          </p>
        </motion.header>

        {FAMILIAS.map((familia, fi) => {
          const doGrupo = SETORES.filter((s) => s.familia === familia.id);
          if (!doGrupo.length) return null;
          return (
            <motion.section
              key={familia.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.06 + fi * 0.06, ease: [0.32, 0.72, 0, 1] }}
              className="mb-10"
            >
              <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[.12em] text-texto3">{familia.nome}</h2>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {doGrupo.map((s) => {
                  const ativo = setor === s.id;
                  const r = resumoSetor(s);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSetor(s.id)}
                      className={`group rounded-xl2 border p-5 text-left transition-all duration-300 ease-apple
                                  active:scale-[.99]
                                  ${ativo
                                    ? 'border-acento bg-acento/[.06] shadow-nivel1'
                                    : 'bg-superficie hover:-translate-y-0.5 hover:shadow-nivel1'}`}
                    >
                      <p className={`text-[16px] font-semibold tracking-[-.015em] ${ativo ? 'text-acento' : 'text-texto'}`}>
                        {s.nome}
                      </p>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-texto3">{s.resumo}</p>
                      <p className="mt-3 text-[11.5px] tabular-nums text-texto3">
                        {r.itens} verificações · {r.blocos} blocos
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </main>

      {/* Barra de confirmação: aparece só quando há um setor escolhido */}
      <AnimatePresence>
        {escolhido && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 px-4 pb-5 nao-imprimir"
          >
            <div className="vidro mx-auto w-full max-w-[820px] rounded-xl3 border p-4 shadow-nivel2 sm:p-5">
              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-[180px] flex-1">
                  <p className="text-[11px] uppercase tracking-wide text-texto3">Setor</p>
                  <p className="truncate text-[17px] font-semibold tracking-[-.02em]">{escolhido.nome}</p>
                  <p className="mt-0.5 text-[12px] tabular-nums text-texto3">{resumo?.itens} verificações</p>
                </div>

                <label className="min-w-[190px] flex-1">
                  <span className="rotulo">Empresa ou unidade</span>
                  <input
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && iniciar()}
                    placeholder="Ex.: Unidade Sul"
                    autoFocus
                    className="campo py-2.5 text-[15px]"
                  />
                </label>

                <div>
                  <span className="rotulo">Normas</span>
                  <div className="flex gap-1.5">
                    {NORMAS.map((n) => {
                      const ativo = normas.includes(n.id);
                      return (
                        <button
                          key={n.id}
                          onClick={() => alternarNorma(n.id)}
                          aria-pressed={ativo}
                          title={`${n.nome}:${n.ano} — ${n.foco}`}
                          className={`rounded-pill border px-3 py-2 text-[12.5px] font-medium tabular-nums transition-all duration-200
                                      ${ativo ? CORES[n.id].ativo : 'text-texto3 hover:bg-texto/[.05]'}`}
                        >
                          {n.sigla}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Botao
                  variante="primario" tamanho="m"
                  onClick={iniciar}
                  disabled={!empresa.trim() || normas.length === 0 || iniciando}
                >
                  {iniciando ? 'Abrindo…' : 'Iniciar'}<IconeSeta tamanho={16} />
                </Botao>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
