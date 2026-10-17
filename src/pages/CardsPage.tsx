import { Eye, EyeOff, RotateCcw } from 'lucide-react'
import { CARDS, CATEGORIES } from '../data/cards'
import { PhysicalCard } from '../components/PhysicalCard'
import { useHiddenCards } from '../hooks/useHiddenCards'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function CardsPage() {
  useDocumentTitle('My Cards')
  const { hidden, toggle, restoreAll } = useHiddenCards()

  return (
    <main className="page">
      <h1 className="text-[2.2rem]">My Cards</h1>
      <p className="mt-2 mb-6">
        Your collection of physical cards. To use a card, scan it.
      </p>

      {hidden.length > 0 && (
        <div className="card mb-6 flex items-center justify-between gap-3 p-4">
          <p className="m-0">
            {hidden.length} hidden {hidden.length === 1 ? 'card' : 'cards'}
          </p>
          <button type="button" className="btn btn-ghost" onClick={restoreAll}>
            <RotateCcw size={20} aria-hidden="true" /> Show all
          </button>
        </div>
      )}

      {CATEGORIES.map((category) => (
        <section key={category} className="mb-8" aria-labelledby={`cat-${category}`}>
          <h2 id={`cat-${category}`} className="mb-3 text-[1.5rem]">
            {category}
          </h2>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {CARDS.filter((c) => c.category === category).map((card) => {
              const isHidden = hidden.includes(card.id)
              return (
                <li key={card.id} className="card flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-4">
                    <PhysicalCard card={card} dimmed={isHidden} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[1.15rem]">{card.title}</h3>
                      <p className="m-0 mt-1 text-[0.95rem]">{card.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost self-start"
                    onClick={() => toggle(card.id)}
                    aria-pressed={isHidden}
                    aria-label={`${isHidden ? 'Show' : 'Hide'} ${card.title}`}
                  >
                    {isHidden ? <Eye size={20} aria-hidden="true" /> : <EyeOff size={20} aria-hidden="true" />}
                    {isHidden ? 'Show' : 'Hide'}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <p className="text-[0.95rem] text-teal-soft">
        Hiding a card only changes this list. Your physical card keeps working when you scan it.
      </p>
    </main>
  )
}
