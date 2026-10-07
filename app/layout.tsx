import type { Metadata } from "next";
import { Source_Serif_4, Unbounded } from "next/font/google";
import { BookProvider } from "@/components/book";
import { Footer, } from "@/components/frame";
import { Header } from "@/components/header";
import { studio } from "@/lib/content";
import "./globals.css";

const display = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});

const serif = Source_Serif_4({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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

const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "BYKA",
  description: "Студия записи подкастов в Минске",
  url: studio.youtube,
  address: {
    "@type": "PostalAddress",
    streetAddress: "ул. Чернышевского, 10а, каб. 504",
    addressLocality: "Минск",
    addressCountry: "BY",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: studio.lat,
    longitude: studio.lon,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${display.variable} ${serif.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <BookProvider>
          <Header />
          {children}
          <Footer />
        </BookProvider>
      </body>
    </html>
  );
}
