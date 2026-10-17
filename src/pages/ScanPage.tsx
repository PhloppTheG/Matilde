import { useCallback, useEffect, useRef, useState } from 'react'
import { AlertTriangle, ExternalLink, Loader2, ScanLine, ShieldQuestion } from 'lucide-react'
import { ScannerOverlay } from '../components/ScannerOverlay'
import { ScanHero, Wordmark } from '../components/Illustrations'
import { parseQrContent, type RejectReason } from '../lib/qr-action'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type View =
  | { k: 'idle' }
  | { k: 'scanning' }
  | { k: 'opening'; url: string }
  | { k: 'failed'; url: string }
  | { k: 'returned'; url: string }
  | { k: 'opening-link'; host: string }
  | { k: 'confirm'; url: string; host: string }
  | { k: 'rejected'; reason: RejectReason }

const FAIL_AFTER_MS = 2000

const REJECT_TEXT: Record<RejectReason, string> = {
  insecure: 'This link is not secure, so Mã will not open it.',
  unsupported: 'This card was not recognised.',
  invalid: 'This card was not recognised.',
}

export default function ScanPage() {
  useDocumentTitle('')
  const [view, setView] = useState<View>({ k: 'idle' })
  const timerRef = useRef<number | null>(null)
  const attemptingRef = useRef(false)
  const leftPageRef = useRef(false)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Try to launch a Shortcut. Guarded so one scan can never launch twice.
  const launchShortcut = useCallback((url: string) => {
    if (attemptingRef.current) return
    attemptingRef.current = true
    leftPageRef.current = false
    setView({ k: 'opening', url })
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      attemptingRef.current = false
      // Still on screen and we never left the page: the launch did not happen.
      if (!leftPageRef.current && document.visibilityState === 'visible') {
        setView({ k: 'failed', url })
      }
    }, FAIL_AFTER_MS)
    window.location.href = url
  }, [])

  // Detect that the page was backgrounded (Shortcuts/another app took over).
  useEffect(() => {
    const onHide = () => {
      if (attemptingRef.current) {
        leftPageRef.current = true
        clearTimer()
        attemptingRef.current = false
        setView((v) => (v.k === 'opening' ? { k: 'returned', url: v.url } : v))
      }
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', onHide)
      clearTimer()
    }
  }, [])

  const handleResult = useCallback(
    (text: string) => {
      const action = parseQrContent(text)
      switch (action.kind) {
        case 'shortcut':
          launchShortcut(action.url)
          break
        case 'open-https':
          setView({ k: 'opening-link', host: action.host })
          window.location.assign(action.url)
          break
        case 'confirm-https':
          setView({ k: 'confirm', url: action.url, host: action.host })
          break
        case 'rejected':
          setView({ k: 'rejected', reason: action.reason })
          break
      }
    },
    [launchShortcut],
  )

  const startScan = () => setView({ k: 'scanning' })
  const reset = () => {
    clearTimer()
    attemptingRef.current = false
    setView({ k: 'idle' })
  }

  const showHome = view.k === 'idle' || view.k === 'scanning'

  return (
    <main className="page">
      <header className="text-center">
        <Wordmark className="text-[2.4rem] text-teal" />
      </header>

      {showHome && (
        <section className="mt-2 text-center">
          <ScanHero className="mx-auto block h-auto w-full max-w-[340px]" />
          <h1 className="mt-4 text-[2rem]">One card. One tap.</h1>
          <p className="mx-auto mt-3 mb-7 max-w-[22rem] text-[1.1rem]">
            Scan a card to open the right tool on your phone.
          </p>
          <button type="button" onClick={startScan} className="btn btn-primary w-full" style={{ minHeight: 68, fontSize: '1.25rem' }}>
            <ScanLine size={26} aria-hidden="true" /> Scan a card
          </button>
          <p className="mx-auto mt-5 max-w-[22rem] text-[0.95rem] text-teal-soft">
            Your camera only turns on after you tap the button.
          </p>
        </section>
      )}

      {view.k === 'scanning' && <ScannerOverlay onResult={handleResult} onClose={reset} />}

      {view.k === 'opening' && (
        <StatusPanel icon={<Loader2 size={40} className="animate-spin" aria-hidden="true" />} title="Opening shortcut…">
          <p className="m-0">If your iPhone asks, tap “Allow” or “Open”.</p>
        </StatusPanel>
      )}

      {view.k === 'failed' && (
        <StatusPanel icon={<AlertTriangle size={40} aria-hidden="true" />} title="The shortcut could not be opened">
          <p className="m-0">
            Make sure this shortcut is set up on this iPhone, then try again.
          </p>
          <Actions>
            <button type="button" className="btn btn-primary" onClick={() => launchShortcut(view.url)}>
              Try again
            </button>
            <button type="button" className="btn btn-ghost" onClick={startScan}>
              Scan another card
            </button>
          </Actions>
        </StatusPanel>
      )}

      {view.k === 'returned' && (
        <StatusPanel icon={<ScanLine size={40} aria-hidden="true" />} title="Welcome back">
          <p className="m-0">Mã cannot tell whether the shortcut finished. You can run it again or scan another card.</p>
          <Actions>
            <button type="button" className="btn btn-primary" onClick={() => launchShortcut(view.url)}>
              Try again
            </button>
            <button type="button" className="btn btn-ghost" onClick={startScan}>
              Scan another card
            </button>
          </Actions>
        </StatusPanel>
      )}

      {view.k === 'opening-link' && (
        <StatusPanel icon={<Loader2 size={40} className="animate-spin" aria-hidden="true" />} title="Opening link…">
          <p className="m-0">{view.host}</p>
          <Actions>
            <button type="button" className="btn btn-ghost" onClick={reset}>Back</button>
          </Actions>
        </StatusPanel>
      )}

      {view.k === 'confirm' && (
        <StatusPanel icon={<ShieldQuestion size={40} aria-hidden="true" />} title="Open this link?">
          <p className="m-0">This card points to a website Mã does not know yet:</p>
          <p className="my-3 break-all font-bold">{view.host}</p>
          <Actions>
            <a href={view.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <ExternalLink size={20} aria-hidden="true" /> Open link
            </a>
            <button type="button" className="btn btn-ghost" onClick={reset}>Cancel</button>
          </Actions>
        </StatusPanel>
      )}

      {view.k === 'rejected' && (
        <StatusPanel icon={<AlertTriangle size={40} aria-hidden="true" />} title={REJECT_TEXT[view.reason]}>
          <p className="m-0">Nothing was opened.</p>
          <Actions>
            <button type="button" className="btn btn-primary" onClick={startScan}>Scan again</button>
            <button type="button" className="btn btn-ghost" onClick={reset}>Back</button>
          </Actions>
        </StatusPanel>
      )}
    </main>
  )
}

function StatusPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="card mt-8 p-6 text-center" role="status" aria-live="polite">
      <div className="mb-3 flex justify-center text-teal">{icon}</div>
      <h1 className="mb-3 text-[1.6rem]">{title}</h1>
      {children}
    </section>
  )
}

function Actions({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex flex-col gap-3">{children}</div>
}
