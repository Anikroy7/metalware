import Link from "next/link";

const BARS = [0.55, 1, 0.7, 0.9];

export function EqBars({ className = "h-5", color = "bg-amp" }: { className?: string; color?: string }) {
  return (
    <span className={`inline-flex items-end gap-[3px] ${className}`} aria-hidden>
      {BARS.map((h, i) => (
        <span
          key={i}
          className={`eq-bar block w-[3px] rounded-full ${color}`}
          style={{ height: `${h * 100}%`, animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

/** The Metalware "M" mark: two angled legs framing a soundwave. Inherits the current text color. */
export function MetalwareMark({ className = "h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 734 540" fill="currentColor" className={`w-auto ${className}`} aria-hidden>
      <path d="M20 55 L235 235 V345 L110 245 V522 H20 Z" />
      <path d="M714 55 L499 235 V345 L624 245 V522 H714 Z" />
      <rect x="240" y="180" width="28" height="178" rx="14" />
      <rect x="296" y="100" width="28" height="340" rx="14" />
      <rect x="353" y="10" width="28" height="520" rx="14" />
      <rect x="410" y="100" width="28" height="340" rx="14" />
      <rect x="466" y="180" width="28" height="178" rx="14" />
    </svg>
  );
}

const TONE = { dark: "text-ink", light: "text-white", chrome: "text-on-chrome" } as const;

export function Logo({ tone = "dark", onClick }: { tone?: keyof typeof TONE; onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 ${TONE[tone]}`}
      aria-label="Metalware home"
    >
      <MetalwareMark className="h-8 transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col font-brand leading-none">
        <span className="text-xl font-semibold tracking-[0.04em]">METALWARE</span>
        <span className="mt-1 text-[0.55rem] font-normal tracking-[0.42em] opacity-70">Music &amp; Lifestyle</span>
      </span>
    </Link>
  );
}
