/* ============================================================
   assistente.ts — Cliente do Assistente.
   Chama /api/ia; se a rota indicar que não há chave configurada,
   a própria API devolve a resposta do motor local determinístico.
   ============================================================ */

export type TipoPedido =
  | 'melhorar_nc'          // reescrever descrição de não conformidade
  | 'observacao_tecnica'   // gerar observação técnica do item
  | 'oportunidade'         // sugerir oportunidade de melhoria
  | 'explicar_requisito'   // explicar cláusula em linguagem simples
  | 'duvida'               // pergunta livre do auditor
  | 'resumir_evidencias'   // resumo das evidências coletadas
  | 'plano_acao'           // gerar 5W2H
  | 'relatorio'            // conclusão do relatório
  | 'analisar_foto';       // sugestões a partir de um anexo

export type PedidoIA = {
  tipo: TipoPedido;
  texto?: string;
  contexto?: Record<string, unknown>;
};

export type RespostaIA = { texto: string; itens?: string[]; motor: 'openai' | 'local' };

export async function perguntarIA(pedido: PedidoIA): Promise<RespostaIA> {
  try {
    const r = await fetch('/api/ia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return (await r.json()) as RespostaIA;
  } catch {
    return {
      texto: 'Não foi possível consultar o assistente agora. Tente novamente em instantes.',
      motor: 'local'
    };
  }
}
