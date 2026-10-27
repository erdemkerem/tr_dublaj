import { NextRequest, NextResponse } from "next/server";
import { verifyAdminKey } from "@/lib/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const key = String(body.key || "");

    if (!verifyAdminKey(key)) {
      return NextResponse.json(
        { ok: false, error: "Yönetici anahtarı hatalı. Bu panel sadece site sahibine açıktır." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Yönetici girişi doğrulandı. Yama Yönetim Paneli açıldı.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Doğrulama hatası." },
      { status: 500 }
    );
  }
}
