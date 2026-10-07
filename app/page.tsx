import Link from "next/link";
import { BookButton } from "@/components/book";
import { ContactsBlock } from "@/components/contacts-block";
import { Points, PriceCards, SectionTitle } from "@/components/frame";
import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { live } from "@/lib/site";
import { getSite } from "@/lib/site-store";

export default async function HomePage() {
  const site = await getSite();
  const rooms = live(site.locations);
  const films = live(site.projects);
  const about = live(site.gear);

  return (
    <main>
      {site.home.hero.on ? <Hero /> : null}
      {site.home.rooms.on && rooms.length > 0 ? (
        <section className="section wrap" id="locations">
          <SectionTitle title={site.home.rooms.title} lede={site.home.rooms.lede} />
          <div className="rooms">
            {rooms.map((location) => (
              <BookButton
                key={location.id}
                className="room"
                draft={{ kind: "booking", location: location.id, topic: location.name }}
              >
                {location.photo ? <img src={location.photo} alt="" /> : null}
                <span className="room-name">
                  {location.name}
                  <span aria-hidden="true">›</span>
                </span>
                <span className="room-spec">
                  {[location.guests, location.cameras].filter(Boolean).join(" · ")}
                </span>
              </BookButton>
            ))}
          </div>
        </section>
      ) : null}
      {site.home.prices.on ? (
        <section className="section wrap">
          <SectionTitle title={site.home.prices.title} lede={site.home.prices.lede} />
          <PriceCards rows={site.prices.groups[0]?.rows ?? []} />
          {site.pages.prices.on ? (
            <p className="more">
              <Link href="/prices">Весь прайс</Link>
            </p>
          ) : null}
        </section>
      ) : null}
      {site.home.projects.on && films.length > 0 ? (
        <section className="section wrap">
          <SectionTitle title={site.home.projects.title} lede={site.home.projects.lede} />
          <ProjectGrid items={films} />
        </section>
      ) : null}
      {site.home.about.on && about.length > 0 ? (
        <section className="section wrap">
          <SectionTitle title={site.home.about.title} />
          <Points items={about} />
        </section>
      ) : null}
      {site.pages.contacts.on ? (
        <section className="section wrap">
          <ContactsBlock studio={site.studio} title={site.pages.contacts.title} />
        </section>
      ) : null}
    </main>
  );
}
