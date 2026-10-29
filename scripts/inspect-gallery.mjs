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

// 1) Ürün 1'in güncel hali
const { rows } = await pool.query(
  "SELECT id, game_title, cover_image, gallery_images FROM products WHERE id = 1"
);
const p = rows[0];
console.log("=== #1", p.game_title, "===");
console.log("cover_image:", p.cover_image);
console.log("gallery_images:");
(p.gallery_images || []).forEach((g, i) => console.log(` [${i}]`, JSON.stringify(g)));

// 2) Her bir galeri linkini gerçekten indirip resim mi diye bak (tarayıcı gibi)
const BASE = "https://github.com/erdemkerem/tr_dublaj/releases/download/patches-v1";
const urls = [
  ...(p.gallery_images || []).map((g) => g?.url),
  p.cover_image,
].filter(Boolean);

for (const u of urls) {
  try {
    const res = await fetch(u, { method: "GET", redirect: "follow" });
    const buf = Buffer.from(await res.arrayBuffer());
    const isJpeg = buf[0] === 0xff && buf[1] === 0xd8; // JPEG magic
    const isPng = buf[0] === 0x89 && buf[1] === 0x50;
    const isHtml = buf.slice(0, 15).toString().toLowerCase().includes("<!doctype");
    console.log(
      `[${res.status}] ${isJpeg ? "JPEG OK" : isPng ? "PNG OK" : isHtml ? "HTML! (resim değil)" : "BİLİNMEYEN İÇERİK"} ${buf.length} byte -> ${u}`
    );
  } catch (e) {
    console.log(`HATA ${u} -> ${e.message}`);
  }
}

await pool.end();
