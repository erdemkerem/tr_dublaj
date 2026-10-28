import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import {
  ensureDatabaseSeeded,
  getAllProducts,
  getRecentReviews,
  getAllGameRequests,
} from "@/db/ensure-seed";
import { eq, sql } from "drizzle-orm";
import { isAdminRequest, toPublicProducts } from "@/lib/admin";

function slugifyTitle(str: string): string {
  return (
    str
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-ai-turkce-dublaj"
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const genre = searchParams.get("genre");
    const search = searchParams.get("search")?.trim().toLowerCase();

    let items = await getAllProducts();

    if (statusFilter && statusFilter !== "all") {
      items = items.filter((p) => p.status === statusFilter);
    }

    if (genre && genre !== "all") {
      items = items.filter((p) => p.genre === genre);
    }

    if (search) {
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.gameTitle.toLowerCase().includes(search) ||
          p.subtitle.toLowerCase().includes(search)
      );
    }

    const [recentReviews, gameRequests] = await Promise.all([
      getRecentReviews(6),
      getAllGameRequests(),
    ]);

    // Site sahibi admin anahtarıyla gerçek linkleri görür; üyeler/ziyaretçiler göremez.
    const admin = isAdminRequest(request);

    return NextResponse.json({
      products: admin ? items : toPublicProducts(items),
      isAdmin: admin,
      recentReviews,
      gameRequests,
      total: items.length,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Yamalar yüklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Yetkisiz işlem. Yama ekleme sadece site sahibine açıktır." },
        { status: 401 }
      );
    }

    await ensureDatabaseSeeded();
    const body = await request.json();

    const gameTitle = String(body.gameTitle || "").trim();
    if (!gameTitle) {
      return NextResponse.json(
        { error: "Lütfen oyun adını girin." },
        { status: 400 }
      );
    }

    const status = String(body.status || "ready");
    const version = String(body.version || "v1.0-AI").trim();
    const fileSize = String(body.fileSize || "2.4 GB").trim();
    const aiModelInfo = String(
      body.aiModelInfo || "ElevenLabs + RVC v2 AI Ses Klonlama"
    ).trim();
    const adShortlinkUrl = String(
      body.adShortlinkUrl || ""
    ).trim();
    const hostUrl = String(
      body.hostUrl || ""
    ).trim();
    const hostProvider = String(body.hostProvider || "").trim();
    const coverImage = String(
      body.coverImage || "/images/resonance-plague-tale.jpg"
    ).trim();
    const subtitle = String(
      body.subtitle ||
        `${gameTitle} için yapay zekâ (AI Ses Klonlama) ile hazırlanmış ücretsiz Türkçe dublaj ve altyazı yaması.`
    ).trim();

    const slug = `${slugifyTitle(gameTitle)}-${Date.now().toString().slice(-4)}`;

    const [created] = await db
      .insert(products)
      .values({
        slug,
        title: `${gameTitle} — Yapay Zeka (AI) Türkçe Dublaj Yaması`,
        gameTitle,
        subtitle,
        description:
          body.description ||
          `${gameTitle} oyunu için ${aiModelInfo} kullanılarak hazırlanan %100 ücretsiz Türkçe seslendirme ve altyazı paketi. Üye olup doğrudan barındırıcıdan indirebilirsiniz.`,
        status,
        progressPercent: status === "ready" ? 100 : Number(body.progressPercent || 50),
        aiModelInfo,
        adShortlinkUrl,
        hostMirrors: Array.isArray(body.hostMirrors) && body.hostMirrors.length > 0
          ? body.hostMirrors.map(
              (m: { provider?: string; url?: string; label?: string }) => ({
                provider: String(m.provider || "").trim(),
                url: String(m.url || "").trim(),
                label: String(m.label || m.provider || "Barındırıcı").trim(),
              })
            ).filter((m: { provider: string; url: string }) => m.provider || m.url)
          : hostProvider && hostUrl
          ? [
              {
                provider: hostProvider,
                url: hostUrl,
                label: `${hostProvider} (Ana İndirme Bağlantısı - ${fileSize})`,
              },
            ]
          : [],
        price: 0,
        originalPrice: 0,
        patchType: status === "ready" ? "ai_full_dub" : "wishlist_vote",
        patchTypeLabel:
          status === "ready"
            ? "HAZIR • AI TÜRKÇE DUBLAJ"
            : status === "in_progress"
            ? "YAPIMDA • AI EĞİTİLİYOR"
            : "İSTEK LİSTESİ • OY VER",
        genre: body.genre || "hikaye-odakli",
        genreLabel: body.genreLabel || "Aksiyon / Hikaye Odaklı",
        platforms: ["Steam", "Epic Games", "PC"],
        version,
        fileSize,
        gameVersionCompat: `${gameTitle} (Son Sürüm PC)`,
        voiceActorCount: Number(body.voiceActorCount || 12),
        translatedLinesCount: String(body.translatedLinesCount || "18.500+ Satır"),
        studioHours: 80,
        coverImage,
        galleryImages: Array.isArray(body.galleryImages) && body.galleryImages.length > 0
          ? body.galleryImages.map(
              (g: { url?: string; caption?: string; tag?: string }) => ({
                url: String(g.url || "").trim(),
                caption: String(g.caption || `${gameTitle} Ekran Görüntüsü`).trim(),
                tag: String(g.tag || "ÖNİZLEME").trim(),
                dialoguePreviewTr: `[${gameTitle} - AI Türkçe Dublaj Aktif]`,
                dialoguePreviewEn: `[${gameTitle} - Original Audio]`,
              })
            ).filter((g: { url: string }) => g.url)
          : [
              {
                url: coverImage,
                caption: `${gameTitle} — AI Türkçe Dublaj & Altyazı Ekran Görüntüsü`,
                tag: status === "ready" ? "HAZIR AI DUBLAJ" : "PROJE ÖNİZLEME",
                dialoguePreviewTr: `[${gameTitle} - AI Türkçe Dublaj Aktif] Tüm ana diyaloglar orijinal karakter ses tonuyla Türkçeleştirildi.`,
                dialoguePreviewEn: `[${gameTitle} - Original Audio] Original English voice track.`,
              },
            ],
        audioSamples: [
          {
            id: `sample-${Date.now()}`,
            character: `${gameTitle} Başrol`,
            voiceActor: `AI Ses Klonu (${aiModelInfo})`,
            scene: "Ana Hikaye Diyalog Kesiti",
            originalQuote: "We have come too far to turn back now.",
            turkishQuote: "Artık geri dönmek için çok fazla yol katettik.",
            duration: "0:10",
            waveform: [40, 68, 88, 94, 75, 58, 82, 95, 79, 60, 85, 91, 66, 48, 77, 89, 71, 52, 69, 80, 54, 36],
            freqProfile: "warm",
          },
        ],
        voiceCast: [
          {
            character: "Ana Karakterler",
            actor: aiModelInfo,
            role: "Orijinal Ses Klonlu AI Türkçe Dublaj",
            sampleQuote: "Yolculuğumuz yeni başlıyor.",
          },
        ],
        features: [
          "%100 Ücretsiz: Doğrudan barındırıcıdan indirin",
          `${aiModelInfo} ile orijinal ses tonu korunarak dublajlandı`,
          "Tam Türkçe karakter destekli altyazı ve arayüz",
        ],
        installNotes: [
          "Üye girişi yapıp 'Ücretsiz İndir' butonuna tıklayın.",
          "Yönlendirilen barındırıcıdan arşivi indirip oyun klasörüne çıkartın.",
        ],
        isFeatured: true,
        collectionTag: status === "ready" ? "hazir-yama" : "istek-listesi",
        ratingAvg: "5.0",
        reviewCount: 1,
        downloadsCount: status === "ready" ? 1 : 0,
        wishlistVotes: 15,
        releaseDate:
          status === "ready" ? "Yayında • Hazır" : "Yapım / İstek Listesinde",
      })
      .returning();

    return NextResponse.json({ product: created });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Yeni yama eklenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json({ error: "Geçersiz ürün ID." }, { status: 400 });
    }

    if (body.action === "vote") {
      const [updated] = await db
        .update(products)
        .set({
          wishlistVotes: sql`${products.wishlistVotes} + 1`,
        })
        .where(eq(products.id, id))
        .returning();
      return NextResponse.json({ product: updated });
    }

    if (body.action === "download") {
      const [updated] = await db
        .update(products)
        .set({
          downloadsCount: sql`${products.downloadsCount} + 1`,
        })
        .where(eq(products.id, id))
        .returning();
      return NextResponse.json({ product: updated });
    }

    // Buradan sonrası sadece site sahibi (admin) içindir.
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Yetkisiz işlem. Düzenleme sadece site sahibine açıktır." },
        { status: 401 }
      );
    }

    // Admin update fields (status, adShortlinkUrl, hostUrl, version, progressPercent)
    const updateData: Record<string, unknown> = {};
    if (body.status) {
      updateData.status = body.status;
      updateData.progressPercent =
        body.status === "ready" ? 100 : Number(body.progressPercent || 65);
      updateData.patchType =
        body.status === "ready" ? "ai_full_dub" : "wishlist_vote";
      updateData.patchTypeLabel =
        body.status === "ready"
          ? "HAZIR • AI TÜRKÇE DUBLAJ"
          : body.status === "in_progress"
          ? "YAPIMDA • AI EĞİTİLİYOR"
          : "İSTEK LİSTESİ • OY VER";
      updateData.releaseDate =
        body.status === "ready"
          ? "Yayında • Hazır"
          : "Yapım / İstek Listesinde";
    }

    if (body.adShortlinkUrl) {
      updateData.adShortlinkUrl = String(body.adShortlinkUrl).trim();
    }

    if (body.version) {
      updateData.version = String(body.version).trim();
    }

    if (body.hostUrl) {
      const provider = String(body.hostProvider || "Barındırıcı");
      updateData.hostMirrors = [
        {
          provider,
          url: String(body.hostUrl).trim(),
          label: `${provider} (Güncel İndirme Sunucusu)`,
        },
      ];
    }

    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("PATCH /api/products error:", error);
    return NextResponse.json(
      { error: "Güncelleme sırasında hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
      return NextResponse.json(
        { error: "Yetkisiz işlem. Silme sadece site sahibine açıktır." },
        { status: 401 }
      );
    }

    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
    }
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { error: "Silme işlemi başarısız." },
      { status: 500 }
    );
  }
}
