import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendMail, newPatchEmailHtml } from "./mailer";

/**
 * Yeni yama yayınlandığında onaylanmış (e-postası doğrulanmış) tüm üyelere
 * otomatik bildirim maili gönderir. Yayınlama akışında çağrılır.
 */
export async function notifyVerifiedMembersOfNewPatch(
  gameTitle: string,
  slug: string
): Promise<number> {
  try {
    const baseUrl =
      process.env.SITE_URL || "https://tr-dublaj.netlify.app";
    const url = `${baseUrl}/urun/${slug}`;

    const members = await db
      .select()
      .from(users)
      .where(eq(users.isVerified, true))
      .limit(500);

    const active = members.filter((m) => m.email);
    if (active.length === 0) return 0;

    // Sırayla gönder (sağlayıcı limitlerine takılmasın)
    let count = 0;
    for (const member of active) {
      const result = await sendMail(
        member.email,
        `🎮 Yeni Yama Yayınlandı: ${gameTitle} — Türkçe AI Dublaj`,
        newPatchEmailHtml(member.name, gameTitle, url)
      );
      if (result.sent) count++;
    }
    return count;
  } catch (error) {
    console.error("notifyVerifiedMembersOfNewPatch error:", error);
    return 0;
  }
}
