import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LeadInput } from "./leads";

export function adminClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function insertLead(client: SupabaseClient, lead: LeadInput) {
  const row = {
    kind: lead.kind,
    name: lead.name,
    phone: lead.phone || null,
    telegram: lead.telegram || null,
    location: lead.location || null,
    slot_date: lead.date || null,
    slot_time: lead.time || null,
    topic: lead.topic || null,
    message: lead.message || null,
    page: lead.page || null,
  };
  const first = await client.from("leads").insert(row);
  if (!first.error) return;
  const retry = await client.from("leads").insert({ ...row, location: null, slot_date: null, slot_time: null });
  if (retry.error) throw new Error(first.error.message);
}

export async function blockedSlots(
  client: SupabaseClient,
  location: string,
  date: string,
) {
  const { data, error } = await client
    .from("slot_blocks")
    .select("slot_time")
    .eq("location", location)
    .eq("slot_date", date);
  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => String(row.slot_time)));
}

export async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return false;
  const endpoint = process.env.TELEGRAM_API_URL ?? `https://api.telegram.org/bot${token}/sendMessage`;
  const send = async (chatId: string, body: Record<string, unknown>) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, disable_web_page_preview: true, ...body }),
    });
    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      description?: string;
      parameters?: { migrate_to_chat_id?: number };
    };
    return { response, data };
  };
  const html = await send(chat, { text, parse_mode: "HTML" });
  if (html.response.ok) return true;
  const next = String(html.data.parameters?.migrate_to_chat_id ?? chat);
  const plain = await send(next, { text: text.replace(/<[^>]+>/g, "") });
  if (plain.response.ok) return true;
  console.error("telegram", plain.response.status, plain.data.description ?? "");
  return false;
}
