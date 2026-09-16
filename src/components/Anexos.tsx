'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Anexo } from '@/lib/tipos';
import { EVENTO_SEM_ESPACO, idNovo } from '@/lib/armazenamento';
import { perguntarIA } from '@/lib/assistente';
import { Botao, Etiqueta } from './ui';
import { IconeCamera, IconeDoc, IconeFaisca, IconeLixeira } from './Icones';

const LIMITE_ARQUIVO = 12 * 1024 * 1024; // 12 MB
const LADO_MAXIMO = 1600;                 // px — imagens são reduzidas antes de guardar

/** Reduz e recomprime a imagem para caber no armazenamento local sem perder legibilidade. */
async function comprimirImagem(arquivo: File): Promise<string> {
  const url = URL.createObjectURL(arquivo);
  try {
    const img = await new Promise<HTMLImageElement>((ok, falha) => {
      const i = new Image();
      i.onload = () => ok(i);
      i.onerror = falha;
      i.src = url;
    });
    const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * escala);
    c.height = Math.round(img.height * escala);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.72);
  } finally {
    URL.revokeObjectURL(url);
  }
}

const formatarTamanho = (b: number) => (b < 1024 * 1024 ? `${Math.round(b / 1024)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`);

type Props = {
  anexos: Anexo[];
  aoMudar: (anexos: Anexo[]) => void;
  contexto?: Record<string, unknown>;
};

export default function Anexos({ anexos, aoMudar, contexto }: Props) {
  const entrada = useRef<HTMLInputElement>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');

  async function receber(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    setOcupado(true);
    setErro('');
    const novos: Anexo[] = [];

    for (const arquivo of Array.from(arquivos)) {
      if (arquivo.size > LIMITE_ARQUIVO) {
        setErro(`"${arquivo.name}" excede 12 MB e não foi anexado.`);
        continue;
      }
      const ehImagem = arquivo.type.startsWith('image/');
      let dataUrl: string | undefined;
      try {
        dataUrl = ehImagem
          ? await comprimirImagem(arquivo)
          : arquivo.size <= 2 * 1024 * 1024
            ? await lerComoDataUrl(arquivo)
            : undefined; // arquivos grandes ficam registrados por referência
      } catch {
        dataUrl = undefined;
      }

      const anexo: Anexo = {
        id: idNovo(),
        nome: arquivo.name,
        tipo: arquivo.type || 'application/octet-stream',
        tamanho: arquivo.size,
        dataUrl,
        criadoEm: new Date().toISOString()
      };

      // O assistente sugere o que verificar nesta evidência.
      const r = await perguntarIA({ tipo: 'analisar_foto', texto: arquivo.name, contexto });
      anexo.sugestoesIA = r.itens ?? (r.texto ? [r.texto] : []);
      novos.push(anexo);
    }

    // Se o aparelho não tiver espaço, a evidência não pode ficar na tela como
    // se tivesse sido guardada — desfazemos e dizemos o que aconteceu.
    const guardou = await aplicar([...anexos, ...novos]);
    if (!guardou) {
      aoMudar(anexos);
      setErro(
        novos.length === 1
          ? 'Sem espaço neste aparelho: a foto não foi guardada. Exporte as auditorias em Minha conta e apague as antigas no Histórico.'
          : 'Sem espaço neste aparelho: as fotos não foram guardadas. Exporte as auditorias em Minha conta e apague as antigas no Histórico.'
      );
    }

    setOcupado(false);
    if (entrada.current) entrada.current.value = '';
  }

  /** Aplica a mudança e observa se a gravação no aparelho deu certo. */
  async function aplicar(lista: Anexo[]) {
    let falhou = false;
    const marcar = () => { falhou = true; };
    window.addEventListener(EVENTO_SEM_ESPACO, marcar);
    aoMudar(lista);
    await new Promise((r) => setTimeout(r, 150)); // tempo do salvamento acontecer
    window.removeEventListener(EVENTO_SEM_ESPACO, marcar);
    return !falhou;
  }

  return (
    <div>
      <input
        ref={entrada} type="file" multiple className="hidden"
        accept="image/*,application/pdf,video/*,.doc,.docx,.xls,.xlsx,.txt"
        onChange={(e) => receber(e.target.files)}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Botao type="button" variante="suave" tamanho="p" onClick={() => entrada.current?.click()} disabled={ocupado}>
          <IconeCamera tamanho={15} />{ocupado ? 'Anexando…' : 'Anexar evidência'}
        </Botao>
        <span className="text-[11.5px] text-texto3">Fotos, PDF, vídeos e documentos</span>
      </div>

      {erro && <p className="mt-2 text-[12px] text-vermelho">{erro}</p>}

      <AnimatePresence>
        {anexos.length > 0 && (
          <motion.ul
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-3 grid gap-2.5 sm:grid-cols-2"
          >
            {anexos.map((a) => (
              <motion.li
                key={a.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                className="overflow-hidden rounded-xl border bg-afundado/60"
              >
                {a.dataUrl && a.tipo.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.dataUrl} alt={a.nome} className="h-32 w-full object-cover" />
                ) : (
                  <div className="grid h-32 place-items-center text-texto3"><IconeDoc tamanho={26} /></div>
                )}

                <div className="p-3">
                  <div className="flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium">{a.nome}</p>
                      <p className="text-[11px] text-texto3">
                        {formatarTamanho(a.tamanho)}{!a.dataUrl && ' · registrado por referência'}
                      </p>
                    </div>
                    <button
                      onClick={() => aoMudar(anexos.filter((x) => x.id !== a.id))}
                      aria-label={`Remover ${a.nome}`}
                      className="shrink-0 rounded-lg p-1.5 text-texto3 transition-colors hover:bg-vermelho/12 hover:text-vermelho"
                    >
                      <IconeLixeira tamanho={14} />
                    </button>
                  </div>

                  {a.sugestoesIA && a.sugestoesIA.length > 0 && (
                    <div className="mt-2.5 rounded-lg bg-roxo/[.08] p-2.5">
                      <Etiqueta tom="roxo" className="mb-1.5"><IconeFaisca tamanho={11} />Verificar nesta evidência</Etiqueta>
                      <ul className="space-y-1">
                        {a.sugestoesIA.slice(0, 4).map((s, i) => (
                          <li key={i} className="flex gap-1.5 text-[11.5px] leading-snug text-texto2">
                            <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-roxo/60" />{s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function lerComoDataUrl(arquivo: File): Promise<string> {
  return new Promise((ok, falha) => {
    const l = new FileReader();
    l.onload = () => ok(String(l.result));
    l.onerror = falha;
    l.readAsDataURL(arquivo);
  });
}
