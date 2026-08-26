'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Etapa } from '@/dados/etapas';
import type { Setor } from '@/dados/normas';
import Ilustracao from './Ilustracao';
import { Botao, Etiqueta } from './ui';
import { IconeAlerta, IconeCheck, IconeFaisca, IconeRelogio, IconeSeta } from './Icones';

const BLOCOS_ANIMADOS = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const } };

export default function ExplicacaoEtapa({
  etapa, setor, aoIniciar
}: { etapa: Etapa; setor?: Setor; aoIniciar: () => void }) {
  const [liberado, setLiberado] = useState(false);
  const fim = useRef<HTMLDivElement>(null);

  /* O botão só é liberado quando a pessoa chega ao fim da explicação. */
  useEffect(() => {
    setLiberado(false);
    const alvo = fim.current;
    if (!alvo) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setLiberado(true); obs.disconnect(); } },
      { rootMargin: '0px 0px -10% 0px' }
    );
    obs.observe(alvo);
    return () => obs.disconnect();
  }, [etapa.numero]);

  return (
    <div className="pb-32">
      <motion.header
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        className="mb-7"
      >
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Etiqueta tom="acento">Etapa {etapa.numero} de 10</Etiqueta>
          <Etiqueta tom="neutro"><IconeRelogio tamanho={11} />≈ {etapa.duracaoMin} min</Etiqueta>
          <Etiqueta tom="neutro">{etapa.requisitos.length} requisitos</Etiqueta>
        </div>
        <h1 className="text-[34px] font-semibold leading-[1.06] tracking-[-.035em] sm:text-[46px]">{etapa.titulo}</h1>
        <p className="mt-2.5 max-w-2xl text-[17px] leading-snug text-texto2 sm:text-[19px]">{etapa.subtitulo}</p>
      </motion.header>

      <motion.div initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}>
        <Ilustracao cena={etapa.ilustracao} cache={`etapa-${etapa.slug}`} legenda={etapa.legendaImagem} proporcao="21 / 9" />
      </motion.div>

      <motion.p {...BLOCOS_ANIMADOS} className="mx-auto mt-8 max-w-3xl text-[17px] leading-relaxed text-texto2">
        {etapa.descricao}
      </motion.p>

      <motion.section {...BLOCOS_ANIMADOS} className="mt-8 grid gap-4 md:grid-cols-2">
        <Bloco titulo="O que será auditado" itens={etapa.oQueSeraAuditado} marcador="acento" />
        <div className="cartao p-6">
          <h3 className="mb-3 text-[16px] font-semibold">Por que este requisito importa</h3>
          <p className="text-[14.5px] leading-relaxed text-texto2">{etapa.porQueImporta}</p>
        </div>
      </motion.section>

      <motion.section {...BLOCOS_ANIMADOS} className="mt-4">
        <div className="cartao p-6">
          <h3 className="mb-4 text-[16px] font-semibold">Como realizar a auditoria</h3>
          <ol className="space-y-3">
            {etapa.comoAuditar.map((passo, i) => (
              <li key={passo} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-acento/12 text-[11.5px] font-semibold tabular-nums text-acento">
                  {i + 1}
                </span>
                <span className="text-[14.5px] leading-relaxed text-texto2">{passo}</span>
              </li>
            ))}
          </ol>
        </div>
      </motion.section>

      <motion.section {...BLOCOS_ANIMADOS} className="mt-4 grid gap-4 md:grid-cols-2">
        <Bloco titulo="O que observar" itens={etapa.oQueObservar} marcador="ambar" />
        <Bloco titulo="O que perguntar" itens={etapa.oQuePerguntar} marcador="acento" aspas />
      </motion.section>

      <motion.section {...BLOCOS_ANIMADOS} className="mt-4 grid gap-4 md:grid-cols-2">
        <Bloco titulo="Evidências a coletar" itens={etapa.evidencias} marcador="verde" />
        <Bloco titulo="Documentos esperados" itens={etapa.documentosEsperados} marcador="neutro" />
      </motion.section>

      <motion.section {...BLOCOS_ANIMADOS} className="mt-4">
        <div className="cartao p-6">
          <h3 className="mb-4 text-[16px] font-semibold">Exemplos práticos</h3>
          <div className="space-y-3">
            {etapa.exemplos.map((ex) => (
              <div key={ex.situacao} className="rounded-xl2 border p-4">
                <div className="mb-2">
                  <Etiqueta tom={ex.conclusao === 'conforme' ? 'verde' : ex.conclusao === 'nao_conforme' ? 'vermelho' : 'ambar'}>
                    {ex.conclusao === 'conforme' ? 'Conforme' : ex.conclusao === 'nao_conforme' ? 'Não conforme' : 'Observação'}
                  </Etiqueta>
                </div>
                <p className="text-[14px] leading-relaxed text-texto">{ex.situacao}</p>
                <p className="mt-2 border-l-2 border-acento/30 pl-3 text-[13.5px] leading-relaxed text-texto3">
                  <strong className="font-medium text-texto2">Leitura do auditor: </strong>{ex.leitura}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...BLOCOS_ANIMADOS} className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="cartao p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-vermelho/12 text-vermelho"><IconeAlerta tamanho={15} /></span>
            <h3 className="text-[16px] font-semibold">Erros comuns</h3>
          </div>
          <ul className="space-y-2">
            {etapa.errosComuns.map((e) => (
              <li key={e} className="flex gap-2 text-[14px] leading-snug text-texto2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-vermelho/50" />{e}
              </li>
            ))}
          </ul>
        </div>

        <div className="cartao border-roxo/25 bg-roxo/[.05] p-6">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-roxo/15 text-roxo"><IconeFaisca tamanho={15} /></span>
            <h3 className="text-[16px] font-semibold">Dicas do auditor</h3>
          </div>
          <ul className="space-y-2.5">
            {etapa.dicas.map((d) => (
              <li key={d} className="text-[14px] leading-relaxed text-texto2">“{d}”</li>
            ))}
          </ul>
        </div>
      </motion.section>

      {setor && (
        <motion.section {...BLOCOS_ANIMADOS} className="mt-4">
          <div className="cartao p-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-[16px] font-semibold">Atenção específica do setor</h3>
              <Etiqueta tom="acento">{setor.nome}</Etiqueta>
            </div>
            <p className="mb-3 text-[14px] text-texto2">{setor.contexto}</p>
            <ul className="grid gap-2 sm:grid-cols-3">
              {setor.atencao.map((a) => (
                <li key={a} className="rounded-xl bg-afundado/70 px-3.5 py-2.5 text-[13px] leading-snug text-texto2">{a}</li>
              ))}
            </ul>
          </div>
        </motion.section>
      )}

      <div ref={fim} className="h-1" />

      {/* Barra flutuante de liberação */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}
        className="fixed inset-x-0 bottom-0 z-40 nao-imprimir"
      >
        <div className="vidro mx-auto mb-5 flex w-[min(680px,calc(100vw-2rem))] items-center gap-4 rounded-pill border px-5 py-3 shadow-nivel2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-medium">
              {liberado ? 'Explicação concluída' : 'Leia a explicação até o fim para liberar'}
            </p>
            <p className="truncate text-[11.5px] text-texto3">
              {liberado ? `${etapa.requisitos.length} requisitos aguardando verificação` : 'Role a página para continuar'}
            </p>
          </div>
          <Botao variante="primario" tamanho="m" onClick={aoIniciar} disabled={!liberado}>
            {liberado ? <IconeCheck tamanho={16} /> : null}
            Iniciar verificação
            <IconeSeta tamanho={16} />
          </Botao>
        </div>
      </motion.div>
    </div>
  );
}

function Bloco({
  titulo, itens, marcador, aspas = false
}: { titulo: string; itens: string[]; marcador: 'acento' | 'verde' | 'ambar' | 'neutro'; aspas?: boolean }) {
  const cores = {
    acento: 'bg-acento/60', verde: 'bg-verde/60', ambar: 'bg-ambar/60', neutro: 'bg-texto3/50'
  };
  return (
    <div className="cartao p-6">
      <h3 className="mb-3 text-[16px] font-semibold">{titulo}</h3>
      <ul className="space-y-2">
        {itens.map((i) => (
          <li key={i} className="flex gap-2.5 text-[14px] leading-snug text-texto2">
            <span className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${cores[marcador]}`} />
            {aspas ? <span className="italic">“{i}”</span> : i}
          </li>
        ))}
      </ul>
    </div>
  );
}
