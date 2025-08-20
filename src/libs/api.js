import axios from 'axios'

import { getCookie, setCookie } from '@/libs/cookies'

// const BASE_URL = `${import.meta.env.VITE_BASE_URL}/api`
export const BASE_URL = import.meta.env.VITE_BASE_URL || ''

// 인증 불필요
export const nonAuthenticated = axios.create({
  baseURL: BASE_URL,
})

// 인증 필요
export const authenticated = axios.create({
  baseURL: BASE_URL,
})

// 요청 인터셉터: 토큰 추가
authenticated.interceptors.request.use(config => {
  // const accessToken = getCookie('ACCESS_TOKEN')
  const accessToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJra2siLCJleHAiOjE3NTY4MTM4NTh9.62oQAmzOk_uuUQMYCo6eFkmGNDbCzYIe9osEyf9ZgGg'
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// 응답 인터셉터: 토큰 갱신
authenticated.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true

      try {
        // 리프레쉬 토큰
        const response = await nonAuthenticated.post('/auth/reissue')
        const newToken = response.data.accessToken
        setCookie('ACCESS_TOKEN', newToken)

        error.config.headers.Authorization = `Bearer ${newToken}`
        return authenticated.request(error.config)
      } catch {
        window.location.href = '/user/login'
      }
    }
    return Promise.reject(error)
  }
)
