"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { makeT, type Locale } from "@/lib/i18n-dict";

export default function RegistryFilters({
  klass,
  q,
  node,
  locale = "en",
}: {
  klass: string;
  q: string;
  node: string;
  locale?: Locale;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(q);
  const t = makeT(locale);

  function apply(nextClass: string, nextQ: string) {
    const p = new URLSearchParams();
    if (node) p.set("node", node);
    if (nextClass) p.set("class", nextClass);
    if (nextQ) p.set("q", nextQ);
    const s = p.toString();
    router.push(s ? `/registry?${s}` : "/registry");
  }

  return (
    <span className="flex gap-2 items-center font-normal">
      <select
        className="input"
        value={klass}
        onChange={(e) => apply(e.target.value, search)}
      >
        <option value="">{t("reg.allClasses")}</option>
        <option value="EQP">EQP</option>
        <option value="STR">STR</option>
        <option value="ELE">ELE</option>
        <option value="MAT">MAT</option>
      </select>
      <input
        className="input"
        placeholder={t("reg.search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply(klass, search)}
      />
    </span>
  );
}
