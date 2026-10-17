export interface Bundle {
  id: string
  name: string
  short: string
  audience: string
  priceCents: number
  cardIds: string[]
  accent: string
}

// Demo content: illustrative prices and quantities, not final decisions.
export const BUNDLES: Bundle[] = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    short: 'The first cards for learning your phone.',
    audience:
      'For anyone who is new to a smartphone and wants a calm, simple start.',
    priceCents: 2400,
    cardIds: ['reminders', 'call', 'message', 'weather', 'help'],
    accent: '#a8b9a0',
  },
  {
    id: 'staying-in-touch',
    name: 'Staying in Touch',
    short: 'Calls, messages and photos with loved ones.',
    audience:
      'For people who want to stay close to family and friends without fuss.',
    priceCents: 2200,
    cardIds: ['call', 'message', 'video', 'photos'],
    accent: '#e6b9a0',
  },
  {
    id: 'safe-every-day',
    name: 'Safe Every Day',
    short: 'Support for confusing or risky moments.',
    audience:
      'For anyone who wants quick help with emergencies and suspicious messages.',
    priceCents: 1900,
    cardIds: ['emergency', 'scam', 'help', 'call'],
    accent: '#ecdca2',
  },
  {
    id: 'my-everyday',
    name: 'My Everyday',
    short: 'Useful little helpers for each day.',
    audience:
      'For confident beginners who want handy shortcuts for daily routines.',
    priceCents: 2900,
    cardIds: ['reminders', 'weather', 'place', 'photos', 'message', 'call'],
    accent: '#a9c1c9',
  },
]

export const getBundle = (id: string | undefined) =>
  BUNDLES.find((b) => b.id === id)

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(
    cents / 100,
  )
