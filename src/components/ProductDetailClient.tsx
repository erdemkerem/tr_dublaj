"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  Volume2,
  Square,
  Star,
  Bot,
  CheckCircle2,
  ShieldCheck,
  Download,
  HardDrive,
  Cpu,
  FileText,
  ChevronRight,
  ThumbsUp,
  Send,
  Terminal,
  ExternalLink,
  Settings,
} from "lucide-react";
import type { Product, Review } from "@/db/schema";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  initialReviews: Review[];
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  initialReviews,
  relatedProducts,
}: ProductDetailClientProps) {
  const {
    addToCart,
    openCheckout,
    openAdminModal,
    isAdmin,
    activeAudio,
    playStudioSample,
    stopStudioSample,
    showToast,
  } = useStore();

  const isReady = product.status === "ready";
  const [votes, setVotes] = useState(product.wishlistVotes || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const gallery =
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages
      : [
          {
            url: product.coverImage,
            caption: `${product.gameTitle} — AI Türkçe Dublaj & Altyazı`,
            tag: "AI DUBLAJ SAHNESİ",
          },
        ];
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [previewLang, setPreviewLang] = useState<"tr" | "en">("tr");

  const [activeTab, setActiveTab] = useState<"features" | "cast" | "install">(
    "features"
  );

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [ratingAvg, setRatingAvg] = useState(product.ratingAvg);
  const [votedIds, setVotedIds] = useState<number[]>([]);

  const [authorName, setAuthorName] = useState("");
  const [gamerTag, setGamerTag] = useState("");
  const [platform, setPlatform] = useState(product.platforms[0] || "Steam");
  const [rating, setRating] = useState(5);
  const [playtimeHours, setPlaytimeHours] = useState(16);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const currentGalleryItem = gallery[selectedImageIdx] || gallery[0];

  const handleVoteWishlist = async () => {
    if (hasVoted) {
      showToast("Bu proje için zaten oy verdiniz!");
      return;
    }
    setHasVoted(true);
    setVotes((v) => v + 1);
    showToast(`${product.gameTitle} için oyunuz kaydedildi!`);
    try {
      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, action: "vote" }),
      });
    } catch {
      // ignore
    }
  };

  const handleHelpfulVote = async (reviewId: number) => {
    if (votedIds.includes(reviewId)) return;
    setVotedIds((prev) => [...prev, reviewId]);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
      )
    );
    try {
      await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });
    } catch {
      // ignore
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewTitle.trim() || !reviewComment.trim()) {
      return;
    }
    setSubmittingReview(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName,
          gamerTag: gamerTag.trim() || "Oyuncu_TR",
          platform,
          rating,
          title: reviewTitle,
          comment: reviewComment,
          playtimeHours,
        }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        if (data.newRatingAvg) setRatingAvg(data.newRatingAvg);
        setAuthorName("");
        setGamerTag("");
        setReviewTitle("");
        setReviewComment("");
        showToast("Yorumunuz yayınlandı! Desteğiniz için teşekkürler.");
      }
    } catch {
      showToast("Yorum gönderilirken bir hata oluştu.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-20">
      {/* Breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#94A3B8]">
        <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
          Ana Sayfa
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-white/30" />
        <Link href="/#katalog" className="hover:text-[#F8FAFC] transition-colors">
          AI Türkçe Dublaj Kataloğu
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-white/30" />
        <span className="text-[#10B981] font-semibold truncate">
          {product.gameTitle}
        </span>
      </nav>

      {/* Main 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN (7 Cols): Gallery + AI Voice Samples + Details Tabs */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Interactive Gallery with TR/EN Dialogue Toggle */}
          <div className="rounded-2xl bg-[#13151C] border border-white/15 overflow-hidden shadow-2xl">
            <div className="relative aspect-video w-full bg-[#0B0C10] overflow-hidden">
              <img
                src={currentGalleryItem.url}
                alt={currentGalleryItem.caption}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-black/40" />

              {/* Top Overlay Bar */}
              <div className="absolute top-4 inset-x-4 flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0B0C10]/85 backdrop-blur-md border border-white/15 font-mono text-[11px] font-bold text-[#10B981]">
                  {currentGalleryItem.tag}
                </span>

                <div className="flex items-center gap-1 bg-[#0B0C10]/90 backdrop-blur-md p-1 rounded-xl border border-white/15">
                  <button
                    type="button"
                    onClick={() => setPreviewLang("tr")}
                    className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                      previewLang === "tr"
                        ? "bg-[#E11D48] text-white"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    TR AI DUBLAJ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang("en")}
                    className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                      previewLang === "en"
                        ? "bg-[#F59E0B] text-[#0B0C10]"
                        : "text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    ORİJİNAL (EN)
                  </button>
                </div>
              </div>

              {/* Bottom In-Game Dialogue Preview */}
              {(currentGalleryItem.dialoguePreviewTr ||
                currentGalleryItem.dialoguePreviewEn) && (
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-xl bg-[#0B0C10]/90 backdrop-blur-xl border border-white/15">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[#94A3B8] mb-1">
                    <span>{currentGalleryItem.caption}</span>
                    <span className="text-[#10B981]">
                      {previewLang === "tr"
                        ? "✓ RVC v2 AI TÜRKÇE SES + FONT"
                        : "ORİJİNAL İNGİLİZCE"}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#F8FAFC] italic">
                    {previewLang === "tr"
                      ? currentGalleryItem.dialoguePreviewTr
                      : currentGalleryItem.dialoguePreviewEn}
                  </p>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="p-3.5 bg-[#0B0C10] border-t border-white/10 flex items-center gap-3 overflow-x-auto">
                {gallery.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative rounded-xl overflow-hidden border transition-all cursor-pointer shrink-0 w-36 aspect-video ${
                      selectedImageIdx === idx
                        ? "border-[#10B981] ring-2 ring-[#10B981]/40"
                        : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1.5 right-1.5 truncate font-mono text-[9px] text-white bg-black/75 px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. AI Voice Clone Sample Deck */}
          <div className="rounded-2xl bg-[#13151C] border border-white/15 p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#10B981]">
                  YAPAY ZEKA (AI) SES KLONLAMA KAYITLARI
                </span>
                <h2 className="font-display text-xl font-bold text-[#F8FAFC]">
                  {product.gameTitle} — AI Türkçe Dublaj Örnekleri
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-[#94A3B8]">
                {product.aiModelInfo}
              </span>
            </div>

            <div className="space-y-3">
              {product.audioSamples.map((sample) => {
                const isSamplePlaying =
                  activeAudio?.sample.id === sample.id && activeAudio?.isPlaying;
                const activeMode =
                  activeAudio?.sample.id === sample.id ? activeAudio.mode : "tr";

                return (
                  <div
                    key={sample.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSamplePlaying
                        ? "bg-[#1C1621] border-[#E11D48] shadow-[0_0_25px_rgba(225,29,72,0.2)]"
                        : "bg-[#0B0C10] border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            isSamplePlaying
                              ? stopStudioSample()
                              : playStudioSample(
                                  sample,
                                  product.gameTitle,
                                  product.slug,
                                  "tr"
                                )
                          }
                          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                            isSamplePlaying
                              ? "bg-[#E11D48] text-white shadow-[0_0_20px_rgba(225,29,72,0.6)]"
                              : "bg-[#13151C] hover:bg-[#E11D48] text-[#F43F5E] hover:text-white border border-white/15"
                          }`}
                        >
                          {isSamplePlaying ? (
                            <Square className="w-4 h-4 fill-current" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display text-sm font-bold text-[#F8FAFC]">
                              {sample.character}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-mono text-[10px] font-semibold">
                              {sample.voiceActor}
                            </span>
                          </div>
                          <p className="font-mono text-[11px] text-[#94A3B8] mt-0.5">
                            {sample.scene} • Süre: {sample.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() =>
                            playStudioSample(
                              sample,
                              product.gameTitle,
                              product.slug,
                              "tr"
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border cursor-pointer ${
                            isSamplePlaying && activeMode === "tr"
                              ? "bg-[#E11D48] text-white border-[#E11D48]"
                              : "bg-[#13151C] text-[#94A3B8] hover:text-white border-white/10"
                          }`}
                        >
                          TR AI DUBLAJ
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            playStudioSample(
                              sample,
                              product.gameTitle,
                              product.slug,
                              "en"
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border cursor-pointer ${
                            isSamplePlaying && activeMode === "en"
                              ? "bg-[#F59E0B] text-[#0B0C10] border-[#F59E0B]"
                              : "bg-[#13151C] text-[#94A3B8] hover:text-white border-white/10"
                          }`}
                        >
                          EN ORİJİNAL
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                      <p className="text-xs sm:text-sm text-[#F8FAFC] italic">
                        &ldquo;
                        {activeMode === "en"
                          ? sample.originalQuote
                          : sample.turkishQuote}
                        &rdquo;
                      </p>
                      <div className="flex items-end gap-1 h-4">
                        {sample.waveform.map((val, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${Math.max(20, val)}%` }}
                            className={`flex-1 rounded-full ${
                              isSamplePlaying
                                ? "bg-gradient-to-t from-[#10B981] to-[#F59E0B]"
                                : "bg-white/15"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Tabbed Information: Yama Detayları / AI Ses Modelleri / Kurulum */}
          <div className="rounded-2xl bg-[#13151C] border border-white/15 overflow-hidden">
            <div className="grid grid-cols-3 border-b border-white/10 bg-[#0B0C10]">
              <button
                type="button"
                onClick={() => setActiveTab("features")}
                className={`py-4 px-3 font-display text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "features"
                    ? "border-[#10B981] text-[#F8FAFC] bg-[#13151C]"
                    : "border-transparent text-[#94A3B8] hover:text-white"
                }`}
              >
                AI Dublaj Özellikleri
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("cast")}
                className={`py-4 px-3 font-display text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "cast"
                    ? "border-[#10B981] text-[#F8FAFC] bg-[#13151C]"
                    : "border-transparent text-[#94A3B8] hover:text-white"
                }`}
              >
                AI Ses Modelleri ({product.voiceCast.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("install")}
                className={`py-4 px-3 font-display text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === "install"
                    ? "border-[#10B981] text-[#F8FAFC] bg-[#13151C]"
                    : "border-transparent text-[#94A3B8] hover:text-white"
                }`}
              >
                Ücretsiz İndirme & Kurulum
              </button>
            </div>

            <div className="p-6">
              {activeTab === "features" && (
                <div className="space-y-5">
                  <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                    {product.description}
                  </p>
                  <div className="space-y-3 pt-2">
                    <h3 className="font-mono text-xs uppercase tracking-wider text-[#10B981]">
                      YAPAY ZEKA DUBLAJ & YAMA ÖZELLİKLERİ
                    </h3>
                    {product.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0C10] border border-white/10"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-[#F8FAFC]">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "cast" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.voiceCast.map((member, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0B0C10] border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-sm font-bold text-[#F8FAFC]">
                          {member.character}
                        </span>
                        <Bot className="w-4 h-4 text-[#10B981]" />
                      </div>
                      <div className="font-mono text-xs text-[#F59E0B]">
                        Model: {member.actor}
                      </div>
                      <div className="text-[11px] font-mono text-[#94A3B8]">
                        {member.role}
                      </div>
                      <p className="text-xs italic text-[#F8FAFC]/90 pt-2 border-t border-white/5">
                        &ldquo;{member.sampleQuote}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "install" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-3 text-xs text-[#10B981]">
                    <Terminal className="w-5 h-5 shrink-0" />
                    <span>
                      Reklam geçişi sonrasında doğrudan Google Drive, GitHub Releases veya MediaFire barındırıcısına yönlendirilirsiniz.
                    </span>
                  </div>
                  <div className="space-y-3">
                    {product.installNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B0C10] border border-white/10"
                      >
                        <span className="w-6 h-6 rounded-full bg-[#10B981] text-[#0B0C10] font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-[#F8FAFC] pt-0.5">
                          {note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Free Ad-Link Download Box & Host Mirrors */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="rounded-2xl bg-[#13151C] border border-white/15 p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-6">
            {/* Top Status & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`px-3 py-1 rounded-full font-mono text-[11px] font-extrabold uppercase tracking-wider ${
                  isReady
                    ? "bg-[#10B981] text-[#0B0C10]"
                    : "bg-[#F59E0B] text-[#0B0C10]"
                }`}
              >
                {product.patchTypeLabel}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B0C10] border border-white/10 font-mono text-xs">
                <Star className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="font-bold text-[#F8FAFC]">{ratingAvg}</span>
                <span className="text-[#94A3B8]">({reviews.length} Yorum)</span>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] leading-tight">
                {product.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] mt-2 leading-relaxed">
                {product.subtitle}
              </p>
            </div>

            {/* Free Distribution Status Block */}
            <div className="p-4 rounded-xl bg-[#0B0C10] border border-[#10B981]/30 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8] block">
                  DAĞITIM MODELİ
                </span>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#10B981]">
                    %100 ÜCRETSİZ
                  </span>
                </div>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 font-mono text-xs font-bold text-[#F59E0B]">
                REKLAM GEÇ & İNDİR
              </span>
            </div>

            {/* Primary Action CTAs */}
            <div className="space-y-3">
              {isReady ? (
                <button
                  type="button"
                  onClick={() => openCheckout(product)}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-[#0B0C10] font-display font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 shadow-[0_0_30px_-5px_rgba(16,185,129,0.65)] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Reklam Geç & Barındırıcıya Yönlen</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleVoteWishlist}
                  className="w-full h-14 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-[#0B0C10] font-display font-extrabold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span>
                    {hasVoted
                      ? `Oyunuz Kaydedildi (${votes} Oy)`
                      : `Sıradaki Dublaj Olsun Diye Oy Ver (${votes})`}
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => addToCart(product, true)}
                className="w-full h-12 rounded-xl bg-[#1C1F2B] hover:bg-[#262B3D] text-[#F8FAFC] border border-white/15 font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-[#F43F5E]" />
                <span>İstek & İndirme Listeme Ekle</span>
              </button>
            </div>

            {/* Host Mirrors Preview */}
            {product.hostMirrors && product.hostMirrors.length > 0 && (
              <div className="p-4 rounded-xl bg-[#0B0C10] border border-white/10 space-y-2">
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                  AKTİF YÖNLENDİRME BARINDIRICILARI:
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.hostMirrors.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#13151C] border border-white/10 font-mono text-xs text-[#10B981]"
                    >
                      ✓ {m.provider}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical AI Telemetry Spec Table */}
            <div className="space-y-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[#94A3B8] mb-2">
                AI DUBLAJ TEKNİK BİLGİLERİ
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#10B981]" /> AI Ses Teknolojisi
                </span>
                <span className="font-mono font-semibold text-[#F8FAFC] text-right max-w-[200px] truncate">
                  {product.aiModelInfo}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#F43F5E]" /> Uyumlu Oyun Sürümü
                </span>
                <span className="font-mono font-semibold text-[#F8FAFC] text-right">
                  {product.gameVersionCompat}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#F59E0B]" /> Arşiv Boyutu
                </span>
                <span className="font-mono font-semibold text-[#F8FAFC]">
                  {product.fileSize} ({product.version})
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#F43F5E]" /> Çevrilen & Seslendirilen
                </span>
                <span className="font-mono font-semibold text-[#F8FAFC]">
                  {product.translatedLinesCount}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#10B981]" /> Toplam İndirme / Oy
                </span>
                <span className="font-mono font-semibold text-[#10B981]">
                  {isReady
                    ? `${product.downloadsCount.toLocaleString("tr-TR")} İndirme`
                    : `${votes} Oyuncu Oyu`}
                </span>
              </div>
            </div>

            {/* Admin Quick Edit Button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={openAdminModal}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#F59E0B] hover:underline cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Reklam & Barındırıcı Linkini Düzenle</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#94A3B8]">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Linkler üyelere reklam sonrası açılır</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#10B981]">
                <ShieldCheck className="w-4 h-4" /> GitHub & Drive Güvenli
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PLAYER REVIEWS & WRITE A COMMENT */}
      <section className="pt-12 border-t border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#10B981]">
                  OYUNCU YORUMLARI & GERİ BİLDİRİM
                </span>
                <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC] mt-0.5">
                  {product.gameTitle} Yorumları ({reviews.length})
                </h2>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#13151C] border border-white/10 font-mono text-sm">
                <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                <span className="font-bold text-[#F8FAFC]">{ratingAvg}</span>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#13151C] border border-white/10 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[11px] text-[#10B981] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kayıtlı Üye
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                    {rev.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {rev.comment}
                  </p>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="font-bold text-[#F8FAFC]">
                        {rev.authorName}
                      </span>{" "}
                      <span className="font-mono text-[#F59E0B]">
                        @{rev.gamerTag}
                      </span>{" "}
                      <span className="font-mono text-[11px] text-[#94A3B8]">
                        • {rev.platform} ({rev.playtimeHours} Saat)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleHelpfulVote(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-mono text-xs border transition-colors cursor-pointer ${
                        votedIds.includes(rev.id)
                          ? "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]"
                          : "bg-[#0B0C10] border-white/10 text-[#94A3B8] hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Faydalı ({rev.helpfulCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <form
              onSubmit={handleSubmitReview}
              className="p-6 rounded-2xl bg-[#13151C] border border-white/15 space-y-4"
            >
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#10B981]">
                  YORUM YAZ
                </span>
                <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
                  AI Dublaj Hakkında Görüşünüzü Paylaşın
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                    Adınız *
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Örn: Caner K."
                    className="w-full h-10 px-3 rounded-xl bg-[#0B0C10] border border-white/15 text-xs text-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                    Oyuncu Etiketi
                  </label>
                  <input
                    type="text"
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    placeholder="Örn: SophiaTR"
                    className="w-full h-10 px-3 rounded-xl bg-[#0B0C10] border border-white/15 text-xs text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                  >
                    {product.platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                    Puanınız
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-10 px-2.5 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-xs text-[#F59E0B]"
                  >
                    <option value={5}>5 ★★★★★</option>
                    <option value={4}>4 ★★★★</option>
                    <option value={3}>3 ★★★</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                    Oynama (Saat)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={playtimeHours}
                    onChange={(e) => setPlaytimeHours(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                  Yorum Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="Örn: Sophia AI dublajı ve ücretsiz indirme sistemi harika!"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0B0C10] border border-white/15 text-xs text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                  Yorumunuz *
                </label>
                <textarea
                  rows={4}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="AI ses kalitesi, çeviri ve indirme deneyiminizi yazın..."
                  className="w-full p-3.5 rounded-xl bg-[#0B0C10] border border-white/15 text-xs text-[#F8FAFC]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-[#0B0C10] font-display text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {submittingReview ? "Gönderiliyor..." : "Yorumu Yayınla"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* OTHER PROJECTS / WISHLIST */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-white/10 space-y-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#F59E0B]">
              SIRADAKİ PROJELER & İSTEK LİSTESİ
            </span>
            <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC] mt-0.5">
              Oylamadaki Diğer AI Dublaj Projeleri
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
