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
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Navbar() {
  const {
    itemCount,
    openCart,
    currentUser,
    logoutUser,
    isAdmin,
    openAdminModal,
  } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-[#13151C] via-[#1E1118] to-[#13151C] border-b border-white/10 text-xs text-[#94A3B8]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] font-mono text-[11px] font-semibold border border-[#10B981]/30">
              <Sparkles className="w-3 h-3" /> %100 ÜCRETSİZ AI DUBLAJ
            </span>
            <span className="truncate text-[#F8FAFC]/90">
              İlk Hazır Oyun: <strong className="text-[#F59E0B]">Resonance: A Plague Tale Legacy</strong> Yayında!
            </span>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={openAdminModal}
              className="flex items-center gap-1 text-[#F59E0B] hover:underline cursor-pointer font-mono text-[11px]"
            >
              <Settings className="w-3.5 h-3.5" /> Yönetim Paneli
            </button>
          )}
        </div>
      </div>

      {/* Main sticky header */}
      <header className="sticky top-0 z-40 h-20 backdrop-blur-xl bg-[#0B0C10]/85 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-full flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-[0_0_24px_-4px_rgba(225,29,72,0.6)] border border-white/20 group-hover:scale-105 transition-transform">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-[#10B981] text-[#0B0C10] font-mono text-[9px] font-bold tracking-tighter">AI</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#F8FAFC]">
                  tr<span className="text-[#E11D48]">_</span>dublaj
                </span>
                {currentUser && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E11D48]/20 border border-[#E11D48]/40 text-[#F43F5E] font-mono text-[10px]">
                    <Volume2 className="w-3 h-3 animate-pulse" /> AKTİF
                  </span>
                )}
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">Yapay Zeka Oyun Dublaj & Ücretsiz Yama Merkezi</p>
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-[#94A3B8]">
            <Link href="/#katalog" className="hover:text-[#F8FAFC] transition-colors py-2">Hazır Dublaj & Yamalar</Link>
            <Link href="/#istek-listesi" className="hover:text-[#F8FAFC] transition-colors py-2 flex items-center gap-1.5">
              İstek Listesi & Oy Ver
              <span className="px-1.5 py-0.2 rounded bg-[#F59E0B]/20 text-[#F59E0B] font-mono text-[10px]">OY VER</span>
            </Link>
            <Link href="/#ai-teknolojisi" className="hover:text-[#F8FAFC] transition-colors py-2">AI Dublaj Sistemi</Link>
            <Link href="/#yorumlar" className="hover:text-[#F8FAFC] transition-colors py-2">Oyuncu Yorumları</Link>
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Yönetim butonu - SADECE SİTE SAHİBİ GÖRÜR */}
            {isAdmin && (
              <button
                type="button"
                onClick={openAdminModal}
                className="hidden sm:inline-flex items-center gap-1.5 h-11 px-3.5 rounded-xl bg-[#13151C] hover:bg-[#1C1F2B] text-[#F59E0B] border border-[#F59E0B]/30 hover:border-[#F59E0B]/60 text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Yönetim</span>
              </button>
            )}

            {/* Giriş yapmış kullanıcı: Hesabım + Çıkış */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 h-11 px-2.5 sm:px-3 rounded-xl bg-[#13151C] border border-[#10B981]/40 text-xs">
                <Link href="/hesabim" title="Hesabım" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                  <UserCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                  <div className="hidden sm:flex flex-col leading-none">
                    <span className="font-bold text-[#F8FAFC] truncate max-w-[110px]">{currentUser.name}</span>
                    <span className="font-mono text-[10px] text-[#10B981] uppercase">Hesabım →</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={logoutUser}
                  className="sm:ml-1 inline-flex items-center gap-1 px-1.5 py-1 rounded-lg hover:bg-[#EF4444]/20 text-[#94A3B8] hover:text-[#EF4444] cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}

            {/* İstek listesi / sepet */}
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex items-center gap-3 h-11 px-4 rounded-xl bg-gradient-to-r from-[#13151C] to-[#1C1F2B] border border-white/15 text-[#F8FAFC] shadow-lg cursor-pointer group"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-[#F43F5E] group-hover:scale-110 transition-transform" />
                <span className="absolute -top-2 -right-2.5 min-w-[20px] h-5 px-1 rounded-full bg-[#E11D48] text-white font-mono text-[11px] font-bold flex items-center justify-center shadow">{itemCount}</span>
              </div>
            </button>

            {/* Mobil menü */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#13151C] border border-white/10 text-[#F8FAFC]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#13151C]/98 backdrop-blur-2xl border-b border-white/10 px-4 py-5 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/#katalog" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium">Hazır AI Dublajlar</Link>
              <Link href="/#istek-listesi" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium">İstek Listesi & Oy Ver</Link>
              <Link href="/#ai-teknolojisi" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium">AI Sistemi</Link>
              <Link href="/#yorumlar" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg bg-white/5 text-[#F8FAFC] font-medium">Oyuncu Yorumları</Link>
              {currentUser && (
                <Link href="/hesabim" onClick={() => setMobileMenuOpen(false)} className="col-span-2 p-3 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-medium text-center">👤 Hesabım</Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); logoutUser(); }}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-bold uppercase"
                >
                  <LogOut className="w-4 h-4" /> Çıkış Yap
                </button>
              ) : null}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); openAdminModal(); }}
                  className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1C1F2B] border border-[#F59E0B]/40 text-xs font-mono uppercase text-[#F59E0B]"
                >
                  <Settings className="w-4 h-4" /> Yönetim
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
