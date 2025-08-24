// src/routers/loaders.js
import { redirect } from 'react-router-dom'

import { nonAuthenticated } from '@/libs/api'
import { clearAT, getAT, setAT } from '@/libs/sessionStore'
import { useVideoStore } from '@/stores/videoStore'
import { devLog } from '@/utils/logger'

/**
 * Vitest/SSR(Node) 환경에서 AbortSignal 타입 충돌을 피하기 위한 가드.
 * - 브라우저 실행: 원래 signal 그대로 사용
 * - 테스트/SSR: signal 전달하지 않음 (axios/undici AbortSignal 불일치 방지)
 */
function safeAxiosSignal(sig) {
  const isSSR = typeof window === 'undefined'
  const isVitest =
    (typeof process !== 'undefined' && process.env?.VITEST) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'test')

  if (isSSR || isVitest) return undefined
  return sig
}

/**
 * /video/preview 진입 전 업로드 파일 존재 확인
 * 업로드 파일 없으면 업로드 화면으로 되돌림
 */
export async function videoPreviewLoader() {
  const { file } = useVideoStore.getState()
  if (!file) throw redirect('/video')
  return null
}

/**
 * 루트 로더
 * - /auth/* 경로는 리프레시 스킵
 * - remember=1 인 경우에만 1회 토큰 재발급 시도
 */
export async function rootLoader({ request }) {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/auth')) {
    devLog('skip refresh on auth page')
    return null
  }

  const remember = localStorage.getItem('remember') === '1'
  if (!remember) {
    clearAT()
    devLog('remember=false → clear AT and skip')
    return null
  }

  try {
    devLog('try refresh…')
    const res = await nonAuthenticated.post('/auth/reissue', null, {
      signal: safeAxiosSignal(request.signal),
    })
    devLog('refresh response:', res?.status, res?.data)
    // 서버 응답 포맷 양쪽 지원
    const at = res?.data?.payload?.accessToken ?? res?.data?.accessToken ?? null
    if (at) setAT(at)
  } catch (e) {
    // 재발급 실패 시 세션 정리 + remember 끔
    clearAT()
    devLog('토큰 재발급 실패', e?.response?.status)
    localStorage.setItem('remember', '0')
  }
  return null
}

/**
 * 보호 라우트 가드
 * - AT 있으면 통과
 * - 없고 remember=1 이면 재발급 시도 → 성공 시 통과, 실패 시 로그인으로
 * - 그 외에는 로그인으로
 */
export async function guardLoader({ request }) {
  if (getAT()) return null

  const remember = localStorage.getItem('remember') === '1'
  devLog('remember=', remember, 'path=', new URL(request.url).pathname)

  if (remember) {
    try {
      const res = await nonAuthenticated.post('/auth/reissue', null, {
        signal: safeAxiosSignal(request.signal),
      })
      const at =
        res?.data?.payload?.accessToken ?? res?.data?.accessToken ?? null
      if (at) {
        setAT(at)
        devLog('refresh ok')
        return null
      }
    } catch (e) {
      devLog('refresh fail', e?.response?.status)
    }
  }

  clearAT()
  throw redirect('/auth/login')
}
