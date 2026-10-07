import type { Metadata } from "next";
import { PageHead } from "@/components/frame";
import { ProjectsBoard } from "@/components/projects-board";

export const metadata: Metadata = { title: "Проекты" };

export default function ProjectsPage() {
  return (
    <main className="wrap" style={{ paddingBottom: "3rem" }}>
      <PageHead
        index="04 · Проекты"
        title="Что уже снято"
        lede="Выпуски BYKA и ALTCOIN BUY. Обложки ведут на YouTube, не на макет."
      />
      <ProjectsBoard />
    </main>
  );
}
