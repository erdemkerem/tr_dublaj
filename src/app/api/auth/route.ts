import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";
import { eq } from "drizzle-orm";

/** Üyelik için izin verilen sağlayıcılar (GitHub/Discord kaldırıldı). */
const ALLOWED_PROVIDERS = ["google", "yandex", "proton"] as const;

/** Profil bilgisi getir */
export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
    }

    const found = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (found.length === 0) {
      return NextResponse.json(
        { error: "Üyelik bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: found[0] });
  } catch (error) {
    console.error("GET /api/auth error:", error);
    return NextResponse.json({ error: "Profil alınamadı." }, { status: 500 });
  }
}

/** Üye ol / giriş yap — sözleşme onayı zorunlu */
export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();

    const rawProvider = String(body.provider || "google").trim().toLowerCase();
    const provider = (ALLOWED_PROVIDERS as readonly string[]).includes(
      rawProvider
    )
      ? rawProvider
      : "google";

    const email = String(body.email || "").trim().toLowerCase();
    const termsAccepted = Boolean(body.termsAccepted);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi gerekli." },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    // Mevcut üye → tekrar giriş (onay zaten alınmış)
    if (existing.length > 0) {
      return NextResponse.json({
        user: existing[0],
        isNew: false,
        message: `Tekrar hoş geldin ${existing[0].name}!`,
      });
    }

    // YENİ ÜYELİK → sözleşme onayı olmadan kayıt açılmaz
    if (!termsAccepted) {
      return NextResponse.json(
        {
          error:
            "Üyelik oluşturmak için Üyelik Sözleşmesi ve KVKK Aydınlatma Metni'ni onaylamanız gerekir.",
          needsConsent: true,
        },
        { status: 403 }
      );
    }

    const name =
      String(body.name || "").trim() ||
      email.split("@")[0].replace(/[._-]/g, " ");

    const gamerTag =
      String(body.gamerTag || "").trim() ||
      name.toLowerCase().replace(/[^a-z0-9]/g, "") ||
      "oyuncu_tr";

    const [created] = await db
      .insert(users)
      .values({
        name,
        email,
        provider,
        gamerTag,
        role: "member",
        downloadsUnlocked: 0,
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      user: created,
      isNew: true,
      message: `Üyeliğin oluşturuldu, hoş geldin ${created.name}!`,
    });
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json(
      { error: "Üyelik işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

/** Profil güncelle (görünen ad / oyuncu etiketi) */
export async function PATCH(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) {
      const n = String(body.name).trim();
      if (!n) {
        return NextResponse.json(
          { error: "İsim boş olamaz." },
          { status: 400 }
        );
      }
      updateData.name = n;
    }
    if (body.gamerTag !== undefined) {
      updateData.gamerTag =
        String(body.gamerTag).trim().replace(/\s+/g, "_") || "oyuncu_tr";
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.email, email))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Üyelik bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: updated,
      message: "Profil bilgilerin güncellendi.",
    });
  } catch (error) {
    console.error("PATCH /api/auth error:", error);
    return NextResponse.json(
      { error: "Profil güncellenemedi." },
      { status: 500 }
    );
  }
}

/** ÜYELİK İPTALİ — hesabı ve verileri kalıcı siler */
export async function DELETE(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email")?.trim().toLowerCase();
    const confirm = searchParams.get("confirm");

    if (!email) {
      return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
    }

    if (confirm !== "EVET") {
      return NextResponse.json(
        { error: "Silme işlemi için onay gerekli." },
        { status: 400 }
      );
    }

    const found = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (found.length === 0) {
      return NextResponse.json(
        { error: "Üyelik bulunamadı." },
        { status: 404 }
      );
    }

    if (found[0].role === "admin") {
      return NextResponse.json(
        { error: "Yönetici hesabı bu yolla silinemez." },
        { status: 403 }
      );
    }

    await db.delete(users).where(eq(users.email, email));

    return NextResponse.json({
      ok: true,
      message:
        "Üyeliğin kalıcı olarak silindi. Tüm hesap verilerin sistemden kaldırıldı.",
    });
  } catch (error) {
    console.error("DELETE /api/auth error:", error);
    return NextResponse.json(
      { error: "Üyelik silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
