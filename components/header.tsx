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
        <a className="social" href={site.studio.instagram} aria-label="Instagram">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 7.3a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21 8.1c-.1-1.5-.4-2.8-1.5-3.9S17.1 2.8 15.6 2.7C14.1 2.6 9.9 2.6 8.4 2.7 6.9 2.8 5.6 3.1 4.5 4.2S3.1 6.6 3 8.1c-.1 1.5-.1 5.7 0 7.2.1 1.5.4 2.8 1.5 3.9s2.4 1.4 3.9 1.5c1.5.1 5.7.1 7.2 0 1.5-.1 2.8-.4 3.9-1.5s1.4-2.4 1.5-3.9c.1-1.5.1-5.7 0-7.2Zm-2 9.6a3 3 0 0 1-1.7 1.7c-1.2.5-4 .4-5.3.4s-4.1.1-5.3-.4a3 3 0 0 1-1.7-1.7c-.5-1.2-.4-4-.4-5.3s-.1-4.1.4-5.3a3 3 0 0 1 1.7-1.7c1.2-.5 4-.4 5.3-.4s4.1-.1 5.3.4a3 3 0 0 1 1.7 1.7c.5 1.2.4 4 .4 5.3s.1 4.1-.4 5.3Z" />
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
