import { supabaseAdmin } from "@/lib/supabase";

const TYPES = new Set(["pageview", "tour_click"]);

export async function trackEvent(type, tourName) {
  if (!TYPES.has(type)) return;
  await supabaseAdmin()
    .from("analytics_events")
    .insert({ type, tour_name: tourName ? String(tourName).slice(0, 200) : null });
}

function daysAgoISO(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
}

export async function getStats() {
  const supabase = supabaseAdmin();

  const [totalPv, pv7d, pv30d, clicks30dRes] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview"),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview").gte("created_at", daysAgoISO(7)),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview").gte("created_at", daysAgoISO(30)),
    supabase.from("analytics_events").select("tour_name").eq("type", "tour_click").gte("created_at", daysAgoISO(30)).limit(5000)
  ]);

  const counts = new Map();
  for (const row of clicks30dRes.data || []) {
    const name = row.tour_name || "(bilinmiyor)";
    counts.set(name, (counts.get(name) || 0) + 1);
  }
  const topTours = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return {
    pageviewsTotal: totalPv.count || 0,
    pageviews7d: pv7d.count || 0,
    pageviews30d: pv30d.count || 0,
    tourClicks30d: (clicks30dRes.data || []).length,
    topTours
  };
}
