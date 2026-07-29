import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Input = {
  name: string;
  category?: string;
  brand?: string;
  sizes?: string[];
  colors?: string[];
  extra?: string;
};

export const generateProductDescription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: Input) => data)
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) throw new Error("Forbidden");
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const prompt = `Gere uma descrição de produto para uma loja de moda fitness feminina premium chamada Nane Benites.
Produto: ${data.name}
${data.category ? `Categoria: ${data.category}` : ""}
${data.brand ? `Marca: ${data.brand}` : ""}
${data.sizes?.length ? `Tamanhos: ${data.sizes.join(", ")}` : ""}
${data.colors?.length ? `Cores: ${data.colors.join(", ")}` : ""}
${data.extra ? `Notas: ${data.extra}` : ""}

Escreva em português do Brasil, tom sofisticado e desejável, entre 60 e 110 palavras.
Foque em conforto, caimento, tecido tecnológico, versatilidade e estilo.
Não use emojis. Não use listas. Apenas 1 ou 2 parágrafos curtos. Não repita o nome do produto mais de uma vez.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você é um copywriter de moda fitness premium." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Muitas requisições, tente novamente em instantes.");
      if (res.status === 402) throw new Error("Créditos de IA esgotados. Adicione créditos no workspace.");
      throw new Error(`Erro IA (${res.status}): ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = json.choices?.[0]?.message?.content?.trim() ?? "";
    return { description: content };
  });