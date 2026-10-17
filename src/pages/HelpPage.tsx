import { useState } from 'react'
import { CheckCircle2, HeartHandshake, MessageSquare, Smartphone, Wifi, HelpCircle } from 'lucide-react'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

const TOPICS = [
  { id: 'wifi', label: 'Set up Wi-Fi', icon: Wifi },
  { id: 'messages', label: 'Send messages', icon: MessageSquare },
  { id: 'apps', label: 'Use apps', icon: Smartphone },
  { id: 'other', label: 'Something else', icon: HelpCircle },
] as const

const TRUSTED = 'Contact a trusted person'

type Step = 'topic' | 'note' | 'review' | 'done'

export default function HelpPage() {
  useDocumentTitle('Help')
  const [step, setStep] = useState<Step>('topic')
  const [topic, setTopic] = useState('')
  const [note, setNote] = useState('')

  const choose = (label: string) => {
    setTopic(label)
    setStep('note')
  }
  const restart = () => {
    setTopic('')
    setNote('')
    setStep('topic')
  }

  return (
    <main className="page">
      {step === 'topic' && (
        <>
          <h1 className="text-[2.1rem]">What do you need help with?</h1>
          <ul className="m-0 mt-6 grid list-none grid-cols-2 gap-3 p-0">
            {TOPICS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => choose(label)}
                  className="card flex min-h-[132px] w-full cursor-pointer flex-col items-center justify-center gap-3 p-4 text-center font-bold text-teal"
                  style={{ font: 'inherit', fontWeight: 700 }}
                >
                  <Icon size={34} aria-hidden="true" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-dark mt-4 w-full" style={{ minHeight: 68 }} onClick={() => choose(TRUSTED)}>
            <HeartHandshake size={24} aria-hidden="true" /> {TRUSTED}
          </button>
          <p className="mt-6 text-[0.95rem] text-teal-soft">
            This is a demo. Requests are not sent to anyone.
          </p>
        </>
      )}

      {step === 'note' && (
        <>
          <h1 className="text-[2rem]">{topic}</h1>
          <label htmlFor="note" className="mt-6 mb-2 block font-bold">
            Anything you want to add? <span className="font-normal">(optional)</span>
          </label>
          <textarea
            id="note"
            className="field"
            rows={5}
            maxLength={300}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="For example: my phone does not find my Wi-Fi."
          />
          <div className="mt-6 flex flex-col gap-3">
            <button type="button" className="btn btn-primary" onClick={() => setStep('review')}>
              Review request
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setStep('topic')}>
              Back
            </button>
          </div>
        </>
      )}

      {step === 'review' && (
        <>
          <h1 className="text-[2rem]">Review your request</h1>
          <dl className="card mt-6 p-5">
            <dt className="text-[0.95rem] text-teal-soft">Topic</dt>
            <dd className="m-0 mb-4 font-bold">{topic}</dd>
            <dt className="text-[0.95rem] text-teal-soft">Your note</dt>
            <dd className="m-0 whitespace-pre-wrap break-words">{note.trim() || 'No note added.'}</dd>
          </dl>
          <p className="mt-4 text-[0.95rem]">In this demo, no message is actually sent.</p>
          <div className="mt-4 flex flex-col gap-3">
            <button type="button" className="btn btn-primary" onClick={() => setStep('done')}>
              Confirm request
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setStep('note')}>
              Back
            </button>
          </div>
        </>
      )}

      {step === 'done' && (
        <section className="mt-6 text-center" role="status">
          <CheckCircle2 size={56} className="mx-auto" aria-hidden="true" />
          <h1 className="mt-4 text-[2rem]">Request recorded</h1>
          <p className="mt-3 text-[1.1rem] font-bold">In this demo, no message is actually sent.</p>
          <p className="mt-2">Nobody has been contacted about “{topic}”.</p>
          <button type="button" className="btn btn-primary mt-6 w-full" onClick={restart}>
            Back to Help
          </button>
        </section>
      )}
    </main>
  )
}
