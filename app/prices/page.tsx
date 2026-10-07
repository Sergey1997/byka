import type { Metadata } from "next";
import { PageHead, PriceCards, SectionTitle } from "@/components/frame";
import { prices } from "@/lib/content";

export const metadata: Metadata = { title: "Стоимость" };

export default function PricesPage() {
  return (
    <main className="wrap page">
      <PageHead
        title="Стоимость"
        lede={`От ${prices.from} за ${prices.unit}. В час записи уже входят локация, камеры Sony FX30, RODE PodMic и свет Amaran. Монтаж и выезд считаются отдельно.`}
      />
      {prices.groups.map((group) => (
        <section className="section" key={group.title}>
          <SectionTitle title={group.title} />
          <PriceCards rows={group.rows} />
        </section>
      ))}
      <p className="fine center">
        Цены в белорусских рублях. Если смена длиннее часа или гостей больше четырёх — напишите, посчитаем до съёмки, а не после.
      </p>
    </main>
  );
}
