import { useState } from 'react'
import { HiOutlineMail } from 'react-icons/hi'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { RiLock2Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

import { useLoginMutation } from '@/hooks/queries/auth'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true) // 로그인 유지 체크
  const navigate = useNavigate()

  const login = useLoginMutation()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const loginId = id
      await login.mutateAsync({ loginId, password })
      localStorage.setItem('remember', remember ? '1' : '0')
      navigate('/', { replace: true })
    } catch (e) {
      // TODO: 에러 표시
      console.error(e)
    }
  }

  return (
    <div className="py-3">
      {/* Main */}

      <header className="mb-8 rounded-3xl bg-slate-700/40 border border-white/10 p-6 shadow-lg">
        <p className="text-sm uppercase tracking-widest text-primary-500">
          ParkinCare
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">
          파킨케어에 오신 것을 환영합니다!
        </h1>
        <p className="mt-1 text-sm text-white-500">
          어디서든 파킨슨병 경과를 진단하고 관리하세요.
        </p>
      </header>

      <main className="flex-1 px-3 flex flex-col justify-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="mt-2 text-sm text-white-500">
          서비스를 이용하시려면 로그인이 필요합니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-2 text-white-500"
            >
              아이디
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white-600">
                <HiOutlineMail className="w-5 h-5" />
              </span>
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="yourID"
                className="w-full rounded-xl bg-black-700 border border-white/10 pl-10 pr-3 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-2 text-white-500"
            >
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white-600">
                <RiLock2Line className="w-5 h-5" />
              </span>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-black-700 border border-white/10 pl-10 pr-10 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 placeholder:text-white/30"
              />
              <button
                type="button"
                aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                onClick={() => setShowPw(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white-600 hover:text-white-400"
              >
                {showPw ? (
                  <IoEyeOffOutline className="w-5 h-5" />
                ) : (
                  <IoEyeOutline className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 select-none">
              <input
                type="checkbox"
                className="size-4 rounded border-white/20 bg-black-700 text-primary-500 focus:ring-primary-500/30"
              />
              <span className="text-white-500">로그인 상태 유지</span>
            </label>
            <button
              type="button"
              onClick={() => {
                navigate('/auth/signup')
              }}
              className="text-white-500 text-sm underline underline-offset-4"
            >
              회원가입 하기
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={login.isPending}
            className="mt-3 w-full py-4 rounded-xl bg-primary-500 text-black font-medium text-base disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {login.isPending ? '로그인 중…' : '로그인'}
          </button>

          <p className="text-xs text-white-500 mt-6">
            로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하는 것으로
            간주됩니다.
          </p>
        </form>
      </main>
    </div>
  )
}
