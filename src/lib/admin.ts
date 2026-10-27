import type { NextRequest } from "next/server";
import type { Product } from "@/db/schema";

export const ADMIN_HEADER = "x-admin-key";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || "trdublaj-2026-gizli-anahtar";
}

/** Yalnızca site sahibi (admin anahtarını bilen) doğrulanır. */
export function isAdminRequest(request: NextRequest): boolean {
  const headerKey = request.headers.get(ADMIN_HEADER);
  if (!headerKey) return false;
  return headerKey.trim() === getAdminSecret();
}

export function verifyAdminKey(key: string | null | undefined): boolean {
  if (!key) return false;
  return key.trim() === getAdminSecret();
}

/**
 * Gizli alanları temizler: reklam kısaltma linki ve gerçek barındırıcı
 * (Google Drive / GitHub / MediaFire) URL'leri sayfa kaynağında ASLA görünmez.
 * Üyeler linkleri yalnızca reklam adımını geçtikten sonra /api/download ile alır.
 */
export function toPublicProduct(product: Product): Product {
  return {
    ...product,
    adShortlinkUrl: "",
    hostMirrors: (product.hostMirrors || []).map((m) => ({
      provider: m.provider,
      url: "",
      label: m.label,
    })),
  };
}

export function toPublicProducts(products: Product[]): Product[] {
  return products.map(toPublicProduct);
}
