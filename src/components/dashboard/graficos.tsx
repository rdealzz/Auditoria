"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const eixo = {
  stroke: "var(--muted-foreground)",
  fontSize: 11,
  tickLine: false,
  axisLine: false,
};

const estiloTooltip = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--foreground)",
  boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
};

interface PontoHistorico {
  mes: string;
  indice: number;
  meta: number;
}

export function GraficoConformidade({ dados }: { dados: PontoHistorico[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={dados} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="gradConformidade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="mes" {...eixo} />
        <YAxis domain={[70, 100]} unit="%" {...eixo} />
        <ReferenceLine
          y={dados[0]?.meta ?? 90}
          stroke="var(--nc-menor)"
          strokeDasharray="4 4"
          label={{
            value: "Meta",
            position: "right",
            fill: "var(--nc-menor)",
            fontSize: 11,
          }}
        />
        <Tooltip
          contentStyle={estiloTooltip}
          formatter={(v) => [`${v}%`, "Índice de conformidade"]}
        />
        <Area
          type="monotone"
          dataKey="indice"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#gradConformidade)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface PontoProcesso {
  processo: string;
  maior: number;
  menor: number;
  observacao: number;
}

export function GraficoNCsPorProcesso({ dados }: { dados: PontoProcesso[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={dados} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <XAxis dataKey="processo" {...eixo} />
        <YAxis allowDecimals={false} {...eixo} />
        <Tooltip contentStyle={estiloTooltip} cursor={{ fill: "var(--surface-hover)" }} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          formatter={(v) => <span style={{ color: "var(--muted-foreground)" }}>{v}</span>}
        />
        <Bar dataKey="maior" name="NC maior" stackId="nc" fill="var(--chart-4)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="menor" name="NC menor" stackId="nc" fill="var(--chart-3)" />
        <Bar dataKey="observacao" name="Observação" stackId="nc" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface Fatia {
  nome: string;
  valor: number;
  cor: string;
}

export function GraficoDistribuicao({ dados }: { dados: Fatia[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={dados}
          dataKey="valor"
          nameKey="nome"
          innerRadius={58}
          outerRadius={86}
          paddingAngle={3}
          stroke="var(--surface)"
          strokeWidth={2}
        >
          {dados.map((fatia) => (
            <Cell key={fatia.nome} fill={fatia.cor} />
          ))}
        </Pie>
        <Tooltip contentStyle={estiloTooltip} />
        <Legend
          wrapperStyle={{ fontSize: 12 }}
          formatter={(v) => <span style={{ color: "var(--muted-foreground)" }}>{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
