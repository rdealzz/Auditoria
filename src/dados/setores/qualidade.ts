import type { Setor } from '../roteiro';

export const QUALIDADE: Setor = {
  id: 'qualidade',
  nome: 'Qualidade',
  familia: 'gestao',
  resumo: 'Área que decide o que é aprovado: precisa de independência, critério documentado e medição confiável para sustentar cada liberação.',
  ilustracao: 'laboratorio',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'qual-inspecao',
      titulo: 'Planejamento e execução das inspeções',
      proposito: 'Sem plano de inspeção com critério numérico, a aprovação vira opinião.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'qual-i1',
          titulo: 'Plano de inspeção e ensaios aplicado ao produto',
          chavesClausulas: ['9001:8.1', '9001:8.6', '9001:9.1.1'],
          verificar: [
            'Peça o PIE de um produto em fabricação e confirme que define característica, método, frequência, critério e responsável',
            'Compare as inspeções registradas com o previsto no plano, escolhendo uma ordem',
            'Confirme que cada característica tem critério numérico e norma de referência',
            'Verifique os pontos de retenção e se a produção respeita a parada nesses pontos'
          ],
          evidencias: ['PIE do produto', 'Registros de inspeção da ordem escolhida', 'Comparação entre planejado e executado'],
          documentos: ['Plano de inspeção e ensaios', 'Normas e critérios contratados'],
          registros: ['Relatórios de inspeção', 'Registro de liberação nos pontos de retenção'],
          riscos: [
            'Inspeção executada em frequência menor que a planejada',
            'Critério de aceitação subjetivo, como "bom aspecto"',
            'Ponto de retenção ultrapassado sem liberação',
            'PIE genérico, igual para produtos diferentes'
          ],
          validar: 'Cada característica do PIE tem critério numérico e existe registro de inspeção na frequência definida para a ordem amostrada.'
        },
        {
          id: 'qual-i2',
          titulo: 'Independência e autoridade da decisão de liberação',
          chavesClausulas: ['9001:5.3', '9001:8.6'],
          verificar: [
            'Confirme quem tem autoridade para liberar produto e onde isso está formalizado',
            'Verifique se quem inspeciona é independente de quem produz',
            'Confirme como funciona a autoridade para parar a produção por problema de qualidade',
            'Verifique casos de liberação por concessão e quem as aprovou'
          ],
          evidencias: ['Matriz de autoridade', 'Registros de liberação com identificação do signatário', 'Registro de concessão aprovada'],
          documentos: ['Organograma e descrição de cargos', 'Procedimento de liberação e concessão'],
          registros: ['Liberações do período', 'Concessões concedidas'],
          riscos: [
            'Inspetor subordinado à produção, com pressão de prazo',
            'Concessão concedida por quem não tem autoridade',
            'Liberação retroativa após a expedição'
          ],
          validar: 'A pessoa que assina a liberação consta na matriz de autoridade e não responde hierarquicamente a quem produziu o item liberado.'
        },
        {
          id: 'qual-i3',
          titulo: 'Gestão do laboratório e dos ensaios internos',
          chavesClausulas: ['9001:7.1.5.1', '9001:7.2', '9001:8.6'],
          verificar: [
            'Confirme os ensaios executados internamente e os procedimentos correspondentes',
            'Verifique a qualificação de quem executa cada ensaio',
            'Confirme calibração dos equipamentos e validade dos reagentes e consumíveis',
            'Verifique as condições ambientais quando o ensaio as exigir'
          ],
          evidencias: ['Procedimentos de ensaio', 'Certificados de qualificação dos executantes', 'Certificados de calibração dos equipamentos'],
          documentos: ['Procedimentos de ensaio', 'Normas dos métodos'],
          registros: ['Relatórios de ensaio', 'Controle de validade de reagentes', 'Registro de condições ambientais'],
          inspecionar: ['Equipamentos de ensaio', 'Reagentes e padrões', 'Ambiente do laboratório'],
          riscos: [
            'Ensaio executado por quem não é qualificado no método',
            'Reagente vencido em uso',
            'Equipamento sem verificação intermediária entre calibrações',
            'Resultado sem incerteza quando o critério exige'
          ],
          validar: 'Cada ensaio tem procedimento, executante qualificado e equipamento calibrado, com consumíveis dentro da validade.'
        }
      ]
    },
    {
      id: 'qual-sistema',
      titulo: 'Desempenho do sistema de gestão',
      proposito: 'A área de qualidade responde pelos indicadores e pela melhoria do SGI.',
      ilustracao: 'indicadores',
      itens: [
        {
          id: 'qual-s1',
          titulo: 'Indicadores medidos, analisados e usados para decidir',
          chavesClausulas: ['9001:9.1.1', '9001:9.1.3', '14001:9.1.1', '45001:9.1.1'],
          verificar: [
            'Peça os indicadores das três normas: qualidade, ambiental e de SSO',
            'Confirme meta definida, série histórica e frequência de apuração',
            'Verifique o que foi feito quando um indicador ficou fora da meta',
            'Confirme se os indicadores alimentaram alguma decisão registrada'
          ],
          evidencias: ['Painel de indicadores com série histórica e metas', 'Plano de ação de indicador fora da meta'],
          documentos: ['Definição dos indicadores do SGI'],
          registros: ['Apuração mensal', 'Atas onde os indicadores foram discutidos'],
          riscos: [
            'Indicador apurado e arquivado, sem análise',
            'Meta ajustada para o resultado alcançado',
            'Ausência de indicadores ambientais e de SSO no painel'
          ],
          validar: 'Cada indicador tem meta, série e, quando fora da meta, uma ação registrada com responsável e prazo.'
        },
        {
          id: 'qual-s2',
          titulo: 'Satisfação do cliente e reclamações',
          chavesClausulas: ['9001:9.1.2', '9001:10.2'],
          verificar: [
            'Confirme como a percepção do cliente é monitorada e com qual frequência',
            'Rastreie uma reclamação recente do registro até o encerramento',
            'Verifique se a reclamação gerou análise de causa e se a resposta ao cliente foi registrada',
            'Confirme se reclamações recorrentes são tratadas como tendência'
          ],
          evidencias: ['Registro da reclamação com tratamento e resposta', 'Consolidação da satisfação do período'],
          documentos: ['Procedimento de tratamento de reclamações'],
          registros: ['Reclamações do período', 'Pesquisas de satisfação'],
          riscos: [
            'Reclamação tratada por e-mail, fora do sistema',
            'Resposta ao cliente sem análise de causa',
            'Reincidência do mesmo motivo sem ação estrutural'
          ],
          validar: 'A reclamação amostrada tem registro, análise de causa, ação e evidência da resposta ao cliente.'
        }
      ]
    }
  ]
};
