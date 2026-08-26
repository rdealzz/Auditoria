'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import { Barra, Botao, Cartao, Etiqueta, Vazio } from '@/components/ui';
import { IconeDoc, IconeLupa, IconeMais, IconeSeta } from '@/components/Icones';
import { NORMAS, SETORES, nomeNorma, setorPorId } from '@/dados/normas';
import type { Auditoria } from '@/lib/tipos';
import { formatarData, formatarDuracao, listarAuditorias, progressoGeral, taxaConformidade } from '@/lib/armazenamento';
import { useApp } from '../provedores';

const STATUS = [
  { valor: '', texto: 'Todos os status' },
  { valor: 'rascunho', texto: 'Pendente' },
  { valor: 'em_andamento', texto: 'Em andamento' },
  { valor: 'concluida', texto: 'Concluída' }
];

export default function Historico() {
  const { usuario } = useApp();
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [f, setF] = useState({ busca: '', empresa: '', setor: '', norma: '', auditor: '', status: '', de: '', ate: '' });

  useEffect(() => {
    const carregar = () => setAuditorias(listarAuditorias());
    carregar();
    window.addEventListener('auditoria:alterado', carregar);
    return () => window.removeEventListener('auditoria:alterado', carregar);
  }, []);

  const empresas = useMemo(() => [...new Set(auditorias.map((a) => a.empresa).filter(Boolean))], [auditorias]);
  const auditores = useMemo(() => [...new Set(auditorias.map((a) => a.auditor).filter(Boolean))], [auditorias]);

  const filtradas = useMemo(() => auditorias.filter((a) => {
    const texto = `${a.codigo} ${a.empresa} ${a.processo} ${a.auditor} ${a.auditado}`.toLowerCase();
    if (f.busca && !texto.includes(f.busca.toLowerCase())) return false;
    if (f.empresa && a.empresa !== f.empresa) return false;
    if (f.setor && a.setor !== f.setor) return false;
    if (f.norma && a.norma !== f.norma) return false;
    if (f.auditor && a.auditor !== f.auditor) return false;
    if (f.status && a.status !== f.status) return false;
    if (f.de && a.data < f.de) return false;
    if (f.ate && a.data > f.ate) return false;
    return true;
  }), [auditorias, f]);

  const definir = (campo: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((x) => ({ ...x, [campo]: e.target.value }));

  const limpar = () => setF({ busca: '', empresa: '', setor: '', norma: '', auditor: '', status: '', de: '', ate: '' });
  const temFiltro = Object.values(f).some(Boolean);

  if (!usuario) return <Navegacao />;

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-conteudo px-5 py-9 sm:px-7">
        <motion.header
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-7 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-[32px] font-semibold tracking-[-.03em] sm:text-[38px]">Histórico</h1>
            <p className="mt-1.5 text-[15px] text-texto3">
              {filtradas.length} de {auditorias.length} auditorias
            </p>
          </div>
          <Link href="/auditorias/nova"><Botao variante="primario"><IconeMais tamanho={16} />Nova auditoria</Botao></Link>
        </motion.header>

        <Cartao animar className="mb-6">
          <div className="relative mb-4">
            <IconeLupa tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
            <input
              value={f.busca} onChange={definir('busca')}
              placeholder="Buscar por código, empresa, processo, auditor…"
              className="campo pl-11"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Filtro rotulo="Empresa" value={f.empresa} onChange={definir('empresa')}
              opcoes={[{ valor: '', texto: 'Todas' }, ...empresas.map((e) => ({ valor: e, texto: e }))]} />
            <Filtro rotulo="Setor" value={f.setor} onChange={definir('setor')}
              opcoes={[{ valor: '', texto: 'Todos' }, ...SETORES.map((s) => ({ valor: s.id, texto: s.nome }))]} />
            <Filtro rotulo="Norma" value={f.norma} onChange={definir('norma')}
              opcoes={[{ valor: '', texto: 'Todas' }, ...NORMAS.map((n) => ({ valor: n.id, texto: n.nome }))]} />
            <Filtro rotulo="Auditor" value={f.auditor} onChange={definir('auditor')}
              opcoes={[{ valor: '', texto: 'Todos' }, ...auditores.map((a) => ({ valor: a, texto: a }))]} />
            <Filtro rotulo="Status" value={f.status} onChange={definir('status')} opcoes={STATUS} />
            <label className="block">
              <span className="rotulo">De</span>
              <input type="date" value={f.de} onChange={definir('de')} className="campo py-2.5" />
            </label>
            <label className="block">
              <span className="rotulo">Até</span>
              <input type="date" value={f.ate} onChange={definir('ate')} className="campo py-2.5" />
            </label>
            <div className="flex items-end">
              <Botao variante="contorno" className="w-full" onClick={limpar} disabled={!temFiltro}>Limpar filtros</Botao>
            </div>
          </div>
        </Cartao>

        {filtradas.length === 0 ? (
          <Vazio
            titulo={auditorias.length ? 'Nenhuma auditoria encontrada' : 'Nenhuma auditoria registrada'}
            descricao={auditorias.length ? 'Ajuste os filtros para ver outros resultados.' : 'Crie a primeira auditoria para começar o histórico.'}
            acao={!auditorias.length ? <Link href="/auditorias/nova"><Botao variante="primario">Criar auditoria</Botao></Link> : undefined}
          />
        ) : (
          <ul className="space-y-3">
            {filtradas.map((a, i) => <Linha key={a.id} auditoria={a} indice={i} />)}
          </ul>
        )}
      </main>
    </>
  );
}

function Filtro({
  rotulo, opcoes, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { rotulo: string; opcoes: { valor: string; texto: string }[] }) {
  return (
    <label className="block">
      <span className="rotulo">{rotulo}</span>
      <select {...props} className="campo cursor-pointer py-2.5 text-[14px]">
        {opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
    </label>
  );
}

function Linha({ auditoria, indice }: { auditoria: Auditoria; indice: number }) {
  const prog = progressoGeral(auditoria);
  const taxa = taxaConformidade(auditoria);
  const concluida = auditoria.status === 'concluida';
  const destino = concluida ? `/auditorias/${auditoria.id}/relatorio` : `/auditorias/${auditoria.id}`;

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(indice * 0.04, 0.3) }}
    >
      <Link href={destino} className="group block cartao p-5 transition-all duration-300 ease-apple hover:-translate-y-0.5 hover:shadow-nivel2">
        <div className="flex flex-wrap items-start gap-4">
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl2
            ${concluida ? 'bg-verde/12 text-verde' : 'bg-acento/12 text-acento'}`}>
            <IconeDoc tamanho={19} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[15.5px] font-semibold">{setorPorId(auditoria.setor)?.nome ?? auditoria.setor}</p>
              <Etiqueta tom={concluida ? 'verde' : auditoria.status === 'rascunho' ? 'ambar' : 'acento'}>
                {concluida ? 'Concluída' : auditoria.status === 'rascunho' ? 'Pendente' : 'Em andamento'}
              </Etiqueta>
              {auditoria.naoConformidades.length > 0 && (
                <Etiqueta tom="vermelho">{auditoria.naoConformidades.length} NC</Etiqueta>
              )}
            </div>
            <p className="mt-1 truncate text-[12.5px] text-texto3">
              {auditoria.codigo} · {auditoria.empresa || 'Sem empresa'} · {nomeNorma(auditoria.norma)} · {formatarData(auditoria.data)}
              {auditoria.auditor && ` · ${auditoria.auditor}`}
            </p>
            <div className="mt-2.5 max-w-sm">
              <Barra valor={prog.percentual} tom={concluida ? 'verde' : 'acento'} altura={5} />
            </div>
          </div>

          <div className="flex items-center gap-6 text-right">
            <div>
              <p className="text-[19px] font-semibold tabular-nums leading-none">{taxa}%</p>
              <p className="mt-1 text-[11px] text-texto3">conforme</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-[13.5px] font-medium tabular-nums leading-none">{formatarDuracao(auditoria.tempoTotalMin)}</p>
              <p className="mt-1 text-[11px] text-texto3">duração</p>
            </div>
            <IconeSeta tamanho={17} className="text-texto3 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
