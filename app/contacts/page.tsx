import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/book";
import { ContactsBlock } from "@/components/contacts-block";
import { live } from "@/lib/site";
import { getSite } from "@/lib/site-store";

export const metadata: Metadata = { title: "Контакты" };

export default async function ContactsPage() {
  const site = await getSite();
  if (!site.pages.contacts.on) notFound();

  return (
    <main className="wrap page">
      <ContactsBlock studio={site.studio} title={site.pages.contacts.title} />
      <div className="contact-extra">
        {site.pages.contacts.writeTitle ? <h2>{site.pages.contacts.writeTitle}</h2> : null}
        {site.pages.contacts.writeLede ? <p className="fine">{site.pages.contacts.writeLede}</p> : null}
        <LeadForm preset={{ kind: "partnership" }} />
        <div className="faq">
          {live(site.faq).map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
