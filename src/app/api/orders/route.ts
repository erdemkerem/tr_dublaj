import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products, type OrderItemRecord } from "@/db/schema";
import { ensureDatabaseSeeded, getOrderByNumber } from "@/db/ensure-seed";
import { eq, sql, desc } from "drizzle-orm";

function generateLicenseKey(slug: string): string {
  const prefix = slug.slice(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = (len: number) =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `TRD-${prefix}-${block(4)}-${block(4)}`;
}

export async function POST(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const body = await request.json();

    const customerName = String(body.customerName || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const gamerTag = String(body.gamerTag || "Oyuncu_TR").trim();
    const paymentMethod = String(body.paymentMethod || "credit_card").trim();
    const couponCode = body.couponCode ? String(body.couponCode).trim().toUpperCase() : null;
    const rawItems = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerEmail || rawItems.length === 0) {
      return NextResponse.json(
        { error: "Lütfen ad-soyad, e-posta ve sepet bilgilerini kontrol edin." },
        { status: 400 }
      );
    }

    const orderItems: OrderItemRecord[] = [];
    let subtotal = 0;

    for (const item of rawItems) {
      const productId = Number(item.productId || item.id);
      const quantity = Math.max(1, Number(item.quantity || 1));

      const found = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (found.length > 0) {
        const prod = found[0];
        subtotal += prod.price * quantity;
        orderItems.push({
          productId: prod.id,
          slug: prod.slug,
          title: prod.title,
          gameTitle: prod.gameTitle,
          price: prod.price,
          quantity,
          version: prod.version,
          fileSize: prod.fileSize,
          licenseKey: generateLicenseKey(prod.slug),
          installerName: `tr_dublaj_${prod.slug.slice(0, 18)}_${prod.version}_setup.exe`,
        });

        await db
          .update(products)
          .set({
            downloadsCount: sql`${products.downloadsCount} + ${quantity}`,
          })
          .where(eq(products.id, prod.id));
      }
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: "Sepetinizdeki ürünler doğrulanamadı." },
        { status: 400 }
      );
    }

    // Bundle discount if 2+ items + coupon discount
    let discount = 0;
    if (orderItems.length >= 2) {
      discount += Math.round(subtotal * 0.1); // %10 Çoklu Yama Paketi İndirimi
    }

    if (couponCode === "OYUNCU20") {
      discount += Math.round(subtotal * 0.2);
    } else if (couponCode === "DUBLAJ50") {
      discount += 50;
    } else if (couponCode === "TRDUBLAJ") {
      discount += Math.round(subtotal * 0.15);
    }

    discount = Math.min(discount, Math.max(0, subtotal - 49));
    const total = Math.max(0, subtotal - discount);

    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `TRD-2026-${randomDigits}`;

    const [createdOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName,
        customerEmail,
        gamerTag,
        paymentMethod,
        couponCode,
        subtotal,
        discount,
        total,
        items: orderItems,
        status: "completed",
      })
      .returning();

    return NextResponse.json({
      order: createdOrder,
      message: "Siparişiniz onaylandı ve dijital lisans anahtarlarınız üretildi.",
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Sipariş oluşturulurken bir hata meydana geldi." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDatabaseSeeded();
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();

    if (orderNumber) {
      const order = await getOrderByNumber(orderNumber);
      if (!order) {
        return NextResponse.json(
          { error: "Bu sipariş numarasına ait kayıt bulunamadı." },
          { status: 404 }
        );
      }
      return NextResponse.json({ order });
    }

    const recentOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return NextResponse.json({ orders: recentOrders });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Sipariş sorgulanırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
