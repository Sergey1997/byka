"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { live } from "@/lib/site";
import { Photo } from "./photo";
import { useSite } from "./site";

export function Header() {
  const site = useSite();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  if (path.startsWith("/admin")) return null;

  return (
    <header className="topbar">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <Photo src={site.studio.logo} alt="BYKA" width={44} height={44} sizes="44px" priority />
      </Link>
      <nav className={open ? "site-nav open" : "site-nav"}>
        {live(site.nav)
          .filter((item) => item.href !== "/")
          .map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
      </nav>
      <div className="socials">
        <a className="social" href={site.studio.telegram} aria-label="Telegram">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.7 4.3 3.4 11c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.2c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.1-2.1 4.5 3.3c.8.5 1.4.2 1.6-.8l2.9-13.8c.3-1.2-.4-1.8-1.4-1.3ZM8.6 13.6l9.3-5.9c.5-.3.9-.1.5.2l-7.9 7.2-.3 3.3-1.6-4.8Z" />
          </svg>
        </a>
        <a className="social" href={site.studio.youtube} aria-label="YouTube">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.2c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.2A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.8 15.5v-7L16 12l-6.2 3.5Z" />
          </svg>
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
