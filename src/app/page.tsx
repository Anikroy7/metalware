import Link from "next/link";
import { ArrowRight, Banknote, ClipboardList, Headphones, MousePointerClick } from "lucide-react";
import { categories, genres } from "@/data/categories";
import { COLORS } from "@/data/colors";
import { getProductBySlug, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { HeritageHero } from "@/components/heritage-hero";
import { HomeHero } from "@/components/home-hero";
import { ThemeOnly } from "@/components/theme-switcher";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StudioHero } from "@/components/studio-hero";

const GENRE_MARQUEE = [...genres, ...genres, ...genres, ...genres];

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Pick your gear",
    text: "Choose a color and size, then add it to your bag or hit Order Now.",
  },
  {
    icon: ClipboardList,
    title: "Share your details",
    text: "Name, phone and delivery address. That's it. No account needed.",
  },
  {
    icon: Banknote,
    title: "Pay cash on delivery",
    text: "We call to confirm, then you pay the rider when your order arrives.",
  },
];

export default function Home() {
  const newDrops = products.filter((p) => p.tags.includes("new")).slice(0, 4);
  const bestsellers = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4);
  const spotlight = getProductBySlug("velvet-thunder-bolt-hoodie")!;

  return (
    <>
      <ThemeOnly theme="stage">
        <HomeHero />
      </ThemeOnly>
      <ThemeOnly theme="heritage">
        <HeritageHero />
      </ThemeOnly>
      <ThemeOnly theme="studio">
        <StudioHero />
      </ThemeOnly>

      {/* Genre ticker */}
      <div className="overflow-hidden border-y border-ink bg-bone py-4">
        <div className="marquee-track flex w-max items-center gap-8">
          {GENRE_MARQUEE.map((g, i) => (
            <span key={i} className="flex items-center gap-8 font-display text-3xl uppercase tracking-wide">
              {g}
              <span className="text-amp" aria-hidden>
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Side A" title="Shop by Category" href="/shop" />
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <RevealItem key={c.slug} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-stage p-4 transition-shadow hover:shadow-xl hover:shadow-black/10"
              >
                <div className="mx-auto aspect-square w-full max-w-[220px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                  <ProductArt garment={c.garment} graphic={c.graphic} color={c.color} />
                </div>
                <div className="mt-2 flex items-end justify-between gap-2">
                  <div>
                    <h3 className="font-display text-2xl uppercase tracking-wide">{c.name}</h3>
                    <p className="text-xs text-muted">{c.tagline}</p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white transition group-hover:bg-amp">
                    <ArrowRight className="size-4 transition-transform group-hover:-rotate-45" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* New drops */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Fresh off the press" title="New Drops" href="/shop?sort=new" />
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {newDrops.map((p) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Artist spotlight */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Reveal>
          <div className="relative grid overflow-hidden rounded-3xl bg-ink text-white md:grid-cols-2">
            <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amp">
                <Headphones className="size-4" /> Artist Spotlight
              </p>
              <h2 className="font-display text-5xl uppercase leading-[0.95] tracking-wide sm:text-6xl">
                Velvet
                <br />
                Thunder
              </h2>
              <p className="mt-5 max-w-sm text-white/65">
                Fresh off their sold-out winter run, Velvet Thunder&apos;s lightning mark lands on our heaviest fleece
                yet. Limited stock — once it&apos;s gone, it&apos;s gone.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={`/product/${spotlight.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-ink transition hover:bg-amp hover:text-white"
                >
                  Get the Hoodie — {formatPrice(spotlight.price)}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="text-sm text-white/50">{spotlight.stock} left in stock</span>
              </div>
            </div>
            <div className="relative grid min-h-[320px] place-items-center bg-gradient-to-br from-amp to-amp-dark p-8">
              <div className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(90deg,#000_0_2px,transparent_2px_14px)]" />
              <div className="relative w-full max-w-sm drop-shadow-2xl">
                <ProductArt garment="hoodie" graphic="bolt" color={COLORS.navy} band="Velvet Thunder" />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Side B" title="Top of the Charts" href="/shop?sort=popular" />
        </Reveal>
        <RevealGroup className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {bestsellers.map((p, i) => (
            <RevealItem key={p.id}>
              <ProductCard product={p} track={i + 1} />
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* Genres */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Reveal>
          <SectionHeading eyebrow="Find your sound" title="Shop by Genre" />
        </Reveal>
        <RevealGroup className="flex flex-wrap gap-3">
          {genres.map((g) => (
            <RevealItem key={g}>
              <Link
                href={`/shop?genre=${encodeURIComponent(g)}`}
                className="inline-flex items-center gap-3 rounded-full border border-ink/15 bg-paper px-6 py-3.5 font-display text-xl uppercase tracking-wide transition hover:-translate-y-0.5 hover:border-ink hover:bg-ink hover:text-white"
              >
                {g}
                <span className="text-sm text-muted">
                  {products.filter((p) => p.genre === g).length}
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* How ordering works */}
      <section className="mx-auto max-w-7xl px-4 pt-24 sm:px-6">
        <Reveal>
          <div className="rounded-3xl border border-line bg-paper p-8 sm:p-12">
            <div className="mb-10 text-center">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-amp">Simple as 1-2-3</p>
              <h2 className="font-display text-4xl uppercase tracking-wide sm:text-5xl">How Ordering Works</h2>
            </div>
            <RevealGroup className="grid gap-8 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <RevealItem key={title} className="relative text-center">
                  <span className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-ink text-white">
                    <Icon className="size-7" />
                  </span>
                  <p className="font-display text-sm tracking-[0.3em] text-amp">TRACK {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-lg font-bold">{title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted">{text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </Reveal>
      </section>
    </>
  );
}
