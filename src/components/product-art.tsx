import type { Garment, Graphic, ProductColor } from "@/lib/types";

type Props = {
  garment: Garment;
  graphic: Graphic;
  color: ProductColor;
  band?: string;
  className?: string;
};

const WAVE = [14, 26, 18, 38, 30, 52, 40, 66, 48, 80, 80, 48, 66, 40, 52, 30, 38, 18, 26, 14];
const EQ = [4, 6, 3, 7, 5, 8, 4];

/** Original artwork drawn in a 100×100 box. */
function Artwork({ graphic, ink, accent, fabric }: { graphic: Graphic; ink: string; accent: string; fabric: string }) {
  switch (graphic) {
    case "wave":
      return (
        <g>
          <line x1="0" y1="50" x2="100" y2="50" stroke={accent} strokeWidth="1.5" />
          {WAVE.map((h, i) => (
            <line
              key={i}
              x1={5 + i * 4.7}
              x2={5 + i * 4.7}
              y1={50 - h / 2}
              y2={50 + h / 2}
              stroke={ink}
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          ))}
        </g>
      );
    case "vinyl":
      return (
        <g>
          <circle cx="50" cy="50" r="48" fill={ink} />
          {[41, 35, 29, 23].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke={fabric} strokeOpacity="0.35" strokeWidth="1" />
          ))}
          <path d="M 20 26 A 38 38 0 0 1 50 12" fill="none" stroke={fabric} strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="15" fill={accent} />
          <circle cx="50" cy="50" r="2.6" fill={fabric} />
        </g>
      );
    case "bolt":
      return (
        <g>
          <circle cx="50" cy="50" r="46" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx="50" cy="50" r="39" fill="none" stroke={ink} strokeWidth="1" strokeDasharray="2 4" />
          <polygon points="58,8 22,56 46,56 38,92 80,40 55,40 66,8" fill={accent} stroke={ink} strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    case "sun":
      return (
        <g>
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const r2 = i % 2 === 0 ? 47 : 40;
            return (
              <line
                key={i}
                x1={50 + Math.cos(a) * 29}
                y1={50 + Math.sin(a) * 29}
                x2={50 + Math.cos(a) * r2}
                y2={50 + Math.sin(a) * r2}
                stroke={ink}
                strokeWidth="3"
                strokeLinecap="round"
              />
            );
          })}
          <circle cx="50" cy="50" r="22" fill={accent} />
          <path d="M 32 54 L 68 54 M 34 61 L 66 61 M 39 68 L 61 68" stroke={fabric} strokeWidth="2.5" />
        </g>
      );
    case "eq":
      return (
        <g>
          {EQ.map((n, i) =>
            Array.from({ length: n }, (_, k) => (
              <rect
                key={`${i}-${k}`}
                x={6 + i * 13}
                y={90 - (k + 1) * 10.5}
                width="10"
                height="7.5"
                rx="1"
                fill={k >= n - 1 ? accent : ink}
              />
            )),
          )}
          <line x1="2" y1="93" x2="98" y2="93" stroke={ink} strokeWidth="2" />
        </g>
      );
    case "cassette":
      return (
        <g fill="none" stroke={ink} strokeWidth="3" strokeLinejoin="round">
          <rect x="4" y="18" width="92" height="64" rx="6" />
          <rect x="12" y="25" width="76" height="20" rx="2" fill={accent} stroke="none" />
          <rect x="22" y="49" width="56" height="20" rx="10" strokeWidth="2" />
          <circle cx="34" cy="59" r="6" />
          <circle cx="66" cy="59" r="6" />
          <path d="M 24 82 L 30 72 L 70 72 L 76 82" strokeWidth="2.5" />
        </g>
      );
    case "eye":
      return (
        <g>
          {[-60, -30, 0, 30, 60].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="20"
              x2="50"
              y2="6"
              stroke={ink}
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
          <path d="M 4 54 Q 50 12 96 54 Q 50 96 4 54 Z" fill="none" stroke={ink} strokeWidth="3" />
          <circle cx="50" cy="54" r="17" fill={accent} />
          <circle cx="50" cy="54" r="7" fill={ink} />
          <circle cx="45" cy="49" r="2.5" fill={fabric} />
        </g>
      );
    case "flame":
      return (
        <g>
          <path
            d="M50 4 C 60 24 82 34 82 62 C 82 84 67 97 50 97 C 33 97 18 84 18 62 C 18 47 26 38 33 30 C 35 44 41 49 46 49 C 41 33 43 17 50 4 Z"
            fill={accent}
            stroke={ink}
            strokeWidth="2.5"
          />
          <path d="M50 50 C 57 60 65 67 65 78 C 65 88 58 94 50 94 C 42 94 35 88 35 78 C 35 69 44 62 50 50 Z" fill={ink} />
        </g>
      );
  }
}

const FOLD = { stroke: "#000", strokeOpacity: 0.09, strokeWidth: 2, fill: "none" } as const;
const EDGE = { stroke: "#000", strokeOpacity: 0.18, strokeWidth: 1.5 } as const;

/** Flat garment illustration used as the product image throughout the demo store. */
export function ProductArt({ garment, graphic, color, band, className }: Props) {
  const { hex, ink, accent } = color;
  const art = (x: number, y: number, s: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Artwork graphic={graphic} ink={ink} accent={accent} fabric={hex} />
    </g>
  );
  const label = (y: number, size = 13) =>
    band ? (
      <text
        x="200"
        y={y}
        textAnchor="middle"
        fill={ink}
        fontSize={size}
        letterSpacing="3"
        style={{ fontFamily: "var(--font-anton), Impact, sans-serif", textTransform: "uppercase" }}
      >
        {band}
      </text>
    ) : null;

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label={band ? `${band} ${garment}` : garment}>
      <ellipse cx="200" cy="366" rx="120" ry="9" fill="#000" opacity="0.08" />

      {garment === "tshirt" && (
        <g>
          <path
            d="M128 72 L168 56 Q200 84 232 56 L272 72 L344 118 L314 176 L282 158 L284 350 Q200 360 116 350 L118 158 L86 176 L56 118 Z"
            fill={hex}
            {...EDGE}
          />
          <path d="M168 56 Q200 84 232 56 Q200 100 168 56 Z" fill="#000" opacity="0.18" />
          <path d="M118 158 L114 120 M282 158 L286 120" {...FOLD} />
          {art(150, 140, 1)}
          {label(275)}
        </g>
      )}

      {garment === "longsleeve" && (
        <g>
          <path
            d="M128 72 L168 56 Q200 84 232 56 L272 72 Q312 86 324 130 L352 318 L318 326 L286 180 L284 350 Q200 360 116 350 L114 180 L82 326 L48 318 L76 130 Q88 86 128 72 Z"
            fill={hex}
            {...EDGE}
          />
          <path d="M168 56 Q200 84 232 56 Q200 100 168 56 Z" fill="#000" opacity="0.18" />
          <path d="M52 300 L84 307 M348 300 L316 307 M114 180 L112 120 M286 180 L288 120" {...FOLD} />
          {art(150, 140, 1)}
          {label(275)}
        </g>
      )}

      {garment === "hoodie" && (
        <g>
          <path d="M150 82 Q138 28 200 24 Q262 28 250 82 Z" fill={hex} {...EDGE} />
          <path
            d="M124 74 L166 58 Q200 80 234 58 L276 74 Q318 88 330 134 L356 322 L320 330 L288 184 L288 350 Q200 362 112 350 L112 184 L80 330 L44 322 L70 134 Q82 88 124 74 Z"
            fill={hex}
            {...EDGE}
          />
          <path d="M160 70 Q200 128 240 70 Q224 46 200 46 Q176 46 160 70 Z" fill="#000" opacity="0.28" />
          <path d="M188 98 L186 132 M212 98 L214 132" stroke={ink} strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M140 286 L260 286 L276 346 M140 286 L124 346" {...FOLD} strokeOpacity={0.16} />
          <path d="M48 300 L82 308 M352 300 L318 308" {...FOLD} />
          {art(157, 146, 0.86)}
          {label(266, 11)}
        </g>
      )}

      {garment === "cap" && (
        <g>
          <path d="M100 246 Q98 120 200 114 Q302 120 300 246 Z" fill={hex} {...EDGE} />
          <path d="M200 116 L200 246 M150 126 Q134 186 140 246 M250 126 Q266 186 260 246" {...FOLD} />
          <circle cx="200" cy="116" r="7" fill={hex} {...EDGE} />
          {art(166, 150, 0.68)}
          <path d="M78 246 Q200 224 322 246 Q334 270 302 278 Q200 260 98 278 Q66 270 78 246 Z" fill={hex} {...EDGE} />
          <path d="M78 246 Q200 224 322 246 Q334 270 302 278 Q200 260 98 278 Q66 270 78 246 Z" fill="#000" opacity="0.12" />
        </g>
      )}

      {garment === "tote" && (
        <g>
          <path d="M152 146 Q150 58 200 58 Q250 58 248 146" fill="none" stroke={hex} strokeWidth="12" />
          <path d="M152 146 Q150 58 200 58 Q250 58 248 146" fill="none" stroke="#000" strokeOpacity="0.15" strokeWidth="12" />
          <path d="M108 140 L292 140 L304 352 L96 352 Z" fill={hex} {...EDGE} />
          <path d="M108 154 L292 154" {...FOLD} />
          {art(150, 186, 1)}
          {label(318)}
        </g>
      )}

      {garment === "poster" && (
        <g>
          <rect x="96" y="34" width="208" height="326" fill={hex} {...EDGE} />
          <rect x="108" y="46" width="184" height="302" fill="none" stroke={ink} strokeOpacity="0.45" />
          {art(130, 82, 1.4)}
          {label(268, 20)}
          <text
            x="200"
            y="296"
            textAnchor="middle"
            fill={accent}
            fontSize="10"
            letterSpacing="4"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            ECLIPSE WORLD TOUR
          </text>
          <rect x="182" y="26" width="36" height="14" fill="#fff" opacity="0.55" transform="rotate(-4 200 33)" />
        </g>
      )}
    </svg>
  );
}
