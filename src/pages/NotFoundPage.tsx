import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <main className="page text-center">
      <h1 className="text-[2rem]">We could not find that page</h1>
      <Link to="/" className="btn btn-primary mt-6">Back to Scan</Link>
    </main>
  )
}
