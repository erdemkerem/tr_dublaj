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

const BASE = "https://github.com/erdemkerem/tr_dublaj/releases/download/patches-v1";

// 5 FARKLI görsel — önce her biri gerçekten indirilebilir mi diye test edilir
const gallery = [
  {
    url: `${BASE}/resonance-plague-tale.jpg`,
    caption: "Resonance: A Plague Tale Legacy — Ana Görsel",
    tag: "AI DUBLAJ SAHNESİ",
    dialoguePreviewTr: "Sophia: «Amca, o evdeki fısıltıları mı duyuyorsun?»",
    dialoguePreviewEn: "Hugo: «Brother, did you hear the whispers too?»",
  },
  {
    url: `${BASE}/elden-ring.jpg`,
    caption: "Elden Ring Görseli — AI Türkçe Dublaj Denemesi",
    tag: "ÖNİZLEME",
    dialoguePreviewTr: "Melina: «Zaferini Obstiksiz düzene bağlama, Tarnished.»",
    dialoguePreviewEn: "Melina: «Have you heard of the Finger Maiden?»",
  },
  {
    url: `${BASE}/tlou-part1.jpg`,
    caption: "The Last of Us Part I Görseli — AI Türkçe Dublaj",
    tag: "ÖNİZLEME",
    dialoguePreviewTr: "Joel: «Ellie, arkana bak, dışarıda bir şey var!»",
    dialoguePreviewEn: "Ellie: «Endure and survive.»",
  },
  {
    url: `${BASE}/hogwarts-legacy.jpg`,
    caption: "Hogwarts Legacy Görseli — AI Türkçe Dublaj",
    tag: "ÖNİZLEME",
    dialoguePreviewTr: "Profesör Fig: «Büyü kapına hoş geldin, genç cadı!»",
    dialoguePreviewEn: "Sorting Hat: «Hmm... difficult, very difficult.»",
  },
  {
    url: `${BASE}/gow-ragnarok.jpg`,
    caption: "God of War Ragnarök Görseli — AI Türkçe Dublaj",
    tag: "ÖNİZLEME",
    dialoguePreviewTr: "Kratos: «Oğlum, kafanı kolla, düşmanın kokusunu alıyorum.»",
    dialoguePreviewEn: "Atreus: «Father, look, the runes are glowing!»",
  },
];

// 1) Her linki indirip GERÇEKTEN resim (JPEG/PNG) mi diye doğrula — bozukysa yazma!
console.log("Linkler doğrulanıyor...");
for (const g of gallery) {
  const res = await fetch(g.url, { redirect: "follow" });
  const buf = Buffer.from(await res.arrayBuffer());
  const isJpeg = buf[0] === 0xff && buf[1] === 0xd8;
  const isPng = buf[0] === 0x89 && buf[1] === 0x50;
  const isImage = res.status === 200 && (isJpeg || isPng) && buf.length > 10000;
  console.log(
    `${isImage ? "OK " : "ÖLÜ"} [${res.status}] ${buf.length} byte ${isJpeg ? "JPEG" : isPng ? "PNG" : "?"} -> ${g.url.split("/").pop()}`
  );
  if (!isImage) {
    console.error("Bu link resim döndürmedi — hiçbir şey değiştirilmedi. Dosya adını kontrol et.");
    await pool.end();
    process.exit(1);
  }
}

// 2) DB'ye DOĞRU format (obje dizisi) yazılır
await pool.query(
  `UPDATE products SET gallery_images = $1::jsonb, cover_image = $2 WHERE id = 1`,
  [JSON.stringify(gallery), gallery[0].url]
);

// 3) Doğrulama
const { rows } = await pool.query(
  "SELECT gallery_images FROM products WHERE id = 1"
);
console.log("\nYeni DB hali:");
rows[0].gallery_images.forEach((g, i) =>
  console.log(` [${i}] ${g.tag} | ${g.caption} | ${g.url.split("/").pop()}`)
);
console.log("\n5 farklı resim yazıldı (obje formatı). Ctrl+F5 ile sayfayı yenile.");
await pool.end();
