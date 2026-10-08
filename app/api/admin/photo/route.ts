import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { adminClient } from "@/lib/sinks";

const types: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size < 20) {
      return NextResponse.json({ ok: false, error: "Выберите фото." }, { status: 400 });
    }
    if (file.size > 6_000_000) {
      return NextResponse.json({ ok: false, error: "Файл больше 6 МБ." }, { status: 400 });
    }
    const ext = types[file.type];
    if (!ext) return NextResponse.json({ ok: false, error: "Нужен JPG, PNG или WebP." }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;

    const client = adminClient();
    if (client) {
      const { error } = await client.storage.from("site").upload(name, bytes, {
        contentType: file.type,
        upsert: true,
      });
      if (!error) {
        const { data } = client.storage.from("site").getPublicUrl(name);
        if (data.publicUrl) return NextResponse.json({ ok: true, url: data.publicUrl });
      }
    }

    try {
      const folder = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(folder, { recursive: true });
      await fs.writeFile(path.join(folder, name), bytes);
      return NextResponse.json({ ok: true, url: `/uploads/${name}` });
    } catch {
      return NextResponse.json({
        ok: true,
        url: `data:${file.type};base64,${bytes.toString("base64")}`,
      });
    }
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status });
  }
}
