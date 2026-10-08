import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/frame";
import { ProjectsBoard } from "@/components/projects-board";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "Проекты" };

export default async function ProjectsPage() {
  const site = await getSite();
  if (!site.pages.projects.on) notFound();

  return (
    <main className="wrap page">
      <PageHead title={site.pages.projects.title} lede={site.pages.projects.lede} photo={site.pages.projects.photo} />
      <ProjectsBoard />
    </main>
  );
}
