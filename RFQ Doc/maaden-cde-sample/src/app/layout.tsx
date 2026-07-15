import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/auth";
import { tServer } from "@/lib/i18n";

// Arabic UI face. Exposed as a CSS variable and only applied when the locale is
// 'ar' (see globals.css) — the English UI keeps the Segoe UI stack that matches
// the target layout.
const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-ar",
});

export const metadata: Metadata = {
  title: "Maaden ARGP — CDE Asset Data Backbone",
  description:
    "Module M1 — Master Data Registry + Data Template governance (localhost sample, XD House)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = getSession();
  const { locale, dir } = tServer();
  return (
    <html lang={locale} dir={dir} className={locale === "ar" ? tajawal.variable : ""}>
      <body className="flex min-h-screen">
        <Sidebar user={user} locale={locale} />
        <main className="flex-1 min-w-0">{children}</main>
      </body>
    </html>
  );
}
