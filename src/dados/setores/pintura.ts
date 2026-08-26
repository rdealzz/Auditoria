import type { Setor } from '../roteiro';

export const PINTURA: Setor = {
  id: 'pintura',
  nome: 'Pintura',
  familia: 'producao',
  resumo: 'Processo especial em que a durabilidade do revestimento depende de preparação de superfície, condições ambientais e espessura — nada disso é visível no produto pronto.',
  ilustracao: 'linha-producao',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'pint-preparacao',
      titulo: 'Preparação de superfície',
      proposito: 'A maior parte das falhas de pintura nasce aqui, e depois de aplicada a tinta não há como verificar.',
      ilustracao: 'manutencao',
      itens: [
        {
          id: 'pint-p1',
          titulo: 'Grau de limpeza da superfície conforme especificado',
          chavesClausulas: ['9001:8.5.1', '9001:8.6'],
          verificar: [
            'Peça a especificação de pintura e confirme o grau de limpeza exigido, por exemplo Sa 2½ ou St 3 da ISO 8501-1',
            'Compare a superfície jateada com o padrão fotográfico da norma, no local e sob boa iluminação',
            'Confirme a remoção de óleo e graxa antes do jateamento, não depois',
            'Verifique a presença de sais solúveis quando o contrato exigir, com o teste correspondente'
          ],
          evidencias: [
            'Registro de inspeção citando o grau alcançado e o padrão comparado',
            'Foto da superfície preparada com identificação da peça',
            'Resultado do teste de sais solúveis quando aplicável'
          ],
          documentos: ['Especificação técnica de pintura do contrato', 'ISO 8501-1 ou padrão equivalente'],
          registros: ['Relatório de inspeção de preparação de superfície'],
          inspecionar: ['Superfície jateada antes da aplicação', 'Abrasivo utilizado e sua contaminação'],
          riscos: [
            'Jateamento aprovado por aparência, sem comparação com padrão',
            'Desengraxe feito depois do jateamento, incrustando óleo',
            'Abrasivo reutilizado contaminado com óleo ou umidade',
            'Superfície preparada e deixada exposta além do tempo permitido antes da aplicação'
          ],
          validar: 'O grau registrado corresponde ao exigido pela especificação, comparado ao padrão da norma, e o intervalo entre preparação e aplicação respeita o limite definido.'
        },
        {
          id: 'pint-p2',
          titulo: 'Perfil de rugosidade dentro da faixa especificada',
          chavesClausulas: ['9001:8.5.1', '9001:7.1.5.1'],
          verificar: [
            'Confirme a faixa de rugosidade exigida pela ficha técnica da tinta de fundo',
            'Verifique a medição com fita replica ou rugosímetro e a calibração do instrumento',
            'Confira a quantidade de pontos medidos por área, conforme o procedimento'
          ],
          evidencias: ['Registro de rugosidade com valores por ponto', 'Certificado de calibração do rugosímetro ou lote da fita replica'],
          documentos: ['Ficha técnica da tinta com a rugosidade requerida', 'Procedimento de medição de perfil'],
          registros: ['Relatório de perfil de rugosidade'],
          inspecionar: ['Rugosímetro ou kit de fita replica', 'Granulometria do abrasivo'],
          riscos: [
            'Perfil abaixo do mínimo, comprometendo a aderência',
            'Perfil excessivo, com picos que não são cobertos pela espessura de tinta',
            'Instrumento sem calibração'
          ],
          validar: 'Os valores medidos estão dentro da faixa da ficha técnica da tinta e o instrumento usado tem calibração vigente.'
        }
      ]
    },
    {
      id: 'pint-condicoes',
      titulo: 'Condições ambientais e tinta',
      proposito: 'Aplicar fora da janela de temperatura, umidade e ponto de orvalho invalida o esquema, mesmo com tudo o mais correto.',
      ilustracao: 'calibracao',
      itens: [
        {
          id: 'pint-c1',
          titulo: 'Condições ambientais registradas antes de cada aplicação',
          chavesClausulas: ['9001:7.1.4', '9001:8.5.1'],
          verificar: [
            'Peça o registro de condições ambientais do dia e do horário da aplicação em curso',
            'Confirme a medição de temperatura ambiente, temperatura do substrato, umidade relativa e ponto de orvalho',
            'Verifique a regra aplicada: a temperatura do substrato deve estar pelo menos 3 °C acima do ponto de orvalho',
            'Confirme a calibração do termohigrômetro e do termômetro de contato'
          ],
          evidencias: [
            'Planilha de condições ambientais preenchida no horário da aplicação',
            'Certificado de calibração do termohigrômetro',
            'Leitura feita na sua presença, comparada ao registro'
          ],
          documentos: ['Procedimento de pintura com os limites ambientais', 'Ficha técnica da tinta'],
          registros: ['Registro de condições ambientais por demão'],
          inspecionar: ['Termohigrômetro', 'Termômetro de contato para substrato', 'Tabela de ponto de orvalho'],
          riscos: [
            'Registro preenchido em bloco no fim do turno',
            'Valores idênticos repetidos em todas as linhas do dia',
            'Aplicação com substrato a menos de 3 °C do ponto de orvalho',
            'Termohigrômetro sem calibração'
          ],
          validar: 'A leitura que você fizer no momento coincide com o registro do horário, e todas as aplicações do período respeitam a margem sobre o ponto de orvalho.'
        },
        {
          id: 'pint-c2',
          titulo: 'Identificação, validade e preparo da tinta',
          chavesClausulas: ['9001:8.5.2', '9001:8.5.4', '9001:8.4.1'],
          verificar: [
            'Confira lote, data de fabricação e validade nas latas em uso',
            'Confirme a relação de mistura entre componente A e B contra a ficha técnica',
            'Verifique o tempo de indução respeitado e o controle do pot life após a mistura',
            'Confirme o diluente e o percentual de diluição usados contra a especificação'
          ],
          evidencias: [
            'Foto do rótulo da lata com lote e validade',
            'Registro de preparo com hora da mistura e proporção utilizada',
            'Ficha técnica do fabricante'
          ],
          documentos: ['Ficha técnica e FISPQ das tintas', 'Especificação do esquema de pintura'],
          registros: ['Controle de lote por área pintada', 'Registro de preparo de tinta'],
          inspecionar: ['Latas em uso e no estoque', 'Balança ou recipiente graduado da mistura'],
          riscos: [
            'Tinta vencida em uso',
            'Mistura no olho, sem pesagem ou medição',
            'Pot life estourado e a mistura continua sendo aplicada',
            'Diluição acima do permitido para render mais'
          ],
          validar: 'O lote em uso está dentro da validade, a proporção seguiu a ficha técnica e existe controle de hora da mistura contra o pot life.'
        }
      ]
    },
    {
      id: 'pint-inspecao',
      titulo: 'Espessura, aderência e liberação',
      proposito: 'É aqui que se prova que o esquema especificado foi realmente entregue.',
      ilustracao: 'laboratorio',
      itens: [
        {
          id: 'pint-i1',
          titulo: 'Espessura de película seca conforme o esquema',
          chavesClausulas: ['9001:8.6', '9001:7.1.5.1'],
          verificar: [
            'Confirme a espessura nominal por demão e total exigida pelo esquema',
            'Verifique a medição de película úmida durante a aplicação, com pente calibrado',
            'Acompanhe a medição de película seca com medidor eletromagnético e confira a aferição no padrão antes do uso',
            'Confirme o critério de aceitação aplicado, por exemplo a regra 80/20 da SSPC-PA 2, e o número de pontos por área'
          ],
          evidencias: [
            'Relatório de espessura com valores por ponto e média',
            'Certificado de calibração do medidor e registro da aferição do dia',
            'Esquema de pintura com as espessuras nominais'
          ],
          documentos: ['Esquema de pintura do contrato', 'Procedimento de medição de espessura'],
          registros: ['Relatórios de EPS e ESF por peça ou área'],
          inspecionar: ['Medidor de espessura e padrões de aferição', 'Pente de película úmida'],
          riscos: [
            'Medidor não aferido no padrão antes do uso',
            'Número de pontos abaixo do exigido pelo critério',
            'Média dentro do especificado mascarando pontos muito abaixo do mínimo',
            'Medição feita só onde a aplicação ficou boa'
          ],
          validar: 'A espessura medida atende ao critério do contrato ponto a ponto, com medidor aferido no padrão no mesmo dia.'
        },
        {
          id: 'pint-i2',
          titulo: 'Ensaio de aderência quando exigido',
          chavesClausulas: ['9001:8.6'],
          verificar: [
            'Confirme se o contrato exige ensaio de aderência e em qual frequência',
            'Verifique o método usado, corte em X, grade ou tração, e a norma correspondente',
            'Confira o critério de aceitação e o registro do resultado com a classificação obtida',
            'Confirme o reparo da área ensaiada'
          ],
          evidencias: ['Relatório de aderência com método, norma e classificação', 'Foto do corpo de prova ou da área ensaiada'],
          documentos: ['Procedimento de ensaio de aderência', 'Especificação com o critério'],
          registros: ['Relatórios de aderência do período', 'Registro do reparo pós-ensaio'],
          inspecionar: ['Aparelho de pull-off e sua calibração', 'Estilete e gabarito de grade'],
          riscos: ['Ensaio não realizado na frequência exigida', 'Área ensaiada não reparada', 'Resultado sem classificação, apenas "aprovado"'],
          validar: 'O ensaio ocorre na frequência contratada, com classificação registrada contra o critério da norma, e a área ensaiada foi reparada.'
        }
      ]
    },
    {
      id: 'pint-sso-ambiental',
      titulo: 'Segurança e meio ambiente na pintura',
      proposito: 'Solventes, névoa de tinta e atmosfera explosiva concentram os riscos graves desta área.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'pint-s1',
          titulo: 'Proteção respiratória e controle de exposição a solventes',
          chavesClausulas: ['45001:8.1.2', '45001:9.1.1'],
          verificar: [
            'Confirme o tipo de proteção respiratória usado e se corresponde ao indicado pelo laudo: PFF com filtro químico ou respirador de linha de ar',
            'Verifique se existe programa de proteção respiratória com teste de vedação e troca de filtros controlada',
            'Peça o monitoramento de agentes químicos que cobre os solventes e isocianatos utilizados',
            'Confirme exames do PCMSO específicos para os agentes da área'
          ],
          evidencias: [
            'Laudo de avaliação de agentes químicos vigente',
            'Registro de teste de vedação do respirador',
            'Controle de troca de filtros'
          ],
          documentos: ['PGR com os agentes da pintura', 'Programa de proteção respiratória', 'FISPQ das tintas e solventes'],
          registros: ['Laudos de higiene ocupacional', 'ASO e exames específicos'],
          inspecionar: ['Respiradores e filtros em uso', 'Cabine de pintura e sua exaustão', 'Ar comprimido do respirador de linha e seu filtro'],
          riscos: [
            'Uso de PFF simples onde o laudo exige filtro químico',
            'Filtro químico sem controle de vida útil',
            'Ar de linha sem purificação adequada',
            'Pintura com isocianato sem exame específico'
          ],
          validar: 'A proteção respiratória usada corresponde à indicada pelo laudo vigente, com teste de vedação e controle de troca de filtro registrados.'
        },
        {
          id: 'pint-s2',
          titulo: 'Área classificada, aterramento e prevenção de incêndio',
          chavesClausulas: ['45001:8.1.2', '45001:8.2'],
          verificar: [
            'Confirme a classificação da área de pintura e se os equipamentos elétricos são adequados à classificação',
            'Verifique aterramento das peças, do equipamento de aplicação e dos recipientes de solvente durante a transferência',
            'Confirme a existência e a validade dos recursos de combate a incêndio da área',
            'Verifique o armazenamento de solventes: quantidade em área de trabalho, recipientes fechados e ventilação'
          ],
          evidencias: [
            'Documento de classificação de área',
            'Foto do aterramento conectado durante a operação',
            'Inspeção dos extintores e do sistema fixo'
          ],
          documentos: ['Classificação de áreas', 'Procedimento de armazenamento de inflamáveis'],
          registros: ['Inspeção de extintores', 'Medição de continuidade do aterramento'],
          inspecionar: ['Luminárias e tomadas na cabine', 'Cabos de aterramento e garras', 'Armário de inflamáveis'],
          riscos: [
            'Equipamento elétrico comum em área classificada',
            'Aterramento desconectado durante a transferência de solvente',
            'Estoque de solvente dentro da cabine',
            'Panos com solvente acumulados sem recipiente metálico fechado'
          ],
          validar: 'Os equipamentos da área atendem à classificação, o aterramento está conectado durante a operação e o solvente é mantido apenas na quantidade de uso diário.'
        },
        {
          id: 'pint-s3',
          titulo: 'Emissões atmosféricas e resíduos perigosos',
          chavesClausulas: ['14001:8.1', '14001:6.1.3', '14001:9.1.1'],
          verificar: [
            'Confirme o sistema de tratamento da cabine: filtros, cortina de água ou lavador, e seu plano de manutenção',
            'Verifique se a licença ambiental exige monitoramento de emissões e se os laudos estão dentro da frequência',
            'Rastreie o destino da borra de tinta, do solvente contaminado, das embalagens e dos filtros usados como resíduo classe I',
            'Confirme a existência de contenção nas áreas de manuseio de solvente'
          ],
          evidencias: [
            'Laudo de emissões atmosféricas dentro da validade',
            'MTR da borra de tinta e do solvente com destinador licenciado',
            'Registro de troca de filtros da cabine'
          ],
          documentos: ['Licença de operação com as condicionantes de emissão', 'PGRS'],
          registros: ['Laudos de emissão', 'Manifestos de resíduo classe I', 'Manutenção do sistema de tratamento'],
          inspecionar: ['Filtros e cortina de água da cabine', 'Tambores de resíduo classe I e sua identificação', 'Bacias de contenção'],
          riscos: [
            'Embalagem de tinta descartada como sucata comum',
            'Solvente sujo reutilizado sem controle ou descartado na rede',
            'Filtro de cabine saturado, aumentando a emissão',
            'Condicionante de monitoramento da licença não cumprida'
          ],
          validar: 'Todo resíduo de tinta e solvente é classificado como perigoso, armazenado com contenção e destinado com manifesto a receptor licenciado.'
        }
      ]
    }
  ]
};
