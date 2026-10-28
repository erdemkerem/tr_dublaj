import { db } from "@/db";
import { sql } from "drizzle-orm";

/**
 * Mevcut Neon tablolarına yeni sütunları güvenli ekler (idempotent).
 * Sunucu ilk istekte çalışır; Netlify'da ek komut gerekmez.
 */
let executed = false;

export async function ensureUserTableColumns() {
  if (executed) return;
  try {
    await db.execute(sql`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code text;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires_at timestamp;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date text;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS gender text;
    `);
    executed = true;
  } catch (error) {
    console.error("Migration (users) failed:", error);
  }
}
