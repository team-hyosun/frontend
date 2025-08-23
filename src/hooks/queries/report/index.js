import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

import { authenticated } from '../../../libs/api'

// 최근 7일 리포트 가져오기
export function useWeeklyReport(options = {}) {
  return useQuery({
    queryKey: ['weeklyReport'],
    queryFn: async () => {
      const { data } = await authenticated.get('/report')
      console.log('API /report raw response:', data)
      return Array.isArray(data?.payload) ? data.payload : data?.payload // payload 배열만 반환
    },
    staleTime: 60 * 1000,
    ...options,
  })
}

// 월간 보고서 (PDF 다운로드)
export function useMonthlyReport() {
  return useMutation({
    mutationFn: async ({ startDate, endDate }) => {
      const response = await authenticated.get('/month-report', {
        params: { startDate, endDate },
        responseType: 'blob',
      })
      return response.data
    },
  })
}
