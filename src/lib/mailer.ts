/**
 * Basit e-posta göndericisi — Resend API kullanır.
 * Netlify ortam değişkenleri:
 *   RESEND_API_KEY  → https://resend.com/api-keys
 *   MAIL_FROM       → ör. "tr_dublaj <onboarding@resend.dev>" (opsiyonel)
 * Anahtar yoksa ileride farklı bir sağlayıcı rahatça bağlanabilir.
 */
export interface MailResult {
  sent: boolean;
  provider: "resend" | "none";
  error?: string;
}

export async function sendMail(
  to: string,
  subject: string,
  html: string
): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[mailer] RESEND_API_KEY ayarlı değil; mail gönderilemedi:",
      to,
      subject
    );
    return { sent: false, provider: "none", error: "not-configured" };
  }

  const from = process.env.MAIL_FROM || "tr_dublaj <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (res.ok) return { sent: true, provider: "resend" };
    const errText = await res.text();
    console.error("[mailer] Resend error:", errText);
    return { sent: false, provider: "resend", error: errText.slice(0, 200) };
  } catch (error) {
    console.error("[mailer] send failed:", error);
    return { sent: false, provider: "resend", error: String(error) };
  }
}

export function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const ACCENT = "#10B981";

export function membershipCodeEmailHtml(name: string, code: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#0B0C10;color:#F8FAFC;padding:32px;border-radius:14px;max-width:520px;margin:auto;border:1px solid #26263a">
    <h2 style="color:${ACCENT};margin-top:0">tr_dublaj — Üyelik Onay Kodu</h2>
    <p style="color:#94A3B8;font-size:14px">Merhaba ${name || "oyuncu"}! Üyeliğini aktifleştirmek için aşağıdaki kodu kullan:</p>
    <div style="font-size:34px;font-weight:800;letter-spacing:8px;background:#13151C;padding:18px 24px;border-radius:12px;text-align:center;color:${ACCENT}">${code}</div>
    <p style="color:#94A3B8;font-size:12px;margin-top:18px">Bu kod 15 dakika geçerlidir. Kodu biletinle paylaşma; destek yoksa spam klasörünü kontrol et.</p>
  </div>`;
}

export function newPatchEmailHtml(name: string, gameTitle: string, url: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#0B0C10;color:#F8FAFC;padding:32px;border-radius:14px;max-width:520px;margin:auto;border:1px solid #26263a">
    <h2 style="color:${ACCENT};margin-top:0">🎮 Yeni Yama Yayınlandı!</h2>
    <p style="color:#94A3B8;font-size:14px">Merhaba ${name || "oyuncu"}! Yeni AI Türkçe dublaj yaması yayına girdi:</p>
    <div style="font-size:20px;font-weight:700;margin:14px 0">${gameTitle} — Yapay Zeka (AI) Türkçe Dublaj</div>
    <a href="${url}" style="display:inline-block;background:${ACCENT};color:#0B0C10;font-weight:800;padding:12px 28px;border-radius:10px;text-decoration:none">Ücretsiz İndir</a>
    <p style="color:#64748B;font-size:12px;margin-top:20px">Bu bildirimi üyeliğin kapsamında aldın.</p>
  </div>`;
}
