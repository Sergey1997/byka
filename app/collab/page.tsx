import type { Metadata } from "next";
import { BookButton } from "@/components/book";
import { PageHead } from "@/components/frame";
import { collab } from "@/lib/content";

export const metadata: Metadata = { title: "Сотрудничество" };

export default function CollabPage() {
  return (
    <main className="wrap page">
      <PageHead
        title="Сотрудничество"
        lede="Не только аренда часа. Пять форматов, заявка падает в тот же Telegram, что и бронь студии."
      />
      <div className="deals">
        {collab.map((item) => (
          <article className="deal" key={item.kind}>
            <span>{item.index}.</span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
            <BookButton draft={{ kind: item.kind, topic: item.title }}>Обсудить</BookButton>
          </article>
        ))}
      </div>
    </main>
  );
}
