import { useEffect, useRef, useState } from 'react'
import { CameraOff, X } from 'lucide-react'

interface Props {
  /** Called exactly once with the first decoded QR text. */
  onResult: (text: string) => void
  onClose: () => void
}

type State =
  | { kind: 'starting' }
  | { kind: 'scanning' }
  | { kind: 'error'; message: string }

function describeError(e: unknown): string {
  const text = e instanceof Error ? `${e.name} ${e.message}` : String(e)
  if (/NotAllowed|Permission|denied/i.test(text)) {
    return 'Camera access was blocked. Allow the camera for this page in your browser or iPhone settings, then try again.'
  }
  if (/NotFound|Camera not found|DevicesNotFound/i.test(text)) {
    return 'No camera was found on this device.'
  }
  if (/NotReadable|TrackStart|in use/i.test(text)) {
    return 'The camera is busy. Close other apps that use the camera and try again.'
  }
  return 'The camera could not be started.'
}

export function ScannerOverlay({ onResult, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onResultRef = useRef(onResult)
  const onCloseRef = useRef(onClose)
  const [state, setState] = useState<State>({ kind: 'starting' })

  useEffect(() => {
    onResultRef.current = onResult
    onCloseRef.current = onClose
  })

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    let cancelled = false
    let handled = false
    let scanner: { stop: () => void; destroy: () => void; start: () => Promise<void> } | null = null

    async function start() {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setState({
          kind: 'error',
          message:
            'Camera scanning needs a secure (HTTPS) page and a browser that supports the camera. Open this app in Safari on your iPhone.',
        })
        return
      }
      try {
        // Loaded only when the user taps "Scan a card".
        const { default: QrScanner } = await import('qr-scanner')
        if (cancelled) return
        if (!(await QrScanner.hasCamera())) {
          if (!cancelled) setState({ kind: 'error', message: 'No camera was found on this device.' })
          return
        }
        const video = videoRef.current
        if (!video || cancelled) return

        const instance = new QrScanner(
          video,
          (result) => {
            if (handled) return // ignore further decodes
            handled = true
            instance.stop()
            onResultRef.current(result.data)
          },
          {
            preferredCamera: 'environment',
            returnDetailedScanResult: true,
            maxScansPerSecond: 10,
            highlightScanRegion: false,
            highlightCodeOutline: false,
          },
        )
        scanner = instance
        await instance.start()
        if (!cancelled) setState({ kind: 'scanning' })
      } catch (e) {
        if (!cancelled) setState({ kind: 'error', message: describeError(e) })
      }
    }

    start()

    return () => {
      cancelled = true
      // Stops the stream and releases the camera.
      scanner?.stop()
      scanner?.destroy()
      scanner = null
    }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Scan a card"
      className="fixed inset-0 z-50 bg-black text-cream"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        aria-hidden="true"
      />

      {state.kind !== 'error' && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="aspect-square w-[72vw] max-w-[340px] rounded-[28px] border-4 border-cream"
            style={{ boxShadow: '0 0 0 100vmax rgba(0,0,0,0.5)' }}
          />
        </div>
      )}

      <div
        className="absolute inset-x-0 top-0 px-6 text-center"
        style={{ paddingTop: 'calc(1.5rem + env(safe-area-inset-top))' }}
      >
        {state.kind === 'error' ? null : (
          <p
            className="m-0 inline-block rounded-2xl bg-black/60 px-4 py-2 text-[1.15rem] font-bold"
            aria-live="polite"
          >
            {state.kind === 'starting' ? 'Starting camera…' : 'Hold your camera over the QR code.'}
          </p>
        )}
      </div>

      {state.kind === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
          <CameraOff size={48} aria-hidden="true" />
          <h2 className="text-[1.6rem]">Camera not available</h2>
          <p role="alert" className="m-0 max-w-sm">
            {state.message}
          </p>
        </div>
      )}

      <div
        className="absolute inset-x-0 bottom-0 flex justify-center px-6"
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="btn w-full max-w-sm bg-cream text-teal"
          style={{ minHeight: 64, fontSize: '1.2rem' }}
        >
          <X size={24} aria-hidden="true" /> Close
        </button>
      </div>
    </div>
  )
}
