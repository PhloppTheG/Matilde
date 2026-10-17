import type { CardDef } from '../data/cards'
import { QrMotif } from './Illustrations'

/** A small visual of the physical card (decorative QR motif). */
export function PhysicalCard({ card, dimmed = false }: { card: CardDef; dimmed?: boolean }) {
  const Icon = card.icon
  return (
    <div
      aria-hidden="true"
      className="relative flex h-[88px] w-[132px] shrink-0 items-center gap-2 rounded-2xl p-2.5"
      style={{
        background: card.tint,
        opacity: dimmed ? 0.45 : 1,
        boxShadow: '0 1px 0 rgba(23,63,58,0.12), 0 6px 14px -8px rgba(23,63,58,0.35)',
      }}
    >
      <div className="flex h-full flex-1 flex-col justify-between">
        <Icon size={24} strokeWidth={2.2} color="#173f3a" />
        <span className="text-[11px] font-bold leading-tight text-teal">Mã</span>
      </div>
      <svg viewBox="0 0 60 60" className="h-[60px] w-[60px] rounded-lg bg-surface p-1">
        <QrMotif size={60} seed={card.id.length + card.title.length} />
      </svg>
    </div>
  )
}
