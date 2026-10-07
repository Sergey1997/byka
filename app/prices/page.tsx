import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead, PriceCards, SectionTitle } from "@/components/frame";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "Стоимость" };

export default async function PricesPage() {
  const site = await getSite();
  if (!site.pages.prices.on) notFound();

  return (
    <main className="wrap page">
      <PageHead title={site.pages.prices.title} lede={site.pages.prices.lede} />
      {site.prices.groups.map((group) => (
        <section className="section" key={group.title}>
          <SectionTitle title={group.title} />
          <PriceCards rows={group.rows} />
        </section>
      ))}
      {site.pages.prices.note ? <p className="fine center">{site.pages.prices.note}</p> : null}
    </main>
  );
}
