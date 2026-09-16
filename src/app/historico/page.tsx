'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Navegacao from '@/components/Navegacao';
import { Botao, Vazio } from '@/components/ui';
import { IconeDoc, IconeLupa, IconeMais } from '@/components/Icones';
import { SETORES } from '@/dados/setores';
import { NORMAS, type NormaId } from '@/dados/sgi';
import type { Auditoria } from '@/lib/tipos';
import { excluirAuditoria, listarAuditorias } from '@/lib/armazenamento';
import { useApp } from '../provedores';
import LinhaAuditoria from '@/components/LinhaAuditoria';

const STATUS = [
  { valor: '', texto: 'Todos' },
  { valor: 'em_andamento', texto: 'Em andamento' },
  { valor: 'concluida', texto: 'Concluída' }
];

export default function Historico() {
  const { usuario, avisar } = useApp();
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [f, setF] = useState({ busca: '', empresa: '', setor: '', norma: '', auditor: '', status: '', de: '', ate: '' });
  const [verFiltros, setVerFiltros] = useState(false);

  useEffect(() => {
    const carregar = () => setAuditorias(listarAuditorias());
    carregar();
    window.addEventListener('auditoria:alterado', carregar);
    return () => window.removeEventListener('auditoria:alterado', carregar);
  }, []);

  const empresas = useMemo(() => [...new Set(auditorias.map((a) => a.empresa).filter(Boolean))], [auditorias]);
  const auditores = useMemo(() => [...new Set(auditorias.map((a) => a.auditor).filter(Boolean))], [auditorias]);

  const filtradas = useMemo(() => auditorias.filter((a) => {
    const texto = `${a.codigo} ${a.empresa} ${a.auditor} ${a.auditado}`.toLowerCase();
    if (f.busca && !texto.includes(f.busca.toLowerCase())) return false;
    if (f.empresa && a.empresa !== f.empresa) return false;
    if (f.setor && a.setor !== f.setor) return false;
    if (f.norma && !a.normas.includes(f.norma as NormaId)) return false;
    if (f.auditor && a.auditor !== f.auditor) return false;
    if (f.status && a.status !== f.status) return false;
    if (f.de && a.data < f.de) return false;
    if (f.ate && a.data > f.ate) return false;
    return true;
  }), [auditorias, f]);

  const definir = (campo: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((x) => ({ ...x, [campo]: e.target.value }));

  const limpar = () => setF({ busca: '', empresa: '', setor: '', norma: '', auditor: '', status: '', de: '', ate: '' });
  const ativos = Object.entries(f).filter(([k, v]) => k !== 'busca' && v).length;

  if (!usuario) return <Navegacao />;

  return (
    <>
      <Navegacao />
      <main className="mx-auto max-w-[900px] px-6 pb-24 pt-12 sm:px-8">
        <motion.header
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-9 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-[38px] font-semibold leading-[1.05] tracking-[-.035em] sm:text-[46px]">Histórico</h1>
            <p className="mt-2 text-[14px] tabular-nums text-texto3">
              {filtradas.length} de {auditorias.length} auditorias
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/conta#backup"><Botao variante="contorno"><IconeDoc tamanho={16} />Exportar / Importar</Botao></Link>
            <Link href="/auditorias/nova"><Botao variante="primario"><IconeMais tamanho={16} />Nova</Botao></Link>
          </div>
        </motion.header>

        <div className="mb-8">
          <div className="relative">
            <IconeLupa tamanho={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-texto3" />
            <input
              value={f.busca} onChange={definir('busca')}
              placeholder="Buscar por código, empresa ou auditor"
              className="campo pl-11 pr-28"
            />
            <button
              onClick={() => setVerFiltros((v) => !v)}
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 rounded-pill px-3.5 py-1.5 text-[12.5px] font-medium transition-colors
                ${ativos ? 'bg-acento/12 text-acento' : 'text-texto3 hover:bg-texto/[.06] hover:text-texto'}`}
            >
              Filtros{ativos ? ` · ${ativos}` : ''}
            </button>
          </div>

          {verFiltros && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="mt-3 grid gap-3 rounded-xl2 border bg-superficie p-5 sm:grid-cols-2 lg:grid-cols-4"
            >
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
                <input type="date" value={f.de} onChange={definir('de')} className="campo py-2.5 text-[14px]" />
              </label>
              <label className="block">
                <span className="rotulo">Até</span>
                <input type="date" value={f.ate} onChange={definir('ate')} className="campo py-2.5 text-[14px]" />
              </label>
              <div className="flex items-end">
                <Botao variante="contorno" className="w-full" onClick={limpar} disabled={!ativos}>Limpar</Botao>
              </div>
            </motion.div>
          )}
        </div>

        {filtradas.length === 0 ? (
          <Vazio
            titulo={auditorias.length ? 'Nada encontrado' : 'Nenhuma auditoria registrada'}
            descricao={auditorias.length ? 'Ajuste os filtros para ver outros resultados.' : 'Crie a primeira auditoria para começar o histórico.'}
            acao={!auditorias.length ? <Link href="/auditorias/nova"><Botao variante="primario">Criar auditoria</Botao></Link> : undefined}
          />
        ) : (
          <ul className="space-y-2.5">
            {filtradas.map((a, i) => (
              <LinhaAuditoria
                key={a.id} auditoria={a} indice={i}
                aoExcluir={() => { excluirAuditoria(a.id); avisar(`${a.codigo} excluída.`); }}
              />
            ))}
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
