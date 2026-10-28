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

const rows = await pool.query(
  "SELECT id, game_title, slug, cover_image, gallery_images FROM products ORDER BY id"
);
for (const r of rows.rows) {
  console.log(`#${r.id} ${r.game_title}`);
  console.log(`  cover: ${r.cover_image || "NULL"}`);
  const g = r.gallery_images;
  if (g && g.length) g.forEach((x, i) => console.log(`  galeri[${i}]: ${x.url || JSON.stringify(x)}`));
  console.log("");
}
await pool.end();
