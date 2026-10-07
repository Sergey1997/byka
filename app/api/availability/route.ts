import { NextResponse } from "next/server";
import { slotTimes } from "@/lib/content";
import { live } from "@/lib/site";
import { getSite } from "@/lib/site-store";
import { adminClient, blockedSlots } from "@/lib/sinks";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const location = url.searchParams.get("location") ?? "";
  const date = url.searchParams.get("date") ?? "";
  const known = live((await getSite()).locations).some((item) => item.id === location);
  if (!known || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "Нужны локация и дата." }, { status: 400 });
  }

  const client = adminClient();
  let taken = new Set<string>();
  let source: "supabase" | "open" = "open";
  if (client) {
    try {
      taken = await blockedSlots(client, location, date);
      source = "supabase";
    } catch {
      source = "open";
    }
  }

  return NextResponse.json({
    ok: true,
    source,
    date,
    location,
    slots: slotTimes.map((time) => ({ time, free: !taken.has(time) })),
  });
}
