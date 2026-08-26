/* ============================================================
   imagens.ts — Manifesto das fotos em cache local.
   Gerado por `npm run imagens` (Unsplash/Pexels → public/etapas).
   Enquanto vazio, o sistema usa as ilustrações vetoriais próprias,
   que são a arte padrão e nunca dependem de rede.
   ============================================================ */

export const IMAGENS_EM_CACHE: string[] = [];

export const temFotoEmCache = (slug?: string) => Boolean(slug && IMAGENS_EM_CACHE.includes(slug));
