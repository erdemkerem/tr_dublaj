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

const COVER = "https://github.com/erdemkerem/tr_dublaj/releases/download/patches-v1/starfield-scifi.jpg";

// 1) Link gerçekten resim mi diye doğrula
const res = await fetch(COVER, { redirect: "follow" });
const buf = Buffer.from(await res.arrayBuffer());
const isJpeg = res.status === 200 && buf[0] === 0xff && buf[1] === 0xd8;
console.log(`${isJpeg ? "OK" : "ÖLÜ"} [${res.status}] ${buf.length} byte -> starfield-scifi.jpg`);
if (!isJpeg) {
  console.error("Resim doğrulanamadı — değişiklik yapılmadı.");
  await pool.end();
  process.exit(1);
}

// 2) id=6 kopya Resonance ürününün görselini değiştir
await pool.query(
  `UPDATE products SET cover_image = $1, gallery_images = $2::jsonb WHERE id = 6`,
  [
    COVER,
    JSON.stringify([
      {
        url: COVER,
        caption: "resonance-plague-tale — Yapım Görseli (Starfield Bilimkurgu)",
        tag: "ÖNİZLEME",
        dialoguePreviewTr: "[Yapım aşamasında — AI Türkçe Dublaj yakında]",
        dialoguePreviewEn: "[In progress — AI Turkish dubbing coming soon]",
      },
    ]),
  ]
);

// 3) Doğrula
const { rows } = await pool.query("SELECT id, game_title, cover_image FROM products ORDER BY id");
console.log("\nKapak durumları:");
rows.forEach((r) => console.log(` #${r.id} ${r.game_title} -> ${r.cover_image.split("/").pop()}`));
await pool.end();
