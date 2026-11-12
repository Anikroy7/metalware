import Link from "next/link";
import { Banknote, Phone, RefreshCcw, Truck } from "lucide-react";
import { categories } from "@/data/categories";
import { delivery, site } from "@/data/site";
import { Logo } from "./logo";

const PERKS = [
  { icon: Banknote, title: "Cash on Delivery", text: "Pay when your order arrives" },
  { icon: Truck, title: "Nationwide Delivery", text: `Inside Dhaka ${delivery.insideDhakaDays}` },
  { icon: RefreshCcw, title: "7-Day Exchange", text: "Wrong size? Swap it easily" },
  { icon: Phone, title: "Order Confirmation Call", text: "We call before dispatch" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {PERKS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
                <Icon className="size-5 text-amp" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/55">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Band merch and music-inspired streetwear for people who live loud. Designed for the stage, built for every day.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Shop</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${c.slug}`} className="transition hover:text-amp">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Your Account</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>
              <Link href="/favorites" className="transition hover:text-amp">
                Favorites
              </Link>
            </li>
            <li>
              <Link href="/orders" className="transition hover:text-amp">
                My Orders
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="transition hover:text-amp">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Customer Care</h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li>{site.phone}</li>
            <li>{site.email}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-white/40 sm:flex-row sm:px-6">
          <p>© 2026 {site.name}. Demo store — all bands are fictional.</p>
          <p>Cash on Delivery only · No online payment required</p>
        </div>
      </div>
    </footer>
  );
}
