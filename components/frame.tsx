import Link from "next/link";
import { nav, studio } from "@/lib/content";

export function Footer() {
  return (
    <footer className="foot">
      <div>
        <p className="brand-word">BYKA</p>
        <p>
          {studio.address}, {studio.room}
          <br />
          {studio.city}
        </p>
      </div>
      <ul>
        {nav.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
      <div>
        <a href={studio.telegram}>{studio.telegramHandle}</a>
        <a href={studio.instagram}>Instagram</a>
        <a href={studio.youtube}>YouTube BYKA</a>
        <a href={studio.altcoin}>ALTCOIN BUY</a>
      </div>
    </footer>
  );
}

export function PageHead({
  index,
  title,
  lede,
}: {
  index: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="page-head">
      <p className="index">{index}</p>
      <h1>{title}</h1>
      <p className="lede">{lede}</p>
    </header>
  );
}
