export const site = {
  name: "Metalware",
  tagline: "Wear the music.",
  phone: "+880 1700-000000",
  email: "support@metalware.demo",
  hours: "Sat – Thu, 10am – 8pm",
};

export const delivery = {
  insideDhaka: 70,
  outsideDhaka: 130,
  freeOver: 3000,
  insideDhakaDays: "1–2 days",
  outsideDhakaDays: "3–5 days",
};

export function getDeliveryFee(district: string, subtotal: number) {
  if (subtotal >= delivery.freeOver) return 0;
  return district === "Dhaka" ? delivery.insideDhaka : delivery.outsideDhaka;
}

export const announcements = [
  "Cash on Delivery all over Bangladesh",
  `Free delivery on orders over ৳${delivery.freeOver.toLocaleString("en-US")}`,
  "New drop: Velvet Thunder winter hoodies",
  "Easy 7-day size exchange",
];

export const navLinks = [
  { href: "/shop", label: "Shop All" },
  { href: "/shop?category=t-shirts", label: "T-Shirts" },
  { href: "/shop?category=hoodies", label: "Hoodies" },
  { href: "/shop?category=accessories", label: "Accessories" },
  { href: "/shop?sort=new", label: "New Drops" },
];
