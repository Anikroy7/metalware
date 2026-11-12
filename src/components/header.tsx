"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { announcements, navLinks } from "@/data/site";
import { cartCount, useShop } from "@/store/shop-store";
import { Logo } from "./logo";
import { useUI } from "./providers";
import { ThemeMenu, ThemeSegmented } from "./theme-switcher";

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-amp px-1 text-[10px] font-bold text-white"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function AnnouncementBar() {
  const items = [...announcements, ...announcements];
  return (
    <div className="overflow-hidden bg-amp text-white">
      <div className="marquee-track flex w-max gap-10 py-2 text-xs font-medium uppercase tracking-[0.18em]">
        {[...items, ...items].map((text, i) => (
          <span key={i} className="flex items-center gap-10 whitespace-nowrap">
            {text}
            <span aria-hidden className="opacity-60">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const { favorites, cart } = useShop();
  const { openCart } = useUI();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const iconBtn =
    "relative grid size-10 place-items-center rounded-full text-on-chrome/80 transition hover:bg-on-chrome/10 hover:text-on-chrome";

  return (
    <header className="sticky top-0 z-50">
      <AnnouncementBar />
      <div
        className={`border-b border-on-chrome/10 bg-chrome/95 backdrop-blur transition-shadow duration-300 ${scrolled ? "shadow-lg shadow-black/10" : ""}`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <button
            type="button"
            className={`${iconBtn} -ml-2 lg:hidden`}
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="size-5" />
          </button>

          <Logo tone="chrome" />

          <nav className="ml-8 hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative px-3 py-2 text-sm font-medium text-on-chrome/75 transition hover:text-on-chrome"
              >
                {link.label}
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-amp transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden sm:block">
              <ThemeMenu buttonClassName={iconBtn} />
            </div>
            <button type="button" className={iconBtn} aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>
            <Link href="/favorites" className={iconBtn} aria-label={`Favorites (${favorites.length})`}>
              <Heart className="size-5" />
              <CountBadge count={favorites.length} />
            </Link>
            <button type="button" className={iconBtn} aria-label={`Bag (${cartCount(cart)})`} onClick={openCart}>
              <ShoppingBag className="size-5" />
              <CountBadge count={cartCount(cart)} />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.form
              onSubmit={submitSearch}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden border-t border-on-chrome/10"
            >
              <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
                <Search className="size-5 shrink-0 text-on-chrome/50" />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bands, tees, hoodies…"
                  className="w-full bg-transparent text-lg text-on-chrome placeholder:text-on-chrome/40 focus:outline-none"
                />
                <button type="submit" className="rounded-full bg-amp px-4 py-1.5 text-sm font-semibold text-white">
                  Search
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-sm flex-col overflow-y-auto bg-chrome text-on-chrome lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-on-chrome/10 px-4">
                <Logo tone="chrome" onClick={() => setMenuOpen(false)} />
                <button type="button" className={iconBtn} aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex flex-col p-4">
                {[...navLinks, { href: "/favorites", label: "Favorites" }, { href: "/orders", label: "My Orders" }].map(
                  (link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between border-b border-on-chrome/10 py-4 font-display text-2xl uppercase tracking-wide"
                      >
                        {link.label}
                        <span className="text-sm text-on-chrome/30">{String(i + 1).padStart(2, "0")}</span>
                      </Link>
                    </motion.div>
                  ),
                )}
              </nav>
              <motion.div
                className="mt-auto border-t border-on-chrome/10 p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-on-chrome/50">
                  Store design
                </p>
                <ThemeSegmented />
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
