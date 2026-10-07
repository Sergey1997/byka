import type { Metadata } from "next";
import { PageHead } from "@/components/frame";
import { comfort, gear } from "@/lib/content";

export const metadata: Metadata = { title: "О студии" };

export default function StudioPage() {
  return (
    <main>
      <div className="wrap">
        <PageHead
          index="03 · Студия"
          title="Кабинет, а не ангар"
          lede="Чернышевского 10а, кабинет 504. Комната заглушена, между дублями есть где сесть, чай уже стоит."
        />
      </div>
      <section className="section ink">
        <div className="wrap gear">
          {gear.map((item) => (
            <article key={item.title}>
              <p className="index">{item.kicker}</p>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section paper">
        <div className="wrap split">
          <div>
            <p className="index">Между дублями</p>
            <h2>Как здесь сидится</h2>
          </div>
          <ul className="comfort">
            {comfort.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
