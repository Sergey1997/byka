"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { locations, studio } from "@/lib/content";
import { BookButton } from "./book";

const interval = 6000;

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => setCurrent((value) => (value + 1) % locations.length), interval);
    return () => window.clearTimeout(timer);
  }, [current]);

  return (
    <section className="hero">
      {locations.map((location, index) => (
        <Image
          key={location.id}
          className={index === current ? "hero-slide on" : "hero-slide"}
          src={`/rooms/${location.id}.jpg`}
          alt={`Локация «${location.name}»`}
          fill
          priority={index === 0}
          sizes="100vw"
        />
      ))}
      <div className="hero-copy wrap">
        <h1>
          Студия записи подкастов
          <br />и онлайн-трансляций
        </h1>
        <p>
          {studio.city}, {studio.address}, {studio.room}
        </p>
        <BookButton>Забронировать</BookButton>
      </div>
      <div className="hero-dots">
        {locations.map((location, index) => (
          <button
            key={location.id}
            type="button"
            className={index === current ? "on" : undefined}
            aria-label={location.name}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </section>
  );
}
