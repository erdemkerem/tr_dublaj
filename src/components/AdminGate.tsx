"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Settings,
  LogOut,
  ArrowLeft,
  EyeOff,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function AdminGate() {
  const { isAdmin, loginAdmin, logoutAdmin, openAdminModal } = useStore();
  const [keyInput, setKeyInput] = useState("");
  const [checking, setChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setErrorMsg(null);
    const ok = await loginAdmin(keyInput);
    if (!ok) {
      setErrorMsg(
        "Anahtar hatalı. Bu sayfa yalnızca site sahibine açıktır."
      );
    } else {
      setKeyInput("");
      openAdminModal();
    }
    setChecking(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-[#13151C] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="px-6 py-5 bg-[#0B0C10] border-b border-white/10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display text-lg font-extrabold text-[#F8FAFC]">
              Gizli Yönetim Girişi
            </h1>
            <p className="font-mono text-[11px] text-[#94A3B8]">
              tr_dublaj • Sadece Site Sahibi
            </p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {isAdmin ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 flex items-center gap-3 text-xs text-[#10B981]">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>
                  Yönetici oturumunuz aktif. Yama Yönetim Paneli ve gerçek indirme linkleri sadece sizin tarayıcınızda görünür.
                </span>
              </div>

              <button
                type="button"
                onClick={openAdminModal}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0B0C10] font-display font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>Yama Yönetim Panelini Aç</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/"
                  className="h-11 rounded-xl bg-[#0B0C10] border border-white/15 text-[#F8FAFC] font-mono text-xs font-bold flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Siteye Dön</span>
                </Link>
                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="h-11 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Yönetici Çıkışı</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Bu sayfanın adresini ve anahtarı yalnızca siz bilirsiniz. Üyeler ve ziyaretçiler yönetim panelini veya indirme adreslerini <strong className="text-[#F8FAFC]">hiçbir şekilde göremez</strong>.
              </p>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">
                  Yönetici Anahtarı (ADMIN_SECRET_KEY)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 text-xs text-[#EF4444]">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={checking}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{checking ? "Doğrulanıyor..." : "Yönetici Olarak Giriş Yap"}</span>
              </button>

              <div className="flex items-center gap-2 pt-2 border-t border-white/10 font-mono text-[10px] text-[#64748B]">
                <EyeOff className="w-3.5 h-3.5 shrink-0" />
                <span>
                  Bu sayfa arama motorlarına kapalıdır (noindex). Anahtarı Cloudflare/Vercel ortam değişkeninden değiştirebilirsiniz.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
