import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error?.message || 'Unknown error'

  return (
    <div className="absolute inset-0 grid place-items-center text-center">
      <div>
        <h2 className="text-xl font-bold text-white">문제가 발생했어요</h2>

        <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap max-h-40 overflow-auto">
          {message}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => window.location.reload()}
            className="h-10 rounded-xl bg-primary-600 text-white w-full"
          >
            새로고침
          </button>
          <Link
            to="/"
            className="h-10 px-9 rounded-xl bg-white/10 text-white border border-white/10 grid place-items-center w-full"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}
