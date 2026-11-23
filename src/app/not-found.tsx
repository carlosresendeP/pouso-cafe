import Link from "next/link";
import { ButtonLink } from "@/components/sites/pouso/ui";

export default function NotFound() {
  return (
    <section className="container-site py-28 md:py-40">
      <p className="label text-leaf">Erro 404</p>
      <h1 className="mt-4 text-title text-ink">
        Este grão <span className="italic-accent">ainda não foi torrado.</span>
      </h1>
      <p className="mt-4 text-body text-ink/80">A página que você procura não existe ou saiu da prateleira.</p>
      <div className="mt-10 flex flex-wrap items-center gap-8">
        <ButtonLink href="/cafes">Ver cafés</ButtonLink>
        <Link href="/" className="label border-b border-terra/50 pb-1 text-terra hover:border-terra">
          Voltar ao início
        </Link>
      </div>
    </section>
  );
}
