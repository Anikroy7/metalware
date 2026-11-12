"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { COLORS } from "@/data/colors";
import type { Garment, Graphic, ProductColor } from "@/lib/types";
import { useTheme } from "@/store/theme-store";
import { ProductArt } from "./product-art";

type Slide = {
  eyebrow: string;
  title: [string, string];
  text: string;
  href: string;
  cta: string;
  main: { garment: Garment; graphic: Graphic; color: ProductColor; band: string };
  side: { garment: Garment; graphic: Graphic; color: ProductColor };
};

const SLIDES: Slide[] = [
  {
    eyebrow: "The Winter Edit · 2026",
    title: ["Warmth,", "amplified."],
    text: "Heavyweight fleece hoodies carrying the marks of the bands we love. Crafted for cold nights and loud rooms.",
    href: "/shop?category=hoodies",
    cta: "Shop Hoodies",
    main: { garment: "hoodie", graphic: "cassette", color: COLORS.blood, band: "Iron Cassette" },
    side: { garment: "cap", graphic: "bolt", color: COLORS.black },
  },
  {
    eyebrow: "Seventies Revival",
    title: ["Golden hour,", "on vinyl."],
    text: "Sun-washed tones and psychedelic artwork from The Static Saints and Neon Requiem. Soft cotton, warm sound.",
    href: "/shop?genre=Psychedelic",
    cta: "Explore Psychedelic",
    main: { garment: "tshirt", graphic: "sun", color: COLORS.sand, band: "The Static Saints" },
    side: { garment: "tote", graphic: "vinyl", color: COLORS.bone },
  },
  {
    eyebrow: "New Arrivals",
    title: ["Made to be", "played loud."],
    text: "Fresh pieces from this season's tours — long sleeves, tees and keepsakes for every corner of your collection.",
    href: "/shop?sort=new",
    cta: "Shop New In",
    main: { garment: "longsleeve", graphic: "eye", color: COLORS.black, band: "Obsidian Choir" },
    side: { garment: "poster", graphic: "eye", color: COLORS.blood },
  },
];

// Background / arch tone for each slide.
const TONES = [
  { bg: "#e9dfcf", arch: "#f6efe3", dark: false },
  { bg: "#8f3f25", arch: "#a9553a", dark: true },
  { bg: "#d3d4c2", arch: "#e6e6d8", dark: false },
];

// Text and button styles used on dark slides.
const LIGHT = {
  text: "text-[#fbf5ec]",
  sub: "text-[#fbf5ec]/75",
  button: "bg-[#fbf5ec] text-ink hover:bg-white",
};

const DURATION = 6.5;
const ease = [0.22, 1, 0.36, 1] as const;

/** Editorial full-width slider hero for the Heritage design. */
export function HeritageHero() {
  const active = useTheme() === "heritage";
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const tone = TONES[index];
  const go = (i: number) => setIndex((i + SLIDES.length) % SLIDES.length);

  // Autoplay only while this design is the visible one.
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), DURATION * 1000);
    return () => clearTimeout(t);
  }, [index, active]);

  const fg = tone.dark ? LIGHT.text : "text-ink";
  const sub = tone.dark ? LIGHT.sub : "text-ink/70";

  return (
    <section className="relative overflow-hidden" aria-roledescription="carousel">
      <motion.div
        className="absolute inset-0"
        animate={{ backgroundColor: tone.bg }}
        transition={{ duration: 0.8, ease }}
      />

      <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-8 px-4 pb-24 pt-12 sm:px-6 lg:min-h-[620px] lg:grid-cols-2 lg:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${index}`}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.09 } },
              exit: { opacity: 0, transition: { duration: 0.25 } },
            }}
            className={`order-2 text-center lg:order-1 lg:text-left ${fg}`}
            aria-live="polite"
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
              className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em]"
            >
              <span className="h-px w-8 bg-current opacity-60" />
              {slide.eyebrow}
            </motion.p>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }}
              className="font-serif text-[clamp(3rem,7vw,5.75rem)] font-medium leading-[0.95]"
            >
              {slide.title[0]}
              <br />
              <em className="font-semibold italic">{slide.title[1]}</em>
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
              className={`mx-auto mt-6 max-w-md text-base leading-relaxed lg:mx-0 ${sub}`}
            >
              {slide.text}
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
              className="mt-9 flex flex-wrap items-center justify-center gap-6 lg:justify-start"
            >
              <Link
                href={slide.href}
                className={`px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] transition ${
                  tone.dark ? LIGHT.button : "bg-ink text-white hover:bg-amp"
                }`}
              >
                {slide.cta}
              </Link>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 border-b border-current pb-1 text-sm font-semibold uppercase tracking-[0.2em]"
              >
                Discover All
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Arch composition */}
        <div className="relative order-1 mx-auto aspect-[4/5] w-full max-w-[360px] lg:order-2 lg:max-w-[440px]">
          <svg
            viewBox="0 0 200 200"
            aria-hidden
            className={`absolute -right-16 top-1/2 w-[130%] -translate-y-1/2 ${tone.dark ? "text-white" : "text-ink"}`}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx="100" cy="100" r={96 - i * 9} fill="none" stroke="currentColor" strokeOpacity="0.09" />
            ))}
          </svg>
          <AnimatePresence mode="wait">
            <motion.div
              key={`art-${index}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              <motion.div
                className="absolute inset-x-0 bottom-0 top-0 overflow-hidden rounded-t-full"
                style={{ backgroundColor: tone.arch }}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 0.9, ease }}
              >
                <motion.div
                  className="absolute inset-x-[8%] bottom-[4%]"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.9, delay: 0.2, ease }}
                >
                  <ProductArt {...slide.main} />
                </motion.div>
              </motion.div>
              <motion.div
                className="absolute -bottom-6 left-0 w-[38%] rounded-full bg-paper p-3 shadow-xl shadow-black/15 sm:-left-10"
                initial={{ scale: 0.6, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.45 }}
              >
                <ProductArt {...slide.side} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Track-style slide indicators */}
      <div className={`absolute inset-x-0 bottom-0 ${fg}`}>
        <div className="mx-auto flex max-w-7xl items-end gap-4 px-4 pb-6 sm:px-6">
          <div className="grid flex-1 grid-cols-3 gap-3 sm:gap-6">
            {SLIDES.map((s, i) => (
              <button
                key={s.eyebrow}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}: ${s.eyebrow}`}
                aria-current={i === index}
                className="group text-left"
              >
                <span
                  className={`mb-2 hidden text-[11px] font-semibold uppercase tracking-[0.2em] transition-opacity sm:block ${
                    i === index ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")} — {s.eyebrow}
                </span>
                <span className="block h-[2px] overflow-hidden bg-current/20">
                  {i === index && (
                    <motion.span
                      key={index}
                      className="block h-full bg-current"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: DURATION, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="grid size-10 place-items-center rounded-full border border-current/30 transition hover:bg-current/10"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="grid size-10 place-items-center rounded-full border border-current/30 transition hover:bg-current/10"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
