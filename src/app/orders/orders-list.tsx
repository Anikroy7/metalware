"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { OrderSummary } from "@/components/order-summary";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { useHydrated, useShop } from "@/store/shop-store";

export function OrdersList() {
  const hydrated = useHydrated();
  const { orders } = useShop();

  if (!hydrated) return <div className="h-64 animate-pulse rounded-3xl bg-stage" />;

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-line py-20 text-center">
        <Package className="mx-auto size-10 text-muted" />
        <p className="mt-4 font-display text-3xl uppercase">No orders yet</p>
        <p className="mt-2 text-sm text-muted">When you place an order, it will show up here.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition hover:bg-amp"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <RevealGroup className="space-y-5">
      {orders.map((o) => (
        <RevealItem key={o.id}>
          <OrderSummary order={o} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
