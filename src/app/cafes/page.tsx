import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogView } from "@/components/sites/pouso/CatalogView";

export const metadata: Metadata = { title: "Cafés · Pouso" };

export default function CafesPage() {
  return (
    <section className="container-site relative pb-32 pt-16 md:pb-44 md:pt-24">
      <Suspense fallback={<div className="min-h-[80vh]" />}>
        <CatalogView />
      </Suspense>
    </section>
  );
}
