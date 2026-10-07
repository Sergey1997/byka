import Image from "next/image";
import Link from "next/link";
import { Availability } from "@/components/availability";
import { BookButton } from "@/components/book";
import { Showreel } from "@/components/showreel";
import { locations, prices, projects, studio } from "@/lib/content";

export default function HomePage() {
  const titles = projects.map((item) => item.title).join("  ·  ");
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="kicker">
              <span>
                <span className="rec">● rec</span> {studio.city}
              </span>
              <span>
                {studio.address}, {studio.room}
              </span>
            </p>
            <h1>Студия записи подкастов</h1>
            <p className="lede">
              Три локации в одном кабинете. Фронт и боковой план, звук, который не спорит с голосом, и свет, который не делает лицо пластиковым.
            </p>
            <div className="hero-actions">
              <BookButton>Забронировать студию</BookButton>
              <Link className="btn btn-ghost" href="/prices">
                Смотреть прайс
              </Link>
            </div>
            <dl className="facts">
              <div>
                <dt>Камеры</dt>
                <dd>Sony FX30</dd>
              </div>
              <div>
                <dt>Микрофоны</dt>
                <dd>RODE PodMic</dd>
              </div>
              <div>
                <dt>Свет</dt>
                <dd>Amaran 300c</dd>
              </div>
            </dl>
          </div>
          <aside className="hero-mark">
            <Image
              src="/logo.jpg"
              alt="Знак BYKA: чёрный бык на жёлтом поле"
              width={640}
              height={640}
              priority
              className="hero-logo"
            />
            <p>
              От {prices.from} / {prices.unit}. Канал {studio.line.toLowerCase()}.
            </p>
          </aside>
        </div>
      </section>
      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {titles} · {titles} ·
        </div>
      </div>
      <section className="sets" id="locations">
        {locations.map((location) => (
          <article className="set" key={location.id} id={location.id}>
            <div className="set-copy">
              <p className="index">Локация {location.index}</p>
              <h2>{location.name}</h2>
              <p className="lede">{location.text}</p>
              <p className="set-spec">
                {location.guests}
                <span aria-hidden="true">·</span>
                {location.cameras}
              </p>
              <div className="hero-actions">
                <BookButton
                  className="btn btn-solid"
                  draft={{ kind: "booking", location: location.id, topic: location.name }}
                >
                  Этот сетап
                </BookButton>
              </div>
            </div>
            <div className="set-visual">
              <Image
                src={`/sets/${location.id}.jpg`}
                alt={`Сетап «${location.name}»`}
                width={1200}
                height={900}
                className="set-photo"
              />
            </div>
          </article>
        ))}
      </section>
      <section className="section ink">
        <div className="wrap">
          <Showreel />
        </div>
      </section>
      <section className="section paper">
        <div className="wrap">
          <Availability />
        </div>
      </section>
    </main>
  );
}
