import type { Setor } from '../roteiro';

export const MONTAGEM: Setor = {
  id: 'montagem',
  nome: 'Montagem',
  familia: 'producao',
  resumo: 'Integração dos conjuntos: sequência, torque controlado e liberação dimensional definem o desempenho do produto final.',
  ilustracao: 'linha-producao',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'mont-processo',
      titulo: 'Sequência, torque e liberação',
      proposito: 'Aperto sem controle é a falha silenciosa mais comum em montagem.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'mont-p1',
          titulo: 'Controle de torque nas juntas aparafusadas',
          chavesClausulas: ['9001:8.5.1', '9001:7.1.5.1', '9001:8.6'],
          verificar: [
            'Peça a tabela ou especificação de torque aplicável a cada tipo de junta',
            'Confirme a calibração do torquímetro em uso e a validade',
            'Observe a aplicação: sequência de aperto, uso de torquímetro e não de chave comum',
            'Verifique a marcação de aperto concluído e o registro do torque aplicado'
          ],
          evidencias: [
            'Especificação de torque por junta',
            'Certificado de calibração do torquímetro correspondente ao número de série',
            'Foto da marcação de aperto nas juntas concluídas'
          ],
          documentos: ['Procedimento de montagem com a tabela de torque', 'Desenho de montagem'],
          registros: ['Registro de torque aplicado por conjunto', 'Controle de calibração dos torquímetros'],
          inspecionar: ['Torquímetros e sua identificação', 'Juntas montadas e a marcação de aperto'],
          riscos: [
            'Aperto com chave comum "no sentimento"',
            'Torquímetro sem calibração ou fora da faixa de uso',
            'Sequência de aperto ignorada em flanges',
            'Registro de torque preenchido sem aplicação'
          ],
          validar: 'O torque é aplicado com instrumento calibrado dentro da faixa, na sequência especificada, com marcação e registro por conjunto.'
        },
        {
          id: 'mont-p2',
          titulo: 'Sequência de montagem e uso de dispositivos',
          chavesClausulas: ['9001:8.5.1', '9001:7.1.3'],
          verificar: [
            'Acompanhe a montagem com o procedimento em mãos e marque cada passo executado e cada passo pulado',
            'Confirme o uso dos gabaritos e dispositivos previstos e sua verificação periódica',
            'Verifique alinhamento e nivelamento contra o critério do desenho'
          ],
          evidencias: ['Procedimento com os passos observados', 'Registro de verificação dos dispositivos', 'Registro de alinhamento'],
          documentos: ['Procedimento de montagem', 'Desenho de conjunto'],
          registros: ['Checklist de montagem', 'Verificação de gabaritos'],
          inspecionar: ['Gabaritos e dispositivos de montagem', 'Nível, esquadro e relógio comparador'],
          riscos: [
            'Passo pulado por hábito, sem análise de impacto',
            'Gabarito desgastado sem verificação periódica',
            'Alinhamento aprovado sem medição'
          ],
          validar: 'A sequência executada corresponde ao procedimento e os dispositivos usados têm verificação periódica registrada.'
        },
        {
          id: 'mont-p3',
          titulo: 'Rastreabilidade e liberação do conjunto',
          chavesClausulas: ['9001:8.5.2', '9001:8.6'],
          verificar: [
            'Escolha um conjunto pronto e verifique se é possível identificar os componentes que o formam',
            'Confirme o registro de liberação e quem autorizou',
            'Verifique se a liberação ocorreu após a conclusão de todas as verificações previstas'
          ],
          evidencias: ['Registro de rastreabilidade do conjunto', 'Registro de liberação assinado'],
          documentos: ['Lista de materiais do conjunto', 'Procedimento de liberação'],
          registros: ['Data book ou pasta do conjunto'],
          riscos: ['Conjunto sem identificação dos componentes', 'Liberação antes da inspeção final'],
          validar: 'O conjunto liberado tem rastreabilidade dos componentes críticos e a liberação é posterior a todas as verificações previstas.'
        }
      ]
    },
    {
      id: 'mont-altura',
      titulo: 'Trabalho em altura e movimentação',
      proposito: 'Queda de altura é a principal causa de morte na montagem industrial.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'mont-a1',
          titulo: 'Trabalho em altura conforme NR-35',
          chavesClausulas: ['45001:8.1.2', '45001:6.1.3', '45001:7.2'],
          verificar: [
            'Confirme a análise de risco e a permissão de trabalho para a atividade em altura',
            'Verifique o treinamento NR-35 vigente dos envolvidos e o ASO com aptidão para altura',
            'Confira cinto tipo paraquedista, talabarte duplo com absorvedor e o ponto de ancoragem',
            'Confirme a inspeção periódica dos equipamentos e a existência de plano de resgate'
          ],
          evidencias: [
            'Permissão de trabalho em altura preenchida no dia',
            'Certificados de treinamento e ASO com aptidão',
            'Registro de inspeção do cinto e do talabarte'
          ],
          documentos: ['Procedimento de trabalho em altura', 'Plano de resgate'],
          registros: ['PT emitidas no período', 'Inspeção dos equipamentos de proteção contra quedas'],
          inspecionar: ['Cinto, talabarte e trava-quedas', 'Pontos de ancoragem e linha de vida', 'Escadas e plataformas'],
          riscos: [
            'Talabarte simples onde é exigido duplo',
            'Ancoragem em tubulação ou estrutura não dimensionada',
            'Trabalho em altura sem permissão',
            'Ausência de plano de resgate',
            'Cinto com costura desgastada em uso'
          ],
          validar: 'A atividade em altura observada tem PT emitida, trabalhadores treinados e aptos, e ancoragem em ponto formalmente definido.'
        },
        {
          id: 'mont-a2',
          titulo: 'Andaimes e plataformas de trabalho',
          chavesClausulas: ['45001:8.1.2', '45001:6.1.3'],
          verificar: [
            'Verifique a liberação do andaime por profissional habilitado e a etiqueta de liberação',
            'Confirme piso completo, guarda-corpo, rodapé e acesso adequado',
            'Verifique o nivelamento, a sapata e a ancoragem à estrutura'
          ],
          evidencias: ['Etiqueta ou registro de liberação do andaime', 'Foto do andaime montado'],
          documentos: ['Procedimento de montagem de andaimes', 'ART do responsável quando aplicável'],
          registros: ['Liberação e reinspeção periódica dos andaimes'],
          inspecionar: ['Guarda-corpo, rodapé e piso', 'Sapatas e travamentos', 'Escada de acesso'],
          riscos: [
            'Andaime em uso sem liberação',
            'Piso incompleto ou tábua solta',
            'Ausência de rodapé, com risco de queda de material',
            'Acesso pela própria estrutura do andaime'
          ],
          validar: 'O andaime em uso tem liberação registrada por profissional habilitado e apresenta piso completo, guarda-corpo e rodapé.'
        }
      ]
    }
  ]
};
