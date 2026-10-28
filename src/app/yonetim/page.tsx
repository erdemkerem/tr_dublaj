import YonetimClient from "./YonetimClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Yönetim Girişi | tr_dublaj",
  robots: { index: false, follow: false },
};

export default function YonetimPage() {
  return <YonetimClient />;
}