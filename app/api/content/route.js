import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/content";
import { isAuthed } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(readContent());
}

export async function PUT(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.tours)) {
    return NextResponse.json({ ok: false, error: "Geçersiz veri." }, { status: 400 });
  }
  const saved = writeContent(body);
  return NextResponse.json({ ok: true, data: saved });
}
