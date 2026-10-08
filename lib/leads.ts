import {
  leadKindLabel,
  locations,
  slotTimes,
  type LeadKind,
  type LocationId,
} from "./content";

export type LeadInput = {
  kind: LeadKind;
  name: string;
  phone: string;
  telegram: string;
  location: LocationId | "";
  date: string;
  time: string;
  topic: string;
  message: string;
  page: string;
  company: string;
};

export type LeadResult =
  | { ok: true; stored: boolean; telegram: boolean; ignored?: boolean }
  | { ok: false; error: string; status: number };

const kinds = new Set<LeadKind>([
  "booking",
  "ads",
  "field",
  "rental",
  "guest",
  "account",
  "partnership",
]);

const times = new Set<string>(slotTimes);

export function clean(value: unknown, max: number) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function parseLead(body: unknown): { lead: LeadInput } | { error: string } {
  if (!body || typeof body !== "object") return { error: "Пустая заявка." };
  const raw = body as Record<string, unknown>;
  const kind = clean(raw.kind, 32) as LeadKind;
  if (!kinds.has(kind)) return { error: "Не поняли тип заявки." };

  const name = clean(raw.name, 80);
  if (name.length < 2) return { error: "Напишите имя." };

  const phone = clean(raw.phone, 32);
  const telegram = clean(raw.telegram, 64);
  if (!phone && !telegram) {
    return { error: "Нужен телефон или Telegram, иначе мы не ответим." };
  }
  if (phone && !/^[+\d][\d\s()-]{5,}$/.test(phone)) {
    return { error: "Телефон выглядит неполным." };
  }

  const location = clean(raw.location, 32);
  if (location && !/^[a-z0-9-]{1,32}$/.test(location)) {
    return { error: "Такой локации нет." };
  }

  const date = clean(raw.date, 10);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { error: "Дата в формате ГГГГ-ММ-ДД." };
  }

  const time = clean(raw.time, 5);
  if (time && !times.has(time)) return { error: "Это время мы не ставим." };

  return {
    lead: {
      kind,
      name,
      phone,
      telegram,
      location: (location || "") as LocationId | "",
      date,
      time,
      topic: clean(raw.topic, 120),
      message: clean(raw.message, 2000),
      page: clean(raw.page, 80),
      company: clean(raw.company, 80) || clean(raw.hp_field, 80),
    },
  };
}

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function leadText(lead: LeadInput) {
  const place = locations.find((item) => item.id === lead.location)?.name || lead.location;
  const slot = [lead.date, lead.time].filter(Boolean).join(" · ");
  const lines = [
    `🎙 <b>BYKA · ${escapeHtml(leadKindLabel[lead.kind])}</b>`,
    "",
    `👤 <b>${escapeHtml(lead.name)}</b>`,
    lead.phone ? `📞 ${escapeHtml(lead.phone)}` : "",
    lead.telegram ? `💬 ${escapeHtml(lead.telegram)}` : "",
    place ? `📍 ${escapeHtml(place)}` : "",
    slot ? `🗓 ${escapeHtml(slot)}` : "",
    lead.topic ? `📝 ${escapeHtml(lead.topic)}` : "",
    lead.message ? `\n${escapeHtml(lead.message)}` : "",
  ];
  return lines.filter((line) => line !== "").join("\n");
}

type Insert = (lead: LeadInput) => Promise<void>;
type Notify = (text: string) => Promise<boolean>;

export async function deliverLead(
  lead: LeadInput,
  insert: Insert | null,
  notify: Notify | null,
): Promise<LeadResult> {
  if (lead.company) return { ok: true, stored: false, telegram: false, ignored: true };

  const text = leadText(lead);
  const [stored, telegram] = await Promise.all([
    insert
      ? insert(lead).then(() => true).catch(() => false)
      : Promise.resolve(false),
    notify ? notify(text).then(Boolean).catch(() => false) : Promise.resolve(false),
  ]);

  if (!stored && !telegram) {
    return {
      ok: false,
      status: 503,
      error: "Не получилось отправить. Попробуйте ещё раз.",
    };
  }

  return { ok: true, stored, telegram };
}

const hits = new Map<string, number[]>();

export function allowRequest(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < 60_000);
  if (recent.length >= 12) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}
