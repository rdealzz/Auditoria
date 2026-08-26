import type { Setor } from '../roteiro';

export const SESMT: Setor = {
  id: 'sesmt',
  nome: 'SESMT / Segurança',
  familia: 'apoio',
  resumo: 'Área que sustenta a conformidade legal de SSO da planta inteira: programas, laudos, treinamentos e resposta a emergência.',
  ilustracao: 'seguranca',
  nucleo: ['documentacao', 'competencia', 'naoConformidade'],
  blocos: [
    {
      id: 'sesmt-programas',
      titulo: 'Programas legais e laudos',
      proposito: 'PGR, PCMSO e laudos são a base legal de tudo o que a planta faz em segurança.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'sesmt-p1',
          titulo: 'PGR e inventário de riscos atualizados e aplicados',
          chavesClausulas: ['45001:6.1.2.1', '45001:6.1.2.2', '45001:6.1.3'],
          verificar: [
            'Confirme a vigência do PGR e do inventário de riscos conforme NR-01',
            'Verifique se o inventário cobre todos os setores e se foi revisado após mudanças e incidentes',
            'Escolha dois riscos de alto grau e verifique fisicamente o controle no setor correspondente',
            'Confirme o plano de ação do PGR: responsáveis, prazos e status'
          ],
          evidencias: ['PGR vigente com data', 'Inventário de riscos por setor', 'Plano de ação com status atualizado'],
          documentos: ['PGR / GRO', 'Inventário de riscos'],
          registros: ['Revisões após incidentes ou mudanças', 'Acompanhamento do plano de ação'],
          riscos: [
            'PGR desatualizado após mudança de processo',
            'Plano de ação com prazos vencidos sem replanejamento',
            'Controle previsto no papel e ausente no chão',
            'Setor novo não incluído no inventário'
          ],
          validar: 'O controle previsto no PGR para os riscos de maior grau existe fisicamente no setor e o plano de ação tem prazos vigentes.'
        },
        {
          id: 'sesmt-p2',
          titulo: 'PCMSO, exames e laudos ocupacionais coerentes',
          chavesClausulas: ['45001:6.1.3', '45001:9.1.2'],
          verificar: [
            'Confirme a vigência do PCMSO e a coerência entre os exames exigidos e os riscos do inventário',
            'Escolha dois colaboradores expostos e verifique se os exames específicos foram realizados',
            'Confirme a vigência dos laudos: LTCAT e avaliações de agentes',
            'Verifique se os resultados dos laudos alimentaram ações no PGR'
          ],
          evidencias: ['PCMSO vigente', 'ASO com os exames específicos do risco', 'LTCAT e laudos de agentes'],
          documentos: ['PCMSO', 'LTCAT', 'Laudos de higiene ocupacional'],
          registros: ['ASOs do período', 'Relatório analítico do PCMSO'],
          riscos: [
            'Exame específico ausente para agente presente no inventário',
            'Laudo vencido ou anterior à mudança de layout',
            'Resultado de laudo acima do limite sem ação',
            'ASO sem o risco descrito'
          ],
          validar: 'Para cada agente do inventário existe exame correspondente no PCMSO e laudo vigente, com ação registrada quando o limite foi excedido.'
        },
        {
          id: 'sesmt-p3',
          titulo: 'Treinamentos de NR vigentes e reciclagens em dia',
          chavesClausulas: ['45001:7.2', '45001:6.1.3'],
          verificar: [
            'Peça a matriz de treinamentos obrigatórios por função',
            'Verifique a vigência e a reciclagem dos treinamentos: NR-10, NR-11, NR-12, NR-33, NR-35 e demais aplicáveis',
            'Confirme carga horária e conteúdo contra a exigência da norma',
            'Escolha dois colaboradores em atividade e confirme a vigência do treinamento correspondente'
          ],
          evidencias: ['Matriz de treinamentos por função', 'Certificados com carga horária e data', 'Controle de vencimentos'],
          documentos: ['Matriz de treinamentos obrigatórios', 'Conteúdos programáticos'],
          registros: ['Certificados', 'Cronograma de reciclagem'],
          riscos: [
            'Reciclagem vencida com o colaborador em atividade',
            'Carga horária inferior à exigida pela NR',
            'Treinamento sem prática quando a norma exige',
            'Terceiro sem treinamento específico executando atividade de risco'
          ],
          validar: 'Todo colaborador observado executando atividade regulamentada tem treinamento vigente com a carga horária exigida pela NR.'
        }
      ]
    },
    {
      id: 'sesmt-operacao',
      titulo: 'CIPA, incidentes e emergência',
      proposito: 'Participação dos trabalhadores e resposta a emergência são exigências centrais da ISO 45001.',
      ilustracao: 'reuniao',
      itens: [
        {
          id: 'sesmt-o1',
          titulo: 'Consulta e participação dos trabalhadores',
          chavesClausulas: ['45001:5.4', '45001:7.4'],
          verificar: [
            'Confirme a constituição e o funcionamento da CIPA conforme NR-05',
            'Verifique atas, frequência das reuniões e o acompanhamento das ações levantadas',
            'Confirme como os trabalhadores participam da identificação de perigos e da investigação de incidentes',
            'Verifique o canal para relato de condição insegura e o retorno dado a quem relata'
          ],
          evidencias: ['Atas de CIPA com ações e responsáveis', 'Registros de participação na análise de risco', 'Registros de relatos e retorno'],
          documentos: ['Procedimento de consulta e participação', 'Documentação da CIPA'],
          registros: ['Atas', 'Relatos de condição insegura e tratativas'],
          riscos: [
            'CIPA formalmente constituída mas sem reuniões efetivas',
            'Ações da CIPA sem responsável ou prazo',
            'Relatos sem retorno a quem os fez',
            'Trabalhador sem participação na análise de risco da própria tarefa'
          ],
          validar: 'As atas mostram ações com responsáveis e prazos acompanhados, e existe evidência de trabalhadores participando das análises de risco.'
        },
        {
          id: 'sesmt-o2',
          titulo: 'Investigação de incidentes e quase acidentes',
          chavesClausulas: ['45001:10.2'],
          verificar: [
            'Peça a lista de incidentes e quase acidentes do período',
            'Verifique a investigação de um caso: participantes, método de análise de causa e ações',
            'Confirme a comunicação das lições aprendidas às demais áreas',
            'Verifique se há reincidência de eventos semelhantes'
          ],
          evidencias: ['Relatório de investigação completo', 'Registro da comunicação das lições aprendidas'],
          documentos: ['Procedimento de investigação de incidentes'],
          registros: ['Registros de incidentes e quase acidentes', 'Estatísticas de frequência e gravidade'],
          riscos: [
            'Quase acidente não registrado por medo de punição',
            'Causa raiz atribuída ao comportamento do trabalhador',
            'Lição aprendida não comunicada às áreas com risco similar',
            'Reincidência do mesmo evento'
          ],
          validar: 'A investigação amostrada tem participação de quem estava presente, causa que vai além do comportamento e ações concluídas e comunicadas.'
        },
        {
          id: 'sesmt-o3',
          titulo: 'Plano de emergência, brigada e simulados',
          chavesClausulas: ['45001:8.2', '14001:8.2'],
          verificar: [
            'Confirme a existência do plano de emergência e se ele cobre os cenários reais da planta',
            'Verifique a composição e o treinamento da brigada, e sua distribuição por turno',
            'Peça o registro do último simulado, com avaliação crítica e ações',
            'Confirme a manutenção dos recursos: extintores, hidrantes, alarme e iluminação de emergência'
          ],
          evidencias: ['Plano de emergência atualizado', 'Relatório do último simulado com pontos de melhoria', 'AVCB ou documento equivalente vigente'],
          documentos: ['Plano de emergência', 'Projeto de combate a incêndio', 'AVCB'],
          registros: ['Relatórios de simulado', 'Inspeções dos sistemas de combate a incêndio', 'Treinamento da brigada'],
          inspecionar: ['Extintores e hidrantes', 'Alarme e iluminação de emergência', 'Rotas de fuga e ponto de encontro'],
          riscos: [
            'Simulado sem avaliação crítica, apenas lista de presença',
            'Brigada concentrada em um turno',
            'Cenário de derramamento químico ausente do plano',
            'AVCB vencido',
            'Rota de fuga obstruída por material'
          ],
          validar: 'O plano cobre os cenários reais, a brigada está distribuída por turno e o último simulado gerou avaliação crítica com ações.'
        }
      ]
    }
  ]
};
