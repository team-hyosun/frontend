import {
  ENDPOINT_CAN_SUBMIT_TODAY,
  QUERY_KEY_CAN_SUBMIT_TODAY,
} from '@/constant/queryKeys'

import { apiQueryFn, useApiQuery } from './common'

export const fetchSubmitToday = () =>
  apiQueryFn(ENDPOINT_CAN_SUBMIT_TODAY, true)().then(d => d?.payload === true)

/**
 * 오늘 영상 등록 가능 여부 조회
 * @returns {boolean} true면 등록 가능, false면 이미 등록됨
 */
export const useTodaySubmission = () => {
  return useApiQuery(QUERY_KEY_CAN_SUBMIT_TODAY, fetchSubmitToday, {
    suspense: true,
    staleTime: 1000 * 60 * 60 * 2,
  })
}
