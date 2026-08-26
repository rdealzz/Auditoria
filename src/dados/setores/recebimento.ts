import type { Setor } from '../roteiro';

export const RECEBIMENTO: Setor = {
  id: 'recebimento',
  nome: 'Recebimento',
  familia: 'apoio',
  resumo: 'Última barreira antes do material entrar no processo: o que passar aqui sem inspeção vira problema em produção.',
  ilustracao: 'fornecedor',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'receb-inspecao',
      titulo: 'Inspeção de recebimento',
      proposito: 'Conferir quantidade não é inspecionar qualidade.',
      ilustracao: 'laboratorio',
      itens: [
        {
          id: 'receb-i1',
          titulo: 'Inspeção conforme plano, com critério definido',
          chavesClausulas: ['9001:8.4.2', '9001:8.6', '9001:9.1.1'],
          verificar: [
            'Peça o plano de inspeção de recebimento e confirme o que é verificado por tipo de material',
            'Escolha um recebimento recente e compare o executado com o planejado',
            'Confirme o critério de aceitação e o plano de amostragem utilizado',
            'Verifique a conferência dos certificados de qualidade contra a especificação de compra'
          ],
          evidencias: [
            'Plano de inspeção de recebimento',
            'Ficha de inspeção do recebimento amostrado com valores medidos',
            'Certificado de qualidade do lote recebido'
          ],
          documentos: ['Plano de inspeção de recebimento', 'Ordem de compra com a especificação'],
          registros: ['Fichas de inspeção', 'Registro de conferência de certificados'],
          inspecionar: ['Instrumentos usados na inspeção de recebimento', 'Materiais aguardando liberação'],
          riscos: [
            'Recebimento liberado só por conferência de nota fiscal',
            'Certificado arquivado sem conferência dos valores contra a especificação',
            'Amostragem sem critério definido',
            'Material liberado para produção antes da inspeção'
          ],
          validar: 'A ficha do recebimento amostrado tem valores medidos comparados à especificação da ordem de compra, com liberação posterior à inspeção.'
        },
        {
          id: 'receb-i2',
          titulo: 'Identificação de status e segregação do reprovado',
          chavesClausulas: ['9001:8.5.2', '9001:8.7'],
          verificar: [
            'Verifique se o material aguardando inspeção está identificado e separado do liberado',
            'Localize a área de material reprovado e confirme identificação e controle',
            'Rastreie uma devolução ao fornecedor do registro até a saída física'
          ],
          evidencias: ['Fotos das áreas de aguardando, liberado e reprovado', 'Registro de devolução ao fornecedor'],
          documentos: ['Procedimento de recebimento e segregação'],
          registros: ['Registros de material reprovado', 'Notas de devolução'],
          inspecionar: ['Áreas de status no recebimento', 'Etiquetas de identificação'],
          riscos: [
            'Material sem inspeção enviado direto para a produção',
            'Reprovado sem identificação ao lado do liberado',
            'Devolução sem registro de não conformidade ao fornecedor'
          ],
          validar: 'As três condições — aguardando, liberado e reprovado — têm áreas distintas e identificadas, e toda devolução gera registro ao fornecedor.'
        },
        {
          id: 'receb-i3',
          titulo: 'Avaliação e monitoramento dos fornecedores',
          chavesClausulas: ['9001:8.4.1', '9001:8.4.2'],
          verificar: [
            'Peça o critério de qualificação de fornecedores e a lista de aprovados',
            'Confirme se os fornecedores utilizados no período estão na lista',
            'Verifique a reavaliação por desempenho e o que acontece com quem fica abaixo do critério',
            'Confirme se as não conformidades de recebimento alimentam a avaliação'
          ],
          evidencias: ['Lista de fornecedores aprovados com data', 'Registro de avaliação de desempenho do período'],
          documentos: ['Procedimento de qualificação e avaliação de fornecedores'],
          registros: ['Avaliações periódicas', 'Índice de desempenho por fornecedor'],
          riscos: [
            'Compra de fornecedor fora da lista de aprovados',
            'Avaliação sem consequência para quem fica abaixo do critério',
            'NCs de recebimento não computadas na avaliação',
            'Lista sem revisão há anos'
          ],
          validar: 'Os fornecedores utilizados constam na lista de aprovados e a avaliação de desempenho incorpora as não conformidades do período.'
        }
      ]
    },
    {
      id: 'receb-sso',
      titulo: 'Descarga segura e produtos químicos na entrada',
      proposito: 'A descarga é o momento de maior exposição a queda de carga e a produtos perigosos.',
      ilustracao: 'expedicao',
      itens: [
        {
          id: 'receb-s1',
          titulo: 'Descarga de cargas e recebimento de químicos',
          chavesClausulas: ['45001:8.1.2', '14001:8.1', '45001:8.1.4.2'],
          verificar: [
            'Observe uma descarga: isolamento da área, posicionamento das pessoas e uso de acessórios adequados',
            'Confirme a exigência da FDS na entrada de qualquer produto químico novo',
            'Verifique a conferência da rotulagem GHS e da integridade das embalagens',
            'Confirme o procedimento para recebimento de produtos perigosos e a documentação de transporte'
          ],
          evidencias: [
            'Foto da descarga com área isolada',
            'FDS do último produto químico recebido',
            'Registro de conferência de embalagem e rotulagem'
          ],
          documentos: ['Procedimento de descarga', 'Procedimento de recebimento de produtos químicos'],
          registros: ['Registro de recebimento de químicos', 'Registro de recusa por embalagem danificada'],
          inspecionar: ['Área de descarga e seu isolamento', 'Embalagens recebidas e sua rotulagem', 'Kit de contenção próximo'],
          riscos: [
            'Pessoas circulando sob a carga durante a descarga',
            'Produto químico recebido sem FDS',
            'Embalagem danificada aceita sem registro',
            'Motorista participando da descarga sem integração nem EPI'
          ],
          validar: 'A área de descarga é isolada durante a operação e nenhum produto químico entra sem FDS e conferência de rotulagem registradas.'
        }
      ]
    }
  ]
};
