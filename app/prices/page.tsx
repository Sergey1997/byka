import type { Metadata } from "next";
import { PageHead } from "@/components/frame";
import { prices } from "@/lib/content";

export const metadata: Metadata = { title: "Стоимость" };

export default function PricesPage() {
  return (
    <main className="wrap paper" style={{ paddingBottom: "3rem" }}>
      <PageHead
        index="02 · Прайс"
        title="Сколько стоит час"
        lede="В час записи уже входят локация, камеры Sony FX30, RODE PodMic и свет Amaran. Монтаж и выезд считаются отдельно."
      />
      <div className="price-hero">
        <div>
          <p className="index">Старт</p>
          <strong>{prices.from}</strong>
        </div>
        <p>{prices.unit}</p>
      </div>
      {prices.groups.map((group) => (
        <section className="rate-block" key={group.title}>
          <h2>{group.title}</h2>
          <table className="rates">
            <thead>
              <tr>
                <th>Позиция</th>
                <th>Единица</th>
                <th>BYN</th>
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      <p className="fine">Цены в белорусских рублях. Если смена длиннее часа или гостей больше четырёх — напишите, посчитаем до съёмки, а не после.</p>
    </main>
  );
}
