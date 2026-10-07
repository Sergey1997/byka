import type { Metadata } from "next";
import { PageHead } from "@/components/frame";
import { ProjectsBoard } from "@/components/projects-board";

export const metadata: Metadata = { title: "Проекты" };

export default function ProjectsPage() {
  return (
    <main className="wrap page">
      <PageHead title="Проекты" lede="Выпуски BYKA и ALTCOIN BUY. Нажмите на обложку — видео откроется прямо здесь." />
      <ProjectsBoard />
    </main>
  );
}
