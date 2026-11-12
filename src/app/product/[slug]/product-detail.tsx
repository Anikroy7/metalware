"use client";

import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Banknote, ChevronDown, RefreshCcw, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { useState } from "react";
import { delivery } from "@/data/site";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { FavoriteButton } from "@/components/favorite-button";
import { ProductArt } from "@/components/product-art";
import { useUI } from "@/components/providers";
import { QuantityStepper } from "@/components/quantity-stepper";
import { shop } from "@/store/shop-store";

const SIZE_CHART = [
  ["S", "38", "27"],
  ["M", "40", "28"],
  ["L", "42", "29"],
  ["XL", "44", "30"],
  ["XXL", "46", "31"],
];

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left font-semibold"
      >
        {title}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="size-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-muted">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { openCart, notify } = useUI();
  const [colorIdx, setColorIdx] = useState(0);
  const oneSize = product.sizes.length === 1;
  const [size, setSize] = useState(oneSize ? product.sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [sizeScope, animate] = useAnimate<HTMLDivElement>();
  const color = product.colors[colorIdx];
  const isApparel = !["cap", "tote", "poster"].includes(product.garment);

  const requireSize = () => {
    if (size) return true;
    setSizeError(true);
    animate(sizeScope.current, { x: [0, -8, 8, -6, 6, 0] }, { duration: 0.4 });
    return false;
  };

  const addToBag = () => {
    if (!requireSize()) return;
    shop.addToCart(product.id, color.name, size, qty);
    notify(`${product.name} added to your bag`);
    openCart();
  };

  const orderNow = () => {
    if (!requireSize()) return;
    shop.setDirect(product.id, color.name, size, qty);
    router.push("/checkout?mode=direct");
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
      {/* Gallery */}
      <div className="lg:sticky lg:top-32 lg:self-start">
        <div className="relative overflow-hidden rounded-3xl bg-stage">
          <AnimatePresence mode="wait">
            <motion.div
              key={color.name}
              initial={{ opacity: 0, scale: 0.94, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-square p-6 sm:p-12"
            >
              <ProductArt garment={product.garment} graphic={product.graphic} color={color} band={product.band} />
            </motion.div>
          </AnimatePresence>
          <FavoriteButton
            productId={product.id}
            name={product.name}
            className="absolute right-4 top-4 size-11 rounded-full bg-white text-ink shadow-sm hover:bg-paper"
          />
          {product.stock <= 10 && (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-ink">
              Only {product.stock} left
            </span>
          )}
        </div>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColorIdx(i)}
              aria-label={`Show ${c.name}`}
              className={`overflow-hidden rounded-2xl bg-stage p-2 transition ${
                i === colorIdx ? "ring-2 ring-ink" : "opacity-70 hover:opacity-100"
              }`}
            >
              <ProductArt garment={product.garment} graphic={product.graphic} color={c} />
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amp">
          {product.band} · {product.genre}
        </p>
        <h1 className="mt-2 font-display text-4xl uppercase leading-none tracking-wide sm:text-5xl">{product.name}</h1>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="flex">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={`size-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-line"}`}
              />
            ))}
          </span>
          <span className="font-semibold">{product.rating}</span>
          <span className="text-muted">({product.reviews} reviews)</span>
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <>
              <span className="text-lg text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
              <span className="rounded-full bg-amp/10 px-2.5 py-0.5 text-xs font-bold text-amp">
                Save {formatPrice(product.compareAtPrice - product.price)}
              </span>
            </>
          )}
        </div>

        <p className="mt-5 leading-relaxed text-muted">{product.description}</p>

        {/* Color */}
        <div className="mt-8">
          <p className="mb-3 text-sm">
            <span className="font-semibold">Color:</span> <span className="text-muted">{color.name}</span>
          </p>
          <div className="flex gap-2.5">
            {product.colors.map((c, i) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColorIdx(i)}
                aria-label={c.name}
                aria-pressed={i === colorIdx}
                className={`grid size-10 place-items-center rounded-full border-2 transition ${
                  i === colorIdx ? "border-ink" : "border-transparent hover:border-line"
                }`}
              >
                <span className="size-7 rounded-full border border-black/15" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        {!oneSize && (
          <div ref={sizeScope} className="mt-6">
            <div className="mb-3 flex items-center justify-between text-sm">
              <p>
                <span className="font-semibold">Size:</span>{" "}
                <span className={sizeError ? "font-medium text-amp" : "text-muted"}>
                  {size || (sizeError ? "Please select a size" : "Select a size")}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setSize(s);
                    setSizeError(false);
                  }}
                  aria-pressed={size === s}
                  className={`relative h-11 min-w-14 rounded-xl border px-4 text-sm font-semibold transition ${
                    size === s
                      ? "border-ink text-white"
                      : sizeError
                        ? "border-amp/50 hover:border-ink"
                        : "border-line bg-paper hover:border-ink"
                  }`}
                >
                  {size === s && (
                    <motion.span
                      layoutId={`size-${product.id}`}
                      className="absolute inset-0 rounded-[10px] bg-ink"
                      transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    />
                  )}
                  <span className="relative">{s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + actions */}
        <div className="mt-6 flex items-center gap-4">
          <QuantityStepper value={qty} onChange={setQty} />
          <span className="text-sm text-muted">
            {product.stock > 10 ? "In stock" : `Hurry, only ${product.stock} left`}
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={addToBag}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink py-3.5 font-semibold transition hover:bg-ink hover:text-white"
          >
            <ShoppingBag className="size-[18px]" />
            Add to Bag
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={orderNow}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-amp py-3.5 font-semibold text-white shadow-lg shadow-amp/25 transition hover:bg-amp-dark"
          >
            Order Now
          </motion.button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-ok/10 px-4 py-3 text-sm font-medium text-ok">
          <Banknote className="size-4" />
          Cash on Delivery — pay when your order arrives
        </div>

        <ul className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-muted">
          <li className="rounded-2xl border border-line bg-paper p-3">
            <Truck className="mx-auto mb-1.5 size-5 text-ink" />
            Dhaka {delivery.insideDhakaDays}
          </li>
          <li className="rounded-2xl border border-line bg-paper p-3">
            <RefreshCcw className="mx-auto mb-1.5 size-5 text-ink" />
            7-day exchange
          </li>
          <li className="rounded-2xl border border-line bg-paper p-3">
            <ShieldCheck className="mx-auto mb-1.5 size-5 text-ink" />
            Quality checked
          </li>
        </ul>

        <div className="mt-8 border-t border-line">
          <Accordion title="Product Details" defaultOpen>
            <ul className="list-disc space-y-1 pl-5">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </Accordion>
          {isApparel && (
            <Accordion title="Size Guide (inches)">
              <table className="w-full max-w-sm text-left">
                <thead>
                  <tr className="text-ink">
                    <th className="py-1.5 font-semibold">Size</th>
                    <th className="py-1.5 font-semibold">Chest</th>
                    <th className="py-1.5 font-semibold">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_CHART.map(([s, chest, length]) => (
                    <tr key={s} className="border-t border-line">
                      <td className="py-1.5">{s}</td>
                      <td className="py-1.5">{chest}</td>
                      <td className="py-1.5">{length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion>
          )}
          <Accordion title="Delivery & Payment">
            <p>
              Inside Dhaka: {formatPrice(delivery.insideDhaka)} ({delivery.insideDhakaDays}). Outside Dhaka:{" "}
              {formatPrice(delivery.outsideDhaka)} ({delivery.outsideDhakaDays}). Free delivery on orders over{" "}
              {formatPrice(delivery.freeOver)}.
            </p>
            <p className="mt-2">
              We only accept <strong className="text-ink">Cash on Delivery</strong>. Our team will call you to confirm
              the order before dispatch. Wrong size? Exchange within 7 days of delivery.
            </p>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
