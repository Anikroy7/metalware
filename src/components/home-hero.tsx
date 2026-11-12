"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Banknote, RefreshCcw, Truck } from "lucide-react";
import { COLORS } from "@/data/colors";
import { ProductArt } from "./product-art";

const ease = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

function Vinyl() {
  return (
    <svg viewBox="0 0 200 200" className="spin-slow size-full">
      <circle cx="100" cy="100" r="98" fill="#050506" stroke="#fff" strokeOpacity="0.14" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx="100" cy="100" r={90 - i * 4.2} fill="none" stroke="#fff" strokeOpacity="0.1" />
      ))}
      <path d="M 40 52 A 72 72 0 0 1 100 28" fill="none" stroke="#fff" strokeOpacity="0.18" strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="100" r="30" fill="#e8452c" />
      <text
        x="100"
        y="97"
        textAnchor="middle"
        fill="#fff"
        fontSize="9"
        letterSpacing="2"
        style={{ fontFamily: "var(--font-anton)" }}
      >
        METALWARE
      </text>
      <text x="100" y="112" textAnchor="middle" fill="#fff" fillOpacity="0.7" fontSize="6" letterSpacing="2">
        SIDE A · 33⅓
      </text>
      <circle cx="100" cy="100" r="3" fill="#0a0a0c" />
    </svg>
  );
}

export function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Background waveform */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-[0.07]"
        preserveAspectRatio="none"
        viewBox="0 0 1200 160"
      >
        {Array.from({ length: 120 }, (_, i) => {
          const h = 20 + Math.abs(Math.sin(i * 0.35) * Math.cos(i * 0.11)) * 130;
          return <rect key={i} x={i * 10} y={160 - h} width="5" height={h} rx="2" fill="#fff" />;
        })}
      </svg>
      <div className="pointer-events-none absolute -right-40 -top-40 size-[520px] rounded-full bg-amp/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-20">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/70"
          >
            <span className="size-1.5 rounded-full bg-amp" />
            Vol. 26 — The Winter Drop
          </motion.p>
          <motion.h1
            variants={item}
            className="font-display text-[clamp(3.5rem,10vw,7.5rem)] uppercase leading-[0.88] tracking-wide"
          >
            Wear the
            <br />
            <span className="text-amp">Music.</span>
          </motion.h1>
          <motion.p variants={item} className="mt-6 max-w-md text-base text-white/65 sm:text-lg">
            Band tees, heavyweight hoodies and stage-ready accessories — made for people who live loud. Order in a
            minute, pay cash when it arrives.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-amp px-7 py-3.5 font-semibold text-white transition hover:bg-amp-dark"
            >
              Shop the Drop
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/shop?category=hoodies"
              className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white hover:text-ink"
            >
              Browse Hoodies
            </Link>
          </motion.div>
          <motion.ul variants={item} className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
            <li className="flex items-center gap-2">
              <Banknote className="size-4 text-amp" /> Cash on Delivery
            </li>
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-amp" /> Nationwide shipping
            </li>
            <li className="flex items-center gap-2">
              <RefreshCcw className="size-4 text-amp" /> 7-day exchange
            </li>
          </motion.ul>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <motion.div
            className="absolute -right-[4%] top-0 w-[80%] drop-shadow-[0_0_60px_rgba(232,69,44,0.25)]"
            initial={{ opacity: 0, x: 80, rotate: -40 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
          >
            <Vinyl />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 w-[58%] rounded-3xl bg-stage p-5 shadow-2xl shadow-black/50"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.45 }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ProductArt garment="hoodie" graphic="bolt" color={COLORS.black} band="Velvet Thunder" />
            </motion.div>
            <div className="absolute -right-4 top-6 rotate-6 rounded-xl bg-amp px-3 py-2 text-white shadow-lg">
              <p className="text-[10px] uppercase tracking-widest text-white/80">New</p>
              <p className="font-display text-lg leading-none">৳2,450</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
