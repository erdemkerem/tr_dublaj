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

const GOFILE_URL = "https://gofile.io/d/ac6f5d1a-ba38-4774-a10c-e9049b1665b7";

// Resonance (#1) ürününe Gofile barındırıcısı ekle (mevcut satırlar korunur)
const { rows } = await pool.query(
  "SELECT id, game_title, host_mirrors FROM products WHERE id = 1"
);
const p = rows[0];
if (!p) {
  console.log("Resonance ürünü bulunamadı (#1)");
  await pool.end();
  process.exit(1);
}

const mirrors = Array.isArray(p.host_mirrors) ? [...p.host_mirrors] : [];
if (mirrors.some((m) => (m.url || "").includes("gofile.io"))) {
  console.log("Gofile zaten ekli.", JSON.stringify(mirrors, null, 2));
  await pool.end();
  process.exit(0);
}

mirrors.push({
  provider: "Gofile",
  url: GOFILE_URL,
  label: "Gofile • Hızlı İndirme",
});

await pool.query("UPDATE products SET host_mirrors = $1::jsonb WHERE id = 1", [
  JSON.stringify(mirrors),
]);

const after = await pool.query(
  "SELECT game_title, host_mirrors FROM products WHERE id = 1"
);
console.log(after.rows[0].game_title + " barındırıcıları:");
after.rows[0].host_mirrors.forEach((m) =>
  console.log(`- [${m.provider}] ${m.label} -> ${m.url}`)
);
console.log("Gofile eklendi (anında canlı).");
await pool.end();
