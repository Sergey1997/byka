"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { nav, studio } from "@/lib/content";
import { BookButton, MinskClock } from "./book";

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="topbar">
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <Image src="/logo.jpg" alt="" width={48} height={48} />
        <span>
          BYKA
          <small>студия подкастов</small>
        </span>
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Закрыть" : "Меню"}
      </button>
      <nav className={open ? "site-nav open" : "site-nav"}>
        {nav.map((item, index) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <span>0{index + 1}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="top-tools">
        <MinskClock />
        <BookButton className="btn btn-black">Забронировать</BookButton>
      </div>
      <p className="sr-only">{studio.address}</p>
    </header>
  );
}
