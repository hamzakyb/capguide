import { NextResponse } from "next/server";
import sharp from "sharp";
import { isAuthed } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "assets";
const MAX_WIDTH = 1600;

export async function POST(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return NextResponse.json({ ok: false, error: "Dosya bulunamadı." }, { status: 400 });
  }
  if (!file.type?.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "Sadece görsel dosyaları yüklenebilir." }, { status: 400 });
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase().replace(/\.[a-z0-9]+$/, "");
  const unique = Date.now() + "-" + safeName + ".webp";
  const original = Buffer.from(await file.arrayBuffer());

  const buf = await sharp(original)
    .rotate()
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const supabase = supabaseAdmin();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(unique, buf, { contentType: "image/webp", upsert: false });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(unique);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
