"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Check, PhoneCall } from "lucide-react";
import { OrderSummary } from "@/components/order-summary";
import { formatPrice } from "@/lib/format";
import { useHydrated, useShop } from "@/store/shop-store";

const ease = [0.22, 1, 0.36, 1] as const;

export function OrderSuccess() {
  const id = useSearchParams().get("id");
  const hydrated = useHydrated();
  const { orders } = useShop();
  const order = orders.find((o) => o.id === id);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-3xl bg-stage" />;

  if (!order) {
    return (
      <div className="rounded-3xl border border-dashed border-line py-20 text-center">
        <p className="font-display text-3xl uppercase">Order not found</p>
        <p className="mt-2 text-sm text-muted">We couldn&apos;t find that order on this device.</p>
        <Link href="/orders" className="mt-6 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center">
        <div className="relative mx-auto size-28">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute inset-0 rounded-full border-2 border-amp"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 2, delay: 0.4 + i * 0.5, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
          <motion.div
            className="relative grid size-28 place-items-center rounded-full bg-amp text-white shadow-xl shadow-amp/30"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
          >
            <Check className="size-12" strokeWidth={3} />
          </motion.div>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-amp"
        >
          That&apos;s a wrap
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease }}
          className="mt-2 font-display text-5xl uppercase tracking-wide sm:text-6xl"
        >
          Order Placed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="mx-auto mt-4 max-w-md text-muted"
        >
          Thanks, {order.customer.fullName.split(" ")[0]}! Keep <strong className="text-ink">{formatPrice(order.total)}</strong>{" "}
          in cash ready for the delivery rider.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.65, ease }}
        className="mt-10 space-y-4"
      >
        <div className="flex items-start gap-4 rounded-2xl bg-ink p-5 text-white">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-amp">
            <PhoneCall className="size-5" />
          </span>
          <div className="text-sm">
            <p className="font-semibold">What happens next?</p>
            <p className="mt-1 text-white/65">
              Our team will call <strong className="text-white">{order.customer.phone}</strong> shortly to confirm your
              order. After confirmation it ships right away. You pay cash on delivery.
            </p>
          </div>
        </div>
        <OrderSummary order={order} />
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-amp px-8 py-3.5 text-center font-semibold text-white transition hover:bg-amp-dark"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="rounded-full border-2 border-ink px-8 py-3 text-center font-semibold transition hover:bg-ink hover:text-white"
          >
            View My Orders
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
