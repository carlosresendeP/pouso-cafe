// Pouso · cafés de origem — demo brand content (fictional roastery, farms, people and reviews).
// Replace contacts in `contact` before publishing.

export const ASSET = "/sites/pouso";
export const img = (name: string) => `${ASSET}/img/${name}`;

/** Hero film, scrubbed by the scroll. `hero-scrub.mp4` is /public/hero-video.mp4 re-encoded with a
 * keyframe every 2 frames (ffmpeg -g 2) so seeking stays smooth; the poster is its first frame. */
export const heroVideo = {
  mp4: `${ASSET}/video/hero-scrub.mp4`,
  poster: `${ASSET}/video/hero-poster.jpg`,
};

export type Grind = {
  slug: string;
  name: string; // shown on the tag / cart
  hint: string;
};

export const grinds: Grind[] = [
  { slug: "graos", name: "Em grãos", hint: "Para moer na hora" },
  { slug: "coado", name: "Moído · coado", hint: "Filtro de papel, Hario, Kalita" },
  { slug: "espresso", name: "Moído · espresso", hint: "Máquina ou moka" },
];

export type Origin = { slug: string; name: string; description: string };

export const origins: Origin[] = [
  { slug: "brasil", name: "Brasil", description: "Microlotes de sítios parceiros em Minas Gerais e na Bahia." },
  { slug: "mundo", name: "Mundo", description: "Lotes raros de outras origens, quando a safra vale a viagem." },
];

export type Lot = {
  slug: string;
  name: string;
  origin: string; // Origin slug
  region: string;
  farm: string;
  producer: string;
  altitude: string;
  variety: string;
  process: string;
  roast: "Clara" | "Média" | "Média-escura";
  roastHex: string;
  notes: string[];
  score: number; // SCA cupping score
  priceCents: number; // 250 g
  weight: string;
  image: string;
  imageAlt: string;
  description: string;
  brew: string;
  lat: number;
  lng: number;
  featured: boolean;
};

export const lots: Lot[] = [
  {
    slug: "mantiqueira",
    name: "Mantiqueira de Minas",
    origin: "brasil",
    region: "Carmo de Minas · MG",
    farm: "Sítio Boa Vista",
    producer: "José Aparecido",
    altitude: "1.250 m",
    variety: "Bourbon Amarelo",
    process: "Natural",
    roast: "Média",
    roastHex: "#7A4A2A",
    notes: ["mel", "caramelo", "laranja"],
    score: 86.5,
    priceCents: 6490,
    weight: "250 g",
    image: img("lot-mantiqueira.jpg"),
    imageAlt: "Pacote kraft do café Mantiqueira de Minas sobre linho, com grãos torrados e folhas de café",
    description:
      "Colhido grão a grão nas encostas frias da Mantiqueira e seco ao sol em terreiro suspenso. Na xícara é redondo e doce, com acidez de laranja e final longo de caramelo — o café para todos os dias que não parece de todo dia.",
    brew: "Coado: 15 g para 250 ml a 92 °C, extração de 3 min.",
    lat: -22.12,
    lng: -45.13,
    featured: true,
  },
  {
    slug: "cerrado",
    name: "Cerrado Mineiro",
    origin: "brasil",
    region: "Patrocínio · MG",
    farm: "Fazenda Pedra Grande",
    producer: "Família Toledo",
    altitude: "1.100 m",
    variety: "Mundo Novo",
    process: "Cereja descascado",
    roast: "Média-escura",
    roastHex: "#4E2E1B",
    notes: ["chocolate ao leite", "castanhas", "laranja"],
    score: 84.75,
    priceCents: 5490,
    weight: "250 g",
    image: img("lot-cerrado.jpg"),
    imageAlt: "Pacote terracota do café Cerrado Mineiro sobre linho, com grãos e uma rodela de laranja seca",
    description:
      "Do planalto do Cerrado, onde a colheita acontece na seca e o grão amadurece por igual. Corpo cremoso, chocolate ao leite e castanhas, com um toque cítrico no final. Brilha no espresso e com leite.",
    brew: "Espresso: 18 g para 36 g em 28 s.",
    lat: -18.94,
    lng: -46.99,
    featured: true,
  },
  {
    slug: "chapada",
    name: "Chapada Diamantina",
    origin: "brasil",
    region: "Piatã · BA",
    farm: "Sítio Serra do Atalho",
    producer: "Dona Lurdes",
    altitude: "1.300 m",
    variety: "Catuaí Vermelho",
    process: "Fermentado",
    roast: "Média",
    roastHex: "#6B3D22",
    notes: ["cacau", "frutas vermelhas", "rapadura"],
    score: 87.25,
    priceCents: 7290,
    weight: "250 g",
    image: img("lot-chapada.jpg"),
    imageAlt: "Pacote verde do café Chapada Diamantina sobre linho, com grãos torrados e um pedaço de cacau",
    description:
      "Das serras altas de Piatã, uma das regiões mais premiadas do país. Fermentação controlada de 72 horas que traz cacau, frutas vermelhas e doçura de rapadura. Um café de conversa longa.",
    brew: "Prensa francesa: 18 g para 300 ml, 4 min.",
    lat: -13.15,
    lng: -41.77,
    featured: true,
  },
  {
    slug: "etiopia",
    name: "Etiópia Yirgacheffe",
    origin: "mundo",
    region: "Kochere · Gedeo",
    farm: "Cooperativa Kochere",
    producer: "Pequenos produtores",
    altitude: "2.000 m",
    variety: "Heirloom",
    process: "Lavado",
    roast: "Clara",
    roastHex: "#9A6A43",
    notes: ["jasmim", "bergamota", "chá preto"],
    score: 88,
    priceCents: 8990,
    weight: "250 g",
    image: img("lot-etiopia.jpg"),
    imageAlt: "Pacote claro do café Etiópia Yirgacheffe sobre linho, com grãos de torra clara e flores de jasmim",
    description:
      "Do berço do café. Variedades nativas cultivadas a dois mil metros e lavadas em água corrente. Floral, leve e cítrico — jasmim e bergamota que lembram um chá. Torra clara para não esconder nada.",
    brew: "V60: 15 g para 250 ml a 94 °C, despejos lentos.",
    lat: 6.16,
    lng: 38.2,
    featured: true,
  },
];

export const getLot = (slug: string) => lots.find((l) => l.slug === slug);
export const getOrigin = (slug: string) => origins.find((o) => o.slug === slug)!;
export const getGrind = (slug: string | null | undefined) => grinds.find((g) => g.slug === slug) ?? grinds[0];

export const formatBRL = (cents: number) =>
  "R$ " + (cents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export type Testimonial = {
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  text: string;
  lot: string;
  image?: string;
};

export const testimonials: Testimonial[] = [
  { name: "Marina", city: "Belo Horizonte", country: "Brasil", lat: -19.92, lng: -43.94, text: "Abri o pacote e a cozinha inteira ficou com cheiro de mel. O Mantiqueira virou o café da casa.", lot: "Mantiqueira de Minas", image: img("client-1.jpg") },
  { name: "Rafael", city: "São Paulo", country: "Brasil", lat: -23.55, lng: -46.64, text: "Nunca tinha sentido jasmim num café. O Etiópia na V60 é outra bebida.", lot: "Etiópia Yirgacheffe" },
  { name: "Clara", city: "Lisboa", country: "Portugal", lat: 38.72, lng: -9.14, text: "Chegou bem embalado, torra de quatro dias. Matou a saudade do café mineiro.", lot: "Cerrado Mineiro" },
  { name: "Tiago", city: "Curitiba", country: "Brasil", lat: -25.43, lng: -49.27, text: "O Chapada no espresso tem um final de cacau que dura. Já é minha terceira assinatura.", lot: "Chapada Diamantina" },
  { name: "Ana Luiza", city: "Salvador", country: "Brasil", lat: -12.97, lng: -38.5, text: "Café da minha terra torrado com esse cuidado. Dá orgulho servir para as visitas.", lot: "Chapada Diamantina" },
  { name: "Pedro", city: "Porto Alegre", country: "Brasil", lat: -30.03, lng: -51.23, text: "Moagem certinha para a moka, chegou rápido e com bilhete escrito à mão. Detalhe que conquista.", lot: "Cerrado Mineiro" },
  { name: "Júlia", city: "Recife", country: "Brasil", lat: -8.05, lng: -34.9, text: "Doce de verdade, sem açúcar nenhum. Meu pai, que só tomava café forte, se rendeu.", lot: "Mantiqueira de Minas" },
  { name: "Henrique", city: "Nova York", country: "EUA", lat: 40.71, lng: -74.0, text: "Levei na mala e virou presente disputado no escritório. Preciso de mais pacotes.", lot: "Etiópia Yirgacheffe" },
];

export const contact = {
  city: "Belo Horizonte · MG",
  origin: "Torrado toda semana",
  email: "ola@pouso.cafe",
  whatsapp: "5531900000000", // placeholder — replace with the real number
  instagram: "pousocafes",
  youtube: "pousocafes",
  tiktok: "pousocafes",
  signature: "Café bom é café sem pressa.",
};

export const home = {
  tagline: "cafés de origem, torrados devagar",
  manifesto: {
    eyebrow: "Nossa torra",
    title: "Do pé à xícara, sem pressa",
    text: "Compramos direto de quem planta, pagamos acima do mercado e torramos em lotes pequenos, toda semana. Cada pacote traz o nome do sítio, a altitude e a data da torra — porque um café de origem só faz sentido se a origem chegar até você.",
    facts: [
      { title: "Torra semanal", detail: "Belo Horizonte · MG" },
      { title: "Comércio direto", detail: "Do sítio para a torrefação" },
      { title: "Envio em 2 dias", detail: "Para todo o Brasil" },
    ],
  },
  collection: { eyebrow: "Safra atual", title: "Na prateleira", cta: "Ver cafés" },
  producer: {
    eyebrow: "Quem planta",
    titleLines: ["Prazer,", "seu Zé."],
    caption: "Retrato em curvas de nível",
    cta: "Conhecer a torrefação",
    photoAlt: "José Aparecido, produtor do Sítio Boa Vista, sorrindo com cerejas de café maduras nas mãos",
    paragraphs: [
      "José Aparecido planta café há quarenta safras nas encostas de Carmo de Minas. Aprendeu com o pai a colher só a cereja madura e a esperar o tempo do terreiro.",
      "Desde 2021 todo o Bourbon Amarelo do Sítio Boa Vista vem direto para a nossa torrefação. Pagamos pelo que está na xícara, não pelo que diz a bolsa de valores.",
      "É por pessoas como ele que a Pouso existe: para que o nome de quem planta chegue junto com o café.",
    ],
  },
  testimonials: {
    eyebrow: "Quem já passou por aqui",
    titleLines: ["Um café,", "muitas mesas."],
    hint: "Cada ponto é uma xícara. Passe o mouse, ou escolha uma cidade.",
    hintTouch: "Cada ponto é uma xícara. Escolha uma cidade para ler.",
    legend: "Fazendas de origem",
  },
};

export const roastery = {
  cover: {
    eyebrow: "Torrefação · Belo Horizonte, MG",
    titleLines: ["Da fazenda", "à xícara."],
    text: "A Pouso começou em 2019 com um torrador de cinco quilos e três sítios parceiros. Hoje são doze produtores e uma torra por semana — ainda pequena, ainda feita lote a lote, ainda provada antes de sair.",
  },
  about: {
    eyebrow: "A torrefação",
    titleLines: ["Torra lenta,", "lote a lote."],
    paragraphs: [
      "Cada café tem a sua curva. Antes de vender um lote, torramos amostras em perfis diferentes e provamos às cegas até encontrar o ponto em que a origem aparece inteira.",
      "Não guardamos estoque: torramos às segundas e enviamos até quarta. O café que chega na sua casa tem dias, não meses.",
    ],
  },
  process: {
    eyebrow: "Processo",
    titleLines: ["Quatro passos,", "um grão só."],
    steps: [
      { title: "Colheita", text: "Só a cereja madura, colhida à mão ou em derriça seletiva. É ali que começa a doçura que você sente na xícara." },
      { title: "Secagem", text: "Em terreiro suspenso ou estufa, revirada várias vezes ao dia até o grão chegar à umidade ideal — sem pressa e sem fogo." },
      { title: "Torra", text: "Em lotes de até cinco quilos, com perfil desenhado para cada origem. Torras claras para os florais, médias para os doces." },
      { title: "Prova", text: "Todo lote passa pela prova de xícara (cupping) antes de ser embalado. Se não estiver bom, não sai." },
    ],
  },
  quote: {
    text: "Torrar é ouvir o grão. Ele avisa quando está pronto — o nosso trabalho é não ter pressa de responder.",
    author: "Helena Prado · mestre de torra da Pouso",
  },
  closing: {
    eyebrow: "Safra 2026 · Disponível",
    titleLines: ["Safra nova.", "O mesmo cuidado."],
    text: "Torra toda segunda-feira, envio até quarta, com acompanhamento pelo WhatsApp.",
    cta: "Ver os cafés",
  },
};

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${contact.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
