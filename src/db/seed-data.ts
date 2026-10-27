import type { NewProduct, NewReview, NewGameRequest } from "./schema";

export const INITIAL_PRODUCTS: NewProduct[] = [
  {
    slug: "resonance-a-plague-tale-legacy-ai-turkce-dublaj",
    title: "Resonance: A Plague Tale Legacy — Yapay Zeka (AI) Türkçe Dublaj & Altyazı Yaması",
    gameTitle: "Resonance: A Plague Tale Legacy",
    subtitle:
      "Sophia'nın 1334 Venedik'ten Minotor Adası'na uzanan macerası; RVC v2 + ElevenLabs AI ses klonlama ile %100 Ücretsiz Türkçe Dublaj!",
    description:
      "A Plague Tale: Requiem'in 15 yıl öncesinde geçen Resonance: A Plague Tale Legacy için yapay zekâ (AI Ses Klonlama & RVC v2 + XTTS) teknolojisiyle hazırlanan ilk tam Türkçe dublaj yaması yayında! 'Denizlerin Akrebi' Sophia'nın orijinal İngilizce ses tonu (Anna Demetriou) ve duygusal vurguları yapay zekâ ile birebir korunarak Türkçeye aktarıldı. Minotor Adası'ndaki (Minotaur's Island) tüm diyaloglar, Minos uygarlığı geçmiş yankıları ve Zouna motoru arayüz metinleri kırılmaz Türkçe fontlarla tamamen ücretsiz olarak sunulmaktadır. İndirmek için üye olup kısa reklam linkini geçerek doğrudan Google Drive, GitHub Releases veya MediaFire barındırıcısına yönlenebilirsiniz.",
    status: "ready",
    progressPercent: 100,
    aiModelInfo: "ElevenLabs AI Dubbing + RVC v2 (Sophia Orijinal Ses Klonu) + Whisper-Large Zamanlama",
    adShortlinkUrl: "https://ay.live/tr-dublaj-resonance-v1",
    hostMirrors: [
      {
        provider: "Google Drive",
        url: "https://drive.google.com/drive/folders/tr-dublaj-resonance-legacy-ai",
        label: "Google Drive (Yüksek Hızlı Ana Sunucu - 2.8 GB)",
      },
      {
        provider: "GitHub Releases",
        url: "https://github.com/tr-dublaj/resonance-plague-tale-legacy-tr/releases/latest",
        label: "GitHub Releases (Açık Kaynak Paket & Kurulum Aracı)",
      },
      {
        provider: "MediaFire",
        url: "https://www.mediafire.com/file/tr_dublaj_resonance_ai_v1.2.zip",
        label: "MediaFire (Alternatif Direkt Link)",
      },
      {
        provider: "Mega.nz",
        url: "https://mega.nz/folder/tr-dublaj-resonance-legacy",
        label: "Mega.nz (Yedek Bulut Barındırıcı)",
      },
    ],
    price: 0,
    originalPrice: 0,
    patchType: "ai_full_dub",
    patchTypeLabel: "HAZIR • AI TÜRKÇE DUBLAJ",
    genre: "hikaye-odakli",
    genreLabel: "Aksiyon-Macera / Karanlık Mitoloji",
    platforms: ["Steam", "Epic Games", "Xbox PC Game Pass"],
    version: "v1.2.0-AI",
    fileSize: "2.8 GB",
    gameVersionCompat: "Resonance: A Plague Tale Legacy (PC Tam Sürüm - 2026)",
    voiceActorCount: 18,
    translatedLinesCount: "24.600+ Satır",
    studioHours: 140,
    coverImage: "/images/resonance-plague-tale.jpg",
    galleryImages: [
      {
        url: "/images/resonance-plague-tale.jpg",
        caption: "Minotor Adası (Minotaur's Island) — Sophia RVC v2 Orijinal Ses Klonlu Türkçe Dublaj",
        tag: "İLK HAZIR AI DUBLAJ • YAYINDA",
        dialoguePreviewTr:
          "Sophia: \"Denizlerin Akrebi'ni kafese kapatabileceklerini sandılar... Ama bu adanın laneti bile beni durduramaz.\"",
        dialoguePreviewEn:
          "Sophia: \"They thought they could cage the Sea Scorpion... But not even the curse of this island will stop me.\"",
      },
      {
        url: "/images/elden-ring.jpg",
        caption: "1334 Venedik & Minos Tapınağı — Kadim Macula Kehaneti ve Işık Kırılma Bulmacaları",
        tag: "ZOUNA ENGINE TÜRKÇE FONT",
        dialoguePreviewTr:
          "Sophia (İç Ses - AI Dublaj): \"Binlerce yıl önceki o Minos savaşçısının adımlarını görüyorum... İkimizin kaderi aynı karanlıkta kesişiyor.\"",
        dialoguePreviewEn:
          "Sophia (Inner Voice): \"I see the footsteps of that Minoan warrior from millennia ago... Our fates echo in the same darkness.\"",
      },
      {
        url: "/images/witcher3-wildhunt.jpg",
        caption: "Kılıç Savuşturma (Parry) & Kamplara Sızma — Çatışma Sırasında Akıcı Türkçe Seslendirme",
        tag: "AKSİYON & DİYALOG SENKRONU",
        dialoguePreviewTr:
          "Korsan Gözcüsü: \"Meşaleleri yakın! Alec'in kızı tapınak mahzenine doğru ilerledi!\"",
        dialoguePreviewEn:
          "Mercenary Lookout: \"Light the torches! Alec's daughter headed toward the temple vaults!\"",
      },
      {
        url: "/images/tlou-part1.jpg",
        caption: "Manastır Geçmişi & Rascasse Gemisi Günlükleri — %100 Türkçe Arayüz ve Mektuplar",
        tag: "TÜRKÇE ARAYÜZ & NOTLAR",
        dialoguePreviewTr:
          "[Sophia'nın Seyir Defteri - 1334] Babam Alec'in bıraktığı pusula beni Girit açıklarındaki bu unutulmuş labirente getirdi...",
        dialoguePreviewEn:
          "[Sophia's Logbook - 1334] The compass my father Alec left behind led me to this forgotten labyrinth off Crete...",
      },
    ],
    audioSamples: [
      {
        id: "res-sophia-main",
        character: "Sophia (Denizlerin Akrebi)",
        voiceActor: "AI Ses Klonu (Anna Demetriou -> Türkçe RVC v2)",
        scene: "Sahne 01: Minotor Adası Kıyısı — Fırtına Sonrası",
        originalQuote:
          "My father died for this secret. I won't leave this island until the Labyrinth gives me answers.",
        turkishQuote:
          "Babam bu sır uğruna canını verdi. Labirent bana aradığım cevapları verene dek bu adadan ayrılmayacağım.",
        duration: "0:12",
        waveform: [42, 68, 89, 95, 76, 54, 84, 97, 81, 62, 91, 94, 65, 48, 79, 93, 86, 55, 71, 88, 60, 39],
        freqProfile: "warm",
      },
      {
        id: "res-minoan-echo",
        character: "Kadim Minos Savaşçısı (Yankı)",
        voiceActor: "AI Ses Klonu (Derin Yankılı XTTS-v2 Modeli)",
        scene: "Sahne 02: Bronz Çağı Görüsü — Prima Macula Tapınağı",
        originalQuote:
          "Blood awakens the ancient resonance. Walk in my shadow, daughter of the sea.",
        turkishQuote:
          "Kan, kadim yankıyı uyandırır... Gölgemi takip et, denizlerin kızı.",
        duration: "0:11",
        waveform: [55, 79, 94, 90, 72, 58, 86, 98, 85, 63, 50, 81, 95, 88, 67, 52, 83, 92, 74, 56, 43, 33],
        freqProfile: "low",
      },
      {
        id: "res-alec-memory",
        character: "Alec (Sophia'nın Kaçakçı Babası)",
        voiceActor: "AI Ses Klonu (Bariton AI Vokal)",
        scene: "Sahne 03: Venedik Limanı — Manastırdan Kaçış Anısı",
        originalQuote:
          "Never let them chain your spirit, Sophia. The sea belongs to those who dare.",
        turkishQuote:
          "Ruhunu zincirlemelerine asla izin verme Sophia. Denizler, yalnızca cesaret edenlerindir.",
        duration: "0:13",
        waveform: [38, 60, 82, 88, 71, 53, 79, 93, 84, 61, 47, 75, 90, 82, 64, 49, 77, 86, 68, 45, 36, 28],
        freqProfile: "dramatic",
      },
    ],
    voiceCast: [
      {
        character: "Sophia (Başrol)",
        actor: "AI RVC v2 + ElevenLabs Multilingual v2",
        role: "Anna Demetriou Orijinal Ses Tonu Klonu",
        sampleQuote: "Ben Denizlerin Akrebi'yim, kimseye hesap vermem.",
      },
      {
        character: "Alec & Korsan Mürettebatı",
        actor: "XTTS-v2 Çoklu Karakter Ses Modeli",
        role: "Venedik & Akdeniz Kaçakçıları",
        sampleQuote: "Rascasse yelken açmaya hazır kaptan!",
      },
      {
        character: "Minos Tapınağı Yankıları",
        actor: "AI Reverb & Akustik Filtreli Ses Modeli",
        role: "Bronz Çağı Görüleri ve Kehanet Sesleri",
        sampleQuote: "Labirentin kalbindeki yaratık uyanıyor.",
      },
    ],
    features: [
      "%100 Ücretsiz: Sadece kısa reklam linkini geçerek Google Drive, GitHub veya MediaFire üzerinden tam hızda indirin",
      "Yapay Zekâ Ses Klonlama: Karakterlerin orijinal ses rengi ve duygusu bozulmadan Türkçe konuşur",
      "Otomatik Ses-Altyazı Senkronu: Orijinal konuşma sürelerine (ms) sıkıştırılmış/uzatılmış doğal AI ses dosyaları",
      "Zouna Engine Uyumlu Türkçe Font: Ğ, Ü, Ş, İ, Ö, Ç harflerinde kutucuk hatası olmadan tam menü ve altyazı çevirisi",
      "Kolay Kurulum: İndirdiğiniz arşivdeki dosyaları oyun klasörüne atmanız yeterli (Steam & Game Pass uyumlu)",
    ],
    installNotes: [
      "Sitemize Google hesabınızla (veya üye olarak) giriş yapın ve 'Reklam Geç & Ücretsiz İndir' butonuna tıklayın.",
      "Açılan 5 saniyelik destek reklamını geçtikten sonra Google Drive, GitHub Releases veya MediaFire barındırıcısından .zip dosyasını indirin.",
      "İndirdiğiniz arşiv içindeki dosyaları 'Resonance - A Plague Tale Legacy' ana oyun klasörüne çıkartın ve oyuna girin!",
    ],
    isFeatured: true,
    collectionTag: "hazir-yama",
    ratingAvg: "5.0",
    reviewCount: 42,
    downloadsCount: 3840,
    wishlistVotes: 980,
    releaseDate: "Yayında • İlk AI Dublaj",
  },
  {
    slug: "a-plague-tale-requiem-ai-turkce-dublaj-projesi",
    title: "A Plague Tale: Requiem — Yapay Zeka (AI) Türkçe Dublaj [Yapım Aşamasında]",
    gameTitle: "A Plague Tale: Requiem",
    subtitle:
      "Amicia, Hugo ve Sophia'nın ana hikayesi için RVC v2 yapay zekâ Türkçe seslendirme eğitimi devam ediyor. İstek listesine ekleyip oy verin!",
    description:
      "Resonance: A Plague Tale Legacy dublajımızın ardından serinin efsanevi oyunu A Plague Tale: Requiem için AI ses klonlama ve diyalog zamanlama çalışmalarına başladık! Amicia, Hugo, Lucas ve Sophia karakterlerinin orijinal seslerini koruyarak hazırladığımız bu yama tamamlandığında yine %100 ücretsiz olarak reklam linki + Google Drive / GitHub üzerinden paylaşılacaktır. İstek listenize ekleyerek öncelik kazanmasını sağlayabilirsiniz.",
    status: "in_progress",
    progressPercent: 65,
    aiModelInfo: "RVC v2 Ses Eğitimi (%65 Tamamlandı) + XTTS-v2",
    adShortlinkUrl: "https://ay.live/tr-dublaj-requiem",
    hostMirrors: [
      {
        provider: "GitHub Releases",
        url: "https://github.com/tr-dublaj/plague-tale-requiem-tr",
        label: "GitHub Proje Takip Sayfası (Yakında İndirmeye Açılacak)",
      },
    ],
    price: 0,
    originalPrice: 0,
    patchType: "ai_full_dub",
    patchTypeLabel: "YAPIMDA (%65) • SIRADAKİ DUBLAJ",
    genre: "hikaye-odakli",
    genreLabel: "Sinematik Macera / Dram",
    platforms: ["Steam", "Epic Games", "Xbox PC Game Pass"],
    version: "v0.65-BETA",
    fileSize: "~3.4 GB",
    gameVersionCompat: "A Plague Tale: Requiem (Tüm Sürümler)",
    voiceActorCount: 22,
    translatedLinesCount: "32.000+ Satır",
    studioHours: 95,
    coverImage: "/images/tlou-part1.jpg",
    galleryImages: [
      {
        url: "/images/tlou-part1.jpg",
        caption: "Amicia & Hugo — AI Ses Klonlama Test Kayıtları Devam Ediyor",
        tag: "AI EĞİTİM AŞAMASINDA (%65)",
        dialoguePreviewTr:
          "Amicia (AI Test): \"Hugo, elimi bırakma! Güneydeki o adaya birlikte ulaşacağız.\"",
        dialoguePreviewEn:
          "Amicia: \"Hugo, don't let go of my hand! We will reach that island in the south together.\"",
      },
    ],
    audioSamples: [
      {
        id: "req-amicia",
        character: "Amicia de Rune (AI Test Demosu)",
        voiceActor: "AI Ses Klonu (Charlotte McBurney -> Türkçe RVC)",
        scene: "Demo Sahnesi: Kızıl Deniz ve Sophia ile Tanışma",
        originalQuote: "Sophia, we need your ship. He's everything I have left.",
        turkishQuote: "Sophia, gemine ihtiyacımız var... O benim hayatta kalan tek varlığım.",
        duration: "0:10",
        waveform: [35, 58, 79, 91, 84, 62, 77, 94, 80, 55, 71, 88, 69, 48, 74, 85, 63, 44, 59, 72, 46, 30],
        freqProfile: "warm",
      },
    ],
    voiceCast: [
      {
        character: "Amicia & Hugo",
        actor: "AI RVC v2 Modeli (Eğitiliyor)",
        role: "Başrol Karakterler",
        sampleQuote: "Güneşin doğduğu yere gideceğiz Amicia.",
      },
    ],
    features: [
      "Tamamlandığında %100 Ücretsiz olarak Google Drive ve GitHub üzerinden yayınlanacak",
      "Resonance: A Plague Tale Legacy'deki Sophia AI ses modeliyle birebir uyumlu devamlılık",
    ],
    installNotes: [
      "Şu anda yapım aşamasındadır (%65). İstek listenize ekleyerek çıktığı an bildirim alabilirsiniz.",
    ],
    isFeatured: true,
    collectionTag: "yapim-asamasinda",
    ratingAvg: "4.9",
    reviewCount: 18,
    downloadsCount: 0,
    wishlistVotes: 645,
    releaseDate: "Yapım Aşamasında (%65)",
  },
  {
    slug: "cyberpunk-2077-ai-turkce-dublaj-istek-listesi",
    title: "Cyberpunk 2077 — Yapay Zeka (AI) Türkçe Dublaj [İstek Listesi & Oylama]",
    gameTitle: "Cyberpunk 2077",
    subtitle:
      " Resmi Türkçe altyazının üzerine V ve Johnny Silverhand için AI Türkçe seslendirme! Öncelik verilmesi için oy verin.",
    description:
      "Oyuncular tarafından en çok talep edilen projelerden biri! Cyberpunk 2077 zaten Türkçe altyazıya sahip olduğu için, mevcut Türkçe metinleri referans alarak V ve Johnny Silverhand başta olmak üzere ana hikaye diyaloglarını AI ile seslendirmeyi planlıyoruz. İstek listenize ekleyip oy vererek sıradaki proje olmasını sağlayabilirsiniz.",
    status: "wishlist",
    progressPercent: 20,
    aiModelInfo: "XTTS-v2 + RVC Ses Haritalama (Oylama Aşamasında)",
    adShortlinkUrl: "https://ay.live/tr-dublaj-cp2077",
    hostMirrors: [
      {
        provider: "GitHub Releases",
        url: "https://github.com/tr-dublaj",
        label: "İstek Listesinde — Oylama Sonrası Yayınlanacak",
      },
    ],
    price: 0,
    originalPrice: 0,
    patchType: "wishlist_vote",
    patchTypeLabel: "İSTEK LİSTESİ • OY VER",
    genre: "aksiyon-rpg",
    genreLabel: "Siber-RPG / Açık Dünya",
    platforms: ["Steam", "Epic Games", "GOG"],
    version: "Planlanıyor",
    fileSize: "~5.5 GB",
    gameVersionCompat: "Cyberpunk 2077 v2.1+",
    voiceActorCount: 30,
    translatedLinesCount: "Resmi TR Altyazı Tabanlı",
    studioHours: 0,
    coverImage: "/images/hero-cyberpunk.jpg",
    galleryImages: [
      {
        url: "/images/hero-cyberpunk.jpg",
        caption: "Johnny Silverhand AI Ses Klonu Demosu — Oyuncu Oylamasında",
        tag: "İSTEK LİSTESİ PROJESİ",
        dialoguePreviewTr:
          "Johnny Silverhand (AI Demo): \"Uyan bakalım samuray... Yakmamız gereken bir şehir var.\"",
        dialoguePreviewEn:
          "Johnny Silverhand: \"Wake the f*** up, Samurai... We have a city to burn.\"",
      },
    ],
    audioSamples: [
      {
        id: "cp-ai-demo",
        character: "Johnny Silverhand (AI Prototip)",
        voiceActor: "AI RVC Prototip Ses",
        scene: "Prototip Demo: Tapeworm Diyaloğu",
        originalQuote: "Wake up, Samurai. We have a city to burn.",
        turkishQuote: "Uyan bakalım samuray... Yakmamız gereken koca bir şehir var.",
        duration: "0:09",
        waveform: [40, 72, 91, 85, 60, 88, 95, 73, 52, 81, 90, 64, 45, 76, 89, 70, 50, 68, 82, 55, 38, 29],
        freqProfile: "dramatic",
      },
    ],
    voiceCast: [
      {
        character: "Johnny Silverhand & V",
        actor: "AI Ses Klonlama (Hazırlık)",
        role: "Ana Hikaye Seslendirmesi",
        sampleQuote: "Night City'de efsane olacağız.",
      },
    ],
    features: [
      "Oylamada yeterli desteğe ulaştığında ücretsiz olarak hazırlanıp yayınlanacaktır",
    ],
    installNotes: [
      "İstek listenize ekleyerek (Kalp / + İstek Listesi) projeye oy verebilirsiniz.",
    ],
    isFeatured: true,
    collectionTag: "istek-listesi",
    ratingAvg: "4.9",
    reviewCount: 12,
    downloadsCount: 0,
    wishlistVotes: 812,
    releaseDate: "İstek Listesinde (Oylanıyor)",
  },
  {
    slug: "god-of-war-ragnarok-ai-turkce-dublaj-istek",
    title: "God of War Ragnarök — Yapay Zeka (AI) Türkçe Dublaj [İstek Listesi]",
    gameTitle: "God of War Ragnarök",
    subtitle:
      "Kratos ve Atreus'un diyaloglarını derin bariton AI ses modeliyle Türkçeleştirme projesi. Sıraya alınması için oy verin!",
    description:
      "Kratos'un karakteristik derin bas sesini RVC v2 ile klonlayarak God of War Ragnarök PC sürümünü Türkçe seslendirmek için hazırlanan istek listesi projesi. Ücretsiz olarak yayınlanacaktır.",
    status: "wishlist",
    progressPercent: 15,
    aiModelInfo: "Derin Bas RVC v2 Kratos Ses Modeli",
    adShortlinkUrl: "https://ay.live/tr-dublaj-gow",
    hostMirrors: [
      {
        provider: "Google Drive",
        url: "https://drive.google.com",
        label: "İstek Listesi Oylamasında",
      },
    ],
    price: 0,
    originalPrice: 0,
    patchType: "wishlist_vote",
    patchTypeLabel: "İSTEK LİSTESİ • OY VER",
    genre: "hikaye-odakli",
    genreLabel: "Mitolojik Aksiyon",
    platforms: ["Steam", "Epic Games"],
    version: "Planlanıyor",
    fileSize: "~4.5 GB",
    gameVersionCompat: "God of War Ragnarök PC",
    voiceActorCount: 20,
    translatedLinesCount: "52.000+ Satır",
    studioHours: 0,
    coverImage: "/images/gow-ragnarok.jpg",
    galleryImages: [
      {
        url: "/images/gow-ragnarok.jpg",
        caption: "Kratos AI Bariton Ses Prototipi — İstek Listesi Oylamasında",
        tag: "İSTEK LİSTESİ",
        dialoguePreviewTr: "Kratos (AI Prototip): \"Ölüm beni ancak hak ettiğinde alabilir.\"",
        dialoguePreviewEn: "Kratos: \"Death can have me when it earns me.\"",
      },
    ],
    audioSamples: [
      {
        id: "gow-ai-kratos",
        character: "Kratos (AI Ses Prototipi)",
        voiceActor: "AI Bariton RVC Modeli",
        scene: "Prototip: Midgard",
        originalQuote: "Death can have me when it earns me.",
        turkishQuote: "Ölüm beni ancak hak ettiğinde alabilir.",
        duration: "0:08",
        waveform: [62, 88, 96, 85, 70, 91, 98, 82, 60, 79, 92, 74, 55, 83, 90, 68, 50, 72, 81, 58, 42, 34],
        freqProfile: "low",
      },
    ],
    voiceCast: [
      {
        character: "Kratos & Atreus",
        actor: "AI RVC v2 Modeli",
        role: "Ana Karakterler",
        sampleQuote: "Savaşa hazırlanacağız.",
      },
    ],
    features: [
      "Oyuncu oylamasıyla sıraya alınacak %100 ücretsiz AI dublaj projesi",
    ],
    installNotes: [
      "İstek listesine ekleyerek oyunuzu kullanabilirsiniz.",
    ],
    isFeatured: false,
    collectionTag: "istek-listesi",
    ratingAvg: "5.0",
    reviewCount: 9,
    downloadsCount: 0,
    wishlistVotes: 730,
    releaseDate: "İstek Listesinde (Oylanıyor)",
  },
  {
    slug: "red-dead-redemption-2-ai-turkce-dublaj-istek",
    title: "Red Dead Redemption 2 — Yapay Zeka (AI) Türkçe Dublaj [İstek Listesi]",
    gameTitle: "Red Dead Redemption 2",
    subtitle:
      "Arthur Morgan ve Dutch van der Linde'nin seslerini AI ile klonlayarak ana görevleri Türkçe seslendirme projesi.",
    description:
      "Red Dead Redemption 2'nin devasa dünyasında en azından ana hikaye sinematiklerini Arthur Morgan'ın kendi ses rengiyle Türkçe dinlemek isteyen oyuncular için açılan istek listesi oylaması.",
    status: "wishlist",
    progressPercent: 10,
    aiModelInfo: "Arthur Morgan RVC v2 Ses Klonu (Planlanıyor)",
    adShortlinkUrl: "https://ay.live/tr-dublaj-rdr2",
    hostMirrors: [
      {
        provider: "Google Drive",
        url: "https://drive.google.com",
        label: "İstek Listesi Oylamasında",
      },
    ],
    price: 0,
    originalPrice: 0,
    patchType: "wishlist_vote",
    patchTypeLabel: "İSTEK LİSTESİ • OY VER",
    genre: "acik-dunya",
    genreLabel: "Açık Dünya / Western",
    platforms: ["Steam", "Epic Games", "Rockstar"],
    version: "Planlanıyor",
    fileSize: "~5.0 GB",
    gameVersionCompat: "RDR2 Hikaye Modu",
    voiceActorCount: 25,
    translatedLinesCount: "Ana Hikaye Sinematikleri",
    studioHours: 0,
    coverImage: "/images/rdr2-western.jpg",
    galleryImages: [
      {
        url: "/images/rdr2-western.jpg",
        caption: "Arthur Morgan AI Ses Klonu — İstek Listesi",
        tag: "İSTEK LİSTESİ",
        dialoguePreviewTr: "Arthur Morgan: \"Sana elimdeki her şeyi verdim Dutch...\"",
        dialoguePreviewEn: "Arthur Morgan: \"I gave you all I had, Dutch...\"",
      },
    ],
    audioSamples: [
      {
        id: "rdr-ai-arthur",
        character: "Arthur Morgan (AI Prototip)",
        voiceActor: "AI RVC Western Modeli",
        scene: "Prototip: Kamp Ateşi",
        originalQuote: "I gave you all I had, Dutch.",
        turkishQuote: "Sana elimdeki her şeyi verdim Dutch.",
        duration: "0:08",
        waveform: [44, 69, 85, 92, 78, 59, 83, 94, 76, 54, 79, 88, 67, 49, 73, 86, 62, 45, 64, 75, 48, 32],
        freqProfile: "warm",
      },
    ],
    voiceCast: [
      {
        character: "Arthur Morgan",
        actor: "AI RVC v2 Modeli",
        role: "Başrol",
        sampleQuote: "Bizler artık kimsenin istemediği bir çağın hayaletleriyiz.",
      },
    ],
    features: [
      "Tamamen ücretsiz reklam destekli dağıtım",
    ],
    installNotes: [
      "İstek listenize ekleyerek bu oyuna öncelik verilmesini sağlayabilirsiniz.",
    ],
    isFeatured: false,
    collectionTag: "istek-listesi",
    ratingAvg: "4.9",
    reviewCount: 15,
    downloadsCount: 0,
    wishlistVotes: 910,
    releaseDate: "İstek Listesinde (Oylanıyor)",
  },
];

export const INITIAL_REVIEWS: Omit<NewReview, "id" | "createdAt">[] = [
  {
    productId: 1,
    authorName: "Kerem A.",
    gamerTag: "PlagueHunter_TR",
    platform: "Steam",
    rating: 5,
    title: "Resonance: A Plague Tale Legacy AI dublajı inanılmaz doğal olmuş!",
    comment:
      "Yapay zeka ile yapıldığını bilmesem gerçek seslendirme sanırdım. Sophia'nın orijinal İngilizce ses tonu hiç bozulmadan Türkçe konuşuyor. Üstelik tamamen ücretsiz olması, sadece 5 saniyelik reklam geçip Google Drive'dan tam hızda indirmemiz harika. Eline emeğine sağlık!",
    verifiedPurchase: true,
    playtimeHours: 18,
    helpfulCount: 94,
  },
  {
    productId: 1,
    authorName: "Melis D.",
    gamerTag: "SeaScorpion_Sophia",
    platform: "Xbox PC Game Pass",
    rating: 5,
    title: "Minotor Adası atmosferini Türkçe dublajla oynamak bambaşka",
    comment:
      "A Plague Tale serisini çok seviyordum, Resonance çıktığı gibi AI Türkçe dublajının gelmesi muazzam oldu. Kılıç savuşturma ve aksiyon sahnelerinde altyazı okumaya çalışmadan doğrudan Sophia'nın Türkçe sesini duymak çok keyifli. Sıradaki oyun kesinlikle Requiem olmalı!",
    verifiedPurchase: true,
    playtimeHours: 14,
    helpfulCount: 67,
  },
  {
    productId: 1,
    authorName: "Baran T.",
    gamerTag: "GitHubGamer",
    platform: "Steam",
    rating: 5,
    title: "Google ile tek tıkla üye oldum, GitHub linkinden saniyesinde indi",
    comment:
      "Paralı yama satmaya çalışan sitelerden bıkmıştık. Reklam tıklamasıyla yapımcıyı destekleyip ücretsiz indirme mantığı çok adil. Kurulumu da aşırı basit, klasöre atıp direkt Türkçe sesle oynadım.",
    verifiedPurchase: true,
    playtimeHours: 22,
    helpfulCount: 53,
  },
  {
    productId: 2,
    authorName: "Oğuz K.",
    gamerTag: "MaculaKnight",
    platform: "Steam",
    rating: 5,
    title: "Resonance'ı bitirdim, dört gözle Requiem AI dublajını bekliyorum!",
    comment:
      "İlk yaptığın Resonance dublajı çok başarılıydı. Requiem'in de %65'e gelmesine çok sevindim, hemen istek listeme ekledim ve oy verdim.",
    verifiedPurchase: true,
    playtimeHours: 35,
    helpfulCount: 41,
  },
];

export const INITIAL_GAME_REQUESTS: Omit<NewGameRequest, "id" | "createdAt">[] = [
  {
    gameTitle: "A Plague Tale: Requiem",
    requesterName: "Melis D. (@SeaScorpion_Sophia)",
    requesterProvider: "Google Üyesi",
    note: "Resonance: A Plague Tale Legacy'deki Sophia AI sesi harika olmuş, Amicia ve Hugo için Requiem dublajı hemen gelsin!",
    aiDifficulty: "Orta • ~32.000 Satır",
    status: "AI Ses Eğitiliyor (%65)",
    votes: 342,
  },
  {
    gameTitle: "A Plague Tale: Innocence",
    requesterName: "Kerem A. (@PlagueHunter_TR)",
    requesterProvider: "Google Üyesi",
    note: "Serinin ilk oyunu Innocence da AI Türkçe dublaj olursa tüm üçlemeyi Türkçe sesli bitirebiliriz.",
    aiDifficulty: "Kolay-Orta • ~19.000 Satır",
    status: "Sıraya Alındı",
    votes: 218,
  },
  {
    gameTitle: "Clair Obscur: Expedition 33",
    requesterName: "Emirhan S. (@TurnBasedTR)",
    requesterProvider: "GitHub Üyesi",
    note: "Diyalogları ve sinematikleri AI ses klonlamaya çok uygun, istek listesine eklensin lütfen.",
    aiDifficulty: "Orta • ~28.000 Satır",
    status: "Oylanıyor",
    votes: 189,
  },
  {
    gameTitle: "Silent Hill 2 Remake",
    requesterName: "Cemre Y. (@FogWalker)",
    requesterProvider: "Google Üyesi",
    note: "Az ama çok etkileyici diyalogları var, AI dublaj ile kısa sürede hazır olabilir!",
    aiDifficulty: "Kolay • ~9.500 Satır",
    status: "Oylanıyor",
    votes: 276,
  },
];
