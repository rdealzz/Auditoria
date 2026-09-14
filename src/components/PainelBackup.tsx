'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '@/app/provedores';
import type { Auditoria } from '@/lib/tipos';
import { formatarDataHora, listarAuditorias } from '@/lib/armazenamento';
import {
  analisar, baixar, ESTRATEGIAS, formatarTamanho, importar, lerPacote, montarPacote,
  nomeDoArquivo, tamanhoDoPacote, type Balanco, type Estrategia, type Pacote, type Previa
} from '@/lib/backup';
import { Botao, Cartao } from './ui';
import { Aviso } from './MolduraAcesso';
import { IconeAlerta, IconeCheck, IconeDoc, IconeSeta } from './Icones';

/** Caixa de marcar no estilo do restante da interface. */
function Marcar({ marcado, aoMudar, titulo, descricao }: {
  marcado: boolean; aoMudar: (v: boolean) => void; titulo: string; descricao: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={marcado} onChange={(e) => aoMudar(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[6px] border transition-colors duration-200
          peer-focus-visible:ring-2 peer-focus-visible:ring-acento/50
          ${marcado ? 'border-acento bg-acento text-white' : 'border-texto/25 text-transparent'}`}
      >
        <IconeCheck tamanho={11} strokeWidth={3} />
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] text-texto">{titulo}</span>
        <span className="block text-[12.5px] leading-snug text-texto3">{descricao}</span>
      </span>
    </label>
  );
}

export default function PainelBackup() {
  const { usuario, avisar } = useApp();
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);

  // exportar
  const [comAnexos, setComAnexos] = useState(true);
  const [comPreferencias, setComPreferencias] = useState(true);
  const [tamanho, setTamanho] = useState(0);

  // importar
  const entrada = useRef<HTMLInputElement>(null);
  const [pacote, setPacote] = useState<Pacote | null>(null);
  const [previa, setPrevia] = useState<Previa | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [estrategia, setEstrategia] = useState<Estrategia>('recente');
  const [trazerPreferencias, setTrazerPreferencias] = useState(false);
  const [erro, setErro] = useState('');
  const [balanco, setBalanco] = useState<Balanco | null>(null);

  useEffect(() => {
    const carregar = () => setAuditorias(listarAuditorias());
    carregar();
    window.addEventListener('auditoria:alterado', carregar);
    return () => window.removeEventListener('auditoria:alterado', carregar);
  }, []);

  // O tamanho do arquivo muda conforme as fotos entram ou não.
  useEffect(() => {
    if (!auditorias.length) { setTamanho(0); return; }
    setTamanho(tamanhoDoPacote(montarPacote(auditorias, {
      incluirAnexos: comAnexos, incluirPreferencias: comPreferencias
    })));
  }, [auditorias, comAnexos, comPreferencias]);

  function exportar() {
    const p = montarPacote(auditorias, {
      incluirAnexos: comAnexos,
      incluirPreferencias: comPreferencias,
      geradoPor: usuario ? { usuario: usuario.usuario, nome: usuario.nome } : undefined
    });
    baixar(p, nomeDoArquivo(auditorias));
    avisar(`${auditorias.length} ${auditorias.length === 1 ? 'auditoria exportada' : 'auditorias exportadas'}.`);
  }

  async function escolherArquivo(arquivo: File | undefined) {
    // Zera o campo: sem isso, escolher o MESMO arquivo de novo não dispara nada.
    if (entrada.current) entrada.current.value = '';
    if (!arquivo) return;
    setErro(''); setBalanco(null); setPacote(null); setPrevia(null);
    try {
      const lido = lerPacote(await arquivo.text());
      if (!lido.ok) { setErro(lido.erro); return; }
      setPacote(lido.valor);
      setPrevia(analisar(lido.valor));
      setNomeArquivo(arquivo.name);
      setTrazerPreferencias(false);
    } catch {
      setErro('Não foi possível ler o arquivo.');
    }
  }

  function confirmarImportacao() {
    if (!pacote) return;
    const r = importar(pacote, { estrategia, trazerPreferencias });
    if (!r.ok) { setErro(r.erro); return; }
    setBalanco(r.valor);
    setPacote(null);
    setPrevia(null);
    setAuditorias(listarAuditorias());
    avisar('Importação concluída.');
  }

  function cancelar() {
    setPacote(null); setPrevia(null); setErro('');
  }

  return (
    <div className="space-y-4">
      {/* ── Exportar ── */}
      <Cartao animar>
        <h2 className="text-[17px] font-semibold text-texto">Exportar auditorias</h2>
        <p className="mt-1 text-[13.5px] leading-snug text-texto3">
          Baixa um arquivo <code className="rounded bg-texto/[.07] px-1 py-0.5 text-[12px]">.json</code> com
          todas as auditorias deste aparelho. Guarde como cópia de segurança ou abra em outro aparelho
          pela importação abaixo. O arquivo não contém contas nem senhas.
        </p>

        {auditorias.length === 0 ? (
          <p className="mt-4 rounded-xl2 border border-dashed px-4 py-6 text-center text-[13.5px] text-texto3">
            Nenhuma auditoria para exportar ainda.
          </p>
        ) : (
          <>
            <div className="mt-5 space-y-3">
              <Marcar
                marcado={comAnexos} aoMudar={setComAnexos}
                titulo="Incluir as fotos e evidências"
                descricao="Sem elas o arquivo fica bem menor, mas as evidências chegam só como registro do nome."
              />
              <Marcar
                marcado={comPreferencias} aoMudar={setComPreferencias}
                titulo="Incluir empresa e auditor padrão"
                descricao="Os valores que já vêm preenchidos ao criar uma auditoria."
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Botao variante="primario" onClick={exportar}>
                <IconeDoc tamanho={16} />Exportar {auditorias.length} {auditorias.length === 1 ? 'auditoria' : 'auditorias'}
              </Botao>
              <span className="text-[12.5px] tabular-nums text-texto3">≈ {formatarTamanho(tamanho)}</span>
            </div>
          </>
        )}
      </Cartao>

      {/* ── Importar ── */}
      <Cartao animar atraso={0.08}>
        <h2 className="text-[17px] font-semibold text-texto">Importar auditorias</h2>
        <p className="mt-1 text-[13.5px] leading-snug text-texto3">
          Abra um arquivo exportado por este sistema. Nada é gravado antes de você conferir o resumo.
        </p>

        <input
          ref={entrada} type="file" accept="application/json,.json" className="hidden"
          onChange={(e) => escolherArquivo(e.target.files?.[0])}
        />

        {!previa && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Botao variante="suave" onClick={() => entrada.current?.click()}>Escolher arquivo</Botao>
            {nomeArquivo && !erro && !balanco && <span className="text-[12.5px] text-texto3">{nomeArquivo}</span>}
          </div>
        )}

        {erro && <div className="mt-4"><Aviso texto={erro} /></div>}

        <AnimatePresence>
          {previa && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-5 rounded-xl2 border bg-afundado/50 p-5"
            >
              <p className="text-[13px] text-texto3">
                <strong className="font-medium text-texto">{nomeArquivo}</strong>
                {' · '}gerado em {formatarDataHora(previa.geradoEm)}
                {previa.geradoPor?.nome ? ` por ${previa.geradoPor.nome}` : ''}
              </p>

              <div className="mt-4 flex flex-wrap gap-6">
                <div>
                  <p className="text-[22px] font-semibold tabular-nums text-texto">{previa.novas.length}</p>
                  <p className="text-[11.5px] text-texto3">{previa.novas.length === 1 ? 'auditoria nova' : 'auditorias novas'}</p>
                </div>
                <div>
                  <p className="text-[22px] font-semibold tabular-nums text-texto">{previa.repetidas.length}</p>
                  <p className="text-[11.5px] text-texto3">já {previa.repetidas.length === 1 ? 'existe aqui' : 'existem aqui'}</p>
                </div>
              </div>

              {!previa.incluiAnexos && (
                <p className="mt-4 flex items-start gap-2 rounded-xl bg-ambar/12 px-3.5 py-2.5 text-[12.5px] leading-snug text-ambar">
                  <IconeAlerta tamanho={15} className="mt-0.5 shrink-0" />
                  Este arquivo foi exportado sem as fotos: as evidências entram só como registro do nome.
                </p>
              )}

              {previa.repetidas.length > 0 && (
                <div className="mt-5">
                  <p className="rotulo">O que fazer com as {previa.repetidas.length} repetidas?</p>
                  <div className="grid gap-2">
                    {ESTRATEGIAS.map((op) => (
                      <label
                        key={op.valor}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors duration-200
                          ${estrategia === op.valor ? 'border-acento bg-acento/[.07]' : 'hover:bg-texto/[.04]'}`}
                      >
                        <input
                          type="radio" name="estrategia" value={op.valor}
                          checked={estrategia === op.valor}
                          onChange={() => setEstrategia(op.valor)}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden
                          className={`mt-0.5 grid h-[17px] w-[17px] shrink-0 place-items-center rounded-full border transition-colors
                            ${estrategia === op.valor ? 'border-acento' : 'border-texto/25'}`}
                        >
                          {estrategia === op.valor && <span className="h-[9px] w-[9px] rounded-full bg-acento" />}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[14px] text-texto">{op.texto}</span>
                          <span className="block text-[12.5px] leading-snug text-texto3">{op.explicacao}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {previa.temPreferencias && (
                <div className="mt-4">
                  <Marcar
                    marcado={trazerPreferencias} aoMudar={setTrazerPreferencias}
                    titulo="Trazer também empresa e auditor padrão"
                    descricao="Substitui os valores que já vêm preenchidos ao criar uma auditoria neste aparelho."
                  />
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <Botao variante="primario" onClick={confirmarImportacao}>
                  Importar {previa.total} {previa.total === 1 ? 'auditoria' : 'auditorias'}<IconeSeta tamanho={16} />
                </Botao>
                <Botao variante="suave" onClick={cancelar}>Cancelar</Botao>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {balanco && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-xl2 bg-verde/10 p-5 text-[13.5px] leading-relaxed text-texto2"
          >
            <p className="flex items-center gap-2 font-medium text-verde">
              <IconeCheck tamanho={16} strokeWidth={2.4} />Importação concluída
            </p>
            <ul className="mt-2 space-y-0.5 tabular-nums">
              <li>{balanco.novas} {balanco.novas === 1 ? 'auditoria adicionada' : 'auditorias adicionadas'}</li>
              {balanco.atualizadas > 0 && <li>{balanco.atualizadas} atualizada(s) pela versão do arquivo</li>}
              {balanco.mantidas > 0 && <li>{balanco.mantidas} mantida(s) como estavam neste aparelho</li>}
              {balanco.copias > 0 && <li>{balanco.copias} importada(s) como cópia separada</li>}
            </ul>
          </motion.div>
        )}
      </Cartao>
    </div>
  );
}
