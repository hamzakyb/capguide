import { supabaseAdmin } from "@/lib/supabase";

const DEFAULTS = {
  settings: {
    whatsapp: "905391399131",
    email: "info@capguidetravel.com",
    heroTitleTop: "DISCOVER",
    heroTitleBottom: "CAPPADOCIA",
    heroSub: "Tours • Adventures • Experiences",
    heroImg: "/assets/img/hero.jpg",
    aboutImg: "/assets/img/about.jpg",
    defaultMsg: "Hello, I would like to get information about your Cappadocia tours and activities.",
    logoImg: "",
    faviconImg: ""
  },
  tours: [],
  featured: []
};

function normalize(data) {
  return {
    settings: { ...DEFAULTS.settings, ...(data?.settings || {}) },
    tours: Array.isArray(data?.tours) ? data.tours : [],
    featured: Array.isArray(data?.featured) ? data.featured : []
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
