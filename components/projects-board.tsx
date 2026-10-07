"use client";

import Image from "next/image";
import { useState } from "react";
import { genreLabel, projects, type ProjectGenre } from "@/lib/content";
import { BookButton } from "./book";

const filters: Array<ProjectGenre | "all"> = ["all", "business", "craft", "personal", "crypto"];

export function ProjectsBoard() {
  const [filter, setFilter] = useState<ProjectGenre | "all">("all");
  const visible = projects.filter((item) => filter === "all" || item.genre === filter);

  return (
    <div>
      <div className="filters" role="tablist">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            className={item === filter ? "filter on" : "filter"}
            onClick={() => setFilter(item)}
          >
            {item === "all" ? "Все" : genreLabel[item]}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <div className="empty-genre">
          <p>В этой полке пока пусто. Творческие выпуски снимем — появятся здесь, а не на стоковой картинке.</p>
          <BookButton draft={{ kind: "guest", topic: "Подкаст творчества" }}>
            Предложить выпуск
          </BookButton>
        </div>
      ) : (
        <div className="posters">
          {visible.map((item) => (
            <a
              key={item.youtubeId}
              className="poster"
              href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                src={`https://i.ytimg.com/vi/${item.youtubeId}/hqdefault.jpg`}
                alt=""
                width={480}
                height={360}
              />
              <p className="index">{item.channel}</p>
              <h2>{item.title}</h2>
              <p>{genreLabel[item.genre]}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
