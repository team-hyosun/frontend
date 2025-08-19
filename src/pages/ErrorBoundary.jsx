import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error?.message || 'Unknown error'

  // const tmessage =
  //   'testingtestingestingtestingtesting testingestingtestingtesting testingestingtestingtesting testingestingtestingtesting testingestingtestingtesting testingestingtesting testingtestingestingtestingtesting testingestingtestingtesting testingestingtestingtesting testingestingtestingtesting testingestingtestingtesting testingestingtesting'
  const btnBase =
    'h-10 w-full rounded-xl grid place-items-center text-sm font-medium leading-none'

  return (
    <div className="h-full grid place-items-center p-6 text-center">
      <div className="max-w-sm w-full -translate-y-10">
        <h2 className="text-xl font-bold text-white">문제가 발생했어요</h2>

        <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap max-h-40 overflow-auto">
          {message}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <button
            onClick={() => window.location.reload()}
            className={`${btnBase} appearance-none bg-primary-600 text-white`}
          >
            새로고침
          </button>
          <Link
            to="/"
            className={`${btnBase} bg-white/10 text-white border border-white/10`}
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  )
}
