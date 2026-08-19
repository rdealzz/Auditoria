# Auditoria

Plataforma de gestão do ciclo completo de **auditoria interna da qualidade** conforme
**ISO 9001:2015** — do programa anual à verificação de eficácia das ações corretivas.

> Projeto de portfólio. Os dados exibidos são fictícios.

## O ciclo coberto

```
Programa anual → Checklist por requisito → Execução em campo → Constatações
    → Análise de causa → Plano de ação (5W2H) → Verificação de eficácia → Indicadores
```

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router) + React 19 |
| Linguagem | TypeScript (strict) |
| Estilo | Tailwind CSS v4 com design tokens em OKLCH |
| Componentes | Biblioteca própria sobre os tokens |
| Gráficos | Recharts |
| Formulários | react-hook-form + zod |
| Backend | Supabase (Postgres, Auth, Storage, RLS) — em implantação |

## Decisões de arquitetura

- **`src/lib/queries.ts` é a única fronteira de dados.** Os componentes nunca importam
  `mock-data` diretamente, então a troca para o Supabase não toca na camada de UI.
- **Terminologia do domínio em português**, alinhada à ISO 9001 (constatação,
  evidência objetiva, NC maior/menor, ação corretiva). O código fala a língua do negócio.
- **Design tokens semânticos** (`--nc-maior`, `--conforme`, …) em vez de cores literais:
  a classificação da norma é a fonte da paleta, e o tema escuro sai de graça.

## Rodando localmente

```bash
npm install
npm run dev
```

Aplicação em <http://localhost:3000>.

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |

## Roadmap

O plano de evolução até nível corporativo está em
[`docs/roadmap-nivel-corporativo.md`](docs/roadmap-nivel-corporativo.md).
