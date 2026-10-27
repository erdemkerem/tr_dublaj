"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bot,
  Heart,
  Menu,
  X,
  Volume2,
  UserCheck,
  LogIn,
  Settings,
  Sparkles,
  LogOut,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Navbar() {
  const {
    itemCount,
    openCart,
    openAuthModal,
    openAdminModal,
    currentUser,
    logoutUser,
    isAdmin,
    activeAudio,
    toastMessage,
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top AI Dubbing & Free Ad-Link Announcement Bar */}
      <div className="bg-gradient-to-r from-[#13151C] via-[#1E1118] to-[#13151C] border-b border-white/10 text-xs text-[#94A3B8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-mono text-[11px] font-semibold border border-[#10B981]/30">
              <Sparkles className="w-3 h-3" /> %100 ÜCRETSİZ AI DUBLAJ
            </span>
            <span className="truncate text-[#F8FAFC]/90">
              İlk Hazır Oyun:{" "}
              <strong className="text-[#F59E0B]">
                Resonance: A Plague Tale Legacy
              </strong>{" "}
              Yayında! Üye Ol • Reklam Geç • Barındırıcıdan İndir
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-[#10B981]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Google Drive & GitHub Releases Aktif
            </span>
            {isAdmin && (
              <>
                <span className="text-white/20">|</span>
                <button
                  type="button"
                  onClick={openAdminModal}
                  className="flex items-center gap-1 text-[#F59E0B] hover:underline cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" /> Kolay Yama Yönetimi (Sadece Siz)
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 h-20 backdrop-blur-xl bg-[#0B0C10]/85 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-[0_0_24px_-4px_rgba(225,29,72,0.6)] border border-white/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#10B981] text-[#0B0C10] font-mono text-[9px] font-bold tracking-tighter">
                AI
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
                  tr<span className="text-[#E11D48]">_</span>dublaj
                </span>
                {activeAudio?.isPlaying && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/40 text-[#F43F5E] font-mono text-[10px]">
                    <Volume2 className="w-3 h-3 animate-pulse" /> AI SES AKTİF
                  </span>
                )}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">
                Yapay Zeka Oyun Dublaj & Ücretsiz Yama Merkezi
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#94A3B8]">
            <Link
              href="/#katalog"
              className="hover:text-[#F8FAFC] transition-colors py-2"
            >
              Hazır Dublaj & Yamalar
            </Link>
            <Link
              href="/#istek-listesi"
              className="hover:text-[#F8FAFC] transition-colors py-2 flex items-center gap-1.5"
            >
              <span>İstek Listesi & Oyun Oylama</span>
              <span className="px-1.5 py-0.2 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[10px]">
                OY VER
              </span>
            </Link>
            <Link
              href="/#ai-teknolojisi"
              className="hover:text-[#F8FAFC] transition-colors py-2"
            >
              AI Dublaj & Link Sistemi
            </Link>
            <Link
              href="/#yorumlar"
              className="hover:text-[#F8FAFC] transition-colors py-2"
            >
              Oyuncu Yorumları
            </Link>
          </nav>

          {/* Right Actions: Easy Admin Control + Google Member Auth + Wishlist Drawer */}
          <div className="flex items-center gap-2.5">
            {/* Easy Control Panel Button — SADECE SİTE SAHİBİNE GÖRÜNÜR */}
            {isAdmin && (
              <button
                type="button"
                onClick={openAdminModal}
                className="hidden sm:inline-flex items-center gap-1.5 h-11 px-3.5 rounded-xl bg-[#13151C] hover:bg-[#1C1F2B] text-[#F59E0B] border border-[#F59E0B]/30 hover:border-[#F59E0B]/60 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                title="Yeni Yama Ekle / Linkleri Düzenle / GitHub Export"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Yama Yönetimi</span>
              </button>
            )}

            {/* ÜYE GİRİŞ / ÇIKIŞ — her ekran boyutunda görünür */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 h-11 px-2.5 sm:px-3 rounded-xl bg-[#13151C] border border-[#10B981]/40 text-xs">
                <Link
                  href="/hesabim"
                  title="Hesabım"
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <UserCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                  <div className="hidden sm:flex flex-col leading-none">
                    <span className="font-bold text-[#F8FAFC] truncate max-w-[110px]">
                      {currentUser.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#10B981] uppercase">
                      Hesabım →
                    </span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={logoutUser}
                  title="Çıkış Yap"
                  aria-label="Çıkış Yap"
                  className="sm:ml-1 inline-flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-[#EF4444]/20 text-[#94A3B8] hover:text-[#EF4444] cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="sm:hidden font-mono text-[10px] font-bold">
                    ÇIKIŞ
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-2 h-11 px-3 sm:px-4 rounded-xl bg-white hover:bg-[#F8FAFC]/90 text-[#0B0C10] font-display text-xs font-extrabold tracking-wide transition-all shadow cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#E11D48] shrink-0" />
                <span className="hidden sm:inline">Google ile Üye Ol / Giriş</span>
                <span className="sm:hidden">Giriş</span>
              </button>
            )}

            {/* Wishlist & Download Queue Drawer Trigger */}
            <button
              type="button"
              onClick={openCart}
              aria-label="İstek ve İndirme Listemi Aç"
              className="relative inline-flex items-center gap-3 h-11 px-4 rounded-xl bg-gradient-to-r from-[#13151C] to-[#1C1F2B] hover:from-[#1C1F2B] hover:to-[#252938] border border-white/15 hover:border-[#E11D48]/50 text-[#F8FAFC] transition-all shadow-lg cursor-pointer group"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-[#F43F5E] group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2.5 min-w-[20px] h-5 px-1 rounded-full bg-[#E11D48] text-white font-mono text-[11px] font-bold flex items-center justify-center shadow">
                  {itemCount}
                </span>
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none pl-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94A3B8]">
                  İstek Listem
                </span>
                <span className="font-mono text-xs font-bold text-[#10B981] mt-0.5">
                  Ücretsiz
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menüyü Aç"
              className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#13151C] border border-white/10 text-[#F8FAFC]"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#13151C]/98 backdrop-blur-2xl border-b border-white/10 px-4 py-5 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link
                href="/#katalog"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium"
              >
                Hazır AI Dublajlar
              </Link>
              <Link
                href="/#istek-listesi"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium"
              >
                İstek Listesi & Oy Ver
              </Link>
              <Link
                href="/#ai-teknolojisi"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium"
              >
                AI Sistemi & GitHub
              </Link>
              <Link
                href="/#yorumlar"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium"
              >
                Oyuncu Yorumları
              </Link>
              {currentUser && (
                <Link
                  href="/hesabim"
                  onClick={() => setMobileMenuOpen(false)}
                  className="col-span-2 p-3 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-medium text-center"
                >
                  👤 Hesabım (Profil & Üyelik İptali)
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-bold uppercase"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış Yap ({currentUser.name})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuthModal();
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-white text-[#0B0C10] text-xs font-bold uppercase"
                >
                  <LogIn className="w-4 h-4 text-[#E11D48]" />
                  Üye Ol / Giriş
                </button>
              )}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAdminModal();
                  }}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1C1F2B] border border-[#F59E0B]/40 text-xs font-mono uppercase text-[#F59E0B]"
                >
                  <Settings className="w-4 h-4" />
                  Yama Yönetimi
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 max-w-sm bg-[#13151C]/95 backdrop-blur-xl border border-[#10B981]/40 text-[#F8FAFC] px-4 py-3 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{toastMessage}</p>
        </div>
      )}
    </>
  );
}
