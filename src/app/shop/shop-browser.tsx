"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { categories, genres } from "@/data/categories";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

const SORTS = {
  featured: "Featured",
  new: "Newest",
  popular: "Most popular",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
} as const;

type SortKey = keyof typeof SORTS;

export function ShopBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const category = params.get("category") ?? "";
  const genre = params.get("genre") ?? "";
  const sort = (params.get("sort") ?? "featured") as SortKey;
  const urlQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);
  // Keep the input in sync when the header search changes ?q= while this page is open.
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setQuery(urlQuery);
  }

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!genre || p.genre === genre) &&
        (!q || `${p.name} ${p.band} ${p.genre} ${p.category}`.toLowerCase().includes(q)),
    );
    switch (sort) {
      case "new":
        return [...list].sort((a, b) => Number(b.tags.includes("new")) - Number(a.tags.includes("new")));
      case "popular":
        return [...list].sort((a, b) => b.reviews - a.reviews);
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      default:
        return list;
    }
  }, [category, genre, sort, query]);

  const hasFilters = Boolean(category || genre || query);
  const pill = (active: boolean) =>
    `relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
      active ? "text-white" : "text-ink hover:bg-stage"
    }`;

  return (
    <div>
      {/* Category pills */}
      <div className="no-scrollbar -mx-4 mb-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {[{ slug: "", name: "All" }, ...categories].map((c) => {
          const active = category === c.slug;
          return (
            <button key={c.slug || "all"} type="button" onClick={() => update("category", c.slug)} className={pill(active)}>
              {active && (
                <motion.span
                  layoutId="category-pill"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <span className="relative">{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="mb-8 flex flex-col gap-3 border-y border-line py-4 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 focus-within:border-ink">
          <Search className="size-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => update("q", query.trim())}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
            placeholder="Search by band or product"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                update("q", "");
              }}
            >
              <X className="size-4 text-muted" />
            </button>
          )}
        </label>
        <div className="flex gap-3">
          <SelectBox label="Genre" value={genre} onChange={(v) => update("genre", v)}>
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </SelectBox>
          <SelectBox label="Sort" value={sort} onChange={(v) => update("sort", v === "featured" ? "" : v)}>
            {Object.entries(SORTS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </SelectBox>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between text-sm text-muted">
        <p>
          <strong className="text-ink">{results.length}</strong> {results.length === 1 ? "item" : "items"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              router.replace(pathname, { scroll: false });
            }}
            className="font-medium text-ink underline underline-offset-4 hover:text-amp"
          >
            Clear filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line py-20 text-center">
          <p className="font-display text-3xl uppercase">No tracks found</p>
          <p className="mt-2 text-sm text-muted">Try another search or clear your filters.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {results.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative flex-1 sm:flex-none">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full border border-line bg-paper py-2.5 pl-4 pr-10 text-sm font-medium focus:border-ink focus:outline-none sm:w-48"
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
    </label>
  );
}
