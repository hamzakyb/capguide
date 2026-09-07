import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getStats } from "@/lib/analytics";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  try {
    const stats = await getStats();
    return NextResponse.json({ ok: true, stats });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
