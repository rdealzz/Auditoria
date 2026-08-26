import type { Setor } from '../roteiro';

export const CONTRATOS: Setor = {
  id: 'contratos',
  nome: 'Contratos',
  familia: 'gestao',
  resumo: 'Porta de entrada dos requisitos: o que não for capturado e comunicado aqui vira não conformidade lá na frente.',
  ilustracao: 'fornecedor',
  nucleo: ['documentacao', 'competencia', 'naoConformidade'],
  blocos: [
    {
      id: 'cont-requisitos',
      titulo: 'Requisitos do cliente e análise crítica',
      proposito: 'Assumir compromisso sem verificar capacidade é a origem de atraso e retrabalho.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'cont-r1',
          titulo: 'Análise crítica antes de assumir o compromisso',
          chavesClausulas: ['9001:8.2.2', '9001:8.2.3'],
          verificar: [
            'Escolha um contrato recente e peça o registro de análise crítica anterior à assinatura',
            'Confirme a participação das áreas técnicas: engenharia, produção, qualidade e SESMT quando aplicável',
            'Verifique se foi avaliada a capacidade de atender prazo, norma exigida e requisitos especiais',
            'Confirme o tratamento dado a requisitos que a empresa não conseguiria atender'
          ],
          evidencias: ['Registro de análise crítica assinado, com data anterior à do contrato', 'Contrato com os requisitos identificados'],
          documentos: ['Procedimento de análise crítica de contrato', 'Contratos e pedidos do período'],
          registros: ['Atas ou formulários de análise crítica'],
          riscos: [
            'Análise crítica assinada depois do contrato fechado',
            'Norma exigida pelo cliente não identificada na proposta',
            'Prazo assumido sem consultar a produção',
            'Requisito especial descoberto só na fabricação'
          ],
          validar: 'A análise crítica é datada antes da assinatura e registra a avaliação de capacidade para cada requisito relevante.'
        },
        {
          id: 'cont-r2',
          titulo: 'Alterações contratuais controladas e comunicadas',
          chavesClausulas: ['9001:8.2.4', '9001:7.4'],
          verificar: [
            'Peça a última alteração de escopo ou prazo e o registro formal correspondente',
            'Confirme a comunicação da alteração às áreas afetadas',
            'Verifique se documentos internos foram atualizados após a alteração'
          ],
          evidencias: ['Aditivo ou registro formal da alteração', 'Comprovante de comunicação interna'],
          documentos: ['Contratos e aditivos'],
          registros: ['Registro de alterações e sua distribuição'],
          riscos: ['Alteração combinada por telefone', 'Produção seguindo a versão anterior do escopo', 'Aditivo sem repasse ao planejamento'],
          validar: 'Toda alteração tem registro formal e evidência de comunicação às áreas que executam.'
        },
        {
          id: 'cont-r3',
          titulo: 'Requisitos do SGI repassados aos contratados',
          chavesClausulas: ['9001:8.4.3', '45001:8.1.4.2', '14001:8.1'],
          verificar: [
            'Confirme se as ordens de compra e os contratos com terceiros comunicam os requisitos de qualidade, ambientais e de SSO',
            'Verifique a qualificação prévia dos contratados que executam serviços na planta',
            'Confirme a exigência e a verificação de documentação de SSO dos terceiros: treinamentos, ASO e ficha de EPI',
            'Verifique como o desempenho do contratado é acompanhado durante a execução'
          ],
          evidencias: [
            'Ordem de compra ou contrato com os requisitos do SGI explícitos',
            'Dossiê de qualificação do contratado',
            'Registro de verificação documental antes do início do serviço'
          ],
          documentos: ['Procedimento de qualificação de contratados', 'Requisitos de SSO para terceiros'],
          registros: ['Avaliações de contratados', 'Registro de integração de terceiros'],
          riscos: [
            'Terceiro iniciando serviço sem integração e sem documentação verificada',
            'Requisitos de SSO ausentes no contrato',
            'Contratado avaliado apenas por preço e prazo',
            'Ausência de acompanhamento durante a execução'
          ],
          validar: 'O contrato do terceiro amostrado explicita requisitos das três normas e existe verificação documental registrada antes do início do serviço.'
        }
      ]
    },
    {
      id: 'cont-cliente',
      titulo: 'Comunicação, entrega e satisfação',
      proposito: 'O contrato só termina quando o cliente confirma que recebeu o que foi acordado.',
      ilustracao: 'reuniao',
      itens: [
        {
          id: 'cont-c1',
          titulo: 'Comunicação com o cliente durante a execução',
          chavesClausulas: ['9001:7.4', '9001:8.2.2'],
          verificar: [
            'Confirme quem é o ponto focal do cliente e como as tratativas ficam registradas',
            'Verifique como o cliente é informado de desvios de prazo ou de escopo',
            'Confirme o registro das aprovações do cliente em pontos de retenção e inspeções conjuntas',
            'Verifique como consultas técnicas do cliente são respondidas e arquivadas'
          ],
          evidencias: [
            'Registro de comunicação formal com o cliente no contrato amostrado',
            'Aprovação do cliente em ponto de inspeção conjunta',
            'Registro de resposta a consulta técnica'
          ],
          documentos: ['Procedimento de comunicação com o cliente', 'Contrato com os pontos de aprovação'],
          registros: ['Atas de reunião com o cliente', 'Aprovações formais', 'Correspondência arquivada'],
          riscos: [
            'Tratativas relevantes apenas em conversa de aplicativo, sem registro',
            'Desvio de prazo comunicado depois do vencimento',
            'Aprovação de cliente verbal, sem formalização',
            'Consulta técnica respondida sem registro do que foi acordado'
          ],
          validar: 'As decisões que afetaram escopo, prazo ou aceitação do produto têm registro formal recuperável no dossiê do contrato.'
        },
        {
          id: 'cont-c2',
          titulo: 'Entrega, aceite e atividades pós-entrega',
          chavesClausulas: ['9001:8.6', '9001:9.1.2', '9001:10.2'],
          verificar: [
            'Escolha um contrato entregue e verifique o comprovante de aceite do cliente',
            'Confirme o cumprimento das obrigações pós-entrega previstas: garantia, assistência e documentação',
            'Verifique como reclamações pós-entrega chegam à empresa e como são tratadas',
            'Confirme se a satisfação do cliente é medida e realimenta a análise crítica'
          ],
          evidencias: [
            'Termo de aceite ou comprovante de recebimento assinado',
            'Registro de tratamento de reclamação pós-entrega',
            'Resultado de pesquisa ou avaliação de satisfação'
          ],
          documentos: ['Contrato com as obrigações pós-entrega', 'Procedimento de garantia e assistência'],
          registros: ['Termos de aceite', 'Registros de garantia acionada', 'Pesquisas de satisfação'],
          riscos: [
            'Entrega sem termo de aceite formal',
            'Obrigação de garantia não mapeada e não provisionada',
            'Reclamação resolvida informalmente, sem virar registro',
            'Satisfação medida mas não usada em nenhuma decisão'
          ],
          validar: 'O contrato amostrado tem aceite formal registrado e toda reclamação posterior gerou registro com tratamento e resposta ao cliente.'
        },
        {
          id: 'cont-c3',
          titulo: 'Requisitos legais e ambientais do contrato',
          chavesClausulas: ['14001:6.1.3', '45001:6.1.3', '9001:8.2.2'],
          verificar: [
            'Verifique se o contrato traz exigências ambientais ou de SSO específicas do cliente',
            'Confirme se essas exigências foram repassadas às áreas que as executam',
            'Verifique licenças, certificações ou qualificações exigidas pelo contrato e sua vigência',
            'Confirme como o atendimento a essas exigências é evidenciado ao cliente'
          ],
          evidencias: [
            'Cláusulas ambientais e de SSO destacadas no contrato',
            'Comprovante de repasse às áreas responsáveis',
            'Certificações e licenças exigidas, dentro da validade'
          ],
          documentos: ['Contrato e seus anexos técnicos', 'Levantamento de requisitos legais aplicáveis'],
          registros: ['Registro de análise crítica cobrindo os requisitos legais', 'Evidências enviadas ao cliente'],
          riscos: [
            'Exigência ambiental do cliente descoberta durante a execução',
            'Certificação exigida pelo contrato vencida',
            'Requisito de SSO do cliente não repassado ao setor executante'
          ],
          validar: 'Cada exigência legal, ambiental ou de SSO do contrato tem responsável identificado e evidência de atendimento dentro da validade.'
        }
      ]
    }
  ]
};
