import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Cash on Delivery order.",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amp">
          <span className="h-px w-6 bg-amp" />
          Almost there
        </p>
        <h1 className="font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">Checkout</h1>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-stage" />}>
        <CheckoutForm />
      </Suspense>
    </div>
  );
}
