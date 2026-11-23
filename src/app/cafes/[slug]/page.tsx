import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductView } from "@/components/sites/pouso/ProductView";
import { getLot, lots } from "@/lib/pouso/data";

export function generateStaticParams() {
  return lots.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cafes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const lot = getLot(slug);
  return lot ? { title: `${lot.name} · Pouso`, description: `${lot.region} · ${lot.notes.join(", ")}. ${lot.description}` } : {};
}

// URL data (params) is read behind a Suspense boundary so the route keeps an instant App Shell.
async function Product({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lot = getLot(slug);
  if (!lot) notFound();
  return <ProductView lot={lot} />;
}

export default function CafePage({ params }: PageProps<"/cafes/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Product params={params} />
    </Suspense>
  );
}
