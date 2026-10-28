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

async function testUrl(u) {
  try {
    const res = await fetch(u, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; link-check; tr-dublaj)" },
    });
    return res.status;
  } catch (e) {
    return 0;
  }
}

const { rows } = await pool.query("SELECT id, game_title, host_mirrors FROM products ORDER BY id");

for (const p of rows) {
  if (!Array.isArray(p.host_mirrors) || p.host_mirrors.length === 0) continue;
  console.log(`\n=== #${p.id} ${p.game_title} ===`);
  const kept = [];
  for (const m of p.host_mirrors) {
    const status = await testUrl(m.url);
    const ok = status >= 200 && status < 400;
    console.log(`${ok ? "KALİYOR " : "SİLİNİYOR"} [${status}] ${m.provider} -> ${m.url}`);
    if (ok) kept.push(m);
  }
  if (kept.length !== p.host_mirrors.length) {
    await pool.query("UPDATE products SET host_mirrors = $1::jsonb WHERE id = $2", [
      JSON.stringify(kept),
      p.id,
    ]);
    console.log(`-> güncellendi: ${kept.length} gerçek link kaldı.`);
  }
}

console.log("\nTemizlik tamam.");
await pool.end();
