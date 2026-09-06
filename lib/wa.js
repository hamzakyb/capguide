export function waLink(number, message) {
  const num = String(number || "").replace(/\D/g, "");
  return "https://wa.me/" + num + "?text=" + encodeURIComponent(message || "");
}

export const CAT_LABEL = {
  tours: "Cappadocia Tour",
  activities: "Adventure & Activity",
  transfer: "Transfer & Rental",
  experiences: "Experience",
  workshops: "Workshop"
};

export const CAT_HUE = { tours: 18, activities: 28, transfer: 200, experiences: 340, workshops: 42 };
