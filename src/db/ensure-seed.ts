import { db, pool } from "./index";
import {
  products,
  reviews,
  orders,
  users,
  gameRequests,
  type Product,
  type Review,
  type Order,
  type GameRequest,
} from "./schema";
import { INITIAL_PRODUCTS } from "./seed-data";
import { eq, desc, asc } from "drizzle-orm";

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureDatabaseSeeded(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          game_title TEXT NOT NULL,
          subtitle TEXT NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'ready',
          progress_percent INTEGER NOT NULL DEFAULT 100,
          ai_model_info TEXT NOT NULL DEFAULT 'ElevenLabs + RVC v2 AI Ses Klonlama',
          ad_shortlink_url TEXT NOT NULL DEFAULT 'https://ay.live/tr-dublaj',
          host_mirrors JSONB NOT NULL DEFAULT '[]'::jsonb,
          price INTEGER NOT NULL DEFAULT 0,
          original_price INTEGER,
          patch_type TEXT NOT NULL,
          patch_type_label TEXT NOT NULL,
          genre TEXT NOT NULL,
          genre_label TEXT NOT NULL,
          platforms JSONB NOT NULL,
          version TEXT NOT NULL,
          file_size TEXT NOT NULL,
          game_version_compat TEXT NOT NULL,
          voice_actor_count INTEGER NOT NULL,
          translated_lines_count TEXT NOT NULL,
          studio_hours INTEGER NOT NULL,
          cover_image TEXT NOT NULL,
          gallery_images JSONB NOT NULL,
          audio_samples JSONB NOT NULL,
          voice_cast JSONB NOT NULL,
          features JSONB NOT NULL,
          install_notes JSONB NOT NULL,
          is_featured BOOLEAN NOT NULL DEFAULT false,
          collection_tag TEXT NOT NULL,
          rating_avg TEXT NOT NULL,
          review_count INTEGER NOT NULL DEFAULT 0,
          downloads_count INTEGER NOT NULL DEFAULT 0,
          wishlist_votes INTEGER NOT NULL DEFAULT 0,
          release_date TEXT NOT NULL
        );

        ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'ready';
        ALTER TABLE products ADD COLUMN IF NOT EXISTS progress_percent INTEGER NOT NULL DEFAULT 100;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS ai_model_info TEXT NOT NULL DEFAULT 'ElevenLabs + RVC v2 AI Ses Klonlama';
        ALTER TABLE products ADD COLUMN IF NOT EXISTS ad_shortlink_url TEXT NOT NULL DEFAULT 'https://ay.live/tr-dublaj';
        ALTER TABLE products ADD COLUMN IF NOT EXISTS host_mirrors JSONB NOT NULL DEFAULT '[]'::jsonb;
        ALTER TABLE products ADD COLUMN IF NOT EXISTS wishlist_votes INTEGER NOT NULL DEFAULT 0;

        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL,
          author_name TEXT NOT NULL,
          gamer_tag TEXT NOT NULL,
          platform TEXT NOT NULL,
          rating INTEGER NOT NULL,
          title TEXT NOT NULL,
          comment TEXT NOT NULL,
          verified_purchase BOOLEAN NOT NULL DEFAULT true,
          playtime_hours INTEGER NOT NULL,
          helpful_count INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          avatar_url TEXT,
          provider TEXT NOT NULL DEFAULT 'google',
          gamer_tag TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'member',
          downloads_unlocked INTEGER NOT NULL DEFAULT 0,
          terms_accepted BOOLEAN NOT NULL DEFAULT false,
          terms_accepted_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN NOT NULL DEFAULT false;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS terms_accepted_at TIMESTAMP;

        CREATE TABLE IF NOT EXISTS game_requests (
          id SERIAL PRIMARY KEY,
          game_title TEXT NOT NULL,
          requester_name TEXT NOT NULL,
          requester_provider TEXT NOT NULL DEFAULT 'Google Üyesi',
          note TEXT NOT NULL,
          ai_difficulty TEXT NOT NULL DEFAULT 'Orta • ~25.000 Satır',
          status TEXT NOT NULL DEFAULT 'Oylanıyor',
          votes INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS orders (
          id SERIAL PRIMARY KEY,
          order_number TEXT NOT NULL UNIQUE,
          customer_name TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          gamer_tag TEXT,
          payment_method TEXT NOT NULL,
          coupon_code TEXT,
          subtotal INTEGER NOT NULL,
          discount INTEGER NOT NULL DEFAULT 0,
          total INTEGER NOT NULL,
          items JSONB NOT NULL,
          status TEXT NOT NULL DEFAULT 'completed',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Check if Resonance: A Plague Tale Legacy is present; if not, reset products & reviews to the new AI Dubbing catalog
      const resonanceExists = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, "resonance-a-plague-tale-legacy-ai-turkce-dublaj"))
        .limit(1);

      if (resonanceExists.length === 0) {
        await pool.query(`TRUNCATE TABLE products, reviews RESTART IDENTITY CASCADE;`);

        const insertedProducts = await db
          .insert(products)
          .values(INITIAL_PRODUCTS)
          .returning({ id: products.id, slug: products.slug });

        if (insertedProducts.length > 0) {
          // Ürünler eklenir ama SAHTE (demo) yorumlar artık eklenmez.
          // Sitede yalnızca üyelerin gerçekten yazdığı yorumlar görünür.
          void insertedProducts;
        }
      }

      // İstek listesi SEED EDİLMEZ: buraya yalnızca üyelerin gerçekten
      // eklediği oyun istekleri kaydedilir, sahte/demo veri girilmez.

      const existingUsers = await db
        .select({ id: users.id })
        .from(users)
        .limit(1);

      if (existingUsers.length === 0) {
        await db.insert(users).values([
          {
            name: "Kurucu (tr_dublaj AI)",
            email: "admin@trdublaj.github.io",
            provider: "github",
            gamerTag: "tr_dublaj_dev",
            role: "admin",
            downloadsUnlocked: 42,
          },
        ]);
      }

      isInitialized = true;
    } catch (error) {
      console.error("Database initialization/seed error:", error);
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
}

export async function getAllProducts(): Promise<Product[]> {
  await ensureDatabaseSeeded();
  return db.select().from(products).orderBy(asc(products.id));
}

export async function getAllGameRequests(): Promise<GameRequest[]> {
  await ensureDatabaseSeeded();
  return db.select().from(gameRequests).orderBy(desc(gameRequests.votes), desc(gameRequests.id));
}

export async function getProductBySlug(slug: string): Promise<{
  product: Product;
  productReviews: Review[];
  relatedProducts: Product[];
} | null> {
  await ensureDatabaseSeeded();
  const found = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (found.length === 0) return null;
  const product = found[0];

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt), desc(reviews.id));

  const allProds = await db.select().from(products).orderBy(asc(products.id));
  const relatedProducts = allProds
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return {
    product,
    productReviews,
    relatedProducts,
  };
}

export async function getRecentReviews(
  limit = 6
): Promise<(Review & { gameTitle?: string; productSlug?: string })[]> {
  await ensureDatabaseSeeded();
  const allReviews = await db
    .select()
    .from(reviews)
    .orderBy(desc(reviews.helpfulCount), desc(reviews.id))
    .limit(limit);

  const allProducts = await db.select().from(products);
  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  return allReviews.map((r) => ({
    ...r,
    gameTitle: productMap.get(r.productId)?.gameTitle,
    productSlug: productMap.get(r.productId)?.slug,
  }));
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  await ensureDatabaseSeeded();
  const found = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  return found[0] ?? null;
}
