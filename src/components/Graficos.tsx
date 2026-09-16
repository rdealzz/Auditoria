'use client';

import { motion } from 'framer-motion';

/* Gráficos próprios em SVG: leves, com animação suave e coerentes nos dois temas. */

const CORES = ['rgb(var(--acento))', 'rgb(var(--verde))', 'rgb(var(--ambar))', 'rgb(var(--roxo))', 'rgb(var(--vermelho))'];

export function GraficoBarras({
  dados, altura = 200, cor
}: { dados: { rotulo: string; valor: number }[]; altura?: number; cor?: string }) {
  const max = Math.max(1, ...dados.map((d) => d.valor));
  const total = dados.reduce((n, d) => n + d.valor, 0);
  // Um gráfico inteiro em zero não comunica nada: mostra o estado vazio.
  if (!dados.length || total === 0) return <SemDados altura={altura} />;

  return (
    <div className="w-full">
      {/* items-stretch mantém as colunas com a altura total, para que a % da barra resolva */}
      <div className="flex items-stretch gap-2 sm:gap-3" style={{ height: altura }}>
        {dados.map((d, i) => (
          // A chave usa a posição: dois rótulos iguais (dois "Ana") são legítimos.
          <div key={`${d.rotulo}-${i}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[12px] font-semibold tabular-nums text-texto2">{d.valor}</span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(3, (d.valor / max) * 100)}%` }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.32, 0.72, 0, 1] }}
              className="w-full rounded-t-lg"
              style={{ background: cor ?? CORES[i % CORES.length], minHeight: 4 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex gap-2 border-t pt-2.5 sm:gap-3">
        {dados.map((d, i) => (
          <p key={`${d.rotulo}-${i}`} className="min-w-0 flex-1 truncate text-center text-[11px] text-texto3" title={d.rotulo}>
            {d.rotulo}
          </p>
        ))}
      </div>
    </div>
  );
}

export function GraficoRosca({
  dados, tamanho = 190
}: { dados: { rotulo: string; valor: number; cor: string }[]; tamanho?: number }) {
  const total = dados.reduce((s, d) => s + d.valor, 0);
  const r = tamanho / 2 - 20;
  const c = 2 * Math.PI * r;
  let acumulado = 0;

  if (!total) return <SemDados altura={tamanho} />;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="relative" style={{ width: tamanho, height: tamanho }}>
        <svg width={tamanho} height={tamanho} className="-rotate-90">
          {dados.filter((d) => d.valor > 0).map((d, i) => {
            const fracao = d.valor / total;
            const offset = c * (1 - acumulado);
            acumulado += fracao;
            return (
              <motion.circle
                key={`${d.rotulo}-${i}`}
                cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none"
                stroke={d.cor} strokeWidth={22} strokeLinecap="butt"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c, opacity: 0 }}
                animate={{ strokeDashoffset: c - c * fracao, opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.32, 0.72, 0, 1] }}
                style={{ transformOrigin: 'center', transform: `rotate(${(1 - offset / c) * 360}deg)` }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[26px] font-semibold tabular-nums leading-none text-texto">{total}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-texto3">itens</p>
          </div>
        </div>
      </div>
      <ul className="space-y-2">
        {dados.map((d, i) => (
          <li key={`${d.rotulo}-${i}`} className="flex items-center gap-2.5 text-[13px]">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: d.cor }} />
            <span className="text-texto2">{d.rotulo}</span>
            <span className="ml-auto pl-3 font-semibold tabular-nums text-texto">{d.valor}</span>
            <span className="w-11 text-right text-[11.5px] tabular-nums text-texto3">
              {total ? Math.round((d.valor / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GraficoLinha({
  dados, altura = 170
}: { dados: { rotulo: string; valor: number }[]; altura?: number }) {
  if (dados.length < 2) return <SemDados altura={altura} />;
  const L = 600, A = 160, pad = 14;
  const max = Math.max(...dados.map((d) => d.valor), 100);
  const pontos = dados.map((d, i) => ({
    x: pad + (i * (L - pad * 2)) / (dados.length - 1),
    y: A - pad - (d.valor / max) * (A - pad * 2)
  }));
  const linha = pontos.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${linha} L${pontos.at(-1)!.x.toFixed(1)} ${A} L${pontos[0].x.toFixed(1)} ${A} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${L} ${A}`} style={{ height: altura }} className="w-full overflow-visible">
        <defs>
          <linearGradient id="grad-linha" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgb(var(--acento))" stopOpacity=".28" />
            <stop offset="1" stopColor="rgb(var(--acento))" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad} x2={L - pad} y1={pad + f * (A - pad * 2)} y2={pad + f * (A - pad * 2)}
                stroke="currentColor" className="text-texto/[.07]" strokeWidth="1" />
        ))}
        <motion.path d={area} fill="url(#grad-linha)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9 }} />
        <motion.path d={linha} fill="none" stroke="rgb(var(--acento))" strokeWidth="2.6"
          strokeLinecap="round" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }} />
        {pontos.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="rgb(var(--fundo))" stroke="rgb(var(--acento))" strokeWidth="2.6" />
        ))}
      </svg>
      <div className="mt-1.5 flex justify-between px-1 text-[11px] text-texto3">
        {dados.map((d, i) => <span key={`${d.rotulo}-${i}`}>{d.rotulo}</span>)}
      </div>
    </div>
  );
}

function SemDados({ altura }: { altura: number }) {
  return (
    <div className="grid place-items-center rounded-xl border border-dashed text-[13px] text-texto3" style={{ height: altura }}>
      Sem dados suficientes ainda
    </div>
  );
}
