import { NavLink } from 'react-router-dom'
import { HelpCircle, LayoutGrid, ScanLine, ShoppingBag } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Scan', icon: ScanLine, end: true },
  { to: '/cards', label: 'My Cards', icon: LayoutGrid, end: false },
  { to: '/help', label: 'Help', icon: HelpCircle, end: false },
  { to: '/shop', label: 'Shop', icon: ShoppingBag, end: false },
]

export function BottomNavigation() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="mx-auto m-0 flex max-w-[560px] list-none p-0">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex min-h-[64px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[0.8rem] font-bold no-underline ${
                  isActive ? 'text-teal' : 'text-teal-soft'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-8 w-14 items-center justify-center rounded-full ${
                      isActive ? 'bg-sage' : ''
                    }`}
                  >
                    <Icon size={24} strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
