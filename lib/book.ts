import { allowRequest, deliverLead, parseLead } from "./leads";
import { adminClient, insertLead, sendTelegram } from "./sinks";

export async function takeBooking(body: unknown, ip: string) {
  if (!allowRequest(ip)) {
    return {
      ok: false,
      status: 429,
      error: "Слишком много заявок подряд. Подождите минуту.",
    };
  }

  const parsed = parseLead(body);
  if ("error" in parsed) return { ok: false, status: 400, error: parsed.error };

  const client = adminClient();
  const hasTelegram = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  if (!client || !hasTelegram) {
    console.error("book sinks", {
      supabase: Boolean(client),
      telegram: hasTelegram,
    });
  }

  const result = await deliverLead(
    parsed.lead,
    client ? (lead) => insertLead(client, lead) : null,
    hasTelegram ? sendTelegram : null,
  );

  if (!result.ok) return { ok: false, status: result.status, error: result.error };
  if (result.ignored) return { ok: true, status: 200 };
  if (!result.telegram && !result.stored) {
    return {
      ok: false,
      status: 503,
      error: "Не получилось отправить. Попробуйте ещё раз.",
    };
  }
  return { ok: true, status: 200 };
}
