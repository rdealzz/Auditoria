'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Assinatura, Auditoria } from '@/lib/tipos';
import { contarPorResposta, formatarDuracao, progressoGeral, taxaConformidade } from '@/lib/armazenamento';
import { perguntarIA } from '@/lib/assistente';
import { setorPorId } from '@/dados/setores';
import { NORMAS } from '@/dados/sgi';
import { Anel, AreaTexto, Botao, Campo } from './ui';
import { IconeCheck, IconeFaisca } from './Icones';

export default function Conclusao({
  auditoria, aoAtualizar, aoConcluir
}: { auditoria: Auditoria; aoAtualizar: (m: Partial<Auditoria>) => void; aoConcluir: () => void }) {
  const [gerando, setGerando] = useState(false);
  const [assinatura, setAssinatura] = useState<{ papel: Assinatura['papel']; nome: string; cargo: string }>({
    papel: 'auditor', nome: auditoria.auditor, cargo: 'Auditor interno'
  });

  const taxa = taxaConformidade(auditoria);
  const contagem = contarPorResposta(auditoria);
  const prog = progressoGeral(auditoria);
  const setor = setorPorId(auditoria.setor);

  async function gerarConclusao() {
    setGerando(true);
    const r = await perguntarIA({
      tipo: 'relatorio',
      contexto: {
        empresa: auditoria.empresa, setor: setor?.nome, data: auditoria.data,
        criterio: auditoria.criterio,
        normas: NORMAS.filter((n) => auditoria.normas.includes(n.id)).map((n) => n.nome).join(', '),
        taxaConformidade: taxa, totalNC: auditoria.naoConformidades.length, itensAvaliados: prog.respondidos
      }
    });
    aoAtualizar({ observacoesFinais: r.texto });
    setGerando(false);
  }

  function adicionarAssinatura() {
    if (!assinatura.nome.trim()) return;
    aoAtualizar({ assinaturas: [...auditoria.assinaturas, { ...assinatura, dataHora: new Date().toISOString() }] });
    setAssinatura({ papel: 'auditado', nome: '', cargo: '' });
  }

  const cor = taxa >= 85 ? 'rgb(var(--verde))' : taxa >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))';

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="mt-16 space-y-6 border-t pt-14"
    >
      <header className="text-center">
        <h2 className="text-[30px] font-semibold tracking-[-.03em]">Encerramento</h2>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-texto3">
          Confira os números, registre as assinaturas e emita o relatório.
        </p>
      </header>

      <div className="flex flex-wrap items-center justify-center gap-12 py-6">
        <Anel valor={taxa} tamanho={148} espessura={12} cor={cor}>
          <div>
            <p className="text-[34px] font-semibold tabular-nums leading-none">{taxa}%</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-texto3">conforme</p>
          </div>
        </Anel>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
          <Numero valor={prog.respondidos} rotulo="verificações" />
          <Numero valor={contagem.nao_conforme} rotulo="não conformes" tom="text-vermelho" />
          <Numero valor={contagem.observacao} rotulo="observações" tom="text-ambar" />
          <Numero texto={formatarDuracao(auditoria.tempoTotalMin)} rotulo="duração" />
        </div>
      </div>

      <div className="rounded-xl2 border bg-superficie p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[16px] font-semibold">Conclusão</h3>
          <Botao variante="suave" tamanho="p" onClick={gerarConclusao} disabled={gerando}>
            <IconeFaisca tamanho={14} />{gerando ? 'Redigindo…' : 'Gerar'}
          </Botao>
        </div>
        <AreaTexto
          value={auditoria.observacoesFinais}
          onChange={(e) => aoAtualizar({ observacoesFinais: e.target.value })}
          placeholder="Desempenho geral, principais pontos de atenção, pontos fortes e recomendação."
          className="min-h-[150px]"
        />
      </div>

      <div className="rounded-xl2 border bg-superficie p-6">
        <h3 className="mb-4 text-[16px] font-semibold">Assinaturas</h3>

        {auditoria.assinaturas.length > 0 && (
          <ul className="mb-5 divide-y">
            {auditoria.assinaturas.map((a, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <span className="etiqueta bg-texto/[.07] text-texto2">
                  {a.papel === 'auditor' ? 'Auditor' : a.papel === 'auditado' ? 'Auditado' : 'Responsável'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{a.nome}</p>
                  <p className="truncate text-[12px] text-texto3">{a.cargo}</p>
                </div>
                <button
                  onClick={() => aoAtualizar({ assinaturas: auditoria.assinaturas.filter((_, j) => j !== i) })}
                  className="text-[12px] text-texto3 transition-colors hover:text-vermelho"
                >
                  remover
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <label className="block">
            <span className="rotulo">Papel</span>
            <select
              value={assinatura.papel}
              onChange={(e) => setAssinatura((a) => ({ ...a, papel: e.target.value as Assinatura['papel'] }))}
              className="campo cursor-pointer py-2.5"
            >
              <option value="auditor">Auditor</option>
              <option value="auditado">Auditado</option>
              <option value="responsavel">Responsável</option>
            </select>
          </label>
          <Campo rotulo="Nome" value={assinatura.nome} onChange={(e) => setAssinatura((a) => ({ ...a, nome: e.target.value }))} placeholder="Nome completo" />
          <Campo rotulo="Cargo" value={assinatura.cargo} onChange={(e) => setAssinatura((a) => ({ ...a, cargo: e.target.value }))} placeholder="Cargo ou função" />
          <Botao variante="suave" onClick={adicionarAssinatura} disabled={!assinatura.nome.trim()}>Adicionar</Botao>
        </div>
      </div>

      <div className="flex justify-center pb-4 pt-2">
        <Botao variante="primario" tamanho="g" onClick={aoConcluir}>
          <IconeCheck tamanho={18} />Concluir e emitir relatório
        </Botao>
      </div>
    </motion.section>
  );
}

function Numero({ valor, texto, rotulo, tom = 'text-texto' }: { valor?: number; texto?: string; rotulo: string; tom?: string }) {
  return (
    <div className="text-center">
      <p className={`text-[26px] font-semibold tabular-nums leading-none ${tom}`}>{texto ?? valor}</p>
      <p className="mt-1.5 text-[11.5px] text-texto3">{rotulo}</p>
    </div>
  );
}
