import type { Setor } from '../roteiro';

export const FABRICACAO: Setor = {
  id: 'fabricacao',
  nome: 'Fabricação / Caldeiraria',
  familia: 'producao',
  resumo: 'Corte, conformação e preparação de peças: rastreabilidade do material e tolerâncias dimensionais definem se o conjunto vai montar.',
  ilustracao: 'linha-producao',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'fab-material',
      titulo: 'Material e rastreabilidade',
      proposito: 'Perder a identificação da chapa no corte inviabiliza a rastreabilidade de todo o conjunto.',
      ilustracao: 'rastreabilidade',
      itens: [
        {
          id: 'fab-m1',
          titulo: 'Transferência de marcação no corte',
          chavesClausulas: ['9001:8.5.2', '9001:8.5.1'],
          verificar: [
            'Acompanhe uma operação de corte e observe como a marcação da chapa é transferida para cada peça cortada',
            'Confirme o método de marcação e se ele resiste às operações seguintes',
            'Rastreie uma peça em processo até o certificado do material',
            'Verifique a identificação das sobras e retalhos que retornam ao estoque'
          ],
          evidencias: ['Peça em processo com marcação legível', 'Certificado de material correspondente', 'Registro de transferência de marcação'],
          documentos: ['Procedimento de rastreabilidade de materiais', 'Plano de corte'],
          registros: ['Controle de rastreabilidade por ordem', 'Registro de sobras identificadas'],
          inspecionar: ['Peças em processo e sua marcação', 'Área de retalhos'],
          riscos: [
            'Marcação a giz que apaga na primeira movimentação',
            'Retalho sem identificação voltando ao estoque',
            'Peça cortada sem transferência, impossibilitando rastrear a corrida'
          ],
          validar: 'Qualquer peça escolhida no chão pode ser ligada, por marcação física, ao certificado de material da corrida de origem.'
        },
        {
          id: 'fab-m2',
          titulo: 'Conformidade dimensional e tolerâncias',
          chavesClausulas: ['9001:8.5.1', '9001:8.6', '9001:7.1.5.1'],
          verificar: [
            'Peça o desenho da peça em fabricação e identifique as tolerâncias exigidas',
            'Acompanhe a verificação dimensional e confirme os instrumentos utilizados',
            'Confirme a aferição de gabaritos e dispositivos de conferência',
            'Verifique o critério para peças fora de tolerância e o registro correspondente'
          ],
          evidencias: ['Desenho com tolerâncias', 'Registro dimensional com valores medidos', 'Certificado de calibração dos instrumentos'],
          documentos: ['Desenhos de fabricação', 'Procedimento de inspeção dimensional'],
          registros: ['Relatórios dimensionais', 'Registros de peças reprovadas'],
          inspecionar: ['Trena, paquímetro, esquadro e gabaritos', 'Mesa de traçagem'],
          riscos: [
            'Trena pessoal sem identificação usada na conferência',
            'Gabarito deformado e sem verificação periódica',
            'Peça fora de tolerância seguindo para montagem',
            'Registro dimensional sem valores'
          ],
          validar: 'As medições usam instrumentos identificados e calibrados, com valores registrados e comparados às tolerâncias do desenho.'
        }
      ]
    },
    {
      id: 'fab-processos',
      titulo: 'Corte térmico, conformação e esmerilhamento',
      proposito: 'Concentram risco de queimadura, projeção, ruído e exposição a fumos.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'fab-c1',
          titulo: 'Corte por oxicorte ou plasma',
          chavesClausulas: ['45001:8.1.2', '14001:8.1', '9001:8.5.1'],
          verificar: [
            'Verifique o estado de mangueiras, reguladores e válvulas antirretrocesso no oxicorte',
            'Confirme a exaustão ou ventilação na mesa de corte, especialmente em plasma',
            'Confirme o EPI utilizado: proteção facial com tonalidade adequada, luva, perneira e avental',
            'Verifique o destino da escória e do resíduo do corte'
          ],
          evidencias: ['Foto do posto durante a operação', 'Registro de inspeção de mangueiras e reguladores', 'MTR do resíduo de corte'],
          documentos: ['Procedimento de corte térmico', 'Análise de risco da tarefa'],
          registros: ['Inspeção periódica dos equipamentos de corte', 'Controle de resíduos'],
          inspecionar: ['Maçarico, mangueiras e válvulas antirretrocesso', 'Mesa de corte e exaustão', 'Cilindros'],
          riscos: [
            'Mangueira com emenda improvisada',
            'Ausência de válvula antirretrocesso',
            'Corte de material revestido sem exaustão, gerando fumo tóxico',
            'Escória acumulada gerando risco de queda e incêndio'
          ],
          validar: 'O equipamento tem válvula antirretrocesso e inspeção registrada, a exaustão opera durante o corte e o EPI corresponde à análise de risco.'
        },
        {
          id: 'fab-c2',
          titulo: 'Esmerilhamento e discos abrasivos',
          chavesClausulas: ['45001:8.1.2', '45001:6.1.2.1'],
          verificar: [
            'Verifique a validade dos discos em uso e a integridade da embalagem no estoque',
            'Confirme a presença da guarda de proteção na esmerilhadeira e se ela não foi removida',
            'Confirme a rotação máxima do disco contra a rotação da máquina',
            'Observe o EPI: proteção facial completa, e não apenas óculos'
          ],
          evidencias: ['Foto do disco com data de validade', 'Foto da esmerilhadeira com guarda instalada', 'Ficha de EPI'],
          documentos: ['Procedimento de uso de abrasivos', 'Análise de risco'],
          registros: ['Controle de estoque e validade de discos'],
          inspecionar: ['Guarda de proteção', 'Discos em uso e em estoque', 'Empunhadura lateral'],
          riscos: [
            'Guarda removida para alcançar áreas de difícil acesso',
            'Disco vencido ou trincado',
            'Rotação do disco inferior à da máquina',
            'Uso apenas de óculos, sem protetor facial'
          ],
          validar: 'Todo disco em uso está dentro da validade e compatível com a rotação da máquina, e a guarda de proteção está instalada.'
        },
        {
          id: 'fab-c3',
          titulo: 'Movimentação de cargas e içamento',
          chavesClausulas: ['45001:8.1.2', '45001:7.2'],
          verificar: [
            'Confirme a habilitação do operador de ponte rolante e do sinaleiro conforme NR-11',
            'Verifique a inspeção periódica de cintas, cabos, correntes e ganchos',
            'Confirme a identificação da capacidade nos acessórios',
            'Observe se existe passagem de pessoas sob carga suspensa'
          ],
          evidencias: ['Certificados de habilitação', 'Relatório de inspeção dos acessórios de içamento', 'Foto do acessório com capacidade identificada'],
          documentos: ['Procedimento de movimentação de cargas', 'Plano de inspeção de acessórios'],
          registros: ['Inspeções periódicas', 'Registro de descarte de acessórios reprovados'],
          inspecionar: ['Cintas, cabos, correntes e ganchos', 'Trava de segurança dos ganchos', 'Ponte rolante e seus fins de curso'],
          riscos: [
            'Cinta com corte ou desgaste em uso',
            'Gancho sem trava',
            'Carga içada sem sinaleiro em área com circulação',
            'Acessório sem identificação de capacidade'
          ],
          validar: 'Os acessórios em uso têm inspeção vigente e capacidade identificada, e a movimentação observada respeita a área isolada.'
        }
      ]
    }
  ]
};
