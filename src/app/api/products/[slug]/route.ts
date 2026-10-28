import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getProductBySlug } from "@/db/ensure-seed";
import { isAdminRequest, toPublicProduct, toPublicProducts } from "@/lib/admin";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const data = await getProductBySlug(slug);

    if (!data) {
      return NextResponse.json(
        { error: "Aradığınız oyun yaması bulunamadı." },
        { status: 404 }
      );
    }

    if (isAdminRequest(_request)) {
      return NextResponse.json(data);
    }

    return NextResponse.json({
      ...data,
      product: toPublicProduct(data.product),
      relatedProducts: toPublicProducts(data.relatedProducts),
    });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json(
      { error: "Ürün detayları alınamadı." },
      { status: 500 }
    );
  }
}

/** Sadece site sahibi: ürünü düzenler (slug ile) */
export async function PUT(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isAdminRequest(_request)) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }
    const { slug } = await context.params;
    const body = await _request.json();

    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined)
      updateData.title = String(body.title).trim() || row.title;
    if (body.gameTitle !== undefined)
      updateData.gameTitle = String(body.gameTitle).trim() || row.gameTitle;
    if (body.subtitle !== undefined)
      updateData.subtitle = String(body.subtitle).trim();
    if (body.description !== undefined)
      updateData.description = String(body.description).trim();
    if (body.version !== undefined)
      updateData.version = String(body.version).trim() || row.version;
    if (body.fileSize !== undefined)
      updateData.fileSize = String(body.fileSize).trim() || row.fileSize;
    if (body.coverImage !== undefined)
      updateData.coverImage = String(body.coverImage).trim() || row.coverImage;
    if (body.price !== undefined) updateData.price = Number(body.price) || 0;

    if (body.slug !== undefined) {
      const newSlug = String(body.slug).trim();
      if (newSlug && newSlug !== slug) updateData.slug = newSlug;
    }

    if (Array.isArray(body.hostMirrors)) {
      updateData.hostMirrors = body.hostMirrors
        .map((m: { provider?: string; url?: string; label?: string }) => ({
          provider: String(m.provider || "").trim(),
          url: String(m.url || "").trim(),
          label: String(m.label || m.provider || "Barındırıcı").trim(),
        }))
        .filter(
          (m: { provider: string; url: string }) => m.provider || m.url
        );
    }

    if (Array.isArray(body.galleryImages)) {
      const gameTitle = body.gameTitle || row.gameTitle;
      const mapped = body.galleryImages
        .map(
          (g: {
            url?: string;
            caption?: string;
            tag?: string;
            dialoguePreviewTr?: string;
            dialoguePreviewEn?: string;
          }) => ({
          url: String(g.url || "").trim(),
          caption: String(g.caption || `${gameTitle} Ekran Görüntüsü`).trim(),
          tag: String(g.tag || "ÖNİZLEME").trim(),
          dialoguePreviewTr:
            g.dialoguePreviewTr || `[${gameTitle} - AI Türkçe Dublaj Aktif]`,
          dialoguePreviewEn: g.dialoguePreviewEn || `[${gameTitle} - Original Audio]`,
        }))
        .filter((g: { url: string }) => g.url);
      if (mapped.length > 0) updateData.galleryImages = mapped;
    }

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
        body.status === "ready" ? "Yayında • Hazır" : "Yapım / İstek Listesinde";
    }

    const [updated] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, row.id))
      .returning();

    return NextResponse.json({ product: updated });
  } catch (error) {
    console.error("PUT /api/products/[slug] error:", error);
    return NextResponse.json(
      { error: "Ürün güncellenemedi." },
      { status: 500 }
    );
  }
}

/** Sadece site sahibi: ürünü tamamen siler */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    if (!isAdminRequest(_request)) {
      return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
    }
    const { slug } = await context.params;

    const [row] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (!row) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    await db.delete(products).where(eq(products.id, row.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/products/[slug] error:", error);
    return NextResponse.json({ error: "Ürün silinemedi." }, { status: 500 });
  }
}
