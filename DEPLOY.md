# tr_dublaj — Ücretsiz Yayınlama Rehberi (Cloudflare + GitHub)

> Siteyi açtıktan sonra tarayıcıdan **`/yayinlama`** adresine girerek bu rehberin
> görsel (tıklanabilir) sürümünü de görebilirsin.

---

## 1) ÜCRETSİZ ALAN ADI (DOMAIN) SEÇENEKLERİ

| Seçenek | Ücret | Adres | Açıklama |
|---|---|---|---|
| **GitHub Pages alt alanı** | Ücretsiz | `kullaniciadin.github.io/tr_dublaj` | Hiçbir başvuru gerekmez, anında senin olur. |
| **Cloudflare Pages alt alanı** | Ücretsiz | `tr-dublaj.pages.dev` | Cloudflare hesabında proje açınca otomatik verilir. SSL + CDN dahil. |
| **js.org** | Ücretsiz / süresiz | `trdublaj.js.org` | <https://github.com/js-org/js.org> deposuna PR gönderirsin. |
| **is-a.dev** | Ücretsiz (onaylı) | `trdublaj.is-a.dev` | <https://github.com/is-a-dev/register> üzerinden başvurulur. |
| **eu.org** | Ücretsiz (onaylı) | `trdublaj.eu.org` | <https://nic.eu.org> — onay birkaç gün sürebilir. |

> ⚠️ **Freenom (.tk .ml .ga)** artık ücretsiz kayıt vermiyor, kullanma.
> İleride gerçek `.com` istersen **Cloudflare Registrar** maliyetine satar (kâr koymaz, ~10$/yıl).

---

## 2) CLOUDFLARE İLE YAYINA ALMA (tam sürüm — üyelik + veritabanı çalışır)

1. **Ücretsiz PostgreSQL aç:** <https://neon.tech> (veya supabase.com) → yeni proje → sana verilen
   `postgresql://...` bağlantı adresini kopyala.
2. <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. GitHub hesabını bağla → `tr_dublaj` deposunu seç.
4. Build ayarları:
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Build output directory: `.next`
5. **Settings → Environment variables** bölümüne ekle:
   | Değişken | Değer |
   |---|---|
   | `DATABASE_URL` | Neon’dan aldığın bağlantı adresi |
   | `ADMIN_SECRET_KEY` | **Senin gizli yönetici şifren** (kimseyle paylaşma!) |
6. **Save and Deploy** → 1–2 dakikada site yayında.
7. **Custom domains** → ücretsiz `tr-dublaj.pages.dev` hazır gelir; js.org / is-a.dev aldıysan
   CNAME kaydıyla buraya yönlendir. SSL otomatik açılır.

---

## 3) GITHUB'A YÜKLEME

```bash
git init
git add .
git commit -m "tr_dublaj ilk surum"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/tr_dublaj.git
git push -u origin main
```

### Yama dosyalarını (.zip) nerede barındıracaksın?

- **GitHub Releases** → Depo → *Releases* → *Draft a new release* → `.zip` dosyanı sürükle.
  Dosya başına **2 GB**’a kadar, indirme limiti yok, tamamen ücretsiz.
- Alternatif: **Google Drive**, **MediaFire**, **Mega.nz**, **Pixeldrain**.

Linki aldıktan sonra siteye **`/yonetim`** panelinden yapıştırıyorsun.

> 📌 Not: GitHub Pages yalnızca statik site barındırır; üyelik/veritabanı için
> **Cloudflare Pages veya Vercel** kullan, GitHub’ı da kod + yama dosyası deposu olarak tut.

---

## 4) YAMA YÖNETİMİ SADECE SENDE

- Gizli yönetim adresi: **`https://siteadresin/yonetim`**
- Giriş şifresi: `.env` içindeki **`ADMIN_SECRET_KEY`**
  (varsayılan: `trdublaj-2026-gizli-anahtar` → yayına almadan önce mutlaka değiştir).
- Menüdeki “Yama Yönetimi” butonu **sadece sen giriş yaptığında** belirir; üyeler ve ziyaretçiler göremez.
- Panelden yapabildiklerin:
  - ➕ Yeni AI dublaj ekle (oyun adı, sürüm, boyut, kapak görseli)
  - 🔒 Reklam linki + Google Drive / GitHub indirme linki gir-düzenle
  - 🔄 Durum değiştir: **Hazır / Yapımda / İstek Listesi**
  - 🗑️ Yama sil
  - 💾 `patches.json` olarak yedek al

---

## 5) GÜVENLİK: LİNKLER ÜYELERE KAPALI

- Reklam linki ve barındırıcı (Drive/GitHub/MediaFire) adresleri **sayfa kaynağında bulunmaz**.
- Genel API (`/api/products`) bu alanları **boş** döndürür.
- Gerçek linkler yalnızca `/api/download` üzerinden, **üye girişi + reklam adımı tamamlandıktan sonra** verilir.
- Ekleme / düzenleme / silme uçları `x-admin-key` başlığı olmadan **401** döner.

---

## 6) ÜYELİK (ZİYARETÇİLER İÇİN)

Oyuncular tek tıkla üye olur:

- **Google / Gmail**
- **Yandex Mail**
- **Proton Mail**

Üye olmayan biri indirme linklerini göremez; sadece yamaları ve ses örneklerini inceleyebilir.
