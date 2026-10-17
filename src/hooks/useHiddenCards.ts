import { useCallback, useEffect, useState } from 'react'
import { readJson, writeJson } from '../lib/storage'

const KEY = 'ma.hiddenCards.v1'

export function useHiddenCards() {
  const [hidden, setHidden] = useState<string[]>(() => {
    const raw = readJson<unknown>(KEY, [])
    return Array.isArray(raw) ? raw.filter((x) => typeof x === 'string') : []
  })

  useEffect(() => writeJson(KEY, hidden), [hidden])

  const toggle = useCallback(
    (id: string) =>
      setHidden((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      ),
    [],
  )
  const restoreAll = useCallback(() => setHidden([]), [])

  return { hidden, toggle, restoreAll }
}
