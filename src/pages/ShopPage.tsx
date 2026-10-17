import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { BUNDLES } from '../data/bundles'
import { ProductCard } from '../components/ProductCard'
import { useCart } from '../context/CartContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function CartLink() {
  const { count } = useCart()
  return (
    <Link
      to="/cart"
      className="btn btn-ghost relative"
      aria-label={count > 0 ? `Cart, ${count} ${count === 1 ? 'item' : 'items'}` : 'Cart, empty'}
    >
      <ShoppingCart size={22} aria-hidden="true" />
      {count > 0 && (
        <span className="absolute -top-2 -right-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-teal px-1.5 text-[0.85rem] font-bold text-cream">
          {count}
        </span>
      )}
    </Link>
  )
}

export default function ShopPage() {
  useDocumentTitle('Shop')
  return (
    <main className="page">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[2.2rem]">Shop</h1>
          <p className="mt-2 mb-6">Card bundles for your phone.</p>
        </div>
        <CartLink />
      </header>
      <div className="flex flex-col gap-5">
        {BUNDLES.map((b) => (
          <ProductCard key={b.id} bundle={b} />
        ))}
      </div>
      <p className="mt-6 text-[0.95rem] text-teal-soft">Demo prices. No real payment.</p>
    </main>
  )
}
