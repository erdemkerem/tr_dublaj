"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  User,
  Mail,
  ArrowRight,
  Loader2,
  MousePointerClick,
  HardDrive,
  LogIn,
  Clock,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function CheckoutModal() {
  const {
    cart,
    isCheckoutOpen,
    closeCheckout,
    activeDownloadProduct,
    currentUser,
    setCurrentUser,
    showToast,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2: Ad Click & Countdown state
  const [adClicked, setAdClicked] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [adVerified, setAdVerified] = useState(false);

  const targetTitle =
    activeDownloadProduct?.gameTitle ||
    cart.find((i) => i.status === "ready")?.gameTitle ||
    "Resonance: A Plague Tale Legacy";

  const targetVersion =
    activeDownloadProduct?.version ||
    cart.find((i) => i.status === "ready")?.version ||
    "v1.2.0-AI";

  const targetFileSize =
    activeDownloadProduct?.fileSize ||
    cart.find((i) => i.status === "ready")?.fileSize ||
    "2.8 GB";

  const targetProductId =
    activeDownloadProduct?.id ||
    cart.find((i) => i.status === "ready")?.productId ||
    0;

  // Linkler sayfa kaynağında YOK; sadece reklam adımı sonrası sunucudan gelir.
  const [targetAdLink, setTargetAdLink] = useState("");
  const [targetMirrors, setTargetMirrors] = useState<
    { provider: string; url: string; label: string }[]
  >([]);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  useEffect(() => {
    if (isCheckoutOpen) {
      if (currentUser) {
        setStep(2);
      } else {
        setStep(1);
      }
      setAdClicked(false);
      setCountdown(5);
      setAdVerified(false);
      setTargetMirrors([]);
      setTargetAdLink("");
      setUnlockError(null);
    }
  }, [isCheckoutOpen, currentUser]);

  useEffect(() => {
    if (!adClicked || adVerified) return;
    if (countdown <= 0) {
      setAdVerified(true);
      // Gerçek linkleri sadece şimdi, üye + reklam doğrulamasıyla sunucudan al.
      (async () => {
        try {
          const res = await fetch("/api/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: targetProductId,
              email: currentUser?.email || memberEmail,
              adCompleted: true,
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setUnlockError(data.error || "Linkler açılamadı.");
            return;
          }
          setTargetAdLink(data.adShortlinkUrl || "");
          setTargetMirrors(data.hostMirrors || []);
          setStep(3);
          showToast("Doğrulama tamamlandı! Barındırıcı linkleri açıldı.");
        } catch {
          setUnlockError("Sunucuya bağlanılamadı, tekrar deneyin.");
        }
      })();
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    adClicked,
    countdown,
    adVerified,
    showToast,
    targetProductId,
    currentUser,
    memberEmail,
  ]);

  if (!isCheckoutOpen) return null;

  const handleQuickOAuthLogin = async (
    provider: "google" | "yandex" | "proton"
  ) => {
    if (!termsAccepted) {
      showToast(
        "Devam etmek için Üyelik Sözleşmesi ve KVKK metnini onaylamalısın."
      );
      return;
    }
    setIsLoggingIn(true);
    try {
      const domain =
        provider === "google"
          ? "gmail.com"
          : provider === "yandex"
          ? "yandex.com"
          : "proton.me";

      const typed = memberEmail.trim().toLowerCase();
      const finalEmail = typed.includes("@")
        ? typed
        : `oyuncu${Math.floor(1000 + Math.random() * 9000)}@${domain}`;
      const finalName =
        memberName.trim() || finalEmail.split("@")[0].replace(/[._-]/g, " ");

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
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
        showToast(data.message || "Giriş başarılı!");
        setStep(2);
      } else {
        showToast(data.error || "Giriş yapılamadı.");
      }
    } catch {
      showToast("Giriş sırasında hata oluştu.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleTriggerAdClick = () => {
    setAdClicked(true);
    showToast(
      "Bağlantı kontrol ediliyor... 5 saniye içinde barındırıcıya yönlendirileceksiniz."
    );
  };

  const handleRedirectToHost = (provider: string, url: string) => {
    showToast(`${provider} barındırıcısına yönlendiriliyor: ${url}`);
    // Also download a helper text file containing the direct mirror links & installation steps
    const content = [
      "==============================================================",
      `  tr_dublaj — ${targetTitle} (AI TÜRKÇE DUBLAJ)  `,
      "==============================================================",
      `Sürüm      : ${targetVersion} (${targetFileSize})`,
      `Üye        : ${currentUser?.name || memberName} (${currentUser?.email || memberEmail})`,
      `Seçilen    : ${provider}`,
      `Barındırıcı: ${url}`,
      "",
      "TÜM BARINDIRICI LİNKLERİ:",
      ...targetMirrors.map((m) => `- ${m.provider}: ${m.url}`),
      "",
      "KURULUM ADIMLARI:",
      "1. Yukarıdaki barındırıcı linkinden .zip arşivini indirin.",
      "2. Arşiv içindeki dosyaları oyun klasörünüze çıkartın.",
      "3. Oyuna girip Türkçe AI Dublajın keyfini çıkarın!",
      "==============================================================",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `tr_dublaj_${targetTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Baglanti.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={closeCheckout}
      />

      {/* Modal Window */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-[#0B0C10] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden my-8">
        {/* Top Header */}
        <div className="px-6 py-5 bg-[#13151C] border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#10B981]">
              %100 ÜCRETSİZ İNDİRME SİSTEMİ
            </span>
            <h2 className="font-display text-xl font-bold text-[#F8FAFC] mt-0.5">
              {targetTitle} — AI Türkçe Dublaj İndir
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCheckout}
            className="p-2 rounded-xl bg-[#0B0C10] text-[#94A3B8] hover:text-white border border-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Indicators */}
        <div className="px-6 py-3 bg-[#0B0C10] border-b border-white/10 flex items-center gap-3 text-xs font-mono">
          <div
            className={`flex items-center gap-2 ${
              step >= 1 ? "text-[#F8FAFC]" : "text-[#94A3B8]"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step > 1
                  ? "bg-[#10B981] text-[#0B0C10]"
                  : "bg-[#E11D48] text-white"
              }`}
            >
              1
            </span>
            <span>Üye Girişi</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div
            className={`flex items-center gap-2 ${
              step >= 2 ? "text-[#F8FAFC]" : "text-[#94A3B8]"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step > 2
                  ? "bg-[#10B981] text-[#0B0C10]"
                  : step === 2
                  ? "bg-[#E11D48] text-white"
                  : "bg-white/10"
              }`}
            >
              2
            </span>
            <span>Destek</span>
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div
            className={`flex items-center gap-2 ${
              step === 3 ? "text-[#10B981]" : "text-[#94A3B8]"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                step === 3 ? "bg-[#10B981] text-[#0B0C10]" : "bg-white/10"
              }`}
            >
              3
            </span>
            <span>Barındırıcıya Yönlen</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[78vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-[#13151C] border border-white/10 text-xs text-[#94A3B8] leading-relaxed">
                İndirme barındırıcısına yönelmek ve yeni AI dublajlar eklendikçe bildirim almak için hesaplarınızla tek tıkla ücretsiz üye olun.
              </div>

              {/* ÜYELİK SÖZLEŞMESİ ONAYI — ZORUNLU */}
              <label
                className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                  termsAccepted
                    ? "bg-[#10B981]/10 border-[#10B981]/40"
                    : "bg-[#13151C] border-white/15"
                }`}
              >
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
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
                  &apos;ni okudum, kabul ediyorum. <span className="text-[#EF4444]">*</span>
                </span>
              </label>

              {/* TEK TIKLA GİRİŞ: GOOGLE / YANDEX / PROTON */}
              <div
                className={`space-y-2.5 transition-opacity ${
                  termsAccepted ? "opacity-100" : "opacity-50"
                }`}
              >
                {(
                  [
                    { id: "google", label: "Google / Gmail ile Üye Ol", cls: "bg-white text-[#0B0C10]" },
                    { id: "yandex", label: "Yandex Mail ile Üye Ol", cls: "bg-[#FC3F1D]/20 text-[#FC3F1D] border border-[#FC3F1D]/40" },
                    { id: "proton", label: "Proton Mail ile Üye Ol", cls: "bg-[#6D4AFF]/20 text-[#A78BFA] border border-[#6D4AFF]/40" },
                  ] as const
                ).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isLoggingIn}
                    onClick={() => handleQuickOAuthLogin(p.id)}
                    className={`w-full h-12 rounded-xl font-display font-extrabold text-sm flex items-center justify-center gap-3 shadow transition-all cursor-pointer disabled:opacity-60 ${p.cls}`}
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <LogIn className="w-5 h-5" />
                    )}
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>

              {/* İsteğe bağlı bilgiler */}
              <details className="group pt-3 border-t border-white/10">
                <summary className="cursor-pointer font-mono text-[11px] uppercase text-[#94A3B8] hover:text-[#F8FAFC] select-none">
                  İsteğe bağlı: adımı ve e-postamı kendim yazayım ▾
                </summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                  <div className="relative">
                    <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#13151C] border border-white/15 text-xs text-[#F8FAFC]"
                      placeholder="Oyuncu adın (boş bırakabilirsin)"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#13151C] border border-white/15 text-xs text-[#F8FAFC]"
                      placeholder="ornek@gmail.com (boş bırakabilirsin)"
                    />
                  </div>
                </div>
              </details>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-[#10B981]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Üye Girişi Aktif:{" "}
                    <strong>{currentUser?.name || memberName}</strong> (
                    {currentUser?.email || memberEmail})
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase bg-[#10B981]/20 px-2 py-0.5 rounded text-[#10B981]">
                  DOĞRULANDI
                </span>
              </div>

              {/* Sponsor Ad-Click Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#13151C] via-[#1C1522] to-[#13151C] border border-[#F59E0B]/40 text-center space-y-4 shadow-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> ÜCRETSİZ DESTEK ADIMI
                </span>

                <h3 className="font-display text-xl font-extrabold text-[#F8FAFC]">
                  İndirme Adımı — Destek Olarak Devam Et
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                  Yapay zekâ (AI) ile hazırladığımız Türkçe dublajları tamamen ücretsiz dağıtıyoruz. Yeni oyunların seslendirilmesi için aşağıdaki destek adımına tıklayıp{" "}
                  <strong className="text-[#F8FAFC]">5 saniye</strong> beklemeniz yeterlidir.
                </p>

                <div className="p-3 rounded-xl bg-[#0B0C10] border border-white/10 font-mono text-xs text-[#94A3B8] flex items-center justify-between max-w-md mx-auto">
                  <span className="truncate">
                    Yönlendirme Linki: 🔒 ••••••••••••••••••• (adım sonrası açılır)
                  </span>
                  <span className="text-[#10B981] shrink-0 ml-2">Güvenli</span>
                </div>

                {unlockError && (
                  <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444] max-w-md mx-auto">
                    {unlockError}
                  </div>
                )}

                {!adClicked ? (
                  <button
                    type="button"
                    onClick={handleTriggerAdClick}
                    className="h-14 px-8 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:brightness-110 text-[#0B0C10] font-display font-extrabold text-sm sm:text-base tracking-wide inline-flex items-center gap-3 shadow-[0_0_35px_rgba(245,158,11,0.45)] transition-all cursor-pointer"
                  >
                    <MousePointerClick className="w-5 h-5" />
                    <span>Ücretsiz İndir</span>
                  </button>
                ) : (
                  <div className="space-y-3 max-w-md mx-auto pt-2">
                    <div className="flex items-center justify-center gap-2 font-mono text-sm font-bold text-[#F59E0B]">
                      <Clock className="w-4 h-4 animate-spin" />
                      <span>
                        Barındırıcıya Yönlendiriliyor... {countdown} saniye
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-[#0B0C10] border border-white/10 overflow-hidden">
                      <div
                        style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                        className="h-full bg-gradient-to-r from-[#E11D48] via-[#F59E0B] to-[#10B981] transition-all duration-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="font-mono text-xs font-bold uppercase text-[#10B981]">
                    BARINDIRICI LİNKLERİ AKTİF!
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#F8FAFC] mt-0.5">
                    {targetTitle} ({targetVersion}) İndirmeye Hazır
                  </h3>
                  <p className="text-xs text-[#94A3B8] mt-1">
                    Desteğiniz için teşekkürler! Aşağıdaki bulut barındırıcılardan dilediğinizi seçerek doğrudan indirebilirsiniz.
                  </p>
                </div>
              </div>

              {/* Direct Host Mirrors List */}
              <div className="space-y-3">
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#94A3B8]">
                  DOĞRUDAN BARINDIRICI BAĞLANTILARI ({targetFileSize})
                </h4>

                {targetMirrors.map((mirror, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#13151C] border border-white/15 hover:border-[#10B981]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0B0C10] border border-white/10 flex items-center justify-center text-[#F59E0B] shrink-0">
                        <HardDrive className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-display text-sm font-bold text-[#F8FAFC]">
                          {mirror.provider}
                        </div>
                        <div className="font-mono text-[11px] text-[#94A3B8]">
                          {mirror.label}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleRedirectToHost(mirror.provider, mirror.url)
                      }
                      className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] text-[#0B0C10] font-mono text-xs font-extrabold flex items-center justify-center gap-2 hover:brightness-110 transition-all cursor-pointer shrink-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>{mirror.provider}&apos;a Yönlendir & İndir</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="font-mono text-[11px] text-[#94A3B8]">
                  Kurulum: .zip içindeki dosyaları oyun klasörüne çıkartın.
                </span>
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="h-10 px-5 rounded-xl bg-[#1C1F2B] hover:bg-[#262B3D] text-[#F8FAFC] text-xs font-mono font-bold uppercase border border-white/15 cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
