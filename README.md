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

## As 10 etapas

| # | Etapa | O que ensina |
|---|---|---|
| 1 | Preparação | Escopo, critério, plano, imparcialidade e reunião de abertura |
| 2 | Documentação | Procedimentos, revisão vigente, ponto de uso e obsoletos |
| 3 | Infraestrutura | Organização, identificação, layout, ambiente e segurança |
| 4 | Equipamentos | Calibração, rastreabilidade metrológica e manutenção |
| 5 | Competência | Matriz, treinamento, eficácia, entrevista e conscientização |
| 6 | Execução do Processo | Seguir o lote, parâmetros, rastreabilidade e liberação |
| 7 | Registros | Preenchimento, assinatura, correções e retenção |
| 8 | Riscos e Oportunidades | Aderência da matriz à realidade e eficácia dos controles |
| 9 | Não Conformidades | Tratamento pela empresa e redação correta da constatação |
| 10 | Conclusão | Indicadores, consenso, assinaturas e relatório |

São **51 requisitos** mapeados na ISO 9001:2015, cada um com o texto resumido da cláusula,
uma explicação em linguagem simples, como verificar na prática e a evidência típica.

## O que o sistema faz

- **Painel** com auditorias em andamento, concluídas e pendentes, total de não conformidades,
  taxa de conformidade, tempo médio, últimos relatórios e últimas ações.
- **Auditoria guiada** com barra de progresso por etapa; só avança quando a etapa está completa.
- **Checklist inteligente**: Conforme / Não conforme / Observação / Não aplicável, comentário,
  evidência objetiva e anexos (fotos, PDF, vídeos e documentos).
- **Não conformidades** com classificação, evidência, requisito descumprido, causa raiz e
  plano de ação **5W2H**.
- **Histórico** com filtros por empresa, setor, norma, data, auditor e status.
- **Indicadores**: conformidade, NC por setor, NC por auditor, tempo médio, auditorias por norma
  e evolução mensal.
- **Relatório** profissional em 9 seções (capa, sumário, dados, resultados, checklist completo,
  NCs, planos de ação, evidências, conclusão e assinaturas), pronto para PDF via impressão.
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

### Fotos das etapas

Cada etapa e cada setor têm uma **ilustração vetorial própria**, que é o padrão visual e nunca
depende de rede. Para usar fotografias reais em vez delas:

```bash
UNSPLASH_ACCESS_KEY=... npm run imagens   # ou PEXELS_API_KEY=...
```

O script baixa uma foto por etapa e por setor para `public/etapas/`, grava os créditos e
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
  components/     interface: navegação, cartões, gráficos, checklist, modal de NC,
                  anexos, explicação da etapa, conclusão e assistente
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
