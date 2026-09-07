import { NextResponse } from "next/server";
import { trackEvent } from "@/lib/analytics";

export async function POST(req) {
  const { type, tourName } = await req.json().catch(() => ({}));
  try {
    await trackEvent(type, tourName);
  } catch {
    // analytics is best-effort; never break the site for the visitor
  }
  return NextResponse.json({ ok: true });
}
