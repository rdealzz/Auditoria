import type { Setor } from '../roteiro';

export const SOLDA: Setor = {
  id: 'solda',
  nome: 'Solda',
  familia: 'producao',
  resumo: 'Processo especial: o resultado não é totalmente verificável por inspeção do produto acabado, o que exige controle de pessoal qualificado, procedimento validado e parâmetros.',
  ilustracao: 'linha-producao',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'solda-qualificacao',
      titulo: 'Qualificação de pessoal e de procedimento',
      proposito: 'Soldagem é processo especial: sem soldador qualificado e EPS validada por RQPS, não há como afirmar conformidade.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'sold-q1',
          titulo: 'Qualificação vigente dos soldadores',
          chavesClausulas: ['9001:7.2', '9001:8.5.1'],
          verificar: [
            'Identifique os soldadores em atividade no momento da auditoria e anote nome e sinete',
            'Peça o certificado de qualificação de cada um e confira a data de emissão e a validade',
            'Confirme que a faixa qualificada cobre o que está sendo soldado: processo, posição, espessura, diâmetro e material',
            'Verifique o registro de continuidade: a qualificação cai se o soldador ficar além do prazo sem soldar pelo processo'
          ],
          evidencias: [
            'Certificado de qualificação do soldador com faixa de validade e sinete',
            'Registro de continuidade assinado dentro do período exigido',
            'Foto da junta em execução mostrando posição e processo'
          ],
          documentos: ['Certificados de qualificação (ASME IX, AWS D1.1 ou ISO 9606, conforme o contrato)', 'Matriz de soldadores por processo e posição'],
          registros: ['Controle de validade das qualificações', 'Registro de continuidade de soldagem'],
          inspecionar: ['Sinete do soldador na peça', 'Mapa de soldagem com a identificação de quem executou cada junta'],
          riscos: [
            'Soldador executando posição fora da faixa qualificada',
            'Qualificação vencida por falta de registro de continuidade',
            'Sinete de um soldador aplicado em junta executada por outro'
          ],
          validar: 'Para cada junta amostrada, o sinete corresponde a um soldador com qualificação vigente e faixa que cobre processo, posição, material e espessura executados.'
        },
        {
          id: 'sold-q2',
          titulo: 'EPS/WPS aplicável e qualificada por RQPS/PQR',
          chavesClausulas: ['9001:8.5.1', '9001:7.5.3'],
          verificar: [
            'Peça a EPS/WPS da junta que está sendo soldada e confirme que está disponível no posto, não apenas no escritório',
            'Confirme que a EPS está amparada por RQPS/PQR e que o número do registro consta na especificação',
            'Compare os parâmetros essenciais da EPS com o que está ocorrendo: processo, metal de adição, gás e vazão, corrente, tensão, polaridade, temperatura de pré-aquecimento e interpasse',
            'Verifique se a EPS cobre a espessura e o material efetivamente utilizados'
          ],
          evidencias: [
            'EPS/WPS vigente no posto com o número do RQPS/PQR que a qualifica',
            'RQPS/PQR com os ensaios mecânicos que sustentam a faixa',
            'Anotação dos parâmetros reais lidos no equipamento durante a soldagem'
          ],
          documentos: ['EPS/WPS por junta', 'RQPS/PQR correspondentes', 'Mapa ou plano de soldagem'],
          registros: ['Aprovação e revisão das EPS', 'Distribuição das EPS aos postos'],
          inspecionar: ['Display da fonte de soldagem durante a execução', 'Termômetro de contato ou giz térmico para interpasse'],
          riscos: [
            'EPS sem RQPS que a qualifique',
            'Parâmetro real fora da faixa da EPS, ajustado pelo operador por conveniência',
            'Pré-aquecimento e interpasse não controlados em aço de maior carbono equivalente',
            'EPS aplicada a espessura fora da faixa qualificada'
          ],
          validar: 'Os parâmetros observados na fonte durante a soldagem estão dentro das faixas da EPS, e a EPS cita o RQPS que a qualifica para aquele material e espessura.'
        }
      ]
    },
    {
      id: 'solda-consumiveis',
      titulo: 'Consumíveis e rastreabilidade de materiais',
      proposito: 'Consumível trocado ou eletrodo úmido gera trinca a frio e porosidade que a inspeção visual não pega.',
      ilustracao: 'armazem',
      itens: [
        {
          id: 'sold-c1',
          titulo: 'Identificação e certificação dos consumíveis',
          chavesClausulas: ['9001:8.5.2', '9001:8.4.1'],
          verificar: [
            'Confira a embalagem do consumível em uso: classificação AWS, lote e fabricante',
            'Compare a classificação com a exigida pela EPS da junta',
            'Peça o certificado de qualidade do lote e confirme que corresponde ao lote em uso',
            'Verifique se há consumível fora da embalagem original, sem identificação'
          ],
          evidencias: [
            'Embalagem com classificação AWS e lote legíveis',
            'Certificado de qualidade do fabricante correspondente ao lote',
            'EPS mostrando o consumível especificado'
          ],
          documentos: ['Certificados de qualidade dos consumíveis', 'EPS com o metal de adição especificado'],
          registros: ['Controle de recebimento e liberação de consumíveis', 'Requisição por lote'],
          inspecionar: ['Porta-eletrodos e cochichos no posto', 'Carretéis de arame na máquina'],
          riscos: [
            'Eletrodo solto na bancada, sem identificação',
            'Classificação diferente da especificada na EPS',
            'Lote sem certificado ou certificado de outro lote'
          ],
          validar: 'O consumível em uso tem classificação idêntica à da EPS e o lote pode ser ligado a um certificado de qualidade específico.'
        },
        {
          id: 'sold-c2',
          titulo: 'Armazenamento, secagem e manutenção dos eletrodos',
          chavesClausulas: ['9001:8.5.4', '9001:8.5.1'],
          verificar: [
            'Verifique a estufa de secagem e a estufa de manutenção: temperatura indicada, temperatura real e registro',
            'Confirme que os parâmetros de secagem seguem a recomendação do fabricante para a classe do eletrodo',
            'Confira o controle de retirada: hora em que o eletrodo saiu da estufa e o tempo máximo permitido de exposição',
            'Verifique se os eletrodos de baixo hidrogênio ficam em cochicho aquecido no posto'
          ],
          evidencias: [
            'Registro de temperatura da estufa no dia da auditoria',
            'Controle de retirada com horário de saída e identificação do soldador',
            'Foto do cochicho em uso no posto'
          ],
          documentos: ['Procedimento de manuseio e armazenamento de consumíveis', 'Ficha técnica do fabricante com os parâmetros de secagem'],
          registros: ['Planilha de temperatura das estufas', 'Controle de retirada e devolução'],
          inspecionar: ['Estufa de secagem e de manutenção', 'Termômetro da estufa e sua calibração', 'Cochichos portáteis'],
          riscos: [
            'Estufa desligada ou com termostato desregulado',
            'Eletrodo fora da estufa há mais tempo que o permitido',
            'Embalagem aberta guardada em prateleira comum, sujeita à umidade',
            'Termômetro da estufa sem calibração'
          ],
          validar: 'A temperatura registrada corresponde à especificada pelo fabricante, o termômetro é calibrado e há controle do tempo de exposição do eletrodo desde a retirada.'
        },
        {
          id: 'sold-c3',
          titulo: 'Rastreabilidade do metal de base',
          chavesClausulas: ['9001:8.5.2', '9001:8.4.1'],
          verificar: [
            'Escolha uma peça em fabricação e rastreie a chapa ou perfil até o certificado de qualidade do material (MTR)',
            'Verifique a transferência de marcação: quando a chapa é cortada, a identificação precisa ser transferida para cada parte',
            'Confirme que a composição química e as propriedades mecânicas do certificado atendem à especificação do projeto'
          ],
          evidencias: [
            'Certificado de qualidade do material com corrida e composição',
            'Marcação física na peça ligando-a ao certificado',
            'Registro de transferência de marcação após o corte'
          ],
          documentos: ['MTR / certificados de qualidade do metal de base', 'Especificação de material do projeto'],
          registros: ['Controle de rastreabilidade por ordem de fabricação', 'Registro de transferência de marcação'],
          inspecionar: ['Marcação nas peças em processo', 'Retalhos e sobras identificados'],
          riscos: [
            'Marcação perdida após o corte, sem transferência',
            'Retalho sem identificação retornando ao estoque',
            'Certificado que não corresponde à corrida marcada na chapa'
          ],
          validar: 'A peça em processo pode ser ligada, por marcação física, a um certificado de material cuja composição atende à especificação de projeto.'
        }
      ]
    },
    {
      id: 'solda-equipamentos',
      titulo: 'Equipamentos de soldagem',
      proposito: 'A fonte precisa entregar de fato o que o display indica, senão o controle de parâmetros é ilusório.',
      ilustracao: 'manutencao',
      itens: [
        {
          id: 'sold-e1',
          titulo: 'Calibração e verificação das fontes de soldagem',
          chavesClausulas: ['9001:7.1.5.1', '9001:7.1.5.2', '9001:7.1.3'],
          verificar: [
            'Identifique a fonte em uso e confira a etiqueta de calibração ou verificação',
            'Abra o certificado e confirme que o número de série corresponde ao equipamento',
            'Confirme que a calibração cobre as grandezas usadas no controle: corrente, tensão e, quando aplicável, velocidade de alimentação',
            'Verifique cabos, garras, terra e conexões quanto a estado e aquecimento'
          ],
          evidencias: [
            'Etiqueta de calibração com validade no equipamento em uso',
            'Certificado com número de série coincidente',
            'Registro de manutenção preventiva da fonte'
          ],
          documentos: ['Plano de calibração dos equipamentos de soldagem', 'Plano de manutenção preventiva'],
          registros: ['Certificados de calibração', 'Ordens de serviço de manutenção executadas'],
          inspecionar: ['Fonte de soldagem e display', 'Cabos, garras e cabo terra', 'Fluxômetro e regulador de gás'],
          riscos: [
            'Fonte sem calibração, com parâmetros controlados apenas pelo display',
            'Cabo terra preso na estrutura em vez da peça, alterando o circuito',
            'Fluxômetro sem verificação, com vazão de gás fora do especificado',
            'Cabos com emenda improvisada ou isolamento danificado'
          ],
          validar: 'A fonte tem calibração vigente para corrente e tensão, o certificado corresponde ao número de série e o aterramento é feito diretamente na peça.'
        }
      ]
    },
    {
      id: 'solda-inspecao',
      titulo: 'Inspeção, ensaios e liberação',
      proposito: 'A conformidade da solda se prova por inspeção qualificada com critério de aceitação definido.',
      ilustracao: 'laboratorio',
      itens: [
        {
          id: 'sold-i1',
          titulo: 'Inspeção visual por inspetor qualificado',
          chavesClausulas: ['9001:8.6', '9001:7.2'],
          verificar: [
            'Identifique quem faz a inspeção visual de solda e peça a qualificação vigente',
            'Confirme o critério de aceitação aplicado e de qual norma ou código ele vem',
            'Acompanhe uma inspeção e verifique iluminação, limpeza da junta e uso dos gabaritos de solda',
            'Confira se descontinuidades como mordedura, falta de fusão, poro e respingo são avaliadas contra limites numéricos'
          ],
          evidencias: [
            'Certificado de qualificação do inspetor vigente',
            'Relatório de inspeção visual com critério citado e resultado por junta',
            'Foto da junta inspecionada com identificação'
          ],
          documentos: ['Procedimento de inspeção visual', 'Norma ou código com o critério de aceitação contratado'],
          registros: ['Relatórios de inspeção visual', 'Mapa de juntas com status'],
          inspecionar: ['Gabaritos de solda e sua calibração', 'Lanterna e lupa', 'Condição de iluminação no local'],
          riscos: [
            'Inspeção feita pelo próprio soldador, sem independência',
            'Inspetor sem qualificação vigente',
            'Critério de aceitação não definido, deixando a avaliação a critério pessoal',
            'Junta pintada antes da inspeção'
          ],
          validar: 'A inspeção visual é feita por profissional qualificado, independente da execução, contra critério numérico de norma citado no relatório.'
        },
        {
          id: 'sold-i2',
          titulo: 'Ensaios não destrutivos conforme o plano',
          chavesClausulas: ['9001:8.6', '9001:8.5.1', '9001:7.1.5.1'],
          verificar: [
            'Peça o plano de inspeção e ensaios e confirme o percentual de END exigido por tipo de junta',
            'Verifique se o percentual executado corresponde ao planejado, escolhendo uma ordem de fabricação',
            'Confira a qualificação do inspetor de END no método aplicado e o nível exigido',
            'Confirme a validade dos consumíveis do ensaio, como líquido penetrante e revelador, e a calibração do equipamento'
          ],
          evidencias: [
            'Plano de inspeção e ensaios do produto',
            'Relatórios de END com identificação da junta, método, técnica e resultado',
            'Certificado do inspetor no método e nível exigidos'
          ],
          documentos: ['Procedimento de END por método', 'Plano de inspeção e ensaios (PIE)'],
          registros: ['Relatórios de LP, PM, US ou RX', 'Registro de reparos e reinspeção'],
          inspecionar: ['Kit de líquido penetrante com validade', 'Yoke de partículas magnéticas e sua aferição', 'Aparelho de ultrassom e blocos padrão'],
          riscos: [
            'Percentual de END executado menor que o planejado',
            'Consumível de ensaio vencido',
            'Reparo executado sem reinspeção',
            'Relatório sem identificar qual junta foi ensaiada'
          ],
          validar: 'O percentual de END executado atende ao plano, os relatórios identificam as juntas por código e todo reparo tem reinspeção registrada.'
        },
        {
          id: 'sold-i3',
          titulo: 'Registro de liberação da junta soldada',
          chavesClausulas: ['9001:8.6', '9001:8.5.2'],
          verificar: [
            'Peça o registro de liberação de uma ordem concluída',
            'Confirme que ele identifica quem autorizou e que essa pessoa tem autoridade formal',
            'Verifique se a liberação só ocorreu após a conclusão de todos os ensaios previstos'
          ],
          evidencias: ['Registro de liberação assinado', 'Matriz de autoridade para liberação'],
          documentos: ['Procedimento de liberação de produto'],
          registros: ['Data book ou pasta de rastreabilidade da ordem'],
          riscos: [
            'Liberação antes da conclusão dos END',
            'Assinatura de quem não tem autoridade definida',
            'Data book incompleto na entrega'
          ],
          validar: 'A data de liberação é posterior à conclusão de todos os ensaios previstos e o signatário consta na matriz de autoridade.'
        }
      ]
    },
    {
      id: 'solda-sso-ambiental',
      titulo: 'Segurança e meio ambiente na soldagem',
      proposito: 'Fumos metálicos, radiação, gases comprimidos e trabalho a quente são os riscos que matam ou adoecem nesta área.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'sold-s1',
          titulo: 'Controle de fumos metálicos e ventilação',
          chavesClausulas: ['45001:8.1.2', '45001:9.1.1', '14001:8.1'],
          verificar: [
            'Verifique a existência e o funcionamento da exaustão localizada nos postos de soldagem',
            'Confirme se o braço de exaustão está posicionado próximo ao arco durante a operação, e não recolhido',
            'Peça o monitoramento de agentes químicos que cobre fumos metálicos e gases da área',
            'Se houver solda em aço inoxidável, confirme controle específico para cromo hexavalente'
          ],
          evidencias: [
            'Foto da exaustão em uso durante a soldagem',
            'Laudo de avaliação de agentes químicos com resultado e data',
            'Registro de manutenção e limpeza dos filtros'
          ],
          documentos: ['PGR com os agentes químicos avaliados', 'Procedimento de ventilação industrial'],
          registros: ['Laudos de higiene ocupacional', 'Manutenção dos sistemas de exaustão'],
          inspecionar: ['Braços e coifas de exaustão', 'Filtros e sua saturação', 'Respiradores em uso'],
          riscos: [
            'Exaustão existente mas desligada ou mal posicionada',
            'Filtro saturado, sem plano de troca',
            'Soldagem de inox sem controle de cromo hexavalente',
            'Avaliação de agentes químicos vencida'
          ],
          validar: 'A exaustão está ligada e posicionada junto ao arco durante a operação, e existe laudo vigente demonstrando exposição dentro do limite.'
        },
        {
          id: 'sold-s2',
          titulo: 'EPI específico de soldagem e proteção de terceiros',
          chavesClausulas: ['45001:8.1.2', '45001:7.2'],
          verificar: [
            'Confirme o uso de máscara de solda com tonalidade adequada ao processo e à corrente',
            'Verifique avental e mangote de raspa, luvas de soldador, perneira e calçado',
            'Confirme proteção respiratória quando indicada pelo laudo',
            'Verifique se há biombos ou cortinas protegendo quem trabalha ao redor da radiação do arco'
          ],
          evidencias: [
            'Foto do soldador em operação com o conjunto completo',
            'Ficha de entrega de EPI assinada',
            'Foto dos biombos posicionados'
          ],
          documentos: ['Matriz de EPI da função soldador', 'Análise de risco da tarefa'],
          registros: ['Fichas de entrega e troca de EPI'],
          inspecionar: ['Máscara e sua tonalidade', 'Estado do avental e das luvas', 'Biombos e cortinas de solda'],
          riscos: [
            'Ajudante próximo ao arco sem proteção ocular',
            'Ausência de biombo, expondo quem passa a queimadura de córnea',
            'Luva de raspa furada ou avental rasgado',
            'Máscara com tonalidade insuficiente para a corrente usada'
          ],
          validar: 'O soldador e os trabalhadores ao redor estão protegidos da radiação e das projeções durante a execução observada.'
        },
        {
          id: 'sold-s3',
          titulo: 'Gases comprimidos e trabalho a quente',
          chavesClausulas: ['45001:8.1.2', '45001:8.2'],
          verificar: [
            'Verifique cilindros: fixação vertical por corrente, capacete quando fora de uso e afastamento entre oxigênio e combustível',
            'Confirme a existência de válvula antirretrocesso de chama nos maçaricos',
            'Peça a permissão de trabalho a quente para atividades fora da área designada',
            'Confirme a presença de extintor, isolamento e vigia de fogo quando exigido'
          ],
          evidencias: [
            'Foto dos cilindros fixados e identificados',
            'Permissão de trabalho a quente preenchida e assinada',
            'Foto do extintor posicionado junto ao trabalho'
          ],
          documentos: ['Procedimento de trabalho a quente', 'Procedimento de manuseio de gases comprimidos'],
          registros: ['Permissões de trabalho emitidas no período', 'Inspeção periódica de mangueiras e reguladores'],
          inspecionar: ['Cilindros, correntes e capacetes', 'Mangueiras, reguladores e válvulas antirretrocesso', 'Extintores da área'],
          riscos: [
            'Cilindro deitado ou solto, sem corrente',
            'Oxigênio armazenado junto a gás combustível',
            'Maçarico sem válvula antirretrocesso',
            'Trabalho a quente sem permissão e sem vigia de fogo',
            'Mangueira com emenda de arame'
          ],
          validar: 'Os cilindros estão fixados e separados por tipo, os maçaricos têm válvula antirretrocesso e todo trabalho a quente fora da área designada tem permissão emitida.'
        },
        {
          id: 'sold-s4',
          titulo: 'Resíduos gerados pela soldagem',
          chavesClausulas: ['14001:8.1', '14001:6.1.2'],
          verificar: [
            'Confirme a segregação de pontas de eletrodo, escória, respingo e disco de esmerilhamento usado',
            'Verifique a destinação de EPI contaminado e de estopa com óleo',
            'Confirme o destino da sucata metálica e se ela é comercializada com receptor licenciado'
          ],
          evidencias: ['Fotos dos coletores identificados no posto', 'MTR da última destinação de resíduo classe I da área'],
          documentos: ['Plano de gerenciamento de resíduos', 'Licença do receptor'],
          registros: ['Controle de geração por tipo', 'Manifestos de transporte'],
          inspecionar: ['Coletores no posto de soldagem', 'Baia de sucata metálica'],
          riscos: [
            'Ponta de eletrodo e escória no lixo comum',
            'EPI contaminado descartado como resíduo comum',
            'Sucata acumulada sem contenção, gerando escoamento com óleo'
          ],
          validar: 'Cada resíduo gerado no posto tem coletor identificado compatível e o classe I chega a um destinador licenciado com manifesto.'
        }
      ]
    }
  ]
};
