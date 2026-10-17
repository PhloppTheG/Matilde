import { ALLOWED_HTTPS_ORIGINS } from '../config/allowlist'

export type RejectReason = 'insecure' | 'unsupported' | 'invalid'

export type QrAction =
  | { kind: 'shortcut'; name: string; url: string }
  | { kind: 'open-https'; url: string; host: string }
  | { kind: 'confirm-https'; url: string; host: string }
  | { kind: 'rejected'; reason: RejectReason }

const MAX_LENGTH = 2048
const MAX_SHORTCUT_NAME = 100
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001F\u007F]/

const reject = (reason: RejectReason): QrAction => ({ kind: 'rejected', reason })

/**
 * Pure parser: turns raw QR text into a typed action.
 * Never touches the DOM and never navigates.
 */
export function parseQrContent(
  raw: string,
  allowedOrigins: readonly string[] = ALLOWED_HTTPS_ORIGINS,
): QrAction {
  const text = typeof raw === 'string' ? raw.trim() : ''
  if (!text || text.length > MAX_LENGTH || CONTROL_CHARS.test(text)) {
    return reject('invalid')
  }

  let url: URL
  try {
    url = new URL(text)
  } catch {
    return reject('invalid')
  }

  // Credentials in a URL are a classic spoofing trick.
  if (url.username || url.password) return reject('invalid')

  switch (url.protocol) {
    case 'shortcuts:':
      return parseShortcut(url)
    case 'https:':
      return parseHttps(url, allowedOrigins)
    case 'http:':
      return reject('insecure')
    default:
      return reject('unsupported')
  }
}

function parseShortcut(url: URL): QrAction {
  if (url.hostname !== 'run-shortcut') return reject('unsupported')
  const name = url.searchParams.get('name')?.trim() ?? ''
  if (
    !name ||
    name.length > MAX_SHORTCUT_NAME ||
    CONTROL_CHARS.test(name)
  ) {
    return reject('invalid')
  }
  // Rebuild the URL from validated parts only; drop any other parameters.
  return {
    kind: 'shortcut',
    name,
    url: `shortcuts://run-shortcut?name=${encodeURIComponent(name)}`,
  }
}

function parseHttps(url: URL, allowedOrigins: readonly string[]): QrAction {
  if (!url.hostname) return reject('invalid')
  const isAllowed = allowedOrigins.includes(url.origin)
  return {
    kind: isAllowed ? 'open-https' : 'confirm-https',
    url: url.href,
    host: url.hostname,
  }
}
