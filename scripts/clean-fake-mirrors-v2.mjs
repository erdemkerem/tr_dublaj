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

/**
 * Yalnızca GERÇEK barındırıcı linkleri kalsın.
 * Sahte/yer tutucu örnekleri:
 *  - drive.google.com (klasör/dosya yolu yok, ana sayfa)
 *  - mega.nz/folder/... (gerçek mega linkleri /folder/<id>#<key> şeklindedir)
 *  - github.com/<varolmayan-org>/... kaynak linkleri
 */
function isFakePlaceholder(u) {
  try {
    const link = new URL(u);
    const path = link.pathname.replace(/\/+$/, "");

    if (link.hostname.includes("drive.google.com")) {
      // gerçek: /drive/folders/<id> veya /file/d/<id>/...
      if (!path.startsWith("/drive/folders/") && !path.startsWith("/file/d/")) return true;
    }
    if (link.hostname.includes("mega.nz")) {
      // gerçek: /folder/<id>#<key> veya /file/<id>#<key>
      if (!/\/(folder|file)\/[A-Za-z0-9_-]{8,}/.test(path) || !u.includes("#")) return true;
    }
    if (link.hostname.endsWith("github.com")) {
      // gerçek: erdemkerem/tr_dublaj altındaki release dosyaları
      if (!u.includes("erdemkerem/tr_dublaj/releases/download/")) return true;
    }
    if (link.hostname.includes("mediafire.com")) {
      // gerçek: /file/<id>/<dosyaadı>
      if (!path.startsWith("/file/")) return true;
    }
  } catch {
    return true;
  }
  return false;
}

const { rows } = await pool.query(
  "SELECT id, game_title, host_mirrors FROM products ORDER BY id"
);

for (const p of rows) {
  if (!Array.isArray(p.host_mirrors) || p.host_mirrors.length === 0) continue;
  const kept = p.host_mirrors.filter((m) => {
    const fake = isFakePlaceholder(m.url);
    console.log(`${fake ? "SİLİNİYOR" : "KALİYOR "} #${p.id} ${p.game_title} | ${m.provider} -> ${m.url}`);
    return !fake;
  });
  if (kept.length !== p.host_mirrors.length) {
    await pool.query("UPDATE products SET host_mirrors = $1::jsonb WHERE id = $2", [
      JSON.stringify(kept),
      p.id,
    ]);
  }
}

console.log("\n--- SON DURUM ---");
const after = await pool.query("SELECT id, game_title, host_mirrors FROM products ORDER BY id");
for (const r of after.rows) {
  console.log(`#${r.id} ${r.game_title}:`);
  (r.host_mirrors || []).forEach((m) => console.log(`   - [${m.provider}] ${m.label} -> ${m.url}`));
}

console.log("\nTemizlik tamam. Bünyünden ekledikçe gerçek linkler listede görünür.");
await pool.end();
