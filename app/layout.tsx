import type { Metadata } from "next";
import localFont from "next/font/local";
import { BookProvider } from "@/components/book";
import { Footer } from "@/components/frame";
import { Header } from "@/components/header";
import { SiteProvider } from "@/components/site";
import { getSite } from "@/lib/site-store";
import "./globals.css";

const sans = localFont({
  src: "./fonts/Montserrat.ttf",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BYKA — студия записи подкастов в Минске",
    template: "%s — BYKA",
  },
  description:
    "Студия подкастов на Чернышевского 10а. Три локации, Sony FX30, RODE PodMic, Amaran 300c. Бронь заявкой в Telegram.",
  icons: { icon: "/logo.jpg" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.studio.name,
    description: "Студия записи подкастов в Минске",
    url: site.studio.youtube,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.studio.address}, ${site.studio.room}`,
      addressLocality: site.studio.city,
      addressCountry: "BY",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.studio.lat,
      longitude: site.studio.lon,
    },
  };

  return (
    <html lang="ru" className={sans.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <SiteProvider site={site}>
          <BookProvider>
            <Header />
            {children}
            <Footer />
          </BookProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
