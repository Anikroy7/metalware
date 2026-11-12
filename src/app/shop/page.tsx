import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopBrowser } from "./shop-browser";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse band tees, hoodies, caps and accessories.",
};

function GridFallback() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i}>
          <div className="aspect-square animate-pulse rounded-2xl bg-stage" />
          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-stage" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-stage" />
        </div>
      ))}
    </div>
  );
}

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amp">
          <span className="h-px w-6 bg-amp" />
          The Full Setlist
        </p>
        <h1 className="font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">Shop</h1>
      </div>
      <Suspense fallback={<GridFallback />}>
        <ShopBrowser />
      </Suspense>
    </div>
  );
}
