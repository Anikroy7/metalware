import type { ProductColor } from "@/lib/types";

// Shared fabric colors used across the demo catalog.
export const COLORS = {
  black: { name: "Jet Black", hex: "#16161a", ink: "#f2efe8", accent: "#e8452c" },
  charcoal: { name: "Charcoal", hex: "#3a3a40", ink: "#f2efe8", accent: "#f2b134" },
  bone: { name: "Bone White", hex: "#ede8dc", ink: "#16161a", accent: "#e8452c" },
  blood: { name: "Blood Red", hex: "#7d1a1a", ink: "#f2efe8", accent: "#f2b134" },
  olive: { name: "Army Olive", hex: "#4a4f35", ink: "#ede8dc", accent: "#f2b134" },
  navy: { name: "Midnight Navy", hex: "#1c2338", ink: "#ede8dc", accent: "#5ec2d6" },
  sand: { name: "Desert Sand", hex: "#cdbb98", ink: "#2a2420", accent: "#7d1a1a" },
  purple: { name: "Deep Violet", hex: "#3b2350", ink: "#f2efe8", accent: "#f08ac0" },
} satisfies Record<string, ProductColor>;
