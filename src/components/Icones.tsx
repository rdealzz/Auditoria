'use client';
/* Ícones de traço fino, na linha do SF Symbols. */

type Props = { tamanho?: number; className?: string; strokeWidth?: number };

const base = (t: number, sw: number, className: string) => ({
  width: t, height: t, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, className, 'aria-hidden': true
});

export const IconePainel = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><rect x="3" y="3" width="7" height="8" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="11" width="7" height="10" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
);
export const IconeMais = ({ tamanho = 20, className = '', strokeWidth = 1.9 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M12 5v14M5 12h14"/></svg>
);
export const IconeHistorico = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v4h4"/><path d="M12 7v5l3 2"/></svg>
);
export const IconeGrafico = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>
);
export const IconeCheck = ({ tamanho = 20, className = '', strokeWidth = 2.1 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M4 12.5l5 5L20 6.5"/></svg>
);
export const IconeX = ({ tamanho = 20, className = '', strokeWidth = 2 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M6 6l12 12M18 6L6 18"/></svg>
);
export const IconeAlerta = ({ tamanho = 20, className = '', strokeWidth = 1.8 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M12 3.5L21.5 20h-19L12 3.5z"/><path d="M12 9.5v4.5"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>
);
export const IconeOlho = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.8"/></svg>
);
export const IconeMenos = ({ tamanho = 20, className = '', strokeWidth = 2 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M6 12h12"/></svg>
);
export const IconeSeta = ({ tamanho = 20, className = '', strokeWidth = 1.9 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M5 12h13M13 6l6 6-6 6"/></svg>
);
export const IconeVoltar = ({ tamanho = 20, className = '', strokeWidth = 1.9 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M19 12H6M11 6l-6 6 6 6"/></svg>
);
export const IconeDoc = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>
);
export const IconeCamera = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.9l1.3-2h6.6l1.3 2h1.9A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-9z"/><circle cx="12" cy="13" r="3.4"/></svg>
);
export const IconeFaisca = ({ tamanho = 20, className = '', strokeWidth = 1.6 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M12 2.5l2.1 5.9 5.9 2.1-5.9 2.1L12 18.5l-2.1-5.9L4 10.5l5.9-2.1L12 2.5z"/><path d="M19 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/></svg>
);
export const IconeSol = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>
);
export const IconeLua = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>
);
export const IconeSair = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 8l-4 4 4 4M6 12h9"/></svg>
);
export const IconeCadeado = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
);
export const IconeUsuario = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></svg>
);
export const IconeImprimir = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>
);
export const IconeRelogio = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><circle cx="12" cy="12" r="9"/><path d="M12 7v5.3l3.3 2"/></svg>
);
export const IconeEscudo = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M12 2.5l8 3v6c0 5-3.4 8.9-8 10-4.6-1.1-8-5-8-10v-6l8-3z"/><path d="M8.8 12l2.2 2.2 4.2-4.4"/></svg>
);
export const IconeLixeira = ({ tamanho = 20, className = '', strokeWidth = 1.7 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6"/></svg>
);
export const IconeLupa = ({ tamanho = 20, className = '', strokeWidth = 1.8 }: Props) => (
  <svg {...base(tamanho, strokeWidth, className)}><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>
);
