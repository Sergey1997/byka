import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { normalizeSite } from "@/lib/site";
import { getSite, saveSite } from "@/lib/site-store";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ ok: true, site: await getSite() });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const site = await saveSite(normalizeSite(body.site ?? body));
    return NextResponse.json({ ok: true, site });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status });
  }
}
