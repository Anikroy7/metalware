"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductBySlug, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { CategorySlug } from "@/lib/types";
import { useTheme } from "@/store/theme-store";
import { ProductArt } from "./product-art";

type Tab = {
  label: string;
  category: CategorySlug;
  title: [string, string];
  text: string;
  featured: string;
  features: string[];
};

const TABS: Tab[] = [
  {
    label: "T-Shirts",
    category: "t-shirts",
    title: ["Heavy cotton", "band tees"],
    text: "Thick 180 GSM cotton, crack-free prints and a regular fit that keeps its shape wash after wash.",
    featured: "midnight-amplifier-vinyl-tee",
    features: ["180 GSM cotton", "Pre-shrunk", "Sizes S–XXL"],
  },
  {
    label: "Hoodies",
    category: "hoodies",
    title: ["Winter", "fleece hoodies"],
    text: "Brushed-fleece warmth with oversized artwork. Built for cold-night gigs and everyday layering.",
    featured: "velvet-thunder-bolt-hoodie",
    features: ["320 GSM fleece", "Brushed lining", "Kangaroo pocket"],
  },
  {
    label: "Long Sleeves",
    category: "long-sleeves",
    title: ["Layer-up", "long sleeves"],
    text: "Relaxed long sleeves with sleeve prints — the easy middle layer between a tee and a hoodie.",
    featured: "obsidian-choir-all-seeing-longsleeve",
    features: ["200 GSM cotton", "Sleeve print", "Relaxed fit"],
  },
  {
    label: "Caps & More",
    category: "caps",
    title: ["Everyday", "caps & totes"],
    text: "Embroidered six-panel caps and heavy canvas totes to finish the look, from just a few hundred taka.",
    featured: "neon-requiem-wave-cap",
    features: ["Embroidered", "Adjustable fit", "One size"],
  },
];

const DURATION = 7;
const ease = [0.22, 1, 0.36, 1] as const;

/** Clean retail hero for the Studio design: category tabs, bold product line and price. */
export function StudioHero() {
  const active = useTheme() === "studio";
  const [index, setIndex] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const tab = TABS[index];
  const product = getProductBySlug(tab.featured)!;
  const color = product.colors[colorIdx] ?? product.colors[0];
  const inCategory = products.filter((p) => p.category === tab.category);
  const fromPrice = Math.min(...inCategory.map((p) => p.price));
  const onSale = inCategory.some((p) => p.compareAtPrice);

  const select = (i: number) => {
    setIndex(i);
    setColorIdx(0);
  };

  useEffect(() => {
    if (!active || !autoplay) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % TABS.length);
      setColorIdx(0);
    }, DURATION * 1000);
    return () => clearTimeout(t);
  }, [index, active, autoplay]);

  return (
    <section className="bg-paper">
      {/* Category tabs */}
      <div className="border-b border-line">
        <div
          role="tablist"
          aria-label="Featured categories"
          className="no-scrollbar mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 sm:justify-center sm:gap-12 sm:px-6"
        >
          {TABS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => {
                setAutoplay(false);
                select(i);
              }}
              className={`relative shrink-0 py-4 text-sm font-bold uppercase tracking-[0.12em] transition-colors ${
                i === index ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-line/0">
                {i === index && (
                  <motion.span
                    key={`${index}-${autoplay}`}
                    className="block h-full bg-ink"
                    initial={{ width: autoplay ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: autoplay ? DURATION : 0, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div className="bg-stage">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              role="tabpanel"
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07 } },
                exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
              }}
              className="order-2 lg:order-1"
            >
              {[
                <p key="eyebrow" className="text-xs font-bold uppercase tracking-[0.25em] text-amp">
                  Metalware Essentials
                </p>,
                <h1
                  key="title"
                  className="mt-4 text-[clamp(2.6rem,6vw,4.75rem)] font-black uppercase leading-[0.92] tracking-[-0.03em]"
                >
                  {tab.title[0]}
                  <br />
                  {tab.title[1]}
                </h1>,
                <p key="text" className="mt-5 max-w-md text-base leading-relaxed text-muted">
                  {tab.text}
                </p>,
                <div key="price" className="mt-7 flex flex-wrap items-end gap-x-4 gap-y-2">
                  <div>
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-muted">From</p>
                    <p className="text-5xl font-black leading-none tracking-tight tabular-nums sm:text-6xl">
                      {formatPrice(fromPrice)}
                    </p>
                  </div>
                  {onSale && (
                    <span className="mb-1 bg-amp px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      Limited-time offers
                    </span>
                  )}
                </div>,
                <ul key="features" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium">
                  {tab.features.map((f) => (
                    <li key={f} className="flex items-center gap-1.5">
                      <Check className="size-4 text-amp" strokeWidth={3} />
                      {f}
                    </li>
                  ))}
                </ul>,
                <div key="cta" className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                  <Link
                    href={`/shop?category=${tab.category}`}
                    className="bg-ink px-8 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-amp"
                  >
                    Shop {tab.label}
                  </Link>
                  <Link
                    href={`/shop?category=${tab.category}`}
                    className="group inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4"
                  >
                    View all {inCategory.length} items
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>,
              ].map((node) => (
                <motion.div
                  key={node.key}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
                  }}
                >
                  {node}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Featured product */}
          <div className="order-1 w-full lg:order-2 lg:max-w-[480px] lg:justify-self-end">
            <div className="relative aspect-square overflow-hidden bg-paper">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${index}-${color.name}`}
                  className="absolute inset-0 p-8 sm:p-12"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4, ease }}
                >
                  <ProductArt garment={product.garment} graphic={product.graphic} color={color} band={product.band} />
                </motion.div>
              </AnimatePresence>
              {product.tags[0] && (
                <span className="absolute left-4 top-4 bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                  {product.tags[0] === "new" ? "New" : product.tags[0] === "limited" ? "Limited" : "Bestseller"}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line bg-paper px-5 py-4">
              <Link href={`/product/${product.slug}`} className="group min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.15em] text-muted">{product.band}</p>
                <p className="truncate font-bold group-hover:underline">
                  {product.name} · {formatPrice(product.price)}
                </p>
              </Link>
              <div className="flex items-center gap-2" role="radiogroup" aria-label="Color">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={i === colorIdx}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => {
                      setAutoplay(false);
                      setColorIdx(i);
                    }}
                    className={`grid size-8 place-items-center border transition ${
                      i === colorIdx ? "border-ink" : "border-transparent hover:border-line"
                    }`}
                  >
                    <span className="size-6 border border-black/10" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
