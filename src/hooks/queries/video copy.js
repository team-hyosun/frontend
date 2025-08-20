// import { useCallback, useMemo, useRef } from 'react'
// import { useNavigate } from 'react-router-dom'

// import {
//   ENDPOINT_CAN_SUBMIT_TODAY,
//   ENDPOINT_VIDEO_UPLOAD,
//   QUERY_KEY_CAN_SUBMIT_TODAY,
// } from '@/constant/queryKeys'
// import { setSessionResult } from '@/libs/sessionStore'
// import { clearVideoTemp, loadVideoTemp } from '@/libs/videoTempStore'
// import { useVideoStore } from '@/stores/videoStore'

// import { apiQueryFn, useApiMutation, useApiQuery } from './common'

// /**
//  * 오늘 영상 등록 가능 여부 조회
//  * @returns {boolean} true면 등록 가능, false면 이미 등록됨
//  */
// export const useTodaySubmission = () => {
//   return useApiQuery(
//     QUERY_KEY_CAN_SUBMIT_TODAY,
//     () =>
//       apiQueryFn(ENDPOINT_CAN_SUBMIT_TODAY, true)().then(
//         d => d?.payload === true
//       ),
//     {
//       suspense: true,
//       staleTime: 1000 * 60 * 60 * 2,
//     }
//   )
// }
// /**
//  * 영상 업로드 하기
//  *
//  */
// export function useUploadWalkingVideo() {
//   const navigate = useNavigate()
//   const file = useVideoStore(s => s.file)
//   const clearVideoState = useVideoStore(s => s.clear)
//   const startedRef = useRef(false)

//   const date = useMemo(() => new Date().toISOString().slice(0, 10), [])
//   const { mutateAsync } = useApiMutation(ENDPOINT_VIDEO_UPLOAD(date), 'post')

//   const start = useCallback(async () => {
//     if (startedRef.current) return
//     startedRef.current = true

//     let fileObj = file ?? (await loadVideoTemp())
//     if (!fileObj) {
//       alert('업로드할 영상 파일이 없습니다.')
//       navigate('/video/preview', { replace: true })
//       return
//     }

//     const fd = new FormData()
//     fd.append('uploadVideo', fileObj, fileObj.name || 'upload.mp4')

//     try {
//       console.debug('[PENDING] upload start', ENDPOINT_VIDEO_UPLOAD(date))
//       const data = await mutateAsync(fd) // ← 여기서 MSW delay만큼 대기
//       console.debug('[PENDING] upload done', data)

//       const payload = data?.payload || data?.data || data || null
//       const id = payload?.walkingRecordId || payload?.id
//       if (!id) {
//         alert('응답에 결과 ID가 없습니다.')
//         navigate('/video/preview', { replace: true })
//         return
//       }

//       setSessionResult(id, payload) // 세션 저장 (동기)
//       await clearVideoTemp() // IDB 삭제
//       clearVideoState?.() // Zustand 초기화

//       console.debug('[PENDING] navigating →', `/video/result/${id}`)
//       navigate(`/video/result/${id}`, { replace: true })
//     } catch (e) {
//       console.error('[PENDING] upload error', e)
//       const msg =
//         e?.response?.data?.message ||
//         e?.message ||
//         '업로드 중 오류가 발생했습니다.'
//       alert(msg)
//       navigate('/video/preview', { replace: true })
//     }
//   }, [file, mutateAsync, navigate, clearVideoState, date])
//   return { start }
// }
