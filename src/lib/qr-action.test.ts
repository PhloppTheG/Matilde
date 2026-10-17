import { describe, expect, it } from 'vitest'
import { parseQrContent } from './qr-action'

const ALLOWED = ['https://ma-cards.example']

describe('shortcuts URLs', () => {
  it('accepts a valid shortcut URL', () => {
    expect(
      parseQrContent('shortcuts://run-shortcut?name=Open%20Reminders', ALLOWED),
    ).toEqual({
      kind: 'shortcut',
      name: 'Open Reminders',
      url: 'shortcuts://run-shortcut?name=Open%20Reminders',
    })
  })

  it('decodes and re-encodes special characters in the name', () => {
    const result = parseQrContent(
      'shortcuts://run-shortcut?name=Call%20M%C3%A3%20%26%20Family',
      ALLOWED,
    )
    expect(result).toEqual({
      kind: 'shortcut',
      name: 'Call Mã & Family',
      url: 'shortcuts://run-shortcut?name=Call%20M%C3%A3%20%26%20Family',
    })
  })

  it('treats + as a space-free literal only via URLSearchParams semantics', () => {
    const result = parseQrContent(
      'shortcuts://run-shortcut?name=Open+Reminders',
      ALLOWED,
    )
    expect(result.kind).toBe('shortcut')
  })

  it('drops extra parameters from the rebuilt URL', () => {
    const result = parseQrContent(
      'shortcuts://run-shortcut?name=Weather&input=text&text=evil',
      ALLOWED,
    )
    expect(result).toEqual({
      kind: 'shortcut',
      name: 'Weather',
      url: 'shortcuts://run-shortcut?name=Weather',
    })
  })

  it('trims surrounding whitespace', () => {
    expect(
      parseQrContent('  shortcuts://run-shortcut?name=Weather \n', ALLOWED).kind,
    ).toBe('shortcut')
  })

  it('rejects a missing or empty name', () => {
    expect(parseQrContent('shortcuts://run-shortcut', ALLOWED)).toEqual({
      kind: 'rejected',
      reason: 'invalid',
    })
    expect(parseQrContent('shortcuts://run-shortcut?name=', ALLOWED)).toEqual({
      kind: 'rejected',
      reason: 'invalid',
    })
  })

  it('rejects other shortcuts hosts', () => {
    expect(
      parseQrContent('shortcuts://create-shortcut?name=X', ALLOWED),
    ).toEqual({ kind: 'rejected', reason: 'unsupported' })
  })

  it('rejects over-long names and control characters', () => {
    const long = 'a'.repeat(101)
    expect(
      parseQrContent(`shortcuts://run-shortcut?name=${long}`, ALLOWED).kind,
    ).toBe('rejected')
    expect(
      parseQrContent('shortcuts://run-shortcut?name=A%00B', ALLOWED).kind,
    ).toBe('rejected')
  })

  it('rejects credentials in the URL', () => {
    expect(
      parseQrContent('shortcuts://user:pw@run-shortcut?name=X', ALLOWED).kind,
    ).toBe('rejected')
  })
})

describe('https URLs', () => {
  it('opens allowed origins directly', () => {
    expect(
      parseQrContent('https://ma-cards.example/card/1', ALLOWED),
    ).toEqual({
      kind: 'open-https',
      url: 'https://ma-cards.example/card/1',
      host: 'ma-cards.example',
    })
  })

  it('requires confirmation for unknown origins', () => {
    expect(parseQrContent('https://unknown.example/x', ALLOWED)).toEqual({
      kind: 'confirm-https',
      url: 'https://unknown.example/x',
      host: 'unknown.example',
    })
  })

  it('does not trust look-alike hosts', () => {
    expect(
      parseQrContent('https://ma-cards.example.evil.com/', ALLOWED).kind,
    ).toBe('confirm-https')
    expect(
      parseQrContent('https://evil.com/?https://ma-cards.example', ALLOWED).kind,
    ).toBe('confirm-https')
  })

  it('does not trust a different port or scheme on an allowed host', () => {
    expect(
      parseQrContent('https://ma-cards.example:8443/', ALLOWED).kind,
    ).toBe('confirm-https')
    expect(parseQrContent('http://ma-cards.example/', ALLOWED)).toEqual({
      kind: 'rejected',
      reason: 'insecure',
    })
  })

  it('rejects credentials embedded in https URLs', () => {
    expect(
      parseQrContent('https://ma-cards.example@evil.com/', ALLOWED).kind,
    ).toBe('rejected')
  })

  it('uses an empty allowlist when none matches', () => {
    expect(parseQrContent('https://ma-cards.example/', []).kind).toBe(
      'confirm-https',
    )
  })
})

describe('rejected content', () => {
  it('rejects plain http as insecure', () => {
    expect(parseQrContent('http://example.com', ALLOWED)).toEqual({
      kind: 'rejected',
      reason: 'insecure',
    })
  })

  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'tel:+4312345678',
    'mailto:a@b.com',
    'ftp://example.com/file',
    'file:///etc/passwd',
    'sms:+4312345678',
  ])('rejects unsupported scheme: %s', (input) => {
    expect(parseQrContent(input, ALLOWED)).toEqual({
      kind: 'rejected',
      reason: 'unsupported',
    })
  })

  it.each(['', '   ', 'hello world', 'Open Reminders', 'www.example.com', '://'])(
    'rejects arbitrary or malformed text: %j',
    (input) => {
      expect(parseQrContent(input, ALLOWED)).toEqual({
        kind: 'rejected',
        reason: 'invalid',
      })
    },
  )

  it('rejects overly long input', () => {
    expect(
      parseQrContent(`https://example.com/${'a'.repeat(3000)}`, ALLOWED),
    ).toEqual({ kind: 'rejected', reason: 'invalid' })
  })

  it('rejects non-string input safely', () => {
    expect(parseQrContent(undefined as unknown as string, ALLOWED).kind).toBe(
      'rejected',
    )
  })
})
