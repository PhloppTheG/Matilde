import type { CSSProperties } from 'react'

const TEAL = '#173f3a'
const CREAM = '#f8f5ec'
const SURFACE = '#fffdf7'

/** Deterministic pseudo-random QR-like motif (decorative, not scannable). */
function qrCells(seed: number, size = 9) {
  const cells: { x: number; y: number }[] = []
  let s = seed * 9301 + 49297
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inFinder = (x < 3 && y < 3) || (x >= size - 3 && y < 3) || (x < 3 && y >= size - 3)
      if (inFinder) continue
      s = (s * 9301 + 49297) % 233280
      if (s / 233280 > 0.5) cells.push({ x, y })
    }
  }
  return cells
}

export function QrMotif({
  x = 0,
  y = 0,
  size = 60,
  seed = 1,
  color = TEAL,
}: {
  x?: number
  y?: number
  size?: number
  seed?: number
  color?: string
}) {
  const n = 9
  const u = size / n
  const finder = (fx: number, fy: number) => (
    <g key={`${fx}-${fy}`}>
      <rect x={x + fx * u} y={y + fy * u} width={3 * u} height={3 * u} rx={u * 0.4} fill={color} />
      <rect x={x + (fx + 0.6) * u} y={y + (fy + 0.6) * u} width={1.8 * u} height={1.8 * u} rx={u * 0.25} fill={SURFACE} />
      <rect x={x + (fx + 1.05) * u} y={y + (fy + 1.05) * u} width={0.9 * u} height={0.9 * u} fill={color} />
    </g>
  )
  return (
    <g>
      {finder(0, 0)}
      {finder(n - 3, 0)}
      {finder(0, n - 3)}
      {qrCells(seed, n).map((c) => (
        <rect key={`${c.x}-${c.y}`} x={x + c.x * u + u * 0.08} y={y + c.y * u + u * 0.08} width={u * 0.84} height={u * 0.84} rx={u * 0.2} fill={color} />
      ))}
    </g>
  )
}

/** Hero for the Scan screen: a phone held over a QR card. */
export function ScanHero({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 320 260" role="img" aria-label="A smartphone scanning a card with a QR code" className={className} style={style}>
      <ellipse cx="160" cy="236" rx="120" ry="12" fill={TEAL} opacity="0.08" />
      {/* card */}
      <g transform="rotate(-8 130 170)">
        <rect x="40" y="110" width="190" height="120" rx="20" fill="#e6b9a0" />
        <rect x="40" y="110" width="190" height="120" rx="20" fill="none" stroke={TEAL} strokeOpacity="0.15" strokeWidth="2" />
        <rect x="58" y="128" width="84" height="84" rx="12" fill={SURFACE} />
        <QrMotif x={66} y={136} size={68} seed={3} />
        <rect x="156" y="140" width="56" height="8" rx="4" fill={TEAL} opacity="0.85" />
        <rect x="156" y="158" width="40" height="8" rx="4" fill={TEAL} opacity="0.4" />
        <rect x="156" y="190" width="30" height="10" rx="5" fill={SURFACE} opacity="0.9" />
      </g>
      {/* phone */}
      <g transform="rotate(8 220 100)">
        <rect x="150" y="14" width="128" height="196" rx="26" fill={TEAL} />
        <rect x="158" y="22" width="112" height="180" rx="19" fill={CREAM} />
        <rect x="196" y="28" width="36" height="8" rx="4" fill={TEAL} />
        {/* viewfinder */}
        <g stroke={TEAL} strokeWidth="5" strokeLinecap="round" fill="none">
          <path d="M184 80 v-16 h16" />
          <path d="M244 80 v-16 h-16" />
          <path d="M184 140 v16 h16" />
          <path d="M244 140 v16 h-16" />
        </g>
        <QrMotif x={194} y={90} size={40} seed={3} color="#5f7a5a" />
        <rect x="190" y="104" width="48" height="3" rx="1.5" fill="#a8b9a0" />
        <rect x="178" y="172" width="72" height="16" rx="8" fill="#a8b9a0" />
      </g>
    </svg>
  )
}

const ART_COLORS: Record<string, [string, string, string]> = {
  'getting-started': ['#a8b9a0', '#e6b9a0', '#ecdca2'],
  'staying-in-touch': ['#e6b9a0', '#a9c1c9', '#a8b9a0'],
  'safe-every-day': ['#ecdca2', '#a8b9a0', '#e6b9a0'],
  'my-everyday': ['#a9c1c9', '#ecdca2', '#e6b9a0'],
}

/** Fanned stack of three cards, one per bundle. */
export function BundleArt({ bundleId, className }: { bundleId: string; className?: string }) {
  const [c1, c2, c3] = ART_COLORS[bundleId] ?? ART_COLORS['getting-started']
  const seed = bundleId.length
  const card = (fill: string, rot: number, dx: number, s: number, front = false) => (
    <g transform={`rotate(${rot} 160 150) translate(${dx} 0)`}>
      <rect x="86" y="50" width="148" height="190" rx="22" fill={fill} stroke={TEAL} strokeOpacity="0.12" strokeWidth="2" />
      {front && (
        <>
          <rect x="106" y="70" width="108" height="108" rx="14" fill={SURFACE} />
          <QrMotif x={116} y={80} size={88} seed={s} />
          <rect x="106" y="194" width="70" height="9" rx="4.5" fill={TEAL} opacity="0.85" />
          <rect x="106" y="210" width="46" height="9" rx="4.5" fill={TEAL} opacity="0.4" />
        </>
      )}
    </g>
  )
  return (
    <svg viewBox="0 0 320 260" role="img" aria-label="A bundle of Mã cards" className={className}>
      <ellipse cx="160" cy="246" rx="100" ry="9" fill={TEAL} opacity="0.08" />
      {card(c3, -16, -34, seed + 2)}
      {card(c2, 14, 34, seed + 1)}
      {card(c1, 0, 0, seed, true)}
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} style={{ fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
      Mã
    </span>
  )
}
