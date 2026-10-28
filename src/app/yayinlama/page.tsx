import React from "react";
import Link from "next/link";
import {
  Rocket,
  Globe,
  GitBranch,
  Cloud,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  Terminal,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ücretsiz Yayınlama Rehberi (Cloudflare + GitHub) | tr_dublaj",
};

const FREE_DOMAIN_OPTIONS = [
  {
    name: "js.org (GitHub için ücretsiz domain)",
    cost: "Tamamen Ücretsiz • Süresiz",
    url: "https://github.com/js-org/js.org",
    desc: "GitHub'da projen varsa js.org deposuna PR göndererek trdublaj.js.org gibi ücretsiz bir alan adı alırsın. Cloudflare ile birlikte çalışır.",
    tag: "EN ÇOK ÖNERİLEN",
  },
  {
    name: "GitHub Pages alt alan adı",
    cost: "Ücretsiz • Anında",
    url: "https://pages.github.com",
    desc: "Hiçbir şey satın almadan kullanicadin.github.io/tr_dublaj adresi anında senin olur. Alan adı almana bile gerek kalmaz.",
    tag: "SIFIR İŞLEM",
  },
  {
    name: "Cloudflare Workers / Pages alt alanı",
    cost: "Ücretsiz • Anında",
    url: "https://dash.cloudflare.com",
    desc: "Cloudflare hesabında proje açınca tr-dublaj.pages.dev adresi otomatik verilir. SSL ve CDN dahildir.",
    tag: "CLOUDFLARE HESABIN VAR",
  },
  {
    name: "is-a.dev / eu.org gibi topluluk alan adları",
    cost: "Ücretsiz • Onay Gerekir",
    url: "https://github.com/is-a-dev/register",
    desc: "trdublaj.is-a.dev gibi adresler ücretsizdir. GitHub üzerinden başvuru yapılır, Cloudflare DNS ile bağlanır.",
    tag: "ALTERNATİF",
  },
];

const CLOUDFLARE_STEPS = [
  {
    title: "1. Cloudflare Pages projesi oluştur",
    detail:
      "dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git. GitHub hesabını bağla ve tr_dublaj deposunu seç.",
  },
  {
    title: "2. Build ayarlarını gir",
    detail:
      "Framework preset: Next.js • Build command: npm run build • Build output: .next — Cloudflare bunu otomatik algılar.",
  },
  {
    title: "3. Ortam değişkenlerini (Environment Variables) ekle",
    detail:
      "DATABASE_URL (ücretsiz Neon.tech PostgreSQL adresin) ve ADMIN_SECRET_KEY (senin gizli yönetici şifren). Bu şifreyi kimseye verme!",
  },
  {
    title: "4. Ücretsiz alan adını bağla",
    detail:
      "Custom domains → Set up a domain. Ücretsiz tr-dublaj.pages.dev hazır gelir; js.org veya is-a.dev aldıysan CNAME olarak buraya yönlendir.",
  },
  {
    title: "5. SSL ve CDN otomatik aktif",
    detail:
      "Cloudflare ücretsiz SSL sertifikası ve global CDN'i otomatik açar. Site https:// ile güvenli yayına girer.",
  },
];

const GITHUB_STEPS = [
  {
    title: "1. GitHub'da depo (repository) aç",
    detail:
      "github.com/new → Repository name: tr_dublaj → Public seç → Create repository.",
  },
  {
    title: "2. Projeyi yükle",
    detail:
      "git init && git add . && git commit -m \"tr_dublaj ilk sürüm\" && git branch -M main && git remote add origin https://github.com/KULLANICI_ADIN/tr_dublaj.git && git push -u origin main",
  },
  {
    title: "3. Yama dosyalarını Releases'e yükle",
    detail:
      "Depo → Releases → Draft a new release → .zip dublaj dosyanı sürükle. GitHub 2 GB'a kadar dosyayı ücretsiz barındırır ve sınırsız indirme verir.",
  },
  {
    title: "4. Linki panele yapıştır",
    detail:
      "Yönetim panelinde (/yonetim) 'GitHub Releases Yedek' kutusuna bu linki yapıştır. Link üyelere görünmez, sadece indirme adımından sonra açılır.",
  },
];

export default function PublishGuidePage() {
  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Başlık */}
      <header className="space-y-4">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13151C] border border-[#10B981]/40 font-mono text-xs font-bold uppercase text-[#10B981]">
          <Rocket className="w-3.5 h-3.5" /> ÜCRETSİZ YAYINLAMA REHBERİ
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] leading-tight">
          tr_dublaj Sitesini{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#F59E0B]">
            Cloudflare + GitHub
          </span>{" "}
          ile Ücretsiz Yayınla
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] max-w-3xl leading-relaxed">
          Hiç para ödemeden alan adı al, siteyi yayına ver ve yama dosyalarını
          barındır. Aşağıdaki adımları sırayla uygula — tamamı ücretsizdir.
        </p>
      </header>

      {/* Ücretsiz alan adı seçenekleri */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
            Ücretsiz Alan Adı (Domain) Seçenekleri
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FREE_DOMAIN_OPTIONS.map((opt) => (
            <div
              key={opt.name}
              className="p-5 rounded-2xl bg-[#13151C] border border-white/10 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-bold text-[#F8FAFC]">
                  {opt.name}
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] font-mono text-[10px] font-bold shrink-0">
                  {opt.tag}
                </span>
              </div>
              <div className="font-mono text-[11px] text-[#F59E0B]">
                {opt.cost}
              </div>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {opt.desc}
              </p>
              <a
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#F8FAFC] hover:text-[#10B981] underline"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Başvuru / Detay</span>
              </a>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start gap-3 text-xs text-[#F59E0B]">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Not: Freenom (.tk, .ml) artık ücretsiz kayıt vermiyor. En garantili
            ücretsiz yol: <strong>GitHub Pages alt alanı</strong> +{" "}
            <strong>Cloudflare Pages</strong> ikilisidir. İstersen sonra
            Cloudflare Registrar&apos;dan maliyetine (~10$/yıl) .com alabilirsin.
          </span>
        </div>
      </section>

      {/* Cloudflare adımları */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <Cloud className="w-5 h-5 text-[#F43F5E]" />
          <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
            Cloudflare ile Yayına Alma (Veritabanlı tam sürüm)
          </h2>
        </div>

        <div className="space-y-3">
          {CLOUDFLARE_STEPS.map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#13151C] border border-white/10 flex items-start gap-4"
            >
              <span className="w-7 h-7 rounded-lg bg-[#E11D48] text-white font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-sm font-bold text-[#F8FAFC]">
                  {s.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-xs text-[#10B981] flex items-start gap-3">
          <Terminal className="w-5 h-5 shrink-0" />
          <span>
            Ücretsiz veritabanı için <strong>neon.tech</strong> veya{" "}
            <strong>supabase.com</strong> üzerinden ücretsiz PostgreSQL aç,
            verdiği bağlantı adresini <code>DATABASE_URL</code> olarak
            Cloudflare&apos;e gir. Üyelik, istek listesi ve yorumlar böyle çalışır.
          </span>
        </div>
      </section>

      {/* GitHub adımları */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <GitBranch className="w-5 h-5 text-[#F8FAFC]" />
          <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
            GitHub&apos;da Yayınlama & Yama Dosyalarını Barındırma
          </h2>
        </div>

        <div className="space-y-3">
          {GITHUB_STEPS.map((s, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#13151C] border border-white/10 flex items-start gap-4"
            >
              <span className="w-7 h-7 rounded-lg bg-[#F59E0B] text-[#0B0C10] font-mono text-xs font-extrabold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-sm font-bold text-[#F8FAFC]">
                  {s.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed break-words font-mono">
                  {s.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Güvenlik / Yönetim */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#10B981]" />
          <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
            Yama Yönetimi Sadece Sende: Nasıl Çalışıyor?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl bg-[#13151C] border border-[#F59E0B]/30 space-y-3">
            <div className="flex items-center gap-2 font-display text-base font-bold text-[#F8FAFC]">
              <KeyRound className="w-4 h-4 text-[#F59E0B]" />
              <span>Gizli Yönetim Adresi</span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Yönetim paneline yalnızca sizin bildiğiniz gizli adres ve şifrenizle girilir. Alışveriş sayfasındaki butonlar üyelere hiç görünmez; yamalarla ilgili tüm içerik ekleyip düzenlediğinizde değişikliklar saniyeler içinde aktif olur.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#13151C] border border-[#10B981]/30 space-y-3">
            <div className="flex items-center gap-2 font-display text-base font-bold text-[#F8FAFC]">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Linkler Üyelere Kapalı</span>
            </div>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              {[
                "İndirme linkleri sayfa kaynağında yer almaz.",
                "Linkler sadece üye girişi + indirme adımı sonrası sunucudan gelir.",
                "Üyeler panele, ekleme/silme işlemlerine asla erişemez.",
                "Üyelik e-posta ile tek tıkla açılır.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="pt-6 border-t border-white/10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#13151C] border border-white/15 text-xs font-mono font-bold text-[#F8FAFC]"
        >
          ← Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
