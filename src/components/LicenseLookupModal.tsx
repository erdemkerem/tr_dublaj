"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  LogIn,
  Settings,
  Plus,
  CheckCircle2,
  Trash2,
  Download,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Loader2,
  User,
  Mail,
  Lock,
  ShieldCheck,
  KeyRound,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import type { Product, HostMirrorItem } from "@/db/schema";

const MAIL_PROVIDERS = [
  {
    id: "google",
    label: "Google / Gmail",
    domain: "gmail.com",
    color: "bg-white text-[#0B0C10]",
    note: "En hızlı giriş",
  },
  {
    id: "yandex",
    label: "Yandex Mail",
    domain: "yandex.com",
    color: "bg-[#FC3F1D]/20 text-[#FC3F1D] border border-[#FC3F1D]/40",
    note: "Yandex hesabı",
  },
  {
    id: "proton",
    label: "Proton Mail",
    domain: "proton.me",
    color: "bg-[#6D4AFF]/20 text-[#A78BFA] border border-[#6D4AFF]/40",
    note: "Gizlilik odaklı",
  },
] as const;

export function LicenseLookupModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    isAdminModalOpen,
    closeAdminModal,
    isLicenseModalOpen,
    closeLicenseModal,
    currentUser,
    setCurrentUser,
    isAdmin,
    loginAdmin,
    logoutAdmin,
    adminFetch,
    showToast,
  } = useStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [provider, setProvider] =
    useState<(typeof MAIL_PROVIDERS)[number]["id"]>("google");
  const [authLoading, setAuthLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const [adminTab, setAdminTab] = useState<"add" | "manage" | "backup">("add");
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [checkingKey, setCheckingKey] = useState(false);

  const [newGameTitle, setNewGameTitle] = useState("");
  const [newStatus, setNewStatus] = useState<"ready" | "in_progress" | "wishlist">(
    "ready"
  );
  const [newVersion, setNewVersion] = useState("v1.0-AI");
  const [newFileSize, setNewFileSize] = useState("2.5 GB");
  const [newAiModel, setNewAiModel] = useState("Tr_dublaj AI Ses Klonlama");
  const [newAdUrl, setNewAdUrl] = useState("https://ay.live/tr-dublaj-yeni");
  const [newHostMirrors, setNewHostMirrors] = useState<HostMirrorItem[]>([
    { provider: "", url: "", label: "" },
  ]);
  const [newGalleryImages, setNewGalleryImages] = useState<string[]>([]);
  const [newCoverImage, setNewCoverImage] = useState("");
  const [newSubtitle, setNewSubtitle] = useState("");
  const [savingPatch, setSavingPatch] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const isAnyAdminOpen = isAdminModalOpen || isLicenseModalOpen;

  const fetchProductsForAdmin = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await adminFetch("/api/products");
      const data = await res.json();
      if (data.products) setProductsList(data.products);
    } catch {
      // ignore
    } finally {
      setLoadingProducts(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    if (isAnyAdminOpen && isAdmin) {
      fetchProductsForAdmin();
    }
  }, [isAnyAdminOpen, isAdmin, fetchProductsForAdmin]);

  const handleCloseAdmin = () => {
    closeAdminModal();
    closeLicenseModal();
  };

  const handleAdminKeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingKey(true);
    const ok = await loginAdmin(keyInput);
    if (ok) setKeyInput("");
    setCheckingKey(false);
  };

  const handleProviderAuth = async (
    selected: (typeof MAIL_PROVIDERS)[number]["id"]
  ) => {
    if (!termsAccepted) {
      setConsentError(true);
      showToast(
        "Devam etmek için Üyelik Sözleşmesi ve KVKK metnini onaylamalısın."
      );
      return;
    }
    setConsentError(false);
    setProvider(selected);
    setAuthLoading(true);
    try {
      const found = MAIL_PROVIDERS.find((p) => p.id === selected);
      const typed = email.trim().toLowerCase();
      const finalEmail = typed.includes("@")
        ? typed
        : `oyuncu${Math.floor(1000 + Math.random() * 9000)}@${
            found?.domain || "gmail.com"
          }`;
      const finalName =
        name.trim() || finalEmail.split("@")[0].replace(/[._-]/g, " ");
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selected,
          name: finalName,
          email: finalEmail,
          gamerTag:
            finalName.toLowerCase().replace(/[^a-z0-9]/g, "") || "oyuncu_tr",
          termsAccepted: true,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        showToast(`Hoş geldin ${data.user.name}! Artık indirebilirsin.`);
        closeAuthModal();
      } else {
        showToast(data.error || "Giriş yapılamadı.");
      }
    } catch {
      showToast("Giriş yapılamadı.");
    } finally {
      setAuthLoading(false);
    }
  };

  const addMirror = () => {
    setNewHostMirrors((prev) => [
      ...prev,
      { provider: "", url: "", label: "Yeni Barındırıcı" },
    ]);
  };

  const removeMirror = (index: number) => {
    setNewHostMirrors((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMirrorField = (index: number, field: keyof HostMirrorItem, value: string) => {
    setNewHostMirrors((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addGalleryImage = () => {
    setNewGalleryImages((prev) => [...prev, ""]);
  };

  const removeGalleryImage = (index: number) => {
    setNewGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateGalleryImage = (index: number, value: string) => {
    setNewGalleryImages((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleCreatePatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameTitle.trim()) return;
    setSavingPatch(true);
    try {
      const res = await adminFetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameTitle: newGameTitle,
          status: newStatus,
          version: newVersion,
          fileSize: newFileSize,
          aiModelInfo: newAiModel,
          adShortlinkUrl: newAdUrl,
          hostMirrors: newHostMirrors,
          coverImage: newCoverImage,
          subtitle: newSubtitle,
          galleryImages: newGalleryImages
            .map((url) => url.trim())
            .filter(Boolean)
            .map((url) => ({
              url,
              caption: `${newGameTitle} Ekran Görüntüsü`,
              tag: "ÖNİZLEME",
            })),
        }),
      });
      if (res.ok) {
        showToast(`${newGameTitle} AI Dublaj yaması eklendi!`);
        setNewGameTitle("");
        setNewSubtitle("");
        setNewHostMirrors([
          { provider: "", url: "", label: "" },
        ]);
        setNewGalleryImages([]);
        await fetchProductsForAdmin();
      } else {
        const data = await res.json();
        showToast(data.error || "Yama eklenemedi.");
      }
    } catch {
      showToast("Yama eklenirken hata oluştu.");
    } finally {
      setSavingPatch(false);
    }
  };

  const handleQuickStatusChange = async (
    id: number,
    status: "ready" | "in_progress" | "wishlist"
  ) => {
    try {
      const res = await adminFetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showToast("Yama durumu güncellendi!");
        await fetchProductsForAdmin();
        window.location.reload();
      }
    } catch {
      showToast("Durum güncellenemedi.");
    }
  };

  const handleUpdateLinks = async (
    id: number,
    adUrl: string,
    hostUrl: string,
    hostProvider: string
  ) => {
    try {
      const res = await adminFetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          adShortlinkUrl: adUrl,
          hostUrl,
          hostProvider,
        }),
      });
      if (res.ok) {
        showToast("Linkler güncellendi!");
        await fetchProductsForAdmin();
      }
    } catch {
      showToast("Linkler güncellenemedi.");
    }
  };

  const handleDeletePatch = async (id: number, title: string) => {
    try {
      const res = await adminFetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast(`${title} silindi.`);
        setProductsList((prev) => prev.filter((p) => p.id !== id));
        window.location.reload();
      }
    } catch {
      showToast("Silinemedi.");
    }
  };

  const handleCopyBackupJson = () => {
    navigator.clipboard.writeText(JSON.stringify(productsList, null, 2));
    setCopiedJson(true);
    showToast("Yedek verisi kopyalandı!");
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadBackupJson = () => {
    const blob = new Blob([JSON.stringify(productsList, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tr_dublaj_backup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("yedek.json indirildi!");
  };

  return (
    <>
      {/* ============ ÜYE GİRİŞİ ============ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={closeAuthModal}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#0B0C10] border border-white/15 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-5 bg-[#13151C] border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#10B981]">
                  ÜCRETSİZ ÜYELİK
                </span>
                <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                  Google • Yandex • Proton ile Giriş
                </h2>
              </div>
              <button
                type="button"
                onClick={closeAuthModal}
                className="p-2 rounded-xl bg-[#0B0C10] text-[#94A3B8] hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {currentUser ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#10B981]">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Giriş yapıldı — indirmeye hazırsın!</span>
                    </div>
                    <div className="font-mono text-xs text-[#F8FAFC]">
                      {currentUser.name}
                    </div>
                    <div className="font-mono text-[11px] text-[#94A3B8]">
                      {currentUser.email} • {currentUser.provider.toUpperCase()}{" "}
                      üyesi
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="/hesabim"
                      className="h-11 rounded-xl bg-[#1C1F2B] border border-white/15 text-[#F8FAFC] font-mono text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4 text-[#10B981]" />
                      <span>Hesabım</span>
                    </a>
                    <button
                      type="button"
                      onClick={closeAuthModal}
                      className="h-11 rounded-xl bg-[#10B981] text-[#0B0C10] font-display text-xs font-extrabold uppercase cursor-pointer"
                    >
                      Yamalara Dön
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Aşağıdaki butonlardan birine bas, üyeliğin{" "}
                    <strong className="text-[#F8FAFC]">anında</strong> açılsın.
                    Şifre yok, onay maili yok. Üye olunca{" "}
                    <strong className="text-[#10B981]">
                      Resonance: A Plague Tale Legacy
                    </strong>{" "}
                    dublajını ücretsiz indirebilirsin.
                  </p>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                      consentError
                        ? "bg-[#EF4444]/10 border-[#EF4444]/50"
                        : termsAccepted
                        ? "bg-[#10B981]/10 border-[#10B981]/40"
                        : "bg-[#13151C] border-white/15"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked) setConsentError(false);
                      }}
                      className="mt-0.5 w-4 h-4 shrink-0 accent-[#10B981] cursor-pointer"
                    />
                    <span className="text-xs text-[#94A3B8] leading-relaxed">
                      <a
                        href="/sozlesme"
                        target="_blank"
                        className="text-[#10B981] underline font-semibold"
                      >
                        Üyelik Sözleşmesi
                      </a>{" "}
                      ve{" "}
                      <a
                        href="/sozlesme#kvkk"
                        target="_blank"
                        className="text-[#10B981] underline font-semibold"
                      >
                        KVKK Aydınlatma Metni
                      </a>
                      &apos;ni okudum, kabul ediyorum.{" "}
                      <span className="text-[#EF4444]">*</span>
                    </span>
                  </label>

                  {consentError && (
                    <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Üye olabilmek için yukarıdaki kutuyu işaretlemelisin.
                      </span>
                    </div>
                  )}

                  <div
                    className={`space-y-2.5 transition-opacity ${
                      termsAccepted ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider text-[#94A3B8]">
                      {termsAccepted
                        ? "✓ Onay alındı — giriş yöntemini seç"
                        : "Önce sözleşmeyi onayla"}
                    </div>
                    {MAIL_PROVIDERS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        disabled={authLoading}
                        onClick={() => handleProviderAuth(p.id)}
                        className={`w-full h-13 rounded-xl font-display font-extrabold text-xs sm:text-sm flex items-center justify-between px-5 shadow cursor-pointer disabled:opacity-60 ${p.color}`}
                      >
                        <span className="flex items-center gap-2.5">
                          {authLoading && provider === p.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogIn className="w-4 h-4" />
                          )}
                          <span>{p.label} ile Üye Ol</span>
                        </span>
                        <span className="font-mono text-[10px] opacity-70">
                          {p.note}
                        </span>
                      </button>
                    ))}
                  </div>

                  <details className="group">
                    <summary className="cursor-pointer font-mono text-[11px] uppercase text-[#94A3B8] hover:text-[#F8FAFC] select-none">
                      İsteğe bağlı: adımı ve e-postamı kendim yazayım ▾
                    </summary>
                    <div className="space-y-2.5 pt-3">
                      <div className="relative">
                        <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Oyuncu adın (boş bırakabilirsin)"
                          className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#13151C] border border-white/15 text-xs text-[#F8FAFC]"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="ornek@gmail.com (boş bırakabilirsin)"
                          className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                        />
                      </div>
                      <p className="font-mono text-[10px] text-[#64748B]">
                        Boş bırakırsan sana otomatik bir üye adresi oluşturulur.
                      </p>
                    </div>
                  </details>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ YAMA YÖNETİM PANELİ — SADECE SİTE SAHİBİ ============ */}
      {isAnyAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={handleCloseAdmin}
          />
          <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-[#0B0C10] border border-white/15 shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-5 bg-[#13151C] border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                  {isAdmin ? (
                    <Settings className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                    {isAdmin
                      ? "Yama Yönetim Paneli (Sadece Siz Görüyorsunuz)"
                      : "Kilitli Alan — Yönetici Girişi Gerekli"}
                  </h2>
                  <p className="text-xs font-mono text-[#94A3B8]">
                    İndirme linkleri üyelere kapalıdır
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseAdmin}
                className="p-2 rounded-xl bg-[#0B0C10] text-[#94A3B8] hover:text-white border border-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAdmin ? (
              <form onSubmit={handleAdminKeyLogin} className="p-6 space-y-4">
                <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444] flex items-start gap-3">
                  <EyeOff className="w-5 h-5 shrink-0" />
                  <span>
                    Bu panel yalnızca site sahibine açıktır. Üyeler ve ziyaretçiler ne bu paneli ne de indirme linklerini görebilir.
                  </span>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">
                    Yönetici Anahtarı
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="ADMIN_SECRET_KEY"
                      className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#13151C] border border-white/15 font-mono text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={checkingKey}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{checkingKey ? "Doğrulanıyor..." : "Kilidi Aç"}</span>
                </button>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-3 bg-[#0B0C10] border-b border-white/10 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => setAdminTab("add")}
                    className={`py-3.5 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                      adminTab === "add"
                        ? "border-[#E11D48] text-[#F8FAFC] bg-[#13151C]"
                        : "border-transparent text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    + Yeni AI Dublaj Ekle
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab("manage")}
                    className={`py-3.5 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                      adminTab === "manage"
                        ? "border-[#E11D48] text-[#F8FAFC] bg-[#13151C]"
                        : "border-transparent text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    Yamalar & Linkler ({productsList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab("backup")}
                    className={`py-3.5 px-4 font-bold border-b-2 transition-colors cursor-pointer ${
                      adminTab === "backup"
                        ? "border-[#E11D48] text-[#F8FAFC] bg-[#13151C]"
                        : "border-transparent text-[#94A3B8] hover:text-white"
                    }`}
                  >
                    Yedek & Çıkış
                  </button>
                </div>

                <div className="p-6 max-h-[72vh] overflow-y-auto">
                  {adminTab === "add" && (
                    <form onSubmit={handleCreatePatch} className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#10B981]">
                        Yeni bir oyunun AI dublajını bitirdiğinizde buradan 20 saniyede yayına alın. Girdiğiniz linkler şifreli şekilde sadece sunucuda tutulur.
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            Oyun Adı *
                          </label>
                          <input
                            type="text"
                            required
                            value={newGameTitle}
                            onChange={(e) => setNewGameTitle(e.target.value)}
                            placeholder="Örn: A Plague Tale: Requiem"
                            className="w-full h-11 px-3.5 rounded-xl bg-[#13151C] border border-white/15 text-xs text-[#F8FAFC]"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            Yama Durumu *
                          </label>
                          <select
                            value={newStatus}
                            onChange={(e) =>
                              setNewStatus(
                                e.target.value as
                                  | "ready"
                                  | "in_progress"
                                  | "wishlist"
                              )
                            }
                            className="w-full h-11 px-3.5 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                          >
                            <option value="ready">HAZIR • YAYINDA</option>
                            <option value="in_progress">YAPIM AŞAMASINDA</option>
                            <option value="wishlist">İSTEK LİSTESİ</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            AI Modeli
                          </label>
                          <input
                            type="text"
                            value={newAiModel}
                            onChange={(e) => setNewAiModel(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            Sürüm
                          </label>
                          <input
                            type="text"
                            value={newVersion}
                            onChange={(e) => setNewVersion(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            Dosya Boyutu
                          </label>
                          <input
                            type="text"
                            value={newFileSize}
                            onChange={(e) => setNewFileSize(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#F59E0B] mb-1">
                            🔒 İndirme Linki (Gizli)
                          </label>
                          <input
                            type="text"
                            value={newAdUrl}
                            onChange={(e) => setNewAdUrl(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-[#13151C] border border-[#F59E0B]/30 font-mono text-xs text-[#F8FAFC]"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#10B981] mb-1">
                            🔒 Barındırıcıları
                          </label>
                          <div className="space-y-2">
                            {newHostMirrors.map((mirror, i) => (
                              <div key={i} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Sağlayıcı (örn. Gofile)"
                                  value={mirror.provider}
                                  onChange={(e) =>
                                    updateMirrorField(i, "provider", e.target.value)}
                                  className="flex-1 h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                                />
                                <input
                                  type="text"
                                  placeholder="İndirme linki"
                                  value={mirror.url}
                                  onChange={(e) =>
                                    updateMirrorField(i, "url", e.target.value)}
                                  className="flex-2 h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeMirror(i)}
                                  disabled={newHostMirrors.length === 1}
                                  className="h-10 px-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs hover:bg-[#EF4444]/30 transition"
                                >
                                  Sil
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addMirror}
                              className="w-full h-9 px-3 rounded-lg bg-[#13151C] border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono hover:bg-[#F59E0B]/10 transition"
                            >
                              <Plus className="w-3 h-3" /> Barındırıcı Ekle
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            Kapak Görseli URL
                          </label>
                          <input
                            type="text"
                            value={newCoverImage}
                            onChange={(e) => setNewCoverImage(e.target.value)}
                            placeholder="https://example.com/resim.jpg"
                            className="w-full h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            Kısa Açıklama
                          </label>
                          <input
                            type="text"
                            value={newSubtitle}
                            onChange={(e) => setNewSubtitle(e.target.value)}
                            placeholder="Orijinal ses klonlu ücretsiz AI Türkçe dublaj"
                            className="w-full h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 text-xs text-[#F8FAFC]"
                          />
                        </div>
                      </div>

                      <div>
                          <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1">
                            Galeri Görselleri (Link Ekle)
                          </label>
                          <div className="space-y-2">
                            {newGalleryImages.map((url, i) => (
                              <div key={i} className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="https://example.com/ekran-gorseli.jpg"
                                  value={url}
                                  onChange={(e) => updateGalleryImage(i, e.target.value)}
                                  className="flex-1 h-10 px-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryImage(i)}
                                  className="h-10 px-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs hover:bg-[#EF4444]/30 transition"
                                >
                                  Sil
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addGalleryImage}
                              className="w-full h-9 px-3 rounded-lg bg-[#13151C] border border-white/15 text-[#94A3B8] text-xs font-mono hover:text-[#F8FAFC] hover:border-[#F59E0B]/40 transition"
                            >
                              <Plus className="w-3 h-3" /> Görsel Ekle
                            </button>
                          </div>
                        </div>

                      <button
                        type="submit"
                        disabled={savingPatch}
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          {savingPatch ? "Ekleniyor..." : "AI Dublaj Yamasını Kaydet & Yayınla"}
                        </span>
                      </button>
                    </form>
                  )}

                  {adminTab === "manage" && (
                    <div className="space-y-3">
                      {loadingProducts ? (
                        <div className="py-8 text-center font-mono text-xs text-[#94A3B8]">
                          Yükleniyor...
                        </div>
                      ) : (
                        productsList.map((prod) => (
                          <div
                            key={prod.id}
                            className="p-4 rounded-xl bg-[#13151C] border border-white/10 space-y-3"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.coverImage}
                                  alt={prod.gameTitle}
                                  className="w-12 h-12 rounded-lg object-cover shrink-0"
                                />
                                <div>
                                  <div className="font-display text-sm font-bold text-[#F8FAFC]">
                                    {prod.gameTitle}
                                  </div>
                                  <div className="font-mono text-[11px] text-[#94A3B8]">
                                    {prod.version} • {prod.fileSize}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <select
                                  value={prod.status}
                                  onChange={(e) =>
                                    handleQuickStatusChange(
                                      prod.id,
                                      e.target.value as
                                        | "ready"
                                        | "in_progress"
                                        | "wishlist"
                                    )
                                  }
                                  className="h-9 px-2.5 rounded-lg bg-[#0B0C10] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                                >
                                  <option value="ready">Hazır (Yayında)</option>
                                  <option value="in_progress">Yapımda</option>
                                  <option value="wishlist">İstek Listesi</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDeletePatch(prod.id, prod.gameTitle)
                                  }
                                  className="p-2 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444]/30 text-[#EF4444] cursor-pointer"
                                  title="Sil"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/5">
                              <input
                                type="text"
                                defaultValue={prod.adShortlinkUrl}
                                id={`ad-${prod.id}`}
                                placeholder="🔒 İndirme linki"
                                className="h-9 px-2.5 rounded-lg bg-[#0B0C10] border border-[#F59E0B]/30 font-mono text-[11px] text-[#F8FAFC]"
                              />
                              <input
                                type="text"
                                defaultValue={prod.hostMirrors?.[0]?.url || ""}
                                id={`host-${prod.id}`}
                                placeholder="🔒 Barındırıcı linki"
                                className="h-9 px-2.5 rounded-lg bg-[#0B0C10] border border-[#10B981]/30 font-mono text-[11px] text-[#F8FAFC]"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const adEl = document.getElementById(
                                    `ad-${prod.id}`
                                  ) as HTMLInputElement | null;
                                  const hostEl = document.getElementById(
                                    `host-${prod.id}`
                                  ) as HTMLInputElement | null;
                                  handleUpdateLinks(
                                    prod.id,
                                    adEl?.value || prod.adShortlinkUrl,
                                    hostEl?.value ||
                                      prod.hostMirrors?.[0]?.url ||
                                      "",
                                    prod.hostMirrors?.[0]?.provider ||
                                      "Barındırıcı"
                                  );
                                }}
                                className="h-9 rounded-lg bg-[#1C1F2B] hover:bg-[#262B3D] border border-white/15 font-mono text-[11px] font-bold text-[#F8FAFC] cursor-pointer"
                              >
                                Linkleri Güncelle
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {adminTab === "backup" && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-[#13151C] border border-white/10 space-y-2">
                        <div className="flex items-center gap-2 font-display text-sm font-bold text-[#F8FAFC]">
                          <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                          <span>Yedek & Taşıma</span>
                        </div>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                          Tüm yamalarınızı ve gizli linklerinizi{" "}
                          <code className="text-[#10B981]">backup.json</code>{" "}
                          olarak yedekleyin. Bu dosyayı sunucunuzda saklayabilirsiniz.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={handleCopyBackupJson}
                          className="h-11 px-5 rounded-xl bg-[#1C1F2B] hover:bg-[#262B3D] text-[#F8FAFC] border border-white/15 font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                        >
                          {copiedJson ? (
                            <>
                              <Check className="w-4 h-4 text-[#10B981]" />
                              <span>Kopyalandı!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>JSON Kopyala</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadBackupJson}
                          className="h-11 px-5 rounded-xl bg-[#10B981] text-[#0B0C10] font-mono text-xs font-extrabold flex items-center gap-2 cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>backup.json İndir</span>
                        </button>

                        <a
                          href="/yayinlama"
                          className="h-11 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-[#F8FAFC] border border-white/10 font-mono text-xs flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Yayınlama Rehberi</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            logoutAdmin();
                            handleCloseAdmin();
                          }}
                          className="h-11 px-5 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] font-mono text-xs font-bold flex items-center gap-2 cursor-pointer"
                        >
                          <Lock className="w-4 h-4" />
                          <span>Yönetici Çıkışı</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}