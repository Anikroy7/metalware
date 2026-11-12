"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Banknote, ShoppingBag, Trash2, X } from "lucide-react";
import { useEffect } from "react";
import { getProductById } from "@/data/products";
import { delivery } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { cartCount, lineTotal, shop, useShop } from "@/store/shop-store";
import { ProductArt } from "./product-art";
import { useUI } from "./providers";
import { QuantityStepper } from "./quantity-stepper";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { cart } = useShop();
  const subtotal = lineTotal(cart);
  const toFree = delivery.freeOver - subtotal;

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, closeCart]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-display text-2xl uppercase tracking-wide">
                Your Bag <span className="text-muted">({cartCount(cart)})</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                className="grid size-9 place-items-center rounded-full transition hover:bg-stage"
                aria-label="Close bag"
              >
                <X className="size-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="grid size-20 place-items-center rounded-full bg-stage">
                  <ShoppingBag className="size-8 text-muted" />
                </div>
                <p className="font-display text-2xl uppercase">The stage is empty</p>
                <p className="text-sm text-muted">Add some merch to your bag and it will show up here.</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-amp"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-line px-5 py-3 text-sm">
                  {toFree > 0 ? (
                    <p>
                      Add <strong>{formatPrice(toFree)}</strong> more for free delivery
                    </p>
                  ) : (
                    <p className="font-medium text-ok">You&apos;ve unlocked free delivery!</p>
                  )}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stage">
                    <motion.div
                      className="h-full rounded-full bg-amp"
                      initial={false}
                      animate={{ width: `${Math.min(100, (subtotal / delivery.freeOver) * 100)}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    />
                  </div>
                </div>

                <ul className="flex-1 overflow-y-auto px-5">
                  <AnimatePresence initial={false}>
                    {cart.map((item) => {
                      const product = getProductById(item.productId);
                      if (!product) return null;
                      const color = product.colors.find((c) => c.name === item.color) ?? product.colors[0];
                      return (
                        <motion.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0, paddingTop: 0, paddingBottom: 0 }}
                          className="flex gap-4 overflow-hidden border-b border-line py-4"
                        >
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={closeCart}
                            className="size-24 shrink-0 rounded-xl bg-stage p-1"
                          >
                            <ProductArt garment={product.garment} graphic={product.graphic} color={color} />
                          </Link>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <p className="text-xs uppercase tracking-wider text-muted">{product.band}</p>
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={closeCart}
                              className="truncate font-semibold hover:text-amp"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-muted">
                              {item.color} · {item.size}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-2">
                              <QuantityStepper size="sm" value={item.qty} onChange={(q) => shop.setQty(item.key, q)} />
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{formatPrice(product.price * item.qty)}</span>
                                <button
                                  type="button"
                                  onClick={() => shop.removeFromCart(item.key)}
                                  className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-stage hover:text-amp"
                                  aria-label={`Remove ${product.name}`}
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="space-y-3 border-t border-line bg-white px-5 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Subtotal</span>
                    <span className="text-lg font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <Banknote className="size-4 text-ok" />
                    Cash on Delivery · Delivery charge calculated at checkout
                  </p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block rounded-full bg-amp py-3.5 text-center font-semibold text-white transition hover:bg-amp-dark"
                  >
                    Checkout
                  </Link>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="block w-full text-center text-sm font-medium text-muted underline-offset-4 hover:underline"
                  >
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
