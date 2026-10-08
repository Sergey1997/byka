import { NextResponse } from "next/server";
import { takeBooking } from "@/lib/book";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") ?? "local").split(",")[0]?.trim() || "local";
  const type = request.headers.get("content-type") ?? "";
  let body: unknown;
  try {
    body = type.includes("application/json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return NextResponse.json({ ok: false, error: "Не разобрали заявку." }, { status: 400 });
  }

  const result = await takeBooking(body, ip);
  return NextResponse.json({ ok: result.ok, error: result.error }, { status: result.status });
}
