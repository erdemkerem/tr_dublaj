import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck, Trash2, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Üyelik Sözleşmesi & KVKK Aydınlatma Metni | tr_dublaj",
};

const TERMS = [
  {
    t: "1. Hizmetin Kapsamı",
    d: "tr_dublaj, yapay zekâ (AI) ses klonlama teknolojisiyle hazırlanan Türkçe oyun dublaj yamalarını ücretsiz olarak paylaşan bir topluluk platformudur. Yamalar için hiçbir ücret talep edilmez; platform reklam görüntüleme yoluyla desteklenir.",
  },
  {
    t: "2. Üyelik",
    d: "Üyelik ücretsizdir ve Google, Yandex veya Proton Mail adresinizle oluşturulur. Üyelik, indirme bağlantılarına erişim ve istek listesi oluşturma imkânı sağlar. Üye olurken bu sözleşmeyi onaylamanız zorunludur.",
  },
  {
    t: "3. Kullanım Koşulları",
    d: "Yamalar yalnızca kişisel ve ticari olmayan amaçlarla kullanılabilir. İndirilen dosyaların başka platformlarda ücret karşılığı satılması, kendi eseri gibi paylaşılması veya içeriğinin izinsiz değiştirilerek dağıtılması yasaktır.",
  },
  {
    t: "4. Telif Hakları",
    d: "Oyunlara ait tüm isim, görsel ve karakterlerin telif hakları ilgili yapımcı ve yayıncı firmalara aittir. tr_dublaj bu firmalarla resmî bir bağlantıya sahip değildir. Yamalar hayran çalışması (fan-made) niteliğindedir ve oyunun orijinal kopyasına sahip kullanıcılar içindir.",
  },
  {
    t: "5. Sorumluluk Reddi",
    d: "Yamalar olduğu gibi sunulur. Kurulum sırasında oluşabilecek dosya bozulması veya oyun hatalarından platform sorumlu tutulamaz. Kurulum öncesi oyun dosyalarınızı yedeklemeniz önerilir.",
  },
  {
    t: "6. Üyeliğin Sonlandırılması",
    d: "Üyeliğinizi dilediğiniz an Hesabım sayfasından tek tıkla iptal edebilirsiniz. İptal durumunda hesabınız ve kişisel verileriniz sistemden kalıcı olarak silinir.",
  },
];

const KVKK = [
  {
    t: "Hangi veriler işleniyor?",
    d: "Yalnızca görünen adınız, oyuncu etiketiniz, e-posta adresiniz, giriş sağlayıcınız (Google/Yandex/Proton), üyelik tarihiniz ve indirme sayınız saklanır.",
  },
  {
    t: "Hangi veriler işlenmiyor?",
    d: "Şifre, kredi kartı, kimlik numarası, adres veya telefon gibi hiçbir hassas veri toplanmaz ve saklanmaz. Platformda ödeme alınmaz.",
  },
  {
    t: "Hangi amaçla işleniyor?",
    d: "Verileriniz yalnızca üyelik oluşturma, indirme bağlantılarına erişim yetkisi verme ve istek listesi oylaması için kullanılır.",
  },
  {
    t: "Üçüncü taraflarla paylaşılıyor mu?",
    d: "Hayır. Kişisel verileriniz hiçbir üçüncü tarafa satılmaz veya pazarlama amacıyla paylaşılmaz.",
  },
  {
    t: "Haklarınız",
    d: "KVKK m.11 uyarınca verilerinize erişme, düzeltme ve silinmesini talep etme hakkına sahipsiniz. Bu hakları Hesabım sayfasından doğrudan kullanabilirsiniz.",
  },
];

export default function TermsPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-12 space-y-12">
      <header className="space-y-3">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13151C] border border-[#10B981]/40 font-mono text-xs font-bold uppercase text-[#10B981]">
          <FileText className="w-3.5 h-3.5" /> YASAL METİNLER
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8FAFC]">
          Üyelik Sözleşmesi
        </h1>
        <p className="text-sm text-[#94A3B8]">
          Son güncelleme: 2026 • tr_dublaj ücretsiz AI Türkçe dublaj platformu
        </p>
      </header>

      <section className="space-y-4">
        {TERMS.map((s) => (
          <div
            key={s.t}
            className="p-5 rounded-2xl bg-[#13151C] border border-white/10 space-y-2"
          >
            <h2 className="font-display text-base font-bold text-[#F8FAFC]">
              {s.t}
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              {s.d}
            </p>
          </div>
        ))}
      </section>

      {/* KVKK */}
      <section id="kvkk" className="space-y-4 scroll-mt-24">
        <div className="flex items-center gap-2.5 pt-4">
          <ShieldCheck className="w-5 h-5 text-[#10B981]" />
          <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
            KVKK Aydınlatma Metni
          </h2>
        </div>

        {KVKK.map((s) => (
          <div
            key={s.t}
            className="p-5 rounded-2xl bg-[#13151C] border border-[#10B981]/20 space-y-2"
          >
            <h3 className="font-display text-base font-bold text-[#10B981]">
              {s.t}
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              {s.d}
            </p>
          </div>
        ))}
      </section>

      <section className="p-6 rounded-2xl bg-[#EF4444]/5 border border-[#EF4444]/30 space-y-3">
        <div className="flex items-center gap-2 font-display text-base font-bold text-[#EF4444]">
          <Trash2 className="w-4 h-4" />
          <span>Verilerimi nasıl sildiririm?</span>
        </div>
        <p className="text-xs text-[#94A3B8] leading-relaxed">
          <Link href="/hesabim" className="text-[#10B981] underline">
            Hesabım
          </Link>{" "}
          sayfasının en altındaki <strong>Üyelik İptali</strong> bölümünden tek
          tıkla hesabını ve tüm verilerini kalıcı olarak silebilirsin. Onay
          dışında hiçbir ek işlem gerekmez.
        </p>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748B] pt-2 border-t border-white/10">
          <Mail className="w-3.5 h-3.5" />
          <span>İletişim: destek@trdublaj.io</span>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
        <Link
          href="/"
          className="px-5 py-3 rounded-xl bg-[#13151C] border border-white/15 text-xs font-mono font-bold text-[#F8FAFC]"
        >
          ← Ana Sayfa
        </Link>
        <Link
          href="/hesabim"
          className="px-5 py-3 rounded-xl bg-[#10B981] text-[#0B0C10] text-xs font-display font-extrabold"
        >
          Hesabım
        </Link>
      </div>
    </div>
  );
}
