/* ============================================================
   etapas.ts — Roteiro guiado de auditoria em 10 etapas.
   Conteúdo didático + requisitos da ISO 9001:2015.
   Escrito para que alguém sem experiência consiga auditar.
   ============================================================ */

export type Requisito = {
  id: string;
  clausula: string;
  titulo: string;
  resumoNorma: string;
  explicacaoSimples: string;
  comoVerificar: string[];
  evidenciaTipica: string;
};

export type Exemplo = { situacao: string; leitura: string; conclusao: 'conforme' | 'nao_conforme' | 'observacao' };

export type Etapa = {
  numero: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  ilustracao: string;
  buscaImagem: string;
  legendaImagem: string;
  duracaoMin: number;
  descricao: string;
  oQueSeraAuditado: string[];
  porQueImporta: string;
  comoAuditar: string[];
  oQueObservar: string[];
  oQuePerguntar: string[];
  evidencias: string[];
  documentosEsperados: string[];
  exemplos: Exemplo[];
  errosComuns: string[];
  dicas: string[];
  requisitos: Requisito[];
};

export const ETAPAS: Etapa[] = [
  /* ───────────────────────── 1 ───────────────────────── */
  {
    numero: 1,
    slug: 'preparacao',
    titulo: 'Preparação',
    subtitulo: 'Antes de olhar o processo, alinhe o que será olhado',
    ilustracao: 'reuniao',
    buscaImagem: 'audit team meeting reviewing documents office',
    legendaImagem: 'Reunião de abertura: auditor e auditado alinham escopo, critério e agenda.',
    duracaoMin: 20,
    descricao:
      'A etapa de preparação define as regras do jogo. Uma auditoria sem escopo claro vira conversa: o auditor pergunta o que lembra, o auditado mostra o que quer, e o relatório final não sustenta nenhuma decisão. Aqui você fixa o que será auditado, contra qual critério, com quem e em quanto tempo — e comunica isso ao auditado na reunião de abertura.',
    oQueSeraAuditado: [
      'O escopo: quais processos, turnos, linhas e locais entram na auditoria',
      'O critério: qual norma, procedimento interno, contrato ou requisito legal será usado como régua',
      'O plano de auditoria e a comunicação prévia ao auditado',
      'A competência e a imparcialidade de quem vai auditar',
      'Os documentos que precisam estar disponíveis no dia'
    ],
    porQueImporta:
      'Escopo e critério são o que transforma uma opinião em constatação. Sem critério definido você não consegue redigir uma não conformidade: toda NC precisa apontar qual requisito foi descumprido. E a imparcialidade protege o resultado — auditor não audita o próprio trabalho.',
    comoAuditar: [
      'Leia o programa anual de auditoria e confirme que este setor está previsto e dentro do prazo',
      'Levante o histórico: relatório da última auditoria do setor, NCs em aberto e ações não verificadas',
      'Solicite com antecedência a lista mestra de documentos do setor e o organograma',
      'Monte o plano de auditoria: data, horário, processos, auditores, auditados e agenda por bloco',
      'Envie o plano ao responsável do setor com pelo menos alguns dias de antecedência',
      'Faça a reunião de abertura: apresente escopo, critério, método de amostragem, horário de encerramento e como as constatações serão classificadas'
    ],
    oQueObservar: [
      'Se o responsável do setor sabia da auditoria e conseguiu se organizar',
      'Se as ações da auditoria anterior foram efetivamente encerradas ou apenas marcadas como concluídas',
      'Se o auditor designado tem independência em relação ao processo auditado',
      'Se o escopo cobre também terceiros e atividades terceirizadas dentro do setor'
    ],
    oQuePerguntar: [
      'Quais processos são executados neste setor e quem é o responsável por cada um?',
      'Qual foi o resultado da última auditoria aqui e o que mudou desde então?',
      'Existem atividades terceirizadas dentro deste setor?',
      'Quais turnos operam e o processo é o mesmo em todos eles?',
      'Há algum requisito de cliente ou legal específico que se aplica a este setor?'
    ],
    evidencias: [
      'Programa anual de auditoria assinado',
      'Plano desta auditoria enviado e confirmado',
      'Lista de presença da reunião de abertura',
      'Relatório da auditoria anterior com status das ações'
    ],
    documentosEsperados: [
      'Programa/cronograma anual de auditorias internas',
      'Plano de auditoria do setor',
      'Escopo do sistema de gestão da qualidade',
      'Mapa ou caracterização dos processos do setor',
      'Relatório e plano de ação da auditoria anterior'
    ],
    exemplos: [
      {
        situacao: 'O programa anual prevê auditoria do setor em março; a auditoria foi feita em setembro e não há registro de reprogramação.',
        leitura: 'A organização não cumpriu o próprio programa e não tratou o desvio.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'O plano foi enviado com 5 dias de antecedência e o responsável separou os registros previamente.',
        leitura: 'Planejamento comunicado e eficaz.',
        conclusao: 'conforme'
      },
      {
        situacao: 'O auditor designado trabalhou no setor até o mês passado.',
        leitura: 'Não fere requisito automaticamente, mas fragiliza a imparcialidade — vale registrar e reavaliar a designação.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Começar a auditoria sem definir o critério — depois não há como fundamentar a NC',
      'Copiar o escopo da auditoria anterior sem verificar mudanças no processo',
      'Pular a reunião de abertura por "já conhecer o pessoal"',
      'Auditar apenas o turno da manhã e concluir sobre o setor inteiro'
    ],
    dicas: [
      'O auditor deve solicitar evidências objetivas, não opiniões — comece a treinar isso já na abertura.',
      'Anuncie na abertura que a amostragem é por amostra: isso evita a discussão de "mas nem tudo está errado".',
      'Leve o relatório anterior impresso. Reincidência é o achado mais valioso de uma auditoria interna.'
    ],
    requisitos: [
      {
        id: 'e1r1', clausula: '9.2.2', titulo: 'Programa de auditoria interna',
        resumoNorma: 'A organização deve planejar, estabelecer, implementar e manter um programa de auditoria, considerando importância dos processos, mudanças e resultados anteriores.',
        explicacaoSimples: 'Existe um cronograma de auditorias e ele é realmente cumprido? A frequência considera o risco de cada processo?',
        comoVerificar: [
          'Peça o programa anual e compare as datas planejadas com as realizadas',
          'Verifique se processos mais críticos são auditados com maior frequência',
          'Confirme se os resultados anteriores influenciaram o programa atual'
        ],
        evidenciaTipica: 'Programa anual aprovado + registros das auditorias realizadas'
      },
      {
        id: 'e1r2', clausula: '9.2.2 c)', titulo: 'Objetividade e imparcialidade do auditor',
        resumoNorma: 'Os auditores devem ser selecionados de forma a assegurar objetividade e imparcialidade do processo de auditoria.',
        explicacaoSimples: 'Ninguém audita o próprio trabalho. O auditor precisa ser independente do processo avaliado.',
        comoVerificar: [
          'Compare a designação do auditor com o setor de lotação dele',
          'Verifique registro de qualificação/formação de auditor interno'
        ],
        evidenciaTipica: 'Designação da equipe auditora + certificado de formação de auditor interno'
      },
      {
        id: 'e1r3', clausula: '4.3', titulo: 'Escopo do sistema de gestão',
        resumoNorma: 'A organização deve determinar os limites e a aplicabilidade do SGQ e mantê-lo como informação documentada.',
        explicacaoSimples: 'O que está dentro e fora do sistema da qualidade precisa estar escrito e fazer sentido para este setor.',
        comoVerificar: [
          'Leia o escopo documentado e confirme se o setor auditado está coberto',
          'Verifique se alguma exclusão declarada é justificável'
        ],
        evidenciaTipica: 'Escopo do SGQ documentado (manual da qualidade ou equivalente)'
      },
      {
        id: 'e1r4', clausula: '4.4.1', titulo: 'Processos determinados e suas interações',
        resumoNorma: 'A organização deve determinar os processos necessários ao SGQ, suas entradas, saídas, sequência e interação.',
        explicacaoSimples: 'O setor sabe quais processos executa, o que recebe, o que entrega e para quem?',
        comoVerificar: [
          'Peça o mapa ou a caracterização dos processos do setor',
          'Pergunte ao operador de onde vem o insumo e para onde vai a saída — compare com o documento'
        ],
        evidenciaTipica: 'Mapa de processos, matriz SIPOC ou caracterização de processo'
      },
      {
        id: 'e1r5', clausula: '5.3', titulo: 'Papéis, responsabilidades e autoridades',
        resumoNorma: 'A Alta Direção deve assegurar que responsabilidades e autoridades sejam atribuídas, comunicadas e entendidas.',
        explicacaoSimples: 'Cada pessoa sabe o que é responsabilidade dela e o que ela pode decidir sozinha?',
        comoVerificar: [
          'Compare o organograma com a realidade encontrada no chão',
          'Pergunte a um colaborador quem aprova uma parada de processo por problema de qualidade'
        ],
        evidenciaTipica: 'Organograma, descrição de cargo, matriz de responsabilidades'
      }
    ]
  },

  /* ───────────────────────── 2 ───────────────────────── */
  {
    numero: 2,
    slug: 'documentacao',
    titulo: 'Documentação',
    subtitulo: 'O que está escrito, quem aprovou e se é a versão que está em uso',
    ilustracao: 'documento',
    buscaImagem: 'person reviewing quality procedure documents desk',
    legendaImagem: 'Verificação de procedimento controlado: revisão vigente, aprovação e disponibilidade no ponto de uso.',
    duracaoMin: 30,
    descricao:
      'Aqui você verifica a informação documentada do setor: procedimentos, instruções de trabalho, formulários e registros. O ponto central não é a existência do papel — é o controle. Documento sem controle de revisão é o achado mais comum de qualquer auditoria: a área trabalha com uma versão antiga enquanto a versão aprovada está no servidor.',
    oQueSeraAuditado: [
      'Procedimentos e instruções de trabalho aplicáveis ao setor',
      'Controle de revisão, aprovação e data de vigência',
      'Disponibilidade do documento no ponto de uso, na versão correta',
      'Retirada e identificação de documentos obsoletos',
      'Formulários em uso e sua coerência com o procedimento'
    ],
    porQueImporta:
      'O procedimento é a promessa da organização sobre como o trabalho é feito. Se o documento diz uma coisa e o operador faz outra, ou a prática está errada, ou o documento está desatualizado — e nos dois casos existe risco de produto não conforme e perda de padronização.',
    comoAuditar: [
      'Peça a lista mestra de documentos do setor',
      'Escolha 3 a 5 documentos por amostragem, priorizando os do processo crítico',
      'Confira no cabeçalho: código, revisão, data, elaborador e aprovador',
      'Vá até o posto de trabalho e confirme se a versão disponível é a mesma da lista mestra',
      'Leia um trecho do procedimento e peça ao operador para executar o passo descrito',
      'Verifique se documentos de origem externa (norma de cliente, ficha técnica) também estão controlados'
    ],
    oQueObservar: [
      'Cópias não controladas, fotocópias soltas, anotações à caneta sobre o procedimento',
      'Documento plastificado no posto com revisão anterior à vigente',
      'Formulário em uso com campos diferentes do formulário aprovado',
      'Documentos obsoletos guardados sem identificação de "obsoleto"',
      'Acesso: se o operador sabe onde encontrar o documento sem ajuda de terceiros'
    ],
    oQuePerguntar: [
      'Onde está o procedimento que descreve esta atividade?',
      'Como você sabe que esta é a versão atual?',
      'Quem elabora e quem aprova um documento aqui?',
      'O que acontece quando um procedimento precisa ser alterado?',
      'Como as pessoas ficam sabendo que houve uma nova revisão?',
      'Quem tem permissão para imprimir uma cópia?'
    ],
    evidencias: [
      'Fotos do documento no posto de trabalho mostrando código e revisão',
      'Print da lista mestra com as revisões vigentes',
      'Cópia do registro de aprovação/distribuição',
      'Registro de treinamento na revisão mais recente'
    ],
    documentosEsperados: [
      'Lista mestra de documentos',
      'Procedimento de controle de informação documentada',
      'Procedimentos operacionais e instruções de trabalho do setor',
      'Formulários e planilhas aprovadas',
      'Registro de distribuição e recolhimento de cópias'
    ],
    exemplos: [
      {
        situacao: 'A lista mestra indica revisão 05 da IT-PRD-012; no posto de trabalho está plastificada a revisão 03.',
        leitura: 'Documento desatualizado em uso — descumpre 7.5.3.1 (disponibilidade da versão adequada no ponto de uso).',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'O procedimento está correto e atualizado, mas o operador nunca foi treinado na revisão 05, que mudou o torque de aperto.',
        leitura: 'Falha de comunicação da mudança — NC ligada a 7.5.3 e 7.2.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'Existe uma cópia controlada carimbada, mas com uma anotação à lápis sobre um parâmetro.',
        leitura: 'Indica que a prática divergiu do documento; ainda não é NC se o parâmetro registrado for o mesmo, mas exige verificação.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Auditar só o servidor e nunca ir ao posto de trabalho conferir o que está impresso',
      'Aceitar "está no sistema" sem abrir o sistema junto com o auditado',
      'Confundir quantidade de documentos com qualidade de controle',
      'Ignorar documentos de origem externa (desenho do cliente, ficha de segurança)'
    ],
    dicas: [
      'Nunca aceite uma resposta sem comprovação documental — peça para abrir o arquivo na sua frente.',
      'Confirme sempre datas e revisões: a maioria das NCs de documentação aparece na comparação entre cabeçalho e lista mestra.',
      'Escolha o documento pela criticidade do processo, não pelo que estiver mais à mão.'
    ],
    requisitos: [
      {
        id: 'e2r1', clausula: '7.5.1', titulo: 'Informação documentada requerida',
        resumoNorma: 'O SGQ deve incluir a informação documentada requerida pela norma e a determinada pela organização como necessária para a eficácia.',
        explicacaoSimples: 'Existe documentação suficiente para que o processo seja executado do mesmo jeito por qualquer pessoa habilitada?',
        comoVerificar: [
          'Liste as atividades críticas do setor e verifique se cada uma tem documento correspondente',
          'Pergunte como um colaborador novo aprenderia a tarefa'
        ],
        evidenciaTipica: 'Lista mestra + procedimentos do setor'
      },
      {
        id: 'e2r2', clausula: '7.5.2', titulo: 'Criação e atualização',
        resumoNorma: 'Ao criar e atualizar informação documentada, a organização deve assegurar identificação, formato e análise crítica e aprovação adequadas.',
        explicacaoSimples: 'Todo documento tem título, código, data e alguém que aprovou antes de entrar em uso.',
        comoVerificar: [
          'Confira cabeçalho e rodapé: código, revisão, data, elaborador, aprovador',
          'Verifique se a aprovação é feita por quem tem autoridade definida'
        ],
        evidenciaTipica: 'Cabeçalho do documento com aprovação e histórico de revisões'
      },
      {
        id: 'e2r3', clausula: '7.5.3.1', titulo: 'Disponibilidade no ponto de uso',
        resumoNorma: 'A informação documentada deve estar disponível e adequada para uso, onde e quando necessária, e protegida adequadamente.',
        explicacaoSimples: 'O documento certo está na mão de quem executa, no momento em que ele executa.',
        comoVerificar: [
          'Vá ao posto de trabalho e peça o documento da atividade',
          'Compare a revisão encontrada com a revisão vigente na lista mestra'
        ],
        evidenciaTipica: 'Foto do documento no posto + comparação com lista mestra'
      },
      {
        id: 'e2r4', clausula: '7.5.3.2', titulo: 'Controle de alterações e obsoletos',
        resumoNorma: 'A informação documentada deve ser controlada quanto a distribuição, acesso, armazenamento, controle de alterações e retenção.',
        explicacaoSimples: 'Quando sai uma revisão nova, a antiga é recolhida ou identificada como obsoleta.',
        comoVerificar: [
          'Verifique registro de distribuição e recolhimento',
          'Procure documentos obsoletos em gavetas e murais sem identificação'
        ],
        evidenciaTipica: 'Registro de distribuição/recolhimento e histórico de revisões'
      },
      {
        id: 'e2r5', clausula: '7.5.3.2 (externa)', titulo: 'Documentos de origem externa',
        resumoNorma: 'A informação documentada de origem externa determinada como necessária deve ser identificada e controlada.',
        explicacaoSimples: 'Desenho do cliente, norma técnica e ficha do fornecedor também precisam de controle de versão.',
        comoVerificar: [
          'Peça um desenho ou especificação de cliente em uso e verifique a revisão contra a última enviada',
          'Confira quem controla o recebimento dessas atualizações'
        ],
        evidenciaTipica: 'Desenho/norma externa identificado com revisão e data de recebimento'
      }
    ]
  },

  /* ───────────────────────── 3 ───────────────────────── */
  {
    numero: 3,
    slug: 'infraestrutura',
    titulo: 'Infraestrutura',
    subtitulo: 'O ambiente permite fazer certo na primeira vez?',
    ilustracao: 'seguranca',
    buscaImagem: 'clean organized industrial factory floor safety signage',
    legendaImagem: 'Área industrial organizada: fluxo definido, identificação visível e condições seguras de trabalho.',
    duracaoMin: 30,
    descricao:
      'Esta etapa avalia o local físico: organização, limpeza, identificação de áreas e materiais, layout, iluminação, ruído, temperatura e condições de segurança. É a etapa mais visual da auditoria — muita coisa se conclui andando pelo setor com os olhos abertos, antes mesmo de abrir qualquer pasta.',
    oQueSeraAuditado: [
      'Organização e limpeza (5S) das áreas de trabalho e de armazenagem',
      'Identificação de áreas, materiais, status de inspeção e produtos segregados',
      'Layout e fluxo: risco de mistura entre conforme e não conforme',
      'Condições do ambiente que afetam a qualidade (temperatura, umidade, poeira, iluminação)',
      'Segurança: EPI, sinalização, rotas de fuga, extintores e acessos desobstruídos'
    ],
    porQueImporta:
      'Ambiente desorganizado gera troca de peça, mistura de lote e retrabalho. E a área de segregação é o coração do controle: se o produto reprovado fica ao lado do aprovado sem identificação, é questão de tempo até ele ser expedido.',
    comoAuditar: [
      'Faça uma volta completa pelo setor antes de conversar com alguém, observando em silêncio',
      'Verifique se cada área tem identificação e se o que está nela corresponde à identificação',
      'Procure a área de produto não conforme e confirme identificação, delimitação e controle de acesso',
      'Cheque os pontos de segurança: extintor com validade, acesso livre, sinalização visível',
      'Verifique se existem condições ambientais especificadas e se são monitoradas e registradas',
      'Observe pelo menos duas áreas de "fundo": embaixo da bancada, atrás da máquina, no depósito de sobras'
    ],
    oQueObservar: [
      'Materiais no chão sem palete ou identificação',
      'Produto conforme e não conforme na mesma bancada',
      'Extintor bloqueado por palete, vencido ou sem sinalização',
      'Vazamentos, iluminação insuficiente, ruído excessivo no posto',
      'Ferramentas e dispositivos sem local definido de guarda',
      'EPI disponível mas não utilizado — ou usado incorretamente'
    ],
    oQuePerguntar: [
      'Onde fica o material reprovado e quem pode movimentá-lo?',
      'Como este material está identificado e o que significa esta etiqueta?',
      'Existe controle de temperatura ou umidade aqui? Onde fica o registro?',
      'Quem é responsável pela limpeza desta área e com que frequência?',
      'O que aconteceria se este material caísse no chão agora?',
      'Como vocês evitam misturar dois lotes diferentes neste ponto?'
    ],
    evidencias: [
      'Fotos das áreas de armazenagem e da área de segregação',
      'Registro de auditoria/checklist de 5S do setor',
      'Planilha de monitoramento de temperatura e umidade',
      'Ficha de inspeção de extintores e rotas de emergência'
    ],
    documentosEsperados: [
      'Layout do setor',
      'Procedimento de identificação e segregação de produto não conforme',
      'Checklist de 5S ou inspeção de área',
      'Registros de controle ambiental (quando aplicável)',
      'Plano de manutenção predial e ficha de inspeção de segurança'
    ],
    exemplos: [
      {
        situacao: 'Caixa com peças reprovadas identificada apenas com fita crepe escrita "ver", ao lado do estoque liberado.',
        leitura: 'Identificação e segregação insuficientes — risco real de uso indevido. NC em 8.7.1.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'A instrução exige sala climatizada a 22 ± 3 °C, existe termohigrômetro, mas o registro parou há dois meses.',
        leitura: 'Condição ambiental especificada e não monitorada — NC em 7.1.4.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'A área está limpa e identificada, mas há duas caixas de sobras sem destino definido há semanas.',
        leitura: 'Não descumpre requisito direto; registre como observação/oportunidade antes de virar problema.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Auditar infraestrutura só pela aparência e esquecer da identificação de status',
      'Aceitar "hoje está bagunçado porque teve pico de produção" — a auditoria avalia o que existe no momento',
      'Não conferir o verso e o fundo das áreas, onde ficam os problemas',
      'Fotografar sem anotar local, data e o que a foto pretende evidenciar'
    ],
    dicas: [
      'Comece pela área de produto não conforme: ela conta a verdade sobre a disciplina do setor.',
      'Fotografe a etiqueta junto com o material — foto sem identificação não sustenta constatação.',
      'Pergunte a quem executa, não a quem acompanha você: a resposta do supervisor é a versão do procedimento.'
    ],
    requisitos: [
      {
        id: 'e3r1', clausula: '7.1.3', titulo: 'Infraestrutura',
        resumoNorma: 'A organização deve determinar, prover e manter a infraestrutura necessária para a operação dos processos e a conformidade dos produtos e serviços.',
        explicacaoSimples: 'Edifício, máquinas, utilidades e sistemas existem, funcionam e são mantidos.',
        comoVerificar: [
          'Observe condições de piso, bancadas, iluminação e utilidades',
          'Verifique se há plano de manutenção predial e das utilidades'
        ],
        evidenciaTipica: 'Plano de manutenção predial e registros de execução'
      },
      {
        id: 'e3r2', clausula: '7.1.4', titulo: 'Ambiente para operação dos processos',
        resumoNorma: 'A organização deve determinar, prover e manter o ambiente necessário — fatores físicos, sociais e psicológicos — para a operação dos processos.',
        explicacaoSimples: 'Temperatura, limpeza, ruído e iluminação adequados ao que o processo exige.',
        comoVerificar: [
          'Confirme se há condições ambientais especificadas em procedimento',
          'Verifique registros de monitoramento e ações quando o limite foi extrapolado'
        ],
        evidenciaTipica: 'Registros de temperatura/umidade e limites especificados'
      },
      {
        id: 'e3r3', clausula: '8.5.2', titulo: 'Identificação de áreas e materiais',
        resumoNorma: 'A organização deve usar meios apropriados para identificar as saídas quando necessário para assegurar a conformidade.',
        explicacaoSimples: 'Dá para saber, olhando, o que é cada material e em que status ele está.',
        comoVerificar: [
          'Escolha três materiais aleatórios e peça a identificação de cada um',
          'Confirme se a identificação permite rastrear lote e status'
        ],
        evidenciaTipica: 'Etiquetas de identificação e status de inspeção'
      },
      {
        id: 'e3r4', clausula: '8.7.1', titulo: 'Segregação de saídas não conformes',
        resumoNorma: 'A organização deve assegurar que saídas não conformes sejam identificadas e controladas para prevenir seu uso ou entrega não pretendidos.',
        explicacaoSimples: 'Produto reprovado fica separado, identificado e com acesso controlado.',
        comoVerificar: [
          'Localize a área de segregação e verifique delimitação e identificação',
          'Pergunte quem tem autoridade para liberar material de lá'
        ],
        evidenciaTipica: 'Foto da área de segregação + registro de disposição de NC'
      },
      {
        id: 'e3r5', clausula: '8.5.4', titulo: 'Preservação',
        resumoNorma: 'A organização deve preservar as saídas durante a produção e prestação de serviço, na extensão necessária para assegurar conformidade.',
        explicacaoSimples: 'O material é armazenado e manuseado de forma que não se danifique ou se contamine.',
        comoVerificar: [
          'Observe empilhamento, proteção contra umidade e manuseio',
          'Verifique controle de validade/PEPS quando aplicável'
        ],
        evidenciaTipica: 'Condições de armazenagem e controle de validade/PEPS'
      }
    ]
  },

  /* ───────────────────────── 4 ───────────────────────── */
  {
    numero: 4,
    slug: 'equipamentos',
    titulo: 'Equipamentos',
    subtitulo: 'Máquina mantida e instrumento confiável',
    ilustracao: 'calibracao',
    buscaImagem: 'calibrated measuring instrument caliper metrology laboratory',
    legendaImagem: 'Instrumento de medição com identificação, certificado e padrão rastreável.',
    duracaoMin: 35,
    descricao:
      'Aqui entram os equipamentos de produção e, principalmente, os recursos de monitoramento e medição. Este é o bloco mais objetivo da auditoria: ou o instrumento tem calibração válida e rastreável, ou não tem. Também é onde se descobre se a manutenção é planejada ou apenas corretiva.',
    oQueSeraAuditado: [
      'Calibração dos instrumentos de medição: validade, identificação e certificado',
      'Rastreabilidade metrológica a padrões nacionais ou internacionais',
      'Verificações intermediárias e controle de instrumentos fora de uso',
      'Plano de manutenção preventiva e registros de execução',
      'Condição de uso: instrumentos danificados, improvisados ou fora de faixa'
    ],
    porQueImporta:
      'Toda decisão de aprovar ou reprovar depende de uma medição. Se o instrumento não é confiável, todo o controle de qualidade do setor perde validade — e a organização pode ter liberado produto não conforme sem saber. Por isso a norma exige tratar retroativamente a validade de medições anteriores quando um instrumento é encontrado fora de calibração.',
    comoAuditar: [
      'Peça a relação de instrumentos do setor com data da última e da próxima calibração',
      'Escolha 3 a 5 instrumentos por amostragem, incluindo um de uso diário',
      'Verifique fisicamente a etiqueta: número de identificação e validade',
      'Abra o certificado correspondente e confirme: identificação do instrumento, data, laboratório, rastreabilidade e erro dentro do critério de aceitação',
      'Verifique se existe critério de aceitação definido — certificado sem critério não conclui nada',
      'Peça o plano de manutenção preventiva e confira duas ordens executadas e uma pendente'
    ],
    oQueObservar: [
      'Paquímetro ou trena de uso pessoal, sem identificação, sendo usado para medir produto',
      'Etiqueta de calibração vencida ou ilegível',
      'Instrumento com folga, trincado ou com bateria fraca',
      'Certificado no nome de outro instrumento ou de outro número de série',
      'Máquina com alarme desativado ou dispositivo de segurança anulado',
      'Manutenção sempre corretiva — nenhum registro de preventiva executada'
    ],
    oQuePerguntar: [
      'Quais instrumentos você usa nesta operação e quem os fornece?',
      'Como você sabe que este instrumento está calibrado?',
      'O que você faz se o instrumento cair no chão?',
      'Qual é o critério de aceitação da calibração deste equipamento?',
      'O que a empresa fez da última vez que um instrumento voltou reprovado da calibração?',
      'Qual a periodicidade de manutenção desta máquina e quem define isso?'
    ],
    evidencias: [
      'Foto da etiqueta de calibração com número e validade',
      'Certificado de calibração com rastreabilidade declarada',
      'Plano de calibração com periodicidade definida',
      'Ordens de manutenção preventiva executadas e histórico de corretivas'
    ],
    documentosEsperados: [
      'Lista/inventário de instrumentos de medição',
      'Plano e cronograma de calibração',
      'Certificados de calibração vigentes',
      'Procedimento de controle de dispositivos de medição',
      'Plano de manutenção preventiva e ordens de serviço'
    ],
    exemplos: [
      {
        situacao: 'Paquímetro usado na inspeção final com etiqueta vencida há 3 meses.',
        leitura: 'NC direta em 7.1.5.2. Pergunte também o que será feito com o produto medido nesse período.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'O certificado apresenta erro de 0,04 mm, mas não existe critério de aceitação definido para o instrumento.',
        leitura: 'Calibração sem critério não demonstra adequação ao uso — NC em 7.1.5.1.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'A manutenção preventiva está em dia, mas as ordens são fechadas sem descrição do serviço executado.',
        leitura: 'O registro não evidencia o que foi feito — observação com risco de virar NC de 7.5.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Olhar só a etiqueta e não abrir o certificado',
      'Não verificar se o número do certificado corresponde ao instrumento em uso',
      'Ignorar instrumentos particulares dos operadores',
      'Esquecer de perguntar o que foi feito quando um instrumento reprovou na calibração'
    ],
    dicas: [
      'Peça o instrumento que o operador mais usa, não o que está na vitrine.',
      'Rastreabilidade é palavra-chave: o certificado deve declarar o padrão e o laboratório usado.',
      'Quando encontrar instrumento fora de calibração, siga o rastro do produto medido com ele — é aí que a auditoria gera valor.'
    ],
    requisitos: [
      {
        id: 'e4r1', clausula: '7.1.5.1', titulo: 'Recursos de monitoramento e medição adequados',
        resumoNorma: 'A organização deve determinar e prover recursos adequados para assegurar resultados válidos e confiáveis quando monitoramento ou medição forem usados.',
        explicacaoSimples: 'O instrumento é apropriado para o que se pretende medir (faixa, resolução e exatidão).',
        comoVerificar: [
          'Compare a tolerância da característica com a resolução do instrumento',
          'Confirme se o recurso é mantido adequado ao propósito'
        ],
        evidenciaTipica: 'Especificação da característica + ficha do instrumento'
      },
      {
        id: 'e4r2', clausula: '7.1.5.2', titulo: 'Rastreabilidade metrológica',
        resumoNorma: 'Os instrumentos devem ser calibrados ou verificados em intervalos especificados contra padrões rastreáveis, identificados e protegidos contra ajustes indevidos.',
        explicacaoSimples: 'Calibração válida, com certificado rastreável e identificação no instrumento.',
        comoVerificar: [
          'Confira etiqueta, certificado e periodicidade',
          'Verifique a declaração de rastreabilidade no certificado'
        ],
        evidenciaTipica: 'Certificado de calibração com rastreabilidade RBC/INMETRO'
      },
      {
        id: 'e4r3', clausula: '7.1.5.2 (retroativo)', titulo: 'Ação sobre medições anteriores inválidas',
        resumoNorma: 'Quando um instrumento for considerado inadequado, a organização deve determinar a validade dos resultados anteriores e tomar ação apropriada.',
        explicacaoSimples: 'Se o instrumento estava errado, a empresa precisa avaliar o produto já medido com ele.',
        comoVerificar: [
          'Peça o último caso de instrumento reprovado na calibração',
          'Verifique o registro da avaliação de impacto no produto'
        ],
        evidenciaTipica: 'Registro de análise de impacto e disposição do produto afetado'
      },
      {
        id: 'e4r4', clausula: '7.1.3 (manutenção)', titulo: 'Manutenção de equipamentos',
        resumoNorma: 'A infraestrutura, incluindo equipamentos, deve ser mantida para assegurar a conformidade contínua dos produtos e serviços.',
        explicacaoSimples: 'Existe plano de manutenção preventiva e ele é cumprido, não só corretiva quando quebra.',
        comoVerificar: [
          'Compare plano x execução das preventivas do período',
          'Analise o histórico de corretivas do equipamento mais crítico'
        ],
        evidenciaTipica: 'Cronograma de preventiva + ordens de serviço executadas'
      },
      {
        id: 'e4r5', clausula: '7.1.5.1 (proteção)', titulo: 'Preservação e proteção do instrumento',
        resumoNorma: 'Os recursos de medição devem ser protegidos contra ajustes, danos e deterioração que invalidem o resultado.',
        explicacaoSimples: 'O instrumento é guardado, transportado e manuseado sem se estragar.',
        comoVerificar: [
          'Observe onde o instrumento é guardado entre um uso e outro',
          'Verifique lacres, travas e condições físicas'
        ],
        evidenciaTipica: 'Local de guarda adequado e instrumento em boas condições'
      }
    ]
  },

  /* ───────────────────────── 5 ───────────────────────── */
  {
    numero: 5,
    slug: 'competencia',
    titulo: 'Competência',
    subtitulo: 'Quem executa sabe executar — e sabe por quê',
    ilustracao: 'treinamento',
    buscaImagem: 'auditor interviewing factory worker training record',
    legendaImagem: 'Entrevista com o colaborador e verificação do registro de treinamento e qualificação.',
    duracaoMin: 30,
    descricao:
      'Competência não se prova com certificado na parede: prova-se com o colaborador executando corretamente e sabendo o efeito do seu trabalho na qualidade. Esta etapa combina análise de registros com entrevista — e a entrevista é a parte mais reveladora de toda a auditoria.',
    oQueSeraAuditado: [
      'Matriz de competência ou requisitos de qualificação por função',
      'Registros de treinamento, integração e reciclagem',
      'Avaliação da eficácia do treinamento, não apenas a lista de presença',
      'Conscientização: a pessoa sabe como o trabalho dela afeta a qualidade',
      'Qualificações especiais quando exigidas (solda, ensaios, empilhadeira, elétrica)'
    ],
    porQueImporta:
      'A maioria das não conformidades de processo tem raiz em competência: alguém fez errado porque nunca foi ensinado, foi ensinado por um colega ou foi treinado numa revisão antiga do procedimento. Auditar competência é atacar a causa, não o sintoma.',
    comoAuditar: [
      'Peça a matriz de competência do setor e a lista de colaboradores ativos, incluindo temporários',
      'Escolha 2 a 3 pessoas por amostragem, de preferência de turnos diferentes',
      'Confirme se cada uma tem registro de treinamento nas atividades que executa e na revisão vigente',
      'Entreviste no posto de trabalho, com perguntas abertas, sem induzir a resposta',
      'Verifique como a eficácia foi avaliada: prova, observação prática, acompanhamento por período',
      'Confira as qualificações legais obrigatórias e suas validades'
    ],
    oQueObservar: [
      'Pessoa executando atividade que não consta na matriz de competência dela',
      'Treinamento registrado apenas com lista de presença, sem avaliação de eficácia',
      'Colaborador que executa corretamente mas não sabe explicar por que aquele parâmetro existe',
      'Temporário ou terceirizado sem qualquer registro de integração',
      'Certificação obrigatória vencida (NR, ensaio, solda)'
    ],
    oQuePerguntar: [
      'Há quanto tempo você faz esta atividade e como aprendeu?',
      'O que acontece com o cliente se este passo for feito errado?',
      'O que você faz se encontrar uma peça fora do padrão?',
      'Você pode parar o processo se identificar um problema? Quem precisa autorizar?',
      'Qual foi seu último treinamento e sobre o que foi?',
      'Onde estão a política e os objetivos da qualidade e o que eles significam no seu dia?'
    ],
    evidencias: [
      'Matriz de competência assinada e atualizada',
      'Registros de treinamento com data, conteúdo e instrutor',
      'Registro de avaliação de eficácia',
      'Certificados de qualificação legal com validade',
      'Anotações da entrevista com o colaborador'
    ],
    documentosEsperados: [
      'Matriz de competência / matriz de polivalência',
      'Descrição de cargo com requisitos de escolaridade e experiência',
      'Plano anual de treinamento',
      'Registros de treinamento e integração',
      'Certificados de qualificação obrigatória'
    ],
    exemplos: [
      {
        situacao: 'Operador executando inspeção dimensional há 4 meses; a matriz de competência não o habilita para inspeção.',
        leitura: 'NC em 7.2 — atividade executada sem competência determinada e comprovada.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'Há lista de presença do treinamento na revisão 05, mas nenhuma avaliação de eficácia.',
        leitura: 'NC em 7.2 d) — a norma exige avaliar a eficácia das ações tomadas.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'O colaborador executa corretamente, mas não sabe dizer qual é a política da qualidade.',
        leitura: 'Ponto de conscientização (7.3). Avalie se ele entende a contribuição dele — decorar a política não é requisito.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Confundir treinamento com competência: presença não prova capacidade',
      'Entrevistar só o supervisor e não quem executa',
      'Fazer perguntas fechadas que induzem a resposta certa',
      'Constranger o colaborador — isso destrói a qualidade das respostas do resto da auditoria'
    ],
    dicas: [
      'Pergunte "me mostra como você faz" em vez de "você sabe fazer?" — a demonstração vale mais que a resposta.',
      'Deixe claro ao colaborador que a auditoria avalia o sistema, não a pessoa. Você obtém respostas honestas.',
      'Anote a resposta literal na hora: ela vira evidência objetiva no relatório.'
    ],
    requisitos: [
      {
        id: 'e5r1', clausula: '7.2 a)', titulo: 'Competência necessária determinada',
        resumoNorma: 'A organização deve determinar a competência necessária das pessoas que realizam trabalho que afeta o desempenho e a eficácia do SGQ.',
        explicacaoSimples: 'Está definido, por escrito, o que a pessoa precisa saber para ocupar aquela função.',
        comoVerificar: [
          'Peça a matriz de competência ou descrição de cargo',
          'Verifique se cobre todas as funções que afetam a qualidade'
        ],
        evidenciaTipica: 'Matriz de competência / descrição de cargo'
      },
      {
        id: 'e5r2', clausula: '7.2 b)', titulo: 'Competência comprovada',
        resumoNorma: 'A organização deve assegurar que essas pessoas sejam competentes com base em educação, treinamento ou experiência apropriados.',
        explicacaoSimples: 'Existe prova de que a pessoa atende ao que foi definido para a função.',
        comoVerificar: [
          'Compare o requisito da função com o histórico do colaborador amostrado',
          'Verifique se a comprovação existe para temporários e terceiros'
        ],
        evidenciaTipica: 'Ficha do colaborador, certificados, registro de experiência'
      },
      {
        id: 'e5r3', clausula: '7.2 d)', titulo: 'Eficácia das ações de treinamento',
        resumoNorma: 'Quando aplicável, a organização deve tomar ações para adquirir a competência necessária e avaliar a eficácia dessas ações.',
        explicacaoSimples: 'Depois do treinamento alguém verificou se a pessoa realmente aprendeu.',
        comoVerificar: [
          'Peça o registro de avaliação de eficácia de um treinamento recente',
          'Verifique o método usado: prova, observação prática ou acompanhamento'
        ],
        evidenciaTipica: 'Formulário de avaliação de eficácia com resultado'
      },
      {
        id: 'e5r4', clausula: '7.3', titulo: 'Conscientização',
        resumoNorma: 'As pessoas devem estar conscientes da política da qualidade, dos objetivos pertinentes, da sua contribuição e das implicações de não estar conforme.',
        explicacaoSimples: 'A pessoa entende por que o trabalho dela importa e o que acontece se ela errar.',
        comoVerificar: [
          'Pergunte ao colaborador qual o impacto do trabalho dele no cliente',
          'Pergunte o que ele faz ao identificar um problema'
        ],
        evidenciaTipica: 'Entrevista registrada + evidências de comunicação interna'
      },
      {
        id: 'e5r5', clausula: '7.4', titulo: 'Comunicação interna',
        resumoNorma: 'A organização deve determinar as comunicações internas e externas pertinentes ao SGQ, incluindo o que, quando, com quem e como comunicar.',
        explicacaoSimples: 'Metas, mudanças e resultados chegam a quem precisa saber, de forma definida.',
        comoVerificar: [
          'Verifique quadros de gestão à vista, reuniões de turno e atas',
          'Pergunte como o colaborador soube da última mudança de processo'
        ],
        evidenciaTipica: 'Ata de reunião de turno, quadro de gestão à vista, comunicados'
      }
    ]
  },

  /* ───────────────────────── 6 ───────────────────────── */
  {
    numero: 6,
    slug: 'execucao-do-processo',
    titulo: 'Execução do Processo',
    subtitulo: 'Ver o trabalho acontecendo, do começo ao fim',
    ilustracao: 'linha-producao',
    buscaImagem: 'factory production line operator working machine',
    legendaImagem: 'Acompanhamento da operação real: sequência, parâmetros e rastreabilidade do lote.',
    duracaoMin: 45,
    descricao:
      'Esta é a etapa central da auditoria. Aqui você acompanha a operação real e compara com o que o procedimento manda. A técnica mais eficaz é seguir um lote: escolher um número de ordem de produção e persegui-lo do recebimento até a expedição, verificando cada controle no caminho. É assim que se descobrem as lacunas que nenhuma pasta revela.',
    oQueSeraAuditado: [
      'Sequência operacional real comparada ao procedimento documentado',
      'Parâmetros de processo: se são os especificados e se são monitorados',
      'Identificação e rastreabilidade do lote ao longo das etapas',
      'Controle das mudanças de processo e de setup',
      'Liberação do produto: quem inspeciona, com qual critério e quem autoriza a passagem',
      'Controle de propriedade do cliente ou de terceiros, quando houver'
    ],
    porQueImporta:
      'Sistema de gestão não é o que está escrito, é o que acontece. Uma organização pode ter documentação impecável e um processo que roda de outro jeito há dois anos. A auditoria de execução é o momento em que se compara promessa e prática — e é dessa comparação que saem os achados mais relevantes.',
    comoAuditar: [
      'Escolha uma ordem de produção em andamento e anote o número do lote',
      'Peça para acompanhar a operação do início ao fim, sem interromper o operador',
      'Com o procedimento em mãos, marque cada passo executado e cada passo pulado',
      'Confira os parâmetros no painel da máquina contra a especificação (temperatura, pressão, torque, velocidade)',
      'Siga o lote: verifique se a identificação acompanha o material em todas as movimentações',
      'Peça o registro de liberação e confirme quem assinou e se essa pessoa tem autoridade para isso',
      'Verifique como o setup é validado antes de liberar produção em série (primeira peça aprovada)'
    ],
    oQueObservar: [
      'Passo do procedimento executado fora de ordem ou pulado "porque sempre dá certo"',
      'Parâmetro ajustado manualmente sem registro e sem autorização',
      'Peça sem identificação circulando entre operações',
      'Registro preenchido em bloco no fim do turno, em vez de durante a operação',
      'Inspeção de primeira peça feita depois de já ter produzido centenas',
      'Material do cliente sem identificação, misturado ao estoque próprio'
    ],
    oQuePerguntar: [
      'Me mostra como você faz esta operação, do início ao fim?',
      'Quais parâmetros você precisa controlar aqui e onde estão especificados?',
      'O que você faz se o parâmetro sair da faixa?',
      'Como se sabe de qual lote é esta peça daqui a seis meses?',
      'Quem libera esta produção para seguir para a próxima etapa?',
      'O que muda no processo quando troca o modelo? Existe registro de setup?',
      'Já aconteceu de precisar mudar algo no processo? Como isso foi aprovado?'
    ],
    evidencias: [
      'Número da ordem de produção e do lote acompanhado',
      'Fotos do painel com os parâmetros reais no momento da auditoria',
      'Cópia da ficha de processo e do registro de liberação preenchidos',
      'Registro de aprovação de primeira peça / setup',
      'Anotação literal da sequência observada'
    ],
    documentosEsperados: [
      'Procedimento operacional e instrução de trabalho',
      'Ficha técnica / especificação do produto',
      'Ordem de produção com registros de processo',
      'Plano de controle ou plano de inspeção',
      'Registro de liberação e de aprovação de setup',
      'Procedimento de controle de mudanças'
    ],
    exemplos: [
      {
        situacao: 'A IT determina inspeção a cada 50 peças; o registro mostra inspeções a cada 200, e o operador confirma que faz assim há meses.',
        leitura: 'Processo não executado conforme planejado — NC em 8.5.1.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'A temperatura especificada é 180 ± 5 °C; o painel marca 192 °C e não há registro de desvio nem ação.',
        leitura: 'Parâmetro fora de especificação sem tratamento — NC em 8.5.1 e possivelmente 8.7.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'O operador melhorou a sequência e o resultado é melhor, mas o procedimento nunca foi atualizado.',
        leitura: 'Mudança de processo não controlada — NC em 8.5.6, ainda que a intenção tenha sido boa.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'A identificação do lote é feita a lápis na caixa e apaga com o manuseio.',
        leitura: 'Rastreabilidade frágil; se ainda não houve perda de identificação, registre como observação com risco alto.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Auditar o processo pela descrição do supervisor em vez de assistir à operação',
      'Interromper o operador o tempo todo e alterar o comportamento que se quer observar',
      'Acompanhar só o começo do processo e nunca fechar o ciclo até a liberação',
      'Aceitar "a gente faz assim, mas está escrito de outro jeito" sem registrar o achado'
    ],
    dicas: [
      'Siga um lote do início ao fim — é a técnica que mais gera achados relevantes por hora de auditoria.',
      'Observe primeiro em silêncio por alguns minutos; só depois comece a perguntar.',
      'Compare sempre três fontes: o que o documento diz, o que a pessoa diz e o que o registro mostra. A divergência é o achado.'
    ],
    requisitos: [
      {
        id: 'e6r1', clausula: '8.5.1', titulo: 'Controle de produção e prestação de serviço',
        resumoNorma: 'A produção deve ser implementada sob condições controladas, incluindo informação documentada, monitoramento, infraestrutura, pessoas competentes e atividades de liberação.',
        explicacaoSimples: 'O processo roda do jeito planejado, com os controles previstos funcionando.',
        comoVerificar: [
          'Acompanhe a operação com o procedimento em mãos e marque divergências',
          'Confirme os parâmetros reais contra a especificação'
        ],
        evidenciaTipica: 'Observação registrada + ficha de processo preenchida'
      },
      {
        id: 'e6r2', clausula: '8.5.2', titulo: 'Identificação e rastreabilidade',
        resumoNorma: 'A organização deve identificar as saídas e o status em relação aos requisitos de monitoramento e medição, e controlar a identificação unívoca quando a rastreabilidade for requerida.',
        explicacaoSimples: 'Dá para saber qual é a peça, em que status ela está e de qual lote veio.',
        comoVerificar: [
          'Escolha uma peça em processo e peça para rastrear o lote de origem',
          'Verifique se o status de inspeção é visível em cada etapa'
        ],
        evidenciaTipica: 'Etiqueta de lote + registro de rastreabilidade'
      },
      {
        id: 'e6r3', clausula: '8.5.6', titulo: 'Controle de mudanças',
        resumoNorma: 'A organização deve analisar criticamente e controlar mudanças na produção, na extensão necessária para assegurar conformidade contínua.',
        explicacaoSimples: 'Nenhuma mudança de processo acontece sem análise e aprovação registradas.',
        comoVerificar: [
          'Peça a última mudança de processo do setor e o registro de aprovação',
          'Compare a revisão do procedimento com a data da mudança'
        ],
        evidenciaTipica: 'Registro de controle de mudança com análise e aprovação'
      },
      {
        id: 'e6r4', clausula: '8.6', titulo: 'Liberação de produtos e serviços',
        resumoNorma: 'A organização deve implementar arranjos planejados para verificar que os requisitos foram atendidos; a liberação não deve prosseguir até a conclusão satisfatória, salvo aprovação por autoridade pertinente.',
        explicacaoSimples: 'Nada segue adiante sem inspeção concluída e sem alguém autorizado assinar.',
        comoVerificar: [
          'Verifique o registro de liberação e a identificação de quem autorizou',
          'Confirme se essa pessoa tem autoridade formal para liberar'
        ],
        evidenciaTipica: 'Registro de liberação assinado + matriz de autoridade'
      },
      {
        id: 'e6r5', clausula: '8.5.3', titulo: 'Propriedade de clientes ou provedores externos',
        resumoNorma: 'A organização deve identificar, verificar, proteger e salvaguardar a propriedade de clientes ou provedores externos sob seu controle.',
        explicacaoSimples: 'Material, ferramenta, molde ou dado do cliente é identificado e cuidado como tal.',
        comoVerificar: [
          'Verifique se há propriedade de cliente no setor e como está identificada',
          'Confirme o registro de comunicação em caso de dano ou perda'
        ],
        evidenciaTipica: 'Identificação de propriedade do cliente + registros de conservação'
      }
    ]
  },

  /* ───────────────────────── 7 ───────────────────────── */
  {
    numero: 7,
    slug: 'registros',
    titulo: 'Registros',
    subtitulo: 'A prova de que o controle aconteceu de verdade',
    ilustracao: 'rastreabilidade',
    buscaImagem: 'worker filling quality control form clipboard factory',
    legendaImagem: 'Preenchimento de registro de controle: dado real, assinatura, data e retenção.',
    duracaoMin: 30,
    descricao:
      'Registro é a evidência objetiva de que o controle planejado foi executado. Nesta etapa você avalia preenchimento, assinatura, correções, arquivamento e tempo de retenção. Um registro incompleto não é só um problema de papel: ele significa que ninguém consegue provar que a inspeção realmente aconteceu.',
    oQueSeraAuditado: [
      'Preenchimento completo dos campos e ausência de lacunas',
      'Assinatura ou identificação de quem executou e de quem verificou',
      'Correções feitas de forma rastreável, sem rasura que apague o dado original',
      'Arquivamento, recuperação e tempo de retenção definido',
      'Coerência entre registros de etapas diferentes do mesmo lote',
      'Proteção dos registros eletrônicos: acesso, backup e trilha de alteração'
    ],
    porQueImporta:
      'Em auditoria vale a regra: o que não está registrado não aconteceu. Registros também são a primeira linha de defesa em caso de reclamação de cliente ou recall — sem eles, a empresa não consegue delimitar o problema e acaba tendo que assumir um lote inteiro.',
    comoAuditar: [
      'Peça os registros do lote que você acompanhou na etapa anterior',
      'Confira campo a campo: há espaços em branco? Há valores idênticos repetidos em série?',
      'Verifique se as datas são coerentes com a produção real',
      'Analise as correções: a norma exige que o dado original permaneça legível',
      'Peça um registro de um ano atrás para testar a recuperação e o tempo de retenção',
      'Nos sistemas eletrônicos, verifique quem pode alterar um dado já lançado e se há trilha de auditoria'
    ],
    oQueObservar: [
      'Campos em branco ou preenchidos com traço sem justificativa',
      'Mesmo valor repetido em todas as linhas, sugerindo preenchimento sem medição real',
      'Registro preenchido com a mesma caneta e mesma letra para turnos diferentes',
      'Rasura com corretivo, apagando o dado original',
      'Registro assinado por quem não estava presente',
      'Arquivo morto em local úmido, sem organização, impossível de recuperar'
    ],
    oQuePerguntar: [
      'Quando você preenche este registro: durante a operação ou no fim do turno?',
      'O que você faz se errar ao anotar um valor?',
      'Quem confere este registro depois de preenchido?',
      'Por quanto tempo estes registros são guardados e onde?',
      'Se eu pedir o registro deste produto de um ano atrás, quanto tempo você leva para encontrar?',
      'Quem pode alterar um dado já lançado no sistema?'
    ],
    evidencias: [
      'Cópia ou foto dos registros amostrados, com identificação do lote',
      'Registro recuperado do arquivo para teste de rastreabilidade',
      'Print da trilha de auditoria do sistema eletrônico',
      'Tabela de temporalidade / retenção de registros'
    ],
    documentosEsperados: [
      'Formulários e planilhas de controle preenchidos',
      'Procedimento de controle de informação documentada (retenção e disposição)',
      'Tabela de temporalidade dos registros',
      'Política de backup dos registros eletrônicos',
      'Registros de inspeção e liberação do lote auditado'
    ],
    exemplos: [
      {
        situacao: 'Ficha de inspeção com 12 linhas: 4 preenchidas, 8 em branco, e o produto foi liberado.',
        leitura: 'Liberação sem evidência da verificação planejada — NC em 8.6 e 7.5.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'Valor corrigido com corretivo branco, impossível ler o original.',
        leitura: 'Correção não rastreável — NC em 7.5.3. O correto é traçar uma linha, escrever o valor certo, rubricar e datar.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'Os registros são guardados corretamente, mas levou 40 minutos para localizar o de um ano atrás.',
        leitura: 'Recuperação existe mas é ineficiente — observação com oportunidade de melhoria.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Olhar só se o registro existe e não ler o que está escrito nele',
      'Não cruzar registros: a ficha de processo diz uma hora e o apontamento diz outra',
      'Esquecer dos registros eletrônicos e das planilhas paralelas de controle',
      'Aceitar registro assinado em branco "para agilizar"'
    ],
    dicas: [
      'Some, compare e cruze: o achado quase sempre aparece no confronto entre dois registros do mesmo lote.',
      'Peça um registro antigo. Testar a recuperação é a melhor forma de auditar retenção.',
      'Valores perfeitamente iguais em toda a série são um sinal clássico de registro preenchido sem medição.'
    ],
    requisitos: [
      {
        id: 'e7r1', clausula: '7.5.3.1', titulo: 'Registros disponíveis e adequados ao uso',
        resumoNorma: 'A informação documentada mantida como evidência deve estar disponível, adequada para uso e protegida contra perda de integridade e uso indevido.',
        explicacaoSimples: 'O registro existe, está legível, completo e protegido.',
        comoVerificar: [
          'Amostre registros do lote auditado e verifique completude',
          'Verifique proteção contra perda (backup, arquivo adequado)'
        ],
        evidenciaTipica: 'Registros preenchidos + local de arquivo'
      },
      {
        id: 'e7r2', clausula: '7.5.3.2', titulo: 'Retenção e disposição',
        resumoNorma: 'O controle deve abordar armazenamento, preservação, controle de alterações, retenção e disposição da informação documentada.',
        explicacaoSimples: 'Está definido por quanto tempo cada registro é guardado e o que se faz depois.',
        comoVerificar: [
          'Peça a tabela de temporalidade e compare com o que existe no arquivo',
          'Solicite um registro antigo para testar a recuperação'
        ],
        evidenciaTipica: 'Tabela de retenção + registro recuperado do arquivo'
      },
      {
        id: 'e7r3', clausula: '8.6', titulo: 'Evidência de conformidade e liberação',
        resumoNorma: 'A organização deve reter informação documentada sobre a liberação, incluindo evidência de conformidade e rastreabilidade da pessoa que autorizou.',
        explicacaoSimples: 'O registro mostra o resultado da inspeção e quem liberou.',
        comoVerificar: [
          'Verifique se o registro de liberação identifica a pessoa autorizada',
          'Confirme se os resultados registrados atendem ao critério de aceitação'
        ],
        evidenciaTipica: 'Registro de liberação com resultado e identificação do liberador'
      },
      {
        id: 'e7r4', clausula: '9.1.1', titulo: 'Monitoramento, medição e registro dos resultados',
        resumoNorma: 'A organização deve determinar o que precisa ser monitorado e medido, os métodos, quando executar e quando analisar, retendo informação documentada apropriada.',
        explicacaoSimples: 'O que a empresa disse que ia medir está sendo medido e registrado na frequência definida.',
        comoVerificar: [
          'Compare a frequência definida no plano de controle com a frequência dos registros',
          'Verifique se há análise dos resultados, não apenas coleta'
        ],
        evidenciaTipica: 'Plano de controle + série histórica de registros'
      },
      {
        id: 'e7r5', clausula: '7.5.3.2 (eletrônico)', titulo: 'Controle de registros eletrônicos',
        resumoNorma: 'O controle de acesso e de alterações deve ser assegurado também para informação documentada em meio eletrônico.',
        explicacaoSimples: 'Planilha e sistema têm controle de quem acessa, quem altera e backup.',
        comoVerificar: [
          'Verifique permissões de edição e existência de trilha de auditoria',
          'Confirme rotina e teste de restauração do backup'
        ],
        evidenciaTipica: 'Print de permissões, log de alterações e registro de backup'
      }
    ]
  },

  /* ───────────────────────── 8 ───────────────────────── */
  {
    numero: 8,
    slug: 'riscos-e-oportunidades',
    titulo: 'Riscos e Oportunidades',
    subtitulo: 'O que pode dar errado e o que a empresa faz a respeito',
    ilustracao: 'indicadores',
    buscaImagem: 'quality inspector risk assessment industrial operation',
    legendaImagem: 'Inspeção operacional e avaliação de riscos: controles definidos e eficácia acompanhada.',
    duracaoMin: 30,
    descricao:
      'A ISO 9001:2015 substituiu a "ação preventiva" pelo pensamento baseado em risco. Isso significa que a organização precisa saber o que pode comprometer os resultados do processo e ter controles para isso. Nesta etapa você verifica se o risco levantado no papel é o risco real do setor — e se os controles definidos existem no chão.',
    oQueSeraAuditado: [
      'Riscos e oportunidades identificados para os processos do setor',
      'Coerência entre o risco levantado e a realidade observada nas etapas anteriores',
      'Controles definidos e sua implementação efetiva',
      'Avaliação da eficácia das ações tomadas para tratar riscos',
      'Tratamento de mudanças e seus impactos (6.3)',
      'Oportunidades de melhoria identificadas e encaminhadas'
    ],
    porQueImporta:
      'Esta é a etapa que separa a auditoria burocrática da auditoria útil. Uma matriz de risco genérica, copiada de modelo, não protege ninguém. Quando o risco levantado bate com o problema que você viu no processo, o sistema está vivo; quando não bate, o documento existe só para a certificação.',
    comoAuditar: [
      'Peça a matriz de riscos e oportunidades aplicável ao setor',
      'Antes de ler, liste os três riscos que você mesmo percebeu nas etapas anteriores',
      'Compare a sua lista com a matriz: os riscos reais estão contemplados?',
      'Escolha dois riscos com controle definido e verifique se o controle existe fisicamente',
      'Verifique se a matriz foi revisada após mudanças, incidentes ou reclamações relevantes',
      'Analise se as oportunidades identificadas viraram ações com responsável e prazo'
    ],
    oQueObservar: [
      'Matriz genérica, idêntica para todos os setores, sem particularidade do processo',
      'Risco classificado como alto sem nenhuma ação associada',
      'Controle documentado que não existe na prática',
      'Matriz sem revisão há anos, apesar de mudanças relevantes no processo',
      'Reclamação de cliente recorrente que nunca virou risco mapeado',
      'Oportunidade registrada sem responsável, prazo ou desfecho'
    ],
    oQuePerguntar: [
      'O que pode dar errado neste processo e qual seria o impacto no cliente?',
      'Quais riscos vocês identificaram para este setor e como chegaram a eles?',
      'Qual controle existe hoje para o risco mais crítico? Me mostra ele funcionando.',
      'Quando esta matriz foi revisada pela última vez e o que motivou a revisão?',
      'Aquela reclamação de cliente do mês passado mudou alguma coisa na avaliação de riscos?',
      'Como uma sugestão de melhoria de um operador chega até a decisão?'
    ],
    evidencias: [
      'Matriz de riscos e oportunidades com data de revisão',
      'Evidência física do controle definido para um risco crítico',
      'Registro de ação com responsável, prazo e verificação de eficácia',
      'Ata de análise crítica onde os riscos foram discutidos'
    ],
    documentosEsperados: [
      'Matriz de riscos e oportunidades (ou FMEA de processo)',
      'Análise de contexto e partes interessadas',
      'Plano de ação para tratamento de riscos',
      'Registro de análise de mudanças planejadas',
      'Registros de sugestões e melhorias implantadas'
    ],
    exemplos: [
      {
        situacao: 'A matriz não menciona o risco de mistura de lotes, mas na Etapa 3 você encontrou material sem identificação ao lado do segregado.',
        leitura: 'Risco real não identificado — evidencia que o processo de 6.1 não está eficaz.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'O controle definido para o risco de contaminação é "uso de luvas", e nenhum operador da linha usa luvas.',
        leitura: 'Controle definido e não implementado — NC em 6.1.2.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'A matriz é adequada e revisada, mas as oportunidades listadas não têm prazo definido.',
        leitura: 'Não há requisito explícito de prazo, porém sem ele a ação não se conclui — observação.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Auditar a existência da matriz em vez da aderência dela à realidade',
      'Aceitar risco genérico do tipo "falha humana" sem controle correspondente',
      'Esquecer de conectar os achados das etapas anteriores com esta análise',
      'Tratar oportunidade de melhoria como não conformidade — são coisas distintas'
    ],
    dicas: [
      'Antes de abrir a matriz, escreva os riscos que você viu. Comparar as duas listas é a auditoria mais honesta que existe.',
      'Risco alto sem ação é achado; ação sem verificação de eficácia também é.',
      'Pergunte pelo último incidente do setor: se ele não repercutiu na matriz, o pensamento baseado em risco não está funcionando.'
    ],
    requisitos: [
      {
        id: 'e8r1', clausula: '6.1.1', titulo: 'Determinação de riscos e oportunidades',
        resumoNorma: 'Ao planejar o SGQ, a organização deve considerar o contexto e as partes interessadas e determinar os riscos e oportunidades que precisam ser abordados.',
        explicacaoSimples: 'A empresa identificou o que pode atrapalhar e o que pode ajudar este processo.',
        comoVerificar: [
          'Peça a matriz aplicável ao setor e verifique se é específica dele',
          'Compare com os riscos observados durante a auditoria'
        ],
        evidenciaTipica: 'Matriz de riscos e oportunidades do processo'
      },
      {
        id: 'e8r2', clausula: '6.1.2', titulo: 'Ações para abordar riscos e avaliação de eficácia',
        resumoNorma: 'A organização deve planejar ações para abordar riscos e oportunidades, integrá-las aos processos e avaliar a eficácia dessas ações.',
        explicacaoSimples: 'Para cada risco relevante existe uma ação, e alguém verificou se ela funcionou.',
        comoVerificar: [
          'Escolha dois riscos e verifique fisicamente o controle definido',
          'Peça a evidência de avaliação de eficácia da ação'
        ],
        evidenciaTipica: 'Plano de ação com verificação de eficácia registrada'
      },
      {
        id: 'e8r3', clausula: '4.1', titulo: 'Contexto da organização',
        resumoNorma: 'A organização deve determinar as questões internas e externas pertinentes ao seu propósito e que afetam a capacidade de alcançar os resultados do SGQ.',
        explicacaoSimples: 'A empresa sabe o que, fora e dentro dela, influencia a qualidade — e isso alimenta a análise de risco.',
        comoVerificar: [
          'Verifique a análise de contexto e sua atualização',
          'Confirme se as questões levantadas se refletem nos riscos do setor'
        ],
        evidenciaTipica: 'Análise de contexto (SWOT ou equivalente) atualizada'
      },
      {
        id: 'e8r4', clausula: '4.2', titulo: 'Partes interessadas e seus requisitos',
        resumoNorma: 'A organização deve determinar as partes interessadas pertinentes e seus requisitos, monitorando as informações sobre elas.',
        explicacaoSimples: 'Cliente, órgão regulador, fornecedor e colaborador têm exigências mapeadas e acompanhadas.',
        comoVerificar: [
          'Verifique a lista de partes interessadas e requisitos do setor',
          'Confirme se requisitos legais aplicáveis estão identificados'
        ],
        evidenciaTipica: 'Matriz de partes interessadas e requisitos legais aplicáveis'
      },
      {
        id: 'e8r5', clausula: '6.3', titulo: 'Planejamento de mudanças',
        resumoNorma: 'Quando a organização determinar a necessidade de mudanças no SGQ, elas devem ser realizadas de forma planejada, considerando propósito, integridade, recursos e responsabilidades.',
        explicacaoSimples: 'Mudança grande no processo é planejada antes, não improvisada.',
        comoVerificar: [
          'Peça a última mudança relevante do setor e o registro do planejamento',
          'Verifique se recursos e responsabilidades foram definidos'
        ],
        evidenciaTipica: 'Registro de planejamento de mudança com análise de impacto'
      }
    ]
  },

  /* ───────────────────────── 9 ───────────────────────── */
  {
    numero: 9,
    slug: 'nao-conformidades',
    titulo: 'Não Conformidades',
    subtitulo: 'Como transformar o que você viu em constatação sustentável',
    ilustracao: 'nao-conformidade',
    buscaImagem: 'auditor recording findings evidence factory notebook',
    legendaImagem: 'Registro da constatação: evidência objetiva, requisito descumprido e descrição precisa.',
    duracaoMin: 35,
    descricao:
      'Esta etapa tem dois lados. Primeiro: auditar como a organização trata as não conformidades dela — produto reprovado, reclamação de cliente, ação corretiva. Segundo: redigir corretamente as NCs que você encontrou nas etapas anteriores. Uma NC mal escrita é rejeitada na reunião de encerramento e desperdiça toda a auditoria.',
    oQueSeraAuditado: [
      'Tratamento das saídas não conformes: identificação, segregação e disposição',
      'Registro de não conformidades e reclamações de clientes',
      'Análise de causa raiz: método usado e profundidade',
      'Ações corretivas com responsável, prazo e verificação de eficácia',
      'Reincidência: o mesmo problema voltou depois de "resolvido"?',
      'A redação das constatações desta auditoria'
    ],
    porQueImporta:
      'A ação corretiva é o mecanismo de aprendizado da organização. Se a causa raiz apontada for sempre "falha do operador" e a ação for sempre "reciclagem de treinamento", o problema volta — e a auditoria seguinte encontrará a mesma coisa. Reincidência é o indicador mais confiável de que o sistema de correção não funciona.',
    comoAuditar: [
      'Peça as NCs abertas no setor nos últimos 12 meses',
      'Escolha duas: uma encerrada e uma em aberto',
      'Na encerrada, verifique a análise de causa: o método foi aplicado ou a causa foi assumida?',
      'Confirme se a ação atacou a causa apontada e se houve verificação de eficácia com evidência',
      'Verifique se o problema reincidiu depois do encerramento',
      'Confira se a organização avaliou a necessidade de estender a ação a processos similares',
      'Redija suas próprias constatações: requisito + evidência objetiva + descrição do desvio'
    ],
    oQueObservar: [
      'Causa raiz declarada como "falha humana" ou "desatenção" sem aprofundamento',
      'Ação corretiva que é apenas correção (retrabalhar a peça) sem eliminar a causa',
      'NC encerrada no mesmo dia da abertura, sem tempo de análise',
      'Verificação de eficácia registrada como "eficaz" sem nenhuma evidência anexa',
      'Reclamações de cliente tratadas informalmente, fora do sistema de NC',
      'Prazos vencidos há meses sem replanejamento'
    ],
    oQuePerguntar: [
      'Como uma não conformidade é registrada aqui? Quem pode abrir?',
      'Me mostra a última NC deste setor e o que foi feito.',
      'Qual método vocês usam para análise de causa raiz?',
      'Como se verificou que a ação funcionou?',
      'Esse mesmo problema já tinha acontecido antes?',
      'A ação foi estendida para os outros processos que têm o mesmo risco?',
      'O que acontece com o produto já produzido enquanto o problema existia?'
    ],
    evidencias: [
      'Relatórios de não conformidade (RNC) amostrados',
      'Registro da análise de causa (5 porquês, Ishikawa, A3)',
      'Evidência da verificação de eficácia (dados, fotos, registros posteriores)',
      'Histórico de reincidência do mesmo problema',
      'Registro de disposição do produto não conforme'
    ],
    documentosEsperados: [
      'Procedimento de não conformidade e ação corretiva',
      'Relatórios de NC do período',
      'Registros de reclamações de clientes',
      'Planos de ação (5W2H) com status',
      'Indicadores de NC e de reincidência'
    ],
    exemplos: [
      {
        situacao: 'RNC 2024-118: causa raiz "falta de atenção do operador"; ação: "orientar o colaborador"; eficácia: "eficaz".',
        leitura: 'Análise superficial e ação sem eliminação da causa — NC em 10.2.1. Sem evidência de eficácia, também 10.2.2.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'O mesmo defeito de vedação aparece em três RNCs distintas em 8 meses, todas encerradas.',
        leitura: 'Reincidência demonstra que a ação corretiva não foi eficaz — NC em 10.2.1 e).',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'A NC está bem analisada e a ação é adequada, mas o prazo venceu há 20 dias sem replanejamento registrado.',
        leitura: 'Descumprimento de prazo do próprio sistema — observação ou NC, conforme o procedimento interno da empresa.',
        conclusao: 'observacao'
      }
    ],
    errosComuns: [
      'Escrever NC apontando pessoas em vez de processos ("o operador João não sabia")',
      'Redigir a constatação sem citar o requisito descumprido — a NC cai por falta de critério',
      'Descrever a evidência de forma vaga: "vários documentos desatualizados"',
      'Confundir correção com ação corretiva na hora de avaliar o tratamento',
      'Sugerir a solução dentro da NC: cabe ao auditado definir a ação'
    ],
    dicas: [
      'Estrutura de uma boa NC: requisito + evidência objetiva + desvio constatado. Os três, sempre.',
      'Evidência objetiva tem nome, número e data: "IT-PRD-012 rev. 03 no posto 4, sendo a rev. 05 a vigente, em 25/08/2026".',
      'Descreva fatos, não julgamentos. Quem lê o relatório seis meses depois precisa entender sem você por perto.',
      'Classifique com critério e explique a classificação na reunião de encerramento — nada de surpresa.'
    ],
    requisitos: [
      {
        id: 'e9r1', clausula: '8.7.1', titulo: 'Controle de saídas não conformes',
        resumoNorma: 'A organização deve assegurar que saídas não conformes sejam identificadas e controladas para prevenir uso ou entrega não pretendidos, tomando ação apropriada.',
        explicacaoSimples: 'Produto reprovado é identificado, separado e tem destino decidido por quem tem autoridade.',
        comoVerificar: [
          'Verifique a área de segregação e o registro de disposição',
          'Confirme quem autoriza retrabalho, concessão ou descarte'
        ],
        evidenciaTipica: 'Registro de disposição de produto não conforme'
      },
      {
        id: 'e9r2', clausula: '8.7.2', titulo: 'Registro das saídas não conformes',
        resumoNorma: 'A organização deve reter informação documentada que descreva a não conformidade, as ações tomadas, as concessões obtidas e identifique a autoridade que decidiu a ação.',
        explicacaoSimples: 'Está registrado o que aconteceu, o que foi feito e quem decidiu.',
        comoVerificar: [
          'Amostre registros e verifique se contêm descrição, ação e autoridade',
          'Confira se concessões foram formalmente obtidas'
        ],
        evidenciaTipica: 'RNC completo com identificação da autoridade decisória'
      },
      {
        id: 'e9r3', clausula: '10.2.1 b)', titulo: 'Análise de causa e ação corretiva',
        resumoNorma: 'A organização deve avaliar a necessidade de ação para eliminar as causas da não conformidade, analisando a NC e determinando suas causas.',
        explicacaoSimples: 'A empresa investiga por que aconteceu, não apenas conserta o efeito.',
        comoVerificar: [
          'Verifique o método de análise de causa aplicado',
          'Avalie se a ação definida ataca a causa identificada'
        ],
        evidenciaTipica: '5 porquês / Ishikawa registrado com plano de ação'
      },
      {
        id: 'e9r4', clausula: '10.2.1 d-e)', titulo: 'Eficácia e atualização de riscos',
        resumoNorma: 'A organização deve analisar criticamente a eficácia das ações corretivas e, se necessário, atualizar riscos e oportunidades e efetuar mudanças no SGQ.',
        explicacaoSimples: 'Alguém confirmou, com dados, que o problema parou de acontecer.',
        comoVerificar: [
          'Peça a evidência que sustenta a conclusão de eficácia',
          'Verifique se a matriz de riscos foi atualizada quando pertinente'
        ],
        evidenciaTipica: 'Dados pós-ação (indicador, registros, inspeções) anexos ao RNC'
      },
      {
        id: 'e9r5', clausula: '10.2.2', titulo: 'Informação documentada sobre NC e ações',
        resumoNorma: 'A organização deve reter informação documentada como evidência da natureza das não conformidades, ações tomadas e resultados das ações corretivas.',
        explicacaoSimples: 'Todo o histórico do problema fica registrado e recuperável.',
        comoVerificar: [
          'Verifique a completude dos RNCs do período',
          'Confirme rastreabilidade entre NC, ação e resultado'
        ],
        evidenciaTipica: 'Base/planilha de NCs com histórico completo'
      },
      {
        id: 'e9r6', clausula: '10.3', titulo: 'Melhoria contínua',
        resumoNorma: 'A organização deve melhorar continuamente a adequação, suficiência e eficácia do SGQ, considerando resultados de análise, avaliação e análise crítica.',
        explicacaoSimples: 'As lições das NCs alimentam melhorias reais no processo.',
        comoVerificar: [
          'Verifique se melhorias implantadas se originam de análise de dados',
          'Confirme acompanhamento dos resultados obtidos'
        ],
        evidenciaTipica: 'Registros de melhoria com resultado medido'
      }
    ]
  },

  /* ───────────────────────── 10 ───────────────────────── */
  {
    numero: 10,
    slug: 'conclusao',
    titulo: 'Conclusão',
    subtitulo: 'Fechar com números, consenso e um relatório que sustenta decisões',
    ilustracao: 'reuniao',
    buscaImagem: 'closing meeting audit report presentation team office',
    legendaImagem: 'Reunião de encerramento: apresentação das constatações, consenso e assinaturas.',
    duracaoMin: 25,
    descricao:
      'A última etapa consolida os resultados, calcula os indicadores, apresenta as constatações ao auditado e formaliza o relatório. O objetivo da reunião de encerramento não é convencer ninguém: é garantir que as constatações sejam compreendidas, tenham evidência associada e que os prazos de ação sejam acordados.',
    oQueSeraAuditado: [
      'Consolidação de todas as constatações registradas nas etapas anteriores',
      'Cálculo da taxa de conformidade e da quantidade de NCs por etapa',
      'Classificação das constatações (maior, menor, observação, oportunidade)',
      'Apresentação ao auditado e registro do consenso ou da divergência',
      'Prazos acordados para os planos de ação',
      'Assinaturas e emissão do relatório final'
    ],
    porQueImporta:
      'O relatório é o produto da auditoria. Ele será lido pela direção, pelo organismo certificador e pela equipe que vai executar as ações. Se as constatações não estiverem claras e rastreáveis à evidência, nada será feito — e a auditoria terá consumido um dia inteiro do setor sem gerar melhoria.',
    comoAuditar: [
      'Revise cada constatação registrada e confirme se tem evidência objetiva anexada',
      'Confira se todas citam o requisito da norma que foi descumprido',
      'Classifique cada uma segundo o critério da organização e explique a lógica',
      'Calcule os indicadores: percentual de conformidade, total de NCs, NCs por etapa',
      'Conduza a reunião de encerramento: apresente na ordem das etapas, sem surpresas',
      'Acorde responsáveis e prazos para os planos de ação de cada NC',
      'Colha as assinaturas e emita o relatório no prazo definido pelo procedimento'
    ],
    oQueObservar: [
      'Constatação sem evidência anexa — retire ou complemente antes de apresentar',
      'Divergência do auditado sobre um fato: verifique junto, na hora, antes de fechar',
      'Prazo aceito por educação, sem viabilidade real — ele vai vencer',
      'NC que na verdade é observação, e vice-versa: a classificação afeta a credibilidade',
      'Pontos positivos não registrados: o relatório também deve reconhecer o que funciona'
    ],
    oQuePerguntar: [
      'Ficou claro qual requisito foi descumprido em cada constatação?',
      'Há alguma evidência adicional que altere alguma constatação?',
      'Quem será o responsável pelo plano de ação de cada NC?',
      'Qual prazo é realista para a análise de causa e para a ação?',
      'Quando faremos a verificação de eficácia?'
    ],
    evidencias: [
      'Relatório de auditoria completo e assinado',
      'Lista de presença da reunião de encerramento',
      'Planos de ação registrados com responsável e prazo',
      'Anexos: fotos, cópias de registros e anotações de entrevistas'
    ],
    documentosEsperados: [
      'Modelo de relatório de auditoria da organização',
      'Critério de classificação de constatações',
      'Formulário de plano de ação (5W2H)',
      'Procedimento de auditoria interna com prazo de emissão do relatório'
    ],
    exemplos: [
      {
        situacao: 'O relatório traz "documentação desatualizada no setor" como constatação.',
        leitura: 'Vago demais. O correto: "IT-PRD-012 rev. 03 disponível no posto 4 em 25/08/2026, sendo a rev. 05 a vigente conforme lista mestra LM-01" — descumpre 7.5.3.1.',
        conclusao: 'nao_conforme'
      },
      {
        situacao: 'Todas as NCs têm requisito, evidência e prazo acordado, e o auditado assinou concordando.',
        leitura: 'Encerramento adequado — as ações têm chance real de acontecer.',
        conclusao: 'conforme'
      },
      {
        situacao: 'O relatório saiu 45 dias depois, mas o procedimento interno define 10 dias.',
        leitura: 'Descumprimento do próprio procedimento — NC no processo de auditoria interna (9.2.2).',
        conclusao: 'nao_conforme'
      }
    ],
    errosComuns: [
      'Apresentar na reunião de encerramento uma constatação que o auditado nunca ouviu durante a auditoria',
      'Negociar a retirada de uma NC bem evidenciada para evitar desconforto',
      'Encerrar sem definir responsáveis e prazos — o plano de ação nunca sai do papel',
      'Emitir o relatório fora do prazo do próprio procedimento',
      'Esquecer de registrar os pontos fortes encontrados'
    ],
    dicas: [
      'Nada de surpresa no encerramento: toda constatação já deve ter sido comentada com o auditado no momento em que foi observada.',
      'Apresente na ordem das etapas. Facilita o entendimento e mostra o método.',
      'Discuta o fato, nunca a pessoa. A auditoria avalia o sistema.',
      'Registre também o que está bem feito: o relatório equilibrado tem muito mais adesão.'
    ],
    requisitos: [
      {
        id: 'e10r1', clausula: '9.2.2 d-f)', titulo: 'Relato de resultados e retenção de evidência',
        resumoNorma: 'A organização deve assegurar que os resultados das auditorias sejam relatados à gestão pertinente e reter informação documentada como evidência da implementação do programa e dos resultados.',
        explicacaoSimples: 'O resultado da auditoria é comunicado formalmente e fica registrado.',
        comoVerificar: [
          'Verifique o relatório emitido e a evidência de comunicação à gestão',
          'Confirme o prazo de emissão contra o procedimento'
        ],
        evidenciaTipica: 'Relatório de auditoria distribuído e arquivado'
      },
      {
        id: 'e10r2', clausula: '9.2.2 e)', titulo: 'Correção e ação corretiva sem demora indevida',
        resumoNorma: 'A organização deve executar correção e ação corretiva apropriadas sem demora indevida sobre as não conformidades encontradas.',
        explicacaoSimples: 'As NCs da auditoria viram plano de ação com responsável e prazo.',
        comoVerificar: [
          'Verifique se cada NC gerou plano de ação registrado',
          'Compare a data de abertura com a data de início do tratamento'
        ],
        evidenciaTipica: 'Plano de ação 5W2H vinculado a cada NC'
      },
      {
        id: 'e10r3', clausula: '9.1.3', titulo: 'Análise e avaliação dos dados',
        resumoNorma: 'A organização deve analisar e avaliar dados e informações apropriados provenientes do monitoramento e da medição.',
        explicacaoSimples: 'Os números da auditoria são analisados, não só arquivados.',
        comoVerificar: [
          'Verifique se os indicadores de auditoria alimentam alguma análise',
          'Confirme comparação com períodos anteriores'
        ],
        evidenciaTipica: 'Indicadores consolidados de auditoria interna'
      },
      {
        id: 'e10r4', clausula: '9.3.2', titulo: 'Entradas para análise crítica pela direção',
        resumoNorma: 'A análise crítica pela direção deve considerar, entre outras entradas, os resultados de auditorias.',
        explicacaoSimples: 'O resultado desta auditoria chega à reunião de análise crítica da direção.',
        comoVerificar: [
          'Verifique a última ata de análise crítica e a presença dos resultados de auditoria',
          'Confirme decisões tomadas a partir deles'
        ],
        evidenciaTipica: 'Ata de análise crítica citando resultados de auditoria'
      },
      {
        id: 'e10r5', clausula: '10.3', titulo: 'Melhoria a partir dos resultados',
        resumoNorma: 'A organização deve considerar os resultados de análise e avaliação e as saídas da análise crítica para determinar necessidades e oportunidades de melhoria.',
        explicacaoSimples: 'A auditoria gera melhoria real, não apenas um relatório arquivado.',
        comoVerificar: [
          'Verifique melhorias implantadas originadas de auditorias anteriores',
          'Confirme se o resultado das melhorias foi medido'
        ],
        evidenciaTipica: 'Registro de melhoria com origem em auditoria e resultado medido'
      }
    ]
  }
];

export const TOTAL_ETAPAS = ETAPAS.length;
export const TOTAL_REQUISITOS = ETAPAS.reduce((n, e) => n + e.requisitos.length, 0);
export const etapaPorNumero = (n: number) => ETAPAS.find((e) => e.numero === n);
export const etapaPorSlug = (s: string) => ETAPAS.find((e) => e.slug === s);
