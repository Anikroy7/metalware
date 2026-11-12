import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccess } from "./order-success";

export const metadata: Metadata = {
  title: "Order Placed",
};

export default function OrderSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-stage" />}>
        <OrderSuccess />
      </Suspense>
    </div>
  );
}
