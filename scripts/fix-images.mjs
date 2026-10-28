import "dotenv/config";
import fs from "node:fs";
import { Pool } from "pg";

let url = process.env.DATABASE_URL || "";
if (!url) {
  const l = fs.readFileSync(".env.local", "utf8");
  const m = l.match(/DATABASE_URL\s*=\s*"?([^"\n]+)"?/);
  if (m) url = m[1].trim();
}
const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

const BASE = "https://github.com/erdemkerem/tr_dublaj/releases/download/patches-v1";

// Önce URL'nin gerçekten resim döndüğünü doğrula
const test = await fetch(`${BASE}/gow-ragnarok.jpg`, { method: "HEAD", redirect: "follow" });
console.log("URL testi:", test.status, test.headers.get("content-type") || "");

if (test.status !== 200) {
  console.log("URL çalışmıyor — tag adını kontrol et");
  await pool.end();
  process.exit(1);
}

// 1) Resonance: cover + galeri mevcut asset'lerle dolsun
const g = `"${BASE}/resonance-plague-tale.jpg","${BASE}/elden-ring.jpg","${BASE}/tlou-part1.jpg","${BASE}/hogwarts-legacy.jpg"`;
await pool.query(
  `UPDATE products SET cover_image=$1, gallery_images=$2::jsonb WHERE id=1`,
  [`${BASE}/resonance-plague-tale.jpg`, `[${g}]`]
);

// 2) God of War
await pool.query(
  `UPDATE products SET cover_image=$1, gallery_images=$2::jsonb WHERE id=4`,
  [`${BASE}/gow-ragnarok.jpg`, `[{"url":"${BASE}/gow-ragnarok.jpg","caption":"God of War Ragnarök — AI Türkçe Dublaj","tag":"AI DUBLAJ"}]`]
);

// 3) Red Dead Redemption 2
await pool.query(
  `UPDATE products SET cover_image=$1, gallery_images=$2::jsonb WHERE id=5`,
  [`${BASE}/rdr2-western.jpg`, `[{"url":"${BASE}/rdr2-western.jpg","caption":"Red Dead Redemption 2 — AI Türkçe Dublaj","tag":"AI DUBLAJ"}]`]
);

const after = await pool.query("SELECT id, game_title, cover_image FROM products ORDER BY id");
after.rows.forEach((r) => console.log(`#${r.id} ${r.game_title} -> ${r.cover_image}`));
console.log("Görseller düzeltildi (anında canlı).");
await pool.end();
