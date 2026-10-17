import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react'
import { formatPrice, getBundle } from '../data/bundles'
import { getCard } from '../data/cards'
import { BundleArt } from '../components/Illustrations'
import { CartLink } from './ShopPage'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function BundlePage() {
  const { bundleId } = useParams()
  const bundle = getBundle(bundleId)
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const timer = useRef<number | null>(null)
  useDocumentTitle(bundle?.name ?? 'Bundle not found')

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  if (!bundle) {
    return (
      <main className="page text-center">
        <h1 className="text-[2rem]">We could not find that bundle</h1>
        <Link to="/shop" className="btn btn-primary mt-6">Back to Shop</Link>
      </main>
    )
  }

  const onAdd = () => {
    add(bundle.id)
    setAdded(true)
    if (timer.current !== null) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setAdded(false), 2500)
  }

  const cards = bundle.cardIds.map(getCard).filter((c): c is NonNullable<typeof c> => !!c)

  return (
    <main className="page">
      <header className="mb-4 flex items-center justify-between">
        <Link to="/shop" className="btn btn-ghost">
          <ArrowLeft size={20} aria-hidden="true" /> Shop
        </Link>
        <CartLink />
      </header>

      <div className="overflow-hidden rounded-card" style={{ background: bundle.accent + '55' }}>
        <BundleArt bundleId={bundle.id} className="mx-auto block h-auto w-full max-w-[380px]" />
      </div>

      <h1 className="mt-5 text-[2.1rem]">{bundle.name}</h1>
      <p className="mt-2">{bundle.audience}</p>
      <p className="mt-2 text-teal-soft">{cards.length} physical cards</p>
      <p className="mt-3 font-serif text-[1.8rem] font-semibold">{formatPrice(bundle.priceCents)}</p>

      <button type="button" className="btn btn-primary mt-3 w-full" style={{ minHeight: 68, fontSize: '1.2rem' }} onClick={onAdd}>
        <ShoppingBag size={22} aria-hidden="true" /> Add to cart
      </button>
      <p role="status" aria-live="polite" className="mt-3 min-h-[1.5em] text-center font-bold">
        {added && (
          <>
            <Check size={18} className="mr-1 inline" aria-hidden="true" />
            Added to your cart. <Link to="/cart" className="underline">View cart</Link>
          </>
        )}
      </p>

      <h2 className="mt-6 mb-3 text-[1.5rem]">What is inside</h2>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {cards.map((c) => (
          <li key={c.id} className="card flex items-center gap-4 p-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: c.tint }}>
              <c.icon size={26} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[1.1rem]">{c.title}</h3>
              <p className="m-0 text-[0.95rem]">{c.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
