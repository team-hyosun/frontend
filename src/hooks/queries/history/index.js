import { useQuery } from '@tanstack/react-query'

import { authenticated } from '../../../libs/api'

// 월별 걷기/복약 기록 조회
export function useHistoryByMonth(year, month, options) {
  return useQuery({
    queryKey: ['history', year, month],
    queryFn: async () => {
      const { data } = await authenticated.get('/history', {
        params: { year, month },
      })

      console.log('/history 원본 응답:', data)
      const { payload } = data || {}
      if (!payload) {
        console.warn('payload 없음')
        return {}
      }

      const map = {}
      ;(payload.days || []).forEach(item => {
        const dateStr = `${payload.year}-${String(payload.month).padStart(2, '0')}-${String(item.day).padStart(2, '0')}`
        map[dateStr] = {
          gaitVideo: !!item.walkingRecord,
          medication: !!item.medicationRecord,
        }
      })
      console.log('변환된 데이터 map:', map)
      return map
    },
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    ...(options || {}),
  })
}
