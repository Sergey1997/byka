import Image from "next/image";
import Link from "next/link";
import { Availability } from "@/components/availability";
import { BookButton } from "@/components/book";
import { PriceCards, Points, SectionTitle } from "@/components/frame";
import { Hero } from "@/components/hero";
import { ProjectGrid } from "@/components/project-grid";
import { gear, locations, prices, projects } from "@/lib/content";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <section className="section wrap" id="locations">
        <SectionTitle title="Интерьер" lede="Три локации в одном кабинете. При бронировании выберите сетап и сколько людей в кадре." />
        <div className="rooms">
          {locations.map((location) => (
            <BookButton
              key={location.id}
              className="room"
              draft={{ kind: "booking", location: location.id, topic: location.name }}
            >
              <Image src={`/rooms/${location.id}.jpg`} alt="" fill sizes="(max-width: 900px) 100vw, 33vw" />
              <span className="room-name">
                {location.name}
                <span aria-hidden="true">›</span>
              </span>
              <span className="room-spec">
                {location.guests} · {location.cameras}
              </span>
            </BookButton>
          ))}
        </div>
      </section>
      <section className="section wrap">
        <SectionTitle title="Услуги и стоимость" lede={`От ${prices.from} за ${prices.unit}.`} />
        <PriceCards rows={prices.groups[0].rows} />
        <p className="more">
          <Link href="/prices">Весь прайс</Link>
        </p>
      </section>
      <section className="section wrap">
        <SectionTitle title="Проекты" lede="Выпуски, которые сняты в студии." />
        <ProjectGrid items={projects} />
      </section>
      <section className="section wrap">
        <SectionTitle title="О студии" />
        <Points items={gear} />
      </section>
      <section className="section wrap">
        <Availability />
      </section>
    </main>
  );
}
