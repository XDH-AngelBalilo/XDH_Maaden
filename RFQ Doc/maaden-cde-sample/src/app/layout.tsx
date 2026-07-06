import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Maaden ARGP — CDE Asset Data Backbone",
  description:
    "Module M1 — Master Data Registry + Data Template governance (localhost sample, XD House)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = getSession();
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <Sidebar user={user} />
        <main className="flex-1 min-w-0">{children}</main>
      </body>
    </html>
  );
}
