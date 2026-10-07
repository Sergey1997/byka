import Image from "next/image";
import Link from "next/link";
import { nav, studio } from "@/lib/content";
import { BookButton } from "./book";

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <Image src="/logo.jpg" alt="BYKA" width={56} height={56} />
          <p>{studio.line}</p>
        </div>
        <ul>
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <div>
          <p>
            {studio.city}, {studio.address}, {studio.room}
          </p>
          <a href={studio.telegram}>{studio.telegramHandle}</a>
          <a href={studio.instagram}>Instagram</a>
          <a href={studio.youtube}>YouTube BYKA</a>
          <a href={studio.altcoin}>ALTCOIN BUY</a>
        </div>
      </div>
    </footer>
  );
}

export function PageHead({ title, lede }: { title: string; lede: string }) {
  return (
    <header className="page-head">
      <h1>{title}</h1>
      <p>{lede}</p>
    </header>
  );
}

export function SectionTitle({ title, lede }: { title: string; lede?: string }) {
  return (
    <header className="section-title">
      <h2>{title}</h2>
      {lede ? <p>{lede}</p> : null}
    </header>
  );
}

export function PriceCards({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <div className="price-cards">
      {rows.map(([name, unit, price]) => (
        <article className="price-card" key={name}>
          <h3>{name}</h3>
          <p>
            <strong>{price}</strong> BYN / {unit}
          </p>
          <BookButton draft={{ kind: "booking", topic: name }}>Забронировать</BookButton>
        </article>
      ))}
    </div>
  );
}

export function Points({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="points">
      {items.map((item, index) => (
        <li key={item.title}>
          <span>{String(index + 1).padStart(2, "0")}.</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </li>
      ))}
    </ol>
  );
}
