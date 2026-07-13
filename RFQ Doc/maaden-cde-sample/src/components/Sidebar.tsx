"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { SessionUser } from "@/lib/auth";
import { makeT, type Locale } from "@/lib/i18n-dict";

const NAV = [
  { href: "/", icon: "◧", key: "nav.dash" },
  { href: "/templates", icon: "▤", key: "nav.templates" },
  { href: "/registry", icon: "⌗", key: "nav.registry" },
  { href: "/compliance", icon: "✓", key: "nav.compliance" },
  { href: "/publish", icon: "⇄", key: "nav.publish" },
  { href: "/governance", icon: "⚙", key: "nav.governance" },
  { href: "/ai", icon: "✦", key: "nav.ai" },
];

const USERS = [
  { username: "a.balilo", label: "A. Balilo — Governance Lead" },
  { username: "m.saad", label: "M. Saad — Engineer" },
  { username: "doccon", label: "Doc Controller" },
  { username: "viewer", label: "Viewer" },
];

export default function Sidebar({
  user,
  locale,
}: {
  user: SessionUser;
  locale: Locale;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const t = makeT(locale);

  async function switchUser(username: string) {
    if (username === user.username) return;
    setBusy(true);
    await fetch("/api/v1/auth/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setBusy(false);
    router.refresh();
  }

  async function toggleLocale() {
    setBusy(true);
    await fetch("/api/v1/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: locale === "ar" ? "en" : "ar" }),
    });
    setBusy(false);
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const borderSide = locale === "ar" ? "border-r-[3px]" : "border-l-[3px]";
  const borderClear = locale === "ar" ? "border-r-transparent" : "border-l-transparent";

  return (
    <aside className="w-[230px] bg-charcoal text-[#d8d8dc] flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="px-4 py-[18px] border-b border-[#3a3c44]">
        <b className="text-white text-[15px] tracking-[.5px]">{t("app.brand")}</b>
        <span className="block text-[11px] text-gold mt-[2px]">
          {t("app.tagline")}
        </span>
      </div>
      <nav className="flex-1 py-[10px]">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-[10px] px-4 py-[11px] text-[13px] ${borderSide} ${
              isActive(n.href)
                ? `bg-charcoal-2 text-white ${locale === "ar" ? "border-r-gold" : "border-l-gold"}`
                : `text-[#c4c5cc] ${borderClear} hover:bg-charcoal-2`
            }`}
          >
            <span className="w-[18px] text-center text-gold">{n.icon}</span>
            {t(n.key)}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-[#3a3c44] text-[11px] text-[#9a9ba3]">
        <b className="text-white block text-[12px]">{user.display_name}</b>
        {t(`role.${user.role}`)} · ARGP
        <select
          className="mt-2 w-full bg-charcoal-2 text-[#d8d8dc] text-[11px] rounded px-2 py-1 border border-[#3a3c44]"
          value={user.username}
          disabled={busy}
          onChange={(e) => switchUser(e.target.value)}
        >
          {USERS.map((u) => (
            <option key={u.username} value={u.username}>
              {u.label}
            </option>
          ))}
        </select>
        <button
          className="mt-2 w-full bg-charcoal-2 text-gold text-[11px] rounded px-2 py-1 border border-[#3a3c44] hover:text-white"
          disabled={busy}
          onClick={toggleLocale}
        >
          🌐 {t("lang.toggle")}
        </button>
      </div>
    </aside>
  );
}
