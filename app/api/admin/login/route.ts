import { NextResponse } from "next/server";
import { adminCookie, checkAdmin } from "@/lib/admin";
import { allowRequest } from "@/lib/leads";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!allowRequest(ip)) {
    return NextResponse.json({ ok: false, error: "Подождите минуту." }, { status: 429 });
  }
  const body = (await request.json().catch(() => null)) as { user?: string; pass?: string } | null;
  if (!checkAdmin(String(body?.user ?? ""), String(body?.pass ?? ""))) {
    return NextResponse.json({ ok: false, error: "Неверный логин или пароль." }, { status: 401 });
  }
  const signed = adminCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: signed.name,
    value: signed.value,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: signed.maxAge,
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
