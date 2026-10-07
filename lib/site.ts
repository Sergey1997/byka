import {
  collab,
  comfort,
  faq,
  gear,
  locations,
  nav,
  prices,
  projects,
  routeSteps,
  studio,
  type LeadKind,
  type ProjectGenre,
} from "./content";

export type Site = {
  pages: {
    prices: { on: boolean; title: string; lede: string; note: string };
    studio: { on: boolean; title: string; lede: string; comfortTitle: string };
    projects: { on: boolean; title: string; lede: string };
    collab: { on: boolean; title: string; lede: string };
    contacts: { on: boolean; title: string; lede: string; writeTitle: string; writeLede: string; phoneNote: string };
  };
  home: {
    hero: { on: boolean; title: string; line: string; button: string };
    rooms: { on: boolean; title: string; lede: string };
    prices: { on: boolean; title: string; lede: string };
    projects: { on: boolean; title: string; lede: string };
    about: { on: boolean; title: string };
    calendar: { on: boolean; title: string; text: string };
  };
  studio: {
    name: string;
    line: string;
    city: string;
    address: string;
    room: string;
    district: string;
    lat: number;
    lon: number;
    telegram: string;
    telegramHandle: string;
    instagram: string;
    youtube: string;
    altcoin: string;
    hours: string;
    logo: string;
    phone: string;
    email: string;
  };
  nav: { href: string; label: string; on: boolean }[];
  locations: {
    id: string;
    name: string;
    guests: string;
    cameras: string;
    text: string;
    photo: string;
    on: boolean;
  }[];
  prices: {
    from: string;
    unit: string;
    groups: { title: string; rows: { name: string; unit: string; price: string }[] }[];
  };
  gear: { title: string; text: string; on: boolean }[];
  comfort: { text: string; on: boolean }[];
  projects: { youtubeId: string; title: string; genre: ProjectGenre; channel: string; on: boolean }[];
  collab: { kind: LeadKind; title: string; text: string; on: boolean }[];
  faq: { q: string; a: string; on: boolean }[];
  route: { text: string; on: boolean }[];
};

export function defaultSite(): Site {
  return {
    pages: {
      prices: {
        on: true,
        title: "Стоимость",
        lede: `От ${prices.from} за ${prices.unit}. В час записи уже входят локация, камеры Sony FX30, RODE PodMic и свет Amaran. Монтаж и выезд считаются отдельно.`,
        note: "Цены в белорусских рублях. Если смена длиннее часа или гостей больше четырёх — напишите, посчитаем до съёмки, а не после.",
      },
      studio: {
        on: true,
        title: "О студии",
        lede: "Чернышевского 10а, кабинет 504. Комната заглушена, между дублями есть где сесть, чай уже стоит.",
        comfortTitle: "Между дублями",
      },
      projects: {
        on: true,
        title: "Проекты",
        lede: "Выпуски BYKA и ALTCOIN BUY. Нажмите на обложку — видео откроется прямо здесь.",
      },
      collab: {
        on: true,
        title: "Сотрудничество",
        lede: "Не только аренда часа. Пять форматов, заявка падает в тот же Telegram, что и бронь студии.",
      },
      contacts: {
        on: true,
        title: "Контакты",
        lede: `${studio.city}, ${studio.address}, ${studio.room}. ${studio.district}. Центральный вход, пятый этаж.`,
        writeTitle: "Написать",
        writeLede: "Партнёрство и вопросы",
        phoneNote: "Телефон и WhatsApp не публикуем, пока нет отдельного номера студии. Ответ идёт в Telegram.",
      },
    },
    home: {
      hero: {
        on: true,
        title: "Студия записи подкастов\nи онлайн-трансляций",
        line: `${studio.city}, ${studio.address}, ${studio.room}`,
        button: "Забронировать",
      },
      rooms: {
        on: true,
        title: "Интерьер",
        lede: "Три локации в одном кабинете. При бронировании выберите сетап и сколько людей в кадре.",
      },
      prices: {
        on: true,
        title: "Услуги и стоимость",
        lede: `От ${prices.from} за ${prices.unit}.`,
      },
      projects: {
        on: true,
        title: "Проекты",
        lede: "Выпуски, которые сняты в студии.",
      },
      about: { on: true, title: "О студии" },
      calendar: {
        on: true,
        title: "Свободный час",
        text: "Подсвеченные слоты ещё не закрыты. Нажатие не бронирует кабинет — открывает заявку, её подтверждаем в Telegram.",
      },
    },
    studio: { ...studio, logo: "/logo.jpg", phone: "", email: "" },
    nav: nav.map((item) => ({ ...item, on: true })),
    locations: locations.map((item) => ({
      id: item.id,
      name: item.name,
      guests: item.guests,
      cameras: item.cameras,
      text: item.text,
      photo: `/rooms/${item.id}.jpg`,
      on: true,
    })),
    prices: {
      from: prices.from,
      unit: prices.unit,
      groups: prices.groups.map((group) => ({
        title: group.title,
        rows: group.rows.map(([name, unit, price]) => ({ name, unit, price })),
      })),
    },
    gear: gear.map((item) => ({ title: item.title, text: item.text, on: true })),
    comfort: comfort.map((text) => ({ text, on: true })),
    projects: projects.map((item) => ({ ...item, on: true })),
    collab: collab.map((item) => ({ kind: item.kind, title: item.title, text: item.text, on: true })),
    faq: faq.map((item) => ({ ...item, on: true })),
    route: routeSteps.map((text) => ({ text, on: true })),
  };
}

export function normalizeSite(raw: unknown): Site {
  const fallback = defaultSite();
  if (!raw || typeof raw !== "object") return fallback;
  const value = raw as Partial<Site>;
  return {
    ...fallback,
    ...value,
    pages: {
      prices: { ...fallback.pages.prices, ...value.pages?.prices },
      studio: { ...fallback.pages.studio, ...value.pages?.studio },
      projects: { ...fallback.pages.projects, ...value.pages?.projects },
      collab: { ...fallback.pages.collab, ...value.pages?.collab },
      contacts: { ...fallback.pages.contacts, ...value.pages?.contacts },
    },
    home: {
      hero: { ...fallback.home.hero, ...value.home?.hero },
      rooms: { ...fallback.home.rooms, ...value.home?.rooms },
      prices: { ...fallback.home.prices, ...value.home?.prices },
      projects: { ...fallback.home.projects, ...value.home?.projects },
      about: { ...fallback.home.about, ...value.home?.about },
      calendar: { ...fallback.home.calendar, ...value.home?.calendar },
    },
    studio: { ...fallback.studio, ...value.studio },
    nav: Array.isArray(value.nav) ? value.nav : fallback.nav,
    locations: Array.isArray(value.locations) ? value.locations : fallback.locations,
    prices: {
      from: value.prices?.from ?? fallback.prices.from,
      unit: value.prices?.unit ?? fallback.prices.unit,
      groups: Array.isArray(value.prices?.groups) ? value.prices.groups : fallback.prices.groups,
    },
    gear: Array.isArray(value.gear) ? value.gear : fallback.gear,
    comfort: Array.isArray(value.comfort) ? value.comfort : fallback.comfort,
    projects: Array.isArray(value.projects) ? value.projects : fallback.projects,
    collab: Array.isArray(value.collab) ? value.collab : fallback.collab,
    faq: Array.isArray(value.faq) ? value.faq : fallback.faq,
    route: Array.isArray(value.route) ? value.route : fallback.route,
  };
}

export function live<T extends { on?: boolean }>(items: T[]) {
  return items.filter((item) => item.on !== false);
}
