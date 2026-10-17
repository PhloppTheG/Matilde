import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { formatPrice, getBundle } from '../data/bundles'
import { useCart } from '../context/CartContext'
import { writeJson } from '../lib/storage'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export const ORDER_KEY = 'ma.lastOrder.v1'

export interface DemoOrder {
  createdAt: string
  lines: { name: string; quantity: number; lineCents: number }[]
  totalCents: number
}

type Field = 'name' | 'street' | 'postal' | 'city' | 'email'
type Values = Record<Field, string>
type Errors = Partial<Record<Field, string>>

function validate(v: Values): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please enter your full name.'
  if (!v.street.trim()) e.street = 'Please enter your street and house number.'
  if (!/^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(v.postal.trim())) e.postal = 'Please enter a valid postal code.'
  if (!v.city.trim()) e.city = 'Please enter your city.'
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address or leave it empty.'
  return e
}

export default function CheckoutPage() {
  useDocumentTitle('Checkout')
  const { items, subtotalCents, clear } = useCart()
  const navigate = useNavigate()
  const [values, setValues] = useState<Values>({ name: '', street: '', postal: '', city: '', email: '' })
  const [errors, setErrors] = useState<Errors>({})

  if (items.length === 0) {
    return (
      <main className="page page-focused text-center">
        <h1 className="text-[2rem]">Your cart is empty</h1>
        <Link to="/shop" className="btn btn-primary mt-6">Go to Shop</Link>
      </main>
    )
  }

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [f]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    // Address data stays in this form and is never stored or sent anywhere.
    const order: DemoOrder = {
      createdAt: new Date().toISOString(),
      totalCents: subtotalCents,
      lines: items.flatMap((i) => {
        const b = getBundle(i.bundleId)
        return b ? [{ name: b.name, quantity: i.quantity, lineCents: b.priceCents * i.quantity }] : []
      }),
    }
    writeJson(ORDER_KEY, order)
    navigate('/order-confirmation')
    clear()
  }

  const input = (f: Field, label: string, opts: { type?: string; autoComplete: string; inputMode?: 'text' | 'numeric' | 'email'; optional?: boolean }) => (
    <div className="mb-4">
      <label htmlFor={`f-${f}`} className="mb-1 block font-bold">
        {label} {opts.optional && <span className="font-normal">(optional)</span>}
      </label>
      <input
        id={`f-${f}`}
        className="field"
        type={opts.type ?? 'text'}
        inputMode={opts.inputMode}
        autoComplete={opts.autoComplete}
        value={values[f]}
        onChange={set(f)}
        aria-invalid={errors[f] ? true : undefined}
        aria-describedby={errors[f] ? `e-${f}` : undefined}
      />
      {errors[f] && (
        <p id={`e-${f}`} role="alert" className="mt-1 mb-0 font-bold text-alert">
          {errors[f]}
        </p>
      )}
    </div>
  )

  return (
    <main className="page page-focused">
      <Link to="/cart" className="btn btn-ghost mb-4">
        <ArrowLeft size={20} aria-hidden="true" /> Cart
      </Link>
      <h1 className="text-[2.1rem]">Checkout</h1>
      <p className="mt-3 inline-block rounded-full bg-butter px-4 py-1 font-bold">Demo — no real payment</p>

      <form onSubmit={submit} noValidate className="mt-5">
        {input('name', 'Full name', { autoComplete: 'name' })}
        {input('street', 'Street and house number', { autoComplete: 'street-address' })}
        {input('postal', 'Postal code', { autoComplete: 'postal-code', inputMode: 'numeric' })}
        {input('city', 'City', { autoComplete: 'address-level2' })}
        {input('email', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email', optional: true })}

        <div className="card my-5 p-5">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotalCents)}</span></div>
          <div className="mt-2 flex justify-between text-[1.3rem] font-bold"><span>Total</span><span>{formatPrice(subtotalCents)}</span></div>
        </div>
        <p className="mb-4 text-[0.95rem]">No card details are needed. Nothing you enter leaves this device.</p>
        <button type="submit" className="btn btn-primary w-full" style={{ minHeight: 68, fontSize: '1.2rem' }}>
          Place demo order
        </button>
      </form>
    </main>
  )
}
