/**
 * HTTPS origins that open directly after a scan (no confirmation screen).
 * Any other HTTPS destination shows a confirmation screen first.
 * Use exact origins: scheme + host (+ port if not 443), no trailing slash.
 */
export const ALLOWED_HTTPS_ORIGINS: readonly string[] = [
  'https://ma-cards.example',
]
