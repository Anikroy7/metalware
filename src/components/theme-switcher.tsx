"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { setTheme, useTheme, type Theme } from "@/store/theme-store";

const OPTIONS: { value: Theme; label: string; note: string; swatch: [string, string, string] }[] = [
  { value: "stage", label: "Stage", note: "Dark concert look", swatch: ["#111114", "#e8452c", "#f4f1ea"] },
  { value: "heritage", label: "Heritage", note: "Warm & editorial", swatch: ["#2b211c", "#a8432a", "#f7f2ea"] },
  { value: "studio", label: "Studio", note: "Clean & light", swatch: ["#ffffff", "#2f5bea", "#172033"] },
];

function Swatch({ colors, className = "size-7" }: { colors: readonly string[]; className?: string }) {
  return (
    <span
      aria-hidden
      className={`${className} shrink-0 overflow-hidden rounded-full ring-1 ring-black/10`}
      style={{
        background: `conic-gradient(${colors[0]} 0 50%, ${colors[1]} 50% 75%, ${colors[2]} 75% 100%)`,
      }}
    />
  );
}

/** Header dropdown for choosing the store design. */
export function ThemeMenu({ buttonClassName }: { buttonClassName: string }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className={buttonClassName}
        aria-label="Change design"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <Palette className="size-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right rounded-2xl border border-line bg-paper p-2 text-ink shadow-xl shadow-black/15"
          >
            <p className="px-3 pb-2 pt-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Store design
            </p>
            {OPTIONS.map((o) => {
              const active = theme === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    setOpen(false);
                    if (!active) setTheme(o.value);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    active ? "bg-stage" : "hover:bg-stage/70"
                  }`}
                >
                  <Swatch colors={o.swatch} />
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{o.label}</span>
                    <span className="block text-xs text-muted">{o.note}</span>
                  </span>
                  {active && <Check className="size-4 text-amp" strokeWidth={3} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Compact three-way switch used inside the mobile menu. */
export function ThemeSegmented() {
  const theme = useTheme();
  return (
    <div role="radiogroup" aria-label="Store design" className="grid grid-cols-3 gap-2">
      {OPTIONS.map((o) => {
        const active = theme === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => !active && setTheme(o.value)}
            className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-xs font-semibold transition ${
              active ? "border-on-chrome/60 bg-on-chrome/10" : "border-on-chrome/15 hover:border-on-chrome/40"
            }`}
          >
            <Swatch colors={o.swatch} className="size-8" />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Renders children only for one design; remounts on switch so entrance animations replay. */
export function ThemeOnly({ theme, children }: { theme: Theme; children: React.ReactNode }) {
  const current = useTheme();
  return (
    <div key={current === theme ? "active" : "idle"} className={`theme-${theme}-only`}>
      {children}
    </div>
  );
}
