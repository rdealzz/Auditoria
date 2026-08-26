import type { Setor } from '../roteiro';

export const EXPEDICAO: Setor = {
  id: 'expedicao',
  nome: 'Expedição',
  familia: 'apoio',
  resumo: 'Última chance de impedir que um produto não conforme chegue ao cliente, e ponto crítico de preservação e transporte.',
  ilustracao: 'expedicao',
  nucleo: ['documentacao', 'competencia', 'naoConformidade'],
  blocos: [
    {
      id: 'exp-liberacao',
      titulo: 'Conferência final e liberação',
      proposito: 'Expedir sem liberação formal é a falha que o cliente percebe primeiro.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'exp-l1',
          titulo: 'Liberação formal antes do carregamento',
          chavesClausulas: ['9001:8.6', '9001:8.7'],
          verificar: [
            'Escolha uma expedição recente e verifique o registro de liberação anterior ao carregamento',
            'Confirme a conferência contra o pedido: quantidade, item, revisão e requisitos especiais',
            'Verifique se o data book ou a documentação exigida pelo contrato acompanhou a entrega',
            'Confirme como se impede o carregamento de item não liberado'
          ],
          evidencias: ['Registro de liberação com data anterior à do carregamento', 'Romaneio conferido e assinado', 'Índice do data book entregue'],
          documentos: ['Procedimento de expedição', 'Pedido do cliente com os requisitos'],
          registros: ['Liberações', 'Romaneios', 'Comprovantes de entrega'],
          riscos: [
            'Carregamento iniciado antes da liberação',
            'Item de revisão anterior expedido',
            'Data book incompleto entregue ao cliente',
            'Produto segregado carregado por engano'
          ],
          validar: 'A liberação é datada antes do carregamento e o romaneio confere item, revisão e quantidade contra o pedido.'
        },
        {
          id: 'exp-l2',
          titulo: 'Preservação, embalagem e proteção no transporte',
          chavesClausulas: ['9001:8.5.4'],
          verificar: [
            'Confirme o padrão de embalagem definido por tipo de produto',
            'Verifique proteção contra corrosão, impacto e umidade conforme o destino e o tempo de trânsito',
            'Observe a amarração e a peação da carga no veículo',
            'Confirme a identificação externa do volume'
          ],
          evidencias: ['Fotos da carga embalada e amarrada', 'Padrão de embalagem documentado'],
          documentos: ['Procedimento de embalagem e preservação'],
          registros: ['Registro de conferência de carregamento', 'Reclamações por avaria no transporte'],
          inspecionar: ['Cintas e catracas de amarração', 'Embalagens e proteções', 'Identificação dos volumes'],
          riscos: [
            'Peça usinada sem proteção anticorrosiva para transporte marítimo',
            'Amarração insuficiente para o peso da carga',
            'Volume sem identificação externa',
            'Cinta de amarração com corte em uso'
          ],
          validar: 'A embalagem segue o padrão definido para o destino e a amarração observada é compatível com o peso e a geometria da carga.'
        },
        {
          id: 'exp-l3',
          titulo: 'Transporte de produtos perigosos quando aplicável',
          chavesClausulas: ['45001:6.1.3', '14001:6.1.3', '14001:8.2'],
          verificar: [
            'Verifique se a empresa expede produtos classificados como perigosos',
            'Confirme rotulagem, número ONU, painéis de segurança e a ficha de emergência',
            'Verifique o envelope para transporte e a documentação exigida',
            'Confirme o treinamento de quem prepara a carga e a habilitação MOPP do motorista'
          ],
          evidencias: ['Ficha de emergência do produto', 'Foto dos painéis e rótulos no veículo', 'Documento de transporte preenchido'],
          documentos: ['Legislação de transporte de produtos perigosos aplicável', 'Fichas de emergência'],
          registros: ['Registro de expedições de produto perigoso', 'Treinamentos específicos'],
          inspecionar: ['Rotulagem das embalagens', 'Painéis e rótulos de risco no veículo', 'Kit de emergência do transportador'],
          riscos: [
            'Expedição sem ficha de emergência',
            'Painel de segurança ausente ou com número ONU errado',
            'Motorista sem MOPP',
            'Produto perigoso expedido como carga comum'
          ],
          validar: 'Toda expedição de produto perigoso tem ficha de emergência, sinalização correta no veículo e motorista com habilitação específica.'
        }
      ]
    },
    {
      id: 'exp-seguranca',
      titulo: 'Carregamento seguro e resíduos',
      proposito: 'O pátio de carregamento reúne carga suspensa, veículo em manobra e circulação de terceiros.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'exp-s1',
          titulo: 'Operação de carregamento com carga suspensa',
          chavesClausulas: ['45001:8.1.2', '45001:7.2', '45001:8.1.4.2'],
          verificar: [
            'Observe um carregamento: isolamento da área, sinaleiro e posicionamento das pessoas',
            'Confirme a habilitação do operador de ponte rolante, guindaste ou empilhadeira',
            'Verifique a inspeção periódica de cintas, cabos e ganchos utilizados',
            'Confirme se o motorista recebeu orientação de segurança e usa EPI ao permanecer no pátio',
            'Verifique se o veículo é calçado e a chave retida durante a operação'
          ],
          evidencias: [
            'Foto da operação com a área isolada e o sinaleiro posicionado',
            'Certificado de habilitação do operador',
            'Registro de inspeção dos acessórios de içamento',
            'Registro de orientação de segurança ao motorista'
          ],
          documentos: ['Procedimento de carregamento', 'Regras de segurança para terceiros no pátio'],
          registros: ['Inspeções de acessórios de içamento', 'Integração de motoristas', 'Checklist do equipamento'],
          inspecionar: ['Cintas, cabos, correntes e ganchos', 'Calços do veículo', 'Demarcação e isolamento do pátio'],
          riscos: [
            'Motorista sob a carga durante o içamento',
            'Veículo sem calço, com risco de deslocamento',
            'Cinta de içamento com corte em uso',
            'Terceiro no pátio sem EPI e sem orientação',
            'Área de carregamento sem isolamento durante a manobra'
          ],
          validar: 'A operação observada tem área isolada, operador habilitado, veículo calçado e nenhuma pessoa sob a carga suspensa.'
        },
        {
          id: 'exp-s2',
          titulo: 'Resíduos de embalagem e devoluções',
          chavesClausulas: ['14001:8.1', '14001:6.1.2', '9001:8.7'],
          verificar: [
            'Verifique a segregação de resíduos gerados na embalagem: madeira, plástico, papelão e cintas',
            'Confirme o destino de embalagens contaminadas com óleo ou produto químico',
            'Verifique o tratamento dado a produtos devolvidos pelo cliente: identificação, segregação e registro',
            'Confirme se a devolução gera não conformidade e análise de causa'
          ],
          evidencias: [
            'Fotos dos coletores identificados na área de embalagem',
            'MTR da destinação do resíduo contaminado',
            'Registro de não conformidade de um produto devolvido'
          ],
          documentos: ['PGRS', 'Procedimento de tratamento de devoluções'],
          registros: ['Controle de geração de resíduos da expedição', 'Registros de devolução e análise de causa'],
          inspecionar: ['Coletores da área de embalagem', 'Área de produtos devolvidos'],
          riscos: [
            'Embalagem contaminada descartada como resíduo comum',
            'Produto devolvido misturado ao estoque liberado',
            'Devolução resolvida com reenvio, sem análise de causa',
            'Madeira de palete acumulada sem destinação'
          ],
          validar: 'Todo produto devolvido é identificado e segregado com registro de não conformidade, e os resíduos de embalagem têm segregação e destinação definidas.'
        }
      ]
    }
  ]
};
