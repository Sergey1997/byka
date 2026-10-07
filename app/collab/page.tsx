import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/book";
import { PageHead } from "@/components/frame";
import { live } from "@/lib/site";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "Сотрудничество" };

export default async function CollabPage() {
  const site = await getSite();
  if (!site.pages.collab.on) notFound();

  return (
    <main className="wrap page">
      <PageHead title={site.pages.collab.title} lede={site.pages.collab.lede} />
      <div className="deals">
        {live(site.collab).map((item, index) => (
          <article className="deal" key={`${item.kind}-${item.title}`}>
            <span>{String(index + 1).padStart(2, "0")}.</span>
            <div>
              {item.title ? <h2>{item.title}</h2> : null}
              {item.text ? <p>{item.text}</p> : null}
            </div>
            <BookButton draft={{ kind: item.kind, topic: item.title }}>Обсудить</BookButton>
          </article>
        ))}
      </div>
    </main>
  );
}
