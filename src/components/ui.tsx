'use client';

import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

/* ───────────────────────────── Botão ───────────────────────────── */

type VarianteBotao = 'primario' | 'suave' | 'contorno' | 'texto' | 'perigo';
type TamanhoBotao = 'pp' | 'p' | 'm' | 'g';

const variantes: Record<VarianteBotao, string> = {
  primario: 'bg-acento text-white hover:bg-acentoescuro shadow-nivel1',
  suave: 'bg-texto/[.06] text-texto hover:bg-texto/[.11]',
  contorno: 'border border-texto/20 text-texto hover:bg-texto/[.06]',
  texto: 'text-acento hover:bg-acento/10',
  perigo: 'bg-vermelho/12 text-vermelho hover:bg-vermelho/20'
};
const tamanhos: Record<TamanhoBotao, string> = {
  pp: 'text-[12.5px] px-3 py-1.5',
  p: 'text-[13.5px] px-4 py-2',
  m: 'text-[15px] px-5 py-2.5',
  g: 'text-[17px] px-7 py-3.5'
};

export function Botao({
  variante = 'suave', tamanho = 'm', className = '', children, ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: VarianteBotao; tamanho?: TamanhoBotao }) {
  return (
    <button
      {...props}
      className={`inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-pill
                  font-medium transition-all duration-200 ease-apple active:scale-[.97]
                  disabled:pointer-events-none disabled:opacity-40
                  ${variantes[variante]} ${tamanhos[tamanho]} ${className}`}
    >
      {children}
    </button>
  );
}

/* ───────────────────────────── Cartão ───────────────────────────── */

export function Cartao({
  children, className = '', animar = false, atraso = 0
}: { children: ReactNode; className?: string; animar?: boolean; atraso?: number }) {
  if (!animar) return <div className={`cartao p-6 ${className}`}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: atraso, ease: [0.32, 0.72, 0, 1] }}
      className={`cartao p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ───────────────────────────── Etiqueta ───────────────────────────── */

type TomEtiqueta = 'neutro' | 'acento' | 'verde' | 'vermelho' | 'ambar' | 'roxo';
const tons: Record<TomEtiqueta, string> = {
  neutro: 'bg-texto/[.07] text-texto2',
  acento: 'bg-acento/12 text-acento',
  verde: 'bg-verde/15 text-verde',
  vermelho: 'bg-vermelho/15 text-vermelho',
  ambar: 'bg-ambar/15 text-ambar',
  roxo: 'bg-roxo/15 text-roxo'
};

export function Etiqueta({ tom = 'neutro', children, className = '' }: { tom?: TomEtiqueta; children: ReactNode; className?: string }) {
  return <span className={`etiqueta ${tons[tom]} ${className}`}>{children}</span>;
}

/* ───────────────────────────── Campos ───────────────────────────── */

export function Campo({ rotulo, dica, ...props }: InputHTMLAttributes<HTMLInputElement> & { rotulo?: string; dica?: string }) {
  return (
    <label className="block">
      {rotulo && <span className="rotulo">{rotulo}</span>}
      <input {...props} className={`campo ${props.className ?? ''}`} />
      {dica && <span className="mt-1.5 block text-[12px] text-texto3">{dica}</span>}
    </label>
  );
}

export function AreaTexto({ rotulo, dica, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { rotulo?: string; dica?: string }) {
  return (
    <label className="block">
      {rotulo && <span className="rotulo">{rotulo}</span>}
      <textarea {...props} className={`campo min-h-[92px] resize-y leading-relaxed ${props.className ?? ''}`} />
      {dica && <span className="mt-1.5 block text-[12px] text-texto3">{dica}</span>}
    </label>
  );
}

export function Selecao({
  rotulo, opcoes, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { rotulo?: string; opcoes: { valor: string; texto: string }[] }) {
  return (
    <label className="block">
      {rotulo && <span className="rotulo">{rotulo}</span>}
      <select {...props} className={`campo cursor-pointer appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10 ${props.className ?? ''}`}
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%238e8e93' d='M4 6l4 4 4-4'/%3E%3C/svg%3E")` }}>
        {opcoes.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
    </label>
  );
}

/* ───────────────────────────── Progresso ───────────────────────────── */

export function Barra({ valor, tom = 'acento', altura = 6 }: { valor: number; tom?: 'acento' | 'verde' | 'ambar'; altura?: number }) {
  const cores = { acento: 'bg-acento', verde: 'bg-verde', ambar: 'bg-ambar' };
  return (
    <div className="w-full overflow-hidden rounded-pill bg-texto/[.08]" style={{ height: altura }}>
      <motion.div
        className={`h-full rounded-pill ${cores[tom]}`}
        initial={false}
        animate={{ width: `${Math.min(100, Math.max(0, valor))}%` }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      />
    </div>
  );
}

export function Anel({
  valor, tamanho = 96, espessura = 9, cor = 'rgb(var(--acento))', children
}: { valor: number; tamanho?: number; espessura?: number; cor?: string; children?: ReactNode }) {
  const r = (tamanho - espessura) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: tamanho, height: tamanho }}>
      <svg width={tamanho} height={tamanho} className="-rotate-90">
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" strokeWidth={espessura} className="stroke-texto/[.09]" />
        <motion.circle
          cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke={cor} strokeWidth={espessura} strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c - (c * Math.min(100, Math.max(0, valor))) / 100 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        />
      </svg>
      <div className="absolute grid place-items-center text-center">{children}</div>
    </div>
  );
}

/* ───────────────────────────── Avatar / vazio ───────────────────────────── */

export function Avatar({ nome, tamanho = 32 }: { nome: string; tamanho?: number }) {
  const iniciais = nome.split(/[\s.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-acento to-roxo font-semibold text-white"
      style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.38 }}
    >
      {iniciais}
    </span>
  );
}

export function Vazio({ titulo, descricao, acao }: { titulo: string; descricao: string; acao?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-xl2 border border-dashed px-6 py-16 text-center">
      <p className="text-[17px] font-semibold text-texto">{titulo}</p>
      <p className="mx-auto mt-1.5 max-w-md text-[14px] text-texto3">{descricao}</p>
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  );
}
