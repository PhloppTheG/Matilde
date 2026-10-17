import {
  Bell,
  CloudSun,
  Image,
  LifeBuoy,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Video,
  type LucideIcon,
} from 'lucide-react'

export type CardCategory = 'Contact' | 'Everyday' | 'Safety'

export interface CardDef {
  id: string
  title: string
  description: string
  category: CardCategory
  icon: LucideIcon
  tint: string // CSS color for the physical card
}

export const CATEGORIES: CardCategory[] = ['Contact', 'Everyday', 'Safety']

const SAGE = '#a8b9a0'
const CLAY = '#e6b9a0'
const MIST = '#a9c1c9'
const BUTTER = '#ecdca2'

export const CARDS: CardDef[] = [
  { id: 'call', title: 'Call a Loved One', description: 'Start a phone call with someone close.', category: 'Contact', icon: Phone, tint: CLAY },
  { id: 'message', title: 'Send a Message', description: 'Write a short message to family or friends.', category: 'Contact', icon: MessageCircle, tint: CLAY },
  { id: 'video', title: 'Video Call', description: 'See and talk to someone face to face.', category: 'Contact', icon: Video, tint: CLAY },
  { id: 'reminders', title: 'Open Reminders', description: 'See what you have planned for today.', category: 'Everyday', icon: Bell, tint: SAGE },
  { id: 'weather', title: 'Check the Weather', description: 'Find out if you need a coat or an umbrella.', category: 'Everyday', icon: CloudSun, tint: MIST },
  { id: 'place', title: 'Find a Place', description: 'Look up an address and the way there.', category: 'Everyday', icon: MapPin, tint: SAGE },
  { id: 'photos', title: 'View Photos', description: 'Look at your favourite pictures.', category: 'Everyday', icon: Image, tint: BUTTER },
  { id: 'emergency', title: 'Emergency Contacts', description: 'Reach the people who matter in a hurry.', category: 'Safety', icon: ShieldAlert, tint: BUTTER },
  { id: 'scam', title: 'Scam Safety', description: 'Check a suspicious call or message.', category: 'Safety', icon: ShieldCheck, tint: BUTTER },
  { id: 'help', title: 'Get Help', description: 'Ask for support when you feel stuck.', category: 'Safety', icon: LifeBuoy, tint: BUTTER },
]

export const getCard = (id: string) => CARDS.find((c) => c.id === id)
