import { supabaseAdmin } from "@/lib/supabase";

const TYPES = new Set(["pageview", "tour_click"]);

export function parseDevice(ua) {
  if (!ua) return "Bilinmiyor";
  if (/iPad|Tablet/i.test(ua)) return "Tablet";
  if (/Mobi|Android|iPhone/i.test(ua)) return "Mobil";
  return "Masaüstü";
}

export function parseReferrerHost(ref) {
  if (!ref) return "Doğrudan";
  try {
    const host = new URL(ref).hostname.replace(/^www\./, "");
    return host || "Doğrudan";
  } catch {
    return "Doğrudan";
  }
}

export async function trackEvent(type, opts = {}) {
  if (!TYPES.has(type)) return;
  const { tourName, country, city, device, referrer } = opts;
  await supabaseAdmin().from("analytics_events").insert({
    type,
    tour_name: tourName ? String(tourName).slice(0, 200) : null,
    country: country || null,
    city: city || null,
    device: device || null,
    referrer: referrer || null
  });
}

function daysAgoISO(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

function topFrom(rows, field, fallback) {
  const counts = new Map();
  for (const row of rows || []) {
    const name = row[field] || fallback;
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
}

export async function getStats() {
  const supabase = supabaseAdmin();

  const [totalPv, pv7d, pv30d, clicksTotalRes, clicks30dRes, pv30dRes] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview"),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview").gte("created_at", daysAgoISO(7)),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview").gte("created_at", daysAgoISO(30)),
    supabase.from("analytics_events").select("tour_name").eq("type", "tour_click").limit(10000),
    supabase.from("analytics_events").select("tour_name").eq("type", "tour_click").gte("created_at", daysAgoISO(30)).limit(5000),
    supabase
      .from("analytics_events")
      .select("created_at, country, city, device, referrer")
      .eq("type", "pageview")
      .gte("created_at", daysAgoISO(30))
      .limit(10000)
  ]);

  const pv30dRows = pv30dRes.data || [];

  const daily = [];
  const dayCounts = new Map();
  for (const row of pv30dRows) {
    const key = dateKey(new Date(row.created_at));
    dayCounts.set(key, (dayCounts.get(key) || 0) + 1);
  }
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = dateKey(d);
    daily.push({ date: key, count: dayCounts.get(key) || 0 });
  }

  return {
    pageviewsTotal: totalPv.count || 0,
    pageviews7d: pv7d.count || 0,
    pageviews30d: pv30d.count || 0,
    tourClicksTotal: (clicksTotalRes.data || []).length,
    tourClicks30d: (clicks30dRes.data || []).length,
    topToursAllTime: topFrom(clicksTotalRes.data, "tour_name", "(bilinmiyor)").slice(0, 20),
    topTours30d: topFrom(clicks30dRes.data, "tour_name", "(bilinmiyor)").slice(0, 20),
    dailyPageviews: daily,
    topCountries: topFrom(pv30dRows, "country", "Bilinmiyor").slice(0, 10),
    topCities: topFrom(pv30dRows, "city", "Bilinmiyor").slice(0, 10),
    deviceBreakdown: topFrom(pv30dRows, "device", "Bilinmiyor"),
    topReferrers: topFrom(pv30dRows, "referrer", "Doğrudan").slice(0, 10)
  };
}
