import type { Setor } from '../roteiro';

export const ALMOXARIFADO: Setor = {
  id: 'almoxarifado',
  nome: 'Almoxarifado',
  familia: 'apoio',
  resumo: 'Guarda e distribui material: preservação, identificação e controle de produtos químicos concentram os riscos da área.',
  ilustracao: 'armazem',
  nucleo: ['documentacao', 'competencia', 'naoConformidade'],
  blocos: [
    {
      id: 'almox-guarda',
      titulo: 'Identificação, preservação e validade',
      proposito: 'Material trocado ou degradado na estocagem chega ao processo como se fosse conforme.',
      ilustracao: 'rastreabilidade',
      itens: [
        {
          id: 'almox-g1',
          titulo: 'Identificação e rastreabilidade do material estocado',
          chavesClausulas: ['9001:8.5.2', '9001:8.5.4'],
          verificar: [
            'Escolha três itens aleatórios nas prateleiras e peça a identificação de cada um',
            'Confirme se a identificação permite chegar ao lote e ao certificado de qualidade',
            'Verifique se o status de inspeção está visível: liberado, em análise ou reprovado',
            'Confirme a conferência entre o saldo do sistema e o físico'
          ],
          evidencias: ['Fotos das etiquetas nos itens amostrados', 'Certificado do lote correspondente', 'Registro do último inventário'],
          documentos: ['Procedimento de armazenagem e movimentação'],
          registros: ['Inventários', 'Movimentações de entrada e saída'],
          inspecionar: ['Prateleiras e etiquetas', 'Área de itens em análise'],
          riscos: [
            'Item sem identificação misturado à prateleira',
            'Material em análise ao lado do liberado',
            'Divergência entre físico e sistema sem tratamento',
            'Etiqueta ilegível ou apagada'
          ],
          validar: 'Cada item amostrado tem identificação que leva ao lote e ao certificado, com status de inspeção visível.'
        },
        {
          id: 'almox-g2',
          titulo: 'Controle de validade e PEPS',
          chavesClausulas: ['9001:8.5.4', '9001:8.7'],
          verificar: [
            'Identifique os itens com prazo de validade: consumíveis de solda, tintas, adesivos, reagentes e abrasivos',
            'Verifique o controle de validade e a sinalização de itens próximos do vencimento',
            'Confirme a aplicação do PEPS na separação',
            'Procure fisicamente itens vencidos nas prateleiras'
          ],
          evidencias: ['Relatório de itens por validade', 'Fotos das datas nas embalagens amostradas'],
          documentos: ['Procedimento de controle de validade'],
          registros: ['Controle de vencimento', 'Registro de descarte de itens vencidos'],
          inspecionar: ['Prateleiras de tintas, adesivos, eletrodos e discos abrasivos'],
          riscos: [
            'Item vencido disponível para requisição',
            'Controle de validade apenas no sistema, sem verificação física',
            'PEPS ignorado, com lote antigo ao fundo',
            'Item vencido descartado sem registro'
          ],
          validar: 'Nenhum item vencido está disponível para requisição e o controle de validade tem verificação física registrada.'
        },
        {
          id: 'almox-g3',
          titulo: 'Condições de armazenagem preservam o material',
          chavesClausulas: ['9001:8.5.4', '9001:7.1.4'],
          verificar: [
            'Verifique se as condições exigidas por ficha técnica são atendidas: temperatura, umidade e proteção da luz',
            'Confirme o armazenamento de consumíveis de solda em local seco, com controle',
            'Observe empilhamento, capacidade das prateleiras e estabilidade',
            'Verifique proteção contra intempéries nas áreas externas'
          ],
          evidencias: ['Registro de temperatura e umidade quando exigido', 'Fotos das condições de armazenagem'],
          documentos: ['Fichas técnicas com as condições de estocagem', 'Layout do almoxarifado'],
          registros: ['Monitoramento ambiental quando aplicável'],
          inspecionar: ['Prateleiras e sua identificação de capacidade', 'Áreas externas e cobertura', 'Termohigrômetro'],
          riscos: [
            'Eletrodo revestido em prateleira comum, sujeito à umidade',
            'Prateleira sem identificação de capacidade, sobrecarregada',
            'Material sensível exposto ao sol',
            'Empilhamento instável'
          ],
          validar: 'As condições exigidas pelas fichas técnicas são atendidas e monitoradas quando aplicável, com prateleiras dentro da capacidade identificada.'
        }
      ]
    },
    {
      id: 'almox-quimicos',
      titulo: 'Produtos químicos e movimentação',
      proposito: 'Incompatibilidade química e empilhadeira são as duas fontes de acidente grave da área.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'almox-q1',
          titulo: 'Armazenamento seguro de produtos químicos',
          chavesClausulas: ['45001:8.1.2', '14001:8.1', '45001:8.2'],
          verificar: [
            'Confirme a disponibilidade das FDS de todos os produtos armazenados, acessíveis na área',
            'Verifique a segregação por incompatibilidade química, conforme a matriz correspondente',
            'Confirme a contenção secundária: bacias e diques com volume adequado',
            'Verifique o armazenamento de inflamáveis: quantidade, ventilação, aterramento e classificação elétrica',
            'Confirme a existência de kit de contenção e o treinamento de quem o utiliza'
          ],
          evidencias: [
            'FDS no ponto de uso',
            'Matriz de incompatibilidade aplicada ao layout',
            'Fotos das bacias de contenção com volume compatível'
          ],
          documentos: ['FDS de todos os produtos', 'Matriz de incompatibilidade química', 'Procedimento de armazenamento de inflamáveis'],
          registros: ['Inventário de produtos químicos', 'Treinamento em resposta a derramamento'],
          inspecionar: ['Bacias de contenção', 'Armário de inflamáveis', 'Kit de contenção', 'Chuveiro e lava-olhos'],
          riscos: [
            'Ácido armazenado junto a base ou a inflamável',
            'Bacia de contenção com volume menor que o do maior recipiente',
            'FDS ausente ou desatualizada',
            'Inflamável armazenado sem ventilação e sem classificação elétrica',
            'Embalagem sem rotulagem GHS'
          ],
          validar: 'A segregação segue a matriz de incompatibilidade, cada área de químicos tem contenção dimensionada e as FDS estão acessíveis no local.'
        },
        {
          id: 'almox-q2',
          titulo: 'Movimentação com empilhadeira conforme NR-11',
          chavesClausulas: ['45001:8.1.2', '45001:7.2'],
          verificar: [
            'Confirme a habilitação do operador e a vigência do treinamento NR-11',
            'Verifique o checklist diário da empilhadeira e o tratamento dos itens reprovados',
            'Confirme sinalização, demarcação de tráfego e separação entre pedestres e empilhadeira',
            'Verifique cinto de segurança em uso e a existência de protetor de cabine'
          ],
          evidencias: ['Certificado de treinamento vigente', 'Checklist diário preenchido do dia', 'Foto da demarcação de tráfego'],
          documentos: ['Procedimento de movimentação', 'Manual do equipamento'],
          registros: ['Checklists diários', 'Manutenção da empilhadeira', 'Registro de abastecimento e carga de bateria'],
          inspecionar: ['Empilhadeira: freios, buzina, luzes e garfos', 'Área de carga de bateria e sua ventilação', 'Demarcação de piso'],
          riscos: [
            'Checklist assinado sem execução',
            'Item reprovado no checklist e equipamento em operação',
            'Pedestre circulando na mesma faixa da empilhadeira',
            'Carga de bateria em local sem ventilação, com risco de hidrogênio',
            'Operador sem cinto'
          ],
          validar: 'O operador tem treinamento vigente, o checklist do dia está preenchido com itens reprovados tratados e existe separação física entre pedestre e empilhadeira.'
        }
      ]
    }
  ]
};
