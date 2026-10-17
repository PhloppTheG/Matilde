import { useEffect } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { BottomNavigation } from './components/BottomNavigation'
import ScanPage from './pages/ScanPage'
import CardsPage from './pages/CardsPage'
import HelpPage from './pages/HelpPage'
import ShopPage from './pages/ShopPage'
import BundlePage from './pages/BundlePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import NotFoundPage from './pages/NotFoundPage'

function Shell() {
  const { pathname } = useLocation()
  // Keep the checkout focused: no bottom navigation over the form.
  const hideNav = pathname === '/checkout'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <Routes>
        <Route path="/" element={<ScanPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:bundleId" element={<BundlePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {!hideNav && <BottomNavigation />}
    </>
  )
}

// HashRouter: routes like /#/cards work on GitHub Pages under any repo
// name and survive a reload, without server-side rewrites.
export default function App() {
  return (
    <HashRouter>
      <CartProvider>
        <Shell />
      </CartProvider>
    </HashRouter>
  )
}
