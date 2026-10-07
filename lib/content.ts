export const studio = {
  name: "BYKA",
  line: "Беларусы пра беларусаў",
  city: "Минск",
  address: "ул. Чернышевского, 10а",
  room: "каб. 504",
  district: "Первомайский район",
  lat: 53.9283796,
  lon: 27.6005282,
  telegram: "https://t.me/byka_kropka_by",
  telegramHandle: "@byka_kropka_by",
  instagram: "https://www.instagram.com/bykamedia/",
  youtube: "https://www.youtube.com/@bykakropkaby",
  altcoin: "https://www.youtube.com/@altcoinby",
  hours: "11:00–19:00, слот на час",
} as const;

export const nav = [
  { href: "/", label: "Главная" },
  { href: "/prices", label: "Стоимость" },
  { href: "/studio", label: "О студии" },
  { href: "/projects", label: "Проекты" },
  { href: "/collab", label: "Сотрудничество" },
  { href: "/contacts", label: "Контакты" },
] as const;

export const slotTimes = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;

export type LocationId = string;

export const locations: {
  id: LocationId;
  index: string;
  name: string;
  guests: string;
  text: string;
  cameras: string;
}[] = [
  {
    id: "razgovor",
    index: "01",
    name: "Разговор",
    guests: "2 человека в кадре",
    text: "Два кресла, фронтальная камера и боковой план. Для интервью, где важны лица, а не стол.",
    cameras: "2 × Sony FX30",
  },
  {
    id: "stol",
    index: "02",
    name: "Стол",
    guests: "до 4 человек",
    text: "Общий стол, экран с логотипом выпуска и телесуфлёр, если нужен текст перед глазами.",
    cameras: "до 3 × Sony FX30",
  },
  {
    id: "noch",
    index: "03",
    name: "Ночь",
    guests: "1–2 человека",
    text: "Тёмный ключ и боковой ракурс. Amaran 300c держит лицо, фон уходит в чёрное.",
    cameras: "2 × Sony FX30",
  },
];

export type LeadKind =
  | "booking"
  | "ads"
  | "field"
  | "rental"
  | "guest"
  | "account"
  | "partnership";

export const leadKindLabel: Record<LeadKind, string> = {
  booking: "Бронь студии",
  ads: "Реклама на каналах",
  field: "Выездная съёмка",
  rental: "Аренда оборудования",
  guest: "Стать гостем",
  account: "Ведение аккаунта",
  partnership: "Партнёрство",
};

export const prices = {
  from: "300 BYN",
  unit: "час записи на 3 камеры",
  groups: [
    {
      title: "Запись и эфир",
      rows: [
        ["Запись на 3 камеры", "час", "300"],
        ["Дополнительная 4-я камера", "съёмка", "200"],
        ["Трансляция, 1 камера", "час", "300"],
        ["Трансляция, 3 камеры", "час", "500"],
        ["Выезд", "сверх цены съёмки", "от 300"],
      ],
    },
    {
      title: "Монтаж",
      rows: [
        ["Черновой монтаж, первый час материала", "час", "500"],
        ["Каждый следующий час", "час", "300"],
        ["Нарезка из подкаста", "ролик", "30"],
        ["Reels с субтитрами", "ролик", "60"],
        ["Reels с анимацией и вставками", "ролик", "90"],
        ["Обложка YouTube", "макет", "50"],
      ],
    },
  ],
} as const;

export const gear = [
  {
    kicker: "Камеры",
    title: "Sony FX30",
    text: "Многокамерная запись: основной фронтальный план и боковой. Переключение между ракурсами уже на монтаже, без второго дубля.",
  },
  {
    kicker: "Микрофоны",
    title: "RODE PodMic",
    text: "Подкастовые микрофоны на стойках. Комната заглушена, голос не упирается в стены кабинета.",
  },
  {
    kicker: "Свет",
    title: "Amaran 300c",
    text: "Студийный свет с цветом. На «Ночи» это жёсткий ключ, на «Разговоре» — ровный свет на оба лица.",
  },
  {
    kicker: "Кадр",
    title: "Экран и суфлёр",
    text: "На сетапе «Стол» выводим логотип выпуска на экран. Телесуфлёр ставим, если ведёте по тексту.",
  },
];

export const comfort = [
  "Зона отдыха в том же кабинете: не сидеть в коридоре между дублями.",
  "Чай и кофе. Свою еду можно — стол для этого есть.",
  "Шумоизоляция. За окном Чернышевского, в кадре её не слышно.",
  "Приезжайте за 15 минут. Парковка у здания, центральный вход, 5 этаж, кабинет 504.",
];

export type ProjectGenre = "business" | "craft" | "personal" | "crypto";

export const genreLabel: Record<ProjectGenre, string> = {
  business: "Подкаст для бизнеса",
  craft: "Подкаст творчества",
  personal: "Индивидуальная запись",
  crypto: "ALTCOIN BUY",
};

export const projects: {
  youtubeId: string;
  title: string;
  genre: ProjectGenre;
  channel: "BYKA" | "ALTCOIN BUY";
}[] = [
  {
    youtubeId: "zXcgxMvdmqU",
    title: "Жёсткие кейсы пригона авто в Беларусь",
    genre: "business",
    channel: "BYKA",
  },
  {
    youtubeId: "mOIkEeEoMDM",
    title: "Дома за 15$ в Беларуси. Логойский район",
    genre: "business",
    channel: "BYKA",
  },
  {
    youtubeId: "u4igF5azcEM",
    title: "Как купить дом в Беларуси за 45 BYN",
    genre: "business",
    channel: "BYKA",
  },
  {
    youtubeId: "L_KuvVH091I",
    title: "Купить или вырастить? Затраты на огород",
    genre: "business",
    channel: "BYKA",
  },
  {
    youtubeId: "QMDyWtYOgUU",
    title: "ID-карта или старый паспорт",
    genre: "personal",
    channel: "BYKA",
  },
  {
    youtubeId: "jo1-ln1kiBg",
    title: "Как запустить IT-стартап? Зарплата в крипте",
    genre: "crypto",
    channel: "ALTCOIN BUY",
  },
];

export const collab = [
  {
    kind: "ads" as const,
    index: "01",
    title: "Реклама на наших каналах",
    text: "Интеграция в выпуск BYKA или ALTCOIN BUY. Говорим, что это реклама, и не прячем её в середине без пометки.",
  },
  {
    kind: "field" as const,
    index: "02",
    title: "Выездная съёмка",
    text: "Тот же комплект камер и звука, только у вас. Выезд считается отдельно, от 300 BYN сверх смены.",
  },
  {
    kind: "rental" as const,
    index: "03",
    title: "Аренда оборудования",
    text: "FX30, PodMic, Amaran — если снимаете своей командой. Список и даты фиксируем в заявке.",
  },
  {
    kind: "guest" as const,
    index: "04",
    title: "Стать нашим гостем",
    text: "Есть история про Беларусь, бизнес или деньги — напишите, о чём выпуск. Мы не берём всех подряд.",
  },
  {
    kind: "account" as const,
    index: "05",
    title: "Помощь с аккаунтом",
    text: "Обложки, нарезки, регулярный выход. Ведём YouTube так же, как свой канал, а не «пакет SMM».",
  },
];

export const faq = [
  {
    q: "За сколько приходить?",
    a: "За 15 минут. Этого хватает на чай, петличку не надеваем — садимся к PodMic и проверяем уровень.",
  },
  {
    q: "Можно со своей едой?",
    a: "Да. В зоне отдыха есть стол. В кадр еду не ставим, если это не тема выпуска.",
  },
  {
    q: "Сколько людей в кадре?",
    a: "«Разговор» и «Ночь» — до двух. «Стол» — до четырёх. Больше — отдельный сетап, напишите в заявке.",
  },
  {
    q: "Это сразу бронь или запрос?",
    a: "Запрос. Слот в календаре показывает, что время ещё не занято. Подтверждаем ответом в Telegram.",
  },
  {
    q: "Можно свой логотип в кадре?",
    a: "Да, на сетапе «Стол» выводим его на экран. Пришлите файл вместе с заявкой.",
  },
];

export const routeSteps = [
  "Метро «Академия наук», дальше пешком около 10 минут, это 700–900 метров.",
  "Трамваи 1, 5, 6, 11 до остановки «Чернышевского».",
  "Автобусы и троллейбусы до «Якуба Коласа» или «Калинина».",
  "На машине — парковка у дома. Центральный вход, 5 этаж, кабинет 504.",
];

export function locationName(id: string | undefined) {
  return locations.find((item) => item.id === id)?.name ?? "";
}
