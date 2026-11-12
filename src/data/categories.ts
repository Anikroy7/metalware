import type { Category, Genre } from "@/lib/types";
import { COLORS as C } from "./colors";

export const categories: Category[] = [
  {
    slug: "t-shirts",
    name: "T-Shirts",
    tagline: "Heavyweight band tees",
    garment: "tshirt",
    graphic: "vinyl",
    color: C.black,
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    tagline: "Fleece for cold-night gigs",
    garment: "hoodie",
    graphic: "bolt",
    color: C.blood,
  },
  {
    slug: "long-sleeves",
    name: "Long Sleeves",
    tagline: "Layer up, turn it up",
    garment: "longsleeve",
    graphic: "eye",
    color: C.charcoal,
  },
  {
    slug: "caps",
    name: "Caps",
    tagline: "Embroidered headwear",
    garment: "cap",
    graphic: "wave",
    color: C.olive,
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Totes, posters & more",
    garment: "tote",
    graphic: "vinyl",
    color: C.bone,
  },
];

export const genres: Genre[] = [
  "Heavy Metal",
  "Thrash",
  "Classic Rock",
  "Punk",
  "Grunge",
  "Psychedelic",
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
