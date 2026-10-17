# Mã (Matilde) — QR card prototype

One physical card = one smartphone action. A mobile website / PWA (not a native
app). No backend, no login, no real payments.

## Run locally

```bash
npm install
npm run dev        # dev server (also reachable on your network)
npm test           # unit tests for the QR parser
npm run typecheck
npm run build      # type check + production build in dist/
npm run preview
```

Note: the camera only works on `https://` pages (or `localhost`). To test the
scanner on a phone, use the GitHub Pages URL below.

## Publish on GitHub Pages (HTTPS)

1. Create a new GitHub repository and push this project to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
2. In the repository open **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` runs tests, builds and
   deploys. When it is green, your site is at
   `https://<user>.github.io/<repo>/`.

The app uses relative asset paths and a hash-based router
(`/#/cards`, `/#/shop`, …), so it works under any repository name and
reloads on any route.

## Add to the iPhone Home Screen

1. Open the GitHub Pages URL in **Safari**.
2. Tap the **Share** button, then **Add to Home Screen**.
3. Keep the name “Mã” and tap **Add**.
4. Open the app from the Home Screen icon. It runs full screen.

After installing, allow the camera when you tap **Scan a card** for the first
time. If you tapped “Don’t Allow”, re-enable the camera under
**Settings → Safari → Camera** (and for the Home Screen app, remove and re-add it
if iOS does not ask again).

## iPhone Shortcuts

Create each Shortcut in the Shortcuts app with an exact name, e.g.
`Open Reminders`. Encode this URL in the card’s QR code:

```
shortcuts://run-shortcut?name=Open%20Reminders
```

Names must match exactly (case and spaces).

## Must be tested on a real iPhone

- Camera permission and the live preview in Safari **and** in the Home Screen app.
- Whether `shortcuts://` opens after a scan. iOS may ask for confirmation, or
  block the launch when it is not triggered by a tap. The app then shows
  “The shortcut could not be opened” and a **Try again** button (a tap, which iOS
  accepts more reliably).
- Mã cannot detect that a Shortcut succeeded. It never shows a success message
  for a launch.

## HTTPS links on cards

Edit `src/config/allowlist.ts` to list HTTPS origins that open directly. All
other HTTPS links ask for confirmation first. HTTP and other schemes are rejected.

## Limitations

- Demo data only: prices, bundles, orders and help requests are not sent
  anywhere.
- No service worker / offline mode.
- Illustrations are original SVGs; the QR patterns on them are decorative.
- Dependencies were not installed or built in the environment where this code
  was written. Run `npm install && npm test && npm run build` first and fix
  anything the checks report.
