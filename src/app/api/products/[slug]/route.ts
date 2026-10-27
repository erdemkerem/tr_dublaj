import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/db/ensure-seed";
import { isAdminRequest, toPublicProduct, toPublicProducts } from "@/lib/admin";

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
