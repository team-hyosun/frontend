import { useQuery, useMutation } from '@tanstack/react-query'
import { authenticated, nonAuthenticated } from '@/libs/api'

/**
 * 범용 조회 훅
 * @param {string|Array} queryKey - 쿼리 키
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - React Query 옵션
 * @param {boolean} requireAuth - 인증 필요 여부 (기본: true)
 */
export const useApiQuery = (queryKey, endpoint, options = {}, requireAuth = true) => {
  const api = requireAuth ? authenticated : nonAuthenticated
  
  return useQuery({
    queryKey,
    queryFn: () => api.get(endpoint).then(res => res.data),
    ...options,
  })
}

/**
 * 범용 변경 훅 (POST, PUT, DELETE)
 * @param {string} endpoint - API 엔드포인트
 * @param {string} method - HTTP 메서드 (기본: 'post')
 * @param {Object} options - React Query 옵션
 * @param {boolean} requireAuth - 인증 필요 여부 (기본: true)
 */
export const useApiMutation = (endpoint, method = 'post', options = {}, requireAuth = true) => {
  const api = requireAuth ? authenticated : nonAuthenticated
  
  return useMutation({
    mutationFn: (data) => api[method](endpoint, data).then(res => res.data),
    ...options,
  })
}