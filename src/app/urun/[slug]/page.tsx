import React from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/db/ensure-seed";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { toPublicProduct, toPublicProducts } from "@/lib/admin";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={toPublicProduct(data.product)}
      initialReviews={data.productReviews}
      relatedProducts={toPublicProducts(data.relatedProducts)}
    />
  );
}
