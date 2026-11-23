import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces } from "next/font/google";
import { CartProvider } from "@/components/sites/pouso/cart";
import { Footer } from "@/components/sites/pouso/Footer";
import { Header } from "@/components/sites/pouso/Header";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Pouso · cafés de origem",
  description:
    "Torrefação artesanal de microlotes. Cafés de origem comprados direto de quem planta e torrados toda semana em Belo Horizonte.",
  icons: { icon: "/sites/pouso/brand/favicon.svg" },
  openGraph: {
    type: "website",
    siteName: "Pouso",
    locale: "pt_BR",
    title: "Pouso · cafés de origem",
    description: "Microlotes de origem, torrados toda semana. Do pé à xícara, sem pressa.",
    images: [{ url: "/sites/pouso/img/og.jpg", width: 1376, height: 768 }],
  },
};

export const viewport: Viewport = { themeColor: "#2B1A12", viewportFit: "cover" };

// First paint: decide whether the splash plays (first visit in 30 days) before React mounts, and
// release it when the opening animation ends.
const splashScript = `(function(){var h=document.documentElement;var r=false;try{var s=Number(localStorage.getItem('pouso:seen')||0);r=s>0&&Date.now()-s<2592e6}catch(e){}
if(r||matchMedia('(prefers-reduced-motion: reduce)').matches)return;h.classList.add('splash-active');
var done=false;function end(){if(done)return;done=true;h.classList.remove('splash-active');try{localStorage.setItem('pouso:seen',String(Date.now()))}catch(e){}window.dispatchEvent(new Event('pouso:intro'))}
document.addEventListener('animationend',function(e){if(e.target&&e.target.id==='splash'&&e.animationName==='splash-open')end()});setTimeout(end,5200)})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={fraunces.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
      </head>
      <body>
        <div id="splash" aria-hidden="true">
          <span className="center">
            <span className="stack">
              <span className="grid place-items-center">
                <span className="bean raw" />
                <span className="bean roasted" />
              </span>
              <span className="word">Pouso</span>
            </span>
          </span>
        </div>
        <CartProvider>
          <Header />
          <main className="relative">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
