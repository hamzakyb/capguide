import { NextResponse } from "next/server";
import { trackEvent, parseDevice, parseReferrerHost } from "@/lib/analytics";

export async function POST(req) {
  const { type, tourName, referrer } = await req.json().catch(() => ({}));
  try {
    const h = req.headers;
    const country = h.get("x-vercel-ip-country") || null;
    const city = h.get("x-vercel-ip-city") ? decodeURIComponent(h.get("x-vercel-ip-city")) : null;
    const device = parseDevice(h.get("user-agent"));
    await trackEvent(type, {
      tourName,
      country,
      city,
      device,
      referrer: parseReferrerHost(referrer)
    });
  } catch {
    // analytics is best-effort; never break the site for the visitor
  }
  return NextResponse.json({ ok: true });
}
