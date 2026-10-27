"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  Heart,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeFromCart,
    openCheckout,
    currentUser,
    openAuthModal,
  } = useStore();

  if (!isCartOpen) return null;

  const readyItems = cart.filter((i) => i.status === "ready");
  const wishlistItems = cart.filter((i) => i.status !== "ready");

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-out Panel */}
      <aside className="relative z-10 w-full max-w-md bg-[#0B0C10]/98 backdrop-blur-2xl border-l border-white/15 h-full flex flex-col justify-between shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
        {/* Top Header */}
        <div>
          <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#E11D48]/20 border border-[#E11D48]/40 flex items-center justify-center text-[#F43F5E]">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                  İstek & İndirme Listem
                </h2>
                <p className="text-xs font-mono text-[#10B981]">
                  %100 Ücretsiz • Reklam Geçerek Barındırıcıdan İndir
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeCart}
              aria-label="Listeyi Kapat"
              className="p-2 rounded-xl bg-[#13151C] hover:bg-[#1C1F2B] text-[#94A3B8] hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Member Status Banner */}
          <div className="px-6 py-3 bg-gradient-to-r from-[#13151C] via-[#1E1420] to-[#13151C] border-b border-white/10">
            {currentUser ? (
              <p className="text-xs text-[#10B981] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Hoş geldin <strong>{currentUser.name}</strong> ({currentUser.provider.toUpperCase()}). Hazır dublajları reklam geçerek ücretsiz indirebilirsin!
                </span>
              </p>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-[#94A3B8] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>
                    İndirme linklerine yönlenmek için{" "}
                    <strong className="text-[#F8FAFC]">Google ile tek tıkla</strong>{" "}
                    üye olun.
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => {
                    closeCart();
                    openAuthModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white text-[#0B0C10] font-mono text-[10px] font-bold uppercase shrink-0 cursor-pointer"
                >
                  Üye Ol
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-[#13151C] border border-white/10 flex items-center justify-center text-[#94A3B8] mb-4">
                <Heart className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-display text-base font-bold text-[#F8FAFC] mb-1">
                Listenizde henüz oyun yaması yok
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-xs mb-6 leading-relaxed">
                Hazır olan <strong>Resonance: A Plague Tale Legacy</strong> AI Türkçe dublajını indirebilir veya sıradaki oyunları istek listenize ekleyebilirsiniz.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white text-xs font-semibold tracking-wide hover:brightness-110 transition-all cursor-pointer"
              >
                Yamalara Göz At
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="p-3.5 rounded-xl bg-[#13151C] border border-white/10 hover:border-white/20 transition-all flex gap-3.5"
              >
                <Link
                  href={`/urun/${item.slug}`}
                  onClick={closeCart}
                  className="w-20 h-20 rounded-lg overflow-hidden bg-[#1C1F2B] shrink-0 border border-white/10"
                >
                  <img
                    src={item.coverImage}
                    alt={item.gameTitle}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/urun/${item.slug}`}
                        onClick={closeCart}
                        className="font-display text-sm font-bold text-[#F8FAFC] hover:text-[#F43F5E] transition-colors truncate"
                      >
                        {item.gameTitle}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label="Kaldır"
                        className="text-[#94A3B8] hover:text-[#EF4444] transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-semibold ${
                          item.status === "ready"
                            ? "bg-[#10B981]/20 text-[#10B981]"
                            : "bg-[#F59E0B]/20 text-[#F59E0B]"
                        }`}
                      >
                        {item.status === "ready"
                          ? "HAZIR • İNDİRİLEBİLİR"
                          : "İSTEK LİSTESİNDE"}
                      </span>
                      <span className="font-mono text-[10px] text-[#94A3B8]">
                        {item.version} • {item.fileSize}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                    {item.status === "ready" ? (
                      <button
                        type="button"
                        onClick={() => openCheckout()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#10B981] text-[#0B0C10] font-mono text-[11px] font-bold cursor-pointer hover:brightness-110"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Reklam Geç & İndir</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#F59E0B]">
                        <Clock className="w-3 h-3" /> Çıktığında Bildirilecek
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-[#10B981]">
                      ÜCRETSİZ
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Summary & Free Ad-Link Gate Trigger */}
        {cart.length > 0 && (
          <div className="p-6 bg-[#13151C] border-t border-white/10 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#94A3B8]">
                <span>Hazır İndirilebilir Dublaj</span>
                <span className="font-mono text-[#10B981] font-bold">
                  {readyItems.length} Oyun
                </span>
              </div>
              <div className="flex justify-between text-[#94A3B8]">
                <span>Takip Edilen İstek Listesi</span>
                <span className="font-mono text-[#F59E0B] font-bold">
                  {wishlistItems.length} Oyun
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-base font-bold text-[#F8FAFC]">
                <span>Ücret</span>
                <span className="font-mono text-lg text-[#10B981]">
                  0 ₺ (Reklam Destekli)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openCheckout()}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-white font-display font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(225,29,72,0.5)] transition-all cursor-pointer"
            >
              <span>Reklam Geç & Barındırıcıya Yönlen</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-[#94A3B8] font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Google Drive • GitHub Releases • MediaFire Direkt Yönlendirme</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
