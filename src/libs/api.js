import axios from 'axios'

import { devLog } from '@/utils/logger'

import { clearAT, getAT, setAT } from './sessionStore'

// const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`
export const BASE_URL = import.meta.env.VITE_BASE_URL || ''

// 인증 불필요
export const nonAuthenticated = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // HttpOnly
})

// 인증 필요
export const authenticated = axios.create({
  baseURL: BASE_URL,
})

// 요청 인터셉터: 토큰 추가
authenticated.interceptors.request.use(config => {
  const accessToken = getAT('ACCESS_TOKEN')
  // const accessToken =
  //   'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJra2siLCJleHAiOjE3NTY4MTM4NTh9.62oQAmzOk_uuUQMYCo6eFkmGNDbCzYIe9osEyf9ZgGg'
  if (accessToken) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 동시 401에 대한 단일 비행 락
let refreshing = null
const waiters = []
function enqueueWaiter() {
  return new Promise((resolve, reject) => waiters.push({ resolve, reject }))
}
function flushWaiters(ok, val) {
  waiters.splice(0).forEach(w => (ok ? w.resolve(val) : w.reject(val)))
}

// 응답 인터셉터: 토큰 갱신
authenticated.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error
    const status = response?.status
    const original = config

    if (status !== 401 || config.__retry) throw error

    // remember OFF면 refresh 하지 않고 로그인 페이지로
    const remember = localStorage.getItem('remember') === '1'
    devLog('401 intercepted, remember=', remember)

    if (!remember) {
      clearAT?.()
      devLog('no remember → clearAT only')
      // window.location.href = '/auth/login'
      return Promise.reject(error)
    }

    // 여기서부터는 remember=true 인 경우만
    original.__retry = true

    try {
      if (!refreshing) {
        // 리프레쉬 토큰 재발급
        refreshing = nonAuthenticated
          .post('/auth/reissue') // 락 걸림
          .then(res => {
            const newAT = res?.data?.accessToken
            devLog('refresh result=', newAT ? 'success' : 'fail')

            if (!newAT) throw new Error('No accessToken in reissue')
            setAT(newAT) // 세션스토리지 저장
            flushWaiters(true, newAT) // 대기 중 요청 깨우기
            return newAT
          })
          .catch(e => {
            flushWaiters(false, e)
            throw e
          })
          .finally(() => {
            refreshing = null
          })
      }

      // 이미 다른 요청이 리프레시 중이면 결과를 공유
      const newToken = await (refreshing || enqueueWaiter())

      // 새 토큰으로 원래 요청 재전송
      original.headers = original.headers || {}
      original.headers.Authorization = `Bearer ${newToken}`
      return authenticated.request(original)
    } catch {
      // 재발급 실패 → 세션 정리
      devLog('refresh failed')
      // window.location.href = '/auth/login'
      return Promise.reject(error)
    }
  }
)
