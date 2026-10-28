import type { NextRequest } from "next/server";
import type { Product } from "@/db/schema";

export const ADMIN_HEADER = "x-admin-key";

/**
 * Yönetici anahtarı YALNIZCA Netlify ortam değişkeninden gelir (ADMIN_SECRET_KEY).
 * Repoda sabit (fallback) anahtar ASLA tutulmaz — depo herkese açık olduğu için
 * kodda tahminlenebilir bir şifre bırakmak güvenlik açığı olur.
 */
export function getAdminSecret(): string {
  return (process.env.ADMIN_SECRET_KEY || "").trim();
}

export function approveAdmin(_request: NextRequest): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  const headerKey = _request.headers.get(ADMIN_HEADER);
  return !!headerKey && headerKey.trim() === secret;
}

/** Yalnızca site sahibi (admin anahtarını bilen) doğrulanır. */
export function isAdminRequest(request: NextRequest): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  const headerKey = request.headers.get(ADMIN_HEADER);
  if (!headerKey) return false;
  return headerKey.trim() === secret;
}

export function verifyAdminKey(key: string | null | undefined): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;
  if (!key) return false;
  return key.trim() === secret;
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
