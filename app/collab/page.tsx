import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookButton } from "@/components/book";
import { PageHead } from "@/components/frame";
import { Photo } from "@/components/photo";
import { live } from "@/lib/site";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "Сотрудничество" };

export default async function CollabPage() {
  const site = await getSite();
  if (!site.pages.collab.on) notFound();

  return (
    <main className="wrap page">
      <PageHead title={site.pages.collab.title} lede={site.pages.collab.lede} photo={site.pages.collab.photo} />
      <div className="deals">
        {live(site.collab).map((item, index) => (
          <article className="deal" key={`${item.kind}-${item.title}`}>
            <span>{String(index + 1).padStart(2, "0")}.</span>
            <div>
              {item.photo ? (
                <div className="deal-photo">
                  <Photo src={item.photo} alt="" fill sizes="(max-width: 900px) 100vw, 40rem" />
                </div>
              ) : null}
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
