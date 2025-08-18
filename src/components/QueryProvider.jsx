import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 10, // 10분 (캐시 제거되)
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default QueryProvider
