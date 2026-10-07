"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { live } from "@/lib/site";
import { BookButton } from "./book";
import { useSite } from "./site";

export function Footer() {
  const site = useSite();
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <img src={site.studio.logo} alt="BYKA" width={56} height={56} />
          {site.studio.line ? <p>{site.studio.line}</p> : null}
        </div>
        <ul>
          {live(site.nav).map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <div>
          <p>
            {[site.studio.city, site.studio.address, site.studio.room].filter(Boolean).join(", ")}
          </p>
          {site.studio.telegram ? <a href={site.studio.telegram}>{site.studio.telegramHandle}</a> : null}
          {site.studio.instagram ? <a href={site.studio.instagram}>Instagram</a> : null}
          {site.studio.youtube ? <a href={site.studio.youtube}>YouTube BYKA</a> : null}
          {site.studio.altcoin ? <a href={site.studio.altcoin}>ALTCOIN BUY</a> : null}
        </div>
      </div>
    </footer>
  );
}

export function PageHead({ title, lede }: { title?: string; lede?: string }) {
  if (!title && !lede) return null;
  return (
    <header className="page-head">
      {title ? <h1>{title}</h1> : null}
      {lede ? <p>{lede}</p> : null}
    </header>
  );
}

export function SectionTitle({ title, lede }: { title?: string; lede?: string }) {
  if (!title && !lede) return null;
  return (
    <header className="section-title">
      {title ? <h2>{title}</h2> : null}
      {lede ? <p>{lede}</p> : null}
    </header>
  );
}

export function PriceCards({ rows }: { rows: { name: string; unit: string; price: string }[] }) {
  return (
    <div className="price-cards">
      {rows
        .filter((row) => row.name || row.price)
        .map((row) => (
          <article className="price-card" key={`${row.name}-${row.price}`}>
            {row.name ? <h3>{row.name}</h3> : null}
            {row.price ? (
              <p>
                <strong>{row.price}</strong> BYN{row.unit ? ` / ${row.unit}` : ""}
              </p>
            ) : null}
            <BookButton draft={{ kind: "booking", topic: row.name }}>Забронировать</BookButton>
          </article>
        ))}
    </div>
  );
}

export function Points({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="points">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`}>
          <span>{String(index + 1).padStart(2, "0")}.</span>
          {item.title ? <h3>{item.title}</h3> : null}
          {item.text ? <p>{item.text}</p> : null}
        </li>
      ))}
    </ol>
  );
}
