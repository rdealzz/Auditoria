import type { Setor } from '../roteiro';

export const CNC: Setor = {
  id: 'cnc',
  nome: 'CNC / Usinagem',
  familia: 'producao',
  resumo: 'Usinagem controlada por programa: a conformidade depende de versão de programa, setup validado, ferramenta em vida útil e medição confiável.',
  ilustracao: 'manutencao',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'cnc-programa',
      titulo: 'Programa, setup e primeira peça',
      proposito: 'Programa errado ou setup não validado produz lote inteiro fora de tolerância antes que alguém perceba.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'cnc-p1',
          titulo: 'Controle de versão e aprovação do programa CNC',
          chavesClausulas: ['9001:7.5.3', '9001:8.5.1', '9001:8.5.6'],
          verificar: [
            'Confira o número e a revisão do programa carregado na máquina e compare com o desenho vigente da peça',
            'Confirme quem tem permissão para alterar programa e como a alteração é aprovada',
            'Verifique se existe backup dos programas e se ele é testado',
            'Procure programas editados diretamente no comando da máquina, sem retorno ao arquivo controlado'
          ],
          evidencias: [
            'Tela do comando mostrando o programa e a revisão carregada',
            'Registro de aprovação da versão vigente',
            'Desenho da peça com a mesma revisão'
          ],
          documentos: ['Procedimento de controle de programas CNC', 'Desenho e ficha de processo da peça'],
          registros: ['Histórico de revisões de programa', 'Registro de backup e restauração'],
          inspecionar: ['Comando da máquina e a lista de programas armazenados', 'Servidor ou mídia de backup'],
          riscos: [
            'Programa ajustado no comando sem atualizar o arquivo controlado',
            'Duas versões do mesmo programa em máquinas diferentes',
            'Backup nunca testado',
            'Programa referente a revisão anterior do desenho'
          ],
          validar: 'O programa carregado corresponde à revisão vigente do desenho, com aprovação registrada, e o arquivo controlado reflete o que roda na máquina.'
        },
        {
          id: 'cnc-p2',
          titulo: 'Aprovação de primeira peça no setup',
          chavesClausulas: ['9001:8.5.1', '9001:8.6'],
          verificar: [
            'Peça o registro de aprovação de primeira peça do último setup realizado',
            'Confirme que todas as cotas críticas do desenho foram medidas e registradas',
            'Verifique o horário da aprovação contra o início da produção em série',
            'Confirme quem aprovou e se tem autoridade para liberar'
          ],
          evidencias: ['Registro de primeira peça com valores medidos por cota', 'Desenho com as cotas críticas identificadas', 'Assinatura de quem liberou'],
          documentos: ['Procedimento de setup e aprovação de primeira peça', 'Plano de controle da peça'],
          registros: ['Registros de aprovação de setup', 'Apontamento de produção com horários'],
          inspecionar: ['Instrumentos usados na medição da primeira peça', 'Dispositivo de fixação e sua identificação'],
          riscos: [
            'Primeira peça aprovada depois de centenas produzidas',
            'Somente algumas cotas medidas',
            'Registro sem valores, apenas "conforme"',
            'Aprovação pelo próprio operador quando o procedimento exige inspeção'
          ],
          validar: 'A aprovação de primeira peça é anterior ao início da produção em série e contém valores medidos para todas as cotas críticas.'
        },
        {
          id: 'cnc-p3',
          titulo: 'Inspeção durante o processo na frequência definida',
          chavesClausulas: ['9001:8.5.1', '9001:9.1.1'],
          verificar: [
            'Confirme a frequência de inspeção definida no plano de controle',
            'Compare a frequência registrada nas fichas com a definida',
            'Verifique se os valores registrados variam de forma plausível ou se são idênticos em toda a série',
            'Confirme a ação tomada quando um valor saiu da tolerância'
          ],
          evidencias: ['Plano de controle com a frequência', 'Ficha de inspeção do lote em produção', 'Registro da ação em caso de desvio'],
          documentos: ['Plano de controle', 'Instrução de inspeção'],
          registros: ['Fichas de inspeção do período', 'Cartas de controle quando aplicável'],
          riscos: [
            'Inspeção a cada 200 peças quando o plano exige a cada 50',
            'Todos os valores idênticos, indicando preenchimento sem medição',
            'Desvio registrado sem ação correspondente'
          ],
          validar: 'A frequência registrada corresponde ao plano de controle e cada valor fora de tolerância tem ação registrada e produto delimitado.'
        }
      ]
    },
    {
      id: 'cnc-ferramentas',
      titulo: 'Ferramentas e parâmetros',
      proposito: 'Ferramenta gasta além da vida útil desvia a cota gradualmente, sem alarme.',
      ilustracao: 'calibracao',
      itens: [
        {
          id: 'cnc-f1',
          titulo: 'Controle de vida útil e preset de ferramentas',
          chavesClausulas: ['9001:8.5.1', '9001:7.1.3'],
          verificar: [
            'Confirme se existe controle de vida útil por ferramenta e como ele é acompanhado',
            'Verifique o preset: quem faz, com qual equipamento e se ele é calibrado',
            'Confira a identificação e o armazenamento das ferramentas',
            'Verifique se a troca por desgaste gera registro'
          ],
          evidencias: ['Controle de vida útil do período', 'Certificado de calibração do preset', 'Foto do armazenamento identificado'],
          documentos: ['Procedimento de gestão de ferramentas', 'Tabela de vida útil por ferramenta'],
          registros: ['Registro de troca de ferramenta', 'Correções de desgaste aplicadas no comando'],
          inspecionar: ['Presetter', 'Porta-ferramentas e cones', 'Armário de ferramentas'],
          riscos: [
            'Ferramenta usada além da vida útil até a peça sair fora de tolerância',
            'Correção de desgaste aplicada repetidamente para mascarar ferramenta gasta',
            'Preset sem calibração',
            'Ferramenta sem identificação misturada no armário'
          ],
          validar: 'Existe controle objetivo de vida útil e as trocas são registradas, sem correções sucessivas de desgaste mascarando ferramenta vencida.'
        },
        {
          id: 'cnc-f2',
          titulo: 'Fluido de corte: concentração, troca e saúde',
          chavesClausulas: ['9001:7.1.4', '45001:8.1.2', '14001:8.1'],
          verificar: [
            'Verifique a concentração do fluido com refratômetro e compare com a faixa especificada',
            'Confirme a frequência de verificação e os registros do período',
            'Confirme controle microbiológico ou de pH e o critério de troca',
            'Verifique proteção da pele dos operadores e casos de dermatose acompanhados pelo PCMSO'
          ],
          evidencias: [
            'Registro de concentração do período',
            'Ficha técnica do fluido com a faixa recomendada',
            'MTR da destinação do fluido exaurido'
          ],
          documentos: ['Ficha técnica e FDS do fluido', 'Procedimento de gestão de fluidos de corte'],
          registros: ['Controle de concentração e pH', 'Registro de trocas', 'Manifestos de destinação'],
          inspecionar: ['Refratômetro e sua aferição', 'Reservatório da máquina', 'Contenção sob as máquinas'],
          riscos: [
            'Concentração fora da faixa causando corrosão ou dermatose',
            'Fluido rançoso mantido em uso',
            'Fluido exaurido descartado na rede ou como resíduo comum',
            'Vazamento sob a máquina sem contenção'
          ],
          validar: 'A concentração medida está na faixa da ficha técnica, com registros na frequência definida, e o fluido exaurido é destinado como resíduo classe I.'
        }
      ]
    },
    {
      id: 'cnc-maquina',
      titulo: 'Segurança da máquina',
      proposito: 'NR-12 é o requisito legal mais fiscalizado em usinagem e o que mais gera acidente com amputação.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'cnc-m1',
          titulo: 'Proteções e intertravamentos conforme NR-12',
          chavesClausulas: ['45001:8.1.2', '45001:6.1.3', '9001:7.1.3'],
          verificar: [
            'Verifique a existência e a integridade das proteções fixas e móveis',
            'Confirme, com segurança, que a porta intertravada impede o funcionamento quando aberta',
            'Teste o botão de emergência e confirme que ele exige rearme',
            'Verifique se há apreciação de risco da máquina e inventário conforme NR-12'
          ],
          evidencias: [
            'Apreciação de risco da máquina',
            'Registro de verificação periódica dos dispositivos de segurança',
            'Foto das proteções instaladas'
          ],
          documentos: ['Inventário de máquinas e apreciação de risco', 'Manual do fabricante'],
          registros: ['Verificações periódicas dos intertravamentos', 'Registro de manutenção dos dispositivos'],
          inspecionar: ['Portas e intertravamentos', 'Botoeira de emergência', 'Proteções de fusos e transmissões'],
          riscos: [
            'Intertravamento anulado com chave, ímã ou jumper',
            'Proteção removida e não recolocada após manutenção',
            'Botão de emergência inoperante',
            'Máquina sem apreciação de risco'
          ],
          validar: 'A máquina não parte com a proteção aberta, o botão de emergência funciona com rearme e existe apreciação de risco documentada.'
        },
        {
          id: 'cnc-m2',
          titulo: 'Cavaco, ruído e organização do posto',
          chavesClausulas: ['45001:8.1.2', '14001:8.1', '9001:7.1.4'],
          verificar: [
            'Verifique a segregação do cavaco por liga e a existência de contenção do óleo drenado',
            'Confirme a avaliação de ruído da área e a proteção auditiva indicada',
            'Observe a organização do posto: acesso, piso escorregadio por óleo e ferramentas fora de lugar',
            'Confirme o uso de ferramenta adequada para remoção de cavaco, nunca as mãos'
          ],
          evidencias: ['Laudo de ruído vigente', 'Foto das caçambas de cavaco com contenção', 'MTR da destinação do cavaco oleoso'],
          documentos: ['PGR com o agente ruído', 'PGRS'],
          registros: ['Laudos de ruído', 'Controle de geração de cavaco'],
          inspecionar: ['Caçambas e contenção', 'Protetores auriculares em uso', 'Piso da área'],
          riscos: [
            'Cavaco oleoso a céu aberto com escoamento para a chuva',
            'Remoção de cavaco com a mão, gerando corte',
            'Piso encharcado de óleo',
            'Protetor auricular disponível mas não usado'
          ],
          validar: 'O cavaco é segregado com contenção do óleo, o laudo de ruído está vigente e a proteção auditiva é usada de fato durante a operação.'
        }
      ]
    }
  ]
};
