import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, users } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";
import { eq, sql } from "drizzle-orm";

/**
 * Gerçek indirme linklerini (Google Drive / GitHub Releases / MediaFire / Mega)
 * SADECE giriş yapmış üyelere ve reklam adımı tamamlandıktan sonra döndürür.
 * Bu sayede linkler sayfa kaynağında veya genel API'de hiçbir şekilde görünmez.
 */
export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();

    const productId = Number(body.productId);
    const email = String(body.email || "").trim().toLowerCase();
    const adCompleted = Boolean(body.adCompleted);

    if (!email) {
      return NextResponse.json(
        { error: "İndirme linklerini görmek için önce üye girişi yapmalısınız." },
        { status: 401 }
      );
    }

    const member = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (member.length === 0) {
      return NextResponse.json(
        { error: "Üyelik bulunamadı. Lütfen Google, Yandex veya Proton ile giriş yapın." },
        { status: 401 }
      );
    }

    if (!adCompleted) {
      return NextResponse.json(
        { error: "İndirme linkleri reklam adımı tamamlandıktan sonra açılır." },
        { status: 403 }
      );
    }

    const found = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (found.length === 0) {
      return NextResponse.json({ error: "Yama bulunamadı." }, { status: 404 });
    }

    const product = found[0];

    if (product.status !== "ready") {
      return NextResponse.json(
        { error: "Bu yama henüz hazır değil, istek listesinden takip edebilirsiniz." },
        { status: 403 }
      );
    }

    await db
      .update(products)
      .set({ downloadsCount: sql`${products.downloadsCount} + 1` })
      .where(eq(products.id, product.id));

    await db
      .update(users)
      .set({ downloadsUnlocked: sql`${users.downloadsUnlocked} + 1` })
      .where(eq(users.id, member[0].id));

    return NextResponse.json({
      gameTitle: product.gameTitle,
      version: product.version,
      fileSize: product.fileSize,
      adShortlinkUrl: product.adShortlinkUrl,
      hostMirrors: product.hostMirrors,
    });
  } catch (error) {
    console.error("POST /api/download error:", error);
    return NextResponse.json(
      { error: "İndirme linkleri alınırken hata oluştu." },
      { status: 500 }
    );
  }
}
