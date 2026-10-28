import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { LicenseLookupModal } from "@/components/LicenseLookupModal";
import { StudioAudioBar } from "@/components/StudioAudioBar";
import { Footer } from "@/components/Footer";

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-display",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "tr_dublaj | Yapay Zeka (AI) Türkçe Oyun Dublaj & Ücretsiz Yama Merkezi",
  description:
    "Resonance: A Plague Tale Legacy ve diğer oyunlar için RVC v2 + Tr_dublaj yapay zeka (AI) ses klonlama ile hazırlanan %100 ücretsiz Türkçe dublaj yamaları. Google ile üye ol, barındırıcıdan indir.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${syne.variable} ${jakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#0B0C10] text-[#F8FAFC] antialiased flex flex-col selection:bg-[#E11D48] selection:text-white">
        <StoreProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <CheckoutModal />
          <LicenseLookupModal />
          <StudioAudioBar />
        </StoreProvider>
      </body>
    </html>
  );
}
