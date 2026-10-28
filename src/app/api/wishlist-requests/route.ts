import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gameRequests } from "@/db/schema";
import { ensureDatabaseSeeded, getAllGameRequests } from "@/db/ensure-seed";
import { isAdminRequest } from "@/lib/admin";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const items = await getAllGameRequests();
    return NextResponse.json({ requests: items });
  } catch (error) {
    console.error("GET /api/wishlist-requests error:", error);
    return NextResponse.json(
      { error: "İstek listesi yüklenemedi." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();

    const gameTitle = String(body.gameTitle || "").trim();
    const requesterName = String(body.requesterName || "Anonim Oyuncu").trim();
    const requesterProvider = String(body.requesterProvider || "").trim();
    const note = String(
      body.note || "Bu oyun için AI Türkçe dublaj yaması bekliyoruz!"
    ).trim();

    if (!gameTitle) {
      return NextResponse.json(
        { error: "Lütfen dublaj yapılmasını istediğiniz oyun adını yazın." },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(gameRequests)
      .values({
        gameTitle,
        requesterName,
        requesterProvider,
        note,
        aiDifficulty: "Değerlendiriliyor • AI Ses Analizi",
        status: "Oylanıyor",
        votes: 1,
      })
      .returning();

    return NextResponse.json({ request: created });
  } catch (error) {
    console.error("POST /api/wishlist-requests error:", error);
    return NextResponse.json(
      { error: "İstek kaydedilirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
    }

    const [updated] = await db
      .update(gameRequests)
      .set({
        votes: sql`${gameRequests.votes} + 1`,
      })
      .where(eq(gameRequests.id, id))
      .returning();

    return NextResponse.json({ request: updated });
  } catch (error) {
    console.error("PATCH /api/wishlist-requests error:", error);
    return NextResponse.json({ error: "Oy verilemedi." }, { status: 500 });
  }
}

/** Sadece site sahibi: istek silme (id) veya durum/difficulty güncelleme */
export async function DELETE(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Yetkisiz." },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
    }

    await db.delete(gameRequests).where(eq(gameRequests.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/wishlist-requests error:", error);
    return NextResponse.json({ error: "İstek silinemedi." }, { status: 500 });
  }
}
