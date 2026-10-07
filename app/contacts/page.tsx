import type { Metadata } from "next";
import { LeadForm } from "@/components/book";
import { PageHead } from "@/components/frame";
import { faq, routeSteps, studio } from "@/lib/content";

export const metadata: Metadata = { title: "Контакты" };

const map = `https://www.openstreetmap.org/export/embed.html?bbox=27.592%2C53.924%2C27.609%2C53.933&layer=mapnik&marker=${studio.lat}%2C${studio.lon}`;
const yandex = `https://yandex.by/maps/?ll=${studio.lon}%2C${studio.lat}&z=17&pt=${studio.lon}%2C${studio.lat}`;
const osm = `https://www.openstreetmap.org/?mlat=${studio.lat}&mlon=${studio.lon}#map=17/${studio.lat}/${studio.lon}`;

export default function ContactsPage() {
  return (
    <main className="wrap page">
      <PageHead
        title="Контакты"
        lede={`${studio.city}, ${studio.address}, ${studio.room}. ${studio.district}. Центральный вход, пятый этаж.`}
      />
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
            {routeSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <div className="messengers">
            <a href={studio.telegram}>{studio.telegramHandle}</a>
            <a href={studio.instagram}>Instagram bykamedia</a>
            <a href={studio.youtube}>YouTube</a>
          </div>
          <p className="fine">Телефон и WhatsApp не публикуем, пока нет отдельного номера студии. Ответ идёт в Telegram.</p>
        </div>
        <div>
          <h2>Написать</h2>
          <p className="fine">Партнёрство и вопросы</p>
          <LeadForm preset={{ kind: "partnership" }} />
          <div className="faq">
            {faq.map((item) => (
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
