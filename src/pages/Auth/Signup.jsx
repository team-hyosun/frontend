import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineMail } from 'react-icons/hi'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { RiCalendar2Line, RiLock2Line, RiUser3Line } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'

import { useSignupMutation } from '@/hooks/queries/auth'

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '',
    id: '',
    age: '', // string to keep controlled input; cast on submit
    gender: 'male', // 'male' | 'female'
    medication: 'yes', // 'yes' | 'no'
    password: '',
    confirmPw: '',
  })
  const [showPw, setShowPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const signupMutation = useSignupMutation()
  const navigate = useNavigate()

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const setField = (name, value) =>
    setForm(prev => ({ ...prev, [name]: value }))

  const valid =
    form.name &&
    form.id &&
    form.age &&
    form.gender &&
    form.medication &&
    form.password &&
    form.password === form.confirmPw

  const handleSubmit = async e => {
    e.preventDefault()
    if (!valid) return
    setIsLoading(true)
    try {
      const payload = {
        loginId: form.id,
        password: form.password,
        gender: form.gender.toUpperCase(), // 'male' → 'MALE', 'female' → 'FEMALE'
      }

      await signupMutation.mutateAsync(payload)
      localStorage.setItem('userName', form.name)
      toast.success('회원가입 성공! 로그인 페이지로 이동합니다.')

      // 회원가입 성공 후 로그인 페이지로 이동
      window.location.href = '/auth/login'
    } catch (error) {
      console.error('회원가입 실패:', error)
      toast.error('회원가입 실패! 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="">
      {/* Main */}
      <main className="flex-1 px-3 py-5 overflow-y-auto">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="mt-2 text-sm text-white-500">
          아래 정보를 입력해 계정을 생성해 주세요.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm mb-2 text-white-500">
              이름
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white-600">
                <RiUser3Line className="w-5 h-5" />
              </span>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full rounded-xl bg-black-700 border border-white/10 pl-10 pr-3 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* id */}
          <div>
            <label htmlFor="id" className="block text-sm mb-2 text-white-500">
              아이디
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white-600">
                <HiOutlineMail className="w-5 h-5" />
              </span>
              <input
                id="username"
                name="id"
                type="text"
                required
                autoComplete="username"
                value={form.id}
                onChange={handleChange}
                placeholder="yourId"
                className="w-full rounded-xl bg-black-700 border border-white/10 pl-10 pr-3 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm mb-2 text-white-500">
              나이 (만 세)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white-600">
                <RiCalendar2Line className="w-5 h-5" />
              </span>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                required
                value={form.age}
                onChange={handleChange}
                placeholder="예: 25"
                className="w-full rounded-xl bg-black-700 border border-white/10 pl-10 pr-3 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Gender - pill group */}
          <div>
            <label className="block text-sm mb-2 text-white-500">성별</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'male', label: '남성' },
                { key: 'female', label: '여성' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setField('gender', opt.key)}
                  aria-pressed={form.gender === opt.key}
                  className={`py-3 rounded-xl border transition-all text-sm ${
                    form.gender === opt.key
                      ? 'bg-primary-500 text-black border-transparent shadow'
                      : 'bg-black-700 text-white border-black-500 hover:bg-black-700/80'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {!form.gender && (
              <p className="mt-2 text-xs text-white/50">
                한 가지를 선택하세요.
              </p>
            )}
          </div>

          {/* Medication - pill group */}
          <div>
            <label className="block text-sm mb-2 text-white-500">
              현재 복용 중인 약
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'yes', label: '예' },
                { key: 'no', label: '아니오' },
              ].map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setField('medication', opt.key)}
                  aria-pressed={form.medication === opt.key}
                  className={`py-3 rounded-xl border transition-all text-sm ${
                    form.medication === opt.key
                      ? 'bg-primary-500 text-black border-transparent shadow'
                      : 'bg-black-700 text-white border-black-500 hover:bg-black-700/80'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {!form.medication && (
              <p className="mt-2 text-xs text-white/50">
                예 / 아니오 중 하나를 선택하세요.
              </p>
            )}
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
                name="password"
                type={showPw ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
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

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPw"
              className="block text-sm mb-2 text-white-500"
            >
              비밀번호 확인
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white-600">
                <RiLock2Line className="w-5 h-5" />
              </span>
              <input
                id="confirmPw"
                name="confirmPw"
                type={showConfirmPw ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={form.confirmPw}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl bg-black-700 border border-white/10 pl-10 pr-10 py-3 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 placeholder:text-white/30"
              />
              <button
                type="button"
                aria-label={showConfirmPw ? '비밀번호 숨기기' : '비밀번호 표시'}
                onClick={() => setShowConfirmPw(v => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white-600 hover:text-white-400"
              >
                {showConfirmPw ? (
                  <IoEyeOffOutline className="w-5 h-5" />
                ) : (
                  <IoEyeOutline className="w-5 h-5" />
                )}
              </button>
            </div>
            {form.confirmPw && form.confirmPw !== form.password && (
              <p className="mt-1 text-xs text-red-400">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!valid || isLoading}
            className="mt-3 w-full py-4 rounded-xl bg-primary-500 text-black font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '가입 중…' : '회원가입'}
          </button>

          {/* Navigate to login */}
          <p className="text-sm text-white-500 mt-6 text-center">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="text-primary-500 hover:underline"
            >
              로그인
            </button>
          </p>
        </form>
      </main>
    </div>
  )
}
