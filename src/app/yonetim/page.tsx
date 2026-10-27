import React from "react";
import { AdminGate } from "@/components/AdminGate";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yönetim Girişi | tr_dublaj",
  robots: { index: false, follow: false },
};

export default function AdminGatePage() {
  return <AdminGate />;
}
