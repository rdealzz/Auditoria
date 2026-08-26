import type { Setor } from '../roteiro';

export const GALVANIZACAO: Setor = {
  id: 'galvanizacao',
  nome: 'Galvanização',
  familia: 'producao',
  resumo: 'Zincagem por imersão a quente: banhos químicos, zinco fundido e efluentes ácidos concentram simultaneamente risco de qualidade, ambiental e de acidente grave.',
  ilustracao: 'manutencao',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'galv-processo',
      titulo: 'Pré-tratamento e banho de zinco',
      proposito: 'Camada aderente depende de desengraxe, decapagem e fluxagem sob controle químico, não de aparência.',
      ilustracao: 'laboratorio',
      itens: [
        {
          id: 'galv-p1',
          titulo: 'Controle químico dos banhos de pré-tratamento',
          chavesClausulas: ['9001:8.5.1', '9001:9.1.1'],
          verificar: [
            'Peça a faixa de trabalho definida para cada banho: desengraxante, decapagem ácida e fluxo',
            'Confirme a frequência de análise e compare com os registros do período',
            'Verifique concentração de ácido e teor de ferro na decapagem, e densidade, pH e relação de sais no fluxo',
            'Confirme quem executa a análise e com quais instrumentos'
          ],
          evidencias: [
            'Planilha de controle dos banhos com resultados e datas',
            'Faixa de trabalho especificada em procedimento',
            'Registro da ação tomada quando o resultado saiu da faixa'
          ],
          documentos: ['Procedimento de controle de banhos', 'Especificação das faixas de trabalho'],
          registros: ['Análises químicas dos banhos', 'Registros de correção e reposição'],
          inspecionar: ['Densímetro, pHmetro e kit de titulação', 'Tanques e seu estado de conservação'],
          riscos: [
            'Análise fora da frequência definida',
            'Resultado fora da faixa sem registro de ação',
            'Fluxo com ferro alto gerando falhas de revestimento',
            'Instrumentos de análise sem calibração'
          ],
          validar: 'Cada banho tem análises na frequência definida, dentro da faixa especificada, e todo desvio registrado tem ação correspondente.'
        },
        {
          id: 'galv-p2',
          titulo: 'Temperatura e composição do banho de zinco',
          chavesClausulas: ['9001:8.5.1', '9001:7.1.5.1'],
          verificar: [
            'Confirme a faixa de temperatura de trabalho do banho e o registro contínuo ou periódico',
            'Verifique a calibração do termopar ou pirômetro usado',
            'Peça a última análise de composição do zinco fundido e compare com a especificação',
            'Confirme o controle de remoção de matte e cinza de zinco'
          ],
          evidencias: ['Registro de temperatura do banho no período', 'Laudo de análise química do zinco', 'Certificado de calibração do termopar'],
          documentos: ['Procedimento de operação do banho', 'Especificação de composição do zinco'],
          registros: ['Controle de temperatura', 'Análises do banho', 'Controle de remoção de matte'],
          inspecionar: ['Termopar e indicador de temperatura', 'Estado da cuba e do revestimento refratário'],
          riscos: [
            'Temperatura fora da faixa afetando espessura e aparência',
            'Termopar sem calibração',
            'Acúmulo de matte no fundo reduzindo o volume útil e afetando a qualidade',
            'Análise de composição desatualizada'
          ],
          validar: 'A temperatura registrada está dentro da faixa com instrumento calibrado, e a composição do banho atende à especificação na última análise.'
        },
        {
          id: 'galv-p3',
          titulo: 'Espessura e aderência da camada de zinco',
          chavesClausulas: ['9001:8.6', '9001:7.1.5.1'],
          verificar: [
            'Confirme a espessura mínima exigida em função da espessura da peça, conforme NBR 6323 ou ISO 1461',
            'Verifique a medição com medidor magnético calibrado e o número de pontos por peça',
            'Confira a inspeção de aparência: escorrimento, falhas, cinza aderida e pontos sem revestimento',
            'Confirme o critério e o registro de reparo quando aplicável'
          ],
          evidencias: ['Relatório de espessura por peça com pontos medidos', 'Certificado de calibração do medidor', 'Norma com a espessura mínima aplicável'],
          documentos: ['Procedimento de inspeção da camada', 'NBR 6323 / ISO 1461'],
          registros: ['Relatórios de inspeção', 'Registro de reparos e retoques'],
          inspecionar: ['Medidor de camada e padrões de aferição', 'Peças acabadas em amostragem'],
          riscos: [
            'Espessura abaixo do mínimo para a classe de espessura da peça',
            'Peça com falha de revestimento liberada',
            'Retoque com tinta rica em zinco sem critério definido',
            'Medidor sem aferição'
          ],
          validar: 'A espessura medida atende ao mínimo da norma para a espessura da peça, com medidor aferido, e reparos seguem critério documentado.'
        }
      ]
    },
    {
      id: 'galv-ambiental',
      titulo: 'Efluentes, emissões e resíduos',
      proposito: 'A área concentra efluente ácido, emissão de cloreto e resíduos de zinco — é o maior passivo ambiental da planta.',
      ilustracao: 'nao-conformidade',
      itens: [
        {
          id: 'galv-a1',
          titulo: 'Tratamento e monitoramento de efluentes',
          chavesClausulas: ['14001:8.1', '14001:9.1.1', '14001:6.1.3'],
          verificar: [
            'Percorra o caminho do efluente do tanque até a estação de tratamento',
            'Confirme os parâmetros e a frequência de monitoramento exigidos pela licença',
            'Compare os laudos do período com os limites da licença e do órgão ambiental',
            'Verifique a existência de contenção sob os tanques e a integridade das canaletas'
          ],
          evidencias: ['Laudos de efluente do período com parâmetros e limites', 'Licença de operação vigente', 'Foto das bacias de contenção'],
          documentos: ['Licença ambiental e condicionantes', 'Procedimento de operação da ETE'],
          registros: ['Laudos de monitoramento', 'Registro de operação da estação', 'Ocorrências de vazamento'],
          inspecionar: ['Bacias de contenção e canaletas', 'Estação de tratamento e dosagem de reagentes', 'Poços de monitoramento quando exigidos'],
          riscos: [
            'Parâmetro acima do limite sem ação registrada',
            'Contenção com trinca ou nível de fundo comprometido',
            'Monitoramento fora da frequência da licença',
            'Ligação de emergência direta para a rede pluvial'
          ],
          validar: 'Todos os parâmetros monitorados no período estão dentro dos limites da licença, com laudos na frequência exigida e contenção íntegra.'
        },
        {
          id: 'galv-a2',
          titulo: 'Emissões atmosféricas e lavador de gases',
          chavesClausulas: ['14001:8.1', '14001:9.1.1'],
          verificar: [
            'Confirme a existência de captação sobre os tanques de decapagem e sobre a cuba de zinco',
            'Verifique o funcionamento do lavador de gases e o controle da solução de lavagem',
            'Peça o laudo de emissões dentro da frequência exigida pela licença'
          ],
          evidencias: ['Laudo de emissões atmosféricas', 'Registro de operação e manutenção do lavador'],
          documentos: ['Licença com as condicionantes de emissão', 'Procedimento de operação do sistema de captação'],
          registros: ['Laudos de emissão', 'Manutenção do lavador'],
          inspecionar: ['Coifas e dutos de captação', 'Lavador de gases e sua solução', 'Chaminé e ponto de amostragem'],
          riscos: [
            'Captação desligada durante a operação',
            'Névoa ácida visível na área de decapagem',
            'Lavador sem manutenção, com eficiência comprometida',
            'Ponto de amostragem inacessível ou inexistente'
          ],
          validar: 'A captação opera durante o processo, o lavador tem manutenção registrada e o último laudo de emissão atende aos limites da licença.'
        },
        {
          id: 'galv-a3',
          titulo: 'Resíduos de zinco e ácidos exauridos',
          chavesClausulas: ['14001:8.1', '14001:6.1.2'],
          verificar: [
            'Identifique a segregação de cinza de zinco, matte, borra de fluxo e escória',
            'Verifique o armazenamento: coberto, com contenção e identificação de classe',
            'Rastreie a destinação do ácido exaurido e confirme a licença do receptor',
            'Confirme se há reaproveitamento e se ele está formalizado'
          ],
          evidencias: ['Fotos da área de armazenamento temporário identificada', 'MTR e certificado de destinação final do ácido exaurido'],
          documentos: ['PGRS', 'Licenças dos destinadores'],
          registros: ['Controle de geração por tipo', 'Manifestos do período'],
          inspecionar: ['Baias de cinza e matte', 'Tambores de ácido exaurido', 'Cobertura e contenção do armazenamento'],
          riscos: [
            'Cinza de zinco a céu aberto, com carreamento pela chuva',
            'Ácido exaurido armazenado sem contenção',
            'Destinador com licença vencida',
            'Resíduo perigoso acumulado além do prazo permitido'
          ],
          validar: 'Todo resíduo perigoso da área está identificado, coberto, com contenção e destinado dentro do prazo a receptor com licença vigente.'
        }
      ]
    },
    {
      id: 'galv-sso',
      titulo: 'Segurança em galvanização',
      proposito: 'Zinco a cerca de 450 °C e ácido concentrado: os acidentes desta área são graves e de consequência imediata.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'galv-s1',
          titulo: 'Prevenção de explosão por umidade na imersão',
          chavesClausulas: ['45001:6.1.2.1', '45001:8.1.2'],
          verificar: [
            'Confirme a existência de controle de secagem antes da imersão no zinco',
            'Verifique como se garante que peças tubulares ou fechadas tenham furos de respiro e drenagem',
            'Confirme a análise de risco específica para projeção de zinco e a barreira física prevista',
            'Verifique se a instrução de projeto exige furos de ventilação e como isso é validado antes da imersão'
          ],
          evidencias: [
            'Procedimento com o controle de secagem e a verificação de respiros',
            'Análise de risco da atividade de imersão',
            'Foto das barreiras e do posicionamento dos operadores'
          ],
          documentos: ['Análise de risco da imersão', 'Instrução de projeto com requisitos de respiro e drenagem'],
          registros: ['Verificação de peças antes da imersão', 'Registro de incidentes de projeção'],
          inspecionar: ['Forno de secagem e sua temperatura', 'Barreiras e anteparos junto à cuba', 'Peças aguardando imersão'],
          riscos: [
            'Peça tubular sem furo de respiro entrando no banho',
            'Peça úmida imersa, gerando projeção violenta de zinco',
            'Operador posicionado na linha de projeção',
            'Ausência de barreira física junto à cuba'
          ],
          validar: 'Existe verificação documentada de secagem e de respiros antes de cada imersão, com barreira física e posicionamento seguro dos operadores.'
        },
        {
          id: 'galv-s2',
          titulo: 'Manuseio de produtos químicos e resposta a emergência',
          chavesClausulas: ['45001:8.1.2', '45001:8.2', '14001:8.2'],
          verificar: [
            'Confirme a disponibilidade e a atualidade das FDS dos produtos usados, acessíveis na área',
            'Verifique chuveiro de emergência e lava-olhos: acesso, sinalização, vazão e teste periódico',
            'Confirme o kit de contenção para derramamento ácido e o treinamento de quem o usa',
            'Verifique EPI para manuseio de ácido: avental, luva e protetor facial adequados'
          ],
          evidencias: [
            'FDS disponíveis no ponto de uso',
            'Registro de teste periódico do chuveiro e lava-olhos',
            'Registro do último simulado de derramamento químico'
          ],
          documentos: ['FDS de todos os produtos químicos da área', 'Plano de emergência com cenário de derramamento e queimadura'],
          registros: ['Testes de chuveiro e lava-olhos', 'Simulados', 'Fichas de EPI'],
          inspecionar: ['Chuveiro e lava-olhos', 'Kit de contenção', 'EPI para químicos e para calor'],
          riscos: [
            'Lava-olhos sem pressão ou obstruído',
            'FDS ausente ou em idioma que ninguém lê',
            'EPI de raspa comum onde é exigido material resistente a ácido',
            'Kit de contenção incompleto ou sem treinamento'
          ],
          validar: 'Chuveiro e lava-olhos passam no teste no momento da auditoria, as FDS estão no ponto de uso e o EPI corresponde ao indicado por elas.'
        },
        {
          id: 'galv-s3',
          titulo: 'Movimentação de carga sobre os tanques',
          chavesClausulas: ['45001:8.1.2', '9001:7.1.3'],
          verificar: [
            'Verifique inspeção periódica de talhas, pontes rolantes, cabos, correntes e ganchos',
            'Confirme a identificação da capacidade e a validade da inspeção nos acessórios de içamento',
            'Confirme habilitação do operador e do sinaleiro conforme NR-11',
            'Observe se há circulação de pessoas sob a carga durante a movimentação'
          ],
          evidencias: ['Relatório de inspeção de equipamentos de içamento', 'Certificado de habilitação dos operadores', 'Foto da carga identificada com capacidade'],
          documentos: ['Plano de inspeção de equipamentos de içamento', 'Procedimento de movimentação de carga'],
          registros: ['Inspeções periódicas', 'Registro de ensaio de carga quando aplicável'],
          inspecionar: ['Talhas, cabos, correntes, ganchos e travas', 'Fim de curso e freio da ponte rolante'],
          riscos: [
            'Corrente ou cabo com desgaste além do critério de descarte',
            'Gancho sem trava de segurança',
            'Pessoa transitando sob a carga suspensa sobre o banho',
            'Inspeção periódica vencida'
          ],
          validar: 'Os acessórios de içamento têm inspeção vigente e identificação de capacidade, e ninguém circula sob a carga durante a movimentação observada.'
        }
      ]
    }
  ]
};
