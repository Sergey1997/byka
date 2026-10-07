import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookie = "byka_admin";
const ttl = 60 * 60 * 24 * 14;

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASS || "den";
}

function digest(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function same(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export function adminUser() {
  return process.env.ADMIN_USER || "den";
}

export function adminPass() {
  return process.env.ADMIN_PASS || "den";
}

export function checkAdmin(user: string, pass: string) {
  return same(user, adminUser()) && same(pass, adminPass());
}

export function adminCookie() {
  const exp = Date.now() + ttl * 1000;
  return { name: cookie, value: `${exp}.${digest(String(exp))}`, maxAge: ttl };
}

export async function isAdmin() {
  const raw = (await cookies()).get(cookie)?.value;
  if (!raw) return false;
  const [exp, mac] = raw.split(".");
  if (!exp || !mac || !same(mac, digest(exp))) return false;
  return Number(exp) > Date.now();
}

export async function requireAdmin() {
  if (!(await isAdmin())) {
    const error = new Error("Нужен вход.");
    (error as Error & { status: number }).status = 401;
    throw error;
  }
}
