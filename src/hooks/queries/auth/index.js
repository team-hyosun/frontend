import { useQueryClient } from '@tanstack/react-query'

import { clearAT, setAT } from '@/libs/sessionStore'

import { useApiMutation, useApiQuery } from '../common'

export function useLoginMutation() {
  return useApiMutation(
    '/auth/login',
    'post',
    {
      onSuccess: data => {
        const at = data?.payload?.accessToken
        if (at) setAT(at)
      },
    },
    false // 인증 불필요
  )
}
export function useLogoutMutation() {
  const qc = useQueryClient()
  return useApiMutation(
    '/auth/logout',
    'post',
    {
      onSuccess: () => {
        // RT 쿠키는 서버가 만료, 클라 쪽은 AT/캐시 정리
        clearAT()
        qc.clear() // 민감 캐시 비우기
      },
      onError: () => {
        // 네트워크 에러여도 클라 AT는 지움 (안전상)
        clearAT()
        qc.clear()
      },
    },
    false // ← 비인증
  )
}

export function useSignupMutation() {
  return useApiMutation(
    '/auth/join',
    'post',
    {},
    false // 인증 불필요
  )
}
export function useUserMeQuery() {
  return useApiQuery(
    ['user', 'me'],
    '/user/me',
    {
      select: data => data?.payload,
      retry: false, // 인증 실패시 재시도 막기
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    true // requireAuth
  )
}
