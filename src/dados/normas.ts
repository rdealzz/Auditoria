export type Norma = { id: string; nome: string; ano: string; descricao: string; foco: string };

export const NORMAS: Norma[] = [
  { id: 'iso9001', nome: 'ISO 9001', ano: '2015', descricao: 'Sistemas de gestão da qualidade — Requisitos', foco: 'Qualidade' },
  { id: 'iso14001', nome: 'ISO 14001', ano: '2015', descricao: 'Sistemas de gestão ambiental — Requisitos', foco: 'Meio ambiente' },
  { id: 'iso45001', nome: 'ISO 45001', ano: '2018', descricao: 'Saúde e segurança ocupacional — Requisitos', foco: 'Segurança' },
  { id: 'iatf16949', nome: 'IATF 16949', ano: '2016', descricao: 'Qualidade para a cadeia automotiva', foco: 'Automotivo' },
  { id: 'iso17025', nome: 'ISO/IEC 17025', ano: '2017', descricao: 'Competência de laboratórios de ensaio e calibração', foco: 'Laboratório' },
  { id: 'interna', nome: 'Auditoria interna de processo', ano: '—', descricao: 'Critério baseado nos procedimentos internos da organização', foco: 'Processo' }
];

export type Setor = { id: string; nome: string; ilustracao: string; buscaImagem: string; contexto: string; atencao: string[] };

export const SETORES: Setor[] = [
  {
    id: 'producao', nome: 'Produção', ilustracao: 'linha-producao',
    buscaImagem: 'factory production line manufacturing',
    contexto: 'Transformação do insumo em produto, com parâmetros de processo e controles em linha.',
    atencao: ['Parâmetros de processo fora da faixa', 'Aprovação de primeira peça (setup)', 'Mistura de lotes entre operações']
  },
  {
    id: 'almoxarifado', nome: 'Almoxarifado', ilustracao: 'armazem',
    buscaImagem: 'warehouse storage shelves inventory',
    contexto: 'Recebimento, guarda e distribuição de materiais, com identificação e preservação.',
    atencao: ['Controle PEPS e validade', 'Identificação e status dos materiais', 'Condições de armazenagem e empilhamento']
  },
  {
    id: 'qualidade', nome: 'Qualidade / Laboratório', ilustracao: 'laboratorio',
    buscaImagem: 'quality control laboratory testing measurement',
    contexto: 'Inspeções, ensaios e liberação de produto conforme plano de controle.',
    atencao: ['Critério de aceitação definido', 'Rastreabilidade do instrumento usado', 'Independência da decisão de liberação']
  },
  {
    id: 'manutencao', nome: 'Manutenção', ilustracao: 'manutencao',
    buscaImagem: 'industrial machine maintenance technician',
    contexto: 'Conservação de máquinas, utilidades e infraestrutura que sustentam o processo.',
    atencao: ['Preventiva planejada x executada', 'Peças de reposição críticas', 'Registro do serviço realizado']
  },
  {
    id: 'expedicao', nome: 'Expedição / Logística', ilustracao: 'expedicao',
    buscaImagem: 'shipping warehouse loading truck logistics',
    contexto: 'Conferência, embalagem, carregamento e entrega ao cliente.',
    atencao: ['Conferência contra o pedido', 'Preservação durante o transporte', 'Documentação de entrega e rastreabilidade']
  },
  {
    id: 'compras', nome: 'Compras / Suprimentos', ilustracao: 'fornecedor',
    buscaImagem: 'supplier evaluation procurement inspection goods',
    contexto: 'Seleção, avaliação e monitoramento de provedores externos.',
    atencao: ['Critério de qualificação do fornecedor', 'Requisitos comunicados na ordem de compra', 'Reavaliação por desempenho']
  },
  {
    id: 'rh', nome: 'Recursos Humanos', ilustracao: 'treinamento',
    buscaImagem: 'corporate training classroom employees',
    contexto: 'Competência, integração, treinamento e comunicação interna.',
    atencao: ['Matriz de competência atualizada', 'Eficácia dos treinamentos', 'Integração de temporários e terceiros']
  },
  {
    id: 'metrologia', nome: 'Metrologia / Calibração', ilustracao: 'calibracao',
    buscaImagem: 'calibration metrology instrument precision',
    contexto: 'Controle dos dispositivos de monitoramento e medição.',
    atencao: ['Rastreabilidade dos padrões', 'Critério de aceitação da calibração', 'Ação sobre medições anteriores inválidas']
  },
  {
    id: 'engenharia', nome: 'Engenharia / Projeto', ilustracao: 'documento',
    buscaImagem: 'engineering design office technical drawings',
    contexto: 'Projeto e desenvolvimento, controle de mudanças e documentação técnica.',
    atencao: ['Análise crítica, verificação e validação', 'Controle de revisão de desenhos', 'Gestão de mudanças de engenharia']
  },
  {
    id: 'seguranca', nome: 'SESMT / Segurança', ilustracao: 'seguranca',
    buscaImagem: 'workplace safety ppe industrial inspection',
    contexto: 'Condições de trabalho, EPI, sinalização e resposta a emergências.',
    atencao: ['Uso efetivo de EPI', 'Inspeção de extintores e rotas', 'Registros de treinamentos de NR']
  }
];

export const setorPorId = (id: string) => SETORES.find((s) => s.id === id);
export const normaPorId = (id: string) => NORMAS.find((n) => n.id === id);
export const nomeNorma = (id: string) => {
  const n = normaPorId(id);
  return n ? `${n.nome}:${n.ano}` : id;
};
