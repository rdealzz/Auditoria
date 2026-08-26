import type { Setor } from '../roteiro';

export const ENGENHARIA: Setor = {
  id: 'engenharia',
  nome: 'Engenharia / Projeto',
  familia: 'gestao',
  resumo: 'Onde o produto é definido: erro de projeto se propaga por toda a fábrica e só aparece na montagem ou no campo.',
  ilustracao: 'documento',
  nucleo: ['documentacao', 'competencia', 'naoConformidade'],
  blocos: [
    {
      id: 'eng-projeto',
      titulo: 'Projeto e desenvolvimento',
      proposito: 'Entradas, análise crítica, verificação e validação são etapas distintas e cada uma precisa de evidência própria.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'eng-p1',
          titulo: 'Entradas de projeto completas e aprovadas',
          chavesClausulas: ['9001:8.3.2', '9001:8.3.3'],
          verificar: [
            'Escolha um projeto recente e peça as entradas registradas',
            'Confirme que incluem requisitos funcionais, de desempenho, legais, normas aplicáveis e experiência de projetos anteriores',
            'Verifique se requisitos ambientais e de segurança do produto foram considerados',
            'Confirme a aprovação das entradas antes do início do desenvolvimento'
          ],
          evidencias: ['Registro de entradas de projeto aprovado e datado', 'Contrato ou especificação do cliente'],
          documentos: ['Procedimento de projeto e desenvolvimento', 'Normas aplicáveis ao produto'],
          registros: ['Entradas de projeto', 'Registro de aprovação'],
          riscos: [
            'Entradas informais, apenas em e-mail',
            'Requisito legal do produto não identificado',
            'Lições de projetos anteriores não consideradas',
            'Desenvolvimento iniciado antes da aprovação das entradas'
          ],
          validar: 'As entradas estão registradas, aprovadas antes do início do desenvolvimento, e cobrem requisitos legais e normativos do produto.'
        },
        {
          id: 'eng-p2',
          titulo: 'Análise crítica, verificação e validação distintas',
          chavesClausulas: ['9001:8.3.4', '9001:8.3.5'],
          verificar: [
            'Peça as evidências das três atividades para o mesmo projeto',
            'Confirme que a verificação demonstra que as saídas atendem às entradas',
            'Confirme que a validação demonstra que o produto atende ao uso pretendido',
            'Verifique os participantes de cada análise crítica e as ações geradas'
          ],
          evidencias: ['Ata de análise crítica com participantes e ações', 'Relatório de verificação', 'Relatório de validação ou ensaio de protótipo'],
          documentos: ['Procedimento de projeto', 'Plano do projeto com as etapas'],
          registros: ['Atas, relatórios de verificação e validação'],
          riscos: [
            'Verificação e validação tratadas como a mesma coisa',
            'Análise crítica sem representantes das áreas afetadas',
            'Ação da análise crítica sem acompanhamento',
            'Validação substituída pela primeira entrega ao cliente'
          ],
          validar: 'Existem evidências separadas de verificação e de validação, e cada análise crítica tem participantes das áreas afetadas e ações acompanhadas.'
        },
        {
          id: 'eng-p3',
          titulo: 'Controle de alterações de engenharia',
          chavesClausulas: ['9001:8.3.6', '9001:8.5.6', '45001:8.1.3'],
          verificar: [
            'Peça a última alteração de engenharia e o registro de aprovação',
            'Verifique a análise de impacto sobre produto em processo, estoque e itens já entregues',
            'Confirme como a nova revisão chegou ao chão de fábrica e como a anterior foi recolhida',
            'Confirme se a mudança foi avaliada quanto a novos perigos e aspectos ambientais'
          ],
          evidencias: ['Registro de alteração com análise de impacto', 'Comprovante de distribuição da nova revisão', 'Registro de recolhimento da anterior'],
          documentos: ['Procedimento de controle de alterações', 'Desenhos e listas de material'],
          registros: ['Histórico de alterações', 'Comunicação às áreas afetadas'],
          riscos: [
            'Alteração comunicada por e-mail sem controle de revisão',
            'Estoque de peças da revisão anterior sem tratamento',
            'Revisão antiga permanecendo no posto de trabalho',
            'Mudança sem avaliar novos riscos de SSO'
          ],
          validar: 'A alteração tem aprovação, análise de impacto sobre estoque e produto em processo, e evidência de que a revisão anterior foi recolhida.'
        }
      ]
    },
    {
      id: 'eng-responsabilidade',
      titulo: 'Responsabilidade técnica e requisitos legais',
      proposito: 'Projeto de estrutura e equipamento tem responsabilidade legal formal.',
      ilustracao: 'documento',
      itens: [
        {
          id: 'eng-r1',
          titulo: 'Responsabilidade técnica formalizada',
          chavesClausulas: ['9001:5.3', '9001:8.3.5', '45001:6.1.3'],
          verificar: [
            'Confirme a ART ou documento equivalente para os projetos que a exigem',
            'Verifique o registro profissional vigente do responsável técnico',
            'Confirme que memoriais de cálculo e desenhos liberados estão assinados por quem tem habilitação'
          ],
          evidencias: ['ART emitida e paga', 'Registro profissional vigente', 'Memorial de cálculo assinado'],
          documentos: ['ARTs do período', 'Memoriais de cálculo'],
          registros: ['Controle de ARTs por projeto'],
          riscos: ['Projeto liberado sem ART', 'Registro profissional vencido', 'Memorial sem assinatura do responsável'],
          validar: 'Cada projeto que exige responsabilidade técnica tem ART emitida e profissional com registro vigente.'
        },
        {
          id: 'eng-r2',
          titulo: 'Requisitos ambientais e de segurança considerados no projeto',
          chavesClausulas: ['14001:6.1.2', '45001:8.1.2', '9001:8.3.3'],
          verificar: [
            'Verifique se o projeto considerou a segurança de quem vai fabricar, montar e manter o produto',
            'Confirme a previsão de pontos de ancoragem, acessos e proteções no próprio projeto',
            'Verifique se aspectos ambientais do ciclo de vida foram considerados: materiais, resíduos e destinação'
          ],
          evidencias: ['Registro da análise de riscos do projeto', 'Detalhes de projeto com pontos de ancoragem e proteções'],
          documentos: ['Procedimento de projeto com os critérios de SSO e ambientais'],
          registros: ['Análise crítica com participação de SESMT e meio ambiente'],
          riscos: [
            'Estrutura projetada sem previsão de ancoragem para manutenção futura',
            'Peça pesada sem ponto de içamento previsto',
            'Aspectos de ciclo de vida não considerados'
          ],
          validar: 'O registro de análise crítica mostra participação de SESMT e meio ambiente, com requisitos incorporados ao projeto.'
        }
      ]
    }
  ]
};
