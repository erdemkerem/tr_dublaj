import "dotenv/config";
import { Pool } from "pg";
import fs from "node:fs";

// .env.local dosyasindeki DATABASE_URL'i al
let url = process.env.DATABASE_URL || "";
if (!url) {
  try {
    const envLocal = fs.readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const match = envLocal.match(/DATABASE_URL\s*=\s*"?([^"\n]+)"?/);
    if (match) url = match[1].trim();
  } catch {
    // ignore
  }
}

if (!url) {
  console.error("DATABASE_URL bulunamadı (.env.local).");
  process.exit(1);
}

const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

async function main() {
  const before = await pool.query("SELECT COUNT(*)::int AS n FROM reviews");
  console.log(`Yorum satırları (önce): ${before.rows[0].n}`);

  // Sahte/demo yorumları temizle — bundan sonra yalnızca üyelerin gerçek yorumları kalır
  await pool.query("DELETE FROM reviews;");

  // Ürün puanlarını gerçek yorum sayısına göre sıfırla
  await pool.query(`
    UPDATE products p
    SET review_count = COALESCE(r.cnt, 0),
        rating_avg = CASE WHEN COALESCE(r.cnt, 0) = 0 THEN '0.0'
                          ELSE ROUND((COALESCE(r.avg, 0))::numeric, 1)::text END
    FROM (SELECT product_id, COUNT(*) AS cnt, AVG(rating) AS avg FROM reviews GROUP BY product_id) r
    WHERE r.product_id = p.id;
  `);

  // Yorumu hiç olmayan ürünler
  await pool.query(`
    UPDATE products p
    SET review_count = 0, rating_avg = '0.0'
    WHERE NOT EXISTS (SELECT 1 FROM reviews r WHERE r.product_id = p.id);
  `);

  const lists = await pool.query("SELECT id, game_title, review_count, rating_avg FROM products ORDER BY id");
  lists.rows.forEach((row) => {
    console.log(`- ${row.id} ${row.game_title}: yorum=${row.review_count}, puan=${row.rating_avg}`);
  });

  const after = await pool.query("SELECT COUNT(*)::int AS n FROM reviews");
  console.log(`Yorum satırları (sonra): ${after.rows[0].n}`);
  console.log("Temizlik tamam. Artık sadece üyelerin gerçek yorumları görünür.");
  await pool.end();
}

main().catch((e) => {
  console.error("Temizlik hatası:", e);
  process.exit(1);
});
