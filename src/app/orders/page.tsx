import type { Metadata } from "next";
import { OrdersList } from "./orders-list";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-10 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amp">
          <span className="h-px w-6 bg-amp" />
          Your playlist
        </p>
        <h1 className="font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">My Orders</h1>
        <p className="mt-3 text-sm text-muted">Orders placed from this device.</p>
      </div>
      <OrdersList />
    </div>
  );
}
