import { cookies } from "next/headers";

const COOKIE = "capguide_admin";
export const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "capguide2026";

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
