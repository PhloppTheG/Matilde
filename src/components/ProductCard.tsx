import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { formatPrice, type Bundle } from '../data/bundles'
import { BundleArt } from './Illustrations'

export function ProductCard({ bundle }: { bundle: Bundle }) {
  return (
    <article className="card overflow-hidden">
      <div style={{ background: bundle.accent + '55' }}>
        <BundleArt bundleId={bundle.id} className="mx-auto block h-auto w-full max-w-[320px]" />
      </div>
      <div className="p-5">
        <h2 className="text-[1.5rem]">{bundle.name}</h2>
        <p className="mt-1 mb-3">{bundle.short}</p>
        <p className="m-0 text-[0.95rem] text-teal-soft">
          {bundle.cardIds.length} physical cards
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="font-serif text-[1.5rem] font-semibold">
            {formatPrice(bundle.priceCents)}
          </span>
          <Link
            to={`/shop/${bundle.id}`}
            className="btn btn-dark"
            aria-label={`View ${bundle.name}`}
          >
            View bundle <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
