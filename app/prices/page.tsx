import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/book";
import { PageHead, PriceMenu } from "@/components/frame";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "Стоимость" };

export default async function PricesPage() {
  const site = await getSite();
  if (!site.pages.prices.on) notFound();

  return (
    <main className="wrap page">
      <PageHead title={site.pages.prices.title} lede={site.pages.prices.lede} photo={site.pages.prices.photo} />
      <section className="section">
        <PriceMenu groups={site.prices.groups} />
        <p className="more">
          <BookButton className="btn btn-solid">Забронировать</BookButton>
        </p>
      </section>
      {site.pages.prices.note ? <p className="fine center">{site.pages.prices.note}</p> : null}
    </main>
  );
}
