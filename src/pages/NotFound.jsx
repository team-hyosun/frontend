import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <>
      <div className="fixed inset-0 grid place-items-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-white">
            페이지를 찾을 수 없어요 (404)
          </h2>
          <p className="mt-2 text-sm text-slate-300 whitespace-pre-wrap">
            주소를 다시 확인해 주세요.
          </p>
          <Link
            to="/"
            className="mt-6 h-10 px-6 rounded-xl bg-primary-500 text-white grid place-items-center"
          >
            홈으로
          </Link>
        </div>
      </div>
    </>
  )
}
