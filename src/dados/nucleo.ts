/* ============================================================
   nucleo.ts — Blocos comuns do SGI.
   Aplicam-se a qualquer setor e são escritos uma única vez.
   Cada setor escolhe quais entram no seu roteiro e em que ordem,
   sempre acompanhados dos blocos técnicos próprios da área.
   ============================================================ */

import type { Bloco } from './roteiro';

export const NUCLEO: Record<string, Bloco> = {

  /* ───────────────────────────────────────────────────────── */
  documentacao: {
    id: 'documentacao',
    titulo: 'Documentação do processo',
    proposito: 'Confirmar que a área trabalha com a versão vigente do que foi aprovado.',
    ilustracao: 'documento',
    itens: [
      {
        id: 'doc-1',
        titulo: 'Procedimento e instrução vigentes no ponto de uso',
        chavesClausulas: ['9001:7.5.3', '14001:7.5', '45001:7.5'],
        verificar: [
          'Peça a lista mestra e escolha dois documentos do processo crítico da área',
          'Vá até o posto de trabalho e confira código, revisão e data no documento disponível',
          'Compare a revisão encontrada com a vigente na lista mestra'
        ],
        evidencias: [
          'Foto do documento no posto mostrando código e revisão',
          'Lista mestra com a revisão vigente na mesma data'
        ],
        documentos: ['Lista mestra de documentos', 'Procedimento de controle de informação documentada'],
        registros: ['Registro de distribuição e recolhimento de cópias'],
        riscos: [
          'Cópia plastificada no posto em revisão anterior à vigente',
          'Documento só no servidor, sem acesso de quem executa',
          'Obsoleto guardado na gaveta sem identificação'
        ],
        validar: 'A revisão do documento no posto é idêntica à da lista mestra e o operador localiza o documento sozinho.'
      },
      {
        id: 'doc-2',
        titulo: 'Documentos de origem externa controlados',
        chavesClausulas: ['9001:7.5.3', '9001:8.5.3'],
        verificar: [
          'Localize desenhos de cliente, normas técnicas e fichas de fornecedor em uso na área',
          'Confirme revisão e data de recebimento de cada um',
          'Verifique quem é responsável por receber e distribuir as atualizações'
        ],
        evidencias: ['Desenho ou norma externa com revisão identificada', 'Registro de recebimento da última atualização'],
        documentos: ['Desenhos e especificações de cliente', 'Normas técnicas aplicáveis'],
        registros: ['Controle de documentos externos'],
        riscos: ['Desenho de cliente desatualizado em uso', 'Norma técnica vencida ou substituída'],
        validar: 'O desenho em uso corresponde à última revisão enviada pelo cliente, com data de recebimento registrada.'
      },
      {
        id: 'doc-3',
        titulo: 'Formulários em uso coerentes com o aprovado',
        chavesClausulas: ['9001:7.5.2', '9001:7.5.3'],
        verificar: [
          'Compare o formulário preenchido na área com o formulário aprovado no sistema',
          'Verifique se há planilhas paralelas de controle fora da lista mestra'
        ],
        evidencias: ['Formulário preenchido e o modelo aprovado, lado a lado'],
        documentos: ['Modelos de formulário aprovados'],
        registros: ['Formulários preenchidos do período'],
        riscos: ['Campos acrescentados à mão', 'Planilha pessoal substituindo o registro oficial'],
        validar: 'O formulário em uso tem os mesmos campos e o mesmo código do modelo aprovado.'
      }
    ]
  },

  /* ───────────────────────────────────────────────────────── */
  competencia: {
    id: 'competencia',
    titulo: 'Competência e conscientização',
    proposito: 'Confirmar que quem executa é habilitado e entende o efeito do próprio trabalho.',
    ilustracao: 'treinamento',
    itens: [
      {
        id: 'comp-1',
        titulo: 'Matriz de competência cobre as atividades executadas',
        chavesClausulas: ['9001:7.2', '14001:7.2', '45001:7.2'],
        verificar: [
          'Peça a matriz de competência e a lista de colaboradores ativos, incluindo temporários e terceiros',
          'Escolha duas pessoas em turnos diferentes e confira se a atividade que executam consta na matriz',
          'Confirme se as qualificações legais obrigatórias estão vigentes'
        ],
        evidencias: ['Matriz de competência assinada e datada', 'Ficha do colaborador com formação e experiência'],
        documentos: ['Matriz de competência', 'Descrição de cargo com requisitos'],
        registros: ['Registros de treinamento', 'Certificados de qualificação legal'],
        riscos: [
          'Pessoa executando atividade fora da matriz',
          'Terceiro ou temporário sem registro de integração',
          'Certificação de NR vencida'
        ],
        validar: 'Cada pessoa amostrada tem registro que a habilita para a atividade que estava executando no momento da auditoria.'
      },
      {
        id: 'comp-2',
        titulo: 'Eficácia do treinamento avaliada',
        chavesClausulas: ['9001:7.2', '45001:7.2'],
        verificar: [
          'Peça o registro de um treinamento recente da área',
          'Verifique o método usado para avaliar a eficácia: prova, observação prática ou acompanhamento',
          'Confirme que a avaliação ocorreu depois do treinamento, não no mesmo formulário de presença'
        ],
        evidencias: ['Formulário de avaliação de eficácia com resultado e data'],
        documentos: ['Plano anual de treinamento', 'Procedimento de treinamento'],
        registros: ['Lista de presença e avaliação de eficácia'],
        riscos: ['Só lista de presença, sem avaliação', 'Avaliação assinada em branco'],
        validar: 'Existe evidência de que alguém verificou o aprendizado após o treinamento, com resultado registrado.'
      },
      {
        id: 'comp-3',
        titulo: 'Conscientização sobre qualidade, ambiente e segurança',
        chavesClausulas: ['9001:7.3', '14001:7.3', '45001:7.3', '45001:5.4'],
        verificar: [
          'Pergunte ao operador qual o impacto do trabalho dele no cliente',
          'Pergunte quais resíduos ele gera e para onde vão',
          'Pergunte quais perigos existem na tarefa e o que ele faz ao identificar uma condição insegura',
          'Confirme se ele sabe que pode interromper a atividade diante de risco grave e iminente'
        ],
        evidencias: ['Anotação literal das respostas, com nome e função do entrevistado'],
        documentos: ['Política do SGI', 'Objetivos da qualidade, ambientais e de SSO'],
        registros: ['Atas de diálogo de segurança (DDS)', 'Registros de consulta aos trabalhadores'],
        riscos: [
          'Operador executa corretamente mas não sabe por que o parâmetro existe',
          'Ninguém sabe o destino do resíduo gerado',
          'Direito de recusa desconhecido'
        ],
        validar: 'O colaborador explica, com as próprias palavras, o efeito do trabalho dele na qualidade, no ambiente e na segurança.'
      }
    ]
  },

  /* ───────────────────────────────────────────────────────── */
  ambiental: {
    id: 'ambiental',
    titulo: 'Aspectos e impactos ambientais',
    proposito: 'Confirmar que os aspectos reais da área estão levantados e controlados.',
    ilustracao: 'nao-conformidade',
    itens: [
      {
        id: 'amb-1',
        titulo: 'Levantamento de aspectos e impactos reflete a operação',
        chavesClausulas: ['14001:6.1.2', '14001:8.1'],
        verificar: [
          'Antes de abrir o levantamento, anote os aspectos que você mesmo observou na área',
          'Compare a sua lista com o levantamento documentado do setor',
          'Escolha o aspecto de maior significância e verifique fisicamente o controle definido'
        ],
        evidencias: ['Levantamento de aspectos e impactos do setor, com data de revisão', 'Evidência física do controle do aspecto significativo'],
        documentos: ['Matriz de aspectos e impactos ambientais', 'Procedimento de controle operacional ambiental'],
        registros: ['Revisões do levantamento após mudanças ou incidentes'],
        inspecionar: ['Pontos de geração de resíduo, efluente, emissão e ruído da área'],
        riscos: [
          'Matriz genérica, igual para todos os setores',
          'Aspecto significativo sem controle implantado',
          'Levantamento sem revisão após mudança de processo'
        ],
        validar: 'Os aspectos que você observou na área constam no levantamento e cada significativo tem controle verificável no chão.'
      },
      {
        id: 'amb-2',
        titulo: 'Segregação e destinação dos resíduos gerados',
        chavesClausulas: ['14001:8.1', '14001:6.1.3'],
        verificar: [
          'Percorra os pontos de coleta e confira se a segregação corresponde à identificação do coletor',
          'Verifique o armazenamento temporário: contenção, cobertura e identificação',
          'Rastreie um resíduo classe I do ponto de geração até o manifesto de destinação'
        ],
        evidencias: ['Fotos dos coletores com resíduo compatível com a identificação', 'MTR ou manifesto com destinação final e licença do receptor'],
        documentos: ['Plano de gerenciamento de resíduos (PGRS)', 'Licenças dos transportadores e destinadores'],
        registros: ['MTR/CDF do período', 'Controle de geração por tipo de resíduo'],
        inspecionar: ['Coletores, baias e central de resíduos', 'Bacias de contenção'],
        riscos: [
          'Resíduo classe I misturado ao comum',
          'Central de resíduos sem contenção ou a céu aberto',
          'Destinador com licença vencida'
        ],
        validar: 'É possível seguir um resíduo perigoso da geração até o certificado de destinação final, com receptor licenciado na data.'
      },
      {
        id: 'amb-3',
        titulo: 'Requisitos legais ambientais aplicáveis atendidos',
        chavesClausulas: ['14001:6.1.3', '14001:9.1.2'],
        verificar: [
          'Peça os requisitos legais aplicáveis ao setor e a última avaliação de atendimento',
          'Confirme a validade das licenças e condicionantes que dependem desta área',
          'Verifique se os monitoramentos exigidos foram executados na frequência da licença'
        ],
        evidencias: ['Licença de operação vigente', 'Relatório de avaliação de atendimento legal com data'],
        documentos: ['Levantamento de requisitos legais', 'Licença ambiental e condicionantes'],
        registros: ['Laudos de monitoramento exigidos pela licença'],
        riscos: ['Condicionante da licença não cumprida', 'Avaliação legal desatualizada', 'Monitoramento fora da frequência exigida'],
        validar: 'Cada condicionante que depende do setor tem evidência de cumprimento dentro do prazo da licença.'
      }
    ]
  },

  /* ───────────────────────────────────────────────────────── */
  seguranca: {
    id: 'seguranca',
    titulo: 'Perigos, riscos e controles de SSO',
    proposito: 'Confirmar que os perigos reais da tarefa estão controlados na hierarquia correta.',
    ilustracao: 'seguranca',
    itens: [
      {
        id: 'sso-1',
        titulo: 'Perigos da atividade identificados e avaliados',
        chavesClausulas: ['45001:6.1.2.1', '45001:6.1.2.2'],
        verificar: [
          'Observe a tarefa em execução e liste os perigos que você identifica',
          'Compare com o inventário de perigos e riscos do setor (PGR/GRO)',
          'Verifique se a avaliação considerou situações de rotina, não rotina e emergência'
        ],
        evidencias: ['Inventário de riscos do setor com data de revisão', 'Comparação entre o observado e o documentado'],
        documentos: ['PGR / GRO conforme NR-01', 'APR ou análise de risco da tarefa'],
        registros: ['Revisões após incidentes ou mudanças'],
        riscos: [
          'Perigo evidente na tarefa ausente do inventário',
          'Avaliação sem participação de quem executa',
          'Inventário sem revisão há anos'
        ],
        validar: 'Os perigos observados por você durante a tarefa constam no inventário, com risco avaliado e controle definido.'
      },
      {
        id: 'sso-2',
        titulo: 'Hierarquia de controles aplicada, não apenas EPI',
        chavesClausulas: ['45001:8.1.2'],
        verificar: [
          'Para o risco mais crítico, verifique se houve tentativa de eliminação ou substituição antes do EPI',
          'Confirme a existência dos controles de engenharia previstos: proteção, exaustão, intertravamento, isolamento',
          'Teste, quando seguro, se o dispositivo de segurança está ativo e não foi anulado'
        ],
        evidencias: ['Registro da análise de risco mostrando a hierarquia aplicada', 'Foto do controle de engenharia em funcionamento'],
        documentos: ['Análise de risco da tarefa', 'Procedimento operacional com os controles'],
        registros: ['Verificações periódicas dos dispositivos de segurança'],
        inspecionar: ['Proteções fixas e móveis', 'Botão de emergência', 'Sistema de exaustão', 'Intertravamentos'],
        riscos: [
          'Controle resumido a "usar EPI"',
          'Proteção removida para agilizar a produção',
          'Intertravamento anulado com chave ou jumper'
        ],
        validar: 'Existe controle de engenharia implantado e funcionando para o risco crítico, com o EPI como última camada.'
      },
      {
        id: 'sso-3',
        titulo: 'EPI adequado, com CA válido e uso efetivo',
        chavesClausulas: ['45001:8.1.2', '45001:7.2'],
        verificar: [
          'Confirme que o EPI usado é o previsto na análise de risco da tarefa',
          'Verifique o CA e a validade do equipamento em uso',
          'Observe o uso efetivo e correto durante a execução, não apenas a disponibilidade',
          'Confira a ficha de entrega assinada e o treinamento de uso'
        ],
        evidencias: ['Ficha de entrega de EPI assinada', 'Foto do uso durante a operação', 'CA legível no equipamento'],
        documentos: ['Matriz de EPI por função', 'Procedimento de gestão de EPI'],
        registros: ['Fichas de entrega', 'Controle de troca e descarte'],
        inspecionar: ['EPI em uso e seu estado de conservação', 'Local de guarda'],
        riscos: [
          'EPI disponível mas não utilizado',
          'CA vencido ou ilegível',
          'Uso incorreto: óculos na testa, protetor mal inserido, respirador sem vedação'
        ],
        validar: 'O EPI previsto está sendo usado corretamente no momento da observação, com CA válido e entrega registrada.'
      },
      {
        id: 'sso-4',
        titulo: 'Preparação e resposta a emergências na área',
        chavesClausulas: ['45001:8.2', '14001:8.2'],
        verificar: [
          'Localize os recursos de emergência da área: extintores, hidrantes, chuveiro e lava-olhos, kit de contenção',
          'Confirme validade, acesso desobstruído e sinalização visível',
          'Pergunte a um colaborador qual a rota de fuga e o ponto de encontro',
          'Verifique o registro do último simulado que envolveu esta área'
        ],
        evidencias: ['Fotos dos recursos com identificação e validade', 'Registro do último simulado com data e participantes'],
        documentos: ['Plano de emergência', 'Mapa de rotas de fuga'],
        registros: ['Inspeção periódica de extintores e recursos', 'Relatório de simulado'],
        inspecionar: ['Extintores', 'Chuveiro e lava-olhos', 'Kit de contenção de derramamento', 'Sinalização e rotas'],
        riscos: [
          'Extintor bloqueado por palete ou material',
          'Lava-olhos sem pressão ou sem teste periódico',
          'Colaborador não sabe o ponto de encontro'
        ],
        validar: 'Os recursos estão acessíveis e válidos, e o colaborador entrevistado descreve corretamente o que fazer em emergência.'
      }
    ]
  },

  /* ───────────────────────────────────────────────────────── */
  medicao: {
    id: 'medicao',
    titulo: 'Instrumentos e medição',
    proposito: 'Confirmar que as decisões de aprovar ou reprovar se apoiam em medição confiável.',
    ilustracao: 'calibracao',
    itens: [
      {
        id: 'med-1',
        titulo: 'Instrumentos com calibração vigente e rastreável',
        chavesClausulas: ['9001:7.1.5.1', '9001:7.1.5.2'],
        verificar: [
          'Peça o instrumento que o operador mais usa, não o da vitrine',
          'Confira a etiqueta: número de identificação e validade',
          'Abra o certificado e confirme que o número de série corresponde ao instrumento em uso',
          'Verifique a declaração de rastreabilidade e o critério de aceitação'
        ],
        evidencias: ['Foto da etiqueta com número e validade', 'Certificado de calibração com rastreabilidade declarada'],
        documentos: ['Inventário de instrumentos', 'Plano e periodicidade de calibração'],
        registros: ['Certificados vigentes', 'Verificações intermediárias'],
        inspecionar: ['Instrumentos em uso na área', 'Local de guarda e conservação'],
        riscos: [
          'Instrumento particular do operador, sem identificação',
          'Certificado sem critério de aceitação definido',
          'Etiqueta vencida ou ilegível'
        ],
        validar: 'O instrumento usado na decisão de aceitação tem calibração válida, certificado correspondente e erro dentro do critério.'
      },
      {
        id: 'med-2',
        titulo: 'Ação sobre medições anteriores quando o instrumento reprova',
        chavesClausulas: ['9001:7.1.5.2', '9001:8.7'],
        verificar: [
          'Peça o último caso de instrumento reprovado ou danificado na área',
          'Verifique se houve avaliação do produto medido no período',
          'Confirme a disposição dada ao produto afetado'
        ],
        evidencias: ['Registro da análise de impacto', 'Disposição do produto afetado'],
        documentos: ['Procedimento de controle de dispositivos de medição'],
        registros: ['Histórico de reprovações em calibração'],
        riscos: ['Instrumento reprovado apenas substituído, sem avaliar o produto já liberado'],
        validar: 'Existe registro mostrando que o produto medido com o instrumento suspeito foi avaliado e teve destino definido.'
      }
    ]
  },

  /* ───────────────────────────────────────────────────────── */
  naoConformidade: {
    id: 'naoConformidade',
    titulo: 'Não conformidades e ações',
    proposito: 'Confirmar que os desvios da área viram aprendizado e não se repetem.',
    ilustracao: 'nao-conformidade',
    itens: [
      {
        id: 'nc-1',
        titulo: 'Produto ou serviço não conforme identificado e segregado',
        chavesClausulas: ['9001:8.7'],
        verificar: [
          'Localize a área de segregação do setor e confirme delimitação, identificação e controle de acesso',
          'Escolha um item segregado e rastreie o registro de disposição',
          'Confirme quem tem autoridade para liberar material de lá'
        ],
        evidencias: ['Foto da área de segregação com material identificado', 'Registro de disposição assinado por quem tem autoridade'],
        documentos: ['Procedimento de controle de saídas não conformes'],
        registros: ['Relatórios de não conformidade do período'],
        inspecionar: ['Área de segregação', 'Identificação e etiquetas de status'],
        riscos: [
          'Reprovado ao lado do aprovado, sem identificação',
          'Etiqueta improvisada em fita crepe',
          'Qualquer pessoa retira material da segregação'
        ],
        validar: 'Todo material segregado está identificado e sua liberação depende de autoridade formalmente definida.'
      },
      {
        id: 'nc-2',
        titulo: 'Análise de causa e eficácia das ações corretivas',
        chavesClausulas: ['9001:10.2', '14001:10.2', '45001:10.2'],
        verificar: [
          'Selecione duas NCs da área nos últimos doze meses: uma encerrada e uma em aberto',
          'Verifique o método de análise de causa aplicado e a profundidade',
          'Confirme se a ação ataca a causa e não apenas o efeito',
          'Procure reincidência do mesmo problema após o encerramento'
        ],
        evidencias: ['Registro de 5 porquês ou Ishikawa', 'Dados posteriores à ação que sustentam a conclusão de eficácia'],
        documentos: ['Procedimento de não conformidade e ação corretiva'],
        registros: ['RNCs do período', 'Indicador de reincidência'],
        riscos: [
          'Causa raiz declarada como "falta de atenção do operador"',
          'Ação corretiva que é apenas retrabalho',
          'NC encerrada como eficaz sem nenhuma evidência anexa'
        ],
        validar: 'A ação tomada elimina a causa identificada e existe dado objetivo mostrando que o problema deixou de ocorrer.'
      },
      {
        id: 'nc-3',
        titulo: 'Incidentes de SSO e ambientais investigados',
        chavesClausulas: ['45001:10.2', '14001:10.2'],
        verificar: [
          'Peça os incidentes e quase acidentes registrados na área',
          'Verifique se houve investigação com participação dos trabalhadores',
          'Confirme se as ações foram implantadas e comunicadas à equipe'
        ],
        evidencias: ['Relatório de investigação com participantes e ações'],
        documentos: ['Procedimento de investigação de incidentes'],
        registros: ['Registro de quase acidentes', 'Comunicação das lições aprendidas'],
        riscos: ['Quase acidente não registrado', 'Investigação sem quem estava presente', 'Ação sem prazo nem responsável'],
        validar: 'Os incidentes da área têm investigação registrada, com trabalhadores ouvidos e ações concluídas.'
      }
    ]
  }
};

export const blocoNucleo = (id: string) => NUCLEO[id];
