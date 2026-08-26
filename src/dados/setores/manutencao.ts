import type { Setor } from '../roteiro';

export const MANUTENCAO: Setor = {
  id: 'manutencao',
  nome: 'Manutenção',
  familia: 'apoio',
  resumo: 'Sustenta a capabilidade dos equipamentos e concentra as atividades de maior risco: energia perigosa, altura e espaço confinado.',
  ilustracao: 'manutencao',
  nucleo: ['documentacao', 'competencia', 'medicao', 'naoConformidade'],
  blocos: [
    {
      id: 'manut-gestao',
      titulo: 'Gestão da manutenção',
      proposito: 'Manutenção só corretiva significa que a conformidade do processo depende da sorte.',
      ilustracao: 'indicadores',
      itens: [
        {
          id: 'manut-g1',
          titulo: 'Plano de preventiva cumprido e registrado',
          chavesClausulas: ['9001:7.1.3', '9001:8.5.1'],
          verificar: [
            'Peça o plano de manutenção preventiva e compare planejado com executado no período',
            'Escolha duas ordens executadas e verifique se descrevem o serviço realizado, e não apenas "executado"',
            'Verifique as preventivas pendentes e o motivo do atraso',
            'Analise o histórico de corretivas do equipamento mais crítico e procure recorrência'
          ],
          evidencias: ['Plano de preventiva com aderência do período', 'Ordens de serviço com descrição do executado', 'Histórico de corretivas'],
          documentos: ['Plano de manutenção preventiva', 'Procedimento de gestão da manutenção'],
          registros: ['Ordens de serviço', 'Indicador de aderência ao plano'],
          inspecionar: ['Equipamentos críticos e seu estado', 'Estoque de peças críticas'],
          riscos: [
            'Preventiva fechada sem execução para fechar o indicador',
            'Ordem sem descrição do serviço',
            'Equipamento crítico só com corretiva',
            'Peça crítica sem estoque mínimo'
          ],
          validar: 'A aderência ao plano é comprovada por ordens que descrevem o serviço executado, e o equipamento crítico não apresenta corretivas recorrentes pela mesma causa.'
        },
        {
          id: 'manut-g2',
          titulo: 'Gestão de mudanças em equipamentos e instalações',
          chavesClausulas: ['45001:8.1.3', '9001:8.5.6', '14001:8.1'],
          verificar: [
            'Peça a última modificação feita em equipamento ou instalação',
            'Verifique se houve análise prévia de impacto sobre qualidade, segurança e meio ambiente',
            'Confirme a atualização de documentação, apreciação de risco e treinamento após a mudança',
            'Verifique se as proteções foram recolocadas após a intervenção'
          ],
          evidencias: ['Registro de gestão de mudança com as três análises', 'Documentação atualizada após a mudança'],
          documentos: ['Procedimento de gestão de mudanças'],
          registros: ['Registros de MOC', 'Atualização de apreciação de risco'],
          riscos: [
            'Modificação executada sem análise de risco',
            'Proteção não recolocada após manutenção',
            'Desenho e manual desatualizados após a mudança',
            'Operador não treinado na alteração'
          ],
          validar: 'A mudança amostrada tem análise prévia de qualidade, segurança e meio ambiente, com documentação e treinamento atualizados depois.'
        }
      ]
    },
    {
      id: 'manut-riscos',
      titulo: 'Atividades de alto risco',
      proposito: 'Bloqueio de energia, espaço confinado e eletricidade concentram os acidentes fatais da manutenção.',
      ilustracao: 'seguranca',
      itens: [
        {
          id: 'manut-r1',
          titulo: 'Bloqueio e etiquetagem de energias perigosas',
          chavesClausulas: ['45001:8.1.2', '45001:6.1.3'],
          verificar: [
            'Confirme a existência de procedimento de bloqueio e etiquetagem por equipamento',
            'Verifique se todas as fontes de energia são consideradas: elétrica, pneumática, hidráulica, térmica e gravitacional',
            'Observe uma intervenção e confirme cadeado individual, etiqueta e teste de energia zero',
            'Verifique o controle dos cadeados e o procedimento para remoção em ausência do responsável'
          ],
          evidencias: [
            'Procedimento de bloqueio do equipamento intervindo',
            'Foto do dispositivo bloqueado com cadeado e etiqueta',
            'Registro de liberação após a intervenção'
          ],
          documentos: ['Procedimento de bloqueio e etiquetagem', 'Identificação das fontes de energia por equipamento'],
          registros: ['Registros de bloqueio', 'Treinamento em bloqueio'],
          inspecionar: ['Cadeados e etiquetas individuais', 'Dispositivos de bloqueio', 'Pontos de dissipação de energia residual'],
          riscos: [
            'Bloqueio apenas do painel elétrico, sem despressurizar o pneumático',
            'Cadeado coletivo em vez de individual',
            'Energia residual não dissipada',
            'Equipamento religado por terceiro durante a intervenção',
            'Ausência de teste de energia zero'
          ],
          validar: 'A intervenção observada tem bloqueio individual de todas as fontes de energia, com teste de energia zero antes do início do trabalho.'
        },
        {
          id: 'manut-r2',
          titulo: 'Serviços em eletricidade conforme NR-10',
          chavesClausulas: ['45001:6.1.3', '45001:7.2', '45001:8.1.2'],
          verificar: [
            'Confirme o prontuário das instalações elétricas e sua atualização',
            'Verifique treinamento NR-10 básico e complementar SEP quando aplicável, com reciclagem vigente',
            'Confirme o uso de EPI específico: vestimenta com proteção contra arco elétrico, luva isolante com teste vigente',
            'Verifique a autorização formal dos profissionais e a análise de risco para serviços energizados'
          ],
          evidencias: ['Prontuário atualizado', 'Certificados NR-10 com reciclagem', 'Certificado de ensaio das luvas isolantes'],
          documentos: ['Prontuário de instalações elétricas', 'Procedimentos de trabalho elétrico'],
          registros: ['Autorizações formais', 'Ensaios periódicos de EPI isolante', 'Diagramas unifilares atualizados'],
          inspecionar: ['Painéis elétricos: identificação, fechamento e sinalização', 'Luvas isolantes e sua data de ensaio', 'Vestimenta anti-arco'],
          riscos: [
            'Painel elétrico aberto e sem sinalização',
            'Luva isolante sem ensaio periódico',
            'Trabalho energizado sem análise de risco e sem autorização',
            'Reciclagem NR-10 vencida',
            'Prontuário desatualizado após ampliação'
          ],
          validar: 'Os profissionais têm NR-10 vigente com autorização formal, o prontuário está atualizado e os EPIs isolantes têm ensaio dentro da validade.'
        },
        {
          id: 'manut-r3',
          titulo: 'Espaço confinado conforme NR-33',
          chavesClausulas: ['45001:8.1.2', '45001:8.2', '45001:7.2'],
          verificar: [
            'Confirme a identificação e a sinalização dos espaços confinados da planta',
            'Verifique a permissão de entrada e trabalho preenchida para a atividade em curso',
            'Confirme a medição de atmosfera antes e durante a entrada, com detector calibrado',
            'Verifique a presença de vigia permanente e os meios de resgate disponíveis'
          ],
          evidencias: [
            'PET preenchida e assinada',
            'Registro das medições de atmosfera com horário',
            'Certificado de calibração do detector de gases'
          ],
          documentos: ['Procedimento de espaço confinado', 'Cadastro dos espaços confinados', 'Plano de resgate'],
          registros: ['PETs emitidas', 'Calibração e bump test do detector', 'Treinamento de supervisor, vigia e trabalhador autorizado'],
          inspecionar: ['Detector de gases e seu bump test do dia', 'Equipamento de resgate e tripé', 'Ventilação forçada', 'Sinalização dos espaços'],
          riscos: [
            'Entrada sem medição prévia da atmosfera',
            'Detector sem bump test diário',
            'Vigia abandonando o posto durante a permanência',
            'Ausência de meios de resgate no local',
            'Espaço confinado não identificado no cadastro'
          ],
          validar: 'A entrada observada tem PET válida, medição de atmosfera registrada com detector aferido no dia, vigia permanente e resgate disponível no local.'
        },
        {
          id: 'manut-r4',
          titulo: 'Resíduos e contenção de vazamentos da manutenção',
          chavesClausulas: ['14001:8.1', '14001:6.1.2'],
          verificar: [
            'Verifique a segregação de óleo usado, estopa contaminada, filtros e embalagens de graxa',
            'Confirme a contenção nos pontos de troca de óleo e no armazenamento temporário',
            'Rastreie a destinação do óleo usado até o certificado do receptor licenciado',
            'Verifique se há vazamentos ativos em equipamentos e o tratamento dado'
          ],
          evidencias: ['MTR e certificado de destinação do óleo usado', 'Fotos dos coletores e da contenção'],
          documentos: ['PGRS', 'Licença do receptor de óleo usado'],
          registros: ['Controle de geração de óleo usado', 'Registro de vazamentos e ações'],
          inspecionar: ['Bacias de contenção', 'Coletores de estopa e filtros', 'Equipamentos com vazamento'],
          riscos: [
            'Estopa com óleo no lixo comum',
            'Óleo usado armazenado sem contenção',
            'Vazamento crônico tratado apenas com bandeja e serragem',
            'Receptor de óleo sem licença vigente'
          ],
          validar: 'Todo resíduo oleoso é segregado como classe I com contenção, e o óleo usado tem destinação comprovada a receptor licenciado.'
        }
      ]
    }
  ]
};
