"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { getProductById } from "@/data/products";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { useHydrated, useShop } from "@/store/shop-store";

export function FavoritesGrid() {
  const hydrated = useHydrated();
  const { favorites } = useShop();
  const items = favorites.map(getProductById).filter((p): p is Product => Boolean(p));

  if (!hydrated) return <div className="h-64 animate-pulse rounded-3xl bg-stage" />;

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line py-20 text-center">
        <Heart className="mx-auto size-10 text-muted" />
        <p className="mt-4 font-display text-3xl uppercase">No favorites yet</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Tap the heart on any product to save it here for later.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-amp"
        >
          Explore the Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-6 text-sm text-muted">
        <strong className="text-ink">{items.length}</strong> saved {items.length === 1 ? "item" : "items"}
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {items.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
