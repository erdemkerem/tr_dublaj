"use client";

import React, { useRef, useEffect } from "react";

export interface CoverImageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CoverImageInput({ value, onChange }: CoverImageInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.value !== value) {
      ref.current.value = value;
    }
  }, [value]);

  return (
    <input
      ref={ref}
      className="w-full h-11 px-4 rounded-xl bg-[#0B0C10] border border-white/15 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#F59E0B]"
      placeholder="https://github.com/erdemkerem/tr_dublaj/releases/download/patches-v1/resonance.jpg"
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
