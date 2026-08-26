'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Assinatura, Auditoria } from '@/lib/tipos';
import { contarPorResposta, formatarDuracao, progressoGeral, taxaConformidade } from '@/lib/armazenamento';
import { perguntarIA } from '@/lib/assistente';
import { nomeNorma, setorPorId } from '@/dados/normas';
import { GraficoRosca } from './Graficos';
import { Anel, AreaTexto, Botao, Campo, Cartao, Etiqueta } from './ui';
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
        criterio: auditoria.criterio, norma: nomeNorma(auditoria.norma),
        taxaConformidade: taxa, totalNC: auditoria.naoConformidades.length,
        itensAvaliados: prog.respondidos
      }
    });
    aoAtualizar({ observacoesFinais: r.texto });
    setGerando(false);
  }

  function adicionarAssinatura() {
    if (!assinatura.nome.trim()) return;
    aoAtualizar({
      assinaturas: [...auditoria.assinaturas, { ...assinatura, dataHora: new Date().toISOString() }]
    });
    setAssinatura({ papel: 'auditado', nome: '', cargo: '' });
  }

  const distribuicao = [
    { rotulo: 'Conforme', cor: 'rgb(var(--verde))', valor: contagem.conforme },
    { rotulo: 'Não conforme', cor: 'rgb(var(--vermelho))', valor: contagem.nao_conforme },
    { rotulo: 'Observação', cor: 'rgb(var(--ambar))', valor: contagem.observacao },
    { rotulo: 'Não aplicável', cor: 'rgb(var(--texto-3))', valor: contagem.nao_aplicavel }
  ];

  const porClasse = {
    maior: auditoria.naoConformidades.filter((n) => n.classificacao === 'maior').length,
    menor: auditoria.naoConformidades.filter((n) => n.classificacao === 'menor').length,
    observacao: auditoria.naoConformidades.filter((n) => n.classificacao === 'observacao').length
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="mt-10 space-y-5 border-t pt-10"
    >
      <div>
        <Etiqueta tom="verde" className="mb-3"><IconeCheck tamanho={12} />Todas as etapas verificadas</Etiqueta>
        <h2 className="text-[28px] font-semibold tracking-[-.03em]">Resumo da auditoria</h2>
        <p className="mt-1.5 text-[15px] text-texto3">Confira os indicadores, registre as assinaturas e gere o relatório.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Cartao className="flex flex-col items-center justify-center gap-4 text-center">
          <Anel valor={taxa} tamanho={140} espessura={12}
                cor={taxa >= 85 ? 'rgb(var(--verde))' : taxa >= 60 ? 'rgb(var(--ambar))' : 'rgb(var(--vermelho))'}>
            <div>
              <p className="text-[32px] font-semibold tabular-nums leading-none">{taxa}%</p>
              <p className="mt-1 text-[11px] uppercase tracking-wide text-texto3">conforme</p>
            </div>
          </Anel>
          <div className="grid w-full grid-cols-3 gap-2 border-t pt-4 text-center">
            <Indicador rotulo="Itens" valor={String(prog.respondidos)} />
            <Indicador rotulo="NC" valor={String(auditoria.naoConformidades.length)} />
            <Indicador rotulo="Tempo" valor={formatarDuracao(auditoria.tempoTotalMin)} />
          </div>
        </Cartao>

        <Cartao>
          <h3 className="mb-5 text-[16px] font-semibold">Distribuição das constatações</h3>
          <GraficoRosca dados={distribuicao} tamanho={160} />
          <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
            <Etiqueta tom="vermelho">{porClasse.maior} NC maior</Etiqueta>
            <Etiqueta tom="ambar">{porClasse.menor} NC menor</Etiqueta>
            <Etiqueta tom="acento">{porClasse.observacao} observação</Etiqueta>
          </div>
        </Cartao>
      </div>

      <Cartao>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-[16px] font-semibold">Conclusão e observações finais</h3>
          <Botao variante="suave" tamanho="p" onClick={gerarConclusao} disabled={gerando}>
            <IconeFaisca tamanho={14} />{gerando ? 'Redigindo…' : 'Gerar automaticamente'}
          </Botao>
        </div>
        <AreaTexto
          value={auditoria.observacoesFinais}
          onChange={(e) => aoAtualizar({ observacoesFinais: e.target.value })}
          placeholder="Desempenho geral do setor, principais pontos de atenção, pontos fortes e recomendação."
          className="min-h-[160px]"
          dica="Registre também o que está bem feito: o relatório equilibrado tem muito mais adesão."
        />
      </Cartao>

      <Cartao>
        <h3 className="mb-4 text-[16px] font-semibold">Assinaturas</h3>

        {auditoria.assinaturas.length > 0 && (
          <ul className="mb-5 divide-y">
            {auditoria.assinaturas.map((a, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <Etiqueta tom={a.papel === 'auditor' ? 'acento' : 'neutro'}>
                  {a.papel === 'auditor' ? 'Auditor' : a.papel === 'auditado' ? 'Auditado' : 'Responsável'}
                </Etiqueta>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">{a.nome}</p>
                  <p className="truncate text-[12px] text-texto3">{a.cargo}</p>
                </div>
                <button
                  onClick={() => aoAtualizar({ assinaturas: auditoria.assinaturas.filter((_, j) => j !== i) })}
                  className="text-[12px] text-texto3 hover:text-vermelho"
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
      </Cartao>

      <div className="flex justify-end pb-6">
        <Botao variante="primario" tamanho="g" onClick={aoConcluir}>
          <IconeCheck tamanho={18} />Concluir auditoria e gerar relatório
        </Botao>
      </div>
    </motion.section>
  );
}

function Indicador({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <p className="text-[17px] font-semibold tabular-nums leading-tight">{valor}</p>
      <p className="text-[11px] text-texto3">{rotulo}</p>
    </div>
  );
}
