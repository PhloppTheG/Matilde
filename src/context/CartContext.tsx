import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { BUNDLES, getBundle } from '../data/bundles'
import { readJson, writeJson } from '../lib/storage'

export interface CartItem {
  bundleId: string
  quantity: number
}

interface CartValue {
  items: CartItem[]
  count: number
  subtotalCents: number
  add: (bundleId: string) => void
  setQuantity: (bundleId: string, quantity: number) => void
  remove: (bundleId: string) => void
  clear: () => void
}

const KEY = 'ma.cart.v1'
const CartContext = createContext<CartValue | null>(null)

function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter(
      (i): i is CartItem =>
        !!i &&
        typeof i.bundleId === 'string' &&
        Number.isInteger(i.quantity) &&
        i.quantity > 0 &&
        BUNDLES.some((b) => b.id === i.bundleId),
    )
    .map((i) => ({ bundleId: i.bundleId, quantity: Math.min(i.quantity, 99) }))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    sanitize(readJson<unknown>(KEY, [])),
  )

  useEffect(() => writeJson(KEY, items), [items])

  const add = useCallback((bundleId: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.bundleId === bundleId)
      if (found) {
        return prev.map((i) =>
          i.bundleId === bundleId
            ? { ...i, quantity: Math.min(i.quantity + 1, 99) }
            : i,
        )
      }
      return [...prev, { bundleId, quantity: 1 }]
    })
  }, [])

  const setQuantity = useCallback((bundleId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.bundleId !== bundleId)
        : prev.map((i) =>
            i.bundleId === bundleId
              ? { ...i, quantity: Math.min(quantity, 99) }
              : i,
          ),
    )
  }, [])

  const remove = useCallback(
    (bundleId: string) =>
      setItems((prev) => prev.filter((i) => i.bundleId !== bundleId)),
    [],
  )
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0)
    const subtotalCents = items.reduce(
      (sum, i) => sum + (getBundle(i.bundleId)?.priceCents ?? 0) * i.quantity,
      0,
    )
    return { items, count, subtotalCents, add, setQuantity, remove, clear }
  }, [items, add, setQuantity, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
