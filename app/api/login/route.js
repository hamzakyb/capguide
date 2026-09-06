import { NextResponse } from "next/server";
import { DEFAULT_PASSWORD, setAuthed, clearAuthed } from "@/lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (password && password === DEFAULT_PASSWORD) {
    return setAuthed(NextResponse.json({ ok: true }));
  }
  return NextResponse.json({ ok: false, error: "Şifre hatalı." }, { status: 401 });
}

export async function DELETE() {
  return clearAuthed(NextResponse.json({ ok: true }));
}
