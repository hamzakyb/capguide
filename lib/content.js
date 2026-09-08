import { supabaseAdmin } from "@/lib/supabase";
import { LANG_CODES, DEFAULT_LANG } from "@/lib/i18n";

const DEFAULT_SETTINGS_I18N = {
  heroTitleTop: "DISCOVER",
  heroTitleBottom: "CAPPADOCIA",
  heroSub: "Tours • Adventures • Experiences",
  defaultMsg: "Hello, I would like to get information about your Cappadocia tours and activities.",
  seoTitle: "Capguide Travel — Discover Cappadocia",
  seoDescription: "Capguide Travel — Tours, adventures, experiences and workshops in Cappadocia. Plan your experience on WhatsApp."
};

const DEFAULTS = {
  settings: {
    whatsapp: "905391399131",
    email: "info@capguidetravel.com",
    heroImg: "/assets/img/hero.jpg",
    aboutImg: "/assets/img/about.jpg",
    logoImg: "",
    faviconImg: "",
    i18n: Object.fromEntries(LANG_CODES.map((l) => [l, { ...DEFAULT_SETTINGS_I18N }]))
  },
  tours: [],
  featured: []
};

function fillLangs(i18n, fields) {
  const src = i18n || {};
  const base = src[DEFAULT_LANG] || fields;
  const out = {};
  for (const lang of LANG_CODES) {
    out[lang] = { ...base, ...(src[lang] || {}) };
  }
  return out;
}

function normalizeTour(t, idx) {
  const legacy = { name: t.name || "", desc: t.desc || "", wa: t.wa || "" };
  return {
    id: t.id || `tour-${idx}`,
    cat: t.cat || "tours",
    badge: t.badge || "",
    price: t.price || "",
    time: t.time || "",
    img: t.img || "",
    i18n: fillLangs(t.i18n, legacy)
  };
}

function normalizeFeatured(f, idx) {
  const legacy = { title: f.title || "", sub: f.sub || "" };
  return {
    tourId: f.tourId || null,
    img: f.img || "",
    i18n: fillLangs(f.i18n, legacy)
  };
}

function normalize(data) {
  const s = data?.settings || {};
  return {
    settings: {
      whatsapp: s.whatsapp ?? DEFAULTS.settings.whatsapp,
      email: s.email ?? DEFAULTS.settings.email,
      heroImg: s.heroImg ?? DEFAULTS.settings.heroImg,
      aboutImg: s.aboutImg ?? DEFAULTS.settings.aboutImg,
      logoImg: s.logoImg ?? "",
      faviconImg: s.faviconImg ?? "",
      i18n: fillLangs(s.i18n, DEFAULT_SETTINGS_I18N)
    },
    tours: Array.isArray(data?.tours) ? data.tours.map(normalizeTour) : [],
    featured: Array.isArray(data?.featured) ? data.featured.map(normalizeFeatured) : []
  };
}

export async function readContent() {
  const { data, error } = await supabaseAdmin()
    .from("content")
    .select("data")
    .eq("id", 1)
    .maybeSingle();
  if (error || !data) {
    return structuredClone(DEFAULTS);
  }
  return normalize(data.data);
}

export async function writeContent(input) {
  const safe = normalize(input);
  const { error } = await supabaseAdmin()
    .from("content")
    .upsert({ id: 1, data: safe, updated_at: new Date().toISOString() });
  if (error) {
    throw new Error(error.message);
  }
  return safe;
}

export function defaultContent() {
  return structuredClone(DEFAULTS);
}
