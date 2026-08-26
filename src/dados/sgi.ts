/* ============================================================
   sgi.ts — Sistema de Gestão Integrado.
   As auditorias cobrem ISO 9001, ISO 14001 e ISO 45001 ao mesmo
   tempo. Aqui ficam as normas e o registro de cláusulas usado
   por todos os roteiros de setor.
   ============================================================ */

export type NormaId = 'iso9001' | 'iso14001' | 'iso45001';

export type Norma = {
  id: NormaId;
  sigla: string;
  nome: string;
  ano: string;
  foco: string;
  cor: 'azul' | 'verde' | 'ambar';
};

export const NORMAS: Norma[] = [
  { id: 'iso9001',  sigla: '9001',  nome: 'ISO 9001',  ano: '2015', foco: 'Qualidade',           cor: 'azul' },
  { id: 'iso14001', sigla: '14001', nome: 'ISO 14001', ano: '2015', foco: 'Meio ambiente',       cor: 'verde' },
  { id: 'iso45001', sigla: '45001', nome: 'ISO 45001', ano: '2018', foco: 'Saúde e segurança',   cor: 'ambar' }
];

export const normaPorId = (id: NormaId) => NORMAS.find((n) => n.id === id)!;

/**
 * Cláusulas referenciadas pelos roteiros, na chave "<sigla>:<código>".
 * Manter só o que é efetivamente citado evita um catálogo morto.
 */
export const CLAUSULAS: Record<string, string> = {
  /* ─────────── ISO 9001:2015 ─────────── */
  '9001:4.4.1': 'Processos do sistema de gestão da qualidade',
  '9001:5.3': 'Papéis, responsabilidades e autoridades',
  '9001:6.1': 'Ações para abordar riscos e oportunidades',
  '9001:7.1.3': 'Infraestrutura',
  '9001:7.1.4': 'Ambiente para a operação dos processos',
  '9001:7.1.5.1': 'Recursos de monitoramento e medição',
  '9001:7.1.5.2': 'Rastreabilidade de medição',
  '9001:7.2': 'Competência',
  '9001:7.3': 'Conscientização',
  '9001:7.4': 'Comunicação',
  '9001:7.5.1': 'Informação documentada',
  '9001:7.5.2': 'Criação e atualização',
  '9001:7.5.3': 'Controle da informação documentada',
  '9001:8.1': 'Planejamento e controle operacionais',
  '9001:8.2.2': 'Determinação de requisitos para produtos e serviços',
  '9001:8.2.3': 'Análise crítica dos requisitos',
  '9001:8.2.4': 'Mudanças nos requisitos',
  '9001:8.3.2': 'Planejamento do projeto e desenvolvimento',
  '9001:8.3.3': 'Entradas de projeto e desenvolvimento',
  '9001:8.3.4': 'Controles de projeto e desenvolvimento',
  '9001:8.3.5': 'Saídas de projeto e desenvolvimento',
  '9001:8.3.6': 'Mudanças de projeto e desenvolvimento',
  '9001:8.4.1': 'Controle de processos, produtos e serviços providos externamente',
  '9001:8.4.2': 'Tipo e extensão do controle sobre provedores externos',
  '9001:8.4.3': 'Informação para provedores externos',
  '9001:8.5.1': 'Controle de produção e de provisão de serviço',
  '9001:8.5.2': 'Identificação e rastreabilidade',
  '9001:8.5.3': 'Propriedade de clientes ou provedores externos',
  '9001:8.5.4': 'Preservação',
  '9001:8.5.6': 'Controle de mudanças',
  '9001:8.6': 'Liberação de produtos e serviços',
  '9001:8.7': 'Controle de saídas não conformes',
  '9001:9.1.1': 'Monitoramento, medição, análise e avaliação',
  '9001:9.1.2': 'Satisfação do cliente',
  '9001:9.1.3': 'Análise e avaliação',
  '9001:10.2': 'Não conformidade e ação corretiva',
  '9001:10.3': 'Melhoria contínua',

  /* ─────────── ISO 14001:2015 ─────────── */
  '14001:5.2': 'Política ambiental',
  '14001:6.1.2': 'Aspectos ambientais',
  '14001:6.1.3': 'Requisitos legais e outros requisitos',
  '14001:6.1.4': 'Planejamento de ações',
  '14001:6.2': 'Objetivos ambientais e planejamento para alcançá-los',
  '14001:7.2': 'Competência',
  '14001:7.3': 'Conscientização',
  '14001:7.4': 'Comunicação',
  '14001:7.5': 'Informação documentada',
  '14001:8.1': 'Planejamento e controle operacional',
  '14001:8.2': 'Preparação e resposta a emergências',
  '14001:9.1.1': 'Monitoramento, medição, análise e avaliação',
  '14001:9.1.2': 'Avaliação do atendimento aos requisitos legais',
  '14001:10.2': 'Não conformidade e ação corretiva',

  /* ─────────── ISO 45001:2018 ─────────── */
  '45001:5.2': 'Política de saúde e segurança ocupacional',
  '45001:5.4': 'Consulta e participação dos trabalhadores',
  '45001:6.1.2.1': 'Identificação de perigos',
  '45001:6.1.2.2': 'Avaliação dos riscos de SSO',
  '45001:6.1.3': 'Determinação de requisitos legais e outros',
  '45001:6.1.4': 'Planejamento de ações',
  '45001:7.2': 'Competência',
  '45001:7.3': 'Conscientização',
  '45001:7.4': 'Comunicação',
  '45001:7.5': 'Informação documentada',
  '45001:8.1.1': 'Planejamento e controle operacional',
  '45001:8.1.2': 'Eliminar perigos e reduzir riscos de SSO',
  '45001:8.1.3': 'Gestão de mudanças',
  '45001:8.1.4.2': 'Contratados',
  '45001:8.2': 'Preparação e resposta a emergências',
  '45001:9.1.1': 'Monitoramento, medição, análise e avaliação',
  '45001:9.1.2': 'Avaliação do atendimento aos requisitos legais',
  '45001:10.2': 'Incidente, não conformidade e ação corretiva'
};

export type Clausula = { norma: NormaId; codigo: string; titulo: string; chave: string };

const SIGLA_PARA_ID: Record<string, NormaId> = {
  '9001': 'iso9001', '14001': 'iso14001', '45001': 'iso45001'
};

/** Converte "9001:8.5.1" na cláusula completa. Chave desconhecida não quebra a tela. */
export function clausula(chave: string): Clausula {
  const [sigla, codigo] = chave.split(':');
  return {
    chave,
    norma: SIGLA_PARA_ID[sigla] ?? 'iso9001',
    codigo,
    titulo: CLAUSULAS[chave] ?? 'Requisito da norma'
  };
}

export const clausulas = (chaves: string[]): Clausula[] => chaves.map(clausula);

/** Normas efetivamente cobertas por um conjunto de cláusulas. */
export function normasDe(chaves: string[]): NormaId[] {
  const vistas = new Set<NormaId>();
  chaves.forEach((c) => vistas.add(clausula(c).norma));
  return NORMAS.map((n) => n.id).filter((id) => vistas.has(id));
}
