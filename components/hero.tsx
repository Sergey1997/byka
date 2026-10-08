"use client";

import { useEffect, useState } from "react";
import { live } from "@/lib/site";
import { BookButton } from "./book";
import { Photo } from "./photo";
import { useSite } from "./site";

const interval = 6000;

export function Hero() {
  const site = useSite();
  const rooms = live(site.locations).filter((item) => item.photo);
  const slides = site.home.hero.photo
    ? [{ id: "hero", name: site.studio.name, photo: site.home.hero.photo }, ...rooms]
    : rooms;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setCurrent((value) => (value + 1) % slides.length), interval);
    return () => window.clearTimeout(timer);
  }, [current, slides.length]);

  const hero = site.home.hero;

  return (
    <section className="hero">
      {slides.map((location, index) => (
        <Photo
          key={location.id}
          className={index === current ? "hero-slide on" : "hero-slide"}
          src={location.photo}
          alt={location.name}
          fill
          sizes="100vw"
          priority={index === 0}
        />
      ))}
      <div className="hero-copy wrap">
        {hero.title ? <h1>{hero.title}</h1> : null}
        {hero.line ? <p>{hero.line}</p> : null}
        {hero.button ? <BookButton>{hero.button}</BookButton> : null}
      </div>
    </section>
  );
}
