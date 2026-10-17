import { Link, Navigate } from 'react-router-dom'
import { PackageCheck } from 'lucide-react'
import { formatPrice } from '../data/bundles'
import { readJson } from '../lib/storage'
import { ORDER_KEY, type DemoOrder } from './CheckoutPage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function OrderConfirmationPage() {
  useDocumentTitle('Order confirmed')
  const order = readJson<DemoOrder | null>(ORDER_KEY, null)

  if (!order || !Array.isArray(order.lines)) return <Navigate to="/shop" replace />

  return (
    <main className="page text-center">
      <PackageCheck size={56} className="mx-auto" aria-hidden="true" />
      <h1 className="mt-4 text-[2.1rem]">Your demo order is confirmed</h1>

      <ul className="card m-0 mt-6 list-none p-5 text-left">
        {order.lines.map((l) => (
          <li key={l.name} className="flex justify-between gap-3 py-1">
            <span>{l.quantity} × {l.name}</span>
            <span>{formatPrice(l.lineCents)}</span>
          </li>
        ))}
        <li className="mt-2 flex justify-between border-t border-line pt-3 text-[1.25rem] font-bold">
          <span>Total</span>
          <span>{formatPrice(order.totalCents)}</span>
        </li>
      </ul>

      <p className="mt-5 font-bold">This was a demo. No payment was made and nothing will be shipped.</p>

      <div className="mt-6 flex flex-col gap-3">
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
        <Link to="/" className="btn btn-ghost">Back to Scan</Link>
      </div>
    </main>
  )
}
