"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Volume2,
  Square,
  Sparkles,
  Search,
  Star,
  Bot,
  ThumbsUp,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  Heart,
  Plus,
  Settings,
  LogIn,
  Send,
  HardDrive,
} from "lucide-react";
import type { Product, Review, GameRequest } from "@/db/schema";
import { useStore } from "@/context/StoreContext";
import { ProductCard } from "./ProductCard";

interface HomeStorefrontProps {
  initialProducts: Product[];
  initialReviews: (Review & { gameTitle?: string; productSlug?: string })[];
  initialGameRequests?: GameRequest[];
}

export function HomeStorefront({
  initialProducts,
  initialReviews,
  initialGameRequests = [],
}: HomeStorefrontProps) {
  const {
    addToCart,
    openCheckout,
    openAuthModal,
    openAdminModal,
    currentUser,
    isAdmin,
    activeAudio,
    playStudioSample,
    stopStudioSample,
    showToast,
  } = useStore();

  // Resonance: A Plague Tale Legacy is the #1 Ready Hero Spotlight
  const readyProducts = useMemo(
    () => initialProducts.filter((p) => p.status === "ready"),
    [initialProducts]
  );
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDialogueLang, setHeroDialogueLang] = useState<"tr" | "en">("tr");

  const activeHeroProduct =
    readyProducts[heroIndex] || initialProducts[0];
  const heroSample = activeHeroProduct?.audioSamples?.[0];
  const isHeroPlaying =
    Boolean(heroSample) &&
    activeAudio?.sample.id === heroSample?.id &&
    activeAudio?.isPlaying;

  // Catalog Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("ready-first");

  // Community Game Requests (İstek Listesi & Oylama)
  const [requestsList, setRequestsList] =
    useState<GameRequest[]>(initialGameRequests);
  const [votedRequestIds, setVotedRequestIds] = useState<number[]>([]);
  const [reqGameTitle, setReqGameTitle] = useState("");
  const [reqNote, setReqNote] = useState("");
  const [submittingReq, setSubmittingReq] = useState(false);

  // Reviews helpful voting
  const [reviewsList, setReviewsList] = useState(initialReviews);
  const [votedReviewIds, setVotedReviewIds] = useState<number[]>([]);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    if (selectedStatus !== "all") {
      list = list.filter((p) => p.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.gameTitle.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q)
      );
    }

    if (sortBy === "votes") {
      list.sort((a, b) => (b.wishlistVotes || 0) - (a.wishlistVotes || 0));
    } else if (sortBy === "downloads") {
      list.sort((a, b) => b.downloadsCount - a.downloadsCount);
    } else {
      // Ready games first!
      list.sort((a, b) => {
        const score = (s: string) =>
          s === "ready" ? 3 : s === "in_progress" ? 2 : 1;
        return score(b.status) - score(a.status) || a.id - b.id;
      });
    }

    return list;
  }, [initialProducts, selectedStatus, searchQuery, sortBy]);

  const handleVoteGameRequest = async (id: number) => {
    if (votedRequestIds.includes(id)) {
      showToast("Bu istek için zaten oy verdiniz!");
      return;
    }
    setVotedRequestIds((prev) => [...prev, id]);
    setRequestsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, votes: r.votes + 1 } : r))
    );
    showToast("İstek listesi oyunuz kaydedildi!");
    try {
      await fetch("/api/wishlist-requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch {
      // keep optimistic state
    }
  };

  const handleSubmitGameRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqGameTitle.trim()) return;
    setSubmittingReq(true);

    try {
      const res = await fetch("/api/wishlist-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: reqGameTitle,
          requesterName: currentUser
            ? `${currentUser.name} (@${currentUser.gamerTag})`
            : "Oyuncu_TR",
          requesterProvider: currentUser
            ? `${currentUser.provider.toUpperCase()} Üyesi`
            : "Google Üyesi",
          note:
            reqNote.trim() ||
            `${reqGameTitle} için yapay zekâ (AI) Türkçe dublaj yapılmasını istiyorum!`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.request) {
        setRequestsList((prev) => [data.request, ...prev]);
        setReqGameTitle("");
        setReqNote("");
        showToast(
          `${reqGameTitle} AI dublaj istek listesine eklendi! Diğer oyuncular artık oy verebilir.`
        );
      }
    } catch {
      showToast("İstek eklenirken bir hata oluştu.");
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleHelpfulVote = async (reviewId: number) => {
    if (votedReviewIds.includes(reviewId)) return;
    setVotedReviewIds((prev) => [...prev, reviewId]);
    setReviewsList((prev) =>
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

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION: RESONANCE: A PLAGUE TALE LEGACY (FIRST READY AI DUBBING) */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0 opacity-35"
          style={{
            background:
              "radial-gradient(circle at 75% 25%, rgba(16, 185, 129, 0.22), transparent 55%), radial-gradient(circle at 20% 80%, rgba(225, 29, 72, 0.22), transparent 50%)",
          }}
        />

        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: AI Dubbing Pitch & Free Ad-Link Download CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#13151C] border border-[#10B981]/50 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                <span className="font-mono text-xs font-extrabold uppercase tracking-wider text-[#10B981]">
                  İLK HAZIR AI DUBLAJ YAYINDA ({readyProducts.length} OYUN HAZIR)
                </span>
                <span className="text-white/20">•</span>
                <span className="font-mono text-xs text-[#F59E0B]">
                  %100 ÜCRETSİZ (REKLAM GEÇ & İNDİR)
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#F8FAFC] tracking-tight leading-[1.08]">
                {activeHeroProduct.gameTitle}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#F43F5E]">
                  Yapay Zeka (AI) Türkçe Dublaj
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#94A3B8] max-w-[62ch] leading-relaxed">
                Stüdyo değil, <strong className="text-[#F8FAFC]">RVC v2 ve Tr_dublaj Yapay Zekâ Ses Klonlama</strong> ile karakterlerin orijinal ses tonu korunarak hazırlandı! Şu anda{" "}
                <strong className="text-[#10B981]">
                  Resonance: A Plague Tale Legacy
                </strong>{" "}
                tamamen hazır. Google ile tek tıkla üye olun, kısa reklam linkini geçerek doğrudan{" "}
                <strong className="text-[#F8FAFC]">
                  Google Drive, GitHub Releases veya MediaFire
                </strong>{" "}
                barındırıcısından ücretsiz indirin!
              </p>

              {/* AI Dubbing Telemetry Metrics */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-xl pt-1">
                <div className="p-3.5 rounded-xl bg-[#13151C]/90 border border-white/10">
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-[#10B981]">
                    ÜCRETSİZ
                  </div>
                  <div className="font-mono text-[11px] text-[#94A3B8] uppercase">
                    Reklam Geç & İndir
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#13151C]/90 border border-white/10">
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-[#F59E0B]">
                    RVC v2 + AI
                  </div>
                  <div className="font-mono text-[11px] text-[#94A3B8] uppercase">
                    Orijinal Ses Klonu
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#13151C]/90 border border-white/10">
                  <div className="font-mono text-lg sm:text-xl font-extrabold text-[#F8FAFC]">
                    {activeHeroProduct.fileSize}
                  </div>
                  <div className="font-mono text-[11px] text-[#94A3B8] uppercase">
                    Drive & GitHub
                  </div>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={() => openCheckout(activeHeroProduct)}
                  className="h-13 px-7 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-[#0B0C10] font-display font-extrabold text-sm sm:text-base tracking-wide inline-flex items-center gap-3 shadow-[0_0_35px_-5px_rgba(16,185,129,0.65)] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Ücretsiz İndir (Reklam Geç & Barındırıcıya Git)</span>
                </button>

                {heroSample && (
                  <button
                    type="button"
                    onClick={() =>
                      isHeroPlaying
                        ? stopStudioSample()
                        : playStudioSample(
                            heroSample,
                            activeHeroProduct.gameTitle,
                            activeHeroProduct.slug,
                            "tr"
                          )
                    }
                    className={`h-13 px-6 rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center gap-2.5 border transition-all cursor-pointer ${
                      isHeroPlaying
                        ? "bg-[#E11D48] text-white border-[#E11D48] shadow-[0_0_25px_rgba(225,29,72,0.5)]"
                        : "bg-[#13151C] hover:bg-[#1C1F2B] text-[#F8FAFC] border-white/20"
                    }`}
                  >
                    {isHeroPlaying ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>AI Sesi Durdur</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#F43F5E]" />
                        <span>Sophia AI Türkçe Sesini Dinle</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => addToCart(activeHeroProduct, true)}
                  className="h-13 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-[#F8FAFC] inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-[#F43F5E]" />
                  <span>İstek Listeme Ekle</span>
                </button>
              </div>

              {/* Member & Admin Quick Strip */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-[#94A3B8]">
                {!currentUser ? (
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="inline-flex items-center gap-1.5 text-[#F8FAFC] hover:text-[#10B981] underline cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Üye Girişi</span>
                  </button>
                ) : (
                  <span className="text-[#10B981]">
                    ✓ Aktif Üye: {currentUser.name} ({currentUser.provider.toUpperCase()})
                  </span>
                )}
                {isAdmin && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={openAdminModal}
                      className="inline-flex items-center gap-1.5 text-[#F59E0B] hover:underline cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Yönetim Paneli</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Right Column: Resonance: A Plague Tale Legacy Visual Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-2xl bg-[#13151C] border border-[#10B981]/40 shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={activeHeroProduct.coverImage}
                    alt={activeHeroProduct.gameTitle}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#10B981] text-[#0B0C10] font-mono text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {activeHeroProduct.patchTypeLabel}
                    </span>
                    <div className="flex items-center gap-1 bg-[#0B0C10]/85 backdrop-blur-md p-1 rounded-lg border border-white/15">
                      <button
                        type="button"
                        onClick={() => setHeroDialogueLang("tr")}
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer ${
                          heroDialogueLang === "tr"
                            ? "bg-[#E11D48] text-white"
                            : "text-[#94A3B8]"
                        }`}
                      >
                        TR AI DUBLAJ
                      </button>
                      <button
                        type="button"
                        onClick={() => setHeroDialogueLang("en")}
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold cursor-pointer ${
                          heroDialogueLang === "en"
                            ? "bg-[#F59E0B] text-[#0B0C10]"
                            : "text-[#94A3B8]"
                        }`}
                      >
                        EN ORİJİNAL
                      </button>
                    </div>
                  </div>

                  {/* In-Game Dialogue Preview */}
                  {heroSample && (
                    <div className="absolute bottom-3 inset-x-3.5 p-3.5 rounded-xl bg-[#0B0C10]/90 backdrop-blur-xl border border-white/15">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <span className="text-[#F43F5E] font-bold flex items-center gap-1.5">
                          <Bot className="w-3.5 h-3.5 text-[#10B981]" />
                          {heroSample.character}
                        </span>
                        <span className="text-[#10B981]">
                          {heroDialogueLang === "tr"
                            ? "RVC v2 TÜRKÇE SES KLONU"
                            : "ORİJİNAL İNGİLİZCE"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#F8FAFC] font-medium italic">
                        &ldquo;
                        {heroDialogueLang === "tr"
                          ? heroSample.turkishQuote
                          : heroSample.originalQuote}
                        &rdquo;
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Card Info */}
                <div className="p-4 bg-[#13151C] border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-display text-base font-bold text-[#F8FAFC]">
                      {activeHeroProduct.gameTitle}
                    </div>
                    <div className="font-mono text-xs text-[#94A3B8]">
                      Barındırıcı: Google Drive • GitHub Releases • MediaFire
                    </div>
                  </div>
                  <Link
                    href={`/urun/${activeHeroProduct.slug}`}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-bold text-[#F8FAFC] flex items-center gap-1.5 shrink-0"
                  >
                    <span>Görseller & Detay</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </Link>
                </div>
              </div>

              {/* Ready Games Switcher if owner adds more ready games */}
              {readyProducts.length > 1 && (
                <div className="grid grid-cols-2 gap-2.5">
                  {readyProducts.map((prod, idx) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => setHeroIndex(idx)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                        heroIndex === idx
                          ? "bg-[#1C1F2B] border-[#10B981]"
                          : "bg-[#13151C]/70 border-white/10"
                      }`}
                    >
                      <img
                        src={prod.coverImage}
                        alt={prod.gameTitle}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-display text-xs font-bold text-[#F8FAFC] truncate">
                          {prod.gameTitle}
                        </div>
                        <div className="font-mono text-[10px] text-[#10B981]">
                          HAZIR • ÜCRETSİZ
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI DUBBING CATALOG & EASY MANAGEMENT */}
      <section
        id="katalog"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 scroll-mt-24"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#10B981]">
              ŞU AN 1 HAZIR OYUN (RESONANCE) • DEVAMLI YENİLERİ EKLENİYOR
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-1">
              Hazır AI Dublaj & Sıradaki Projeler
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <button
                type="button"
                onClick={openAdminModal}
                className="h-10 px-4 rounded-xl bg-[#F59E0B]/20 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-[#0B0C10] border border-[#F59E0B]/40 font-mono text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Yaptığın Oyunu Ekle / Düzenle</span>
              </button>
            ) : (
              <span className="h-10 px-4 rounded-xl bg-[#13151C] border border-white/10 font-mono text-xs text-[#94A3B8] inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>Yeni AI dublajlar eklendikçe burada yayınlanır</span>
              </span>
            )}
          </div>
        </div>

        {/* Filter & Status Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#13151C] border border-white/10 mb-8 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Oyun ara (Örn: Resonance: A Plague Tale Legacy, Requiem, Cyberpunk)..."
                className="w-full h-11 pl-11 pr-4 rounded-xl bg-[#0B0C10] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sıralama"
                className="w-full h-11 px-3.5 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
              >
                <option value="ready-first">
                  Sıralama: Önce Hazır Olanlar (Resonance)
                </option>
                <option value="votes">En Çok Oy Alan İstekler</option>
                <option value="downloads">En Çok İndirilenler</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] uppercase text-[#94A3B8] mr-1">
                Durum Filtresi:
              </span>
              {[
                { id: "all", label: `Tümü (${initialProducts.length})` },
                {
                  id: "ready",
                  label: `✓ Hazır & İndirilebilir (${readyProducts.length} Oyun - Resonance)`,
                },
                {
                  id: "in_progress",
                  label: "AI Eğitiliyor / Yapımda",
                },
                {
                  id: "wishlist",
                  label: "İstek Listesi & Oylama",
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                    selectedStatus === tab.id
                      ? tab.id === "ready"
                        ? "bg-[#10B981] text-[#0B0C10] font-extrabold shadow"
                        : "bg-[#E11D48] text-white font-bold shadow"
                      : "bg-[#0B0C10] text-[#94A3B8] hover:text-white border border-white/10"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {(selectedStatus !== "all" || searchQuery.trim() !== "") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-xs font-mono text-[#94A3B8] hover:text-white cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sıfırla</span>
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. COMMUNITY WISHLIST & REQUEST A GAME FOR AI DUBBING */}
      <section
        id="istek-listesi"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 scroll-mt-24"
      >
        <div className="rounded-3xl bg-gradient-to-br from-[#13151C] via-[#101218] to-[#1A1320] border border-white/15 p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 Cols: Live Voting Board */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#F59E0B]">
                  SIRADAKİ AI DUBLAJI SEN BELİRLE
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1">
                  Oyuncu İstek Listesi & Canlı Oylama
                </h2>
                <p className="text-xs sm:text-sm text-[#94A3B8] mt-1.5">
                  <strong>Resonance: A Plague Tale Legacy</strong> tamamlandı! Sıradaki yapay zekâ Türkçe dublajın hangi oyuna yapılmasını istiyorsanız aşağıdan oy verin veya yeni oyun ekleyin.
                </p>
              </div>

              <div className="space-y-3">
                {requestsList.map((req, idx) => {
                  const isVoted = votedRequestIds.includes(req.id);
                  return (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl bg-[#0B0C10]/90 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-[#E11D48]/20 text-[#F43F5E] font-mono text-xs font-bold flex items-center justify-center">
                            #{idx + 1}
                          </span>
                          <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                            {req.gameTitle}
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-mono text-[10px] font-semibold">
                            {req.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          &ldquo;{req.note}&rdquo;
                        </p>
                        <div className="font-mono text-[10px] text-[#64748B]">
                          İsteyen: {req.requesterName} ({req.requesterProvider}) •{" "}
                          {req.aiDifficulty}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleVoteGameRequest(req.id)}
                        className={`h-11 px-4 rounded-xl font-mono text-xs font-bold inline-flex items-center gap-2 shrink-0 border transition-all cursor-pointer ${
                          isVoted
                            ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                            : "bg-[#13151C] hover:bg-[#E11D48] text-[#F8FAFC] border-white/15"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{req.votes} Oy</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 5 Cols: Submit New Game Request Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSubmitGameRequest}
                className="p-6 rounded-2xl bg-[#0B0C10] border border-white/15 space-y-4 shadow-2xl"
              >
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#10B981]">
                    İSTEK LİSTESİNE OYUN EKLE
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#F8FAFC] mt-0.5">
                    Hangi Oyuna AI Dublaj Yapalım?
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    İstediğiniz oyunu listeye ekleyin, en çok oy alan oyunları sırayla ücretsiz AI Türkçe dublaj yapıp yayınlayalım.
                  </p>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">
                    İstediğiniz Oyun Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={reqGameTitle}
                    onChange={(e) => setReqGameTitle(e.target.value)}
                    placeholder="Örn: Kingdom Come: Deliverance II"
                    className="w-full h-11 px-4 rounded-xl bg-[#13151C] border border-white/15 text-xs sm:text-sm text-[#F8FAFC] focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">
                    Notunuz / Neden Bu Oyun?
                  </label>
                  <textarea
                    rows={3}
                    value={reqNote}
                    onChange={(e) => setReqNote(e.target.value)}
                    placeholder="Örn: Diyalogları çok yoğun, AI Türkçe dublaj ile oynamak harika olur..."
                    className="w-full p-3.5 rounded-xl bg-[#13151C] border border-white/15 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#E11D48]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReq}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] hover:brightness-110 text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submittingReq
                      ? "Listeye Ekleniyor..."
                      : "İstek Listesine Ekle & Oy Başlat"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW AI DUBBING & AD-REDIRECT SYSTEM WORKS */}
      <section
        id="ai-teknolojisi"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 scroll-mt-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#13151C] border border-white/10 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center justify-center text-[#F43F5E]">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
              1. Yapay Zeka (AI) Orijinal Ses Klonlama
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Stüdyo yerine RVC v2, Tr_dublaj ve XTTS-v2 yapay zekâ modelleriyle oyunun kendi karakter seslerini klonluyoruz. Böylece Sophia gibi karakterler kendi orijinal ses rengiyle Türkçe konuşuyor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13151C] border border-white/10 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
              2. %100 Ücretsiz & Reklam Tıklama Desteği
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Yamalarımız için hiçbir ücret talep etmiyoruz. Oyuncular Google ile otomatik üye olup sadece 5 saniyelik reklam linkini geçerek yeni AI dublajların üretilmesine ücretsiz destek oluyor.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#13151C] border border-white/10 space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#F8FAFC]">
              3. GitHub & Bulut Barındırıcıya Yönlendirme
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Reklam adımını geçen oyuncular doğrudan yüksek hızlı Google Drive, GitHub Releases, MediaFire veya Mega.nz barındırıcısına yönlendirilir ve yamayı beklemeden indirir.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PLAYER REVIEWS FOR RESONANCE: A PLAGUE TALE LEGACY */}
      <section
        id="yorumlar"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 scroll-mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#10B981]">
              RESONANCE: A PLAGUE TALE LEGACY OYUNCU YORUMLARI
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] mt-1">
              İndiren Oyuncular Ne Diyor?
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#13151C] border border-white/10 font-mono text-xs">
            <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-[#F8FAFC] font-bold">5.0 / 5.0</span>
            <span className="text-[#94A3B8]">• %100 Ücretsiz AI Yama</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-[#13151C] border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]"
                      />
                    ))}
                  </div>
                  {rev.productSlug && (
                    <Link
                      href={`/urun/${rev.productSlug}`}
                      className="font-mono text-[11px] text-[#10B981] hover:underline truncate max-w-[220px]"
                    >
                      {rev.gameTitle}
                    </Link>
                  )}
                </div>

                <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                  &ldquo;{rev.title}&rdquo;
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F8FAFC]">
                    <span>{rev.authorName}</span>
                    <span className="font-mono text-[11px] text-[#F59E0B]">
                      @{rev.gamerTag}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  </div>
                  <div className="font-mono text-[10px] text-[#94A3B8] mt-0.5">
                    {rev.platform} • {rev.playtimeHours} Saat Oynadı
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleHelpfulVote(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] border transition-colors cursor-pointer ${
                    votedReviewIds.includes(rev.id)
                      ? "bg-[#10B981]/20 border-[#10B981]/40 text-[#10B981]"
                      : "bg-[#0B0C10] border-white/10 text-[#94A3B8] hover:text-white"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{rev.helpfulCount}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
