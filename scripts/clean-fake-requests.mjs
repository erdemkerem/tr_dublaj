import "dotenv/config";
import { Pool } from "pg";
import fs from "node:fs";

let url = process.env.DATABASE_URL || "";
if (!url) {
  try {
    const envLocal = fs.readFileSync(
      new URL("../.env.local", import.meta.url),
      "utf8"
    );
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

const pool = new Pool({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

// Sahte (seed) istek listesi kayıtları — Melis D., Kerem A., Emirhan S., Cemre Y.
const FAKE_REQUESTERS = [
  "Melis D. (@SeaScorpion_Sophia)",
  "Kerem A. (@PlagueHunter_TR)",
  "Emirhan S. (@TurnBasedTR)",
  "Cemre Y. (@FogWalker)",
];

async function main() {
  const before = await pool.query(
    "SELECT id, game_title, requester_name, requester_provider, votes, status FROM game_requests ORDER BY id"
  );
  console.log(`İstek satırları (önce): ${before.rows.length}`);
  before.rows.forEach((r) =>
    console.log(`- [${r.id}] ${r.game_title} | ${r.requester_name} | ${r.votes} oy | ${r.status}`)
  );

  await pool.query(`DELETE FROM game_requests WHERE requester_name = ANY($1)`, [
    FAKE_REQUESTERS,
  ]);

  const after = await pool.query(
    "SELECT id, game_title, requester_name, requester_provider, votes, status FROM game_requests ORDER BY id"
  );
  console.log(`İstek satırları (sonra): ${after.rows.length}`);
  after.rows.forEach((r) =>
    console.log(`- [${r.id}] ${r.game_title} | ${r.requester_name} | ${r.votes} oy | ${r.status}`)
  );

  console.log("Temizlik tamam — artık yalnızca üyelerin gerçek istekleri listede.");
  await pool.end();
}

main().catch((e) => {
  console.error("Temizlik hatası:", e);
  process.exit(1);
});
