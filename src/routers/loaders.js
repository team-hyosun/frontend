import { redirect } from 'react-router-dom'

import { nonAuthenticated } from '@/libs/api'
import { clearAT, getAT, setAT } from '@/libs/sessionStore'
import { useVideoStore } from '@/stores/videoStore'
import { devLog } from '@/utils/logger'

export async function videoPreviewLoader() {
  const { file } = useVideoStore.getState()
  if (!file) throw redirect('/video')
  return null
}

export async function rootLoader({ request }) {
  // 로그인/회원가입 경로에선 스킵
  const url = new URL(request.url)
  if (url.pathname.startsWith('/auth')) {
    devLog('skip refresh on auth page')
    return null
  }
  // 로그인 유지 확인
  const remember = localStorage.getItem('remember') === '1'
  if (!remember) {
    clearAT()
    devLog('remember=false → clear AT and skip')
    return null
  }

  try {
    devLog('try refresh…')
    // RR가 넘겨주는 request.signal을 axios에 그대로 전달
    const res = await nonAuthenticated.post(
      '/auth/reissue',
      null,
      { signal: request.signal } // ★
    )
    devLog('refresh response:', res.status, res.data)
    // const at = res?.data?.payload?.accessToken
    const at = res?.data?.accessToken
    if (at) setAT(at)
  } catch {
    // 토큰 재발급 실패
    clearAT()
    console.debug('토큰 재발급 실패')
    localStorage.setItem('remember', '0')
  }
  return null
}

export async function guardLoader({ request }) {
  if (getAT()) return null

  const remember = localStorage.getItem('remember') === '1'
  devLog('remember=', remember, 'path=', new URL(request.url).pathname)

  if (remember) {
    try {
      const res = await nonAuthenticated.post('/auth/reissue', null, {
        signal: request.signal,
      })
      const at = res?.data?.payload?.accessToken
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
