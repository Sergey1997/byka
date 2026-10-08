"use client";

import Image from "next/image";
import { useState } from "react";
export function ProjectGrid({
  items,
}: {
  items: { youtubeId: string; title: string; channel: string; photo?: string }[];
}) {
  const [playing, setPlaying] = useState("");

  return (
    <div className="project-grid">
      {items.map((item) => (
        <article className="project" key={item.youtubeId}>
          <div className="project-frame">
            {playing === item.youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button type="button" onClick={() => setPlaying(item.youtubeId)} aria-label={`Смотреть: ${item.title}`}>
                <Image
                  src={item.photo || `https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  quality={70}
                />
                <span className="play" aria-hidden="true" />
              </button>
            )}
          </div>
          <h3>{item.title}</h3>
          <p>{item.channel}</p>
        </article>
      ))}
    </div>
  );
}
