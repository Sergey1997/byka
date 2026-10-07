import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/book";
import { PageHead } from "@/components/frame";
import { live } from "@/lib/site";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "Контакты" };

export default async function ContactsPage() {
  const site = await getSite();
  if (!site.pages.contacts.on) notFound();
  const { studio } = site;
  const map = `https://www.openstreetmap.org/export/embed.html?bbox=27.592%2C53.924%2C27.609%2C53.933&layer=mapnik&marker=${studio.lat}%2C${studio.lon}`;
  const yandex = `https://yandex.by/maps/?ll=${studio.lon}%2C${studio.lat}&z=17&pt=${studio.lon}%2C${studio.lat}`;
  const osm = `https://www.openstreetmap.org/?mlat=${studio.lat}&mlon=${studio.lon}#map=17/${studio.lat}/${studio.lon}`;

  return (
    <main className="wrap page">
      <PageHead title={site.pages.contacts.title} lede={site.pages.contacts.lede} />
      <div className="contact-grid">
        <div>
          <div className="map-frame">
            <iframe title="Карта: Чернышевского 10а" src={map} />
          </div>
          <p className="messengers">
            <a className="btn" href={yandex}>
              Яндекс Карты
            </a>
            <a className="btn" href={osm}>
              OpenStreetMap
            </a>
          </p>
          <ol className="route">
            {live(site.route).map((step) => (
              <li key={step.text}>{step.text}</li>
            ))}
          </ol>
          <div className="messengers">
            {studio.telegram ? <a href={studio.telegram}>{studio.telegramHandle}</a> : null}
            {studio.instagram ? <a href={studio.instagram}>Instagram bykamedia</a> : null}
            {studio.youtube ? <a href={studio.youtube}>YouTube</a> : null}
          </div>
          {site.pages.contacts.phoneNote ? <p className="fine">{site.pages.contacts.phoneNote}</p> : null}
        </div>
        <div>
          {site.pages.contacts.writeTitle ? <h2>{site.pages.contacts.writeTitle}</h2> : null}
          {site.pages.contacts.writeLede ? <p className="fine">{site.pages.contacts.writeLede}</p> : null}
          <LeadForm preset={{ kind: "partnership" }} />
          <div className="faq">
            {live(site.faq).map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
