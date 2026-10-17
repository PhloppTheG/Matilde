import { useEffect } from 'react'

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Mã` : 'Mã — Cards that make your phone simple'
  }, [title])
}
