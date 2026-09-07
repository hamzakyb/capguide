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

function dateKey(d) {
  return d.toISOString().slice(0, 10);
}

export async function getStats() {
  const supabase = supabaseAdmin();

  const [totalPv, pv7d, pv30d, clicksTotalRes, clicks30dRes, pv14dRes] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview"),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview").gte("created_at", daysAgoISO(7)),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "pageview").gte("created_at", daysAgoISO(30)),
    supabase.from("analytics_events").select("tour_name").eq("type", "tour_click").limit(10000),
    supabase.from("analytics_events").select("tour_name").eq("type", "tour_click").gte("created_at", daysAgoISO(30)).limit(5000),
    supabase.from("analytics_events").select("created_at").eq("type", "pageview").gte("created_at", daysAgoISO(14)).limit(20000)
  ]);

  function topFrom(rows) {
    const counts = new Map();
    for (const row of rows || []) {
      const name = row.tour_name || "(bilinmiyor)";
      counts.set(name, (counts.get(name) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name, count]) => ({ name, count }));
  }

  const daily = [];
  const dayCounts = new Map();
  for (const row of pv14dRes.data || []) {
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
    topToursAllTime: topFrom(clicksTotalRes.data).slice(0, 20),
    topTours30d: topFrom(clicks30dRes.data).slice(0, 20),
    dailyPageviews: daily
  };
}
