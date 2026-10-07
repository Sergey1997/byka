import type { Metadata } from "next";
import { BookButton } from "@/components/book";
import { PageHead } from "@/components/frame";
import { collab } from "@/lib/content";

export const metadata: Metadata = { title: "Сотрудничество" };

export default function CollabPage() {
  return (
    <main className="wrap" style={{ paddingBottom: "3rem" }}>
      <PageHead
        index="05 · Вместе"
        title="Не только аренда часа"
        lede="Пять форматов. Заявка падает в тот же Telegram, что и бронь студии."
      />
      <div className="deals">
        {collab.map((item) => (
          <article className="deal" key={item.kind}>
            <p className="index">{item.index}</p>
            <div>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
            <BookButton className="btn btn-black" draft={{ kind: item.kind, topic: item.title }}>
              Обсудить
            </BookButton>
          </article>
        ))}
      </div>
    </main>
  );
}
