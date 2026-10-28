"use client";

import React from "react";
import Link from "next/link";
import { Bot, ShieldCheck, Cpu, Settings, LogIn } from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function Footer() {
  const { openAdminModal, openAuthModal, isAdmin } = useStore();

  return (
    <footer className="bg-[#08090C] border-t border-white/10 text-[#94A3B8] mt-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & AI Mission */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center text-white border border-white/20">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-display text-2xl font-extrabold text-[#F8FAFC]">
                tr<span className="text-[#E11D48]">_</span>dublaj
              </span>
            </Link>
            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md">
              Yapay zekâ (RVC v2, Tr_dublaj, XTTS) ses klonlama teknolojisiyle hazırladığımız Türkçe oyun dublajlarını; oyunculara %100 ücretsiz, reklam tıklama destekli ve doğrudan bulut barındırıcı (Google Drive / GitHub Releases / MediaFire) yönlendirmesiyle sunuyoruz.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-[#13151C] border border-white/10 text-[#10B981]">
                %100 Ücretsiz (Reklam Destekli)
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#13151C] border border-white/10 text-[#F8FAFC]">
                RVC v2 Orijinal Ses Klonu
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#13151C] border border-white/10 text-[#F59E0B]">
                GitHub & Drive Yönlendirme
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F8FAFC]">
              AI Dublaj & İstek Listesi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/urun/resonance-a-plague-tale-legacy-ai-turkce-dublaj"
                  className="text-[#10B981] font-semibold hover:underline transition-colors"
                >
                  ✓ Resonance: A Plague Tale Legacy (Hazır)
                </Link>
              </li>
              <li>
                <Link
                  href="/#istek-listesi"
                  className="hover:text-[#F43F5E] transition-colors"
                >
                  Oyun İstek Listesi & Oylama
                </Link>
              </li>
              <li>
                <Link
                  href="/#ai-teknolojisi"
                  className="hover:text-[#F43F5E] transition-colors"
                >
                  Reklam Geç & Barındırıcı Sistemi
                </Link>
              </li>
              <li>
                <Link
                  href="/#yorumlar"
                  className="hover:text-[#F43F5E] transition-colors"
                >
                  Oyuncu Yorumları
                </Link>
              </li>
              <li>
                <Link
                  href="/hesabim"
                  className="hover:text-[#F43F5E] transition-colors"
                >
                  Hesabım & Üyelik İptali
                </Link>
              </li>
              <li>
                <Link
                  href="/sozlesme"
                  className="hover:text-[#F43F5E] transition-colors"
                >
                  Üyelik Sözleşmesi & KVKK
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Owner & Member Quick Actions */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#F8FAFC]">
              Üyelik & Kolay Yama Yönetimi
            </h4>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Oyuncular <strong className="text-[#F8FAFC]">Google, Yandex veya Proton Mail</strong> ile saniyeler içinde üye olup yamaları ücretsiz indirebilir. İndirme linkleri yalnızca üyelere, reklam adımından sonra açılır.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0B0C10] text-xs font-display font-extrabold cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Üye Ol</span>
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={openAdminModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13151C] hover:bg-[#1C1F2B] border border-[#F59E0B]/40 text-xs font-mono text-[#F59E0B] cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Yönetim Paneli</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>
              © 2026 tr_dublaj — Yapay Zeka (AI) Türkçe Oyun Dublaj & Ücretsiz Yama Platformu.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#64748B]">
            <span className="flex items-center gap-1 text-[#94A3B8]">
              <Cpu className="w-3.5 h-3.5 text-[#10B981]" /> GitHub Pages • Google Drive • MediaFire
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
