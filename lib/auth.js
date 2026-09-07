import { cookies } from "next/headers";
import { scryptSync, randomBytes, timingSafeEqual } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";

const COOKIE = "capguide_admin";
const FALLBACK_PASSWORD = process.env.ADMIN_PASSWORD || "capguide2026";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export async function getPasswordHash() {
  const { data } = await supabaseAdmin()
    .from("admin_auth")
    .select("password_hash")
    .eq("id", 1)
    .maybeSingle();
  return data?.password_hash || null;
}

export async function checkPassword(password) {
  if (!password) return false;
  const stored = await getPasswordHash();
  if (stored) return verifyPassword(password, stored);
  return password === FALLBACK_PASSWORD;
}

export async function setPassword(newPassword) {
  const password_hash = hashPassword(newPassword);
  const { error } = await supabaseAdmin()
    .from("admin_auth")
    .upsert({ id: 1, password_hash, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);
}

export async function isAuthed() {
  const c = await cookies();
  return c.get(COOKIE)?.value === "ok";
}

export async function setAuthed(res) {
  res.cookies.set(COOKIE, "ok", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 });
  return res;
}

export async function clearAuthed(res) {
  res.cookies.set(COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return res;
}
