"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { shop, useShop } from "@/store/shop-store";
import { useUI } from "./providers";

export function FavoriteButton({
  productId,
  name,
  className = "",
  withLabel = false,
}: {
  productId: string;
  name: string;
  className?: string;
  withLabel?: boolean;
}) {
  const { favorites } = useShop();
  const { notify } = useUI();
  const active = favorites.includes(productId);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = shop.toggleFavorite(productId);
    notify(added ? `${name} added to favorites` : `${name} removed from favorites`);
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      className={`inline-flex items-center justify-center gap-2 transition ${className}`}
    >
      <motion.span
        key={String(active)}
        initial={{ scale: active ? 0.4 : 1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 600, damping: 14 }}
        className="inline-flex"
      >
        <Heart className={`size-[18px] ${active ? "fill-amp text-amp" : ""}`} />
      </motion.span>
      {withLabel && <span>{active ? "Saved" : "Save"}</span>}
    </motion.button>
  );
}
