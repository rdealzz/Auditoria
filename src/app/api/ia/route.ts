import { NextResponse } from 'next/server';
import { ETAPAS } from '@/dados/etapas';

export const runtime = 'nodejs';

type Pedido = { tipo: string; texto?: string; contexto?: Record<string, any> };
type Resposta = { texto: string; itens?: string[]; motor: 'openai' | 'local' };

const MODELO = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const PAPEL = `Você é um auditor líder da qualidade com 20 anos de experiência em ISO 9001, IATF 16949 e ISO 17025.
Responde em português do Brasil, com objetividade técnica e sem floreio.
Nunca inventa evidência: se faltar informação, diz exatamente o que precisa ser levantado.
Descreve fatos e processos, nunca culpa pessoas.`;

export async function POST(req: Request) {
  let pedido: Pedido;
  try {
    pedido = (await req.json()) as Pedido;
  } catch {
    return NextResponse.json({ texto: 'Pedido inválido.', motor: 'local' } as Resposta, { status: 400 });
  }

  const chave = process.env.OPENAI_API_KEY;
  if (chave) {
    try {
      const texto = await viaOpenAI(chave, pedido);
      if (texto) return NextResponse.json({ texto, motor: 'openai' } as Resposta);
    } catch (e) {
      console.warn('OpenAI indisponível; usando motor local.', e);
    }
  }
  return NextResponse.json(motorLocal(pedido));
}

/* ─────────────────────────── OpenAI ─────────────────────────── */

async function viaOpenAI(chave: string, pedido: Pedido): Promise<string | null> {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` },
    body: JSON.stringify({
      model: MODELO,
      temperature: 0.3,
      max_tokens: 700,
      messages: [
        { role: 'system', content: PAPEL },
        { role: 'user', content: montarPrompt(pedido) }
      ]
    })
  });
  if (!r.ok) throw new Error(`OpenAI HTTP ${r.status}`);
  const dados = await r.json();
  return dados?.choices?.[0]?.message?.content?.trim() ?? null;
}

function montarPrompt(p: Pedido) {
  const ctx = JSON.stringify(p.contexto ?? {}, null, 1);
  const mapa: Record<string, string> = {
    melhorar_nc:
      `Reescreva a constatação abaixo como uma não conformidade de auditoria bem redigida, na estrutura:\n` +
      `1) Constatação (fato observado, com local, documento, número e data quando houver)\n` +
      `2) Evidência objetiva\n` +
      `3) Requisito descumprido (cite a cláusula)\n` +
      `Não sugira a ação corretiva — isso cabe ao auditado.\n\nRascunho: "${p.texto}"\n\nContexto:\n${ctx}`,
    observacao_tecnica: `Gere uma observação técnica curta (2 a 3 frases) sobre este item de auditoria.\n\nAnotação: "${p.texto}"\n\nContexto:\n${ctx}`,
    oportunidade: `Sugira 3 oportunidades de melhoria objetivas e aplicáveis para este item, em tópicos curtos.\n\nSituação: "${p.texto}"\n\nContexto:\n${ctx}`,
    explicar_requisito: `Explique este requisito da norma em linguagem simples para alguém sem experiência em auditoria, e diga o que pedir na prática.\n\nContexto:\n${ctx}`,
    duvida: `Dúvida do auditor durante a auditoria: "${p.texto}"\n\nContexto:\n${ctx}\n\nResponda de forma prática e direta.`,
    resumir_evidencias: `Resuma as evidências coletadas abaixo em um parágrafo objetivo para o relatório.\n\n${p.texto}\n\nContexto:\n${ctx}`,
    plano_acao: `Monte um plano de ação 5W2H para tratar esta não conformidade. Devolva os campos O quê, Por quê, Onde, Quando, Quem, Como e Quanto.\n\nNC: "${p.texto}"\n\nContexto:\n${ctx}`,
    relatorio: `Escreva a conclusão do relatório desta auditoria: desempenho geral, principais pontos de atenção e recomendação. Máximo 3 parágrafos.\n\nDados:\n${ctx}`,
    analisar_foto: `A partir do nome do arquivo e do contexto, liste o que o auditor deve verificar nessa evidência. Tópicos curtos.\n\nArquivo: "${p.texto}"\n\nContexto:\n${ctx}`
  };
  return mapa[p.tipo] ?? `${p.texto}\n\nContexto:\n${ctx}`;
}

/* ─────────────────────────── Motor local ─────────────────────────── */

function motorLocal(p: Pedido): Resposta {
  const c = p.contexto ?? {};
  const t = (p.texto ?? '').trim();

  switch (p.tipo) {
    case 'melhorar_nc':
      return { motor: 'local', texto: redigirNC(t, c) };

    case 'observacao_tecnica':
      return {
        motor: 'local',
        texto:
          `Durante a verificação do requisito ${c.clausula ?? ''} — ${c.titulo ?? ''} — constatou-se: ${t || 'situação a descrever'}. ` +
          `A situação foi discutida com o auditado no momento da constatação. ` +
          `Recomenda-se acompanhar este ponto na próxima auditoria para confirmar a estabilidade do controle.`
      };

    case 'oportunidade': {
      const itens = [
        `Padronizar a evidência do requisito ${c.clausula ?? ''} em um único formulário, evitando registros paralelos.`,
        `Incluir este ponto no checklist de verificação diária do setor, com responsável definido.`,
        `Treinar a equipe do turno na revisão vigente do documento aplicável e avaliar a eficácia após 30 dias.`
      ];
      return { motor: 'local', itens, texto: itens.map((i) => `• ${i}`).join('\n') };
    }

    case 'explicar_requisito':
      return { motor: 'local', texto: explicarRequisito(String(c.requisitoId ?? '')) };

    case 'plano_acao':
      return { motor: 'local', texto: JSON.stringify(gerarPlano(t, c)) };

    case 'resumir_evidencias':
      return {
        motor: 'local',
        texto:
          `Foram coletadas evidências documentais e fotográficas referentes aos requisitos verificados neste setor. ` +
          `${t || 'As evidências constam nos anexos desta auditoria.'} ` +
          `As evidências sustentam as constatações registradas e ficam retidas junto ao relatório.`
      };

    case 'relatorio':
      return { motor: 'local', texto: conclusaoRelatorio(c) };

    case 'analisar_foto':
      return { motor: 'local', ...analisarAnexo(t, c) };

    case 'duvida':
    default:
      return { motor: 'local', texto: responderDuvida(t) };
  }
}

function redigirNC(rascunho: string, c: Record<string, any>) {
  const local = c.setor ? `no setor de ${c.setor}` : 'no processo auditado';
  const data = new Date().toLocaleDateString('pt-BR');
  const evidencia = c.evidencia || 'evidência a ser complementada (documento, número, local e data)';
  return (
    `Constatação: durante a auditoria realizada em ${data}, ${local}, constatou-se que ` +
    `${rascunho.replace(/^[a-z]/, (m) => m.toLowerCase()) || 'a situação verificada diverge do requisito aplicável'}.\n\n` +
    `Evidência objetiva: ${evidencia}.\n\n` +
    `Requisito descumprido: ${c.clausula ?? '—'} — ${c.titulo ?? '—'}${c.norma ? ` (${c.norma})` : ''}.\n\n` +
    `Observação do assistente: verifique se a descrição contém local, documento com código e revisão, número de lote ou registro e data. ` +
    `Descreva o fato, nunca a pessoa, e não proponha a ação corretiva — ela cabe ao auditado.`
  );
}

function explicarRequisito(requisitoId: string) {
  for (const etapa of ETAPAS) {
    const r = etapa.requisitos.find((x) => x.id === requisitoId);
    if (r) {
      return (
        `Cláusula ${r.clausula} — ${r.titulo}\n\n` +
        `O que a norma pede: ${r.resumoNorma}\n\n` +
        `Em linguagem simples: ${r.explicacaoSimples}\n\n` +
        `Como verificar na prática:\n${r.comoVerificar.map((v) => `• ${v}`).join('\n')}\n\n` +
        `Evidência típica: ${r.evidenciaTipica}.`
      );
    }
  }
  return 'Selecione um requisito do checklist para ver a explicação detalhada.';
}

function gerarPlano(descricao: string, c: Record<string, any>) {
  const prazo = new Date();
  prazo.setDate(prazo.getDate() + 30);
  return {
    oQue: `Eliminar a causa da não conformidade referente à cláusula ${c.clausula ?? '—'}${c.titulo ? ` (${c.titulo})` : ''}.`,
    porQue: descricao || 'Assegurar a conformidade do processo com o requisito da norma e evitar reincidência.',
    onde: c.setor ? `Setor de ${c.setor}${c.processo ? ` — ${c.processo}` : ''}` : 'Setor auditado',
    quando: prazo.toISOString().slice(0, 10),
    quem: c.auditado || 'Responsável pelo setor',
    como: 'Analisar a causa raiz (5 porquês ou Ishikawa), definir e implementar a ação, treinar os envolvidos e verificar a eficácia com dados após a implantação.',
    quanto: 'A definir pelo responsável na análise de causa.',
    status: 'aberta' as const
  };
}

function conclusaoRelatorio(c: Record<string, any>) {
  const taxa = Number(c.taxaConformidade ?? 0);
  const nc = Number(c.totalNC ?? 0);
  const desempenho =
    taxa >= 90 ? 'desempenho consistente' : taxa >= 75 ? 'desempenho adequado, com pontos de atenção' : 'desempenho abaixo do esperado';
  const recomendacao =
    nc === 0
      ? 'Não foram identificadas não conformidades. Recomenda-se manter os controles atuais e acompanhar as oportunidades registradas.'
      : `Foram registradas ${nc} não conformidade(s). Recomenda-se que o setor conduza a análise de causa raiz e implemente as ações no prazo acordado, com verificação de eficácia antes do encerramento.`;

  return (
    `A auditoria do setor de ${c.setor ?? '—'} da empresa ${c.empresa ?? '—'}, realizada em ${c.data ?? '—'} tendo como critério ${c.criterio ?? 'a norma aplicável'}, ` +
    `apresentou taxa de conformidade de ${taxa}%, caracterizando ${desempenho}.\n\n` +
    `Os requisitos foram verificados nas dez etapas do roteiro, com amostragem de documentos, registros, instrumentos e entrevistas com os colaboradores do setor. ` +
    `As evidências objetivas que sustentam cada constatação estão registradas no checklist e nos anexos deste relatório.\n\n` +
    `${recomendacao} O resultado desta auditoria deve compor as entradas da análise crítica pela direção, conforme a cláusula 9.3.2.`
  );
}

/** Biblioteca de verificações por tipo de evidência reconhecida no nome do arquivo. */
const CATALOGO: { chaves: string[]; rotulo: string; itens: string[] }[] = [
  { chaves: ['extintor', 'incendio', 'fogo'], rotulo: 'Extintor de incêndio', itens: [
    'Verificar a validade da carga e do teste hidrostático',
    'Confirmar que o acesso está desobstruído e sinalizado',
    'Checar a sinalização de piso e de parede',
    'Conferir a identificação, o lacre e o manômetro na faixa verde',
    'Verificar o registro de inspeção periódica' ] },
  { chaves: ['paquimetro', 'micrometro', 'calibr', 'instrument', 'trena', 'torquimetro'], rotulo: 'Instrumento de medição', itens: [
    'Verificar a etiqueta de identificação e a data de validade da calibração',
    'Abrir o certificado e conferir se o número de série corresponde ao instrumento',
    'Confirmar a declaração de rastreabilidade do padrão utilizado',
    'Checar se existe critério de aceitação definido e se o erro está dentro dele',
    'Observar as condições físicas e o local de guarda' ] },
  { chaves: ['etiqueta', 'lote', 'identific', 'rastre'], rotulo: 'Identificação / rastreabilidade', itens: [
    'Confirmar se a identificação permite rastrear o lote de origem',
    'Verificar se o status de inspeção está visível',
    'Checar a durabilidade da identificação durante o manuseio',
    'Comparar a etiqueta com o registro do sistema' ] },
  { chaves: ['procedimento', 'instrucao', 'documento', 'it-', 'po-', 'manual'], rotulo: 'Documento controlado', itens: [
    'Conferir código, revisão, data e aprovação no cabeçalho',
    'Comparar a revisão encontrada com a vigente na lista mestra',
    'Verificar se está disponível no ponto de uso',
    'Confirmar se houve treinamento na revisão atual' ] },
  { chaves: ['epi', 'capacete', 'luva', 'oculos', 'protetor'], rotulo: 'EPI', itens: [
    'Verificar o CA do equipamento e sua validade',
    'Confirmar o registro de entrega ao colaborador',
    'Observar se o uso é efetivo e correto durante a operação',
    'Checar as condições de conservação e o local de guarda' ] },
  { chaves: ['maquina', 'equipamento', 'painel', 'motor', 'bomba'], rotulo: 'Equipamento', itens: [
    'Comparar os parâmetros do painel com a especificação do processo',
    'Verificar a identificação do equipamento e o plano de manutenção',
    'Conferir a última preventiva executada e as pendências',
    'Observar dispositivos de segurança ativos e não anulados' ] },
  { chaves: ['estoque', 'palete', 'prateleira', 'armazen', 'almox'], rotulo: 'Armazenagem', itens: [
    'Verificar identificação e status dos materiais armazenados',
    'Checar empilhamento, proteção e condições de preservação',
    'Confirmar o controle de validade e o PEPS',
    'Observar a separação entre material aprovado e segregado' ] },
  { chaves: ['registro', 'formulario', 'ficha', 'planilha', 'checklist'], rotulo: 'Registro', itens: [
    'Verificar se todos os campos estão preenchidos',
    'Conferir assinatura ou identificação de quem executou',
    'Checar se as correções mantêm o dado original legível',
    'Confirmar coerência de datas com a produção real' ] }
];

function analisarAnexo(nomeArquivo: string, c: Record<string, any>) {
  const nome = nomeArquivo.toLowerCase();
  const achado = CATALOGO.find((x) => x.chaves.some((k) => nome.includes(k)));

  if (achado) {
    return {
      texto: `Evidência identificada como **${achado.rotulo}**. Verifique:`,
      itens: achado.itens
    };
  }

  const generico = [
    'Confirmar que a evidência identifica local, data e o item observado',
    `Relacionar a evidência à cláusula ${c.clausula ?? 'aplicável'} no campo de evidência do item`,
    'Registrar o número do documento, lote ou equipamento visível na imagem',
    'Complementar com uma segunda evidência quando a constatação for de não conformidade'
  ];
  return { texto: 'Evidência anexada. Para que ela sustente a constatação, verifique:', itens: generico };
}

const RESPOSTAS: { chaves: string[]; texto: string }[] = [
  { chaves: ['maior', 'menor', 'classific'], texto:
    'Não conformidade maior: falha total do requisito, ausência de processo definido, ou desvio que compromete a entrega ao cliente ou a integridade do sistema. ' +
    'Não conformidade menor: desvio pontual e isolado, sem comprometimento da eficácia global do processo. ' +
    'Observação: situação que ainda atende ao requisito, mas apresenta tendência de desvio ou fragilidade — registre para acompanhamento.' },
  { chaves: ['causa raiz', '5 porqu', 'ishikawa'], texto:
    'Comece pelo fato, não pela suposição. Pergunte "por quê" sucessivamente até chegar a uma causa sobre a qual a organização tem controle — normalmente um processo, um método ou uma falta de definição, não uma pessoa. ' +
    'Se a resposta final for "falta de atenção do operador", a análise ainda não terminou: pergunte por que o processo permite que a desatenção gere um defeito.' },
  { chaves: ['correcao', 'corretiva', 'diferenc'], texto:
    'Correção elimina o efeito: retrabalhar a peça, refazer o registro, substituir o documento. Ação corretiva elimina a causa para que o problema não se repita. ' +
    'Toda NC precisa de correção imediata; a ação corretiva depende da avaliação da necessidade, conforme 10.2.1.' },
  { chaves: ['evidencia objetiva', 'evidência objetiva', 'evidencia'], texto:
    'Evidência objetiva é o dado verificável que sustenta a constatação: documento com código e revisão, número de lote, número de série do instrumento, data, registro fotográfico e a declaração literal do entrevistado. ' +
    'Evidência sem identificação não sustenta constatação — se você não consegue reencontrá-la seis meses depois, ela não serve.' },
  { chaves: ['amostragem', 'quantos', 'amostra'], texto:
    'A auditoria trabalha por amostragem. Escolha pela criticidade, não pela conveniência: o processo mais crítico, o turno menos auditado, o item com histórico de problema. ' +
    'Três a cinco amostras por requisito costumam ser suficientes para evidenciar tendência. Declare a amostragem na reunião de abertura.' },
  { chaves: ['entrevist', 'perguntar', 'pergunta'], texto:
    'Use perguntas abertas: "me mostra como você faz", "o que acontece se…", "onde está registrado". Evite perguntas que sugerem a resposta. ' +
    'Entreviste quem executa, não apenas quem supervisiona, e deixe claro que a auditoria avalia o sistema, não a pessoa.' },
  { chaves: ['reuniao de encerramento', 'encerramento', 'fechamento'], texto:
    'Nada de surpresa: toda constatação já deve ter sido comentada com o auditado no momento em que foi observada. ' +
    'Apresente na ordem das etapas, explique a classificação de cada constatação, acorde responsáveis e prazos e colha as assinaturas.' }
];

function responderDuvida(pergunta: string) {
  const p = pergunta.toLowerCase();
  const achado = RESPOSTAS.find((r) => r.chaves.some((k) => p.includes(k)));
  if (achado) return achado.texto;
  return (
    'Não tenho uma resposta pronta para essa pergunta no motor local. Para ativar respostas abertas, configure a variável OPENAI_API_KEY.\n\n' +
    'Enquanto isso, três princípios resolvem a maior parte das dúvidas em campo: ' +
    '1) toda constatação precisa de um requisito e de uma evidência objetiva; ' +
    '2) compare sempre o que o documento diz, o que a pessoa diz e o que o registro mostra — a divergência é o achado; ' +
    '3) descreva fatos, nunca pessoas.'
  );
}
