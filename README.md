# Auditoria

Assistente guiado de auditorias da qualidade. Conduz qualquer pessoa — técnico, analista,
engenheiro da qualidade ou auditor interno — por uma auditoria completa em **10 etapas**,
ensinando o que verificar em cada uma antes de liberar o checklist.

Não é apenas uma lista de verificação: cada etapa explica o objetivo, o que será auditado,
por que o requisito importa, como conduzir, o que observar, o que perguntar, quais evidências
coletar, exemplos práticos, erros comuns e dicas de auditor. O botão **Iniciar verificação**
só é liberado depois que a explicação foi lida.

## Como rodar

```bash
npm install
npm run dev          # http://localhost:3000
```

Acesso inicial:

| Usuário | Senha | Perfil |
|---|---|---|
| `erick.jesus` | `qualidade` | Administrador |

Nesta versão **todos os usuários têm exatamente as mesmas permissões**.

> A autenticação embutida é de demonstração: as credenciais estão no código do cliente e a
> sessão fica no navegador. Para uso real, ative o Supabase Auth (abaixo) antes de expor o
> sistema na internet.

## Setores

| Produção | Apoio | Gestão |
|---|---|---|
| Fabricação / Caldeiraria | Manutenção | Qualidade |
| Solda | Recebimento | Engenharia / Projeto |
| CNC / Usinagem | Almoxarifado | Contratos |
| Montagem | Expedição | |
| Pintura | SESMT / Segurança | |
| Galvanização | | |

**234 verificações** no catálogo, entre 14 e 24 por setor. Cada roteiro combina os blocos
técnicos da área com o núcleo comum do SGI (documentação, competência, aspectos ambientais,
perigos e riscos, medição e tratamento de não conformidades).

Exemplo do que a auditoria de **Solda** orienta a verificar, e não apenas a perguntar:

- Qualificação vigente do soldador, com faixa que cobre processo, posição, espessura e material
- EPS/WPS disponível no posto e amparada por RQPS/PQR, com os parâmetros reais conferidos na fonte
- Classificação AWS do consumível contra a especificada, e o lote ligado ao certificado
- Temperatura da estufa, calibração do termômetro e tempo de exposição do eletrodo desde a retirada
- Transferência de marcação do metal de base após o corte, até o certificado da corrida
- Calibração da fonte para corrente e tensão, com o terra ligado diretamente na peça
- Percentual de END executado contra o planejado, com reinspeção de todo reparo
- Exaustão ligada e posicionada junto ao arco, com laudo de agentes químicos vigente
- Cilindros fixados, válvula antirretrocesso e permissão de trabalho a quente
- Segregação de pontas de eletrodo, escória e EPI contaminado, com manifesto de destinação

O mesmo nível de detalhe existe para Pintura (ponto de orvalho, espessura por SSPC-PA 2,
aderência), Galvanização (banhos, espessura por NBR 6323, efluentes, explosão por umidade),
CNC (versão de programa, primeira peça, NR-12), Manutenção (bloqueio de energias, NR-10,
NR-33) e as demais áreas.

## O que o sistema faz

- **Painel** com auditorias em andamento, concluídas e pendentes, total de não conformidades,
  taxa de conformidade, tempo médio, últimos relatórios e últimas ações.
- **Início em dois toques**: escolher o setor e confirmar. Empresa e normas vêm da última
  auditoria; escopo, objetivo e critério são gerados e continuam editáveis.
- **Auditoria guiada** bloco a bloco; só avança quando o bloco está completo.
- **Cada verificação** mostra as cláusulas das três normas que atende, com Conforme / Não
  conforme / Observação / N/A, evidência, observação e anexos (fotos, PDF, vídeos e documentos).
- **Não conformidades** com classificação, evidência, requisito descumprido, causa raiz e
  plano de ação **5W2H**.
- **Histórico** com filtros por empresa, setor, norma, data, auditor e status.
- **Indicadores**: conformidade, NC por setor, NC por auditor, tempo médio, auditorias por norma
  e evolução mensal.
- **Relatório** profissional com desempenho **por norma**, roteiro verificado, NCs com plano de
  ação, evidências, conclusão e assinaturas, pronto para PDF via impressão.
- **Assistente** que melhora a redação de NCs, gera observações técnicas e oportunidades de
  melhoria, explica requisitos da norma, resume evidências, monta o 5W2H, escreve a conclusão
  do relatório e sugere o que verificar em cada evidência anexada.

## Configuração opcional

Copie `.env.example` para `.env.local`. Sem nenhuma variável o sistema roda completo em modo
local — os dados ficam no navegador e o assistente usa o motor de regras embarcado.

### Supabase (banco, autenticação e armazenamento)

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Aplique `supabase/migracoes/0001_esquema.sql` no projeto (SQL Editor ou `supabase db push`).
Ele cria as tabelas `perfis` e `auditorias`, os índices, as políticas de RLS e o bucket
`evidencias`.

### OpenAI (assistente com IA)

```env
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
```

Sem a chave, o assistente continua funcionando com o motor local determinístico — que já
redige NCs estruturadas, monta planos 5W2H, explica os 51 requisitos e responde às dúvidas
mais frequentes de campo.

### Fotos dos blocos

Cada bloco e cada setor têm uma **ilustração vetorial própria**, que é o padrão visual e nunca
depende de rede. Para usar fotografias reais em vez delas:

```bash
UNSPLASH_ACCESS_KEY=... npm run imagens   # ou PEXELS_API_KEY=...
```

O script baixa uma foto por bloco e por setor para `public/etapas/`, grava os créditos e
atualiza o manifesto `src/dados/imagens.ts`. As imagens ficam em cache no repositório de build,
sem chamadas externas em tempo de execução. Se uma foto faltar ou falhar, a ilustração vetorial
entra no lugar automaticamente.

## Tecnologias

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Framer Motion ·
Supabase (Postgres, Auth e Storage, opcionais) · OpenAI (opcional).

## Estrutura

```
src/
  app/            rotas: login, painel, nova auditoria, auditoria guiada, relatório,
                  histórico, indicadores e a API do assistente
  components/     interface: navegação, gráficos, cartão de verificação, selo de norma,
                  abertura de bloco, modal de NC, anexos, conclusão e assistente
  dados/          etapas.ts (roteiro e requisitos ISO), normas.ts (normas e setores),
                  imagens.ts (manifesto do cache de fotos)
  lib/            armazenamento, tipos, ilustrações vetoriais, cliente do assistente
scripts/          baixar-imagens.mjs
supabase/         migração do esquema
```

## Scripts

```bash
npm run dev        # desenvolvimento
npm run build      # build de produção
npm start          # servidor de produção
npm run typecheck  # verificação de tipos
npm run imagens    # baixa e cacheia as fotos das etapas
```
