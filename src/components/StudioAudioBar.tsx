"use client";

import React from "react";
import Link from "next/link";
import {
  Play,
  Square,
  Volume2,
  X,
  ArrowUpRight,
  Mic2,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";

export function StudioAudioBar() {
  const {
    activeAudio,
    playStudioSample,
    stopStudioSample,
    toggleAudioMode,
  } = useStore();

  if (!activeAudio) return null;

  const { sample, productTitle, productSlug, mode, progress, isPlaying } = activeAudio;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-[#0B0C10]/95 backdrop-blur-2xl border-t border-[#E11D48]/40 shadow-[0_-15px_45px_rgba(0,0,0,0.85)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Character & Voice Actor Info */}
        <div className="flex items-center gap-3.5 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                isPlaying
                  ? stopStudioSample()
                  : playStudioSample(sample, productTitle, productSlug, mode)
              }
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white flex items-center justify-center shadow-[0_0_20px_rgba(225,29,72,0.5)] hover:scale-105 transition-transform cursor-pointer shrink-0"
              aria-label={isPlaying ? "Durdur" : "Oynat"}
            >
              {isPlaying ? (
                <Square className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#10B981]/20 text-[#10B981] font-mono text-[10px] font-bold">
                  <Mic2 className="w-3 h-3" /> {sample.character}
                </span>
                <span className="text-xs text-[#94A3B8] font-mono hidden sm:inline">
                  • AI Model: <strong className="text-[#F8FAFC]">{sample.voiceActor}</strong>
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] truncate max-w-[260px] sm:max-w-md mt-0.5">
                {productTitle} — <span className="text-[#F59E0B]">{sample.scene}</span>
              </p>
            </div>
          </div>

          {/* Language Toggle on Mobile */}
          <div className="flex lg:hidden items-center gap-1 bg-[#13151C] p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => toggleAudioMode("tr")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                mode === "tr"
                  ? "bg-[#E11D48] text-white"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              TR DUBLAJ
            </button>
            <button
              type="button"
              onClick={() => toggleAudioMode("en")}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
                mode === "en"
                  ? "bg-[#F59E0B] text-[#0B0C10]"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              EN ORİJİNAL
            </button>
          </div>
        </div>

        {/* Center: Live Synchronized Quote & Waveform */}
        <div className="flex-1 w-full max-w-2xl flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <p className="text-[#F8FAFC] font-medium italic line-clamp-1">
              &ldquo;{mode === "tr" ? sample.turkishQuote : sample.originalQuote}&rdquo;
            </p>
            <span className="font-mono text-[11px] text-[#94A3B8] shrink-0">
              {sample.duration} • 96kHz/24-bit
            </span>
          </div>
          {/* Studio Waveform Bars */}
          <div className="flex items-end gap-1 h-5 w-full bg-[#13151C] px-2.5 py-1 rounded-lg border border-white/10 overflow-hidden">
            {sample.waveform.map((val, idx) => {
              const barProgress = (idx / sample.waveform.length) * 100;
              const isActiveBar = barProgress <= progress;
              return (
                <div
                  key={idx}
                  style={{
                    height: `${Math.max(20, isPlaying ? val : Math.round(val * 0.6))}%`,
                  }}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isActiveBar
                      ? mode === "tr"
                        ? "bg-gradient-to-t from-[#E11D48] to-[#F43F5E]"
                        : "bg-gradient-to-t from-[#F59E0B] to-amber-300"
                  : "bg-white/15"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Channel Switcher & Product Link */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-[#13151C] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => toggleAudioMode("tr")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                mode === "tr"
                  ? "bg-[#10B981] text-[#0B0C10] shadow"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              TR AI DUBLAJ
            </button>
            <button
              type="button"
              onClick={() => toggleAudioMode("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                mode === "en"
                  ? "bg-[#F59E0B] text-[#0B0C10] shadow"
                  : "text-[#94A3B8] hover:text-white"
              }`}
            >
              EN ORİJİNAL
            </button>
          </div>

          <Link
            href={`/urun/${productSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#F8FAFC] transition-colors"
          >
            <span>Yama Detayı</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#F59E0B]" />
          </Link>

          <button
            type="button"
            onClick={stopStudioSample}
            aria-label="Kapat"
            className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
