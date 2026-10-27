import React from "react";
import {
  getAllProducts,
  getRecentReviews,
  getAllGameRequests,
} from "@/db/ensure-seed";
import { HomeStorefront } from "@/components/HomeStorefront";
import { toPublicProducts } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, recentReviews, gameRequests] = await Promise.all([
    getAllProducts(),
    getRecentReviews(6),
    getAllGameRequests(),
  ]);

  return (
    <HomeStorefront
      initialProducts={toPublicProducts(products)}
      initialReviews={recentReviews}
      initialGameRequests={gameRequests}
    />
  );
}
