import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { formatPrice, getBundle } from '../data/bundles'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CartPage() {
  useDocumentTitle('Cart')
  const { items, subtotalCents, setQuantity, remove } = useCart()

  if (items.length === 0) {
    return (
      <main className="page text-center">
        <ShoppingBag size={48} className="mx-auto" aria-hidden="true" />
        <h1 className="mt-4 text-[2rem]">Your cart is empty</h1>
        <p className="mt-2">Pick a bundle of cards to get started.</p>
        <Link to="/shop" className="btn btn-primary mt-6">Go to Shop</Link>
      </main>
    )
  }

  return (
    <main className="page">
      <h1 className="text-[2.1rem]">Cart</h1>
      <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
        {items.map((item) => {
          const bundle = getBundle(item.bundleId)
          if (!bundle) return null
          return (
            <li key={item.bundleId} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[1.25rem]">{bundle.name}</h2>
                  <p className="m-0 text-[0.95rem]">{formatPrice(bundle.priceCents)} each</p>
                </div>
                <p className="m-0 font-bold">{formatPrice(bundle.priceCents * item.quantity)}</p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button type="button" className="btn btn-ghost" style={{ padding: 0, width: 56 }} aria-label={`Decrease quantity of ${bundle.name}`} onClick={() => setQuantity(item.bundleId, item.quantity - 1)}>
                    <Minus size={20} aria-hidden="true" />
                  </button>
                  <span className="min-w-8 text-center text-[1.2rem] font-bold" aria-live="polite">{item.quantity}</span>
                  <button type="button" className="btn btn-ghost" style={{ padding: 0, width: 56 }} aria-label={`Increase quantity of ${bundle.name}`} onClick={() => setQuantity(item.bundleId, item.quantity + 1)}>
                    <Plus size={20} aria-hidden="true" />
                  </button>
                </div>
                <button type="button" className="btn btn-ghost" onClick={() => remove(item.bundleId)} aria-label={`Remove ${bundle.name}`}>
                  <Trash2 size={20} aria-hidden="true" /> Remove
                </button>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="card mt-5 p-5">
        <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotalCents)}</span></div>
        <div className="mt-2 flex justify-between text-[1.3rem] font-bold"><span>Total</span><span>{formatPrice(subtotalCents)}</span></div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Link to="/checkout" className="btn btn-primary" style={{ minHeight: 68 }}>Continue to checkout</Link>
        <Link to="/shop" className="btn btn-ghost">Continue shopping</Link>
      </div>
    </main>
  )
}
