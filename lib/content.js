import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "data", "content.json");

const DEFAULTS = {
  settings: {
    whatsapp: "905391399131",
    email: "info@capguidetravel.com",
    heroTitleTop: "DISCOVER",
    heroTitleBottom: "CAPPADOCIA",
    heroSub: "Tours • Adventures • Experiences",
    heroImg: "/assets/img/hero.jpg",
    aboutImg: "/assets/img/about.jpg",
    defaultMsg: "Hello, I would like to get information about your Cappadocia tours and activities."
  },
  tours: [],
  featured: []
};

export function readContent() {
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    const data = JSON.parse(raw);
    return {
      settings: { ...DEFAULTS.settings, ...(data.settings || {}) },
      tours: Array.isArray(data.tours) ? data.tours : [],
      featured: Array.isArray(data.featured) ? data.featured : []
    };
  } catch (e) {
    return structuredClone(DEFAULTS);
  }
}

export function writeContent(data) {
  const safe = {
    settings: { ...DEFAULTS.settings, ...(data.settings || {}) },
    tours: Array.isArray(data.tours) ? data.tours : [],
    featured: Array.isArray(data.featured) ? data.featured : []
  };
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(safe, null, 2), "utf8");
  return safe;
}

export function defaultContent() {
  return structuredClone(DEFAULTS);
}
