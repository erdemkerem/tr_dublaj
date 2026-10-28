import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";
import { ensureUserTableColumns } from "@/db/migrate";
import { eq, desc } from "drizzle-orm";
import { isAdminRequest } from "@/lib/admin";
import {
  sendMail,
  generateVerificationCode,
  membershipCodeEmailHtml,
} from "@/lib/mailer";

const CODE_TTL_MINUTES = 15;

type UserRow = typeof users.$inferSelect;

const ALLOWED_GENDERS = ["erkek", "kadin", "belirtmek_istemiyor"] as const;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/** Doğrulama kodu gizli: üyeye geri gönderilmez. */
function publicUser(u: UserRow) {
  const { verificationCode, verificationExpiresAt, ...rest } = u;
  void verificationCode;
  void verificationExpiresAt;
  return rest;
}

/** Profil bilgisi getir / admin tüm üyeleri listeler */
export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);

    // Yalnızca site sahibi: /api/auth?admin=1 + x-admin-key
    if (searchParams.get("admin")) {
      if (!isAdminRequest(request)) {
        return NextResponse.json(
          { error: "Yetkisiz. Üye listesi sadece site sahibine açıktır." },
          { status: 401 }
        );
      }
      const list = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(300);
      return NextResponse.json({ users: list.map(publicUser) });
    }

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
      return NextResponse.json({ error: "Üyelik bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ user: publicUser(found[0]) });
  } catch (error) {
    console.error("GET /api/auth error:", error);
    return NextResponse.json({ error: "Profil alınamadı." }, { status: 500 });
  }
}

/**
 * Üyelik akışı (tek profesyonel üyelik, ücretsiz):
 *  action "register" → e-postaya 6 haneli onay kodu gider
 *  action "verify"   → kod doğruysa üyelik aktif (indirme linkleri açılır)
 */
export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    await ensureUserTableColumns();
    const body = await request.json();
    const action = String(body.action || "register");

    const email = String(body.email || "").trim().toLowerCase();
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi yazman gerekir." },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const existingUser = existing.length ? existing[0] : null;

    if (action === "register") {
      // Yeni üyelikte sözleşme onayı zorunlu
      if (!existingUser && !body.termsAccepted) {
        return NextResponse.json(
          {
            error:
              "Üyelik için Üyelik Sözleşmesi ve KVKK Aydınlatma Metni'ni onaylaman gerekir.",
            needsConsent: true,
          },
          { status: 403 }
        );
      }

      const name =
        String(body.name || "").trim() ||
        existingUser?.name ||
        email.split("@")[0].replace(/[._-]/g, " ");

      const birthDate =
        String(body.birthDate || "").trim() || existingUser?.birthDate || null;
      const rawGender = String(body.gender || "").trim();
      const gender =
        (ALLOWED_GENDERS as readonly string[]).includes(rawGender)
          ? rawGender
          : existingUser?.gender || null;

      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

      if (existingUser) {
        await db
          .update(users)
          .set({
            name,
            birthDate,
            gender,
            verificationCode: code,
            verificationExpiresAt: expiresAt,
          })
          .where(eq(users.email, email));
      } else {
        await db.insert(users).values({
          name,
          email,
          provider: "email",
          gamerTag:
            name.toLowerCase().replace(/[^a-z0-9]/g, "") || "oyuncu_tr",
          role: "member",
          isVerified: false,
          verificationCode: code,
          verificationExpiresAt: expiresAt,
          birthDate,
          gender,
          termsAccepted: true,
          termsAcceptedAt: new Date(),
        });
      }

      const mail = await sendMail(
        email,
        "tr_dublaj — Üyelik Onay Kodu",
        membershipCodeEmailHtml(name, code)
      );

      return NextResponse.json({
        ok: true,
        email,
        mailSent: mail.sent,
        // Mail sağlayıcısı bağlanmadıysa codun ekranda gösterilir ki üye takılsın
        fallbackCode: mail.sent ? undefined : code,
        message: mail.sent
          ? "Onay kodu e-postana gönderildi."
          : "Mail sistemi henüz bağlanmadı — kodun ekranda gösteriliyor.",
      });
    }

    if (action === "verify") {
      const code = String(body.code || "").trim();
      if (!existingUser) {
        return NextResponse.json(
          { error: "Bu e-postayla üyelik bulunamadı." },
          { status: 404 }
        );
      }
      const valid =
        existingUser.verificationCode === code &&
        existingUser.verificationExpiresAt &&
        new Date(existingUser.verificationExpiresAt).getTime() > Date.now();

      if (!valid) {
        return NextResponse.json(
          { error: "Kod hatalı veya süresi geçmiş. Yeni kod isteyebilirsin." },
          { status: 400 }
        );
      }

      const [verified] = await db
        .update(users)
        .set({
          isVerified: true,
          verificationCode: null,
          verificationExpiresAt: null,
        })
        .where(eq(users.email, email))
        .returning();

      return NextResponse.json({
        user: publicUser(verified),
        message: `Üyeliğin aktif, hoş geldin ${verified.name}!`,
      });
    }

    return NextResponse.json(
      { error: "Geçersiz işlem." },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/auth error:", error);
    return NextResponse.json(
      { error: "Üyelik işlemi sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}

/** Profil güncelle (isim / oyuncu etiketi / doğum tarihi / cinsiyet) */
export async function PATCH(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    await ensureUserTableColumns();
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "E-posta gerekli." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const n = String(body.name).trim();
      if (!n) {
        return NextResponse.json({ error: "İsim boş olamaz." }, { status: 400 });
      }
      updateData.name = n;
    }
    if (body.gamerTag !== undefined) {
      updateData.gamerTag =
        String(body.gamerTag).trim().replace(/\s+/g, "_") || "oyuncu_tr";
    }
    if (body.birthDate !== undefined) {
      updateData.birthDate = String(body.birthDate).trim() || null;
    }
    if (body.gender !== undefined) {
      const g = String(body.gender).trim();
      updateData.gender =
        (ALLOWED_GENDERS as readonly string[]).includes(g) ? g : null;
    }

    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.email, email))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Üyelik bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({
      user: publicUser(updated),
      message: "Profil bilgilerin güncellendi.",
    });
  } catch (error) {
    console.error("PATCH /api/auth error:", error);
    return NextResponse.json({ error: "Profil güncellenemedi." }, { status: 500 });
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
      return NextResponse.json({ error: "Üyelik bulunamadı." }, { status: 404 });
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
    return NextResponse.json({ error: "Üyelik silinirken hata oluştu." }, { status: 500 });
  }
}
