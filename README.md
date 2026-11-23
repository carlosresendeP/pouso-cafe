# Ladôme Ateliê — clone (Next.js 16 + Tailwind CSS 4)

Recriação editável de https://ladomeatelie.com.br/ — home, catálogo, página de produto, ateliê, carrinho e 404.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

- Na primeira visita toca o splash (coração de crochê). Para vê-lo de novo, apague `ladome:seen` no localStorage.
- Conteúdo: `src/lib/ladome/data.ts` · Componentes: `src/components/sites/ladome/` · Assets: `public/sites/ladome/`.
- Como o original é feito e como cada efeito foi reproduzido: [docs/research/ladome/README.md](docs/research/ladome/README.md).
