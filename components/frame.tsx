"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { live } from "@/lib/site";
import { BookButton } from "./book";
import { Photo } from "./photo";
import { useSite } from "./site";

export function Footer() {
  const site = useSite();
  const path = usePathname();
  if (path.startsWith("/admin")) return null;

  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <Photo src={site.studio.logo} alt="BYKA" width={56} height={56} sizes="56px" />
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

export function PageHead({ title, lede, photo }: { title?: string; lede?: string; photo?: string }) {
  if (!title && !lede && !photo) return null;
  return (
    <header className="page-head">
      {title ? <h1>{title}</h1> : null}
      {lede ? <p>{lede}</p> : null}
      {photo ? (
        <div className="page-cover">
          <Photo src={photo} alt="" fill sizes="(max-width: 900px) 100vw, 1200px" />
        </div>
      ) : null}
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

type PriceGroup = { title: string; rows: { name: string; unit: string; price: string }[] };

export function PriceMenu({ groups }: { groups: PriceGroup[] }) {
  return (
    <div className="price-menu">
      {groups.map((group, g) => (
        <div className="price-col" key={`${group.title}-${g}`}>
          {group.title ? <h3>{group.title}</h3> : null}
          <ul className="price-list">
            {group.rows
              .filter((row) => row.name || row.price)
              .map((row, r) => (
                <li key={`${row.name}-${r}`}>
                  <BookButton className="price-item" draft={{ kind: "booking", topic: row.name }}>
                    <span className="price-name">{row.name}</span>
                    <span className="price-line">
                      <span>{row.unit ? row.unit[0].toUpperCase() + row.unit.slice(1) : ""}</span>
                      {row.price ? <strong>{row.price} BYN</strong> : null}
                    </span>
                  </BookButton>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Points({ items }: { items: { title: string; text: string; photo?: string }[] }) {
  return (
    <ol className="points">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`}>
          {item.photo ? (
            <div className="point-photo">
              <Photo src={item.photo} alt="" fill sizes="(max-width: 900px) 100vw, 34rem" />
            </div>
          ) : null}
          <span>{String(index + 1).padStart(2, "0")}.</span>
          {item.title ? <h3>{item.title}</h3> : null}
          {item.text ? <p>{item.text}</p> : null}
        </li>
      ))}
    </ol>
  );
}
