#!/usr/bin/env node
/* ============================================================
   Baixa uma foto profissional para cada etapa e cada setor a
   partir do Unsplash (ou Pexels), guarda em public/etapas e
   atualiza o manifesto src/dados/imagens.ts.

   Uso:  UNSPLASH_ACCESS_KEY=xxx npm run imagens
         PEXELS_API_KEY=xxx      npm run imagens

   Sem chave o comando não faz nada e o sistema segue usando as
   ilustrações vetoriais — que continuam sendo o padrão visual.
   ============================================================ */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const destino = join(raiz, 'public', 'etapas');
const manifesto = join(raiz, 'src', 'dados', 'imagens.ts');

const UNSPLASH = process.env.UNSPLASH_ACCESS_KEY;
const PEXELS = process.env.PEXELS_API_KEY;

/* Os termos vêm dos próprios dados do sistema, sem duplicação. */
async function alvos() {
  const ts = await import('node:fs/promises');
  const ler = async (arq) => String(await ts.readFile(join(raiz, 'src', 'dados', arq), 'utf8'));

  const etapas = [...(await ler('etapas.ts')).matchAll(
    /slug:\s*'([^']+)'[\s\S]*?buscaImagem:\s*'([^']+)'/g
  )].map(([, slug, busca]) => ({ slug: `etapa-${slug}`, busca }));

  const setores = [...(await ler('normas.ts')).matchAll(
    /id:\s*'([^']+)',\s*nome:[\s\S]*?buscaImagem:\s*'([^']+)'/g
  )].map(([, id, busca]) => ({ slug: `setor-${id}`, busca }));

  return [...etapas, ...setores];
}

async function buscarUnsplash(termo) {
  const u = new URL('https://api.unsplash.com/search/photos');
  u.searchParams.set('query', termo);
  u.searchParams.set('per_page', '1');
  u.searchParams.set('orientation', 'landscape');
  u.searchParams.set('content_filter', 'high');
  const r = await fetch(u, { headers: { Authorization: `Client-ID ${UNSPLASH}` } });
  if (!r.ok) throw new Error(`Unsplash HTTP ${r.status}`);
  const d = await r.json();
  const foto = d.results?.[0];
  return foto && { url: `${foto.urls.raw}&w=1600&q=80&fm=jpg&fit=crop`, credito: `${foto.user.name} / Unsplash` };
}

async function buscarPexels(termo) {
  const u = new URL('https://api.pexels.com/v1/search');
  u.searchParams.set('query', termo);
  u.searchParams.set('per_page', '1');
  u.searchParams.set('orientation', 'landscape');
  const r = await fetch(u, { headers: { Authorization: PEXELS } });
  if (!r.ok) throw new Error(`Pexels HTTP ${r.status}`);
  const d = await r.json();
  const foto = d.photos?.[0];
  return foto && { url: foto.src.large2x, credito: `${foto.photographer} / Pexels` };
}

async function principal() {
  if (!UNSPLASH && !PEXELS) {
    console.log(
      'Nenhuma chave configurada (UNSPLASH_ACCESS_KEY ou PEXELS_API_KEY).\n' +
      'O sistema continua usando as ilustrações vetoriais próprias — nada a fazer.'
    );
    return;
  }

  await mkdir(destino, { recursive: true });
  const lista = await alvos();
  const creditos = [];
  const salvos = [];

  for (const { slug, busca } of lista) {
    const arquivo = join(destino, `${slug}.jpg`);
    if (existsSync(arquivo)) {
      salvos.push(slug);
      console.log(`· ${slug} já em cache`);
      continue;
    }
    try {
      const foto = UNSPLASH ? await buscarUnsplash(busca) : await buscarPexels(busca);
      if (!foto) { console.log(`· ${slug}: nenhum resultado para "${busca}"`); continue; }
      const img = await fetch(foto.url);
      if (!img.ok) throw new Error(`download HTTP ${img.status}`);
      await writeFile(arquivo, Buffer.from(await img.arrayBuffer()));
      salvos.push(slug);
      creditos.push(`${slug}: ${foto.credito}`);
      console.log(`✓ ${slug} — ${foto.credito}`);
    } catch (e) {
      console.log(`· ${slug}: ${e.message} (segue com a ilustração vetorial)`);
    }
    await new Promise((r) => setTimeout(r, 350)); // respeita o limite das APIs
  }

  await writeFile(manifesto,
    `/* Gerado por \`npm run imagens\` em ${new Date().toISOString()}. Não editar à mão. */\n\n` +
    `export const IMAGENS_EM_CACHE: string[] = ${JSON.stringify(salvos, null, 2)};\n\n` +
    `export const temFotoEmCache = (slug?: string) => Boolean(slug && IMAGENS_EM_CACHE.includes(slug));\n`
  );

  if (creditos.length) {
    await writeFile(join(destino, 'CREDITOS.txt'), creditos.join('\n') + '\n');
  }
  console.log(`\n${salvos.length} imagens em cache. Manifesto atualizado.`);
}

principal().catch((e) => { console.error(e); process.exit(1); });
