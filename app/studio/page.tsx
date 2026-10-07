import type { Metadata } from "next";
import { PageHead, Points, SectionTitle } from "@/components/frame";
import { comfort, gear } from "@/lib/content";

export const metadata: Metadata = { title: "О студии" };

export default function StudioPage() {
  return (
    <main className="wrap page">
      <PageHead
        title="О студии"
        lede="Чернышевского 10а, кабинет 504. Комната заглушена, между дублями есть где сесть, чай уже стоит."
      />
      <section className="section">
        <Points items={gear} />
      </section>
      <section className="section">
        <SectionTitle title="Между дублями" />
        <ul className="comfort">
          {comfort.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
