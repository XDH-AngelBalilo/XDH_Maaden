"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { SessionUser } from "@/lib/auth";

const NAV = [
  { href: "/", icon: "◧", label: "Dashboard" },
  { href: "/templates", icon: "▤", label: "Data Template Library" },
  { href: "/registry", icon: "⌗", label: "Asset Registry" },
  { href: "/compliance", icon: "✓", label: "Compliance Centre" },
  { href: "/publish", icon: "⇄", label: "Publish Hub" },
  { href: "/governance", icon: "⚙", label: "Governance & Admin" },
];

const ROLE_LABELS: Record<string, string> = {
  governance_lead: "Data Governance Lead",
  engineer: "Discipline Engineer",
  doc_controller: "Document Controller",
  viewer: "Viewer / Downstream",
};

const USERS = [
  { username: "a.balilo", label: "A. Balilo — Governance Lead" },
  { username: "m.saad", label: "M. Saad — Engineer" },
  { username: "doccon", label: "Doc Controller" },
  { username: "viewer", label: "Viewer" },
];

export default function Sidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);

  async function switchUser(username: string) {
    if (username === user.username) return;
    setSwitching(true);
    await fetch("/api/v1/auth/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    setSwitching(false);
    router.refresh();
  }

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-[230px] bg-charcoal text-[#d8d8dc] flex flex-col flex-shrink-0 sticky top-0 h-screen">
      <div className="px-4 py-[18px] border-b border-[#3a3c44]">
        <b className="text-white text-[15px] tracking-[.5px]">ARGP CDE</b>
        <span className="block text-[11px] text-gold mt-[2px]">
          Module M1 — Asset Data Backbone · XD House
        </span>
      </div>
      <nav className="flex-1 py-[10px]">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-[10px] px-4 py-[11px] text-[13px] border-l-[3px] ${
              isActive(n.href)
                ? "bg-charcoal-2 text-white border-gold"
                : "text-[#c4c5cc] border-transparent hover:bg-charcoal-2"
            }`}
          >
            <span className="w-[18px] text-center text-gold">{n.icon}</span>
            {n.label}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-[#3a3c44] text-[11px] text-[#9a9ba3]">
        <b className="text-white block text-[12px]">{user.display_name}</b>
        {ROLE_LABELS[user.role]} · ARGP
        <select
          className="mt-2 w-full bg-charcoal-2 text-[#d8d8dc] text-[11px] rounded px-2 py-1 border border-[#3a3c44]"
          value={user.username}
          disabled={switching}
          onChange={(e) => switchUser(e.target.value)}
        >
          {USERS.map((u) => (
            <option key={u.username} value={u.username}>
              {u.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
