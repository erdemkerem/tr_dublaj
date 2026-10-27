import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { ensureDatabaseSeeded } from "@/db/ensure-seed";
import { eq, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();

    const productId = Number(body.productId);
    const authorName = String(body.authorName || "").trim();
    const gamerTag = String(body.gamerTag || "Oyuncu_TR").trim();
    const platform = String(body.platform || "Steam").trim();
    const rating = Math.min(5, Math.max(1, Number(body.rating || 5)));
    const title = String(body.title || "").trim();
    const comment = String(body.comment || "").trim();
    const playtimeHours = Math.max(1, Number(body.playtimeHours || 24));

    if (!productId || !authorName || !title || !comment) {
      return NextResponse.json(
        { error: "Lütfen adınızı, inceleme başlığını ve yorumunuzu eksiksiz doldurun." },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(reviews)
      .values({
        productId,
        authorName,
        gamerTag,
        platform,
        rating,
        title,
        comment,
        verifiedPurchase: true,
        playtimeHours,
        helpfulCount: 1,
      })
      .returning();

    const allProductReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.productId, productId));

    const avg =
      allProductReviews.reduce((sum, r) => sum + r.rating, 0) /
      Math.max(1, allProductReviews.length);

    await db
      .update(products)
      .set({
        reviewCount: sql`${products.reviewCount} + 1`,
        ratingAvg: avg.toFixed(1),
      })
      .where(eq(products.id, productId));

    return NextResponse.json({
      review: inserted,
      newRatingAvg: avg.toFixed(1),
    });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "İnceleme kaydedilirken bir hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();
    const reviewId = Number(body.reviewId);

    if (!reviewId) {
      return NextResponse.json({ error: "Geçersiz inceleme ID." }, { status: 400 });
    }

    const [updated] = await db
      .update(reviews)
      .set({
        helpfulCount: sql`${reviews.helpfulCount} + 1`,
      })
      .where(eq(reviews.id, reviewId))
      .returning();

    return NextResponse.json({ review: updated });
  } catch (error) {
    console.error("PATCH /api/reviews error:", error);
    return NextResponse.json(
      { error: "İşlem sırasında hata oluştu." },
      { status: 500 }
    );
  }
}
