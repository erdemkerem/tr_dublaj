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
  // E-posta onaylı tek üyelik akışı
  const [checkStep, setCheckStep] = useState<"form" | "code">("form");
  const [checkCode, setCheckCode] = useState("");
  const [checkNotice, setCheckNotice] = useState("");
  const [fallbackCode, setFallbackCode] = useState("");

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

  /** Üyelik onay kodu talebi — e-postaya 6 haneli kod gider */
  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      showToast(
        "Devam etmek için Üyelik Sözleşmesi ve KVKK metnini onaylamalısın."
      );
      return;
    }
    const typed = memberEmail.trim().toLowerCase();
    if (!typed.includes("@") || !typed.includes(".")) {
      showToast("Geçerli bir e-posta adresi yaz.");
      return;
    }
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          email: typed,
          name: memberName.trim(),
          termsAccepted: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFallbackCode(data.fallbackCode || "");
        setCheckNotice(
          data.mailSent
            ? `6 haneli onay kodu ${typed} adresine gönderildi.`
            : "Mail sistemi henüz ayarlanmadığından kodun doğrudan burada gösteriliyor."
        );
        setCheckStep("code");
      } else {
        showToast(data.error || "Kod gönderilemedi.");
      }
    } catch {
      showToast("Kod gönderilemedi.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  /** Kodu doğrula → üyelik aktif, indirme adımına geç */
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email: memberEmail.trim().toLowerCase(),
          code: checkCode.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        showToast(
          data.message || `Hoş geldin ${data.user.name}! Üyeliğin aktif.`
        );
        setCheckStep("form");
        setCheckCode("");
        setFallbackCode("");
        setStep(2);
      } else {
        showToast(data.error || "Kod doğrulanamadı.");
      }
    } catch {
      showToast("Kod doğrulanamadı.");
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
      "1. Yukarıdaki barındırıcı linkinden yama paketini (.7z / .zip arşivi) indirin.",
      "2. Arşivi 7-Zip veya WinRAR ile oyun klasörünüze çıkartın.",
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
                İndirme linklerini açmak için e-posta onaylı ücretsiz üyelik
                gerekiyor. E-postana gelen 6 haneli kodla saniyeler içinde üye
                olup devam edebilirsin.
              </div>

              {/* ÜYELİK SÖZLEŞMESİ ONAYI — ZORUNLU (yalnızca yeni üyelik) */}
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

                {checkStep === "form" ? (
                  <form onSubmit={handleRequestCode} className="space-y-3">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                        placeholder="E-posta adresin *"
                        className="w-full h-12 pl-10 pr-3 rounded-xl bg-[#13151C] border border-white/15 font-mono text-xs text-[#F8FAFC]"
                      />
                    </div>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        placeholder="İsmin *"
                        className="w-full h-12 pl-10 pr-3 rounded-xl bg-[#13151C] border border-white/15 text-xs text-[#F8FAFC]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full h-12 rounded-xl bg-[#10B981] text-[#0B0C10] font-display font-extrabold text-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                    >
                      {isLoggingIn ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <LogIn className="w-5 h-5" />
                      )}
                      <span>Onay Kodu Gönder</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyCode} className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#10B981]">
                      {checkNotice}
                    </div>
                    {fallbackCode && (
                      <div className="p-3.5 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 text-center">
                        <div className="font-mono text-[10px] uppercase text-[#F59E0B] mb-1">
                          E-posta henüz bağlanmadı — kodun
                        </div>
                        <div className="font-mono text-2xl font-extrabold tracking-[6px] text-[#F59E0B]">
                          {fallbackCode}
                        </div>
                      </div>
                    )}
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      maxLength={6}
                      value={checkCode}
                      onChange={(e) =>
                        setCheckCode(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="______"
                      className="w-full h-14 px-4 rounded-xl bg-[#13151C] border border-white/15 text-center font-mono text-2xl font-extrabold tracking-[10px] text-[#F8FAFC]"
                    />
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="w-full h-12 rounded-xl bg-[#10B981] text-[#0B0C10] font-display font-extrabold text-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
                    >
                      {isLoggingIn ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5" />
                      )}
                      <span>Kodu Doğrula & İndirmeye Devam Et</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckStep("form")}
                      className="w-full py-2 font-mono text-[11px] text-[#94A3B8] hover:text-white cursor-pointer"
                    >
                      ← E-postayı değiştir / yeni kod iste
                    </button>
                  </form>
                )}
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
