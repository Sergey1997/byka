import { promises as fs } from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { normalizeSite, type Site } from "./site";
import { adminClient } from "./sinks";

const filePath = path.join(process.cwd(), "data", "site.json");
const paths = ["/", "/prices", "/studio", "/projects", "/collab", "/contacts"] as const;

async function fromSupabase() {
  const client = adminClient();
  if (!client) return null;
  const { data, error } = await client.from("site_content").select("body").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return data.body;
}

async function fromFile() {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch {
    return null;
  }
}

export async function getSite(): Promise<Site> {
  return normalizeSite((await fromSupabase()) ?? (await fromFile()));
}

export async function saveSite(next: Site) {
  const site = normalizeSite(next);
  const client = adminClient();
  let stored = false;
  if (client) {
    const { error } = await client.from("site_content").upsert({ id: 1, body: site, updated_at: new Date().toISOString() });
    if (!error) stored = true;
  }
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(site, null, 2));
    stored = true;
  } catch {
    // Vercel filesystem is read-only; Supabase is enough there.
  }
  if (!stored) throw new Error("Некуда сохранить. Нужен Supabase или запись в data/site.json.");
  for (const href of paths) revalidatePath(href);
  return site;
}
