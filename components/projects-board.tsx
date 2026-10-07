"use client";

import { useState } from "react";
import { genreLabel, type ProjectGenre } from "@/lib/content";
import { live } from "@/lib/site";
import { BookButton } from "./book";
import { ProjectGrid } from "./project-grid";
import { useSite } from "./site";

const filters: Array<ProjectGenre | "all"> = ["all", "business", "craft", "personal", "crypto"];

export function ProjectsBoard() {
  const site = useSite();
  const [filter, setFilter] = useState<ProjectGenre | "all">("all");
  const visible = live(site.projects).filter((item) => filter === "all" || item.genre === filter);

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
          <p>В этой полке пока пусто.</p>
          <BookButton draft={{ kind: "guest", topic: "Подкаст творчества" }}>Предложить выпуск</BookButton>
        </div>
      ) : (
        <ProjectGrid items={visible} />
      )}
    </div>
  );
}
