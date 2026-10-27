"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  UserCheck,
  Mail,
  Calendar,
  Download,
  Heart,
  LogIn,
  LogOut,
  Save,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function AccountPanel() {
  const {
    currentUser,
    setCurrentUser,
    logoutUser,
    openAuthModal,
    cart,
    showToast,
  } = useStore();

  const [displayName, setDisplayName] = useState("");
  const [gamerTag, setGamerTag] = useState("");
  const [saving, setSaving] = useState(false);

  // Üyelik iptali
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.name);
      setGamerTag(currentUser.gamerTag);
    }
  }, [currentUser]);

  /* ---------- GİRİŞ YAPILMAMIŞSA ---------- */
  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md rounded-2xl bg-[#13151C] border border-white/15 p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E11D48]/15 border border-[#E11D48]/30 flex items-center justify-center text-[#F43F5E] mx-auto">
            <UserCheck className="w-7 h-7" />
          </div>
          <h1 className="font-display text-xl font-extrabold text-[#F8FAFC]">
            Hesabını görmek için giriş yap
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Google, Yandex veya Proton Mail ile saniyeler içinde üye ol; indirme
            geçmişini ve istek listeni buradan yönet.
          </p>
          <button
            type="button"
            onClick={openAuthModal}
            className="w-full h-12 rounded-xl bg-white text-[#0B0C10] font-display font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-[#E11D48]" />
            <span>Üye Ol / Giriş Yap</span>
          </button>
          <Link
            href="/"
            className="block font-mono text-[11px] text-[#94A3B8] hover:text-white underline"
          >
            ← Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          name: displayName,
          gamerTag,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        showToast(data.message || "Profilin güncellendi.");
      } else {
        showToast(data.error || "Güncellenemedi.");
      }
    } catch {
      showToast("Bağlantı hatası.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== "EVET") {
      showToast("Onaylamak için kutuya EVET yazmalısın.");
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/auth?email=${encodeURIComponent(currentUser.email)}&confirm=EVET`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok && data.ok) {
        showToast(data.message || "Üyeliğin silindi.");
        setCurrentUser(null);
        window.location.href = "/";
      } else {
        showToast(data.error || "Üyelik silinemedi.");
      }
    } catch {
      showToast("Bağlantı hatası.");
    } finally {
      setDeleting(false);
    }
  };

  const joinDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-12 space-y-8">
      {/* Başlık */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-[#0B0C10] font-display text-xl font-extrabold shrink-0">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              {currentUser.name}
            </h1>
            <p className="font-mono text-xs text-[#10B981]">
              @{currentUser.gamerTag} • {currentUser.provider.toUpperCase()} üyesi
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logoutUser}
          className="h-11 px-5 rounded-xl bg-[#13151C] hover:bg-[#1C1F2B] border border-white/15 text-[#F8FAFC] font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Çıkış Yap</span>
        </button>
      </header>

      {/* Özet kartlar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#13151C] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-[#94A3B8]">
            <Download className="w-3.5 h-3.5 text-[#10B981]" /> İndirme
          </div>
          <div className="font-mono text-2xl font-extrabold text-[#F8FAFC]">
            {currentUser.downloadsUnlocked}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-[#13151C] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-[#94A3B8]">
            <Heart className="w-3.5 h-3.5 text-[#F43F5E]" /> İstek Listem
          </div>
          <div className="font-mono text-2xl font-extrabold text-[#F8FAFC]">
            {cart.length}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-[#13151C] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase text-[#94A3B8]">
            <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" /> Üyelik
          </div>
          <div className="font-mono text-sm font-bold text-[#F8FAFC] pt-1.5">
            {joinDate}
          </div>
        </div>
      </div>

      {/* Profil düzenleme */}
      <section className="rounded-2xl bg-[#13151C] border border-white/15 p-6 space-y-5">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#10B981]">
            PROFİL BİLGİLERİM
          </span>
          <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
            Görünen adını güncelle
          </h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">
                Görünen Ad
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0B0C10] border border-white/15 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">
                Oyuncu Etiketi
              </label>
              <input
                type="text"
                value={gamerTag}
                onChange={(e) => setGamerTag(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0B0C10] border border-white/10 flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-[#94A3B8] shrink-0" />
            <span className="font-mono text-xs text-[#94A3B8]">
              {currentUser.email}
            </span>
            <span className="ml-auto font-mono text-[10px] uppercase text-[#64748B]">
              değiştirilemez
            </span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-11 px-6 rounded-xl bg-[#10B981] text-[#0B0C10] font-display text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}</span>
          </button>
        </form>
      </section>

      {/* İstek listesi */}
      <section className="rounded-2xl bg-[#13151C] border border-white/15 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[#F43F5E]">
              TAKİP LİSTEM
            </span>
            <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
              İstek & İndirme Listem ({cart.length})
            </h2>
          </div>
          <Link
            href="/#katalog"
            className="font-mono text-xs text-[#10B981] hover:underline flex items-center gap-1"
          >
            <span>Yamalara göz at</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cart.length === 0 ? (
          <p className="text-xs text-[#94A3B8] py-4 text-center">
            Listende henüz oyun yok.
          </p>
        ) : (
          <div className="space-y-2.5">
            {cart.map((item) => (
              <Link
                key={item.productId}
                href={`/urun/${item.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#0B0C10] border border-white/10 hover:border-white/25 transition-colors"
              >
                <img
                  src={item.coverImage}
                  alt={item.gameTitle}
                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-display text-sm font-bold text-[#F8FAFC] truncate">
                    {item.gameTitle}
                  </div>
                  <div className="font-mono text-[10px] text-[#94A3B8]">
                    {item.version} • {item.fileSize}
                  </div>
                </div>
                <span
                  className={`font-mono text-[10px] font-bold px-2 py-1 rounded shrink-0 ${
                    item.status === "ready"
                      ? "bg-[#10B981]/20 text-[#10B981]"
                      : "bg-[#F59E0B]/20 text-[#F59E0B]"
                  }`}
                >
                  {item.status === "ready" ? "HAZIR" : "BEKLEMEDE"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Gizlilik bilgisi */}
      <section className="rounded-2xl bg-[#13151C] border border-[#10B981]/25 p-6 space-y-3">
        <div className="flex items-center gap-2 font-display text-base font-bold text-[#F8FAFC]">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Verilerin ve Onayın</span>
        </div>
        <ul className="space-y-2 text-xs text-[#94A3B8]">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>
              Üyelik sözleşmesini{" "}
              {currentUser.termsAcceptedAt
                ? new Date(currentUser.termsAcceptedAt).toLocaleDateString(
                    "tr-TR"
                  )
                : "kayıt sırasında"}{" "}
              tarihinde onayladın.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>
              Sadece adın ve e-postan saklanıyor; şifre veya ödeme bilgisi
              tutulmuyor.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <span>
              Üyeliğini istediğin an iptal edebilir, tüm verilerini sildirebilirsin.
            </span>
          </li>
        </ul>
        <Link
          href="/sozlesme"
          className="inline-block font-mono text-[11px] text-[#10B981] underline"
        >
          Üyelik Sözleşmesi & KVKK metnini oku →
        </Link>
      </section>

      {/* ÜYELİK İPTALİ */}
      <section className="rounded-2xl bg-[#EF4444]/5 border border-[#EF4444]/30 p-6 space-y-4">
        <div className="flex items-center gap-2 font-display text-base font-bold text-[#EF4444]">
          <AlertTriangle className="w-4 h-4" />
          <span>Üyelik İptali</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          Üyeliğini iptal edersen hesabın ve tüm kişisel verilerin{" "}
          <strong className="text-[#F8FAFC]">kalıcı olarak</strong> silinir. Bu
          işlem geri alınamaz. İndirdiğin yamalar bilgisayarında kalmaya devam
          eder.
        </p>

        {!showDeleteBox ? (
          <button
            type="button"
            onClick={() => setShowDeleteBox(true)}
            className="h-11 px-5 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/25 border border-[#EF4444]/40 text-[#EF4444] font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Üyeliğimi İptal Et</span>
          </button>
        ) : (
          <div className="space-y-3 p-4 rounded-xl bg-[#0B0C10] border border-[#EF4444]/40">
            <label className="block font-mono text-[11px] uppercase text-[#EF4444]">
              Onaylamak için kutuya <strong>EVET</strong> yaz:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="EVET"
              className="w-full h-11 px-3.5 rounded-xl bg-[#13151C] border border-[#EF4444]/40 font-mono text-sm text-[#F8FAFC] focus:outline-none focus:border-[#EF4444]"
            />
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleting || confirmText.trim().toUpperCase() !== "EVET"}
                className="h-11 px-5 rounded-xl bg-[#EF4444] text-white font-display text-xs font-extrabold uppercase flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>
                  {deleting ? "Siliniyor..." : "Hesabımı Kalıcı Olarak Sil"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteBox(false);
                  setConfirmText("");
                }}
                className="h-11 px-5 rounded-xl bg-[#13151C] border border-white/15 text-[#F8FAFC] font-mono text-xs font-bold cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </div>
        )}
      </section>

      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#13151C] border border-white/15 text-xs font-mono font-bold text-[#F8FAFC]"
      >
        ← Ana Sayfaya Dön
      </Link>
    </div>
  );
}
