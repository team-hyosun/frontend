import { useCallback, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'

import {
  ENDPOINT_CAN_SUBMIT_TODAY,
  ENDPOINT_VIDEO_UPLOAD,
  QUERY_KEY_CAN_SUBMIT_TODAY,
  QUERY_KEY_TODAY_RESULT,
} from '@/constant/queryKeys'
import { setSessionResult } from '@/libs/sessionStore'
import { clearVideoTemp, loadVideoTemp } from '@/libs/videoTempStore'
import { useVideoStore } from '@/stores/videoStore'

import { apiQueryFn, useApiMutation, useApiQuery } from './common'

/**
 * 오늘 영상 등록 가능 여부 조회
 * @returns {boolean} true면 등록 가능, false면 이미 등록됨
 */
export const useTodaySubmission = () => {
  return useApiQuery(
    QUERY_KEY_CAN_SUBMIT_TODAY,
    () =>
      apiQueryFn(ENDPOINT_CAN_SUBMIT_TODAY, true)().then(
        d => d?.payload === true
      ),
    {
      suspense: true,
      staleTime: 1000 * 60 * 60 * 2,
    }
  )
}
/**
 * 보행영상을 업로드 훅.
 *
 * 사용자로부터 선택된 보행 영상 파일을 서버 업로드,
 * 업로드 성공 또는 실패에 따라 적절한 페이지로 리디렉션
 *
 * @returns {{
 * start: () => Promise<void>
 * }} 업로드 프로세스를 시작하는 `start` 함수 리턴
 */

export function useUploadWalkingVideo() {
  const navigate = useNavigate()
  const file = useVideoStore(s => s.file)
  const clearVideoState = useVideoStore(s => s.clear)
  const startedRef = useRef(false)

  const date = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const { mutateAsync } = useApiMutation(ENDPOINT_VIDEO_UPLOAD(date), 'post')

  const queryClient = useQueryClient()

  const start = useCallback(async () => {
    if (startedRef.current) return
    startedRef.current = true
    // 1) 파일 소스: zustand -> IDB
    let fileObj = file ?? (await loadVideoTemp())
    if (!fileObj) {
      alert('업로드할 영상 파일이 없습니다.')
      navigate('/video/preview', { replace: true })
      startedRef.current = false
      return
    }

    // 2) 업로드
    const fd = new FormData()
    fd.append('uploadVideo', fileObj, fileObj.name || 'upload.mp4')

    try {
      console.debug('[PENDING] upload start', ENDPOINT_VIDEO_UPLOAD(date))
      const data = await mutateAsync(fd)
      console.debug('[PENDING] upload done', data)

      const payload = data?.payload ?? data?.data ?? data ?? null
      const id = payload?.walkingRecordId ?? payload?.id
      if (!id) {
        alert('응답에 결과 ID가 없습니다.')
        navigate('/video/preview', { replace: true })
        startedRef.current = false
        return
      }
      // ✅ 업로드 성공 → React Query 캐시에도 저장 (세션스토리지와 이중화)
      queryClient.setQueryData([...QUERY_KEY_TODAY_RESULT, String(id)], payload)
      setSessionResult(id, payload) //  세션 스토리지 저장

      // 3) 즉시 라우팅 (UX 빠르게)
      console.debug('[PENDING] navigating →', `/video/result/${id}`)
      navigate(`/video/result/${id}`, { replace: true })

      // 4) 정리 작업은 비동기로 뒤에서
      setTimeout(async () => {
        try {
          await clearVideoTemp()
        } catch {}
        try {
          clearVideoState?.()
        } catch {}
      }, 0)
    } catch (e) {
      console.error('[PENDING] upload error', e)
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        '업로드 중 오류가 발생했습니다.'
      alert(msg)
      navigate('/video/preview', { replace: true })
    }
    // finally {
    //   // 재시도 가능하도록 훅 생명주기 내에서 플래그 되돌려 둠
    //   startedRef.current = false
    // }
  }, [file, mutateAsync, navigate, clearVideoState, date])

  return { start }
}
