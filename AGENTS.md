# AGENTS.md — Mã (Matilde)

Project-level instructions. Keep these decisions in future sessions.

## Product
- Startup concept: physical QR-code cards that help older adults use their own
  smartphone. **One physical card = one smartphone action.**
- Mobile website / PWA, not a native iOS app. No App Store.
- Physical cards are the primary interface. The Scan home screen must NOT show
  task buttons (reminders, calls, photos, …) and must not become a launcher.
- UI language: **English**.

## Hard constraints
- No backend, no login/accounts, no database, no real payments, no real message
  delivery, no NFC. Never send personal data to external services.
- Do not add a global state library; React Context is enough.
- No service-worker caching unless clearly useful and safe.

## Brand and design
- Name: **Mã** (Matilde), pronounced “Ma”.
- Colors: cream `#F8F5EC`, sage `#A8B9A0`, dark teal `#173F3A`, surface
  `#FFFDF7`, line `#E2DCCA`. Never put sage text on cream.
- Fonts: Fraunces (headings), Atkinson Hyperlegible (body), via @fontsource.
- Body text about 19px, touch targets at least 56×56px, 24px card radius,
  visible focus states, safe-area aware bottom navigation.
- Warm, calm, editorial. Not a SaaS dashboard, not medical.

## Routing (HashRouter, for GitHub Pages)
`/` Scan · `/cards` · `/help` · `/shop` · `/shop/:bundleId` · `/cart` ·
`/checkout` (no bottom nav) · `/order-confirmation`.

## QR validation and security
- All parsing lives in `src/lib/qr-action.ts` (pure, no DOM, no navigation).
- Use the URL API; never string-prefix checks.
- Accept `shortcuts://run-shortcut?name=…`; rebuild the URL from the validated
  name only.
- HTTPS: exact origin allowlist in `src/config/allowlist.ts` opens directly;
  others need a confirmation screen. Reject HTTP, `javascript:`, `data:`,
  `tel:`, other schemes, credentials in URLs and plain text.
- Never evaluate or execute scanned content.
- First decode stops the scanner; ignore further results.

## iPhone Shortcut limitations
- iOS may block custom URL schemes when not triggered by a tap. The app attempts
  `window.location.href`, shows “Opening shortcut…”, and after about 2 seconds
  without the page being backgrounded shows a failure with a **Try again** tap.
- Never show a success state for a launch attempt. Test on a real iPhone.

## PWA
- Manifest (`public/manifest.webmanifest`), `apple-touch-icon.png`, Apple
  meta tags, `viewport-fit=cover`. Must be installable via Safari → Add to Home
  Screen over HTTPS.

## Conventions and commands
- React + TypeScript + Vite + Tailwind v4 + Lucide.
- `npm test` (Vitest), `npm run typecheck`, `npm run build`, `npm run dev`.
- Keep components simple; no new dependencies without a reason.
