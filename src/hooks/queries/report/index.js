import { useQuery } from '@tanstack/react-query'

import { authenticated } from '../../../libs/api'

// 최근 7일 리포트 가져오기
export function useWeeklyReport(options = {}) {
  return useQuery({
    queryKey: ['weeklyReport'],
    queryFn: async () => {
      const { data } = await authenticated.get('/report')
      return data.payload || [] // payload 배열만 반환
    },
    staleTime: 60 * 1000,
    ...options,
  })
}
