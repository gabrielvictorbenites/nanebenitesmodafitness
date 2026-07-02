import heroImg from "@/assets/hero.jpg";
import collectionImg from "@/assets/collection.jpg";
import aboutImg from "@/assets/about.jpg";
import catLeggings from "@/assets/cat-leggings.jpg";
import catTops from "@/assets/cat-tops.jpg";
import catShorts from "@/assets/cat-shorts.jpg";
import catConjuntos from "@/assets/cat-conjuntos.jpg";
import catMacacoes from "@/assets/cat-macacoes.jpg";
import catCamisetas from "@/assets/cat-camisetas.jpg";
import catJaquetas from "@/assets/cat-jaquetas.jpg";
import catTenis from "@/assets/cat-tenis.jpg";
import catBolsas from "@/assets/cat-bolsas.jpg";
import catAcessorios from "@/assets/cat-acessorios.jpg";

export const site = {
  name: "Nane Benites",
  tagline: "Moda Fitness Premium",
  // Placeholder — replace with the real number in international format (55 + DDD + phone).
  whatsapp: "5500000000000",
  instagram: "https://instagram.com/nanebenites",
  facebook: "https://facebook.com/nanebenites",
  email: "contato@nanebenites.com.br",
  phone: "(00) 0000-0000",
  address: "Rua da Moda, 123 — Centro",
  city: "São Paulo — SP",
  hours: "Seg a Sáb: 09h às 19h",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.036684477477!2d-46.6565!3d-23.5613!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQwLjciUyA0NsKwMzknMjMuNCJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000",
  images: { hero: heroImg, collection: collectionImg, about: aboutImg },
} as const;

export type Category = {
  slug: string;
  name: string;
  image: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "leggings", name: "Leggings", image: catLeggings, description: "Cintura alta, compressão inteligente e tecidos que sustentam cada movimento." },
  { slug: "tops", name: "Tops", image: catTops, description: "Suporte real com estética minimalista. Do treino leve ao alta intensidade." },
  { slug: "shorts", name: "Shorts", image: catShorts, description: "Modelagens que valorizam. Tecidos leves, respirávies e de longa durabilidade." },
  { slug: "macacoes", name: "Macacões", image: catMacacoes, description: "A peça que resolve o look inteiro. Sofisticação em um único movimento." },
  { slug: "camisetas", name: "Camisetas", image: catCamisetas, description: "Corte moderno, caimento perfeito. O básico premium do seu guarda-roupa fitness." },
  { slug: "jaquetas", name: "Jaquetas", image: catJaquetas, description: "Camadas essenciais para dias frios e looks de alto padrão dentro e fora do treino." },
  { slug: "conjuntos", name: "Conjuntos", image: catConjuntos, description: "Peças coordenadas para uma composição impecável em qualquer ocasião." },
  { slug: "tenis", name: "Tênis", image: catTenis, description: "Design minimalista com performance real. Selecionados para treinar com estilo." },
  { slug: "bolsas", name: "Bolsas", image: catBolsas, description: "Do estúdio ao dia a dia. Praticidade e sofisticação em cada detalhe." },
  { slug: "acessorios", name: "Acessórios", image: catAcessorios, description: "Detalhes que completam o look. Meias, faixas, garrafas e essenciais." },
];

export const brands = [
  { slug: "lets-gym", name: "Let's Gym" },
  { slug: "lanca-perfume", name: "Lança Perfume" },
  { slug: "zero-acucar", name: "Zero Açúcar" },
  { slug: "mc", name: "M&C" },
  { slug: "alto-giro", name: "Alto Giro" },
  { slug: "live", name: "Live!" },
] as const;

export type Product = {
  slug: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  salePrice?: number;
  colors: string[];
  sizes: string[];
  description: string;
  image: string;
  gallery?: string[];
  isNew?: boolean;
  isSale?: boolean;
  isBestseller?: boolean;
  stock: number;
  sku: string;
};

export const products: Product[] = [
  {
    slug: "legging-signature-bordo",
    name: "Legging Signature Bordô",
    category: "leggings",
    brand: "Let's Gym",
    price: 289,
    salePrice: 249,
    colors: ["Bordô", "Preto", "Cru"],
    sizes: ["PP", "P", "M", "G", "GG"],
    description:
      "Cintura super alta com compressão modeladora, tecido supplex second-skin e costuras planas invisíveis. A peça-assinatura da coleção.",
    image: catLeggings,
    gallery: [catLeggings, catConjuntos],
    isBestseller: true,
    isSale: true,
    stock: 24,
    sku: "LGS-001",
  },
  {
    slug: "top-essential-nude",
    name: "Top Essential Nude",
    category: "tops",
    brand: "Live!",
    price: 179,
    colors: ["Nude", "Preto", "Branco"],
    sizes: ["P", "M", "G"],
    description:
      "Sustentação média, tecido premium com toque de segunda pele. Costas em Y para liberdade total de movimento.",
    image: catTops,
    gallery: [catTops],
    isNew: true,
    stock: 18,
    sku: "TES-002",
  },
  {
    slug: "short-power-preto",
    name: "Short Power Preto",
    category: "shorts",
    brand: "Alto Giro",
    price: 149,
    colors: ["Preto", "Bordô"],
    sizes: ["PP", "P", "M", "G"],
    description: "Modelagem ajustada, cintura alta e tecido com proteção UV. Ideal para treinos de alta performance.",
    image: catShorts,
    gallery: [catShorts],
    stock: 12,
    sku: "SPP-003",
  },
  {
    slug: "conjunto-elegance-bordo",
    name: "Conjunto Elegance Bordô",
    category: "conjuntos",
    brand: "Lança Perfume",
    price: 459,
    salePrice: 399,
    colors: ["Bordô", "Preto"],
    sizes: ["P", "M", "G"],
    description:
      "Top e legging coordenados em tecido premium. A elegância de um conjunto que veste do estúdio ao café.",
    image: catConjuntos,
    gallery: [catConjuntos, catLeggings],
    isNew: true,
    isBestseller: true,
    stock: 9,
    sku: "CEB-004",
  },
  {
    slug: "macacao-noir",
    name: "Macacão Noir Manga Longa",
    category: "macacoes",
    brand: "M&C",
    price: 389,
    colors: ["Preto"],
    sizes: ["P", "M", "G"],
    description: "Peça statement em modelagem second-skin. Gola alta e caimento impecável.",
    image: catMacacoes,
    gallery: [catMacacoes],
    isNew: true,
    stock: 6,
    sku: "MCN-005",
  },
  {
    slug: "camiseta-premium-branca",
    name: "Camiseta Premium Branca",
    category: "camisetas",
    brand: "Zero Açúcar",
    price: 129,
    colors: ["Branco", "Preto", "Cru"],
    sizes: ["P", "M", "G", "GG"],
    description: "Algodão pima de alta gramatura. Corte moderno, um pouco oversized, para looks descolados.",
    image: catCamisetas,
    gallery: [catCamisetas],
    stock: 30,
    sku: "CPB-006",
  },
  {
    slug: "jaqueta-cropped-cru",
    name: "Jaqueta Cropped Cru",
    category: "jaquetas",
    brand: "Let's Gym",
    price: 329,
    salePrice: 279,
    colors: ["Cru", "Preto"],
    sizes: ["P", "M", "G"],
    description: "Modelagem cropped com zíper metálico e tecido tecnológico. Camada essencial para o inverno.",
    image: catJaquetas,
    gallery: [catJaquetas],
    isSale: true,
    stock: 14,
    sku: "JCC-007",
  },
  {
    slug: "tenis-training-branco",
    name: "Tênis Training Branco",
    category: "tenis",
    brand: "Alto Giro",
    price: 549,
    colors: ["Branco"],
    sizes: ["34", "35", "36", "37", "38", "39"],
    description: "Solado com amortecimento avançado. Design minimalista para treinos e styling diário.",
    image: catTenis,
    gallery: [catTenis],
    isBestseller: true,
    stock: 22,
    sku: "TTB-008",
  },
  {
    slug: "bolsa-gym-nude",
    name: "Bolsa Gym Nude",
    category: "bolsas",
    brand: "Live!",
    price: 259,
    colors: ["Nude", "Preto"],
    sizes: ["Único"],
    description: "Design elegante em material premium. Bolsos organizadores para chuteira, garrafa e essenciais.",
    image: catBolsas,
    gallery: [catBolsas],
    isNew: true,
    stock: 11,
    sku: "BGN-009",
  },
  {
    slug: "kit-acessorios-bordo",
    name: "Kit Acessórios Bordô",
    category: "acessorios",
    brand: "M&C",
    price: 99,
    salePrice: 79,
    colors: ["Bordô"],
    sizes: ["Único"],
    description: "Garrafa térmica 500ml, faixa de cabelo, scrunchies e strap. Combinação exclusiva.",
    image: catAcessorios,
    gallery: [catAcessorios],
    isSale: true,
    stock: 40,
    sku: "KAB-010",
  },
  {
    slug: "legging-power-preta",
    name: "Legging Power Preta",
    category: "leggings",
    brand: "Alto Giro",
    price: 259,
    colors: ["Preto"],
    sizes: ["PP", "P", "M", "G", "GG"],
    description: "Compressão firme, cintura extra alta. A escolha certa para treinos exigentes.",
    image: catLeggings,
    gallery: [catLeggings],
    isBestseller: true,
    stock: 16,
    sku: "LPP-011",
  },
  {
    slug: "top-strappy-preto",
    name: "Top Strappy Preto",
    category: "tops",
    brand: "Lança Perfume",
    price: 199,
    salePrice: 169,
    colors: ["Preto", "Nude"],
    sizes: ["P", "M", "G"],
    description: "Detalhes de tiras nas costas, bojo removível. Sofisticação e suporte.",
    image: catTops,
    gallery: [catTops],
    isSale: true,
    stock: 20,
    sku: "TSP-012",
  },
];

export function findCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
export function findProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
export function productsByCategory(slug: string) {
  return products.filter((p) => p.category === slug);
}

export const testimonials = [
  {
    name: "Camila R.",
    role: "Cliente há 3 anos",
    text: "As peças da Nane são simplesmente incomparáveis. Qualidade de outro nível e atendimento que faz toda diferença.",
  },
  {
    name: "Beatriz M.",
    role: "Personal trainer",
    text: "Uso todos os dias no meu trabalho. Tecidos que aguentam, modelagens impecáveis e um estilo que meus alunos amam.",
  },
  {
    name: "Larissa S.",
    role: "Cliente",
    text: "Descobri a marca no Instagram e virei fã. Não compro em outro lugar. Cada peça é uma experiência premium.",
  },
];

export const reasons = [
  { title: "Qualidade Premium", text: "Tecidos tecnológicos selecionados peça a peça, com durabilidade e caimento superiores." },
  { title: "Marcas Selecionadas", text: "Curadoria exclusiva das melhores marcas nacionais e importadas do universo fitness." },
  { title: "Conforto Real", text: "Modelagens estudadas para acompanhar cada movimento do treino sem abrir mão da elegância." },
  { title: "Alta Durabilidade", text: "Peças pensadas para durar. Investimento inteligente no seu guarda-roupa fitness." },
  { title: "Atendimento Personalizado", text: "Consultoria de estilo via WhatsApp para você encontrar a peça perfeita." },
  { title: "Experiência Premium", text: "Do primeiro contato à entrega, cada detalhe é pensado para você." },
];

export const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });