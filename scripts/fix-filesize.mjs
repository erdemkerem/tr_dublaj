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

await pool.query("UPDATE products SET file_size = $1 WHERE id = 1", ["4.9 GB"]);
const r = await pool.query("SELECT game_title, file_size FROM products WHERE id = 1");
console.log(r.rows[0].game_title, "->", r.rows[0].file_size);
await pool.end();
