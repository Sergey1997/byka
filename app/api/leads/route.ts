import { NextResponse } from "next/server";
import { allowRequest, deliverLead, parseLead } from "@/lib/leads";
import { adminClient, insertLead, sendTelegram } from "@/lib/sinks";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0]?.trim() || "local";
  if (!allowRequest(ip)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок подряд. Напишите в Telegram." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Не разобрали заявку." }, { status: 400 });
  }

  const parsed = parseLead(body);
  if ("error" in parsed) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }

  const client = adminClient();
  const hasTelegram = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
  const result = await deliverLead(
    parsed.lead,
    client ? (lead) => insertLead(client, lead) : null,
    hasTelegram ? sendTelegram : null,
  );

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    ok: true,
    stored: result.stored,
    telegram: result.telegram,
  });
}
