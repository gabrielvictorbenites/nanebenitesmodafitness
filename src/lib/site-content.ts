import { supabase } from "@/integrations/supabase/client";

export const SITE_TEXTS_KEY = "site_texts";

export type TextSlot = {
  key: string;
  label: string;
  description?: string;
  page: string;
  multiline?: boolean;
  fallback: string;
};

export type TextGroup = { title: string; page: string; slots: TextSlot[] };

export const TEXT_GROUPS: TextGroup[] = [
  {
    title: "Home - Banner principal",
    page: "/",
    slots: [
      { key: "home_hero_eyebrow", label: "Etiqueta (eyebrow)", page: "/", fallback: "Coleção 2026" },
      { key: "home_hero_title_line1", label: "Título (linha 1)", page: "/", fallback: "Vista sua" },
      { key: "home_hero_title_line2", label: "Título (linha 2, em itálico)", page: "/", fallback: "melhor versão." },
      {
        key: "home_hero_description",
        label: "Descrição",
        page: "/",
        multiline: true,
        fallback:
          "Moda fitness premium para mulheres que treinam com estilo. Curadoria exclusiva das melhores marcas em peças que unem performance, conforto e sofisticação.",
      },
      { key: "home_hero_cta_label", label: "Texto do botão principal", page: "/", fallback: "Ver Catálogo" },
    ],
  },
  {
    title: "Sobre - Cabeçalho",
    page: "/sobre",
    slots: [
      { key: "sobre_hero_eyebrow", label: "Etiqueta (eyebrow)", page: "/sobre", fallback: "Sobre a Empresa" },
      {
        key: "sobre_hero_title",
        label: "Título",
        page: "/sobre",
        fallback: "Nane Benites Moda Fitness: onde estilo e conforto se encontram.",
      },
      {
        key: "sobre_hero_description",
        label: "Descrição",
        page: "/sobre",
        multiline: true,
        fallback:
          "Fundada em 2020, em Campo Largo, a Nane Benites nasceu com o propósito de oferecer moda casual e fitness feminina - reunindo as melhores marcas em um só espaço, com um olhar atento à qualidade, ao conforto e ao estilo.",
      },
    ],
  },
  {
    title: "Sobre - Nossa história",
    page: "/sobre",
    slots: [
      {
        key: "sobre_history_title",
        label: "Título do bloco",
        page: "/sobre",
        fallback: "A união de duas trajetórias que se transformou em marca.",
      },
      {
        key: "sobre_history_p1",
        label: "Parágrafo 1",
        page: "/sobre",
        multiline: true,
        fallback:
          "A Nane Benites Moda Fitness nasceu em 2020 da união da experiência de Eliane Benites, com mais de 20 anos no setor de vendas e no comando de uma loja de artigos esportivos em Cascavel - PR, e de José Henrique Espaki, administrador com mais de 30 anos de atuação nas áreas financeira e administrativa.",
      },
      {
        key: "sobre_history_p2",
        label: "Parágrafo 2",
        page: "/sobre",
        multiline: true,
        fallback:
          "Fundada em Campo Largo, a marca surgiu com o propósito de oferecer moda casual e fitness feminina, reunindo as melhores marcas em um só espaço. Com um olhar atento à qualidade, ao conforto e ao estilo, a empresa busca se consolidar como referência no segmento.",
      },
      {
        key: "sobre_history_p3",
        label: "Parágrafo 3",
        page: "/sobre",
        multiline: true,
        fallback:
          "Hoje, com lojas em Curitiba e Campo Largo, seguimos com o mesmo compromisso do primeiro dia: entregar peças que fazem a mulher se sentir a sua melhor versão - dentro e fora do treino.",
      },
    ],
  },
  {
    title: "Sobre - Pilares (3 colunas)",
    page: "/sobre",
    slots: [
      { key: "sobre_pillar1_title", label: "Pilar 1 - Título", page: "/sobre", fallback: "A união de experiências" },
      {
        key: "sobre_pillar1_text",
        label: "Pilar 1 - Texto",
        page: "/sobre",
        multiline: true,
        fallback:
          "Eliane trouxe sua expertise em vendas e no mercado esportivo, enquanto José contribuiu com seu conhecimento na gestão administrativa e financeira.",
      },
      { key: "sobre_pillar2_title", label: "Pilar 2 - Título", page: "/sobre", fallback: "Fundação e propósito" },
      {
        key: "sobre_pillar2_text",
        label: "Pilar 2 - Texto",
        page: "/sobre",
        multiline: true,
        fallback:
          "Criada em 2020 em Campo Largo, a Nane Benites nasceu com foco na moda casual e fitness feminina, sempre prezando pela qualidade e pela variedade.",
      },
      { key: "sobre_pillar3_title", label: "Pilar 3 - Título", page: "/sobre", fallback: "Compromisso com as clientes" },
      {
        key: "sobre_pillar3_text",
        label: "Pilar 3 - Texto",
        page: "/sobre",
        multiline: true,
        fallback:
          "Trabalhamos com marcas renomadas, selecionadas para proporcionar conforto, autoestima, praticidade e estilo, buscando ser referência no setor de moda fitness.",
      },
    ],
  },
];

export type SiteTextsMap = Record<string, string>;

export function buildDefaults(): SiteTextsMap {
  const out: SiteTextsMap = {};
  for (const g of TEXT_GROUPS) for (const s of g.slots) out[s.key] = s.fallback;
  return out;
}

export async function fetchSiteTexts(): Promise<SiteTextsMap> {
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", SITE_TEXTS_KEY)
    .maybeSingle();
  if (error) throw error;
  const overrides = ((data?.content ?? {}) as SiteTextsMap) || {};
  return { ...buildDefaults(), ...overrides };
}

export async function saveSiteTexts(map: SiteTextsMap) {
  // Only persist non-default values to keep the row compact.
  const defaults = buildDefaults();
  const overrides: SiteTextsMap = {};
  for (const [k, v] of Object.entries(map)) {
    if (v !== defaults[k]) overrides[k] = v;
  }
  const { data: existing } = await supabase
    .from("site_content")
    .select("id")
    .eq("key", SITE_TEXTS_KEY)
    .maybeSingle();
  const contentJson = JSON.parse(JSON.stringify(overrides));
  if (existing?.id) {
    const { error } = await supabase
      .from("site_content")
      .update({ content: contentJson })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("site_content")
      .insert({ key: SITE_TEXTS_KEY, content: contentJson });
    if (error) throw error;
  }
}