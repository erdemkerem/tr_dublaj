import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export interface GalleryImageItem {
  url: string;
  caption: string;
  tag: string;
  dialoguePreviewTr?: string;
  dialoguePreviewEn?: string;
}

export interface AudioSampleItem {
  id: string;
  character: string;
  voiceActor: string; // e.g., "AI Ses Klonu (RVC v2 + XTTS)"
  scene: string;
  originalQuote: string;
  turkishQuote: string;
  duration: string;
  waveform: number[];
  freqProfile: "low" | "mid" | "warm" | "dramatic";
}

export interface VoiceCastMember {
  character: string;
  actor: string; // AI Model / Ses Profili
  role: string;
  sampleQuote: string;
}

export interface HostMirrorItem {
  provider: string; // "Google Drive" | "GitHub Releases" | "MediaFire" | "Mega.nz" | "Pixeldrain"
  url: string;
  label: string;
}

export interface OrderItemRecord {
  productId: number;
  slug: string;
  title: string;
  gameTitle: string;
  price: number;
  quantity: number;
  version: string;
  fileSize: string;
  licenseKey: string;
  installerName: string;
  adShortlinkUrl?: string;
  hostMirrors?: HostMirrorItem[];
}

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  gameTitle: text("game_title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("ready"), // "ready" (Yayında / Hazır) | "in_progress" (AI Eğitiliyor / Yapımda) | "wishlist" (İstek Listesinde)
  progressPercent: integer("progress_percent").notNull().default(100),
  aiModelInfo: text("ai_model_info").notNull().default("ElevenLabs Dubbing + RVC v2 Ses Klonlama"),
  adShortlinkUrl: text("ad_shortlink_url").notNull().default("https://ay.live/tr-dublaj-resonance"),
  hostMirrors: jsonb("host_mirrors").$type<HostMirrorItem[]>().notNull().default([]),
  price: integer("price").notNull().default(0), // 0 = ÜCRETSİZ (Reklam Geçerek)
  originalPrice: integer("original_price"),
  patchType: text("patch_type").notNull(), // "ai_full_dub" | "ai_voice_sub" | "wishlist_vote"
  patchTypeLabel: text("patch_type_label").notNull(),
  genre: text("genre").notNull(),
  genreLabel: text("genre_label").notNull(),
  platforms: jsonb("platforms").$type<string[]>().notNull(),
  version: text("version").notNull(),
  fileSize: text("file_size").notNull(),
  gameVersionCompat: text("game_version_compat").notNull(),
  voiceActorCount: integer("voice_actor_count").notNull(), // AI Klonlanan Karakter Sayısı
  translatedLinesCount: text("translated_lines_count").notNull(),
  studioHours: integer("studio_hours").notNull(), // GPU Render Saati
  coverImage: text("cover_image").notNull(),
  galleryImages: jsonb("gallery_images").$type<GalleryImageItem[]>().notNull(),
  audioSamples: jsonb("audio_samples").$type<AudioSampleItem[]>().notNull(),
  voiceCast: jsonb("voice_cast").$type<VoiceCastMember[]>().notNull(),
  features: jsonb("features").$type<string[]>().notNull(),
  installNotes: jsonb("install_notes").$type<string[]>().notNull(),
  isFeatured: boolean("is_featured").notNull().default(false),
  collectionTag: text("collection_tag").notNull(), // "hazir-yama" | "yapim-asamasinda" | "istek-listesi"
  ratingAvg: text("rating_avg").notNull(),
  reviewCount: integer("review_count").notNull().default(0),
  downloadsCount: integer("downloads_count").notNull().default(0),
  wishlistVotes: integer("wishlist_votes").notNull().default(0),
  releaseDate: text("release_date").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  authorName: text("author_name").notNull(),
  gamerTag: text("gamer_tag").notNull(),
  platform: text("platform").notNull(),
  rating: integer("rating").notNull(),
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  verifiedPurchase: boolean("verified_purchase").notNull().default(true),
  playtimeHours: integer("playtime_hours").notNull(),
  helpfulCount: integer("helpful_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  avatarUrl: text("avatar_url"),
  provider: text("provider").notNull().default("google"), // "google" | "github" | "discord" | "email"
  gamerTag: text("gamer_tag").notNull(),
  role: text("role").notNull().default("member"), // "member" | "admin"
  // E-posta onay: kod 15 dakika geçerlidir — onaylanmadan üyelik aktif olmaz
  isVerified: boolean("is_verified").notNull().default(false),
  verificationCode: text("verification_code"),
  verificationExpiresAt: timestamp("verification_expires_at"),
  // İsteğe bağlı profil bilgileri
  birthDate: text("birth_date"),
  gender: text("gender"), // "erkek" | "kadin" | "belirtmek_istemiyor"
  downloadsUnlocked: integer("downloads_unlocked").notNull().default(0),
  // Üyelik sözleşmesi / KVKK onayı — onaysız kayıt açılmaz
  termsAccepted: boolean("terms_accepted").notNull().default(false),
  termsAcceptedAt: timestamp("terms_accepted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const gameRequests = pgTable("game_requests", {
  id: serial("id").primaryKey(),
  gameTitle: text("game_title").notNull(),
  requesterName: text("requester_name").notNull(),
  requesterProvider: text("requester_provider").notNull().default(""),
  note: text("note").notNull(),
  aiDifficulty: text("ai_difficulty").notNull().default("Orta • ~25.000 Satır"),
  status: text("status").notNull().default("Oylanıyor"), // "Oylanıyor" | "AI Ses Eğitiliyor" | "Sıraya Alındı"
  votes: integer("votes").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  gamerTag: text("gamer_tag"),
  paymentMethod: text("payment_method").notNull(),
  couponCode: text("coupon_code"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull(),
  items: jsonb("items").$type<OrderItemRecord[]>().notNull(),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type GameRequest = typeof gameRequests.$inferSelect;
export type NewGameRequest = typeof gameRequests.$inferInsert;
export type Order = typeof orders.$inferSelect;
