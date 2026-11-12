"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useState } from "react";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { FavoriteButton } from "./favorite-button";
import { ProductArt } from "./product-art";

const TAG_LABEL = { new: "New", bestseller: "Bestseller", limited: "Limited" } as const;

export function ProductCard({ product, track }: { product: Product; track?: number }) {
  const [colorIdx, setColorIdx] = useState(0);
  const color = product.colors[colorIdx];
  const tag = product.tags[0];
  const off = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <motion.article
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="group relative flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden rounded-2xl bg-stage">
        <motion.div
          variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.05, rotate: -1.5 } }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="aspect-square p-4"
        >
          <ProductArt garment={product.garment} graphic={product.graphic} color={color} band={product.band} />
        </motion.div>

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {tag && (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                tag === "new" ? "bg-ink text-white" : tag === "limited" ? "bg-gold text-ink" : "bg-amp text-white"
              }`}
            >
              {TAG_LABEL[tag]}
            </span>
          )}
          {off > 0 && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amp">
              -{off}%
            </span>
          )}
        </div>

        {track !== undefined && (
          <span className="absolute bottom-3 left-4 font-display text-5xl leading-none text-ink/10">
            {String(track).padStart(2, "0")}
          </span>
        )}

        <motion.span
          variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          className="absolute inset-x-3 bottom-3 hidden rounded-full bg-ink/90 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white backdrop-blur sm:block"
        >
          View & Order
        </motion.span>
      </Link>

      <FavoriteButton
        productId={product.id}
        name={product.name}
        className="absolute right-3 top-3 size-9 rounded-full bg-white/90 text-ink shadow-sm backdrop-blur hover:bg-white"
      />

      <div className="flex flex-1 flex-col pt-3">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-[11px] font-medium uppercase tracking-[0.14em] text-muted">{product.band}</p>
          <p className="flex shrink-0 items-center gap-1 text-xs text-muted">
            <Star className="size-3 fill-gold text-gold" />
            {product.rating}
          </p>
        </div>
        <Link href={`/product/${product.slug}`} className="mt-0.5 font-semibold leading-snug hover:text-amp">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="flex items-baseline gap-2">
            <span className="font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </p>
          <div className="flex gap-1">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColorIdx(i)}
                onMouseEnter={() => setColorIdx(i)}
                aria-label={c.name}
                title={c.name}
                className={`size-4 rounded-full border transition ${
                  i === colorIdx ? "border-ink ring-2 ring-ink/20" : "border-black/15"
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
