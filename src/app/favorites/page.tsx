import type { Metadata } from "next";
import { FavoritesGrid } from "./favorites-grid";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="mb-8">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amp">
          <span className="h-px w-6 bg-amp" />
          On repeat
        </p>
        <h1 className="font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl">Favorites</h1>
      </div>
      <FavoritesGrid />
    </div>
  );
}
