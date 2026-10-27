"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import type { Product, AudioSampleItem, Order, User, HostMirrorItem } from "@/db/schema";

export interface CartItem {
  productId: number;
  slug: string;
  title: string;
  gameTitle: string;
  status: string;
  price: number;
  originalPrice?: number | null;
  coverImage: string;
  patchTypeLabel: string;
  version: string;
  fileSize: string;
  platforms: string[];
  adShortlinkUrl: string;
  hostMirrors: HostMirrorItem[];
  quantity: number;
}

export interface ActiveAudioPreview {
  sample: AudioSampleItem;
  productTitle: string;
  productSlug: string;
  mode: "tr" | "en";
  progress: number;
  isPlaying: boolean;
}

interface StoreContextValue {
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isLicenseModalOpen: boolean;
  isAuthModalOpen: boolean;
  isAdminModalOpen: boolean;
  activeDownloadProduct: Product | null;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logoutUser: () => void;
  isAdmin: boolean;
  adminKey: string;
  loginAdmin: (key: string) => Promise<boolean>;
  logoutAdmin: () => void;
  adminFetch: (input: string, init?: RequestInit) => Promise<Response>;
  couponCode: string;
  setCouponCode: (code: string) => void;
  addToCart: (product: Product, openDrawer?: boolean) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: (product?: Product) => void;
  closeCheckout: () => void;
  openLicenseModal: () => void;
  closeLicenseModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  subtotal: number;
  bundleDiscount: number;
  couponDiscount: number;
  totalDiscount: number;
  total: number;
  itemCount: number;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  activeAudio: ActiveAudioPreview | null;
  playStudioSample: (
    sample: AudioSampleItem,
    productTitle: string,
    productSlug: string,
    mode?: "tr" | "en"
  ) => void;
  stopStudioSample: () => void;
  toggleAudioMode: (mode: "tr" | "en") => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const CART_STORAGE_KEY = "tr_dublaj_wishlist_v2";
const USER_STORAGE_KEY = "tr_dublaj_user_v2";
const LAST_ORDER_KEY = "tr_dublaj_last_order_v2";
const ADMIN_KEY_STORAGE = "tr_dublaj_admin_key_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeDownloadProduct, setActiveDownloadProduct] =
    useState<Product | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [lastOrder, setLastOrderState] = useState<Order | null>(null);
  const [activeAudio, setActiveAudio] = useState<ActiveAudioPreview | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        setCurrentUserState(JSON.parse(savedUser));
      }
      const savedOrder = localStorage.getItem(LAST_ORDER_KEY);
      if (savedOrder) {
        setLastOrderState(JSON.parse(savedOrder));
      }
      const savedAdminKey = localStorage.getItem(ADMIN_KEY_STORAGE);
      if (savedAdminKey) {
        setAdminKey(savedAdminKey);
      }
    } catch (e) {
      console.error("Failed to read localStorage:", e);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save wishlist:", e);
    }
  }, [cart, isHydrated]);

  const setCurrentUser = useCallback((user: User | null) => {
    setCurrentUserState(user);
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error("Failed to save user:", e);
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    showToast("Oturumunuz kapatıldı.");
  }, [setCurrentUser, showToast]);

  /** Site sahibi yönetici girişi — anahtar sunucuda doğrulanır. */
  const loginAdmin = useCallback(
    async (key: string): Promise<boolean> => {
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          setAdminKey(key);
          try {
            localStorage.setItem(ADMIN_KEY_STORAGE, key);
          } catch {
            // storage opsiyonel
          }
          showToast(data.message || "Yönetici girişi başarılı!");
          return true;
        }
        showToast(data.error || "Yönetici anahtarı hatalı.");
        return false;
      } catch {
        showToast("Yönetici doğrulaması yapılamadı.");
        return false;
      }
    },
    [showToast]
  );

  const logoutAdmin = useCallback(() => {
    setAdminKey("");
    try {
      localStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch {
      // ignore
    }
    showToast("Yönetici oturumu kapatıldı.");
  }, [showToast]);

  /** Admin anahtarını header olarak ekleyen güvenli istek yardımcısı. */
  const adminFetch = useCallback(
    (input: string, init: RequestInit = {}) => {
      return fetch(input, {
        ...init,
        headers: {
          ...(init.headers || {}),
          "x-admin-key": adminKey,
        },
      });
    },
    [adminKey]
  );

  const setLastOrder = useCallback((order: Order | null) => {
    setLastOrderState(order);
    try {
      if (order) {
        localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      } else {
        localStorage.removeItem(LAST_ORDER_KEY);
      }
    } catch (e) {
      console.error("Failed to save last order:", e);
    }
  }, []);

  const addToCart = useCallback(
    (product: Product, openDrawer = true) => {
      setCart((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === product.id);
        if (existingIndex > -1) {
          return prev;
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            title: product.title,
            gameTitle: product.gameTitle,
            status: product.status || "ready",
            price: 0,
            originalPrice: 0,
            coverImage: product.coverImage,
            patchTypeLabel: product.patchTypeLabel,
            version: product.version,
            fileSize: product.fileSize,
            platforms: product.platforms,
            adShortlinkUrl:
              product.adShortlinkUrl || "https://ay.live/tr-dublaj",
            hostMirrors: product.hostMirrors || [],
            quantity: 1,
          },
        ];
      });
      showToast(
        product.status === "ready"
          ? `${product.gameTitle} indirme & istek listenize eklendi!`
          : `${product.gameTitle} istek listenize eklendi (Çıktığında bildirim alacaksınız)`
      );
      if (openDrawer) {
        setIsCartOpen(true);
      }
    },
    [showToast]
  );

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const openCheckout = useCallback((product?: Product) => {
    if (product) {
      setActiveDownloadProduct(product);
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  const stopStudioSample = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setActiveAudio((prev) =>
      prev ? { ...prev, isPlaying: false, progress: 0 } : null
    );
  }, []);

  const triggerStudioSoundCue = useCallback(
    (freqProfile: AudioSampleItem["freqProfile"], mode: "tr" | "en") => {
      try {
        if (typeof window === "undefined") return;
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContextClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        const now = ctx.currentTime;
        const baseFreq =
          freqProfile === "low"
            ? 110
            : freqProfile === "dramatic"
            ? 130.81
            : freqProfile === "warm"
            ? 146.83
            : 164.81;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = mode === "tr" ? "triangle" : "sine";
        osc2.type = "sine";
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.025, now + 1.4);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.85);
        osc2.stop(now + 2.85);
      } catch {
        // Ignore audio autoplay constraint errors
      }
    },
    []
  );

  const playStudioSample = useCallback(
    (
      sample: AudioSampleItem,
      productTitle: string,
      productSlug: string,
      mode: "tr" | "en" = "tr"
    ) => {
      if (
        activeAudio &&
        activeAudio.sample.id === sample.id &&
        activeAudio.mode === mode &&
        activeAudio.isPlaying
      ) {
        stopStudioSample();
        return;
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      triggerStudioSoundCue(sample.freqProfile, mode);

      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utter = new SpeechSynthesisUtterance(
            mode === "tr" ? sample.turkishQuote : sample.originalQuote
          );
          utter.lang = mode === "tr" ? "tr-TR" : "en-US";
          utter.rate = sample.freqProfile === "low" ? 0.88 : 0.95;
          utter.pitch =
            sample.freqProfile === "low"
              ? 0.78
              : sample.freqProfile === "dramatic"
              ? 0.86
              : 1.0;
          utter.volume = 0.9;
          window.speechSynthesis.speak(utter);
        } catch {
          // Speech synthesis optional fallback
        }
      }

      setActiveAudio({
        sample,
        productTitle,
        productSlug,
        mode,
        progress: 0,
        isPlaying: true,
      });

      let currentProgress = 0;
      intervalRef.current = setInterval(() => {
        currentProgress += 2;
        if (currentProgress >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setActiveAudio((prev) =>
            prev ? { ...prev, progress: 100, isPlaying: false } : null
          );
        } else {
          setActiveAudio((prev) =>
            prev ? { ...prev, progress: currentProgress } : null
          );
        }
      }, 140);
    },
    [activeAudio, stopStudioSample, triggerStudioSoundCue]
  );

  const toggleAudioMode = useCallback(
    (mode: "tr" | "en") => {
      if (!activeAudio) return;
      playStudioSample(
        activeAudio.sample,
        activeAudio.productTitle,
        activeAudio.productSlug,
        mode
      );
    },
    [activeAudio, playStudioSample]
  );

  return (
    <StoreContext.Provider
      value={{
        cart,
        isCartOpen,
        isCheckoutOpen,
        isLicenseModalOpen,
        isAuthModalOpen,
        isAdminModalOpen,
        activeDownloadProduct,
        currentUser,
        setCurrentUser,
        logoutUser,
        isAdmin: Boolean(adminKey),
        adminKey,
        loginAdmin,
        logoutAdmin,
        adminFetch,
        couponCode,
        setCouponCode,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        openCheckout,
        closeCheckout: () => setIsCheckoutOpen(false),
        openLicenseModal: () => setIsLicenseModalOpen(true),
        closeLicenseModal: () => setIsLicenseModalOpen(false),
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openAdminModal: () => setIsAdminModalOpen(true),
        closeAdminModal: () => setIsAdminModalOpen(false),
        subtotal: 0,
        bundleDiscount: 0,
        couponDiscount: 0,
        totalDiscount: 0,
        total: 0,
        itemCount: cart.length,
        lastOrder,
        setLastOrder,
        activeAudio,
        playStudioSample,
        stopStudioSample,
        toggleAudioMode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used inside a StoreProvider");
  }
  return ctx;
}
