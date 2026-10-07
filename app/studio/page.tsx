import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead, Points, SectionTitle } from "@/components/frame";
import { live } from "@/lib/site";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "О студии" };

export default async function StudioPage() {
  const site = await getSite();
  if (!site.pages.studio.on) notFound();

  return (
    <main className="wrap page">
      <PageHead title={site.pages.studio.title} lede={site.pages.studio.lede} />
      <section className="section">
        <Points items={live(site.gear)} />
      </section>
      <section className="section">
        <SectionTitle title={site.pages.studio.comfortTitle} />
        <ul className="comfort">
          {live(site.comfort).map((item) => (
            <li key={item.text}>{item.text}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
