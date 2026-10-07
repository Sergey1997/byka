"use client";

import Image from "next/image";
import { useState } from "react";
import { projects } from "@/lib/content";

export function Showreel() {
  const films = projects.filter((item) => item.channel === "BYKA").slice(0, 4);
  const [current, setCurrent] = useState(films[0]?.youtubeId ?? "");
  const active = films.find((item) => item.youtubeId === current) ?? films[0];

  return (
    <section className="reel">
      <div className="reel-copy">
        <p className="index">Кадр</p>
        <h2>Как это звучит и выглядит</h2>
        <p>
          Отдельного шоурила студии пока нет. Ниже живые выпуски канала: по ним видно, какой кадр и тон мы держим.
        </p>
      </div>
      <div>
        <div className="player">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${current}`}
            title={active?.title ?? "Выпуск BYKA"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="reel-list">
          {films.map((film) => (
            <button
              key={film.youtubeId}
              type="button"
              className={film.youtubeId === current ? "reel-pick on" : "reel-pick"}
              onClick={() => setCurrent(film.youtubeId)}
            >
              <Image
                src={`https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`}
                alt=""
                width={160}
                height={90}
              />
              <span>{film.title}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
