# Ladôme Ateliê — como o site original é feito (e como o clone o reproduz)

Fonte: https://ladomeatelie.com.br/ · inspecionado em 21/11/2026 (desktop 1440×900 e mobile 390×844).

## 1. A stack do original

| Camada | O que o site usa | Evidência |
| --- | --- | --- |
| Build | **Vite** (bundles `assets/*-hash.js`, runtime `rolldown`) | nomes dos chunks, `<script type="module">` |
| UI | **React** + **TanStack Router** (SPA renderizada no cliente) | comentário no `<head>` sobre o TanStack, `data-status="active"` nos links |
| Estado | **Zustand** (store `zones/targets/splashReady/introDone…`) | `useSyncExternalStore` no chunk `yarn-*.js` |
| CSS | **Tailwind CSS v4.3** com tokens próprios (`text-display`, `label`, `container-ladome`, `ease-thread`, cores `linen/wine/purple/graphite/olive/green`) | cabeçalho `tailwindcss v4.3.3` no CSS |
| 3D / efeitos | **three.js** com shaders GLSL próprios | chunks `three-*.js`, `ThreadScene-*.js`, `yarn-*.js` |
| Worker | `thread-portrait.worker.js` transforma a foto da criadora em um único fio | worker baixado e lido |
| Dados | **Supabase** (REST + Storage): `catalog_bags`, `bags`, `collections`, `testimonials`, `pages`, RPC `material_faces` | requisições de rede |
| Fonte | **Parkinsans** variável (300–800), servida localmente, `font-display: block` | `@font-face` inline |
| Checkout | Sem pagamento: o carrinho monta uma mensagem e abre **wa.me** | função que gera `https://wa.me/…?text=` |

## 2. As peças de assinatura

1. **Splash (CSS puro, no `<head>`)** — o coração de crochê (`heart.svg`, 24 fios) é "crochetado" por uma máscara diagonal em 3 ciclos; depois o painel se abre *de dentro do coração* com `mask-composite: exclude` crescendo até 5200px. Um script inline decide antes do React: visitante que voltou em até 30 dias (`localStorage['ladome:seen']`) pula o splash.
2. **Capa de tricô** — a foto `knit-wine.jpg` passa por um shader (relevo iluminado por luz girando, respiração, parallax/estica com o scroll, "amassado" sob o ponteiro). O logo é escrito da esquerda para a direita; depois entram o slogan, o "Deslize" (corrente de crochê animada) e o header.
3. **O fio que acompanha a leitura** — um `TubeGeometry` com shader de fio torcido (plies, felpa, sombra) segue âncoras do DOM; é "puxado" conforme o scroll e um novelo rola na ponta.
4. **Varal de etiquetas** — cada bolsa é uma etiqueta de papel presa por um prendedor (CSS puro: `.tag`, `.tag-paper`, `.clothespin`) num fio que serpenteia entre as linhas e termina numa agulha de crochê.
5. **"Retrato a fio"** — o worker normaliza a luminância da foto (percentis de 1%), reforça o contraste local contra um box‑blur de 13px e transforma cada linha numa senoide cuja amplitude e frequência crescem com o brilho (`s = lum^1.6`). As linhas alternam de direção: **o retrato inteiro é um fio só** (123 carreiras, ~38 m). Passar o mouse revela a foto.
6. **Globo de recomendações** — globo pontilhado em projeção ortográfica que gira até a cidade de cada cliente; cartão‑postal pendurado, chips de cidades, troca automática e um fio tracejado do cartão até o pino.
7. **Ateliê** — um sousplat de renda gerado proceduralmente em three.js "se faz" na capa verde.

## 3. Como o clone reproduz (Next.js 16 + Tailwind 4)

| Original | Clone | Arquivo |
| --- | --- | --- |
| Splash CSS + script inline | Mesmo CSS (portado) + script inline no layout | `src/app/globals.css`, `src/app/layout.tsx` |
| Shader da capa | Foto + parallax/respiração no scroll + luz que segue o ponteiro + vinheta | `Hero.tsx` |
| Fio three.js | SVG: núcleo + "plies" com tracejado arredondado (dá o aspecto torcido) + sombra; revelado por máscara, novelo/agulha na ponta | `Yarn.tsx`, `HomeThread.tsx`, `AtelierThread.tsx` |
| Varal | Mesmo CSS das etiquetas; caminho do fio calculado a partir dos prendedores | `Clothesline.tsx` |
| Worker do retrato | **Mesmo algoritmo** portado para canvas 2D (traço com espessura por segmento) | `ThreadPortrait.tsx` |
| Globo | Canvas 2D com projeção ortográfica; pontos de terra pré-calculados de *world-atlas* | `Testimonials.tsx`, `src/lib/ladome/land-dots.json` |
| Sousplat 3D | SVG procedural (anéis, arcos de corrente, malhas, picôs) desenhado anel a anel | `Doily.tsx` |
| Supabase | Snapshot tipado dos dados | `src/lib/ladome/data.ts` |
| Carrinho | Contexto React + `localStorage` + `<dialog>`; finaliza no WhatsApp | `cart.tsx` |

## 4. Mapa de rotas

| Original | Local |
| --- | --- |
| `/` | `src/app/page.tsx` |
| `/bags`, `/bags?collection=raizes\|novos-pontos` | `src/app/bags/page.tsx` + `CatalogView.tsx` |
| `/bags/:slug?v=:variante` | `src/app/bags/[slug]/page.tsx` + `ProductView.tsx` |
| `/atelier` | `src/app/atelier/page.tsx` |
| qualquer outra | `src/app/not-found.tsx` ("Este ponto ainda não foi feito.") |

Assets em `public/sites/ladome/` (mesmos arquivos do original: fonte, SVGs da marca, cursores de agulha, foto da Larissa, fotos das bolsas, materiais e depoimentos).
