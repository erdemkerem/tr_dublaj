"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  Volume2,
  Square,
  Bot,
  ArrowUpRight,
  Download,
  Heart,
  ThumbsUp,
  ExternalLink,
} from "lucide-react";
import type { Product } from "@/db/schema";
import { useStore } from "@/context/StoreContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    openCheckout,
    activeAudio,
    playStudioSample,
    stopStudioSample,
    showToast,
  } = useStore();

  const [votes, setVotes] = useState(product.wishlistVotes || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const firstSample = product.audioSamples?.[0];
  const isPlayingThis =
    Boolean(firstSample) &&
    activeAudio?.sample.id === firstSample?.id &&
    activeAudio?.isPlaying;

  const isReady = product.status === "ready";

  const badgeStyles = isReady
    ? "bg-[#10B981] text-[#0B0C10] border-[#10B981]"
    : product.status === "in_progress"
    ? "bg-[#F59E0B] text-[#0B0C10] border-amber-300"
    : "bg-[#13151C]/90 text-[#F8FAFC] border-white/25";

  const handleVoteWishlist = async () => {
    if (hasVoted) {
      showToast("Bu oyun için zaten oy kullandınız!");
      return;
    }
    setHasVoted(true);
    setVotes((v) => v + 1);
    showToast(
      `${product.gameTitle} AI Dublaj önceliği için oyunuz kaydedildi!`
    );
    try {
      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, action: "vote" }),
      });
    } catch {
      // keep optimistic state
    }
  };

  return (
    <article
      className={`group relative rounded-2xl bg-[#13151C] border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:-translate-y-1 ${
        isReady
          ? "border-[#10B981]/50 hover:border-[#10B981]"
          : "border-white/10 hover:border-[#F59E0B]/50"
      }`}
    >
      {/* Top 16:9 Cover Image & Overlays */}
      <div>
        <div className="relative aspect-video w-full overflow-hidden bg-[#0B0C10]">
          <Link href={`/urun/${product.slug}`} className="block w-full h-full">
            <img
              src={product.coverImage}
              alt={product.gameTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#13151C] via-[#13151C]/20 to-transparent" />
          </Link>

          {/* Top Left Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-extrabold uppercase tracking-wider border backdrop-blur-md shadow ${badgeStyles}`}
            >
              {product.patchTypeLabel}
            </span>
          </div>

          {/* Top Right Version Pill */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded-md bg-[#0B0C10]/85 backdrop-blur-md border border-white/15 font-mono text-[10px] text-[#94A3B8]">
              {product.version}
            </span>
          </div>

          {/* Bottom Overlay: Quick AI Voice Preview Button + Rating */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2">
            {firstSample && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (isPlayingThis) {
                    stopStudioSample();
                  } else {
                    playStudioSample(
                      firstSample,
                      product.gameTitle,
                      product.slug,
                      "tr"
                    );
                  }
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold backdrop-blur-xl border transition-all cursor-pointer ${
                  isPlayingThis
                    ? "bg-[#E11D48] text-white border-white/30 shadow-[0_0_20px_rgba(225,29,72,0.7)]"
                    : "bg-[#0B0C10]/85 hover:bg-[#E11D48] text-[#F8FAFC] border-white/20"
                }`}
              >
                {isPlayingThis ? (
                  <>
                    <Square className="w-3 h-3 fill-white" />
                    <span>Durdur ({firstSample.character.split(" ")[0]})</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#F43F5E] group-hover:text-white" />
                    <span>AI Dublaj Dinle</span>
                  </>
                )}
              </button>
            )}

            <div className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0B0C10]/85 backdrop-blur-md border border-white/10 text-xs font-mono">
              <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
              <span className="font-bold text-[#F8FAFC]">
                {product.ratingAvg}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-5 pb-3">
          {/* AI Model & Character Count Row */}
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-[#94A3B8] mb-1.5">
            <span className="text-[#F59E0B] uppercase tracking-wider truncate">
              {product.genreLabel}
            </span>
            <span className="flex items-center gap-1 shrink-0">
              <Bot className="w-3.5 h-3.5 text-[#10B981]" />
              AI RVC Ses Klonu
            </span>
          </div>

          <Link href={`/urun/${product.slug}`} className="block group/title">
            <h3 className="font-display text-lg font-bold text-[#F8FAFC] group-hover/title:text-[#F43F5E] transition-colors line-clamp-1">
              {product.gameTitle}
            </h3>
          </Link>

          <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1.5 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Progress Bar for In-Progress / Ready */}
          <div className="mt-3 pt-2 border-t border-white/5 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-[#94A3B8]">
                {isReady
                  ? "AI Dublaj & Font Durumu:"
                  : "AI Ses Eğitim İlerlemesi:"}
              </span>
              <span
                className={
                  isReady
                    ? "text-[#10B981] font-bold"
                    : "text-[#F59E0B] font-bold"
                }
              >
                %{product.progressPercent} Tamamlandı
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0B0C10] overflow-hidden">
              <div
                style={{ width: `${product.progressPercent}%` }}
                className={`h-full rounded-full ${
                  isReady
                    ? "bg-[#10B981]"
                    : "bg-gradient-to-r from-[#E11D48] to-[#F59E0B]"
                }`}
              />
            </div>
          </div>

          {/* Platforms & Downloads/Votes Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-white/5">
            <div className="flex flex-wrap items-center gap-1.5">
              {product.platforms.map((plat) => (
                <span
                  key={plat}
                  className="px-2 py-0.5 rounded bg-[#1C1F2B] border border-white/10 font-mono text-[10px] text-[#94A3B8]"
                >
                  {plat}
                </span>
              ))}
            </div>
            {isReady ? (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#10B981]">
                <Download className="w-3 h-3" />
                {product.downloadsCount.toLocaleString("tr-TR")} İndirme
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#F59E0B]">
                <ThumbsUp className="w-3 h-3" />
                {votes} Oyuncu İstiyor
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Free Badge & Action Buttons */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2">
        <div>
          <span className="block font-mono text-sm font-extrabold text-[#10B981]">
            ÜCRETSİZ
          </span>
          <span className="font-mono text-[10px] text-[#94A3B8]">
            {isReady ? "İndir" : "İstek Listesi"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => addToCart(product, true)}
            title="İstek & İndirme Listeme Ekle"
            className="h-10 w-10 rounded-xl bg-[#1C1F2B] hover:bg-[#E11D48]/20 border border-white/10 hover:border-[#E11D48]/50 flex items-center justify-center text-[#F43F5E] transition-colors cursor-pointer"
          >
            <Heart className="w-4 h-4" />
          </button>

          {isReady ? (
            <button
              type="button"
              onClick={() => openCheckout(product)}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-[#0B0C10] font-display text-xs font-extrabold tracking-wide inline-flex items-center gap-1.5 shadow-[0_0_20px_-4px_rgba(16,185,129,0.55)] transition-all cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>İndir</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleVoteWishlist}
              className={`h-10 px-3.5 rounded-xl font-mono text-xs font-bold inline-flex items-center gap-1.5 border transition-all cursor-pointer ${
                hasVoted
                  ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                  : "bg-[#F59E0B]/20 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0B0C10] border-[#F59E0B]/40"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{hasVoted ? `Oy Verildi (${votes})` : `Oy Ver (${votes})`}</span>
            </button>
          )}

          <Link
            href={`/urun/${product.slug}`}
            aria-label={`${product.gameTitle} Detayları`}
            className="h-10 w-9 rounded-xl bg-[#1C1F2B] hover:bg-white/15 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
