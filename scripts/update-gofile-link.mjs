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

const NEW_GOFILE = "https://gofile.io/d/JdZMLCbi"; // gerçek 4.9 GB .7z dosyasının linki

// Ürün 1'in mevcut barındırıcı listesini al
const { rows } = await pool.query(
  "SELECT id, game_title, host_mirrors FROM products WHERE id = 1"
);
const p = rows[0];
console.log("Önce:", JSON.stringify(p.host_mirrors, null, 2));

// Gofile satırını gerçek dosya linkiyle değiştir (diğer barındırıcılar korunur)
const mirrors = Array.isArray(p.host_mirrors) ? p.host_mirrors : [];
const updated = mirrors.map((m) =>
  (m.url || "").includes("gofile.io")
    ? { ...m, url: NEW_GOFILE, label: "Gofile • Yama Paketi (4.9 GB)" }
    : m
);
if (!updated.some((m) => (m.url || "").includes("gofile.io"))) {
  updated.push({
    provider: "Gofile",
    url: NEW_GOFILE,
    label: "Gofile • Yama Paketi (4.9 GB)",
  });
}

await pool.query(
  "UPDATE products SET host_mirrors = $1::jsonb WHERE id = $2",
  [JSON.stringify(updated), p.id]
);

// Doğrulama + linkin canlı olduğunu test et
const after = await pool.query(
  "SELECT game_title, host_mirrors FROM products WHERE id = 1"
);
console.log("\nSonra:", JSON.stringify(after.rows[0].host_mirrors, null, 2));

const res = await fetch(NEW_GOFILE, { redirect: "follow" });
console.log(`\nGofile link testi: ${res.status} (200 = açılıyor ✓)`);

console.log("\nBitti — üye tıklayınca artık 4.9 GB'lık .7z iner (TXT değil).");
await pool.end();
