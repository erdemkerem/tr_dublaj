"use client";

import CoverImageInput from "./CoverImageInput";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Settings,
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  LogOut,
  EyeOff,
} from "lucide-react";

export type Product = {
  id: number;
  slug: string;
  title: string;
  game_title: string;
  subtitle: string;
  description: string;
  status: string;
  cover_image: string;
  gallery_images: any[];
  host_mirrors: any[];
  price: number;
  version: string;
  file_size: string;
};

export type Mirror = {
  provider: string;
  url: string;
  label: string;
};

export default function YonetimClient() {
  const [unlocked, setUnlocked] = useState(false);
  const [key, setKey] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    slug: "",
    title: "",
    game_title: "",
    subtitle: "",
    description: "",
    status: "ready",
    cover_image: "",
    gallery_images: [] as any[],
    host_mirrors: [] as Mirror[],
    price: 0,
    version: "",
    file_size: "",
  });

  const handleKey = async () => {
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    });
    if (res.ok) {
      setUnlocked(true);
    } else {
      alert("Yönetici anahtarı hatalı!");
    }
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : data.products || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (unlocked) loadProducts();
  }, [unlocked, loadProducts]);

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0C10]">
        <div className="w-full max-w-md px-6 py-12 rounded-2xl bg-[#13151C] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9)]">
          <div className="px-6 py-5 bg-[#0B0C10] border-b border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-lg font-extrabold text-[#F8FAFC]">Gizli Yönetim Girişi</h1>
              <p className="font-mono text-[11px] text-[#94A3B8]">tr_dublaj • Sadece Site Sahibi</p>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <form onSubmit={(e) => { e.preventDefault(); handleKey(); }} className="space-y-4">
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Bu panel yalnızca site sahibine açıktır. Anahtar: <strong className="text-[#F8FAFC]">Tezcan5734</strong>
              </p>
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Yönetici Anahtarı</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#F59E0B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-[#0B0C10] border border-white/15 font-mono text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>
              </div>
              <button type="submit" className="w-full h-12 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-display font-bold text-sm flex items-center justify-center gap-2 cursor-pointer">
                <ShieldCheck className="w-4 h-4" /> Giriş Yap
              </button>
            </form>
            <div className="flex items-center gap-2 pt-2 border-t border-white/10 font-mono text-[10px] text-[#64748B]">
              <EyeOff className="w-3.5 h-3.5 shrink-0" />
              <span>Bu sayfa arama motorlarına kapalıdır (noindex).</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/products/${editing.slug}` : "/api/products";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditing(null);
      setForm({
        slug: "",
        title: "",
        game_title: "",
        subtitle: "",
        description: "",
        status: "ready",
        cover_image: "",
        gallery_images: [],
        host_mirrors: [] as Mirror[],
        price: 0,
        version: "",
        file_size: "",
      });
      loadProducts();
    } else {
      alert("Ürün kaydedilemedi!");
    }
    setLoading(false);
  };

  const deleteProduct = async (slug: string) => {
    if (!confirm("Bu oyunu silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/products/${slug}`, { method: "DELETE" });
    loadProducts();
  };

  const startEdit = (p: Product) => {
    setEditing(p);
    setForm({
      slug: p.slug || "",
      title: p.title || "",
      game_title: p.game_title || "",
      subtitle: p.subtitle || "",
      description: p.description || "",
      status: p.status || "ready",
      cover_image: p.cover_image || "",
      gallery_images: p.gallery_images || [],
      host_mirrors: p.host_mirrors || [],
      price: p.price ?? 0,
      version: p.version || "",
      file_size: p.file_size || "",
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F8FAFC]">
      <header className="border-b border-white/10 bg-[#13151C]/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#F59E0B]" />
            <span className="font-display font-bold text-lg">Yönetim Paneli</span>
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={loadProducts} className="h-10 px-3 rounded-lg bg-[#1C1F2B] border border-white/10 text-xs font-mono hover:bg-white/10 transition">Yenile</button>
            <button onClick={() => setUnlocked(false)} className="h-10 px-3 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs font-mono hover:bg-[#EF4444]/30 transition">Çıkış</button>
          </div>
        </div>
      </header>
      <main className="max-w-[1440px] mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[#F8FAFC]">Yama Yönetimi</h1>
            <p className="text-xs text-[#94A3B8]">Oyun ekle, düzenle, sil. Resim linkleri GitHub Releases adresi olmalı.</p>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setForm({
                slug: "",
                title: "",
                game_title: "",
                subtitle: "",
                description: "",
                status: "ready",
                cover_image: "",
                gallery_images: [],
                host_mirrors: [] as Mirror[],
                price: 0,
                version: "",
                file_size: "",
              });
            }}
            className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-[#0B0C10] font-display font-bold text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Yeni Ürün Ekle
          </button>
        </div>
        <div className="rounded-2xl bg-[#13151C] border border-white/10 overflow-hidden shadow-xl mb-10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#0B0C10] border-b border-white/10">
                <th className="px-6 py-3 font-mono text-[10px] uppercase text-[#94A3B8]">Resim</th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase text-[#94A3B8]">Başlık</th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase text-[#94A3B8]">Durum</th>
                <th className="px-6 py-3 font-mono text-[10px] uppercase text-[#94A3B8]">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-4">
                    <img src={p.cover_image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="px-6 py-4 font-display font-bold text-[#F8FAFC] truncate max-w-[200px]">{p.game_title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${p.status === "ready" ? "bg-[#10B981]/20 text-[#10B981]" : "bg-[#F59E0B]/20 text-[#F59E0B]"}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => startEdit(p)} className="text-[#10B981] hover:underline text-xs font-mono mr-3">Düzenle</button>
                    <button onClick={() => deleteProduct(p.slug)} className="text-[#EF4444] hover:underline text-xs font-mono">Sil</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-10 text-center text-[#94A3B8] font-mono text-xs">Ürün bulunamadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl bg-[#13151C] border border-white/10 p-8 shadow-xl max-w-2xl">
          <h2 className="font-display text-xl font-bold text-[#F8FAFC] mb-6">{editing ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h2>
          <form onSubmit={saveProduct} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Slug</label>
                <input name="slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Başlık</label>
                <input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Oyun Adı</label>
                <input name="game_title" value={form.game_title} onChange={(e) => setForm({ ...form, game_title: e.target.value })} required className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Durum</label>
                <select name="status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]">
                  <option value="ready">Hazır</option>
                  <option value="in_progress">Yapımda</option>
                  <option value="wishlist">İstek Listesi</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Capa Resim URL (GitHub Releases)</label>
              <input name="cover_image" value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="https://github.com/erdemkerem/tr_dublaj/releases/download/patches-v1/resonance.jpg" className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Açıklama</label>
              <textarea name="description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full p-3.5 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Galeri Resimleri (JSON)</label>
              <textarea name="gallery_images" rows={3} value={JSON.stringify(form.gallery_images, null, 2)} onChange={(e) => { try { setForm({ ...form, gallery_images: JSON.parse(e.target.value) }); } catch {} }} placeholder='[{"url":"https://github.com/.../img1.jpg","caption":"Örnek","tag":"ÖNİZLEME"}]' className="w-full p-3.5 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] font-mono focus:outline-none focus:border-[#F59E0B]" />
            </div>
            <div>
              <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">İndirme Linkleri (JSON)</label>
              <textarea name="host_mirrors" rows={3} value={JSON.stringify(form.host_mirrors, null, 2)} onChange={(e) => { try { setForm({ ...form, host_mirrors: JSON.parse(e.target.value) }); } catch {} }} placeholder='[{"provider":"GitHub Releases","url":"https://github.com/erdemkerem/tr_dublaj/releases/download/patches-v1/resonance.zip","label":"GitHub (2.8 GB)"}]' className="w-full p-3.5 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] font-mono focus:outline-none focus:border-[#F59E0B]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Versiyon</label>
                <input name="version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Dosya Boyutu</label>
                <input name="file_size" value={form.file_size} onChange={(e) => setForm({ ...form, file_size: e.target.value })} className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
              </div>
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#94A3B8] mb-1.5">Fiyat (0 = Ücretsiz)</label>
                <input type="number" name="price" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })} className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]" />
              </div>
            </div>
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({
                  slug: "",
                  title: "",
                  game_title: "",
                  subtitle: "",
                  description: "",
                  status: "ready",
                  cover_image: "",
                  gallery_images: [],
                  host_mirrors: [] as Mirror[],
                  price: 0,
                  version: "",
                  file_size: "",
                }); }} className="h-10 px-3 rounded-lg bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#EF4444] text-xs font-mono hover:bg-[#EF4444]/30 transition">İptal</button>
              )}
              <button type="submit" disabled={loading} className={`h-11 px-4 rounded-xl font-display font-bold text-sm cursor-pointer disabled:opacity-60 transition ${loading ? "bg-[#6B7280]" : "bg-gradient-to-r from-[#F59E0B] to-[#D97706]"} text-[#0B0C10]`}> {loading ? "Kaydediliyor..." : editing ? "Güncelle" : "Oyunu Kaydet"}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
