import { NextResponse } from "next/server";
import { isAuthed, checkPassword, setPassword } from "@/lib/auth";

export async function PUT(req) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const { currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ ok: false, error: "Yeni şifre en az 6 karakter olmalı." }, { status: 400 });
  }
  if (!(await checkPassword(currentPassword))) {
    return NextResponse.json({ ok: false, error: "Mevcut şifre hatalı." }, { status: 401 });
  }
  await setPassword(newPassword);
  return NextResponse.json({ ok: true });
}